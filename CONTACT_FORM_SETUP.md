# Contact Form Setup Guide

## Overview
Your contact form is now fully implemented with:
- ✅ EmailJS integration for email delivery
- ✅ Google reCAPTCHA v2 for bot protection
- ✅ Advanced rate limiting with browser fingerprinting
- ✅ Cosmic glassmorphic email templates
- ✅ Auto-reply functionality

## Rate Limiting System

### How It Works
1. **Browser Fingerprinting**: Creates a unique SHA256 hash from:
   - Canvas fingerprint
   - User agent
   - Screen resolution
   - Timezone
   - Language
   - Platform
   - Hardware concurrency

2. **Storage**: Tracks submissions using:
   - localStorage (`contact_form_data`)
   - Cookies (`cf_submissions`)
   
3. **Limits**:
   - 3 submissions per hour per device
   - 24-hour cooldown after exceeding limit
   - Automatic cleanup of expired records

### Testing Rate Limiting
1. Submit form 3 times quickly
2. On 4th attempt, you should see: "Rate limit exceeded. You can submit again in X minutes."
3. Wait 1 hour or clear data using browser console:
   ```javascript
   localStorage.removeItem('contact_form_data');
   document.cookie = 'cf_submissions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
   ```

## Required Setup Steps

### Step 1: Get EmailJS Public Key
1. Go to https://dashboard.emailjs.com/admin/account
2. Copy your **Public Key** (should look like: `user_xxxxxxxxxxxxx`)
3. Create `.env` file in project root:
   ```env
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

### Step 2: Configure Email Templates in EmailJS Dashboard

#### Template 1: Contact Notification (template_lp8dl89)
1. Go to https://dashboard.emailjs.com/admin/templates/template_lp8dl89
2. Delete existing content and paste the HTML from `EMAILJS_TEMPLATE_CONFIG.md` (Template 1)
3. In **Settings** tab:
   - **To Email**: acharyaaayush2k4@gmail.com
   - **From Name**: Portfolio Contact Form
   - **Reply To**: {{email}} (use the sender's email)
4. In **Test** tab, verify template variables:
   - `{{name}}` - Visitor's name
   - `{{email}}` - Visitor's email
   - `{{message}}` - Message content
   - `{{to_name}}` - Your name (Aayush)

#### Template 2: Auto-Reply (template_j7b18c9)
1. Go to https://dashboard.emailjs.com/admin/templates/template_j7b18c9
2. Paste the HTML from `EMAILJS_TEMPLATE_CONFIG.md` (Template 2)
3. In **Settings** tab:
   - **To Email**: {{email}} (visitor's email)
   - **From Name**: Aayush Acharya
   - **Reply To**: acharyaaayush2k4@gmail.com
4. In **Test** tab, verify template variables:
   - `{{name}}` - Visitor's name

### Step 3: Add reCAPTCHA Secret Key to EmailJS
1. Go to https://dashboard.emailjs.com/admin/templates/template_lp8dl89
2. Click **Settings** tab
3. Scroll to **reCAPTCHA** section
4. Paste secret key: `6Ld3dhEsAAAAAFnxM7hv3MJbqR7AKMzDZU3KtGIZ`
5. Save template

### Step 4: (Optional) Link Auto-Reply Template
To automatically send auto-reply when contact notification is sent:
1. Go to https://dashboard.emailjs.com/admin/templates/template_lp8dl89
2. Click **Settings** tab
3. Find **Auto Reply** section
4. Select template: `template_j7b18c9`
5. Save template

## Testing the Complete Flow

### Test 1: Basic Submission
1. Fill out form with valid data
2. Complete reCAPTCHA
3. Click Submit
4. Verify:
   - Success toast shows: "Message sent successfully! (2 submissions remaining this hour)"
   - Email received at acharyaaayush2k4@gmail.com
   - Auto-reply received at submitted email

### Test 2: reCAPTCHA Validation
1. Fill out form
2. Don't complete reCAPTCHA
3. Click Submit
4. Verify: "Please complete the reCAPTCHA verification"

### Test 3: Rate Limiting
1. Submit form 3 times quickly (complete reCAPTCHA each time)
2. After 3rd submission: "2 submissions remaining" → "1 submission remaining" → "0 submissions remaining"
3. Try 4th submission
4. Verify: Rate limit warning appears with countdown timer

### Test 4: Form Validation
1. Leave fields empty
2. Click Submit
3. Verify: HTML5 validation triggers (browser shows "Please fill out this field")

## Troubleshooting

### Emails Not Sending
- Check `.env` has correct `VITE_EMAILJS_PUBLIC_KEY`
- Verify EmailJS service is connected in dashboard
- Check browser console for errors
- Ensure templates are saved in EmailJS dashboard

### reCAPTCHA Not Loading
- Check site key in Contact.tsx: `6Ld3dhEsAAAAAJIuZKskmvtZE8JzBJcGnkJlERW_`
- Verify reCAPTCHA script loads (check Network tab)
- Check for Content Security Policy issues

### Rate Limiting Not Working
- Check browser console for errors from `rateLimit.ts`
- Verify localStorage and cookies are enabled
- Try clearing browser data and retesting

### Auto-Reply Not Working
- Verify template_j7b18c9 is configured in EmailJS
- Check if auto-reply is linked in template_lp8dl89 settings
- Verify `{{email}}` variable is correct in template

## Security Features

### Client-Side Protection
1. **reCAPTCHA v2**: Prevents bot submissions
2. **Rate Limiting**: Prevents spam (3/hour limit)
3. **Browser Fingerprinting**: Tracks device, not just cookies
4. **SHA256 Hashing**: Fingerprint stored as hash for privacy

### Server-Side Protection (EmailJS)
1. **Origin Validation**: EmailJS validates request origin
2. **API Key Protection**: Public key is safe to expose
3. **Template Validation**: Only configured templates can be used
4. **reCAPTCHA Verification**: Secret key validates on server

## Email Template Design

### Visual Features
- **Cosmic Background**: Radial gradient with deep space colors
- **Star Field**: CSS-generated twinkling stars
- **Glassmorphic Cards**: Transparent with backdrop blur
- **Responsive**: Mobile-friendly layout
- **Professional**: No emojis, minimalistic language

### Content Tone
- **Contact Notification**: Professional, informative
- **Auto-Reply**: Friendly but professional, sets expectations

## Configuration Reference

### Hardcoded Values (in Contact.tsx)
```typescript
const serviceId = 'service_wyf2qop';
const templateId = 'template_lp8dl89';
const siteKey = '6Ld3dhEsAAAAAJIuZKskmvtZE8JzBJcGnkJlERW_';
```

### Environment Variables (in .env)
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Rate Limit Configuration (in rateLimit.ts)
```typescript
MAX_ATTEMPTS = 3        // Submissions per hour
WINDOW_MS = 3600000     // 1 hour in milliseconds
COOLDOWN_MS = 86400000  // 24 hours in milliseconds
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all setup steps completed
3. Test individual components (reCAPTCHA, EmailJS, rate limiting)
4. Clear browser data and retry
5. Check EmailJS dashboard for delivery logs

## Next Steps

Once setup is complete:
1. Test all scenarios above
2. Monitor EmailJS usage at https://dashboard.emailjs.com/admin
3. Adjust rate limits if needed in `src/lib/rateLimit.ts`
4. Customize email templates in EmailJS dashboard
5. Consider adding email notifications for rate limit blocks (optional)
