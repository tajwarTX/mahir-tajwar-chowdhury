import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import StaggeredMenu from "./components/StaggeredMenu";
import Navbar from "./components/Navbar";
import { Home, About, Projects, Contact, Resume } from "./pages";
import Dither from "./components/Dither";
import TargetCursor from "./components/TargetCursor";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn more about me', link: '/about' },
  { label: 'Projects', ariaLabel: 'View my engineering projects', link: '/projects' },
  { label: 'Contact', ariaLabel: 'Get in touch for collaboration', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];



const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ditherRef = useRef(null);

  // Check if device is mobile on load & on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Router>
      <main className="relative w-full h-full bg-black">
        {/* Global Cursor (only on non-mobile) */}
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

        <div ref={ditherRef} className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}>
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

        {/* Content always visible now that loader is removed */}
        <div className="block">
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </div>
        </div>
      </main>
      <Analytics />
    </Router>
  );
};

export default App;