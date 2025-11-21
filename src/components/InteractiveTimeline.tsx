import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, Award, Code, Rocket, Star, Sparkles } from 'lucide-react';

interface TimelineEvent {
  id: number;
  year: string;
  month: string;
  title: string;
  description: string;
  type: 'project' | 'achievement' | 'learning' | 'milestone';
  icon: any;
  tags?: string[];
  link?: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    year: '2024',
    month: 'Nov',
    title: 'Chitragupta AI',
    description: 'Built AI-powered form reader with OCR and computer vision. Processing 500+ forms with 92% accuracy.',
    type: 'project',
    icon: Rocket,
    tags: ['Python', 'OCR', 'FastAPI', 'OpenCV'],
    link: 'https://github.com/acharya-aayush/chitragupta-ai'
  },
  {
    id: 2,
    year: '2024',
    month: 'Sep',
    title: '1st Place - SXC Sandbox 2.0',
    description: 'Won first place at hackathon with AI-powered navigation system for visually impaired users.',
    type: 'achievement',
    icon: Award,
    tags: ['Hackathon', 'AI', 'Computer Vision']
  },
  {
    id: 3,
    year: '2024',
    month: 'Jul',
    title: 'Started Freelancing',
    description: 'Began working on web development projects. Built 5+ client websites with React and TypeScript.',
    type: 'milestone',
    icon: Code,
    tags: ['React', 'TypeScript', 'Web Dev']
  },
  {
    id: 4,
    year: '2024',
    month: 'Mar',
    title: 'Deep Dive into AI/ML',
    description: 'Completed ML specialization. Focused on computer vision, NLP, and deep learning fundamentals.',
    type: 'learning',
    icon: Sparkles,
    tags: ['Machine Learning', 'TensorFlow', 'Neural Networks']
  },
  {
    id: 5,
    year: '2023',
    month: 'Dec',
    title: 'First GitHub Star ⭐',
    description: 'My portfolio website got its first star on GitHub. Small wins matter!',
    type: 'milestone',
    icon: Star,
    tags: ['Open Source', 'Portfolio']
  },
];

const typeColors = {
  project: 'from-[#d4af37] to-[#f4cf47]',
  achievement: 'from-[#f4cf47] to-[#d4af37]',
  learning: 'from-[#c9a961] to-[#d4af37]',
  milestone: 'from-[#b8943a] to-[#c9a961]',
};

const typeGlows = {
  project: 'shadow-[0_0_20px_rgba(212,175,55,0.3)]',
  achievement: 'shadow-[0_0_25px_rgba(244,207,71,0.4)]',
  learning: 'shadow-[0_0_15px_rgba(201,169,97,0.2)]',
  milestone: 'shadow-[0_0_18px_rgba(184,148,58,0.25)]',
};

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function InteractiveTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles: FloatingParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Animate timeline line progress
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6 overflow-hidden bg-black"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#d4af37]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.3, 1],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm font-medium">My Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Interactive </span>
            <span className="text-[#d4af37]">Timeline</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From first lines of code to building AI systems - click on any event to explore
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center line (animated) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-[#d4af37] via-[#f4cf47] to-[#d4af37]"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline Events */}
          <div className="space-y-24">
            {timelineData.map((event, index) => {
              const isLeft = index % 2 === 0;
              const Icon = event.icon;
              
              return (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isLeft={isLeft}
                  isActive={activeEvent === event.id}
                  onHover={() => setActiveEvent(event.id)}
                  onLeave={() => setActiveEvent(null)}
                  Icon={Icon}
                />
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-24"
        >
          <p className="text-gray-400 mb-6">This is just the beginning...</p>
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block text-4xl"
          >
            🚀
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
    </section>
  );
}

interface TimelineEventProps {
  event: TimelineEvent;
  isLeft: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  Icon: any;
}

function TimelineEvent({ event, isLeft, isActive, onHover, onLeave, Icon }: TimelineEventProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Content Card */}
        <motion.div
          className="w-1/2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`relative group ${isLeft ? 'text-right' : 'text-left'}`}>
            {/* Card */}
            <div className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 ${isActive ? typeGlows[event.type] : ''}`}>
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${typeColors[event.type]} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}
                style={{ filter: 'blur(20px)' }}
              />

              <div className="relative z-10">
                {/* Date badge */}
                <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                    {event.month} {event.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">
                  {event.description}
                </p>

                {/* Tags */}
                {event.tags && (
                  <div className={`flex flex-wrap gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Link arrow */}
                {event.link && (
                  <motion.a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mt-4 text-[#d4af37] text-sm hover:underline ${isLeft ? 'ml-auto' : 'mr-auto'}`}
                    whileHover={{ x: isLeft ? -5 : 5 }}
                  >
                    {isLeft ? '←' : '→'} View Project
                  </motion.a>
                )}
              </div>
            </div>

            {/* Connector line to center */}
            <div className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r ${isLeft ? 'from-[#d4af37]/50 to-transparent right-full' : 'from-transparent to-[#d4af37]/50 left-full'} ${isActive ? 'w-8' : 'w-4'} transition-all duration-300`} />
          </div>
        </motion.div>

        {/* Center Icon */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          animate={{
            scale: isActive ? 1.2 : 1,
            rotate: isActive ? 360 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${typeColors[event.type]} flex items-center justify-center border-4 border-black ${isActive ? typeGlows[event.type] : ''}`}>
            <Icon className="w-5 h-5 text-black" />
          </div>
        </motion.div>

        {/* Empty space on the other side */}
        <div className="w-1/2" />
      </div>
    </motion.div>
  );
}
