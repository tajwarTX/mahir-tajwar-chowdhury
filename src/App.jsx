import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";

import StaggeredMenu from "./components/StaggeredMenu";
import Navbar from "./components/Navbar";
const Home = lazy(() => import("./pages/Home"));
const Home2 = lazy(() => import("./pages/Home2"));
const About = lazy(() => import("./pages/About"));
import Projects from "./pages/Projects";
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));
const Awards = lazy(() => import("./pages/Awards"));
import Dither from "./components/Dither";
import TargetCursor from "./components/TargetCursor";
import Loader from "./components/Loader";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Home 2', ariaLabel: 'Go to home page 2', link: '/home2' },
  { label: 'About', ariaLabel: 'Learn more about me', link: '/about' },
  { label: 'Projects', ariaLabel: 'View my engineering projects', link: '/projects' },
  { label: 'Awards', ariaLabel: 'View my honors and awards', link: '/awards' },
  { label: 'Resume', ariaLabel: 'Request my resume', link: '/resume' },
  { label: 'Contact', ariaLabel: 'Get in touch for collaboration', link: '/contact' }
];

const socialItems = [
  { label: 'Facebook', link: 'https://www.facebook.com/tajwar.tx' },
  { label: 'GitHub', link: 'https://github.com/tajwarTX' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/mahir-tajwar-chowdhury/' }
];

const LocationWatcher = ({ setLoading }) => {
  const location = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setLoading(true);
  }, [location.pathname, setLoading]);

  return null;
};

const DitherWrapper = () => {
  const location = useLocation();
  if (location.pathname === '/home2') return null;
  return (
    <Dither
      waveColor={[0.3, 0.1, 0.4]}
      disableAnimation={false}
      enableMouseInteraction={false}
      mouseRadius={0}
      colorNum={6}
      waveAmplitude={0.3}
      waveFrequency={3}
      waveSpeed={0.05}
    />
  );
};



const App = () => {
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ditherRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Router>
      <main className="relative w-full h-full overflow-x-hidden bg-black">
        <LocationWatcher setLoading={setLoading} />



        <AnimatePresence>
          {loading && (
            <Loader 
              isInitial={isInitialLoad} 
              onFinish={() => {
                setLoading(false);
                setIsInitialLoad(false);
              }} 
            />
          )}
        </AnimatePresence>

        {!isMobile && !loading && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            <TargetCursor
              spinDuration={4.1}
              hideDefaultCursor
              parallaxOn
              hoverDuration={0.05}
              containerRef={ditherRef}
            />
          </div>
        )}

        <div 
          ref={ditherRef} 
          className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-all duration-500 ${menuOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          style={{ 
            display: menuOpen ? 'none' : 'block',
            willChange: 'opacity, transform' 
          }}
        >
          <DitherWrapper />
        </div>

        <div 
          className="opacity-100"
        >
          <Navbar />
          <div className="fixed inset-0 z-[1010] pointer-events-none">
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials
              displayItemNumbering={true}
              menuButtonColor="#ffffff"
              openMenuButtonColor="#fff"
              changeMenuColorOnOpen={true}
              colors={['#B19EEF', '#e1ff51']}
              accentColor="#e1ff51"
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
            />
          </div>
          <div className={`transition-all duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home2" element={<Home2 />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/awards" element={<Awards />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </main>
      <Analytics />
    </Router>
  );
};

export default App;