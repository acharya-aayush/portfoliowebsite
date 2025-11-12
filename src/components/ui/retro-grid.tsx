import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RetroGridProps {
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lineColor?: string;
  className?: string;
}

export function RetroGrid({
  angle = 75,
  cellSize = 40,
  opacity = 0.2,
  lineColor = "#d4af37", // Gold
  className,
}: RetroGridProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={{
        perspective: "1500px",
      }}
    >
      {/* Grid Container - MASSIVE to cover everything */}
      <div
        className="absolute -top-[200%] -left-[50%] w-[200%] h-[500%] transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${angle}deg) rotateY(${mousePosition.x * 8}deg) translateY(${mousePosition.y * 30}px) translateZ(${mousePosition.x * 20}px)`,
          transformStyle: "preserve-3d",
          transformOrigin: "center 40%",
        }}
      >
        {/* Two overlapping grids for seamless infinite loop */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${lineColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            opacity: opacity,
            animation: "grid 40s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${lineColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            opacity: opacity,
            animation: "grid 40s linear infinite",
            animationDelay: "-20s",
          }}
        />
      </div>

      {/* Minimal fade at very edges */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
