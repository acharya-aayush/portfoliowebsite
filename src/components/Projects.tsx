import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';
import { ExternalLink, Github } from 'lucide-react';

// Featured projects data
const projectsData = [
  {
    title: 'Vision Mate',
    tagline: '🏆 1st Place Winner - SXC Sandbox 2.0 Hackathon',
    description: 'Gold Medal winning project - A lightweight navigation tool for visually impaired users on smart glasses. Features real-time object detection and audio feedback to assist with daily navigation.',
    techStack: ['React', 'TensorFlow', 'Vite', 'Computer Vision'],
    image: 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&q=80',
    github: 'https://github.com/acharya-aayush/SXC-2.0-Hackathon_Project',
    live: null,
  },
  {
    title: 'ChitraGupta AI',
    tagline: 'Nepal-specific AI Financial Advisor',
    description: 'AI-powered financial advisor providing legitimate business advice based on actual Nepal regulations and legal documents. Uses RAG (Retrieval-Augmented Generation) system for accurate, context-aware responses.',
    techStack: ['Python', 'LLaMA', 'FAISS', 'RAG', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    github: 'https://github.com/acharya-aayush/ChitraGuptaAI_FinancialAdvisor',
    live: null,
  },
  {
    title: 'TypeSmash',
    tagline: 'Minimalist Typing Test with Arcade Mode',
    description: 'Minimalist typing test with detailed stats, multiple test modes, and an arcade "Zoro Mode" mini-game. Features real-time feedback, accuracy metrics, and advanced WPM tracking inspired by MonkeyType and One Piece.',
    techStack: ['JavaScript', 'Canvas API', 'HTML5', 'CSS3'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    github: 'https://github.com/acharya-aayush/TypeSmash',
    live: 'https://acharya-aayush.github.io/TypeSmash/',
  },
  {
    title: 'TradeHeaven',
    tagline: 'MarketFlow Dynamics Trading Platform',
    description: 'Trading platform prototype built during 5th semester. Features portfolio management, watchlists, and real-time trading concepts. A learning project that helped understand full-stack development fundamentals.',
    techStack: ['React', 'Node.js', 'SQLite', 'Express'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    github: 'https://github.com/acharya-aayush/TradeHeaven',
    live: null,
  },
];

// 3D Tilt + Holographic Card Component
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentages for glare position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Calculate tilt angles (MORE INTENSE - up to 25 degrees)
    const xRotation = ((y - rect.height / 2) / rect.height) * -25;
    const yRotation = ((x - rect.width / 2) / rect.width) * 25;
    
    setGlarePosition({ x: xPercent, y: yPercent });
    
    // Apply 3D transform with more depth
    card.style.transform = `
      perspective(800px)
      rotateX(${xRotation}deg)
      rotateY(${yRotation}deg)
      scale3d(1.05, 1.05, 1.05)
    `;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (cardRef.current) {
      // Smooth return transition
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      cardRef.current.style.transform = `
        perspective(800px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
      
      // Reset to fast transition for next hover
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'transform 0.1s ease-out';
        }
      }, 600);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Subtle holographic glare - LESS YELLOW */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none rounded-sm overflow-hidden"
          style={{
            background: `
              radial-gradient(
                600px circle at ${glarePosition.x}% ${glarePosition.y}%,
                rgba(255, 255, 255, 0.08),
                transparent 40%
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.6,
          }}
        />
      )}
      
      {/* Subtle shimmer - white instead of gold */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none rounded-sm overflow-hidden"
          style={{
            background: `
              linear-gradient(
                ${(glarePosition.x - 50) * 3 + 45}deg,
                transparent 30%,
                rgba(255, 255, 255, 0.06) 50%,
                transparent 70%
              )
            `,
            transform: 'translateZ(1px)',
          }}
        />
      )}
      
      {children}
    </div>
  );
};

