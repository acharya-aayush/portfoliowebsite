import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const getMousePos = (e: MouseEvent, container: HTMLElement | null) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  }
  return { x: e.clientX, y: e.clientY };
};

interface BulletHole {
  id: number;
  x: number;
  y: number;
  scale: number; // Size multiplier (1x to 3x)
}

interface MuzzleFlash {
  id: number;
}

interface ShootingCrosshairProps {
  color?: string;
  containerRef?: React.RefObject<HTMLElement>;
  onShoot?: (x: number, y: number) => void;
}

export const ShootingCrosshair: React.FC<ShootingCrosshairProps> = ({ 
  color = '#ff0000', 
  containerRef = null,
  onShoot
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);
  
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);
  const [muzzleFlashes, setMuzzleFlashes] = useState<MuzzleFlash[]>([]);
  
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      mouseRef.current = getMousePos(ev, containerRef?.current || null);

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        if (
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom
        ) {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });
        } else {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 1 });
        }
      }
    };

    const handleClick = (ev: MouseEvent) => {
      const mouse = getMousePos(ev, containerRef?.current || null);
      
      // Play random gunshot sound from 9 available sounds
      const soundIndex = Math.floor(Math.random() * 9) + 1;
      let audioPath = '';
      
      // First 4 sounds are gs1-gs4.mp3, next 5 are gunshots (1-5).mp3
      if (soundIndex <= 4) {
        audioPath = `/skill/gs${soundIndex}.mp3`;
      } else {
        audioPath = `/skill/gunshots (${soundIndex - 4}).mp3`;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Ignore errors
      
      // Muzzle flash
      const flashId = Date.now();
      setMuzzleFlashes(prev => [...prev, { id: flashId }]);
      setTimeout(() => {
        setMuzzleFlashes(prev => prev.filter(f => f.id !== flashId));
      }, 100);
      
      // Call onShoot callback and check if hit
      const isHit = onShoot ? onShoot(mouse.x, mouse.y) : false;
      
      // Create bullet hole for misses with progressive scaling
      if (!isHit) {
        const holeId = Date.now();
        
        // Calculate scale based on current number of holes (1x to 3x)
        setBulletHoles(prev => {
          const currentCount = prev.length;
          // Scale grows from 1x to 3x based on number of existing holes
          const scale = Math.min(1 + (currentCount * 0.15), 3);
          return [...prev, { id: holeId, x: mouse.x, y: mouse.y, scale }];
        });
        
        // Remove bullet hole after 5 seconds with fade
        setTimeout(() => {
          setBulletHoles(prev => prev.filter(h => h.id !== holeId));
        }, 5000);
      }
      
      // Crosshair recoil animation
      gsap.fromTo([lineHorizontalRef.current, lineVerticalRef.current], 
        { scale: 1.3, opacity: 1 },
        { scale: 1, duration: 0.1, ease: 'power2.out' }
      );
      
      // Powerful screen shake/recoil effect
      const targetElement = containerRef?.current || document.body;
      const shakeIntensity = 12; // Much more powerful shake
      const randomX = (Math.random() - 0.5) * shakeIntensity * 2;
      const randomY = (Math.random() - 0.5) * shakeIntensity * 2;
      
      gsap.timeline()
        .fromTo(targetElement,
          { x: randomX, y: randomY },
          { 
            x: -randomX * 0.5, 
            y: -randomY * 0.5, 
            duration: 0.05, 
            ease: 'power2.out'
          }
        )
        .to(targetElement, {
          x: 0,
          y: 0,
          duration: 0.2,
          ease: 'elastic.out(2, 0.3)',
          clearProps: 'transform'
        });
    };

    const target = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('click', handleClick);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });

    const onMouseMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouseRef.current.y;

      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      });

      requestAnimationFrame(render);

      target.removeEventListener('mousemove', onMouseMove);
    };

    target.addEventListener('mousemove', onMouseMove);

    const render = () => {
      renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.current = mouseRef.current.y;

      for (const key in renderedStyles) {
        renderedStyles[key as keyof typeof renderedStyles].previous = lerp(
          renderedStyles[key as keyof typeof renderedStyles].previous,
          renderedStyles[key as keyof typeof renderedStyles].current,
          renderedStyles[key as keyof typeof renderedStyles].amt
        );
      }

      if (lineHorizontalRef.current && lineVerticalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }

      requestAnimationFrame(render);
    };

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('click', handleClick);
    };
  }, [containerRef, onShoot]);

  return (
    <div
      ref={cursorRef}
      className="shooting-cursor"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50
      }}
    >
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      
      {/* Crosshair lines */}
      <div
        ref={lineHorizontalRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${color} 48%, ${color} 52%, transparent 100%)`,
          pointerEvents: 'none',
          transform: 'translateY(50%)',
          opacity: 0,
          boxShadow: `0 0 10px ${color}`
        }}
      />
      <div
        ref={lineVerticalRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '2px',
          background: `linear-gradient(180deg, transparent 0%, ${color} 48%, ${color} 52%, transparent 100%)`,
          pointerEvents: 'none',
          transform: 'translateX(50%)',
          opacity: 0,
          boxShadow: `0 0 10px ${color}`
        }}
      />
      
      {/* Muzzle flashes - removed the red dot */}
      
      {/* Bullet holes with crack image - size grows with more shots */}
      {bulletHoles.map(hole => {
        const baseSize = 40;
        const size = baseSize * hole.scale;
        return (
          <div
            key={hole.id}
            style={{
              position: 'absolute',
              left: hole.x,
              top: hole.y,
              width: `${size}px`,
              height: `${size}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              animation: 'bulletHoleAppear 5s ease-in-out forwards'
            }}
          >
            <img 
              src="/skill/crackk.png" 
              alt="" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: 0.7
              }}
            />
          </div>
        );
      })}
      
      <style>{`
        @keyframes bulletHoleAppear {
          0% { 
            transform: translate(-50%, -50%) scale(0) rotate(0deg); 
            opacity: 0; 
          }
          5% {
            transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 360}deg);
            opacity: 0.7;
          }
          85% {
            transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 360}deg);
            opacity: 0.7;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1) rotate(${Math.random() * 360}deg); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};
