import React, { useMemo } from 'react';
import { useJourneyStore as useStore } from '@/lib/journey/store';
import { TIMELINE_EVENTS } from '@/lib/journey/constants';

const SpeedometerArc = ({ velocity }: { velocity: number }) => {
    // Map physics velocity (max ~80) to a dramatic display speed (0 - 1000 km/h)
    // Multiplier: 12x. 
    // 40 (normal) -> 480 km/h
    // 80 (boost) -> 960 km/h
    
    // Add slight jitter for realism when moving
    const jitter = velocity > 1 ? (Math.random() * 4 - 2) : 0;
    const displaySpeed = Math.max(0, Math.round(velocity * 12 + jitter));

    // Gauge percent (0-1)
    // Map 0-90 units to 0-100% gauge
    const percent = Math.min(velocity / 90, 1);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // Semi-circle arc length
    const arcLength = circumference * 0.5;
    const dashOffset = arcLength - (arcLength * percent);

    return (
        <div className="relative w-48 h-24 flex justify-center items-end overflow-hidden">
             <svg className="w-full h-full" viewBox="0 0 120 60" preserveAspectRatio="none">
                {/* Background Arc */}
                <path 
                    d="M 10,60 A 50,50 0 0,1 110,60" 
                    fill="none" 
                    stroke="#333" 
                    strokeWidth="6" 
                    strokeLinecap="butt"
                />
                {/* Active Arc */}
                <path 
                    d="M 10,60 A 50,50 0 0,1 110,60" 
                    fill="none" 
                    stroke="#d4af37" 
                    strokeWidth="4" 
                    strokeDasharray={arcLength}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    className="transition-all duration-100 ease-linear"
                />
                {/* Ticks */}
                <g stroke="#d4af37" strokeWidth="1" opacity="0.5">
                    {[0, 20, 40, 60, 80, 100].map((tick, i) => {
                        const angle = 180 - (tick / 100) * 180;
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 60 + Math.cos(rad) * 45;
                        const y1 = 60 - Math.sin(rad) * 45;
                        const x2 = 60 + Math.cos(rad) * 55;
                        const y2 = 60 - Math.sin(rad) * 55;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                    })}
                </g>
             </svg>
             <div className="absolute bottom-0 flex flex-col items-center mb-2">
                 <span className="text-3xl font-bold text-[#f4cf47] font-mono tracking-tighter">
                    {displaySpeed}
                 </span>
                 <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">km/h</span>
             </div>
        </div>
    )
}