const Projects = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const projectsListRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-50px' }); // Changed to false for continuous animation
  
  // Parallax scroll effects - START FROM VISION MATE (projects list)
  const { scrollYProgress } = useScroll({
    target: projectsListRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={sectionRef} id="projects" className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block glass px-6 py-2 mb-4 rounded-sm"
            >
              <span className="text-gold text-sm font-body uppercase tracking-wider">
                Portfolio
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              Featured Projects
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A selection of recent work showcasing technical expertise and creative problem-solving
            </p>
          </div>

          {/* Projects List with Parallax - ref for scroll tracking */}
          <div ref={projectsListRef} className="space-y-24">
            {projectsData.map((project, index) => {
              // Vision Mate (index 0) gets gentler treatment, others aggressive
              const isVisionMate = index === 0;
              
              // SMOOTHER parallax with wider, overlapping ranges
              const start = Math.max(0, (index - 0.5) / projectsData.length);
              const middle = (index + 0.5) / projectsData.length;
              const end = Math.min(1, (index + 1.5) / projectsData.length);
              
              // Smoother Y movement - 3-point creates natural easing
              const yImage = useTransform(
                scrollYProgress, 
                [start, middle, end], 
                [50, 0, -50]
              );
              const yContent = useTransform(
                scrollYProgress, 
                [start, middle, end], 
                [80, 0, -80]
              );
              
              // DIFFERENT FADE FOR VISION MATE vs OTHERS
              const scale = useTransform(
                scrollYProgress, 
                [start, middle, end], 
                isVisionMate ? [0.95, 1, 0.95] : [0.88, 1, 0.88]
              );
              const opacity = useTransform(
                scrollYProgress, 
                [start, middle, end], 
                isVisionMate ? [0.85, 1, 0.85] : [0.5, 1, 0.5]
              );              return (
              <motion.article
                key={project.title}
                style={{ opacity, scale }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}>
                  {/* Image with 3D Tilt + Holographic Effect + Parallax */}
                  <TiltCard className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <motion.div 
                      className="relative overflow-hidden rounded-sm"
                      style={{ y: yImage }}
                    >
                      <div className="aspect-video relative">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          style={{ transform: 'translateZ(40px)' }}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {/* Subtle gradient overlay - LESS YELLOW */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
                          style={{ transform: 'translateZ(30px)' }}
                        />
                        
                        {/* Subtle edge glow - white instead of gold */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{ transform: 'translateZ(25px)' }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 blur-xl" />
                        </div>
                        
                        {/* Subtle border - minimal gold */}
                        <div className="absolute inset-0 rounded-sm border border-white/0 group-hover:border-white/20 transition-all duration-700" 
                          style={{
                            transform: 'translateZ(35px)',
                            boxShadow: '0 0 30px rgba(255, 255, 255, 0)',
                          }}
                        />
                      </div>
                    </motion.div>
                  </TiltCard>

                  {/* Content with depth layers + Parallax */}
                  <motion.div 
                    className={`space-y-4 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}
                    style={{ transformStyle: 'preserve-3d', y: yContent }}
                  >
                    <div style={{ transform: 'translateZ(50px)' }}>
                      <motion.h3
                        className="font-heading text-3xl md:text-4xl font-bold mb-2 gold-underline inline-block relative"
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {project.title}
                        {/* Subtle shimmer - white instead of gold */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
                      </motion.h3>
                      <p className="text-gold text-lg md:text-xl font-body" style={{ transform: 'translateZ(45px)' }}>
                        {project.tagline}
                      </p>
                    </div>

                    <motion.div 
                      className="glass-strong p-6 md:p-8 rounded-sm relative overflow-hidden"
                      style={{ transform: 'translateZ(35px)' }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Subtle background - white glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10" style={{ transform: 'translateZ(5px)' }}>
                        {project.description}
                      </p>
                    </motion.div>

                    {/* Tech Stack with floating animation and depth */}
                    <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(25px)' }}>
                      {project.techStack.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          className="text-sm font-body text-gold border border-white/20 px-3 py-1 rounded-sm backdrop-blur-sm relative overflow-hidden group/tech"
                          style={{ transform: `translateZ(${20 + techIndex * 2}px)` }}
                          whileHover={{ 
                            scale: 1.15,
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
                            y: -5
                          }}
                          transition={{ 
                            delay: techIndex * 0.05,
                            type: 'spring',
                            stiffness: 400,
                            damping: 15
                          }}
                        >
                          {/* Subtle shine - white */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tech:translate-x-full transition-transform duration-800" />
                          <span className="relative z-10">{tech}</span>
                        </motion.span>
                      ))}
                    </div>

                    {/* Links with holographic glow */}
                    <div className="flex gap-4 pt-4" style={{ transform: 'translateZ(25px)' }}>
                      {project.github && (
                        <motion.a
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 glass px-6 py-3 rounded-sm hover:bg-gold/10 transition-all duration-300 relative overflow-hidden group/link border border-gold/20"
                        >
                          {/* Animated gradient background */}
                          <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-700" />
                          
                          <Github size={20} className="relative z-10 group-hover/link:text-gold transition-colors" />
                          <span className="font-body relative z-10 group-hover/link:text-gold transition-colors">Code</span>
                        </motion.a>
                      )}
                      {project.live && (
                        <motion.a
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 glass px-6 py-3 rounded-sm hover:bg-gold/10 transition-all duration-300 relative overflow-hidden group/link border border-gold/20"
                        >
                          {/* Animated gradient background */}
                          <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-700" />
                          
                          <ExternalLink size={20} className="relative z-10 group-hover/link:text-gold transition-colors" />
                          <span className="font-body relative z-10 group-hover/link:text-gold transition-colors">Live Demo</span>
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Divider */}
                {index < projectsData.length - 1 && (
                  <div className="mt-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                )}
              </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default Projects;
