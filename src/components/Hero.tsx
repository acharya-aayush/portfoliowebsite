import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { memo, useCallback } from 'react';
import { Particles } from '@/components/ui/shadcn-io/particles';
import InteractiveText from '@/components/InteractiveText';
import { ANIMATION_TIMINGS, PARTICLE_CONFIG, COLORS, Z_INDEX } from '@/config/constants';

const Hero = memo(() => {
  const scrollToContact = useCallback(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      aria-label="Hero section"
    >
      {/* Interactive Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={PARTICLE_CONFIG.QUANTITY}
        ease={PARTICLE_CONFIG.EASE}
        staticity={PARTICLE_CONFIG.STATICITY}
        color={COLORS.WHITE}
        size={PARTICLE_CONFIG.SIZE}
        refresh
      />

      {/* Interactive Particle Text - Full Page Coverage */}
      <div className="absolute inset-0" style={{ zIndex: Z_INDEX.PARTICLES }} aria-hidden="true">
        <div className="w-full h-full flex items-center justify-center">
          <InteractiveText text="AAYUSH ACHARYA" className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_TIMINGS.FADE_IN, ease: 'easeOut' }}
        style={{ zIndex: Z_INDEX.CONTENT }} 
        className="relative max-w-4xl mx-auto text-center px-4"
      >
        {/* Invisible heading for SEO */}
        <h1 className="sr-only">Aayush Acharya</h1>
        
        {/* Spacer for particle text */}
        <div className="h-48 sm:h-56 md:h-64 lg:h-72 mb-12" />
          
        {/* Role Animation */}
        <div className="mb-12">
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal">
            <TypeAnimation
              sequence={[
                'AI/ML Enthusiast',
                2000,
                'Fullstack Developer',
                2000,
                'Designer',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-gold"
            />
          </span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ANIMATION_TIMINGS.DELAY_SHORT, duration: ANIMATION_TIMINGS.FADE_IN }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          AI/ML Enthusiast • Tech Innovator • Available for Freelance
        </motion.p>

        {/* CTA - Simple Text Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ANIMATION_TIMINGS.DELAY_MEDIUM, duration: ANIMATION_TIMINGS.FADE_OUT }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToContact}
          className="font-body text-base md:text-lg text-foreground hover:text-gold transition-colors duration-300 cursor-pointer bg-transparent border-none"
          aria-label="Navigate to contact section"
        >
          Got a project in mind? Let's talk.
        </motion.button>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
