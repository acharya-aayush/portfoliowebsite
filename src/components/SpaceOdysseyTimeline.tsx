import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Rocket, Calendar, Code, Lightbulb, Trophy, Sparkles, GraduationCap, Cpu, Database, Brain, Award, Zap } from 'lucide-react';

interface Milestone {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const milestones: Milestone[] = [
  {
    id: 1,
    year: "2022",
    title: "Foundation & First Steps",
    description: "Embarked on the journey into software development at St. Xavier's College. Mastered HTML5, CSS3, and JavaScript fundamentals while exploring responsive design patterns with Bootstrap and Tailwind CSS. Established core programming principles and coding discipline.",
    icon: GraduationCap,
    color: "#f4cf47"
  },
  {
    id: 2,
    year: "2023",
    title: "Algorithmic Thinking",
    description: "Deep dive into C/C++ programming, data structures, and algorithmic problem-solving. Strengthened computational thinking through rigorous study of statistics, discrete mathematics, and complexity analysis. Built solid foundation for scalable software architecture.",
    icon: Code,
    color: "#d4af37"
  },
  {
    id: 3,
    year: "2023-2024",
    title: "Modern Web & React",
    description: "Transitioned to modern JavaScript frameworks, specializing in React and TypeScript. Mastered component-based architecture, state management patterns, and hooks ecosystem. Developed dynamic, performant single-page applications with industry-standard practices.",
    icon: Sparkles,
    color: "#c9a961"
  },
  {
    id: 4,
    year: "2024",
    title: "Backend & Systems",
    description: "Expanded expertise into backend development with Node.js and database systems. Comprehensive study of computer networks, DBMS theory, MySQL, and Python programming. Architected RESTful APIs and designed normalized database schemas for production applications.",
    icon: Database,
    color: "#b8943a"
  },
  {
    id: 5,
    year: "2024",
    title: "Full-Stack Integration",
    description: "Achieved full-stack proficiency by integrating frontend and backend technologies. Built end-to-end applications featuring authentication systems, real-time data processing, and cloud deployment. Implemented CI/CD pipelines and DevOps best practices.",
    icon: Rocket,
    color: "#d4af37"
  },
  {
    id: 6,
    year: "2024-2025",
    title: "SXC Sandbox Victory",
    description: "Led team to victory at St. Xavier's College Sandbox 2.0 Hackathon. Developed innovative solutions under pressure, demonstrating rapid prototyping skills, collaborative development, and effective project presentation to technical judges.",
    icon: Trophy,
    color: "#c9a961"
  },
  {
    id: 7,
    year: "2025",
    title: "AI/ML Specialization",
    description: "Intensive bootcamp training in artificial intelligence and machine learning. Mastered neural networks, computer vision with OpenCV, and natural language processing. Applied deep learning frameworks to real-world problems with production-grade implementations.",
    icon: Brain,
    color: "#f4cf47"
  },
  {
    id: 8,
    year: "2025",
    title: "Chitragupta AI & Advanced Projects",
    description: "Architected Chitragupta AI: an intelligent OCR system leveraging Tesseract.js, OpenCV, and custom ML models for document digitization. Developed Trade Heaven trading platform and TypeSmash typing performance analyzer. Focus on scalable, production-ready applications.",
    icon: Lightbulb,
    color: "#b8943a"
  },
  {
    id: 9,
    year: "2025",
    title: "Information Security",
    description: "Completed comprehensive InfoSec bootcamp covering cryptography, network security, penetration testing methodologies, and secure coding practices. Enhanced development workflow with security-first mindset and vulnerability assessment capabilities.",
    icon: Award,
    color: "#d4af37"
  },
  {
    id: 10,
    year: "Present",
    title: "Innovation & Impact",
    description: "Continuing to push boundaries in AI/ML engineering and full-stack development. Exploring cutting-edge technologies, contributing to open-source projects, and building solutions that create meaningful impact. The odyssey continues with endless possibilities ahead.",
    icon: Zap,
    color: "#f4cf47"
  }
];

export default function SpaceOdysseyTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePlanet, setActivePlanet] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [stars, setStars] = useState<Array<{ x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }>>([]);
  const spaceshipControls = useAnimation();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize stars
  useEffect(() => {
    const newStars = Array.from({ length: 500 }, () => ({
      x: Math.random() * (window.innerWidth > 768 ? 5000 : 3000),
      y: Math.random() * 600,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1
    }));
    setStars(newStars);
  }, []);

  // Draw stars on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth > 768 ? 5000 : 3000;
    canvas.height = 600;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activePlanet < milestones.length - 1) {
        navigateToPlanet(activePlanet + 1);
      } else if (e.key === 'ArrowLeft' && activePlanet > 0) {
        navigateToPlanet(activePlanet - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlanet]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActivePlanet(prev => {
        const next = prev + 1;
        if (next >= milestones.length) {
          setIsAutoPlaying(false);
          return 0;
        }
        navigateToPlanet(next);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navigate to planet
  const navigateToPlanet = (index: number) => {
    setActivePlanet(index);
    playSound('travel');
    
    // Scroll to planet
    const container = containerRef.current;
    if (container) {
      const planetElement = container.querySelector(`[data-planet="${index}"]`);
      if (planetElement) {
        planetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }

    // Move spaceship
    const planetX = index * 700 + 350;
    spaceshipControls.start({
      x: planetX - 50,
      rotate: index > activePlanet ? 15 : -15,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    });
  };

  // Sound effects
  const playSound = (type: 'hover' | 'travel') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'hover') {
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } else if (type === 'travel') {
      oscillator.frequency.value = 220;
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.3);
    }
  };

  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-4"
          style={{ color: '#d4af37' }}
        >
          My Space Odyssey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Navigate through my journey • Use arrow keys or click planets
        </motion.p>
      </div>

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: '100%', height: '600px' }}
      />

      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden hide-scrollbar"
        style={{ height: '600px' }}
      >
        <div className="relative" style={{ width: `${milestones.length * 700}px`, height: '600px' }}>
          {/* Orbit Path */}
          <div
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"
            style={{ transform: 'translateY(-50%)' }}
          />

          {/* Planets */}
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              data-planet={index}
              className="absolute top-1/2"
              style={{
                left: `${index * 700 + 350}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <PlanetMilestone
                milestone={milestone}
                isActive={activePlanet === index}
                onClick={() => navigateToPlanet(index)}
                onHover={() => playSound('hover')}
              />
            </div>
          ))}

          {/* Spaceship */}
          <motion.div
            animate={spaceshipControls}
            initial={{ x: 300, y: 250 }}
            className="absolute"
            style={{ width: '80px', height: '80px' }}
          >
            <Rocket
              className="w-full h-full"
              style={{ color: '#d4af37', filter: 'drop-shadow(0 0 20px #d4af37)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-8 relative z-10">
        <button
          onClick={() => activePlanet > 0 && navigateToPlanet(activePlanet - 1)}
          disabled={activePlanet === 0}
          className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid #d4af37',
            color: '#d4af37'
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="px-6 py-3 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: isAutoPlaying ? '#d4af37' : 'rgba(212, 175, 55, 0.1)',
            border: '2px solid #d4af37',
            color: isAutoPlaying ? '#000000' : '#d4af37'
          }}
        >
          {isAutoPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
        </button>
        <button
          onClick={() => activePlanet < milestones.length - 1 && navigateToPlanet(activePlanet + 1)}
          disabled={activePlanet === milestones.length - 1}
          className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid #d4af37',
            color: '#d4af37'
          }}
        >
          Next →
        </button>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

interface PlanetMilestoneProps {
  milestone: Milestone;
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
}

function PlanetMilestone({ milestone, isActive, onClick, onHover }: PlanetMilestoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = milestone.icon;

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => {
        setIsHovered(true);
        onHover();
      }}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      animate={{
        scale: isActive ? 1.2 : 1,
        y: isActive ? [0, -10, 0] : 0
      }}
      transition={{
        y: {
          repeat: isActive ? Infinity : 0,
          duration: 2,
          ease: 'easeInOut'
        }
      }}
    >
      {/* Planet Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          backgroundColor: milestone.color,
          opacity: isActive ? 0.6 : isHovered ? 0.4 : 0.2,
          transform: 'scale(1.5)',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Planet */}
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: `3px solid ${milestone.color}`,
          boxShadow: `0 0 30px ${milestone.color}`
        }}
      >
        <Icon className="w-12 h-12" style={{ color: milestone.color }} />
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{
          opacity: isHovered || isActive ? 1 : 0,
          y: isHovered || isActive ? 0 : 20,
          scale: isHovered || isActive ? 1 : 0.8
        }}
        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-80 p-6 rounded-xl"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: `2px solid ${milestone.color}`,
          boxShadow: `0 0 30px ${milestone.color}40`
        }}
      >
        <div className="text-sm font-bold mb-2" style={{ color: milestone.color }}>
          {milestone.year}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {milestone.title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {milestone.description}
        </p>
      </motion.div>

      {/* Year Badge */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
        style={{
          backgroundColor: milestone.color,
          color: '#000000'
        }}
      >
        {milestone.year}
      </div>
    </motion.div>
  );
}
