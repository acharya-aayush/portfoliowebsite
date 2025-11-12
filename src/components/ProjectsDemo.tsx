import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';
import { ExternalLink, Github } from 'lucide-react';

// Same projects data
const projectsData = [
  {
    title: 'Vision Mate',
    tagline: '🏆 1st Place Winner - SXC Sandbox 2.0 Hackathon',
    description: 'Gold Medal winning project - A lightweight navigation tool for visually impaired users on smart glasses.',
    techStack: ['React', 'TensorFlow', 'Vite', 'Computer Vision'],
    image: 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&q=80',
    github: 'https://github.com/acharya-aayush/SXC-2.0-Hackathon_Project',
    live: null,
    date: '2024-09',
  },
  {
    title: 'ChitraGupta AI',
    tagline: 'Nepal-specific AI Financial Advisor',
    description: 'AI-powered financial advisor providing legitimate business advice based on actual Nepal regulations.',
    techStack: ['Python', 'LLaMA', 'FAISS', 'RAG', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    github: 'https://github.com/acharya-aayush/ChitraGuptaAI_FinancialAdvisor',
    live: null,
    date: '2024-08',
  },
  {
    title: 'TypeSmash',
    tagline: 'Minimalist Typing Test with Arcade Mode',
    description: 'Minimalist typing test with detailed stats, multiple test modes, and an arcade "Zoro Mode" mini-game.',
    techStack: ['JavaScript', 'Canvas API', 'HTML5', 'CSS3'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    github: 'https://github.com/acharya-aayush/TypeSmash',
    live: 'https://acharya-aayush.github.io/TypeSmash/',
    date: '2024-06',
  },
  {
    title: 'TradeHeaven',
    tagline: 'MarketFlow Dynamics Trading Platform',
    description: 'Trading platform prototype built during 5th semester. Features portfolio management and watchlists.',
    techStack: ['React', 'Node.js', 'SQLite', 'Express'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    github: 'https://github.com/acharya-aayush/TradeHeaven',
    live: null,
    date: '2024-03',
  },
];

// OPTION 9: Magnetic Cursor Component
const useMagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic pull effect (limited range)
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;
    
    if (distance < maxDistance) {
      const pull = 0.3;
      setPosition({ x: x * pull, y: y * pull });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { position, handleMouseMove, handleMouseLeave };
};

const ProjectsDemo = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Animated timeline path
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block glass px-6 py-2 mb-4 rounded-sm"
          >
            <span className="text-gold text-sm font-body uppercase tracking-wider">
              Options Demo
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
            Timeline + Magnetic Effects
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Hover over cards to feel the magnetic pull
          </p>
        </div>

        {/* OPTION 4: Animated Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
            <svg className="w-full h-full" style={{ overflow: 'visible' }}>
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="rgba(212, 175, 55, 0.3)"
                strokeWidth="2"
                style={{
                  pathLength,
                  strokeDasharray: '10 5',
                }}
              />
            </svg>
          </div>

          {/* Timeline Items */}
          <div className="space-y-32">
            {projectsData.map((project, index) => {
              const magnetic = useMagneticCursor();
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  <div className={`grid md:grid-cols-2 gap-8 items-center ${!isLeft ? 'md:grid-flow-dense' : ''}`}>
                    {/* Timeline Node */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <div className="relative">
                        {/* Pulsing rings */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-gold"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          style={{ width: '40px', height: '40px' }}
                        />
                        <div className="w-6 h-6 bg-gold rounded-full border-4 border-background relative z-10" />
                      </div>
                    </motion.div>

                    {/* Date Badge */}
                    <div className={`${!isLeft ? 'md:col-start-2 md:text-right' : ''}`}>
                      <motion.div
                        className={`inline-block glass-strong px-4 py-2 rounded-sm mb-4 ${!isLeft ? 'md:float-right' : ''}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-gold font-mono text-sm">{project.date}</span>
                      </motion.div>
                    </div>

                    {/* OPTION 9: Magnetic Card */}
                    <motion.div
                      className={`${!isLeft ? 'md:col-start-1 md:row-start-1' : ''}`}
                      onMouseMove={magnetic.handleMouseMove}
                      onMouseLeave={magnetic.handleMouseLeave}
                      style={{
                        x: magnetic.position.x,
                        y: magnetic.position.y,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 150,
                        damping: 15,
                        mass: 0.1,
                      }}
                    >
                      <motion.div
                        className="glass-strong p-6 rounded-sm relative overflow-hidden group/card cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15)',
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Magnetic trail effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover/card:opacity-100"
                          style={{
                            x: magnetic.position.x * 0.5,
                            y: magnetic.position.y * 0.5,
                          }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Image */}
                        <div className="aspect-video rounded-sm overflow-hidden mb-4">
                          <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>

                        {/* Content */}
                        <h3 className="font-heading text-2xl font-bold mb-2 group-hover/card:text-gold transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gold text-sm mb-3">{project.tagline}</p>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2 py-1 border border-white/20 rounded-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-2">
                          {project.github && (
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm glass px-3 py-2 rounded-sm hover:bg-white/10"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Github size={16} />
                              Code
                            </motion.a>
                          )}
                          {project.live && (
                            <motion.a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm glass px-3 py-2 rounded-sm hover:bg-white/10"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink size={16} />
                              Demo
                            </motion.a>
                          )}
                        </div>

                        {/* Ripple effect on hover */}
                        <motion.div
                          className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/card:opacity-100 blur-xl -z-10"
                          style={{
                            x: magnetic.position.x,
                            y: magnetic.position.y,
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsDemo;
