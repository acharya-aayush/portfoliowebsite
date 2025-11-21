import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Coffee, Code, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'technical' | 'story' | 'thoughts';
  readTime: string;
  tags: string[];
}

// Sample blog posts - replace with real content later
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Bug That Cost Me 3 Days of Sleep',
    excerpt: 'A deep dive into the most frustrating debugging session of my life, and what I learned about async/await...',
    date: 'Nov 15, 2024',
    category: 'story',
    readTime: '8 min',
    tags: ['JavaScript', 'Debugging', 'Async'],
  },
  {
    id: '2',
    title: 'From Hackathon to Production: Vision Mate\'s Journey',
    excerpt: 'How we took a 24-hour hackathon project and turned it into a real product that helps visually impaired users navigate...',
    date: 'Oct 28, 2024',
    category: 'technical',
    readTime: '12 min',
    tags: ['Computer Vision', 'TensorFlow', 'Hackathon'],
  },
  {
    id: '3',
    title: 'Why I Code at 2 AM (And You Shouldn\'t)',
    excerpt: 'Late-night coding sessions are romanticized, but here\'s what actually happens to your code quality...',
    date: 'Oct 10, 2024',
    category: 'thoughts',
    readTime: '5 min',
    tags: ['Productivity', 'Mental Health', 'Developer Life'],
  },
];

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const CodeAndCoffee = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [stars, setStars] = useState<Star[]>([]);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Generate floating stars/sparkles
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 30; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Code className="w-4 h-4" />;
      case 'story':
        return <Coffee className="w-4 h-4" />;
      case 'thoughts':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      case 'story':
        return 'from-amber-500/20 to-orange-500/20 border-amber-500/30';
      case 'thoughts':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'from-gold/20 to-gold/10 border-gold/30';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative min-h-screen py-20 overflow-hidden bg-background"
    >
      {/* Cosmic Background - Floating Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-gold/40"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Coffee Steam Animation */}
      <div className="absolute top-20 right-20 pointer-events-none">
        <motion.div
          animate={{
            y: [-20, -60],
            opacity: [0.6, 0],
            scale: [1, 1.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <Coffee className="w-16 h-16 text-gold/20" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coffee className="w-8 h-8 text-gold" />
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Code & Coffee
              </h2>
              <Code className="w-8 h-8 text-gold" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Late-night commits, debugging sessions, and thoughts on building things
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group relative"
                onHoverStart={() => setHoveredPost(post.id)}
                onHoverEnd={() => setHoveredPost(null)}
              >
                {/* Cosmic Glow on Hover */}
                {hoveredPost === post.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent blur-xl" />
                  </motion.div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                    hoveredPost === post.id
                      ? 'border-gold/50 bg-background/80'
                      : 'border-foreground/10 bg-background/40'
                  }`}
                >
                  {/* Category Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r border ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {getCategoryIcon(post.category)}
                    <span className="capitalize">{post.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <motion.div
                      className="flex items-center gap-1 text-sm text-gold font-medium"
                      animate={{
                        x: hoveredPost === post.id ? 5 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Read
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.button
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gold/30 bg-gold/5 hover:bg-gold/10 hover:border-gold/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-medium">View All Posts</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Cosmic Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default CodeAndCoffee;
