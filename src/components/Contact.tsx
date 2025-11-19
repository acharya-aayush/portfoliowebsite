import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlackHole } from './ui/blackhole';
import { canSubmit, recordSubmission } from '@/lib/rateLimit';

const contactSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }).max(50),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).max(50),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  subject: z.string().trim().min(1, { message: "Subject is required" }).max(100),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
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

  // Load reCAPTCHA script and check rate limits
  useEffect(() => {
    // Check rate limit on mount
    const checkRateLimit = async () => {
      const result = await canSubmit();
      setRemainingAttempts(result.remainingAttempts || 0);
      setIsRateLimited(!result.allowed);
      if (result.message) {
        setRateLimitMessage(result.message);
      }
    };
    
    checkRateLimit();
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Check rate limit first
    const rateLimitCheck = await canSubmit();
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Rate Limit Exceeded",
        description: rateLimitCheck.message || "Please try again later.",
        variant: "destructive",
      });
      setIsRateLimited(true);
      setRateLimitMessage(rateLimitCheck.message || '');
      setIsSubmitting(false);
      return;
    }
    
    // Rate limiting is our primary protection
    
    // Use hardcoded credentials
    const serviceId = 'service_wyf2qop';
    const templateId = 'template_lp8dl89'; // Contact Us template
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (!publicKey) {
      toast({
        title: "Configuration Error",
        description: "Email service not configured. Please add VITE_EMAILJS_PUBLIC_KEY to .env",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Send contact notification email (to you)
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          subject: data.subject,
          message: data.message,
        },
        publicKey
      );
      
      // Send auto-reply email (to visitor) - wrapped in try/catch to not fail main email
      try {
        const autoReplyTemplateId = 'template_j7b18c9';
        await emailjs.send(
          serviceId,
          autoReplyTemplateId,
          {
            name: data.firstName,
            email: data.email,
            message: data.message,
          },
          publicKey
        );
      } catch (autoReplyError) {
        // Auto-reply failed but main email succeeded
        console.warn('Auto-reply failed:', autoReplyError);
      }
      
      // Record successful submission for rate limiting
      await recordSubmission();
      
      // Update remaining attempts and check if rate limited
      const newCheck = await canSubmit();
      setRemainingAttempts(newCheck.remainingAttempts || 0);
      setIsRateLimited(!newCheck.allowed);
      
      if (newCheck.message) {
        setRateLimitMessage(newCheck.message);
      }
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      reset();
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      
      // Show specific error message if available
      const errorMessage = error?.text || error?.message || "Please try again or contact me directly via email.";
      
      toast({
        title: "Failed to send message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/acharya-aayush',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/acharyaaayush/',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/acharya.404/',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 md:py-32 relative overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Black Hole - positioned on the right side with high z-index for interactivity */}
      <BlackHole mousePosition={mousePosition} />
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * 100 + '%'],
              x: [null, Math.random() * 100 + '%'],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Decorative curved background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.03]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M0,0 C300,80 600,80 900,20 L900,120 L0,120 Z" fill="currentColor" className="text-foreground" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl lg:max-w-none lg:w-1/2 mx-auto lg:mx-0"
        >
          {/* Header */}
          <div className="text-center mb-12 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="text-xl md:text-2xl font-bold text-foreground tracking-widest uppercase">Contact</span>
            </motion.div>
            {/* Main Contact Heading - Royal Style */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              Let's Connect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-muted-foreground text-base md:text-lg"
            >
              Have a project in mind? Let's talk about it.
            </motion.p>
          </div>

          {/* Rate Limited Message */}
          {isRateLimited ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-12 rounded-2xl backdrop-blur-xl bg-background/30 border border-foreground/10 shadow-2xl text-center"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <AlertCircle className="w-16 h-16 mx-auto text-yellow-500/80" />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-semibold mb-4"
              >
                Rate Limit Reached
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mb-6 max-w-md mx-auto"
              >
                {rateLimitMessage}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-muted-foreground/60"
              >
                You can reach me directly at{' '}
                <a 
                  href="mailto:acharyaaayush2k4@gmail.com" 
                  className="text-foreground underline hover:text-foreground/80 transition-colors"
                >
                  acharyaaayush2k4@gmail.com
                </a>
              </motion.p>
            </motion.div>
          ) : (
            <>
              {/* Contact Form - Glassmorphic */}
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
            {/* Name Fields */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="space-y-2 group">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground/80">
                  First name
                </label>
                <Input
                  id="firstName"
                  placeholder="Your first name"
                  {...register('firstName')}
                  className="bg-background/20 backdrop-blur-sm border-foreground/20 focus:border-foreground/40 hover:border-foreground/30 transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:scale-[1.01] hover:scale-[1.005] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                />
                {errors.firstName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive animate-shake"
                  >
                    {errors.firstName.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2 group">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground/80">
                  Last name
                </label>
                <Input
                  id="lastName"
                  placeholder="Your last name"
                  {...register('lastName')}
                  className="bg-background/20 backdrop-blur-sm border-foreground/20 focus:border-foreground/40 hover:border-foreground/30 transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:scale-[1.01] hover:scale-[1.005] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                />
                {errors.lastName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive animate-shake"
                  >
                    {errors.lastName.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Email and Subject */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground/80">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="bg-background/20 backdrop-blur-sm border-foreground/20 focus:border-foreground/40 hover:border-foreground/30 transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:scale-[1.01] hover:scale-[1.005] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive animate-shake"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2 group">
                <label htmlFor="subject" className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground/80">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  {...register('subject')}
                  className="bg-background/20 backdrop-blur-sm border-foreground/20 focus:border-foreground/40 hover:border-foreground/30 transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:scale-[1.01] hover:scale-[1.005] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                />
                {errors.subject && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive animate-shake"
                  >
                    {errors.subject.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Message */}
            <motion.div 
              className="space-y-2 group"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label htmlFor="message" className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground/80">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Your message..."
                rows={5}
                {...register('message')}
                className="bg-background/20 backdrop-blur-sm border-foreground/20 focus:border-foreground/40 hover:border-foreground/30 transition-all duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:scale-[1.01] hover:scale-[1.005] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] resize-none"
              />
              {errors.message && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive animate-shake"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || isRateLimited}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-6 text-base transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-pulse-scale">Sending</span>
                      <span className="animate-dots">...</span>
                    </span>
                  ) : (
                    'Send message'
                  )}
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </Button>
            </motion.div>
          </motion.form>
          </>
          )}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  aria-label={link.name}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Icon size={20} />
                  <motion.div 
                    className="absolute -inset-2 bg-foreground/10 rounded-full -z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
