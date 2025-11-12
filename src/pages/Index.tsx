import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ProjectsDemo from '@/components/ProjectsDemo';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import EasterEgg from '@/components/EasterEgg';

const Index = () => {
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

      <div className="min-h-screen">
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
      </div>
    </>
  );
};

export default Index;
