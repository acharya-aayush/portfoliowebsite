import React, { Suspense, useEffect, useState } from 'react';
import { CosmicScene } from './CosmicScene';
import { UIOverlay } from './UIOverlay';
import { ShipSelector } from './ShipSelector';
import { ShipSelectorRevamped } from './ShipSelectorRevamped';
import { WaypointNotifications } from './WaypointNotifications';
import { CruiserHUD } from './CruiserHUD';
import { DamageOverlay } from './DamageOverlay';
import { GameOver } from './GameOver';
import { audioManager } from '@/lib/journey/AudioManager';
import { useJourneyStore } from '@/lib/journey/store';
import { LightsaberLoader } from '../ui/lightsaber-loader';
import { COLORS } from '@/lib/journey/constants';
import { SHIP_MODELS, unlockAllShips, isTutorialCompleted, setTutorialCompleted } from '@/lib/journey/ships';

export default function CosmicJourneyWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [showShipSelector, setShowShipSelector] = useState(false);
  const gameStarted = useJourneyStore(state => state.gameStarted);
  const setGameStarted = useJourneyStore(state => state.setGameStarted);
  const selectedShip = useJourneyStore(state => state.selectedShip);
  const setSelectedShip = useJourneyStore(state => state.setSelectedShip);
  const health = useJourneyStore(state => state.health);
  const resetHealth = useJourneyStore(state => state.resetHealth);
  const asteroidsDestroyed = useJourneyStore(state => state.asteroidsDestroyed);
  const resetAsteroids = useJourneyStore(state => state.resetAsteroids);
  const enemiesDestroyed = useJourneyStore(state => state.enemiesDestroyed);
  const resetEnemies = useJourneyStore(state => state.resetEnemies);
  const gameStartTime = useJourneyStore(state => state.gameStartTime);
  const setGameStartTime = useJourneyStore(state => state.setGameStartTime);
  
  const [showGameOver, setShowGameOver] = useState(false);
  const [survivalTime, setSurvivalTime] = useState(0);

  const currentShipData = SHIP_MODELS.find(s => s.id === selectedShip) || SHIP_MODELS[0];

  // Cheat code detection: "aayushtussigreatho" unlocks all ships
  useEffect(() => {
    let keyBuffer = '';
    const cheatCode = 'aayushtussigreatho';
    let resetTimer: NodeJS.Timeout;

    const handleCheatCode = (e: KeyboardEvent) => {
      // Only detect when not in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      keyBuffer += e.key.toLowerCase();
      
      // Reset buffer after 2 seconds of no typing
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        keyBuffer = '';
      }, 2000);
      
      // Check if cheat code is typed
      if (keyBuffer.includes(cheatCode)) {
        keyBuffer = '';
        unlockAllShips();
        
        // Show notification
        window.dispatchEvent(new CustomEvent('cheatActivated', {
          detail: { message: 'All starfighters unlocked!' }
        }));
      }
      
      // Limit buffer size
      if (keyBuffer.length > 30) {
        keyBuffer = keyBuffer.slice(-30);
      }
    };

    window.addEventListener('keydown', handleCheatCode);
    return () => {
      window.removeEventListener('keydown', handleCheatCode);
      clearTimeout(resetTimer);
    };
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC key to exit
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameStarted) {
        setGameStarted(false);
        setIsActive(false);
        audioManager.stopAll();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [gameStarted, setGameStarted]);

  // Disable easter eggs and cursor when active
  useEffect(() => {
    if (gameStarted) {
      setIsActive(true);
      // Disable other interactive features
      window.dispatchEvent(new CustomEvent('disableEasterEggs'));
      document.body.classList.add('hide-custom-cursor');
    } else {
      setIsActive(false);
      // Re-enable other features
      window.dispatchEvent(new CustomEvent('enableEasterEggs'));
      document.body.classList.remove('hide-custom-cursor');
    }
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
    setShowGameOver(false);
    resetHealth();
    resetAsteroids();
    setGameStartTime(Date.now());
    // Skip tutorial if already completed
    if (isTutorialCompleted()) {
      setTutorialStep(6);
    } else {
      setTutorialStep(0);
      setCompletedSteps(new Set());
      setPressedKeys(new Set());
    }
    audioManager.initialize().catch(e => console.error("Audio init failed", e));
    audioManager.resume();
  };

  const handleRestart = () => {
    setShowGameOver(false);
    resetHealth();
    resetAsteroids();
    resetEnemies();
    setGameStartTime(Date.now());
    setGameStarted(true);
    audioManager.resume();
  };

  const handleMainMenu = () => {
    setShowGameOver(false);
    setGameStarted(false);
    setIsActive(false);
    audioManager.stopAll();
  };

  // Game Over detection
  useEffect(() => {
    if (gameStarted && health <= 0 && !showGameOver) {
      setShowGameOver(true);
      const elapsed = (Date.now() - gameStartTime) / 1000;
      setSurvivalTime(elapsed);
      audioManager.stopAll();
    }
  }, [health, gameStarted, showGameOver, gameStartTime]);

  // Tutorial progression logic - require all keys in each step
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const step = tutorialStep;
      
      // Track pressed keys for current step
      if (step === 0 && (key === 'w' || key === 's')) {
        setPressedKeys(prev => new Set(prev).add(key));
      } else if (step === 1 && (key === 'a' || key === 'd')) {
        setPressedKeys(prev => new Set(prev).add(key));
      } else if (step === 2 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        setPressedKeys(prev => new Set(prev).add(e.key));
      } else if (step === 3 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        setPressedKeys(prev => new Set(prev).add(e.key));
      } else if (step === 4 && key === 'f') {
        setPressedKeys(prev => new Set(prev).add('f'));
      } else if (step === 5 && e.key === 'Shift') {
        setPressedKeys(prev => new Set(prev).add('shift'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, tutorialStep]);

  // Check if step is complete
  useEffect(() => {
    if (!gameStarted) return;

    const step = tutorialStep;
    let isComplete = false;

    if (step === 0 && pressedKeys.has('w') && pressedKeys.has('s')) {
      isComplete = true;
    } else if (step === 1 && pressedKeys.has('a') && pressedKeys.has('d')) {
      isComplete = true;
    } else if (step === 2 && pressedKeys.has('ArrowLeft') && pressedKeys.has('ArrowRight')) {
      isComplete = true;
    } else if (step === 3 && pressedKeys.has('ArrowUp') && pressedKeys.has('ArrowDown')) {
      isComplete = true;
    } else if (step === 4 && pressedKeys.has('f')) {
      isComplete = true;
    } else if (step === 5 && pressedKeys.has('shift')) {
      isComplete = true;
    }

    if (isComplete) {
      setCompletedSteps(prev => new Set(prev).add(step));
      setTimeout(() => {
        if (step < 5) {
          setTutorialStep(step + 1);
          setPressedKeys(new Set());
        } else {
          // All tutorials complete - save to cookie
          setTutorialCompleted();
          setTimeout(() => setTutorialStep(6), 1000);
        }
      }, 800);
    }
  }, [pressedKeys, tutorialStep, gameStarted]);

  // Mobile - still allow 3D experience
  // Remove mobile check to enable 3D on all devices

  // Desktop experience
  return (
    <section id="journey" className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative w-full h-screen">
        
        {/* 3D Scene (Only loads when game starts) */}
        {gameStarted && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
                <LightsaberLoader />
              </div>
            }>
              <CosmicScene selectedShip={selectedShip} />
            </Suspense>
          </div>
        )}

        {/* Animated Starfield Background (Before game starts) */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${gameStarted ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-black">
            {/* Starfield */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(150)].map((_, i) => {
                const size = Math.random() * 2 + 1;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 2;
                return (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.7 + 0.3,
                      animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
                      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
                    }}
                  />
                );
              })}
            </div>
            {/* Nebula glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold-bright/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black"></div>
          </div>
        </div>

        {/* Main Menu */}
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${gameStarted ? 'opacity-0 pointer-events-none scale-110 blur-lg' : 'opacity-100 blur-0'}`}>
          <div className="relative max-w-7xl w-full mx-4 flex flex-col items-center text-center">
            
            {/* Main card - Landscape orientation with glassmorphic design */}
            <div className="relative w-full px-8 py-10 md:px-16 md:py-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
              
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"></div>
              
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-30">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent animate-border-flow"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent animate-border-flow" style={{ animationDelay: '2s' }}></div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold-primary/30"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold-primary/30"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold-primary/30"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold-primary/30"></div>
              
              {/* Content - Horizontal layout */}
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                
                {/* Left side - Title and description */}
                <div className="text-left">
                  <div className="mb-3 flex items-center gap-2 text-gold-primary/50 text-xs font-mono uppercase tracking-[0.3em]">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold-primary/30"></div>
                    <span>Mission Archive</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-primary/80 to-gold-primary/60 mb-4 tracking-tighter leading-none">
                    JOURNEY
                  </h1>
                  
                  <div className="h-px w-full bg-gradient-to-r from-gold-primary/20 to-transparent mb-6 relative">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-gold-primary/60 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                  </div>

                  <p className="text-gray-300/90 text-lg md:text-xl leading-relaxed font-light">
                    Navigate through a <span className="text-gold-primary/80 font-normal">multidimensional record</span> of professional evolution. Pilot your vessel to explore projects, skills, and milestones across the <span className="text-white/90 font-normal">digital continuum</span>.
                  </p>
                </div>

                {/* Right side - CTA and controls */}
                <div className="flex flex-col items-center md:items-end gap-8">
                  
                  {/* Ship Selection - Refined without color dots */}
                  <div className="w-full max-w-md p-4 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Current Starfighter</span>
                      <button
                        onClick={() => setShowShipSelector(true)}
                        className="text-gold-primary/80 hover:text-gold-primary text-xs font-mono transition-colors"
                      >
                        Change →
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{currentShipData.name}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleStart}
                    className="group relative px-16 py-5 border border-gold-primary/40 bg-white/[0.03] hover:bg-white/[0.08] hover:border-gold-primary/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 ease-out rounded-lg overflow-hidden backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/0 via-gold-primary/10 to-gold-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10 text-gold-primary/90 group-hover:text-gold-primary font-bold text-2xl tracking-[0.3em] transition-colors duration-300">
                      LAUNCH
                    </span>
                  </button>

                  {/* Controls grid */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    {[
                      { keys: 'W/S', label: 'Thrust', icon: '↑↓' },
                      { keys: 'A/D', label: 'Strafe', icon: '←→' },
                      { keys: '←→', label: 'Turn', icon: '↻' },
                      { keys: 'ESC', label: 'Exit', icon: '✕' }
                    ].map((control, i) => (
                      <div key={i} className="group relative flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-gold-primary/20 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-lg text-white/40 group-hover:text-gold-primary/60 transition-colors">{control.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="text-gold-primary/70 font-mono text-xs tracking-wider">{control.keys}</div>
                          <div className="text-[10px] text-gray-400/60 uppercase tracking-widest font-mono">{control.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-500/70 font-mono uppercase tracking-[0.3em]">
                    <div className="w-2 h-2 rounded-full bg-gold-primary/60 shadow-[0_0_10px_rgba(212,175,55,0.3)] animate-pulse"></div>
                    <span>System Online</span>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>

        {/* Game Over Screen */}
        {showGameOver && (
          <GameOver
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
            asteroidCount={asteroidsDestroyed}
            enemyCount={enemiesDestroyed}
            survivalTime={survivalTime}
          />
        )}

        {/* In-Game HUD with cinematic bars */}
        {gameStarted && !showGameOver && (
          <>
            {selectedShip !== 'cruiser' && <UIOverlay />}
            <WaypointNotifications />
            <CruiserHUD selectedShip={selectedShip} />
            <DamageOverlay />
            
            {/* Tutorial tooltips */}
            {tutorialStep < 6 && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[55] flex flex-col gap-4 max-w-xs">
                {[
                  { step: 0, keys: ['W', 'S'], pressKeys: ['w', 's'], action: 'Thrust Forward/Back' },
                  { step: 1, keys: ['A', 'D'], pressKeys: ['a', 'd'], action: 'Strafe Left/Right' },
                  { step: 2, keys: ['←', '→'], pressKeys: ['ArrowLeft', 'ArrowRight'], action: 'Turn Ship' },
                  { step: 3, keys: ['↑', '↓'], pressKeys: ['ArrowUp', 'ArrowDown'], action: 'Elevation Control' },
                  { step: 4, keys: ['F'], pressKeys: ['f'], action: 'Fire Lasers' },
                  { step: 5, keys: ['Shift'], pressKeys: ['shift'], action: 'Boost Speed' }
                ].map((tutorial) => {
                  const isActive = tutorialStep === tutorial.step;
                  const isCompleted = completedSteps.has(tutorial.step);
                  
                  if (!isActive && !isCompleted) return null;
                  
                  return (
                    <div
                      key={tutorial.step}
                      className={`relative p-4 rounded-xl border backdrop-blur-2xl transition-all duration-700 ${
                        isCompleted 
                          ? 'border-white/10 bg-white/5 animate-fadeOut'
                          : 'border-white/20 bg-black/50 animate-fadeIn'
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="flex gap-2">
                          {tutorial.keys.map((key, i) => {
                            const isPressed = pressedKeys.has(tutorial.pressKeys[i]);
                            return (
                              <div 
                                key={i} 
                                className={`px-3 py-2 border rounded font-mono text-sm min-w-[2.5rem] text-center transition-all duration-300 ${
                                  isPressed 
                                    ? 'bg-white/30 border-white/40 text-white scale-105' 
                                    : 'bg-white/10 border-white/20 text-white/80'
                                }`}
                              >
                                {key}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-200 text-sm">
                            {tutorial.action}
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="text-white/60 text-sm animate-fadeIn">✓</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Cinematic black bars - Above HUD */}
            <div className="absolute top-0 left-0 right-0 h-[8vh] bg-gradient-to-b from-black to-transparent z-[60] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-gradient-to-t from-black to-transparent z-[60] pointer-events-none"></div>
          </>
        )}

        {/* Ship Selector Modal */}
        {showShipSelector && (
          <ShipSelectorRevamped
            onSelect={(shipId) => {
              setSelectedShip(shipId);
            }}
            onClose={() => setShowShipSelector(false)}
          />
        )}
      </div>
    </section>
  );
}
