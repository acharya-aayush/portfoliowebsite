import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ProjectsDemo from '@/components/ProjectsDemo';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import EasterEgg from '@/components/EasterEgg';
import { RandomLoadingScreen } from '@/components/ui/random-loaders';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (adjust duration as needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Aayush Acharya – AI/ML Enthusiast & Fullstack Developer</title>
        <meta 
          name="description" 
          content="Professional portfolio of Aayush Acharya - AI/ML Enthusiast, Fullstack Developer & Designer specializing in modern web technologies and AI solutions."
        />
        <meta 
          name="keywords" 
          content="Aayush Acharya, AI/ML Enthusiast, Fullstack Developer, Web Developer, Designer, React, Portfolio, AI, Machine Learning"
        />
        <link rel="canonical" href="https://aayushacharya.com" />
      </Helmet>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <RandomLoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              {/* <ProjectsDemo /> */}
              <Contact />
            </main>
            <Footer />
            <EasterEgg />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
