import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyStore } from '@/lib/journey/store';
import { SHIP_MODELS, getUnlockedShips, type ShipModel } from '@/lib/journey/ships';
import StarfighterGLBModel from './StarfighterGLBModel';
import XWingGLBModel from './XWingGLBModel';
import Spaceship1Model from './Spaceship1Model';
import RaptorModel from './RaptorModel';
import CruiserModel from './CruiserModel';

interface ShipSelectorProps {
  onSelect: (shipId: string) => void;
  onClose: () => void;
}

const ShipPreview: React.FC<{ shipId: string }> = ({ shipId }) => {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }} className="w-full h-full">
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#4488ff" />
      <pointLight position={[0, 5, 10]} intensity={2} color="#00ddff" />
      <pointLight position={[5, -5, 5]} intensity={1} color="#ffffff" />
      <spotLight position={[0, 15, 0]} angle={0.5} intensity={2} penumbra={0.5} castShadow color="#00ffff" />
      
      {/* HDRI Environment for reflections */}
      <Environment preset="city" />
      
      <Suspense fallback={null}>
        <group rotation={[0, Math.PI, 0]}>
          {shipId === 'n1-starfighter' && <StarfighterGLBModel active={true} boosting={false} />}
          {shipId === 'x-wing' && <XWingGLBModel active={true} boosting={false} velocity={0} />}
          {shipId === 'spaceship1' && <Spaceship1Model engineGlow={0.5} active={true} boosting={false} />}
          {shipId === 'raptor' && <RaptorModel engineGlow={0.5} />}
          {shipId === 'cruiser' && <CruiserModel engineGlow={0.5} active={true} boosting={false} />}
        </group>
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};

export const ShipSelectorRevamped: React.FC<ShipSelectorProps> = ({ onSelect, onClose }) => {
  const [unlockedShips, setUnlockedShips] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedShip = useJourneyStore(state => state.selectedShip);

  useEffect(() => {
    const checkUnlocked = () => {
      setUnlockedShips(getUnlockedShips());
    };
    
    checkUnlocked();
    
    window.addEventListener('waypointCollected', checkUnlocked);
    window.addEventListener('shipsUnlocked', checkUnlocked);
    return () => {
      window.removeEventListener('waypointCollected', checkUnlocked);
      window.removeEventListener('shipsUnlocked', checkUnlocked);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : SHIP_MODELS.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < SHIP_MODELS.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        const currentShip = SHIP_MODELS[currentIndex];
        if (unlockedShips.includes(currentShip.id)) {
          handleSelect(currentShip.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, unlockedShips]);

  const navigateShip = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : SHIP_MODELS.length - 1));
    } else {
      setCurrentIndex((prev) => (prev < SHIP_MODELS.length - 1 ? prev + 1 : 0));
    }
  };

  const handleSelect = (shipId: string) => {
    onSelect(shipId);
    onClose();
  };

  const currentShip = SHIP_MODELS[currentIndex];
  const isCurrentUnlocked = unlockedShips.includes(currentShip.id);
  const isCurrentSelected = selectedShip === currentShip.id;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-6xl w-full h-[85vh] mx-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-black/20 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-cyan-200">
              HANGAR BAY
            </h2>
            <p className="text-cyan-400/50 text-xs mt-1 tracking-wide">SELECT YOUR STARFIGHTER</p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all text-gray-300 hover:text-white text-sm"
          >
            Close
          </button>
        </div>

        {/* Main Carousel Content */}
        <div className="relative h-[calc(100%-140px)] flex items-center justify-center px-8">
          {/* Left Navigation Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateShip('prev')}
            className="absolute left-8 z-20 w-14 h-14 rounded-full bg-white/10 border border-white/20 hover:border-white/40 backdrop-blur-md flex items-center justify-center text-white/80 text-2xl hover:bg-white/15 transition-all"
          >
            ‹
          </motion.button>

          {/* Ship Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full max-w-4xl h-full flex flex-col"
            >
              {/* 3D Model Preview - Large */}
              <div className="relative h-[60%] rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20 overflow-hidden mb-6 backdrop-blur-sm">
                {isCurrentUnlocked ? (
                  <ShipPreview shipId={currentShip.id} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
                    <div className="text-center">
                      <div className="text-7xl mb-3 opacity-40">🔒</div>
                      <div className="text-xl text-gray-400 font-medium">LOCKED</div>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {!isCurrentUnlocked ? (
                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-xs text-gray-400 border border-white/10">
                      LOCKED
                    </div>
                  ) : isCurrentSelected ? (
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs text-cyan-300 border border-white/20">
                      ● ACTIVE
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Ship Info Panel */}
              <div className="flex-1 flex gap-6">
                {/* Left: Ship Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{currentShip.name}</h3>
                  <p className="text-gray-400 text-sm mb-5">{currentShip.description}</p>

                  {/* Stats */}
                  <div className="space-y-3">
                    {[
                      { label: 'Speed', value: currentShip.stats.speed },
                      { label: 'Handling', value: currentShip.stats.handling },
                      { label: 'Firepower', value: currentShip.stats.firepower },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>{stat.label}</span>
                          <span className="font-mono">{stat.value}/10</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value * 10}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="h-full bg-gradient-to-r from-cyan-500/60 to-blue-500/60"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Action Panel */}
                <div className="w-72 flex flex-col justify-between">
                  {!isCurrentUnlocked ? (
                    <div className="text-xs text-gray-400 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                      <div className="text-white font-medium mb-2">🔓 Unlock Requirements</div>
                      <div className="text-gray-400">{currentShip.unlockCondition}</div>
                    </div>
                  ) : !isCurrentSelected ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(currentShip.id)}
                      className="w-full py-3.5 bg-white/10 rounded-xl text-white text-base font-medium hover:bg-white/15 transition-all border border-white/20 backdrop-blur-sm"
                    >
                      SELECT STARFIGHTER
                    </motion.button>
                  ) : (
                    <div className="w-full py-3.5 bg-white/5 rounded-xl text-cyan-300 text-base font-medium text-center border border-white/20 backdrop-blur-sm">
                      ✓ CURRENTLY ACTIVE
                    </div>
                  )}

                  {/* Ship Counter */}
                  <div className="text-center">
                    <div className="text-gray-500 text-xs mb-2">STARFIGHTER</div>
                    <div className="text-xl font-mono text-white">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(SHIP_MODELS.length).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2 mt-3 justify-center">
                      {SHIP_MODELS.map((_, idx) => (
                        <motion.div
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1 rounded-full cursor-pointer transition-all ${
                            idx === currentIndex
                              ? 'w-6 bg-white/80'
                              : 'w-1 bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Navigation Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateShip('next')}
            className="absolute right-8 z-20 w-14 h-14 rounded-full bg-white/10 border border-white/20 hover:border-white/40 backdrop-blur-md flex items-center justify-center text-white/80 text-2xl hover:bg-white/15 transition-all"
          >
            ›
          </motion.button>
        </div>

        {/* Footer with Credits and Hints */}
        <div className="absolute bottom-6 left-0 right-0 px-8 flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-3">
            <span>← → Navigate</span>
            <span>•</span>
            <span>Enter Select</span>
          </div>
          <div className="text-gray-600">
            Models: <a href="https://quaternius.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Quaternius</a> • <a href="https://cgtrader.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">CGTrader</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
