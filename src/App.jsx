import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScrollCanvas from './components/ScrollCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Play from './components/Play';
import Contact from './components/Contact';
import LandingPage from './components/LandingPage';
import Admin from './components/Admin';

const INITIAL_PROJECTS = [
  {
    title: 'Immersive Scapes',
    category: 'WebGL Experiment',
    year: '2025',
    color: 'bg-red-500'
  },
  {
    title: 'Neon Drift',
    category: 'Brand Identity',
    year: '2024',
    color: 'bg-blue-500'
  },
  {
    title: 'Future Corp',
    category: 'Web Design',
    year: '2024',
    color: 'bg-green-500'
  },
  {
    title: 'Echo Systems',
    category: 'Development',
    year: '2023',
    color: 'bg-purple-500'
  }
];

const INITIAL_HOBBIES = [
  { title: 'GLSL Shaders', date: '01.2025' },
  { title: 'Canvas Physics', date: '12.2024' },
  { title: 'React Fiber', date: '11.2024' },
  { title: 'Generative Art', date: '10.2024' },
];

const INITIAL_ABOUT = {
  bio: "I am a creative developer focused on crafting immersive digital experiences where code meets art.",
  description: "Specializing in high-fidelity motion and 3D web applications. Every project is an exploration of the boundary between the digital and the physical.",
  modules: ['React', 'WebGL', 'Framer Motion', 'Three.js', 'Node.js', 'Figma'],
  status: "Optimized",
  location: "India"
};

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#sidadmin');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio-projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [hobbies, setHobbies] = useState(() => {
    const saved = localStorage.getItem('portfolio-hobbies');
    return saved ? JSON.parse(saved) : INITIAL_HOBBIES;
  });
  const [about, setAbout] = useState(() => {
    const saved = localStorage.getItem('portfolio-about');
    return saved ? JSON.parse(saved) : INITIAL_ABOUT;
  });

  // Force load completion if entering as admin to bypass splash screen hang
  useEffect(() => {
    if (isAdmin) {
      setLoadingProgress(100);
      setIsAppReady(true);
      setHasEntered(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio-hobbies', JSON.stringify(hobbies));
  }, [hobbies]);

  useEffect(() => {
    localStorage.setItem('portfolio-about', JSON.stringify(about));
  }, [about]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#sidadmin');
    };

    // Cross-tab synchronization via storage event
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'portfolio-projects' && e.newValue) setProjects(JSON.parse(e.newValue));
        if (e.key === 'portfolio-hobbies' && e.newValue) setHobbies(JSON.parse(e.newValue));
        if (e.key === 'portfolio-about' && e.newValue) setAbout(JSON.parse(e.newValue));
      } catch (err) {
        console.error("SYNC_ERROR // Buffer Corrupted", err);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleLoad = () => setIsWindowLoaded(true);

    if (document.readyState === 'complete') {
      setIsWindowLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (loadingProgress === 100 && isWindowLoaded) {
      const timer = setTimeout(() => {
        setIsAppReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, isWindowLoaded]);

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatePresence>
        {!hasEntered && (
          <LandingPage
            progress={loadingProgress}
            onEnter={() => setHasEntered(true)}
            isLoaded={isAppReady}
          />
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'} ${isAdmin ? 'overflow-auto' : ''}`}>
        {!isAdmin && <ScrollCanvas onProgress={setLoadingProgress} />}

        {!isAdmin && <Navbar />}

        <main className="relative z-10">
          {isAdmin ? (
            <Admin
              projects={projects}
              setProjects={setProjects}
              hobbies={hobbies}
              setHobbies={setHobbies}
              about={about}
              setAbout={setAbout}
            />
          ) : (
            <>
              <Hero />
              <About about={about} />
              <Work projects={projects} />
              <Play hobbies={hobbies} />
              <Contact />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
