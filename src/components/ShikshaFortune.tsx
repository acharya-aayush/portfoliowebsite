import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const ShikshaFortune = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState('');
  const [currentFortune, setCurrentFortune] = useState('');

  const fortunes = [
    "The Perfectionist sees your foundation as strong as her calculations.",
    "Ms Perfect predicts: A bridge to success built with perfect structural integrity.",
    "The Girl, The Myth, The Legend reveals: Your dreams will be constructed with steel and concrete determination.",
    "The Fortune Teller foresees: You'll build your future higher than the tallest skyscraper.",
    "The Perfectionist's wisdom: Like reinforced concrete, you're stronger under pressure.",
    "The all-knowing engineer predicts: Your plans are perfectly aligned, just like her blueprints.",
    "Ms Perfect divines: Success is loading, calculated with precision.",
    "The Legend's prophecy: Your path is surveyed, your future is leveled, and your success is measured.",
    "The Fortune Teller foretells: You'll cement your legacy with unshakeable foundations.",
    "The Perfectionist reveals: Coffee plus calculations equals perfection.",
    "Ms Perfect sees: A structurally sound future awaits. She's done the load analysis.",
    "The Girl, The Myth, The Legend shows: Your success ratio is perfectly balanced.",
    "The Fortune Teller prophesizes: Build your dreams one brick at a time.",
    "The Perfectionist predicts: Your foundation is strong, your structure is sound, your future is built.",
    "Ms Perfect divines: Your life's blueprint is already approved.",
    "The Legend foresees: You'll construct happiness with zero margin of error.",
    "The Fortune Teller's wisdom: The strongest structures are built by the strongest hearts.",
    "The Perfectionist reveals: True power lies in knowing your load limits.",
    "Ms Perfect's fortune: Your potential is infinite. But she's calculated it anyway.",
    "The Girl, The Myth, The Legend speaks: Shiksha Karki, building dreams since forever, one calculation at a time.",
    "The Fortune Teller predicts: Your success is non-negotiable. She's already filed the permit.",
    "The Perfectionist reveals: You'll rise from every setback like a phoenix, structurally sound.",
    "Ms Perfect foresees: Your friendships are reinforced steel, your dreams are skyscrapers.",
    "The Legend's wisdom: Keep calm and trust the process, and the structural analysis."
  ];

  // Activation keywords (case-insensitive)
  const activationKeywords = [
    'shiksha',
    'bestie',
    'mahilamitra',
    'parammitra',
    'firebrigade',
    'tarakmehta',
    'fortuneteller'
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Update buffer with new key
      const newBuffer = (keyBuffer + e.key).toLowerCase().slice(-20);
      setKeyBuffer(newBuffer);

      // Check if any keyword is in the buffer
      const keywordFound = activationKeywords.some(keyword => 
        newBuffer.includes(keyword.toLowerCase())
      );

      if (keywordFound) {
        handleOpen();
        setKeyBuffer('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyBuffer]);

  const handleOpen = () => {
    // Pick a new random fortune each time
    const newFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setCurrentFortune(newFortune);
    setIsRevealed(true);
  };

  // Listen for custom event from button click
  useEffect(() => {
    const handleCustomOpen = () => {
      handleOpen();
    };

    window.addEventListener('openShikshaFortune', handleCustomOpen);
    return () => window.removeEventListener('openShikshaFortune', handleCustomOpen);
  }, []);

  const handleClose = () => {
    setIsRevealed(false);
  };

  return (
    <>
      {/* Fortune Reveal Modal - Global, activated by keywords anywhere on the page */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Fortune Card */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 border-2 border-purple-400/30 backdrop-blur-xl shadow-2xl">
                {/* Sparkle decorations */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute bottom-4 left-4 text-3xl"
                  animate={{ 
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  👑
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Shiksha Karki
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The Fortune Teller • The Perfectionist • Ms Perfect • The Girl, The Myth, The Legend
                  </p>
                </motion.div>

                {/* Fortune Teller Image */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-purple-400/40 shadow-2xl">
                    <img 
                      src="/bestie/shiksha-fortune-teller.jpg" 
                      alt="The Fortune Teller"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                  </div>
                </motion.div>

                {/* Fortune Text */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="relative"
                >
                  <div className="p-6 rounded-xl bg-background/40 border border-foreground/10">
                    <p className="text-lg text-center font-medium leading-relaxed">
                      {currentFortune}
                    </p>
                  </div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-4 mt-6"
                >
                  <a
                    href="https://www.instagram.com/shiksha_karkee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 transition-all border border-foreground/10 hover:border-pink-400/30"
                    title="Follow Shiksha on Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/shiksha.chhetri.230252"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 transition-all border border-foreground/10 hover:border-blue-400/30"
                    title="Connect with Shiksha on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/shiksha-karki-b9665636a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-700/20 hover:from-blue-400/30 hover:to-blue-700/30 transition-all border border-foreground/10 hover:border-blue-400/30"
                    title="Connect with Shiksha on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </motion.div>

                {/* Footer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-xs text-muted-foreground mt-4"
                >
                  The Fortune Teller has spoken
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Button component for Footer
export const ShikshaFortuneButton = () => {
  // 1/30 chance to spawn the button
  const [isEnabled] = useState(() => Math.random() < 1/30);
  
  const handleClick = () => {
    window.dispatchEvent(new Event('openShikshaFortune'));
  };

  // Don't render if not enabled
  if (!isEnabled) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className="group relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Crystal Ball Icon */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            🔮
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
};

export default ShikshaFortune;
