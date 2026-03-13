import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StaggeredMenu from "./components/StaggeredMenu";
import Navbar from "./components/Navbar";
import { Home, About, Projects, Contact } from "./pages";
import Dither from "./components/Dither";
import TargetCursor from "./components/TargetCursor";
import Loader from "./components/Loader";

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Track mobile
  const ditherRef = useRef(null);

  // Check if device is mobile on load & on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="relative w-full h-full">
      {/* Show loader if loading */}
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {/* Global Cursor (only on non-mobile) */}
      {!isMobile && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <TargetCursor
            spinDuration={4.1}
            hideDefaultCursor
            parallaxOn
            hoverDuration={0.5}
            containerRef={ditherRef}
          />
        </div>
      )}

      {/* Global Dither Background */}
      <div ref={ditherRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10">
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
      {/* Show main site only when not loading */}
      {!loading && (
        <Router basename="/mahir-tajwar-chowdhury/">
          <Navbar />
          <div className="fixed inset-0 z-20 pointer-events-auto">
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials
              displayItemNumbering={true}
              menuButtonColor="#ffffff"
              openMenuButtonColor="#fff"
              changeMenuColorOnOpen={true}
              colors={['#B19EEF', '#5227FF']}
              accentColor="#a600ff"
              onMenuOpen={() => console.log('Menu opened')}
              onMenuClose={() => console.log('Menu closed')}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      )}
    </main>
  );
};

export default App;