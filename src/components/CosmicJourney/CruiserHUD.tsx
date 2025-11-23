import { motion } from 'framer-motion';
import { useJourneyStore } from '@/lib/journey/store';

interface CruiserHUDProps {
  selectedShip: string;
}

export const CruiserHUD = ({ selectedShip }: CruiserHUDProps) => {
  const velocity = useJourneyStore((state) => state.velocity);
  const health = useJourneyStore((state) => state.health);
  const maxHealth = useJourneyStore((state) => state.maxHealth);
  
  // Only show for cruiser
  if (selectedShip !== 'cruiser') return null;

  // Mock weapon data - will be dynamic later
  const weaponSystems = [
    { name: 'PLASMA CANNONS', charge: 100, status: 'READY' },
    { name: 'MISSILE PODS', ammo: 24, status: 'ARMED' },
    { name: 'RAILGUN', charge: 85, status: 'CHARGING' },
    { name: 'EMP BURST', cooldown: 0, status: 'READY' }
  ];

  const shieldStatus = 100;
  const hullIntegrity = 100;
  const powerOutput = Math.min(100, (velocity / 40) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="fixed left-6 top-20 z-50 pointer-events-none font-mono"
    >
      {/* Main HUD Container */}
      <div className="relative">
        {/* Corner Brackets - Holographic Style */}
        <div className="absolute -left-4 -top-4 w-10 h-10 border-l-2 border-t-2 border-cyan-400/60"></div>
        <div className="absolute -right-4 -top-4 w-10 h-10 border-r-2 border-t-2 border-cyan-400/60"></div>
        <div className="absolute -left-4 -bottom-4 w-10 h-10 border-l-2 border-b-2 border-cyan-400/60"></div>
        <div className="absolute -right-4 -bottom-4 w-10 h-10 border-r-2 border-b-2 border-cyan-400/60"></div>

        <div className="bg-gradient-to-br from-black/30 via-cyan-950/20 to-black/30 backdrop-blur-md border border-cyan-400/30 p-6 w-[450px] shadow-[0_0_40px_rgba(34,211,238,0.3),inset_0_0_60px_rgba(34,211,238,0.05)]">
          {/* Header */}
          <div className="border-b border-cyan-400/30 pb-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-300 text-lg font-bold tracking-wider" style={{ textShadow: '0 0 20px rgba(34,211,238,0.8)' }}>BATTLECRUISER</span>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,1)]"></div>
                <span className="text-emerald-400 text-xs font-bold" style={{ textShadow: '0 0 10px rgba(52,211,153,0.8)' }}>ONLINE</span>
              </div>
            </div>
            <div className="text-cyan-400/60 text-[10px] mt-1 tracking-[0.3em]">MK-IV CLASS • HEAVY ASSAULT VARIANT</div>
          </div>

          {/* Holographic Attitude Indicator */}
          <div className="flex gap-2 mb-2">
            {/* Pitch/Roll Indicator */}
            <div className="flex-1 relative h-24 border border-cyan-400/30 bg-cyan-950/10 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="70" height="70" className="opacity-60">
                  <circle cx="35" cy="35" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/40" />
                  <circle cx="35" cy="35" r="21" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/40" />
                  <circle cx="35" cy="35" r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400/40" />
                  <line x1="35" y1="3" x2="35" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
                  <line x1="35" y1="56" x2="35" y2="67" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
                  <line x1="3" y1="35" x2="14" y2="35" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
                  <line x1="56" y1="35" x2="67" y2="35" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
                </svg>
                <motion.div 
                  className="absolute w-0.5 h-9 bg-gradient-to-b from-cyan-400 to-cyan-600"
                  animate={{ rotate: Math.sin(Date.now() / 1000) * 5 }}
                  style={{ transformOrigin: 'center', boxShadow: '0 0 10px rgba(34,211,238,0.8)' }}
                />
              </div>
              <div className="absolute bottom-1 left-1 text-[8px] text-cyan-400/50">ATTITUDE</div>
            </div>

            {/* Vertical Speed */}
            <div className="w-16 relative border border-cyan-400/30 bg-cyan-950/10 backdrop-blur-sm">
              <div className="absolute inset-x-0 top-1 bottom-1 flex flex-col justify-between items-center">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="flex items-center w-full px-1">
                    <div className={`h-[1px] bg-cyan-400/30 ${i === 5 ? 'w-full' : 'w-2'}`}></div>
                    {i === 5 && <span className="ml-1 text-[8px] text-cyan-400">0</span>}
                  </div>
                ))}
              </div>
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-6 h-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                animate={{ top: `${50 + Math.sin(Date.now() / 1500) * 20}%` }}
              />
              <div className="absolute bottom-1 left-1 text-[8px] text-cyan-400/50 [writing-mode:vertical-lr] rotate-180">V-SPEED</div>
            </div>
          </div>

          {/* Ship Status */}
          <div className="space-y-1.5 mb-2">
            {/* Health Bar - Segmented Display */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-300 tracking-wider">HEALTH STATUS</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums" style={{ textShadow: '0 0 10px rgba(52,211,153,0.8)' }}>{health}/{maxHealth}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: maxHealth }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-3 border border-emerald-400/50 bg-emerald-950/20 backdrop-blur-sm overflow-hidden relative"
                  >
                    {i < health && (
                      <>
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-600/80 via-emerald-400/80 to-emerald-300/80"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          style={{ boxShadow: '0 0 15px rgba(52,211,153,0.8)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-300 tracking-wider">SHIELDS</span>
                <span className="text-cyan-400 font-bold text-sm tabular-nums" style={{ textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>{shieldStatus}%</span>
              </div>
              <div className="h-2.5 bg-cyan-950/20 backdrop-blur-sm border border-cyan-400/30 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600/80 via-cyan-400/80 to-cyan-300/80 backdrop-blur-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${shieldStatus}%` }}
                  style={{ boxShadow: '0 0 20px rgba(34,211,238,0.8)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-300 tracking-wider">HULL INTEGRITY</span>
                <span className="text-blue-400 font-bold text-lg tabular-nums" style={{ textShadow: '0 0 10px rgba(59,130,246,0.8)' }}>{hullIntegrity}%</span>
              </div>
              <div className="h-2.5 bg-blue-950/20 backdrop-blur-sm border border-blue-400/30 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600/80 via-blue-400/80 to-blue-300/80 backdrop-blur-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${hullIntegrity}%` }}
                  style={{ boxShadow: '0 0 20px rgba(59,130,246,0.8)' }}
                />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.05)_8px,rgba(255,255,255,0.05)_9px)]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-teal-300 tracking-wider">POWER OUTPUT</span>
                <span className="text-teal-400 font-bold text-lg tabular-nums" style={{ textShadow: '0 0 10px rgba(20,184,166,0.8)' }}>{Math.round(powerOutput)}%</span>
              </div>
              <div className="h-2.5 bg-teal-950/20 backdrop-blur-sm border border-teal-400/30 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-600/80 via-teal-400/80 to-teal-300/80 backdrop-blur-sm"
                  animate={{ width: `${powerOutput}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ boxShadow: '0 0 20px rgba(20,184,166,0.8)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10"></div>
              </div>
            </div>
          </div>

          {/* Weapon Systems */}
          <div className="border-t border-cyan-400/30 pt-2">
            <div className="text-xs text-cyan-300 tracking-[0.3em] mb-2" style={{ textShadow: '0 0 10px rgba(34,211,238,0.6)' }}>WEAPON SYSTEMS</div>
            <div className="space-y-1.5">
              {weaponSystems.map((weapon, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-cyan-950/10 backdrop-blur-sm p-2 border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      weapon.status === 'READY' ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,1)]' :
                      weapon.status === 'ARMED' ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]' :
                      'bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(59,130,246,1)]'
                    }`}></div>
                    <span className="text-cyan-200">{weapon.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {weapon.charge !== undefined && (
                      <span className="text-cyan-400 font-bold tabular-nums" style={{ textShadow: '0 0 8px rgba(34,211,238,0.8)' }}>{weapon.charge}%</span>
                    )}
                    {weapon.ammo !== undefined && (
                      <span className="text-emerald-400 font-bold tabular-nums" style={{ textShadow: '0 0 8px rgba(52,211,153,0.8)' }}>{weapon.ammo}</span>
                    )}
                    <span className={`text-[10px] ${
                      weapon.status === 'READY' ? 'text-emerald-400' :
                      weapon.status === 'ARMED' ? 'text-cyan-400' :
                      'text-blue-400'
                    }`} style={{ textShadow: '0 0 6px currentColor' }}>{weapon.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity Display */}
          <div className="border-t border-cyan-400/30 mt-2 pt-2 bg-cyan-950/5 backdrop-blur-sm p-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400/70 tracking-[0.3em]">VELOCITY</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl text-cyan-400 font-bold tabular-nums" style={{ textShadow: '0 0 25px rgba(34,211,238,1)' }}>
                  {Math.round(velocity)}
                </span>
                <span className="text-xs text-cyan-400/60">U/S</span>
              </div>
            </div>
          </div>

          {/* Tactical Info */}
          <div className="mt-2 pt-2 border-t border-cyan-400/30 space-y-1.5 text-xs">
            <div className="flex justify-between text-cyan-300/60">
              <span>TARGETING:</span>
              <span className="text-emerald-400" style={{ textShadow: '0 0 8px rgba(52,211,153,0.8)' }}>ACTIVE</span>
            </div>
            <div className="flex justify-between text-cyan-300/60">
              <span>COUNTERMEASURES:</span>
              <span className="text-blue-400" style={{ textShadow: '0 0 8px rgba(59,130,246,0.8)' }}>STANDBY</span>
            </div>
            <div className="flex justify-between text-cyan-300/60">
              <span>THREAT LEVEL:</span>
              <span className="text-emerald-400" style={{ textShadow: '0 0 8px rgba(52,211,153,0.8)' }}>LOW</span>
            </div>
          </div>

          {/* Scan Lines Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <motion.div
              className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ boxShadow: '0 0 15px rgba(34,211,238,0.8)' }}
            />
          </div>
          
          {/* Holographic Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34,211,238,0.3) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(34,211,238,0.3) 20px)'
            }}></div>
          </div>
        </div>

        {/* Control Hints */}
        <div className="mt-3 text-xs text-cyan-400/50 space-y-1 pl-3 tracking-wider">
          <div>F • PLASMA CANNONS</div>
          <div>G • MISSILE SALVO</div>
          <div>H • RAILGUN CHARGE</div>
          <div>J • EMP BURST</div>
        </div>
      </div>
    </motion.div>
  );
};
