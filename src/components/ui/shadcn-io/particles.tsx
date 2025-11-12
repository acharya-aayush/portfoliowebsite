"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current) {
      return;
    }

    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;

    canvasSize.current.w = container.offsetWidth;
    canvasSize.current.h = container.offsetHeight;

    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;

    context.current.scale(dpr, dpr);

    particles.current = [];
    for (let i = 0; i < quantity; i++) {
      particles.current.push({
        x: Math.random() * canvasSize.current.w,
        y: Math.random() * canvasSize.current.h,
        vx: (Math.random() - 0.5) * 2 + vx,
        vy: (Math.random() - 0.5) * 2 + vy,
        size: Math.random() * size + size / 2,
      });
    }
  };

  const drawParticle = (particle: Particle) => {
    if (!context.current) return;

    const ctx = context.current;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const updateParticle = (particle: Particle) => {
    if (!canvasSize.current) return;

    // Mouse attraction
    const dx = mouse.current.x - particle.x;
    const dy = mouse.current.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      const attraction = (staticity / 100) * force;
      particle.vx += (dx / distance) * attraction * 0.2;
      particle.vy += (dy / distance) * attraction * 0.2;
    }

    // Easing
    const easeValue = 1 - ease / 100;
    particle.vx *= easeValue;
    particle.vy *= easeValue;

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Boundary check and regeneration
    if (
      particle.x < 0 ||
      particle.x > canvasSize.current.w ||
      particle.y < 0 ||
      particle.y > canvasSize.current.h
    ) {
      particle.x = Math.random() * canvasSize.current.w;
      particle.y = Math.random() * canvasSize.current.h;
      particle.vx = (Math.random() - 0.5) * 2 + vx;
      particle.vy = (Math.random() - 0.5) * 2 + vy;
    }
  };

  const animate = () => {
    if (!context.current || !canvasSize.current) return;

    context.current.clearRect(
      0,
      0,
      canvasSize.current.w,
      canvasSize.current.h
    );

    particles.current.forEach((particle) => {
      updateParticle(particle);
      drawParticle(particle);
    });

    requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      ref={canvasContainerRef}
      onMouseMove={handleMouseMove}
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
