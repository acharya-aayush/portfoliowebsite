import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { ShootingCrosshair } from './ui/shooting-crosshair';

const skillsData = {
  frontend: [
    'React', 'JavaScript', 'HTML5', 'CSS3', 
    'Tailwind CSS', 'Bootstrap', 'Vite', 'Framer Motion'
  ],
  backend: [
    'Node.js', 'Express.js', 'Python', 'Flask',
    'SQLite', 'MySQL', 'SQL', 'REST APIs'
  ],
  tools: [
    'Git', 'Vite', 'Canvas API', 'VS Code',
    'CCNA', 'AWS', 'Check Point Security'
  ],
  ai: [
    'TensorFlow', 'PyTorch', 'LLaMA', 'FAISS',
    'LangChain', 'Hugging Face', 'RAG Systems', 'Computer Vision'
  ],
};

interface ShatteredSkill {
  skill: string;
  particles: Array<{ 
    x: number; 
    y: number; 
    vx: number; 
    vy: number; 
    rotation: number; 
    rotationSpeed: number;
    id: number;
    col: number;
    row: number;
    fragmentWidth: number;
    fragmentHeight: number;
  }>;
}

const Skills = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [shatteredSkills, setShatteredSkills] = useState<ShatteredSkill[]>([]);
  const skillRefs = useRef<Map<string, HTMLElement>>(new Map()); // Changed to HTMLElement to support all text elements
  const [shatteredTexts, setShatteredTexts] = useState<Set<string>>(new Set()); // Track all shattered text elements
  const [isInSection, setIsInSection] = useState(false); // Track if mouse is in skills section
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // Track cursor position

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleShoot = useCallback((x: number, y: number) => {
    // Check if any skill badge was hit
    let hitSkill: string | null = null;
    let hitElement: HTMLSpanElement | null = null;

    skillRefs.current.forEach((element, skill) => {
      const rect = element.getBoundingClientRect();
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      
      if (sectionRect) {
        const relativeX = x + sectionRect.left;
        const relativeY = y + sectionRect.top;
        
        if (
          relativeX >= rect.left &&
          relativeX <= rect.right &&
          relativeY >= rect.top &&
          relativeY <= rect.bottom
        ) {
          hitSkill = skill;
          hitElement = element;
        }
      }
    });

    if (hitSkill && hitElement) {
      // Create block-breaking effect with fragments
      const rect = hitElement.getBoundingClientRect();
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      
      if (sectionRect) {
        const centerX = rect.left + rect.width / 2 - sectionRect.left;
        const centerY = rect.top + rect.height / 2 - sectionRect.top;
        const width = rect.width;
        const height = rect.height;
        
        // Generate fragments (4x3 grid of pieces)
        const particles = [];
        const rows = 3;
        const cols = 4;
        const fragmentWidth = width / cols;
        const fragmentHeight = height / rows;
        
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const fragmentX = rect.left - sectionRect.left + col * fragmentWidth;
            const fragmentY = rect.top - sectionRect.top + row * fragmentHeight;
            
            // Calculate explosion vector from center
            const dx = fragmentX - centerX;
            const dy = fragmentY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const speed = 3 + Math.random() * 2;
            
            particles.push({
              x: fragmentX,
              y: fragmentY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 1,
              rotation: Math.random() * 360,
              rotationSpeed: (Math.random() - 0.5) * 20,
              id: Date.now() + row * cols + col,
              col,
              row,
              fragmentWidth,
              fragmentHeight
            });
          }
        }

        // Mark text as shattered to hide it permanently
        setShatteredTexts(prev => new Set(prev).add(hitSkill!));
        setShatteredSkills(prev => [...prev, { skill: hitSkill!, particles }]);

        // Keep the skill in shatteredSkills permanently so it stays hidden
        // Only remove the particles after animation completes
        setTimeout(() => {
          setShatteredSkills(prev => 
            prev.map(s => s.skill === hitSkill ? { ...s, particles: [] } : s)
          );
        }, 2000);

        return true; // Hit detected
      }
    }
    
    return false; // No hit
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="py-20 md:py-32 relative bg-secondary/20" 
      style={{ 
        position: 'relative',
        isolation: 'isolate',
        cursor: 'none'
      }}
      onMouseEnter={() => setIsInSection(true)}
      onMouseLeave={() => setIsInSection(false)}
      onMouseMove={(e) => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      }}
    >
      {/* Custom Animated Cursor */}
      {isInSection && (
        <div
          className="custom-cursor-wrapper"
          style={{
            position: 'absolute',
            left: cursorPos.x,
            top: cursorPos.y,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img
            src="/skill/mousepointer-128.png"
            alt="cursor"
            className="custom-cursor-animated"
            style={{ width: '48px', height: '48px' }}
          />
        </div>
      )}

      {/* Shooting Crosshair - only active in this section */}
      <ShootingCrosshair 
        color="#ff0000" 
        containerRef={sectionRef}
        onShoot={handleShoot}
      />
      
      {/* Block fragments from shattered badges */}
      {shatteredSkills.map(({ skill, particles }) => (
        <div key={skill} className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute pointer-events-none glass border border-gold/30"
              style={{
                left: particle.x,
                top: particle.y,
                width: `${particle.fragmentWidth}px`,
                height: `${particle.fragmentHeight}px`,
                animation: `blockShatter 2s cubic-bezier(0.4, 0, 0.6, 1) forwards`,
                '--vx': `${particle.vx * 40}px`,
                '--vy': `${particle.vy * 40}px`,
                '--rot-speed': particle.rotationSpeed
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            {!shatteredTexts.has('expertise-badge') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="inline-block glass px-6 py-2 mb-4 rounded-sm cursor-crosshair"
                ref={(el) => el && skillRefs.current.set('expertise-badge', el)}
              >
                <span className="text-gold text-sm font-body uppercase tracking-wider">
                  Expertise
                </span>
              </motion.div>
            )}
            {!shatteredTexts.has('main-title') && (
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold cursor-crosshair"
                ref={(el) => el && skillRefs.current.set('main-title', el)}
              >
                Skills & Technologies
              </h2>
            )}
            {!shatteredTexts.has('subtitle') && (
              <p 
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto cursor-crosshair"
                ref={(el) => el && skillRefs.current.set('subtitle', el)}
              >
                A comprehensive toolkit for building modern, scalable applications
              </p>
            )}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Frontend */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6"
            >
              {!shatteredTexts.has('frontend-title') && (
                <h3 
                  className="font-heading text-2xl md:text-3xl font-bold flex items-center cursor-crosshair"
                  ref={(el) => el && skillRefs.current.set('frontend-title', el)}
                >
                  <span className="text-gold mr-3">01.</span>
                  Frontend Development
                </h3>
              )}
              <div className="flex flex-wrap gap-3">
                {skillsData.frontend.map((skill, index) => {
                  const isShattered = shatteredSkills.some(s => s.skill === skill);
                  if (isShattered) return null; // Don't render at all if shattered
                  return (
                    <motion.span
                      key={skill}
                      ref={(el) => el && skillRefs.current.set(skill, el)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="glass px-4 py-2 text-sm md:text-base font-body rounded-sm hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 cursor-crosshair"
                      style={{ position: 'relative' }}
                    >
                      {skill}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>

            {/* Backend & Database */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6"
            >
              {!shatteredTexts.has('backend-title') && (
                <h3 
                  className="font-heading text-2xl md:text-3xl font-bold flex items-center cursor-crosshair"
                  ref={(el) => el && skillRefs.current.set('backend-title', el)}
                >
                  <span className="text-gold mr-3">02.</span>
                  Backend & Database
                </h3>
              )}
              <div className="flex flex-wrap gap-3">
                {skillsData.backend.map((skill, index) => {
                  const isShattered = shatteredSkills.some(s => s.skill === skill);
                  if (isShattered) return null; // Don't render at all if shattered
                  return (
                    <motion.span
                      key={skill}
                      ref={(el) => el && skillRefs.current.set(skill, el)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="glass px-4 py-2 text-sm md:text-base font-body rounded-sm hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 cursor-crosshair"
                    >
                      {skill}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>

            {/* AI & Machine Learning */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6"
            >
              {!shatteredTexts.has('ai-title') && (
                <h3 
                  className="font-heading text-2xl md:text-3xl font-bold flex items-center cursor-crosshair"
                  ref={(el) => el && skillRefs.current.set('ai-title', el)}
                >
                  <span className="text-gold mr-3">03.</span>
                  AI & Machine Learning
                </h3>
              )}
              <div className="flex flex-wrap gap-3">
                {skillsData.ai.map((skill, index) => {
                  const isShattered = shatteredSkills.some(s => s.skill === skill);
                  if (isShattered) return null; // Don't render at all if shattered
                  return (
                    <motion.span
                      key={skill}
                      ref={(el) => el && skillRefs.current.set(skill, el)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="glass px-4 py-2 text-sm md:text-base font-body rounded-sm hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 cursor-crosshair"
                    >
                      {skill}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>

            {/* Tools & Platforms */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6"
            >
              {!shatteredTexts.has('tools-title') && (
                <h3 
                  className="font-heading text-2xl md:text-3xl font-bold flex items-center cursor-crosshair"
                  ref={(el) => el && skillRefs.current.set('tools-title', el)}
                >
                  <span className="text-gold mr-3">04.</span>
                  Tools & Platforms
                </h3>
              )}
              <div className="flex flex-wrap gap-3">
                {skillsData.tools.map((skill, index) => {
                  const isShattered = shatteredSkills.some(s => s.skill === skill);
                  if (isShattered) return null; // Don't render at all if shattered
                  return (
                    <motion.span
                      key={skill}
                      ref={(el) => el && skillRefs.current.set(skill, el)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="glass px-4 py-2 text-sm md:text-base font-body rounded-sm hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 cursor-crosshair"
                    >
                      {skill}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
      
      <style>{`
        @keyframes blockShatter {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          30% {
            opacity: 0.9;
          }
          100% {
            transform: translate(var(--vx, 0), calc(var(--vy, 0) + 200px)) 
                       rotate(calc(var(--rot-speed, 10) * 36deg)) 
                       scale(0.5);
            opacity: 0;
          }
        }
        
        #skills {
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Skills;
