# EmailJS Setup Guide for Portfolio Contact Form

## Overview
Your contact form is now integrated with EmailJS, a reliable email service that works directly from your frontend without needing a backend server.

## Setup Instructions

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (free tier includes 200 emails/month)
3. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, click "Email Services" → "Add New Service"
2. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook/Office365**
   - **Yahoo**
   - Or any custom SMTP
3. Follow the OAuth connection flow
4. **Copy the Service ID** (looks like `service_xxxxxxx`)

### 3. Create Email Template
1. Click "Email Templates" → "Create New Template"
2. Use this template configuration:

**Template Name:** Portfolio Contact Form

**Subject:**
```
New Contact Form Submission: {{subject}}
```

**Content (HTML):**
```html
<p><strong>New message from your portfolio:</strong></p>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Subject:</strong> {{subject}}</p>

<p><strong>Message:</strong></p>
<p>{{message}}</p>

<hr>
<p><em>This email was sent from your portfolio contact form.</em></p>
```

**To Email:** your-email@example.com (your personal email)

3. Click "Save" and **copy the Template ID** (looks like `template_xxxxxxx`)

### 4. Get Public Key
1. Click on your username (top right) → "Account"
2. Go to "API Keys" tab
3. **Copy your Public Key** (looks like a long alphanumeric string)

### 5. Configure Environment Variables
1. Create a `.env` file in your project root (if it doesn't exist)
2. Add these variables with your actual values:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**IMPORTANT:** 
- Never commit `.env` to GitHub
- Add `.env` to your `.gitignore` file
- For deployment (Vercel/Netlify), add these as environment variables in your hosting dashboard

### 6. Test the Form
1. Run your dev server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email inbox (may take 1-2 minutes)

## Email Template Variables

The following variables are sent from your form:
- `{{from_name}}` - First name + Last name combined
- `{{from_email}}` - User's email address
- `{{subject}}` - Subject line from form
- `{{message}}` - Message content
- `{{to_name}}` - Your name (hardcoded as "Aayush Acharya")

## Deployment Configuration

### Vercel
1. Go to your project → Settings → Environment Variables
2. Add all three variables:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
3. Redeploy your site

### Netlify
1. Site Settings → Environment Variables
2. Add the same three variables
3. Trigger a new deploy

### Other Platforms
Add the environment variables in your platform's dashboard before building.

## Security Considerations

### Is it safe to expose these keys?
✅ **Public Key**: Safe to expose (it's designed for frontend use)
✅ **Service/Template IDs**: Safe to expose
⚠️ **Rate Limiting**: EmailJS has built-in rate limiting (200/month free tier)
⚠️ **Domain Restriction**: In EmailJS dashboard, restrict to your domain for production

### Preventing Spam
1. **EmailJS Dashboard** → Your Service → Settings
2. Enable "Auto BCC" to get copies of all emails
3. Add your domain to "Allowed Origins" to prevent unauthorized use
4. Consider adding Google reCAPTCHA for extra protection (optional)

## Troubleshooting

### Error: "Configuration Error"
- Check that all three environment variables are set in `.env`
- Restart your dev server after adding environment variables
- Verify variable names start with `VITE_` (required for Vite)

### Email not received
- Check spam folder
- Verify email service is connected in EmailJS dashboard
- Check EmailJS dashboard → History to see if request succeeded
- Confirm template "To Email" is set to your correct email

### "Failed to send message"
- Check browser console for specific error
- Verify Service ID, Template ID, and Public Key are correct
- Ensure internet connection is stable
- Check EmailJS dashboard for service status

### CORS Errors
- EmailJS handles CORS automatically
- If issues persist, check "Allowed Origins" in service settings

## Alternative Solutions

If you prefer a different approach:

### 1. **Formspree** (Simpler but lower free limit)
```bash
npm install @formspree/react
```
- 50 submissions/month free
- No template customization needed

### 2. **Vercel Serverless + Resend** (Most professional)
- Create `/api/contact.ts` in your project
- Use Resend API for sending emails
- More secure (hides email logic server-side)
- Requires backend code

### 3. **Supabase Edge Functions** (You already have Supabase)
- Create edge function for email sending
- Integrate with your existing Supabase setup
- Use Supabase's built-in authentication

## Monitoring & Analytics

Track email delivery:
1. EmailJS Dashboard → History
2. Monitor success rate
3. Check for bounced emails
4. Review monthly usage (200 email limit on free tier)

## Cost Breakdown

**EmailJS Pricing:**
- Free: 200 emails/month
- Personal: $7/month for 1,000 emails
- Professional: $15/month for 5,000 emails

For a portfolio site, free tier is typically sufficient.

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
- GitHub Issues: Create issue in your repo for bugs

---

**Status:** ✅ Contact form fully implemented and ready for configuration
**Next Step:** Follow steps 1-5 above to activate email functionality
