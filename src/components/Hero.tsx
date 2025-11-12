import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Particles } from '@/components/ui/shadcn-io/particles';
import InteractiveText from '@/components/InteractiveText';

const Hero = () => {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Interactive Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        staticity={50}
        color="#ffffff"
        size={0.8}
        refresh
      />

      {/* Interactive Particle Text - Full Page Coverage */}
      <div className="absolute inset-0 z-[5]">
        <div className="w-full h-full flex items-center justify-center">
          <InteractiveText text="AAYUSH ACHARYA" className="w-full h-full" />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto text-center px-4"
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
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          AI/ML Enthusiast • Tech Innovator • Available for Freelance
        </motion.p>

        {/* CTA - Simple Text Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToContact}
          className="font-body text-base md:text-lg text-foreground hover:text-gold transition-colors duration-300 cursor-pointer bg-transparent border-none"
        >
          Got a project in mind? Let's talk.
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
