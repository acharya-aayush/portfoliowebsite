# 🚀 COMPLETE EMAILJS SETUP GUIDE

## ✅ Step 1: Add Public Key to .env (DONE)
Your `.env` file now has: `VITE_EMAILJS_PUBLIC_KEY="rHOZuGy4Xqwy2R8dI"`

---

## 📧 Step 2: Configure Template 1 - Contact Notification (template_lp8dl89)

### Instructions:
1. **Go to**: https://dashboard.emailjs.com/admin/templates/template_lp8dl89
2. **Click**: Edit button
3. **Delete**: All existing content in the template editor
4. **Copy**: The HTML code below (starting from `<!DOCTYPE html>`)
5. **Paste**: Into the template editor
6. **Click**: Settings tab
   - **To Email**: `acharyaaayush2k4@gmail.com`
   - **From Name**: `Portfolio Contact Form`
   - **Reply To**: `{{email}}`
7. **Scroll down**: Find reCAPTCHA section
   - **Secret Key**: `6Lf4fREsAAAAADggPv0iQvTBS_jeXxKzjJ8ynbwg`
8. **Click**: Save

### HTML Template for template_lp8dl89:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="min-height: 100vh; background: radial-gradient(ellipse at top, #1a0b2e 0%, #0a0015 50%, #000000 100%); padding: 40px 20px; position: relative; overflow: hidden;">
    
    <!-- Star field -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 10%; left: 15%; animation: twinkle 3s infinite;"></div>
      <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; box-shadow: 0 0 2px rgba(255,255,255,0.6); top: 25%; left: 75%; animation: twinkle 2.5s infinite 0.5s;"></div>
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 60%; left: 25%; animation: twinkle 4s infinite 1s;"></div>
      <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; box-shadow: 0 0 2px rgba(255,255,255,0.6); top: 45%; left: 85%; animation: twinkle 3.5s infinite 1.5s;"></div>
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 80%; left: 50%; animation: twinkle 2s infinite 2s;"></div>
    </div>

    <!-- Content -->
    <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 1;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 10px 0; letter-spacing: -0.5px;">New Contact Message</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Someone reached out through your portfolio</p>
      </div>

      <!-- Main card -->
      <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);">
        
        <!-- From section -->
        <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">From</p>
          <p style="color: #ffffff; font-size: 18px; font-weight: 500; margin: 0 0 4px 0;">{{name}}</p>
          <a href="mailto:{{email}}" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">{{email}}</a>
        </div>

        <!-- Message section -->
        <div style="margin-bottom: 24px;">
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Message</p>
          <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; border-left: 3px solid #8b5cf6;">
            <p style="color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{message}}</p>
          </div>
        </div>

        <!-- Reply button -->
        <div style="text-align: center; margin-top: 28px;">
          <a href="mailto:{{email}}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);">Reply to {{name}}</a>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 24px; padding-top: 20px;">
        <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">Portfolio Contact Form</p>
      </div>

    </div>
  </div>
