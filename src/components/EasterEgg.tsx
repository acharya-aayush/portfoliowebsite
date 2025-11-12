import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRIGGER_KEYWORDS = ['monawales', 'emilywillis', 'chanelpreston'];

type PersonType = 'monawales' | 'emilywillis' | 'chanelpreston' | null;

// Rose petal SVG component
const RosePetal = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C10 2 15 5 15 10C15 15 10 18 10 18C10 18 5 15 5 10C5 5 10 2 10 2Z" 
          fill="url(#petalGradient)" opacity="0.9"/>
    <defs>
      <linearGradient id="petalGradient" x1="10" y1="2" x2="10" y2="18">
        <stop offset="0%" stopColor="#ff69b4" />
        <stop offset="50%" stopColor="#ff1493" />
        <stop offset="100%" stopColor="#8b0000" />
      </linearGradient>
    </defs>
  </svg>
);

const EasterEgg = () => {
  const [isActive, setIsActive] = useState(false);
  const [activePerson, setActivePerson] = useState<PersonType>(null);
  const [typedKeys, setTypedKeys] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      setTypedKeys((prev) => {
        const newTyped = (prev + e.key.toLowerCase()).slice(-20);
        
        // Check which specific keyword matches
        const matchedKeyword = TRIGGER_KEYWORDS.find(keyword => newTyped.includes(keyword));
        
        if (matchedKeyword) {
          setIsActive(true);
          setActivePerson(matchedKeyword as PersonType);
          
          // Auto-hide after 5 seconds
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            setIsActive(false);
            setActivePerson(null);
          }, 5000);
          
          return '';
        }
        
        return newTyped;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Red/Black Glassmorphic Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/85"
            onClick={() => setIsActive(false)}
          >
            {/* Falling Rose Petals */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  animate={{
                    y: window.innerHeight + 50,
                    x: Math.random() * window.innerWidth,
                    rotate: Math.random() * 720 + 360,
                    opacity: [0, 0.8, 0.6, 0],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                  }}
                >
                  <RosePetal />
                </motion.div>
              ))}
            </div>
            
            {/* Subtle red glow effect */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.15) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.2) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.15) 0%, transparent 70%)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </div>

            {/* Luxurious Glassmorphic Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 p-12 max-w-lg backdrop-blur-2xl bg-gradient-to-br from-black/60 via-red-950/40 to-black/60 rounded-lg border border-red-500/30 shadow-2xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(139, 0, 0, 0.37), inset 0 0 60px rgba(220, 20, 60, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pink/Red shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  boxShadow: [
                    '0 0 30px rgba(255, 20, 147, 0.5)',
                    '0 0 60px rgba(220, 20, 60, 0.7)',
                    '0 0 30px rgba(255, 20, 147, 0.5)',
                  ],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              <div className="relative z-10 text-center">
                {/* Individual Portrait Cards */}
                {activePerson === 'monawales' && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                      className="relative mb-8 flex justify-center"
                    >
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-pink-500/60 shadow-[0_0_40px_rgba(255,20,147,0.9)] bg-black/40 backdrop-blur-sm">
                        <img 
                          src="/easter/mw.png" 
                          alt="Mona Wales" 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <motion.div
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-red-500 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Mona Wales
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="font-heading text-3xl md:text-4xl font-black mb-3 tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #8b0000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.6))',
                      }}
                    >
                      The Sophisticated Icon
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-pink-200 text-base md:text-lg mb-2 leading-relaxed font-medium"
                    >
                      Elegance, power, and{' '}
                      <span className="text-red-300 font-bold">timeless allure</span>
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-pink-300/90 text-sm mb-6 italic"
                    >
                      A true queen who commands respect 👑
                    </motion.p>
                  </>
                )}

                {activePerson === 'emilywillis' && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                      className="relative mb-8 flex justify-center"
                    >
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-red-500/60 shadow-[0_0_40px_rgba(220,20,60,0.9)] bg-black/40 backdrop-blur-sm">
                        <img 
                          src="/easter/ew.png" 
                          alt="Emily Willis" 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <motion.div
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-pink-500 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Emily Willis
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="font-heading text-3xl md:text-4xl font-black mb-3 tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #8b0000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.6))',
                      }}
                    >
                      The Radiant Star
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-pink-200 text-base md:text-lg mb-2 leading-relaxed font-medium"
                    >
                      Beauty, passion, and{' '}
                      <span className="text-red-300 font-bold">captivating grace</span>
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-pink-300/90 text-sm mb-6 italic"
                    >
                      An angel with fire in her soul 🔥
                    </motion.p>
                  </>
                )}

                {activePerson === 'chanelpreston' && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                      className="relative mb-8 flex justify-center"
                    >
                     <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-red-500/60 shadow-[0_0_40px_rgba(220,20,60,0.9)] bg-black/40 backdrop-blur-sm">
                        <img 
                          src="/easter/cp.png" 
                          alt="Chanel Preston" 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <motion.div
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-red-500 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Chanel Preston
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="font-heading text-3xl md:text-4xl font-black mb-3 tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #8b0000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.6))',
                      }}
                    >
                      The Timeless Goddess
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-pink-200 text-base md:text-lg mb-2 leading-relaxed font-medium"
                    >
                      Class, confidence, and{' '}
                      <span className="text-red-300 font-bold">undeniable charm</span>
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-pink-300/90 text-sm mb-6 italic"
                    >
                      Excellence personified ✨
                    </motion.p>
                  </>
                )}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="text-xs text-pink-400/60"
                >
                  Click anywhere to continue
                </motion.p>
              </div>

              {/* Luxurious decorative corners */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-pink-500/60" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-pink-500/60" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-pink-500/60" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-pink-500/60" />
              
              {/* Heart accents */}
              <motion.div 
                className="absolute top-1 left-1 text-red-400/60 text-xs"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💕
              </motion.div>
              <motion.div 
                className="absolute top-1 right-1 text-red-400/60 text-xs"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                💕
              </motion.div>
              <motion.div 
                className="absolute bottom-1 left-1 text-red-400/60 text-xs"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                💕
              </motion.div>
              <motion.div 
                className="absolute bottom-1 right-1 text-red-400/60 text-xs"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                💕
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Cursor trail effect */}
          <CursorTrail />
        </>
      )}
    </AnimatePresence>
  );
};

const CursorTrail = () => {
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number; rotation: number }>>([]);

  useEffect(() => {
    let nextId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = { 
        x: e.clientX, 
        y: e.clientY, 
        id: nextId++,
        rotation: Math.random() * 360 
      };
      setTrails((prev) => [...prev.slice(-20), newTrail]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="absolute"
          initial={{ 
            x: trail.x - 10, 
            y: trail.y - 10, 
            opacity: 0.9, 
            scale: 1,
            rotate: trail.rotation 
          }}
          animate={{ 
            y: trail.y + 50,
            opacity: 0, 
            scale: 0.5,
            rotate: trail.rotation + 180
          }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <RosePetal />
        </motion.div>
      ))}
    </div>
  );
};

export default EasterEgg;
