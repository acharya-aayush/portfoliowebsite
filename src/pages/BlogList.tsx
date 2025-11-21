import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Code, Coffee, Sparkles } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

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

export default function BlogList() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-6 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 via-transparent to-black" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="text-white">Code & </span>
            <span className="text-[#d4af37]">Chiya</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            All posts • {posts.length} articles
          </motion.p>
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {posts.map((post, index) => {
            const Icon = categoryIcons[post.category];
            
            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300">
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                      style={{ filter: 'blur(30px)' }}
                    />

                    <div className="relative z-10">
                      {/* Category */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                            categoryColors[post.category]
                          } text-white`}
                        >
                          <Icon className="w-3 h-3" />
                          {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
