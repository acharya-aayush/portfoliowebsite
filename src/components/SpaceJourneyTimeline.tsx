import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Rocket, Award, Code, Sparkles, Star, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  position: [number, number, number];
  year: string;
  month: string;
  title: string;
  description: string;
  type: 'project' | 'achievement' | 'learning' | 'milestone';
  color: string;
  size: number;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    position: [0, 0, 0],
    year: '2023',
    month: 'Dec',
    title: 'First GitHub Star ⭐',
    description: 'Portfolio got first star',
    type: 'milestone',
    color: '#d4af37',
    size: 0.8,
  },
  {
    id: 2,
    position: [-3, 2, -8],
    year: '2024',
    month: 'Mar',
    title: 'Deep Dive into AI/ML',
    description: 'ML specialization completed',
    type: 'learning',
    color: '#f4cf47',
    size: 1.2,
  },
  {
    id: 3,
    position: [4, -2, -16],
    year: '2024',
    month: 'Jul',
    title: 'Started Freelancing',
    description: '5+ client websites built',
    type: 'milestone',
    color: '#c9a961',
    size: 1.0,
  },
  {
    id: 4,
    position: [-5, 1, -24],
    year: '2024',
    month: 'Sep',
    title: '🏆 1st Place - SXC Sandbox',
    description: 'Won hackathon with AI navigation',
    type: 'achievement',
    color: '#f4cf47',
    size: 1.5,
  },
  {
    id: 5,
    position: [3, -3, -32],
    year: '2024',
    month: 'Nov',
    title: 'Chitragupta AI',
    description: 'OCR system with 92% accuracy',
    type: 'project',
    color: '#d4af37',
    size: 1.3,
  },
  {
    id: 6,
    position: [0, 0, -40],
    year: '2025',
    month: 'Coming',
    title: '🚀 What\'s Next?',
    description: 'The journey continues...',
    type: 'milestone',
    color: '#f4cf47',
    size: 2.0,
  },
];

// Planet component
function Planet({ event, onClick, isActive }: { event: TimelineEvent; onClick: () => void; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (isActive) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (glowRef.current) {
      glowRef.current.scale.x = glowRef.current.scale.y = glowRef.current.scale.z = 
        isActive ? 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1 : 1.2;
    }
  });

  return (
    <group position={event.position}>
      {/* Glow */}
      <Sphere ref={glowRef} args={[event.size * 1.3, 32, 32]}>
        <meshBasicMaterial color={event.color} transparent opacity={0.2} />
      </Sphere>
      
      {/* Planet */}
      <Sphere ref={meshRef} args={[event.size, 32, 32]} onClick={onClick}>
        <MeshDistortMaterial
          color={event.color}
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.8}
        />
      </Sphere>

      {/* Floating label */}
      <Text
        position={[0, event.size + 0.8, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {event.title}
      </Text>
      
      <Text
        position={[0, event.size + 0.4, 0]}
        fontSize={0.2}
        color={event.color}
        anchorX="center"
        anchorY="middle"
      >
        {event.month} {event.year}
      </Text>
    </group>
  );
}

// Spaceship component (user's viewpoint indicator)
function Spaceship() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 3]}>
      {/* Ship body */}
      <mesh>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Engine glow */}
      <pointLight position={[0, -0.3, 0]} color="#00ffff" intensity={2} distance={2} />
    </group>
  );
}

// Trail particles
function Trail() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.05; // Move particles forward
        if (positions[i + 2] > 5) {
          positions[i + 2] = -50; // Reset to back
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = -Math.random() * 50;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#d4af37" transparent opacity={0.6} />
    </points>
  );
}

// Camera controller for auto-navigation
function CameraController({ targetZ }: { targetZ: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.z += (targetZ - camera.position.z) * 0.05;
  });

  return null;
}

// Sound effect helper
const playSound = (type: 'whoosh' | 'click' | 'ambient') => {
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'whoosh') {
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  } else if (type === 'click') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

export default function SpaceJourneyTimeline() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
  const [cameraZ, setCameraZ] = useState(5);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => {
          const next = (prev + 1) % timelineEvents.length;
          const event = timelineEvents[next];
          setCameraZ(event.position[2] + 5);
          setActiveEvent(event);
          playSound('whoosh');
          return next;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  const handlePlanetClick = (event: TimelineEvent) => {
    setActiveEvent(event);
    setCameraZ(event.position[2] + 5);
    setIsAutoPlay(false);
    playSound('click');
  };

  const handleNext = () => {
    const nextIndex = (currentEventIndex + 1) % timelineEvents.length;
    const event = timelineEvents[nextIndex];
    setCurrentEventIndex(nextIndex);
    setActiveEvent(event);
    setCameraZ(event.position[2] + 5);
    playSound('whoosh');
  };

  const handlePrev = () => {
    const prevIndex = currentEventIndex === 0 ? timelineEvents.length - 1 : currentEventIndex - 1;
    const event = timelineEvents[prevIndex];
    setCurrentEventIndex(prevIndex);
    setActiveEvent(event);
    setCameraZ(event.position[2] + 5);
    playSound('whoosh');
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {/* Planets */}
            {timelineEvents.map((event) => (
              <Planet
                key={event.id}
                event={event}
                onClick={() => handlePlanetClick(event)}
                isActive={activeEvent?.id === event.id}
              />
            ))}

            <Spaceship />
            <Trail />
            <CameraController targetZ={cameraZ} />
            <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Top HUD */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-white">Space </span>
            <span className="text-[#d4af37]">Journey</span>
          </h2>
          <p className="text-gray-400">Navigate through my timeline • Click planets to explore</p>
        </motion.div>

        {/* Event Info Card */}
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-auto"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-[#d4af37] mb-1">{activeEvent.month} {activeEvent.year}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{activeEvent.title}</h3>
                  <p className="text-gray-300">{activeEvent.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30`}>
                  {activeEvent.type}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto"
        >
          <button
            onClick={handlePrev}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white rotate-180" />
          </button>

          <button
            onClick={() => {
              setIsAutoPlay(!isAutoPlay);
              playSound('click');
            }}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              isAutoPlay
                ? 'bg-[#d4af37] text-black'
                : 'bg-white/10 backdrop-blur-sm border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10'
            }`}
          >
            {isAutoPlay ? '⏸ Pause Tour' : '▶ Auto Tour'}
          </button>

          <button
            onClick={handleNext}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className={`h-1 rounded-full transition-all ${
                index === currentEventIndex ? 'w-8 bg-[#d4af37]' : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px]" />
      </div>
    </section>
  );
}
