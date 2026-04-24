import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import StaggeredMenu from "./components/StaggeredMenu";
import Navbar from "./components/Navbar";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));
const Blog = lazy(() => import("./pages/Blog").then(module => ({ default: module.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Admin = lazy(() => import("./pages/Admin"));
import Dither from "./components/Dither";
import TargetCursor from "./components/TargetCursor";
import Loader from "./components/Loader";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn more about me', link: '/about' },
  { label: 'Projects', ariaLabel: 'View my engineering projects', link: '/projects' },
  { label: 'Blog', ariaLabel: 'Read my thoughts', link: '/blog' },
  { label: 'Contact', ariaLabel: 'Get in touch for collaboration', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
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
      <main className="relative w-full h-full bg-black">
        <LocationWatcher setLoading={setLoading} />

        <div className="fixed inset-0 pointer-events-none z-[15] bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

        {loading && (
          <Loader 
            isInitial={isInitialLoad} 
            onFinish={() => {
              setLoading(false);
              setIsInitialLoad(false);
            }} 
          />
        )}

        {!isMobile && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            <TargetCursor
              spinDuration={4.1}
              hideDefaultCursor
              parallaxOn
              hoverDuration={0.5}
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
        </div>

        <div className={loading ? "hidden" : "block"}>
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
              colors={['#B19EEF', '#a600ff']}
              accentColor="#a600ff"
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
            />
          </div>
          <div className={`transition-all duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/admin" element={<Admin />} />
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