const HudPanel = ({ children, title, align = 'left' }: { children?: React.ReactNode, title: string, align?: 'left'|'right' }) => (
    <div className={`flex-1 h-24 bg-black/40 backdrop-blur-md border-t border-[#d4af37]/30 relative p-4 flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
        <div className={`absolute top-0 ${align === 'right' ? 'right-0' : 'left-0'} w-2 h-2 bg-[#d4af37]`} />
        <h3 className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-[0.2em] border-b border-gray-800 w-full pb-1">
            {title}
        </h3>
        {children}
    </div>
)

export const UIOverlay: React.FC = () => {
  const activeEventId = useStore((state) => state.activeEventId);
  const velocity = useStore((state) => state.velocity);
  const zPos = useStore((state) => state.zPos);
  const xPos = useStore((state) => state.xPos);
  const yPos = useStore((state) => state.yPos);
  const setGameStarted = useStore(state => state.setGameStarted);
  const health = useStore((state) => state.health);
  const maxHealth = useStore((state) => state.maxHealth);
  
  const activeEvent = useMemo(() => 
    TIMELINE_EVENTS.find(e => e.id === activeEventId), 
  [activeEventId]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden font-sans text-[#d4af37]">
      
      {/* DISENGAGE BUTTON - Essential for embedded portfolios to exit the game */}
      <button
        onClick={() => setGameStarted(false)}
        className="absolute top-4 left-4 pointer-events-auto px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] hover:bg-red-500 hover:text-white transition-colors font-mono uppercase tracking-widest backdrop-blur-sm z-50"
      >
        DISENGAGE SYSTEM
      </button>

      {/* Augmented Reality Event Card */}
      <div className={`absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-full max-w-sm transition-opacity duration-700 ease-in-out ${activeEvent ? 'opacity-100' : 'opacity-0'}`}>
         {activeEvent && (
           <div className="pointer-events-auto rounded-lg bg-black/40 backdrop-blur-md border border-[#d4af37]/20 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                   <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f4cf47] text-xs font-semibold">
                     {activeEvent.date}
                   </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-0.5 leading-tight">
                  {activeEvent.title}
                </h2>
                <h3 className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
                  {activeEvent.subtitle}
                </h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed font-light">
                  {activeEvent.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeEvent.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[10px] border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
           </div>
         )}
      </div>

      {/* BOTTOM HUD CONSOLE */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-end justify-between select-none pointer-events-auto">
          
          {/* Left Wing: Navigation */}
          <div className="hidden md:flex flex-1 items-end">
              <div className="w-12 h-24 border-r border-[#d4af37]/20 skew-x-12 bg-black/20 backdrop-blur-sm origin-bottom-right mr-1"></div>
              <HudPanel title="NAV DATA" align="left">
                  <div className="flex gap-6 font-mono text-xs">
                      <div className="flex flex-col gap-1">
                         <span className="text-gray-500 text-[9px]">LONGITUDE</span>
                         <span>{xPos.toFixed(1)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-gray-500 text-[9px]">LATITUDE</span>
                         <span>{yPos.toFixed(1)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-gray-500 text-[9px]">CHRONO DEPTH</span>
                         <span>{Math.abs(zPos).toFixed(0)}</span>
                      </div>
                  </div>
                  <div className="mt-auto text-[9px] text-gray-600 flex gap-2">
                       <span>[W/S] THRUST</span>
                       <span>[A/D] STRAFE</span>
                  </div>
              </HudPanel>
          </div>

          {/* Center Console: Speedometer */}
          <div className="relative flex flex-col items-center justify-end mx-2 mb-0">
               <div className="w-64 h-32 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md rounded-t-full border-t border-[#d4af37]/50 flex items-end justify-center pb-2 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                   <SpeedometerArc velocity={velocity} />
               </div>
               {/* Bottom Connector */}
               <div className="h-2 w-full bg-[#d4af37]/20 flex items-center justify-center gap-1">
                   <div className="w-20 h-1 bg-[#d4af37]"></div>
               </div>
               {/* Hull Integrity - Below connector */}
               <div className="mt-1 flex items-center gap-2 text-[9px] font-mono text-gray-500">
                   <span className="uppercase tracking-wider">HULL</span>
                   <span className="text-[#d4af37] font-bold">{health}/{maxHealth}</span>
               </div>
          </div>

          {/* Right Wing: Systems */}
          <div className="hidden md:flex flex-1 items-end">
              <HudPanel title="SYS STATUS" align="right">
                   <div className="flex gap-4 font-mono text-xs items-center justify-end">
                      <div className="text-right">
                         <div className="text-[9px] text-gray-500">MAIN ENGINE</div>
                         <div className="text-[#f4cf47]">ONLINE</div>
                      </div>
                      <div className="w-px h-6 bg-gray-700"></div>
                      <div className="text-right">
                         <div className="text-[9px] text-gray-500">WEAPONS</div>
                         <div className="text-[#f4cf47]">ARMED</div>
                      </div>
                  </div>
                  <div className="mt-auto text-[9px] text-gray-600 flex gap-2 justify-end">
                       <span>[SHIFT] BOOST</span>
                       <span>[CLICK] FIRE</span>
                  </div>
              </HudPanel>
              <div className="w-12 h-24 border-l border-[#d4af37]/20 -skew-x-12 bg-black/20 backdrop-blur-sm origin-bottom-left ml-1"></div>
          </div>

          {/* Mobile Simplification */}
          <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-[#d4af37]">
              <div>POS: {Math.abs(zPos).toFixed(0)}</div>
              <div>SYS: ONLINE</div>
          </div>
      </div>

    </div>
  );
};