import { useJourneyStore } from '@/lib/journey/store';

export const DamageOverlay = () => {
  const damageFlash = useJourneyStore((state) => state.damageFlash);
  
  if (damageFlash <= 0) return null;
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(ellipse at center, rgba(255, 0, 0, ${damageFlash * 0.3}) 0%, rgba(139, 0, 0, ${damageFlash * 0.5}) 50%, rgba(255, 0, 0, ${damageFlash * 0.2}) 100%)`,
        transition: 'opacity 0.1s ease-out',
        opacity: damageFlash,
      }}
    >
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          boxShadow: `inset 0 0 ${100 * damageFlash}px ${50 * damageFlash}px rgba(255, 0, 0, ${damageFlash * 0.4})`,
        }}
      />
    </div>
  );
};
