# Contact Form with reCAPTCHA - Implementation Guide

## Quick Setup (5 minutes)

### 1. Get reCAPTCHA Keys
- Go to: https://www.google.com/recaptcha/admin/create
- Select: reCAPTCHA v2 "I'm not a robot"
- Add domains: `localhost`, your actual domain
- Copy: **Site Key** (public) and **Secret Key** (private)

### 2. Configure EmailJS
- Template `template_ugf4uip` → Settings
- Enable reCAPTCHA V2 → Paste **Secret Key**
- Save Contacts → ON
  - Contact Email: `{{from_email}}`
  - Contact Name: `{{from_name}}`
- Save template

### 3. Update .env
```env
VITE_EMAILJS_SERVICE_ID=service_wyf2qop
VITE_EMAILJS_TEMPLATE_ID=template_ugf4uip
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### 4. Install Package (optional - we'll use script tag)
```bash
# Optional: npm install react-google-recaptcha
# We'll use the direct script method (simpler)
```

---

## Updated Contact.tsx Code

Replace your current `onSubmit` function and add reCAPTCHA:

```typescript
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlackHole } from './ui/blackhole';

// ... existing schema and types ...

const Contact = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const { toast } = useToast();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      });
    }
  };

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Check reCAPTCHA
    const recaptchaResponse = (window as any).grecaptcha?.getResponse();
    
    if (!recaptchaResponse) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if EmailJS is configured
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (!serviceId || !templateId || !publicKey) {
      toast({
        title: "Configuration Error",
        description: "Email service not configured. Please contact the administrator.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Send email using EmailJS with reCAPTCHA token
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          'g-recaptcha-response': recaptchaResponse, // reCAPTCHA token
        },
        publicKey
      );
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      reset();
      
      // Reset reCAPTCHA
      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.reset();
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    // ... existing social links ...
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 md:py-32 relative overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* ... existing BlackHole and decorative elements ... */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl lg:max-w-none lg:w-1/2 mx-auto lg:mx-0"
        >
          {/* ... existing header ... */}

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6 p-8 rounded-2xl backdrop-blur-xl bg-background/30 border border-foreground/10 shadow-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* ... existing form fields ... */}

            {/* reCAPTCHA Widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex justify-center"
            >
              {recaptchaLoaded && (
                <div 
                  className="g-recaptcha" 
                  data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  data-theme="dark"
                  style={{
                    transform: 'scale(0.95)',
                    transformOrigin: 'center',
                  }}
                />
              )}
              {!recaptchaLoaded && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  Loading verification...
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || !recaptchaLoaded}
                className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 h-12 text-base font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* ... rest of component ... */}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
```

---

## Alternative: Using react-google-recaptcha Package

If you prefer a React component approach:

### Install:
```bash
npm install react-google-recaptcha
npm install --save-dev @types/react-google-recaptcha
```

### Usage:
```typescript
import ReCAPTCHA from 'react-google-recaptcha';

// In component
const recaptchaRef = useRef<ReCAPTCHA>(null);
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

const handleRecaptchaChange = (token: string | null) => {
  setRecaptchaToken(token);
};

// In form JSX
<ReCAPTCHA
  ref={recaptchaRef}
  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
  onChange={handleRecaptchaChange}
  theme="dark"
/>

// In onSubmit
if (!recaptchaToken) {
  toast({ title: "Please complete reCAPTCHA" });
  return;
}

// Send with:
'g-recaptcha-response': recaptchaToken
```

---

## Styling the reCAPTCHA Widget

Add to your CSS or Tailwind:

```css
/* Make reCAPTCHA fit your dark theme */
.g-recaptcha {
  transform: scale(0.95);
  transform-origin: center;
}

/* Dark theme override */
.g-recaptcha > div {
  margin: 0 auto;
}

@media (max-width: 640px) {
  .g-recaptcha {
    transform: scale(0.85);
  }
}
```

---

## Testing Checklist

1. ✅ reCAPTCHA widget loads
2. ✅ Can complete "I'm not a robot" challenge
3. ✅ Form submits successfully after verification
4. ✅ Email received with all data
5. ✅ reCAPTCHA resets after submission
6. ✅ Works on mobile devices
7. ✅ Dark theme looks good

---

## Troubleshooting

**reCAPTCHA not loading:**
- Check Site Key is correct in `.env`
- Verify domain is added in reCAPTCHA admin
- Check browser console for errors

**"Verification Required" error:**
- User didn't complete reCAPTCHA
- Token expired (valid for 2 minutes)
- reCAPTCHA script not loaded yet

**Email not sent:**
- Check Secret Key in EmailJS template settings
- Verify `g-recaptcha-response` is passed to emailjs.send()
- Check EmailJS History for error details

**Styling issues:**
- reCAPTCHA iframe has fixed size (304x78px)
- Use `transform: scale()` for responsive sizing
- Can't fully customize colors (Google limitation)

---

## Production Deployment

### Vercel/Netlify Environment Variables:
```
VITE_EMAILJS_SERVICE_ID=service_wyf2qop
VITE_EMAILJS_TEMPLATE_ID=template_ugf4uip
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

### Update reCAPTCHA Domains:
1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Select your site
3. Add production domain (e.g., `aayushacharya.com`)
4. Remove `localhost` in production (optional)

---

## Summary

✅ **What You Get:**
- Spam protection with Google reCAPTCHA
- Professional glassmorphic email templates
- Contact saving in EmailJS dashboard
- Optional auto-reply to visitors
- Mobile-responsive design

✅ **Quota Usage:**
- Without auto-reply: 200 contacts/month
- With auto-reply: 100 contacts/month (2 emails per submission)

✅ **Recommendation:**
Use Contact Us template only (no auto-reply) for most professional approach.
