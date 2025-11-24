import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Journey', href: '#journey' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="text-xl md:text-2xl font-heading font-bold hover-gold"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Aayush Acharya
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm lg:text-base font-body hover-gold gold-underline"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Glassmorphic Mobile Menu - Black/White/Gold Theme */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Glassmorphic backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
          
          {/* Menu content */}
          <div className="relative flex flex-col items-center justify-center h-full space-y-6 px-8">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mb-8 text-center"
            >
              <div className="text-[#d4af37] text-sm font-body uppercase tracking-widest mb-2">Navigation</div>
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.div>

            {/* Nav Links */}
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 50 }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
                onClick={() => scrollToSection(link.href)}
                className="group relative w-full max-w-xs"
              >
                <div className="relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-[#d4af37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <span className="text-2xl font-heading text-white group-hover:text-[#d4af37] transition-colors duration-300">
                    {link.name}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent group-hover:w-full transition-all duration-300" />
                </div>
              </motion.button>
            ))}

            {/* Decorative corner accents */}
            <div className="absolute top-20 left-8 w-16 h-16 border-l-2 border-t-2 border-[#d4af37]/30 rounded-tl-lg" />
            <div className="absolute bottom-20 right-8 w-16 h-16 border-r-2 border-b-2 border-[#d4af37]/30 rounded-br-lg" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
