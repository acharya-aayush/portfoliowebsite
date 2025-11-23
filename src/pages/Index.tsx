import { Helmet } from 'react-helmet-async';
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_TIMINGS } from '@/config/constants';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { RandomLoadingScreen } from '@/components/ui/random-loaders';
import ShikshaFortune from '@/components/ShikshaFortune';
import ScrollProgress from '@/components/ScrollProgress';
import MillenniumFalconCursor from '@/components/MillenniumFalconCursor';

// Lazy load heavy components
const About = lazy(() => import('@/components/About'));
const Skills = lazy(() => import("@/components/Skills"));
const CosmicJourney = lazy(() => import('@/components/CosmicJourney'));
const CodeAndChiya = lazy(() => import("@/components/CodeAndChiya"));
const Projects = lazy(() => import("@/components/Projects"));
const ProjectsDemo = lazy(() => import('@/components/ProjectsDemo'));
const Contact = lazy(() => import('@/components/Contact'));
const EasterEgg = lazy(() => import('@/components/EasterEgg'));

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, ANIMATION_TIMINGS.LOADING_SCREEN_DURATION);

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
            transition={{ duration: ANIMATION_TIMINGS.FADE_OUT }}
            className="min-h-screen"
          >
            {/* Scroll Progress Indicator */}
            <ScrollProgress />
            {/* Custom Millennium Falcon Cursor */}
            <MillenniumFalconCursor />
            <Navbar />
            <main>
              <Hero />
              <Suspense fallback={<div className="min-h-screen" />}>
                <About />
                <Skills />
                <CosmicJourney />
                {/* <CodeAndChiya /> */}
                <Projects />
                {/* <ProjectsDemo /> */}
                <Contact />
                <EasterEgg />
              </Suspense>
            </main>
            <Footer />
            {/* Global Fortune Teller Easter Egg - Works everywhere on the page */}
            <ShikshaFortune />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
