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
import { io } from 'socket.io-client';

const INITIAL_ABOUT = {
  bio: "",
  description: "",
  modules: [],
  status: "",
  location: ""
};


function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#sidadmin');

  const [projects, setProjects] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [about, setAbout] = useState(INITIAL_ABOUT);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Assuming backend is running on default port or configured URL. 
    // In production, this should be an environment variable.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    console.log("DEBUG: Attempting to connect to:", backendUrl);

    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: false
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('DEBUG: Connected to backend successfully with ID:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('DEBUG: Connection error:', err.message);
    });

    newSocket.on('init_data', (data) => {
      setProjects(data.projects);
      setHobbies(data.hobbies);
      setAbout(data.about);
    });

    newSocket.on('sync_projects', (data) => {
      console.log('Frontend: Received sync_projects', data);
      setProjects(data);
    });
    newSocket.on('sync_hobbies', (data) => {
      console.log('Frontend: Received sync_hobbies', data);
      setHobbies(data);
    });
    newSocket.on('sync_about', (data) => {
      console.log('Frontend: Received sync_about', data);
      setAbout(data);
    });

    return () => newSocket.close();
  }, []);

  const handleProjectsUpdate = (newProjects) => {
    console.log('Frontend: Emitting update_projects', newProjects);
    setProjects(newProjects);
    socket?.emit('update_projects', newProjects);
  };

  const handleHobbiesUpdate = (newHobbies) => {
    console.log('Frontend: Emitting update_hobbies', newHobbies);
    setHobbies(newHobbies);
    socket?.emit('update_hobbies', newHobbies);
  };

  const handleAboutUpdate = (newAbout) => {
    console.log('Frontend: Emitting update_about', newAbout);
    setAbout(newAbout);
    socket?.emit('update_about', newAbout);
  };

  // Force load completion if entering as admin to bypass splash screen hang
  useEffect(() => {
    if (isAdmin) {
      setLoadingProgress(100);
      setIsAppReady(true);
      setHasEntered(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#sidadmin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
              setProjects={handleProjectsUpdate}
              hobbies={hobbies}
              setHobbies={handleHobbiesUpdate}
              about={about}
              setAbout={handleAboutUpdate}
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
