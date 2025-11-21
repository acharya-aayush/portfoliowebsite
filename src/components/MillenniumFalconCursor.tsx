import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
}

const MillenniumFalconCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const newX = e.clientX;
      const newY = e.clientY;
      
      setPosition({ x: newX, y: newY });

      // Calculate rotation based on movement direction
      const deltaX = newX - lastX;
      const deltaY = newY - lastY;
      
      if (deltaX !== 0 || deltaY !== 0) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setRotation(angle);
      }

      // Generate exhaust particles
      if (Math.random() > 0.6) { // 40% chance
        const newParticle = {
          id: particleId++,
          x: newX,
          y: newY,
        };
        setParticles((prev) => [...prev.slice(-20), newParticle]);
      }

      lastX = newX;
      lastY = newY;
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Remove old particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  if (!isVisible) return null;

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Exhaust Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Blue exhaust glow */}
            <div className="w-2 h-2 rounded-full bg-cyan-400/60 blur-sm" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Millennium Falcon Spaceship */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: position.x,
          top: position.y,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          rotate: rotation,
          scale: isClicking ? 1.3 : 1,
        }}
        transition={{
          rotate: { type: 'spring', stiffness: 150, damping: 20 },
          scale: { duration: 0.1 },
        }}
      >
        {/* Hyperdrive Flash on Click */}
        {isClicking && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-400/40 blur-xl" />
          </motion.div>
        )}

        {/* Spaceship Body */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        >
          {/* Main body */}
          <path
            d="M20 12L4 4L8 12L4 20L20 12Z"
            fill="#d4af37"
            opacity="0.9"
          />
          {/* Wing details */}
          <path
            d="M8 12L12 10L12 14L8 12Z"
            fill="#b8960d"
            opacity="0.7"
          />
          {/* Cockpit */}
          <circle cx="10" cy="12" r="1.5" fill="#22d3ee" opacity="0.8" />
          {/* Engine glow */}
          <circle cx="4" cy="12" r="2" fill="#22d3ee" opacity="0.4" className="blur-sm" />
        </svg>

        {/* Engine Trail Glow */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-cyan-400/60 to-transparent blur-sm" />
      </motion.div>
    </>
  );
};

export default MillenniumFalconCursor;
