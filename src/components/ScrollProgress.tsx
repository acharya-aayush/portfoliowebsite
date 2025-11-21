import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const [particles, setParticles] = useState<Array<{ id: number; x: number }>>([]);
  
  // Spring animation for smoother scroll
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Generate trailing particles
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Only add particles when scrolling
      if (Math.random() > 0.7) { // 30% chance to add particle
        const newParticle = {
          id: Date.now() + Math.random(),
          x: latest * 100, // Position based on scroll progress
        };
        setParticles((prev) => [...prev.slice(-15), newParticle]); // Keep last 15 particles
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Remove old particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <>
      {/* Main Progress Bar - Slim gold line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[100]"
        style={{ scaleX }}
      />
      
      {/* Glow Effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[99] blur-sm opacity-60"
        style={{ scaleX }}
      />

      {/* Trailing Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed top-0 w-1 h-1 bg-gold/60 rounded-full z-[98]"
          style={{ left: `${particle.x}%` }}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: 8, scale: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </>
  );
};

export default ScrollProgress;
