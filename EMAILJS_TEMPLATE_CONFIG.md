# EmailJS Template Configuration Guide

## Understanding Template Types

**Contact Us** = Main notification template (sends TO YOU when someone contacts you)
**Auto-Reply** = Automatic response template (sends TO VISITOR after they submit)
**Welcome** = Not needed for portfolio contact form
**Feedback Request** = Not needed for portfolio contact form

---

## Template 1: Contact Us (Main Notification - TO YOU)

**Purpose:** This is the email YOU receive when someone fills your contact form

**Template Name:** `Contact Us`  
**Template ID:** `template_ugf4uip` (your existing template)

### Settings:
- **To Email:** `acharyaaayush2k4@gmail.com` (your email)
- **From Name:** `Portfolio Contact Form`
- **Reply To:** `{{from_email}}` (so you can reply directly to visitor)

### Subject:
```
New Message: {{subject}}
```

### Content (HTML) - Cosmic Glassmorphic:
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 0; background: radial-gradient(ellipse at top, #0f1729 0%, #050a14 50%, #000000 100%); position: relative;">
  
  <!-- Cosmic Stars Background -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(1px 1px at 33% 80%, white, transparent); background-size: 200% 200%; opacity: 0.5;"></div>
  
  <!-- Content Container -->
  <div style="position: relative; padding: 40px 20px;">
    
    <!-- Main Glassmorphic Card -->
    <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05);">
      
      <!-- Header -->
      <div style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: rgba(255, 255, 255, 0.95); letter-spacing: -0.3px;">
          {{subject}}
        </h1>
        <p style="margin: 0; font-size: 12px; color: rgba(212, 175, 55, 0.7); text-transform: uppercase; letter-spacing: 1.2px; font-weight: 500;">
          New Contact
        </p>
      </div>
      
      <!-- Contact Info -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.8px;">Name</p>
              <p style="margin: 4px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">{{from_name}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0;">
              <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.8px;">Email</p>
              <p style="margin: 4px 0 0 0;">
                <a href="mailto:{{from_email}}" style="font-size: 15px; color: #D4AF37; text-decoration: none;">{{from_email}}</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Message -->
      <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.8px;">Message</p>
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.85); white-space: pre-wrap;">{{message}}</p>
      </div>
      
      <!-- Action Button -->
      <a href="mailto:{{from_email}}?subject=Re: {{subject}}" style="display: inline-block; width: 100%; text-align: center; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.3); color: #D4AF37; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 500; font-size: 14px; letter-spacing: 0.3px; transition: all 0.3s;">
        Reply
      </a>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 20px;">
      <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.2); letter-spacing: 0.5px;">
        Portfolio Contact Form
      </p>
    </div>
    
  </div>
  
</div>
```

---

## Template 2: Auto-Reply (Automatic Response - TO VISITOR)

**Purpose:** This is sent TO THE VISITOR immediately after they submit the form

**Service ID:** `service_wyf2qop` (use existing)

**Template Name:** Contact Form Auto-Reply

### Settings:
- **To Email:** `{{from_email}}` (sends to the person who filled the form)
- **From Name:** Aayush Acharya
- **From Email:** `acharyaaayush2k4@gmail.com` (or use EmailJS default)
- **Reply To:** `acharyaaayush2k4@gmail.com`

### Subject:
```
Thanks for reaching out!
```

### Content (HTML):
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: radial-gradient(ellipse at bottom, #0f1729 0%, #050a14 50%, #000000 100%); position: relative;">
  
  <!-- Cosmic Stars Background -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(1px 1px at 25% 40%, white, transparent), radial-gradient(1px 1px at 75% 20%, white, transparent), radial-gradient(2px 2px at 50% 60%, white, transparent), radial-gradient(1px 1px at 80% 80%, white, transparent), radial-gradient(1px 1px at 15% 75%, white, transparent); background-size: 200% 200%; opacity: 0.6;"></div>
  
  <!-- Content Container -->
  <div style="position: relative; padding: 40px 20px;">
    
    <!-- Main Glassmorphic Card -->
    <div style="background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06);">
      
      <!-- Header -->
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 600; color: rgba(255, 255, 255, 0.95); letter-spacing: -0.4px;">
          Hello, {{from_name}}
        </h2>
        <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #D4AF37 0%, transparent 100%);"></div>
      </div>
      
      <!-- Main Content -->
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.85);">
          Thank you for reaching out. Your message has been received and I will respond within 24 to 48 hours.
        </p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.6);">
          Feel free to explore my portfolio or connect with me on social media in the meantime.
        </p>
      </div>
      
      <!-- Message Reference -->
      <div style="background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.05); border-left: 3px solid rgba(212, 175, 55, 0.6); border-radius: 10px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-size: 11px; color: rgba(212, 175, 55, 0.7); text-transform: uppercase; letter-spacing: 0.8px;">Your Message</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.75); white-space: pre-wrap;">{{message}}</p>
      </div>
      
      <!-- Signature -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">
          Best regards,
        </p>
        <p style="margin: 0 0 4px 0; font-size: 17px; font-weight: 600; color: #D4AF37; letter-spacing: -0.2px;">
          Aayush Acharya
        </p>
        <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.35);">
          Full Stack Developer
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 20px;">
      <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.2); letter-spacing: 0.5px;">
        Automated response • Personal reply coming soon
      </p>
    </div>
    
  </div>
  
</div>
```

