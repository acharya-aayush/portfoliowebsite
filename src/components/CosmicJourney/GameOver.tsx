import { motion } from 'framer-motion';
import { useJourneyStore } from '@/lib/journey/store';
import { useEffect, useRef } from 'react';

interface GameOverProps {
  onRestart: () => void;
  onMainMenu: () => void;
  asteroidCount: number;
  enemyCount: number;
  survivalTime: number;
}

export const GameOver = ({ onRestart, onMainMenu, asteroidCount, enemyCount, survivalTime }: GameOverProps) => {
  const zPos = useJourneyStore((state) => state.zPos);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Random death messages
  const deathMessages = [
    "OOPSIE...",
    "RIP",
    "YIKES!",
    "OH NO...",
    "TRAGIC",
    "BRUH",
    "NOOOO!",
    "REKT",
    "F",
    "DESTROYED"
  ];
  
  const randomMessage = useRef(deathMessages[Math.floor(Math.random() * deathMessages.length)]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play game over sound immediately
  useEffect(() => {
    audioRef.current = new Audio('/journey/gameover.mp3');
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(err => console.error('Game over sound failed:', err));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* GTA 5 WASTED Effect - Full Screen Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-[100]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%)',
          mixBlendMode: 'normal',
        }}
      >
        {/* Grayscale Filter - Appears immediately */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          className="absolute inset-0"
          style={{
            backdropFilter: 'grayscale(100%) contrast(1.1) brightness(0.6)',
            WebkitBackdropFilter: 'grayscale(100%) contrast(1.1) brightness(0.6)',
          }}
        />
        
        {/* Minimal red vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139, 0, 0, 0.15) 100%)',
          }}
        />

        {/* Death Message - Appears after 1s, fades out after 3s */}
        <motion.div
          initial={{ opacity: 0, scale: 1.3, filter: 'blur(10px)' }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [1.3, 1, 1, 0.95],
            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)']
          }}
          transition={{ 
            duration: 4,
            times: [0, 0.25, 0.75, 1],
            ease: [0.16, 1, 0.3, 1],
            delay: 1
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h1 
            className="text-8xl md:text-[12rem] font-bold tracking-wider"
            style={{
              color: '#8B0000',
              textShadow: '0 0 40px rgba(139, 0, 0, 0.8), 0 0 80px rgba(139, 0, 0, 0.4)',
              fontFamily: 'Impact, "Arial Black", sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            {randomMessage.current}
          </h1>
        </motion.div>

        {/* Stats and Buttons Panel - Appears after death message fades */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-full max-w-xl mx-4">
            {/* Glassmorphic Card - Black/White/Gold theme */}
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-10">
              
              {/* Game Over Title */}
              <h2 className="text-4xl font-bold text-center text-white mb-6" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
                GAME OVER
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-white/10">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#d4af37] mb-1 font-mono">
                    {asteroidCount}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Asteroids</div>
                  <div className="text-[9px] text-gray-600 font-mono">Destroyed</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#d4af37] mb-1 font-mono">
                    {enemyCount}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Enemies</div>
                  <div className="text-[9px] text-gray-600 font-mono">Destroyed</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#d4af37] mb-1 font-mono">
                    {formatTime(survivalTime)}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Time</div>
                  <div className="text-[9px] text-gray-600 font-mono">Survived</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#d4af37] mb-1 font-mono">
                    {Math.abs(Math.round(zPos))}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Distance</div>
                  <div className="text-[9px] text-gray-600 font-mono">Traveled</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <button
                  onClick={onRestart}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 hover:border-[#d4af37] text-[#d4af37] rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restart
                  </span>
                </button>
                
                <button
                  onClick={onMainMenu}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Main Menu
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
