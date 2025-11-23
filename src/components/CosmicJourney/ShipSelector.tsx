import React, { useState, useEffect } from 'react';
import { useJourneyStore } from '@/lib/journey/store';
import { SHIP_MODELS, getUnlockedShips, type ShipModel } from '@/lib/journey/ships';

interface ShipSelectorProps {
  onSelect: (shipId: string) => void;
  onClose: () => void;
}

export const ShipSelector: React.FC<ShipSelectorProps> = ({ onSelect, onClose }) => {
  const [unlockedShips, setUnlockedShips] = useState<string[]>([]);
  const selectedShip = useJourneyStore(state => state.selectedShip);

  useEffect(() => {
    // Refresh unlocked ships from cookies
    const checkUnlocked = () => {
      setUnlockedShips(getUnlockedShips());
    };
    
    checkUnlocked();
    
    // Listen for waypoint events and cheat codes to refresh
    window.addEventListener('waypointCollected', checkUnlocked);
    window.addEventListener('shipsUnlocked', checkUnlocked);
    return () => {
      window.removeEventListener('waypointCollected', checkUnlocked);
      window.removeEventListener('shipsUnlocked', checkUnlocked);
    };
  }, []);

  const handleSelect = (shipId: string) => {
    onSelect(shipId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-3xl w-full mx-4 p-6 rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Starfighter Selection</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border border-white/20 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>

        {/* Ship Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHIP_MODELS.map((ship) => {
            const isUnlocked = unlockedShips.includes(ship.id);
            const isSelected = selectedShip === ship.id;

            return (
              <div
                key={ship.id}
                className={`relative p-5 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-gold-primary/60 bg-gold-primary/10'
                    : isUnlocked
                    ? 'border-white/20 bg-white/5 hover:border-white/30 cursor-pointer'
                    : 'border-white/10 bg-black/20 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && handleSelect(ship.id)}
              >
                {/* Status indicator */}
                <div className="absolute top-3 right-3">
                  {!isUnlocked ? (
                    <div className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-500">LOCKED</div>
                  ) : isSelected ? (
                    <div className="px-2 py-0.5 bg-gold-primary/20 rounded text-xs text-gold-primary">ACTIVE</div>
                  ) : null}
                </div>

                {/* Ship Info */}
                <h3 className="text-lg font-bold text-white mb-1">{ship.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{ship.description}</p>

                {/* Stats - Compact */}
                <div className="flex gap-4 mb-3">
                  {[
                    { label: 'SPD', value: ship.stats.speed },
                    { label: 'HDL', value: ship.stats.handling },
                    { label: 'PWR', value: ship.stats.firepower },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-1">
                      <div className="text-gray-500 text-[10px] font-mono">{stat.label}</div>
                      <div className="text-white text-sm font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Colors Preview - Inline */}
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ship.engineColor }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ship.laserColor }} />
                  {!isUnlocked && (
                    <span className="ml-auto text-[10px] text-gray-500">{ship.unlockCondition}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
