import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { getPostBySlug } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const categoryColors = {
  technical: 'from-[#d4af37] to-[#f4cf47]',
  story: 'from-[#c9a961] to-[#d4af37]',
  thoughts: 'from-[#b8943a] to-[#c9a961]',
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#d4af37] mb-4">404</h1>
          <p className="text-gray-400 mb-8">Blog post not found</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#d4af37] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${
                categoryColors[post.category]
              } text-white`}
            >
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-[#d4af37]"
          >
            {post.title}
          </motion.h1>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto px-6 pb-20"
      >
        <article className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold text-[#d4af37] mb-6" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-[#d4af37] mt-12 mb-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-3" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-300 leading-relaxed mb-6" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-[#d4af37] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-[#d4af37] pl-6 italic text-gray-400 my-6"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-8">
                  <table className="min-w-full border-collapse" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-gray-700 px-4 py-2 bg-white/5 text-left" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-gray-700 px-4 py-2" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Back button at bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#d4af37] hover:underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
