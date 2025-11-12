import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  brightness: number;
  vx: number;
  vy: number;
}

interface FreeStar {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface ConstellationShape {
  name: string;
  stars: Star[];
  connections: [number, number][];
}

interface Comet {
  id: number;
  startX: number;
  startY: number;
  targetX?: number;
  targetY?: number;
  currentX?: number;
  currentY?: number;
}

interface ConstellationProps {
  hoverDistance?: number;
  freeStarCount?: number;
  comets?: Comet[];
}

export const Constellation: React.FC<ConstellationProps> = ({ 
  hoverDistance = 180,
  freeStarCount = 50,
  comets = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const constellationsRef = useRef<ConstellationShape[]>([]);
  const freeStarsRef = useRef<FreeStar[]>([]);
  const animationFrameRef = useRef<number>();
  const mousePosRef = useRef({ x: -1000, y: -1000 }); // Use ref instead of state
  const cometsRef = useRef<Comet[]>([]);
  
  // Update comets ref when prop changes
  useEffect(() => {
    cometsRef.current = comets;
  }, [comets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let isInitialized = false;

    // Initialize actual constellation patterns
    const initConstellations = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      const createStar = (xPercent: number, yPercent: number, size: number, brightness: number): Star => {
        const baseX = w * xPercent;
        const baseY = h * yPercent;
        return {
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          size,
          brightness,
          vx: (Math.random() - 0.5) * 0.05, // Much slower drift
          vy: (Math.random() - 0.5) * 0.05,
        };
      };
      
      constellationsRef.current = [
        // Orion (the hunter)
        {
          name: 'Orion',
          stars: [
            createStar(0.15, 0.25, 2.5, 0.9), // Betelgeuse (shoulder)
            createStar(0.15, 0.45, 1.5, 0.7), // Belt star 1
            createStar(0.18, 0.45, 1.5, 0.7), // Belt star 2
            createStar(0.21, 0.45, 1.5, 0.7), // Belt star 3
            createStar(0.24, 0.25, 2.5, 0.9), // Rigel (foot)
            createStar(0.18, 0.15, 1.8, 0.8), // Head
            createStar(0.24, 0.55, 1.8, 0.8), // Other foot
          ],
          connections: [[0, 5], [5, 4], [4, 6], [0, 1], [1, 2], [2, 3], [3, 6]]
        },
        
        // Big Dipper (part of Ursa Major)
        {
          name: 'Big Dipper',
          stars: [
            createStar(0.55, 0.2, 2, 0.8),
            createStar(0.6, 0.22, 2, 0.8),
            createStar(0.65, 0.2, 2, 0.8),
            createStar(0.68, 0.18, 2, 0.8),
            createStar(0.7, 0.25, 1.8, 0.7),
            createStar(0.72, 0.32, 1.8, 0.7),
            createStar(0.74, 0.38, 1.8, 0.7),
          ],
          connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
        },
        
        // Cassiopeia (the W)
        {
          name: 'Cassiopeia',
          stars: [
            createStar(0.4, 0.65, 1.8, 0.8),
            createStar(0.45, 0.7, 1.8, 0.8),
            createStar(0.5, 0.65, 1.8, 0.8),
            createStar(0.55, 0.72, 1.8, 0.8),
            createStar(0.6, 0.67, 1.8, 0.8),
          ],
          connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
        },
        
        // Leo (the lion)
        {
          name: 'Leo',
          stars: [
            createStar(0.75, 0.75, 2.2, 0.85), // Regulus
            createStar(0.8, 0.72, 1.6, 0.7),
            createStar(0.83, 0.68, 1.6, 0.7),
            createStar(0.85, 0.75, 1.8, 0.75),
            createStar(0.88, 0.8, 1.6, 0.7),
            createStar(0.82, 0.82, 1.5, 0.65),
          ],
          connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
        },
        
        // Cygnus (the swan/Northern Cross)
        {
          name: 'Cygnus',
          stars: [
            createStar(0.3, 0.35, 2, 0.85), // Deneb
            createStar(0.35, 0.42, 1.7, 0.75),
            createStar(0.4, 0.48, 1.7, 0.75),
            createStar(0.35, 0.5, 1.5, 0.7),
            createStar(0.35, 0.35, 1.5, 0.7),
          ],
          connections: [[0, 1], [1, 2], [1, 3], [1, 4]]
        },
      ];
    };

    // Initialize free-flowing stars
    const initFreeStars = () => {
      freeStarsRef.current = Array.from({ length: freeStarCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        vx: (Math.random() - 0.5) * 0.1, // Much slower
        vy: (Math.random() - 0.5) * 0.1,
      }));
    };

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (!isInitialized) {
        initConstellations();
        initFreeStars();
        isInitialized = true;
      }
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let pulseTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulseTime += 0.01;

      // Update and draw free-flowing stars first (background layer)
      freeStarsRef.current.forEach(star => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        // Calculate distance to mouse
        const dx = star.x - mousePosRef.current.x;
        const dy = star.y - mousePosRef.current.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse interaction - repel stars
        if (distanceToMouse < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distanceToMouse) / 150;
          star.x += Math.cos(angle) * force * 2;
          star.y += Math.sin(angle) * force * 2;
        }
        
        // Comet interaction - repel free stars
        cometsRef.current.forEach(comet => {
          if (comet.currentX !== undefined && comet.currentY !== undefined) {
            const dx = star.x - comet.currentX;
            const dy = star.y - comet.currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 80; // Repel within 80px of comet
            
            if (distance < repelRadius && distance > 0) {
              const angle = Math.atan2(dy, dx);
              const force = (repelRadius - distance) / repelRadius;
              // Push star away from comet
              star.x += Math.cos(angle) * force * 6;
              star.y += Math.sin(angle) * force * 6;
            }
          }
        });
        
        // Draw free star in white
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      constellationsRef.current.forEach(constellation => {
        // Update star positions with CONSTANT drift - never stops
        constellation.stars.forEach(star => {
          star.x += star.vx;
          star.y += star.vy;
          
          // Check for comet repulsion
          cometsRef.current.forEach(comet => {
            if (comet.currentX !== undefined && comet.currentY !== undefined) {
              const dx = star.x - comet.currentX;
              const dy = star.y - comet.currentY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const repelRadius = 100; // Repel within 100px of comet
              
              if (distance < repelRadius && distance > 0) {
                const angle = Math.atan2(dy, dx);
                const force = (repelRadius - distance) / repelRadius;
                // Push star away from comet
                star.x += Math.cos(angle) * force * 8;
                star.y += Math.sin(angle) * force * 8;
              }
            }
          });
          
          // Check distance from base
          const dx = star.baseX - star.x;
          const dy = star.baseY - star.y;
          const distanceFromBase = Math.sqrt(dx * dx + dy * dy);
          
          // Spring back to base position slowly (stronger pull the farther away)
          if (distanceFromBase > 1) {
            const springStrength = 0.02; // Weaker spring constant for slower return
            const angle = Math.atan2(dy, dx);
            star.vx += Math.cos(angle) * springStrength * distanceFromBase * 0.02;
            star.vy += Math.sin(angle) * springStrength * distanceFromBase * 0.02;
            
            // Add stronger damping for smoother return
            star.vx *= 0.92;
            star.vy *= 0.92;
          }
          
          // Bounce back when hitting the boundary (60px radius for more space)
          if (distanceFromBase > 60) {
            const angle = Math.atan2(dy, dx);
            star.x = star.baseX - Math.cos(angle) * 60;
            star.y = star.baseY - Math.sin(angle) * 60;
          }
        });
        
        // Check if mouse is hovering over THIS specific constellation
        let isHovered = false;
        let hoveredStarIndex = -1;
        
        // First check if mouse is over any star
        for (let i = 0; i < constellation.stars.length; i++) {
          const star = constellation.stars[i];
          const dx = star.x - mousePosRef.current.x;
          const dy = star.y - mousePosRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < star.size * 8) { // Hover area scales with star size
            isHovered = true;
            hoveredStarIndex = i;
            break;
          }
        }
        
        // If not hovering star, check if hovering any line
        if (!isHovered) {
          for (const [startIdx, endIdx] of constellation.connections) {
            const start = constellation.stars[startIdx];
            const end = constellation.stars[endIdx];
            
            // Calculate distance from mouse to line segment
            const lineLength = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
            const dot = ((mousePosRef.current.x - start.x) * (end.x - start.x) + (mousePosRef.current.y - start.y) * (end.y - start.y)) / (lineLength * lineLength);
            
            if (dot >= 0 && dot <= 1) {
              const projX = start.x + dot * (end.x - start.x);
              const projY = start.y + dot * (end.y - start.y);
              const distanceToLine = Math.sqrt((mousePosRef.current.x - projX) ** 2 + (mousePosRef.current.y - projY) ** 2);
              
              if (distanceToLine < 10) { // 10px from line
                isHovered = true;
                break;
              }
            }
          }
        }

        // Draw constellation connections FIRST (behind stars) with pulsing effect
        constellation.connections.forEach(([startIdx, endIdx]) => {
          const start = constellation.stars[startIdx];
          const end = constellation.stars[endIdx];
          
          // Pulsing effect - oscillates between 0.1 and 0.3
          const pulseValue = 0.15 + Math.sin(pulseTime) * 0.1;
          const pulseGlow = 2 + Math.sin(pulseTime) * 1;
          
          // Base line with pulse
          ctx.strokeStyle = `rgba(255, 255, 255, ${pulseValue})`;
          ctx.lineWidth = 0.5;
          ctx.shadowBlur = pulseGlow;
          ctx.shadowColor = `rgba(255, 255, 255, ${pulseValue})`;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          
          if (isHovered) {
            // Stronger glow effect when THIS constellation is hovered
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
          }
        });

        // Draw stars ON TOP of everything
        constellation.stars.forEach((star, starIdx) => {
          let starSize = star.size;
          let starOpacity = star.brightness * 0.6;
          
          // Draw normal state first
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Add INTENSE glow ONLY when THIS constellation is hovered
          if (isHovered) {
            starSize = star.size * 2.5;
            
            // Massive outer glow
            ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
            ctx.shadowColor = 'rgba(255, 215, 0, 1)';
            ctx.shadowBlur = 60;
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Large glow
            ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Medium glow
            ctx.fillStyle = 'rgba(255, 230, 0, 0.5)';
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'rgba(255, 230, 0, 1)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Main body
            ctx.fillStyle = 'rgba(255, 240, 100, 1)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright core
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 1)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw constellation name when hovered
        if (isHovered) {
          const centerX = constellation.stars.reduce((sum, s) => sum + s.x, 0) / constellation.stars.length;
          const centerY = constellation.stars.reduce((sum, s) => sum + s.y, 0) / constellation.stars.length;
          
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(constellation.name, centerX, centerY - 30);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hoverDistance, freeStarCount]); // Removed mousePos from dependencies

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 1 }}
    />
  );
};
