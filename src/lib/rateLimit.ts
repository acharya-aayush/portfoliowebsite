// Rate Limiting Utility for Contact Form
// Tracks submissions using IP hash, localStorage, and cookies

import { sha256 } from 'js-sha256';

const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 3, // Maximum submissions allowed
  WINDOW_MS: 3600000, // Time window: 1 hour in milliseconds
  COOLDOWN_MS: 86400000, // Cooldown after max attempts: 24 hours
  STORAGE_KEY: 'contact_form_data',
  COOKIE_NAME: 'cf_submissions',
};

interface SubmissionRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  ipHash: string;
  blocked: boolean;
  blockedUntil?: number;
}

// Generate IP hash from client-side data (browser fingerprint)
async function generateBrowserFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('fingerprint', 2, 15);
  }
  const canvasData = canvas.toDataURL();
  
  const fingerprint = {
    canvas: canvasData,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
  };
  
  return sha256(JSON.stringify(fingerprint));
}

// Get submission data from localStorage
function getStoredData(fingerprint: string): SubmissionRecord | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY);
    if (!stored) return null;
    
    const data: SubmissionRecord = JSON.parse(stored);
    
    // Verify fingerprint matches
    if (data.ipHash !== fingerprint) return null;
    
    return data;
  } catch {
    return null;
  }
}

// Save submission data to localStorage
function saveStoredData(data: SubmissionRecord): void {
  try {
    localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}

// Get cookie value
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Set cookie
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
}

// Check if user can submit
export async function canSubmit(): Promise<{ allowed: boolean; message?: string; remainingAttempts?: number; waitTime?: number }> {
  const fingerprint = await generateBrowserFingerprint();
  const now = Date.now();
  
  // Check localStorage
  let record = getStoredData(fingerprint);
  
  // Check cookie as backup
  const cookieData = getCookie(RATE_LIMIT_CONFIG.COOKIE_NAME);
  if (cookieData && !record) {
    try {
      record = JSON.parse(decodeURIComponent(cookieData));
    } catch {
      // Invalid cookie, ignore
    }
  }
  
  // No previous submissions
  if (!record) {
    return { allowed: true, remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
  }
  
  // Check if blocked
  if (record.blocked && record.blockedUntil) {
    if (now < record.blockedUntil) {
      const waitMinutes = Math.ceil((record.blockedUntil - now) / 60000);
      return {
        allowed: false,
        message: `Too many submissions. Please try again in ${waitMinutes} minutes.`,
        waitTime: record.blockedUntil - now,
      };
    } else {
      // Cooldown expired, reset
      record = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        ipHash: fingerprint,
        blocked: false,
      };
      saveStoredData(record);
      setCookie(RATE_LIMIT_CONFIG.COOKIE_NAME, encodeURIComponent(JSON.stringify(record)), 1);
      return { allowed: true, remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
    }
  }
  
  // Check if window has expired
  if (now - record.firstAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
    // Reset counter
    record = {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      ipHash: fingerprint,
      blocked: false,
    };
    saveStoredData(record);
    setCookie(RATE_LIMIT_CONFIG.COOKIE_NAME, encodeURIComponent(JSON.stringify(record)), 1);
    return { allowed: true, remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
  }
  
  // Check if max attempts reached
  if (record.count >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    const blockedUntil = record.lastAttempt + RATE_LIMIT_CONFIG.COOLDOWN_MS;
    record.blocked = true;
    record.blockedUntil = blockedUntil;
    saveStoredData(record);
    setCookie(RATE_LIMIT_CONFIG.COOKIE_NAME, encodeURIComponent(JSON.stringify(record)), 1);
    
    const waitMinutes = Math.ceil((blockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Maximum submissions (${RATE_LIMIT_CONFIG.MAX_ATTEMPTS}) reached. Please try again in ${waitMinutes} minutes.`,
      waitTime: blockedUntil - now,
    };
  }
  
  // Can submit
  const remaining = RATE_LIMIT_CONFIG.MAX_ATTEMPTS - record.count;
  return {
    allowed: true,
    remainingAttempts: remaining,
  };
}

// Record a submission
export async function recordSubmission(): Promise<void> {
  const fingerprint = await generateBrowserFingerprint();
  const now = Date.now();
  
  let record = getStoredData(fingerprint);
  
  if (!record || now - record.firstAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
    record = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      ipHash: fingerprint,
      blocked: false,
    };
  } else {
    record.count += 1;
    record.lastAttempt = now;
    
    if (record.count >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
      record.blocked = true;
      record.blockedUntil = now + RATE_LIMIT_CONFIG.COOLDOWN_MS;
    }
  }
  
  saveStoredData(record);
  setCookie(RATE_LIMIT_CONFIG.COOKIE_NAME, encodeURIComponent(JSON.stringify(record)), 1);
}

// Get remaining attempts
export async function getRemainingAttempts(): Promise<number> {
  const result = await canSubmit();
  return result.remainingAttempts || 0;
}

// Clear rate limit data (for testing)
export function clearRateLimitData(): void {
  localStorage.removeItem(RATE_LIMIT_CONFIG.STORAGE_KEY);
  document.cookie = `${RATE_LIMIT_CONFIG.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
