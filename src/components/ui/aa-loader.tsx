import { motion } from 'framer-motion';

interface AALoaderProps {
  size?: number;
  className?: string;
  variant?: 'stroke' | 'pulse' | 'glow';
}

/**
 * Animated AA Logo Loader
 * Features stroke animation that traces the letters continuously
 * Inspired by Discord loader animation style
 */
export const AALoader = ({ size = 150, className = '', variant = 'stroke' }: AALoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="aa-loader-container">
        <svg
          className={`aa-loader-svg ${variant === 'pulse' ? 'aa-pulse' : ''} ${variant === 'glow' ? 'aa-glow' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          {/* AA Text with outlined stroke for animation */}
          <text
            x="50"
            y="72"
            fontSize="52"
            fontFamily="'Playfair Display', serif"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="-3"
            className={variant === 'stroke' ? 'aa-stroke-animated' : 'aa-fill-animated'}
          >
            AA
          </text>
        </svg>
      </div>

      <style>{`
        .aa-loader-container {
          overflow: visible;
          height: fit-content;
          width: fit-content;
          padding: 20px;
          display: flex;
        }

        .aa-loader-svg {
          overflow: visible;
        }

        /* Stroke animation variant */
        .aa-stroke-animated {
          fill: none;
          stroke: #D4AF37;
          stroke-width: 2px;
          stroke-dasharray: 300px;
          stroke-dashoffset: 0;
          animation: aa-stroke-load 4s infinite linear;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6));
        }

        @keyframes aa-stroke-load {
          0% {
            stroke-dashoffset: 0px;
          }
          100% {
            stroke-dashoffset: 3000px;
          }
        }

        /* Fill animation variant */
        .aa-fill-animated {
          fill: url(#aa-gradient);
          stroke: none;
        }

        /* Pulse animation */
        .aa-pulse .aa-fill-animated {
          animation: aa-pulse-animation 2s ease-in-out infinite;
        }

        @keyframes aa-pulse-animation {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.8));
          }
        }

        /* Glow animation */
        .aa-glow .aa-fill-animated {
          animation: aa-glow-animation 2s ease-in-out infinite;
        }

        @keyframes aa-glow-animation {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(212, 175, 55, 1)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.8));
          }
        }
      `}</style>

      {/* Gradient definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="aa-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Full-screen loading component with AA Logo
 */
export const AALoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <AALoader size={200} />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="mt-8 text-lg text-muted-foreground font-body"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};