</body>
</html>
```

---

## 📧 Step 3: Configure Template 2 - Auto Reply (template_j7b18c9)

### Instructions:
1. **Go to**: https://dashboard.emailjs.com/admin/templates/template_j7b18c9
2. **Click**: Edit button
3. **Delete**: All existing content
4. **Copy**: The HTML code below
5. **Paste**: Into the template editor
6. **Click**: Settings tab
   - **To Email**: `{{email}}` (this sends to the person who filled the form)
   - **From Name**: `Aayush Acharya`
   - **Reply To**: `acharyaaayush2k4@gmail.com`
7. **Click**: Save

### HTML Template for template_j7b18c9:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="min-height: 100vh; background: radial-gradient(ellipse at top, #1a0b2e 0%, #0a0015 50%, #000000 100%); padding: 40px 20px; position: relative; overflow: hidden;">
    
    <!-- Star field -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 10%; left: 15%;"></div>
      <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; box-shadow: 0 0 2px rgba(255,255,255,0.6); top: 25%; left: 75%;"></div>
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 60%; left: 25%;"></div>
      <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; box-shadow: 0 0 2px rgba(255,255,255,0.6); top: 45%; left: 85%;"></div>
      <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 3px rgba(255,255,255,0.8); top: 80%; left: 50%;"></div>
    </div>

    <!-- Content -->
    <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 1;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 10px 0; letter-spacing: -0.5px;">Thanks for reaching out</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Your message has been received</p>
      </div>

      <!-- Main card -->
      <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);">
        
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Hi {{name}},</p>
        
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Thanks for getting in touch. I received your message and will get back to you soon.</p>
        
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">I appreciate your interest and look forward to connecting with you.</p>

        <!-- Message recap -->
        <div style="margin: 28px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; border-left: 3px solid #8b5cf6;">
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your Message</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{message}}</p>
        </div>

        <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.7; margin: 24px 0 0 0;">Best,<br>Aayush</p>

      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 24px; padding-top: 20px;">
        <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">Automated response — Personal reply coming soon</p>
      </div>

    </div>
  </div>
</body>
</html>
```

---

## 🔗 Step 4: Link Auto-Reply to Contact Template (OPTIONAL)

If you want auto-replies to be sent automatically:

1. Go to: https://dashboard.emailjs.com/admin/templates/template_lp8dl89
2. Click **Settings** tab
3. Scroll to **Auto Reply** section
4. Select: `template_j7b18c9`
5. Click **Save**

---

## ✅ What's Already Done

- ✅ Public key added to `.env`
- ✅ Service ID configured: `service_wyf2qop`
- ✅ Template IDs configured in code
- ✅ reCAPTCHA site key configured
- ✅ Rate limiting (3 per hour, 24hr cooldown)
- ✅ Browser fingerprinting
- ✅ All code implemented

---

## 🧪 Testing Checklist

After completing Steps 2-4 above:

1. **Test Basic Submit**:
   - Fill form → Complete reCAPTCHA → Submit
   - Check: Email received at acharyaaayush2k4@gmail.com
   - Check: Auto-reply received at submitted email

2. **Test Rate Limiting**:
   - Submit 3 times quickly
   - Check: 4th attempt shows rate limit warning
   - Check: Remaining attempts counter updates

3. **Test reCAPTCHA**:
   - Try submit without checking reCAPTCHA
   - Check: Shows "Please complete the reCAPTCHA verification"

4. **Test Validation**:
   - Submit empty form
   - Check: HTML5 validation triggers

---

## 🚨 Important Notes

- **Private Key**: `lU4mS9uYLSO6K6XLoxYZ7` is NOT used in the code (EmailJS handles it)
- **reCAPTCHA Secret**: Must be added to template settings (Step 2, #7)
- **Auto-Reply**: Will only work if you link templates (Step 4)
- **Rate Limit**: Client-side only, can be bypassed by clearing browser data (but fingerprinting makes it harder)

---

## 📝 Quick Reference

| Item | Value |
|------|-------|
| Service ID | `service_wyf2qop` |
| Contact Template | `template_lp8dl89` |
| Auto-Reply Template | `template_j7b18c9` |
| Public Key | `rHOZuGy4Xqwy2R8dI` |
| Private Key | `lU4mS9uYLSO6K6XLoxYZ7` |
| reCAPTCHA Site Key | `6Lf4fREsAAAAAGbtSL9MWHXGORGdzKfYlIYpSIv3` |
| reCAPTCHA Secret | `6Lf4fREsAAAAADggPv0iQvTBS_jeXxKzjJ8ynbwg` |
| Your Email | `acharyaaayush2k4@gmail.com` |

---

## 🎯 Next Steps

1. Copy HTML from Step 2 → Paste into template_lp8dl89
2. Add reCAPTCHA secret to template_lp8dl89 settings
3. Copy HTML from Step 3 → Paste into template_j7b18c9
4. (Optional) Link auto-reply in Step 4
5. Test the form!

**That's it! Your contact form is ready to go.** 🚀
