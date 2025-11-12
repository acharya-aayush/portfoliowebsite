import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-gold/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo/Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h3 className="font-heading text-2xl font-bold mb-2">Aayush Acharya</h3>
              <p className="text-sm text-muted-foreground">
                AI/ML Enthusiast • Fullstack Developer • Designer
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const element = document.querySelector(`#${item.toLowerCase()}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-body hover-gold gold-underline"
                >
                  {item}
                </button>
              ))}
            </motion.nav>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center md:text-right"
            >
              <p className="text-sm text-muted-foreground">
                © {currentYear} Aayush Acharya. All rights reserved.
              </p>
            </motion.div>
          </div>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-center"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
