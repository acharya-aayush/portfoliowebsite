import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Constellation } from '@/components/ui/constellation';

interface Meteor {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
  delay: number;
}

interface Comet {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  isClickTriggered?: boolean;
  targetX?: number;
  targetY?: number;
  angle?: number;
  currentX?: number;
  currentY?: number;
}

const About = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);

  // Generate continuous meteors (Magic UI style)
  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors: Meteor[] = [];
      const meteorCount = 6; // Reduced number
      
      for (let i = 0; i < meteorCount; i++) {
        newMeteors.push({
          id: Date.now() + i,
          startX: Math.random() * 120 - 10, // -10% to 110% (start slightly off-screen)
          startY: Math.random() * 10 - 15, // -15% to -5% (well above viewport)
          angle: 215, // Fixed diagonal angle (top-right to bottom-left)
          duration: Math.random() * 4 + 4, // 4-8s duration (long enough to exit viewport)
          delay: Math.random() * 6 // 0-6s stagger for continuous effect
        });
      }
      
      setMeteors(newMeteors);
    };

    // Generate meteors immediately
    generateMeteors();
    
    // Regenerate every 12 seconds for variety
    const interval = setInterval(generateMeteors, 12000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle click to spawn comet that flies to opposite corner
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Play comet sound effect
    const audio = new Audio('/about/comet.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Convert to percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Determine which quadrant the click is in and fly to opposite corner
    // Top-left (x<50, y<50) -> fly to bottom-right
    // Top-right (x>=50, y<50) -> fly to bottom-left
    // Bottom-left (x<50, y>=50) -> fly to top-right
    // Bottom-right (x>=50, y>=50) -> fly to top-left
    
    let targetX, targetY, angle;
    if (x < 50 && y < 50) {
      // Top-left -> Bottom-right
      targetX = 120;
      targetY = 120;
      angle = 225;
    } else if (x >= 50 && y < 50) {
      // Top-right -> Bottom-left
      targetX = -20;
      targetY = 120;
      angle = 315;
    } else if (x < 50 && y >= 50) {
      // Bottom-left -> Top-right
      targetX = 120;
      targetY = -20;
      angle = 135;
    } else {
      // Bottom-right -> Top-left
      targetX = -20;
      targetY = -20;
      angle = 45;
    }
    
    const newComet: Comet = {
      id: Date.now(),
      startX: x,
      startY: y,
      duration: 6, // Much slower flight (6s)
      delay: 0,
      isClickTriggered: true,
      targetX: targetX,
      targetY: targetY,
      angle: angle
    };
    
    setComets(prev => [...prev, newComet]);
    
    // Remove after animation
    setTimeout(() => {
      setComets(prev => prev.filter(c => c.id !== newComet.id));
    }, 6500);
  };

  // Track comet positions for constellation repulsion
  useEffect(() => {
    const interval = setInterval(() => {
      if (sectionRef.current && comets.length > 0) {
        const rect = sectionRef.current.getBoundingClientRect();
        const now = Date.now();
        
        setComets(prev => prev.map(comet => {
          if (!comet.isClickTriggered || !comet.targetX || !comet.targetY) return comet;
          
          // Calculate animation progress
          const elapsed = (now - comet.id) / 1000; // Convert to seconds
          const progress = Math.min(elapsed / comet.duration, 1);
          
          // Linear interpolation from start to target
          const currentX = comet.startX + (comet.targetX - comet.startX) * progress;
          const currentY = comet.startY + (comet.targetY - comet.startY) * progress;
          
          // Convert percentage to pixels
          const pixelX = (currentX / 100) * rect.width;
          const pixelY = (currentY / 100) * rect.height;
          
          return {
            ...comet,
            currentX: pixelX,
            currentY: pixelY
          };
        }));
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [comets.length]);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-20 md:py-32 relative overflow-hidden cursor-pointer" 
      onClick={handleClick}
    >
      {/* Interactive Constellation Background */}
      <Constellation hoverDistance={180} comets={comets} />
      
      {/* Meteor Shower */}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor"
          style={{
            left: `${meteor.startX}%`,
            top: `${meteor.startY}%`,
            '--meteor-angle': `${meteor.angle}deg`,
            '--meteor-duration': `${meteor.duration}s`,
            animationDelay: `${meteor.delay}s`
          } as React.CSSProperties}
        />
      ))}

      {/* Comets */}
      {comets.map((comet) => (
        <div
          key={comet.id}
          data-comet-id={comet.id}
          className={comet.isClickTriggered ? "comet-fall" : "comet"}
          style={{
            left: `${comet.startX}%`,
            top: `${comet.startY}%`,
            '--comet-duration': `${comet.duration}s`,
            '--start-x': `${comet.startX}%`,
            '--start-y': `${comet.startY}%`,
            '--target-x': comet.targetX ? `${comet.targetX}%` : undefined,
            '--target-y': comet.targetY ? `${comet.targetY}%` : undefined,
            '--tail-angle': comet.angle ? `${comet.angle}deg` : undefined,
            animationDelay: `${comet.delay}s`
          } as React.CSSProperties}
        />
      ))}
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />

      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="inline-block px-6 py-2 mb-4 rounded-sm border border-gold/20 relative group"
              style={{ background: 'transparent' }}
            >
              <span className="text-gold text-sm font-body uppercase tracking-wider">
                About Me
              </span>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ✨ Click to launch a comet to the opposite corner
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              Still in Training Mode
            </h2>
          </div>

          {/* Content in Newspaper Column Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="newspaper-columns text-base md:text-lg leading-relaxed text-muted-foreground space-y-6"
          >
            <p className="first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-gold first-letter:mr-2 first-letter:float-left first-letter:leading-none break-inside-avoid">
              6th sem BSc CSIT student at St. Xavier's College. Been coding for 3+ years now, yet every day 
              m reminded m still a genin at best or mb chunin if u r being generous. The more I learn, the 
              more I realize how much I have to learn.
            </p>

            <p className="break-inside-avoid">
              Got lucky with winning the gold at SXC Sandbox 2.0 with my teammates for Vision Mate, a nav 
              tool for visually impaired people. Did a 14 day 24-hour AI bootcamp and a CISCO's 7-day 
              intensive covering CCNA, AWS, and cybersecurity basics under the mentorship of Er Kiran Pudasaini.
            </p>

            <p className="break-inside-avoid">
              Currently m working with React, Node.js, Python, whilst also experimenting with AI/ML tools 
              like TensorFlow, PyTorch, LLaMA, and RAG systems. Built <strong>ChitraGupta AI</strong> for 
              Nepal specific finance advice and TypeSmash for typing practice that was inspired by monkeytype.
            </p>

            <p className="font-body font-semibold text-foreground break-inside-avoid">
              Open for freelance work. If you need someone eager to learn, fail, iterate, and eventually 
              deliver. I'm your guy. Let's build something together.
            </p>
          </motion.div>

          {/* Quote or Highlight */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mt-16 p-8 md:p-12 border-l-4 border-gold rounded-sm"
            style={{ background: 'transparent' }}
          >
            <p className="text-xl md:text-2xl font-heading italic text-foreground">
              "Keep buildin'... keep learnin' n' see where it goes."
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              — My approach: Understanding why technologies matter and how they solve real-world problems, 
              then diving into implementation.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default About;
