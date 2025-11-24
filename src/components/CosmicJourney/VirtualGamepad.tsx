import { useState } from 'react';
import { motion } from 'framer-motion';

interface VirtualGamepadProps {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export const VirtualGamepad = ({ onKeyDown, onKeyUp, onMouseDown, onMouseUp }: VirtualGamepadProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handlePress = (key: string) => {
    if (!pressedKeys.has(key)) {
      setPressedKeys(prev => new Set(prev).add(key));
      onKeyDown(key);
    }
  };

  const handleRelease = (key: string) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    onKeyUp(key);
  };

  const GameButton = ({ keyCode, label, className = '' }: { keyCode: string; label: string; className?: string }) => {
    const isPressed = pressedKeys.has(keyCode);
    
    return (
      <motion.button
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress(keyCode);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleRelease(keyCode);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handlePress(keyCode);
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          handleRelease(keyCode);
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          if (pressedKeys.has(keyCode)) {
            handleRelease(keyCode);
          }
        }}
        whileTap={{ scale: 0.9 }}
        className={`relative select-none touch-none ${className}`}
      >
        <div className={`relative px-4 py-3 bg-black/60 backdrop-blur-md border rounded-lg transition-all duration-150 ${
          isPressed 
            ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-[0_0_20px_rgba(212,175,55,0.5)]' 
            : 'border-white/20 hover:border-white/40'
        }`}>
          <span className={`text-sm font-mono font-bold transition-colors ${
            isPressed ? 'text-[#d4af37]' : 'text-white'
          }`}>
            {label}
          </span>
        </div>
      </motion.button>
    );
  };

  const FireButton = () => {
    const [isFiring, setIsFiring] = useState(false);

    return (
      <motion.button
        onTouchStart={(e) => {
          e.preventDefault();
          setIsFiring(true);
          onMouseDown();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setIsFiring(false);
          onMouseUp();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsFiring(true);
          onMouseDown();
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          setIsFiring(false);
          onMouseUp();
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          if (isFiring) {
            setIsFiring(false);
            onMouseUp();
          }
        }}
        whileTap={{ scale: 0.9 }}
        className="relative select-none touch-none"
      >
        <div className={`relative w-16 h-16 bg-black/60 backdrop-blur-md border-2 rounded-full transition-all duration-150 flex items-center justify-center ${
          isFiring 
            ? 'border-red-500 bg-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.8)]' 
            : 'border-white/30 hover:border-white/50'
        }`}>
          <span className={`text-lg font-bold transition-colors ${
            isFiring ? 'text-red-400' : 'text-white'
          }`}>
            🔥
          </span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/60 font-mono whitespace-nowrap">
          FIRE
        </div>
      </motion.button>
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] pointer-events-none md:hidden">
      <div className="relative w-full px-4 pb-4 pointer-events-auto">
        {/* Glassmorphic background bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm" />
        
        <div className="relative flex items-end justify-between gap-4">
          {/* Left Side: Movement Controls */}
          <div className="flex flex-col gap-3">
            {/* W/S Thrust */}
            <div className="flex gap-2">
              <GameButton keyCode="KeyW" label="W" />
              <GameButton keyCode="KeyS" label="S" />
            </div>
            
            {/* A/D Strafe */}
            <div className="flex gap-2">
              <GameButton keyCode="KeyA" label="A" />
              <GameButton keyCode="KeyD" label="D" />
            </div>
          </div>

          {/* Center: Fire Button */}
          <div className="flex items-center pb-2">
            <FireButton />
          </div>

          {/* Right Side: Direction & Special */}
          <div className="flex flex-col gap-3">
            {/* Arrow Keys: Up/Down */}
            <div className="flex gap-2 justify-end">
              <GameButton keyCode="ArrowUp" label="↑" />
              <GameButton keyCode="ArrowDown" label="↓" />
            </div>
            
            {/* Arrow Keys: Left/Right + Boost */}
            <div className="flex gap-2 justify-end">
              <GameButton keyCode="ArrowLeft" label="←" />
              <GameButton keyCode="ArrowRight" label="→" />
              <GameButton keyCode="ShiftLeft" label="⚡" className="border-[#d4af37]/30" />
            </div>
          </div>
        </div>

        {/* Control hints */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-white/50 font-mono whitespace-nowrap">
          Touch Controls Active
        </div>
      </div>
    </div>
  );
};
