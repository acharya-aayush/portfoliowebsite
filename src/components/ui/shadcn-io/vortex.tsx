import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  rangeHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  speed: number;
  angle: number;
}

export const Vortex: React.FC<VortexProps> = ({
  children,
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 800,
  baseHue = 45, // Gold hue
  rangeHue = 30, // Range around gold
  baseSpeed = 0.0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "#000000",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setAnimationFrame] = useState<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const noise3D = useRef(createNoise3D());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      radius: baseRadius + Math.random() * rangeRadius,
      hue: baseHue + Math.random() * rangeHue,
      speed: baseSpeed + Math.random() * rangeSpeed,
      angle: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.001;
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Simplex noise for organic movement
        const noiseX = noise3D.current(
          particle.x * 0.005,
          particle.y * 0.005,
          time
        );
        const noiseY = noise3D.current(
          particle.x * 0.005 + 1000,
          particle.y * 0.005,
          time
        );

        // Vortex spiral movement
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Spiral force
        particle.angle += 0.02 * particle.speed;
        const spiralForce = 0.3;
        
        particle.vx = Math.cos(angle + spiralForce) * particle.speed + noiseX * 2;
        particle.vy = Math.sin(angle + spiralForce) * particle.speed + noiseY * 2;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const alpha = 0.3 + (0.3 * (1 - Math.min(distance / (canvas.width / 2), 1)));
        
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        
        const useMono = rangeHue <= 0;
        const start = useMono ? `hsla(0, 0%, 100%, ${alpha})` : `hsla(${particle.hue}, 100%, 60%, ${alpha})`;
        const end = useMono ? `hsla(0, 0%, 100%, 0)` : `hsla(${particle.hue}, 100%, 60%, 0)`;
        gradient.addColorStop(0, start);
        gradient.addColorStop(1, end);
        ctx.filter = 'blur(0.6px)';
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.filter = 'none';
      });

      animationId = requestAnimationFrame(animate);
      setAnimationFrame((prev) => prev + 1);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [
    particleCount,
    rangeY,
    baseHue,
    rangeHue,
    baseSpeed,
    rangeSpeed,
    baseRadius,
    rangeRadius,
    backgroundColor,
  ]);

  return (
    <div className={cn("relative w-full h-full", containerClassName)}>
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