---

## 🔐 Google reCAPTCHA v2 Setup Guide

### Why Add reCAPTCHA?
- Prevents spam bot submissions
- Protects your free tier quota (200 emails/month)
- Industry best practice for public forms

### Step 1: Get reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click "+" to create new site
3. Fill in:
   - **Label:** Portfolio Contact Form
   - **reCAPTCHA type:** ✅ reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains:** 
     - `localhost` (for testing)
     - `yourdomain.com` (your actual domain)
     - `127.0.0.1` (optional)
4. Accept terms → Submit
5. You'll get TWO keys:
   - **Site Key** (public - goes in frontend)
   - **Secret Key** (private - goes in EmailJS)

### Step 2: Configure in EmailJS Dashboard

**Your Template Settings (template_ugf4uip):**

1. **Do not save private data:** ❌ Leave OFF (you want to see contacts in History)

2. **Allow unsubscribing:** ❌ Leave OFF (not needed for contact forms)

3. **Enable reCAPTCHA V2 verification:** ✅ Turn ON
   - Paste your **Secret Key** in the field
   - Save

4. **Enable Google Analytics:** ❌ Leave OFF (unless you want email open tracking)

5. **Save Contacts:** ✅ Turn ON (recommended)
   - **Contact Email:** `{{from_email}}`
   - **Contact Name:** `{{from_name}}`
   - Leave Address and Phone empty

6. **Linked Template (Auto-Reply):** ✅ Enable if you want auto-reply
   - Select your Auto-Reply template
   - This sends automatic confirmation to visitor
   - ⚠️ Uses 2 emails per submission (affects quota)

### Step 3: Add reCAPTCHA to Your Frontend

Update your `.env`:
```env
VITE_EMAILJS_SERVICE_ID=service_wyf2qop
VITE_EMAILJS_TEMPLATE_ID=template_ugf4uip
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

Update `Contact.tsx`:

```typescript
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Add to component
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
const recaptchaRef = useRef<any>(null);

// Load reCAPTCHA script
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  
  // Expose callback globally
  (window as any).onRecaptchaSuccess = (token: string) => {
    setRecaptchaToken(token);
  };
  
  return () => {
    document.body.removeChild(script);
  };
}, []);

