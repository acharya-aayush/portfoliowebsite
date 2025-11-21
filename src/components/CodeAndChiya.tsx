import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Coffee, Code, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/lib/blog';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

const categoryIcons = {
  technical: Code,
  story: Coffee,
  thoughts: Sparkles,
};

const categoryColors = {
  technical: 'from-[#d4af37] to-[#f4cf47]',
  story: 'from-[#c9a961] to-[#d4af37]',
  thoughts: 'from-[#b8943a] to-[#c9a961]',
};

export default function CodeAndChiya() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [stars, setStars] = useState<Star[]>([]);

  // Get blog posts from CMS with error handling
  let blogPosts = [];
  try {
    blogPosts = getAllPosts().slice(0, 3); // Show 3 most recent
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  useEffect(() => {
    // Generate random stars for cosmic background
    const newStars: Star[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Floating stars background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Chiya Steam */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          {/* Animated Chiya steam */}
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            animate={{
              y: [-20, -40, -60],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 1.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <Coffee className="w-8 h-8 text-[#d4af37]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Code & </span>
            <span className="text-[#d4af37]">Chiya</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Thoughts, stories, and technical deep-dives brewed fresh ☕
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {blogPosts.map((post) => {
            const Icon = categoryIcons[post.category] || Code;
            
            return (
              <motion.article
                key={post.slug}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group relative"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#d4af37]/50">
                    {/* Cosmic glow on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ filter: 'blur(40px)' }}
                    />

                    <div className="relative z-10">
                      {/* Category badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                            categoryColors[post.category]
                          } text-white`}
                        >
                          <Icon className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>{post.readTime}</span>
                        </div>

                        {/* Read arrow */}
                        <motion.div
                          className="text-[#d4af37]"
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {/* View All Posts Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f4cf47] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 group"
          >
            View All Posts
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