// Update onSubmit
const onSubmit = async (data: ContactFormData) => {
  if (!recaptchaToken) {
    toast({
      title: "Verification Required",
      description: "Please complete the reCAPTCHA verification.",
      variant: "destructive",
    });
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        'g-recaptcha-response': recaptchaToken, // Important!
      },
      publicKey
    );
    
    toast({ title: "Message sent successfully!" });
    reset();
    setRecaptchaToken(null);
    // Reset reCAPTCHA
    if ((window as any).grecaptcha) {
      (window as any).grecaptcha.reset();
    }
  } catch (error) {
    toast({ title: "Failed to send", variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};
```

Add reCAPTCHA widget in your form JSX (before submit button):
```tsx
<div className="g-recaptcha" 
     data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
     data-callback="onRecaptchaSuccess"
     data-theme="dark">
</div>
```

### Step 4: Test Everything

1. Fill out contact form
2. Complete reCAPTCHA
3. Submit
4. Check:
   - ✅ Email received in your inbox
   - ✅ Auto-reply sent to visitor (if enabled)
   - ✅ Contact saved in EmailJS dashboard
   - ✅ No console errors

---

## 📋 Complete Template Configuration Checklist

### For Template: Contact Us (template_ugf4uip)

```
Template Settings:
☐ Name: Contact Us
☐ To Email: acharyaaayush2k4@gmail.com
☐ Reply To: {{from_email}}
☐ Subject: New Message: {{subject}}
☐ Content: Glassmorphic HTML template (see above)

Advanced Settings:
☐ Do not save private data: OFF
☐ Allow unsubscribing: OFF
☐ Enable reCAPTCHA V2: ON (paste Secret Key)
☐ Enable Google Analytics: OFF

Save Contacts:
☐ Contact Email: {{from_email}}
☐ Contact Name: {{from_name}}

Linked Template (optional):
☐ Select Auto-Reply template if you want automatic responses
☐ Note: Uses 2x quota (100 submissions = 200 emails)
```

### For Template: Auto-Reply (create new)

```
Template Settings:
☐ Name: Auto-Reply
☐ To Email: {{from_email}} ← sends to visitor
☐ From Name: Aayush Acharya
☐ Reply To: acharyaaayush2k4@gmail.com
☐ Subject: Thanks for reaching out!
☐ Content: Glassmorphic auto-reply HTML (see above)

Advanced Settings:
☐ All OFF (main template handles reCAPTCHA)
```

---

## 🎯 Recommended Setup

**For Best Results:**
1. ✅ Use Contact Us template with reCAPTCHA
2. ✅ Enable "Save Contacts" 
3. ⚠️ **Consider NOT using auto-reply** (more professional to reply manually)
4. ✅ Keep "Do not save private data" OFF (you want history)

**If You Want Auto-Reply:**
- Link the Auto-Reply template in "Linked Template" section
- Be aware: 200 free emails = 100 contact submissions
- Alternative: Reply personally (more genuine)

---

## How to Set Up Both Templates

### Step 1: Create Main Template (To You)
1. EmailJS Dashboard → Email Templates → Create New Template
2. Copy Template 1 configuration above
3. **Important:** Set Reply To = `{{from_email}}` so you can reply directly
4. Save and copy the Template ID

### Step 2: Create Auto-Reply Template (To Visitor)
1. Create another new template
2. Copy Template 2 configuration above
3. **Important:** Set To Email = `{{from_email}}` (this sends to the visitor)
4. Set From Email = your email
5. Save and copy this Template ID

### Step 3: Update Contact.tsx
You'll need to send TWO emails per submission:
1. One to you (main notification)
2. One to the visitor (auto-reply)

Update the `onSubmit` function to send both.

---

## Alternative: Single Template (Simpler)

If you only want notification to yourself (no auto-reply):

**Use Template 1 only**

Just set:
- **To Email:** `acharyaaayush2k4@gmail.com`
- **Reply To:** `{{from_email}}`
- Use the Template 1 HTML above

This way when someone contacts you:
- You get an email
- You can hit "Reply" and it goes directly to them
- No auto-reply sent (cleaner, less spam-like)

---

## Recommended Approach

**For a professional portfolio:** Use the single template (Template 1 only)

**Why?**
- Less emails = better deliverability
- Many people find auto-replies annoying
- You can reply personally (more genuine)
- Simpler to maintain
- Free tier lasts longer (200 emails = 200 contacts vs 100 contacts with auto-reply)

**If you still want auto-reply:** You'll need to send 2 emails per form submission (see implementation below)

---

## Implementation for Auto-Reply (Optional)

If you want both emails, update `Contact.tsx`:

```typescript
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateIdMain = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // to you
  const templateIdReply = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REPLY; // to visitor
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
  try {
    // Send email to you
    await emailjs.send(serviceId, templateIdMain, {
      from_name: `${data.firstName} ${data.lastName}`,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    }, publicKey);
    
    // Send auto-reply to visitor
    await emailjs.send(serviceId, templateIdReply, {
      from_name: data.firstName,
      from_email: data.email,
      message: data.message,
    }, publicKey);
    
    toast({ title: "Message sent successfully!" });
    reset();
  } catch (error) {
    toast({ title: "Failed to send", variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};
```

Add to `.env`:
```
VITE_EMAILJS_TEMPLATE_ID_REPLY=template_xxxxxxx
```

---

## Final Recommendation

**Use Template 1 only (single email to you)**
- Professional
- Clean
- Personal replies
- Better for free tier

**Template Config:**
- Subject: `New Contact: {{subject}}`
- To: `acharyaaayush2k4@gmail.com`
- Reply To: `{{from_email}}`
- Content: Use Template 1 HTML above

This is the industry standard for portfolio contact forms.
