import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * A high-performance, animated black-screen menu.
 * Optimized with Framer Motion for cinematic entrance and exit (outro).
 */
export const StaggeredMenu = ({
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  isFixed = true,
  accentColor = '#5227FF',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      document.body.style.overflow = 'hidden';
    } else {
      onMenuClose?.();
      document.body.style.overflow = '';
    }
  }, [onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      document.body.style.overflow = '';
    }
  }, [onMenuClose]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnClickAway, open, closeMenu]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Animation Variants
  const menuVariants = {
    hidden: { y: "-100%" },
    visible: { 
      y: "0%",
      transition: { 
        duration: 0.6, 
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.08,
        delayChildren: 0.2
      } 
    },
    exit: { 
      y: "-100%",
      transition: { 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] } }
  };

  return (
    <div className={`menu-wrapper ${isFixed ? 'fixed inset-0' : 'relative w-full h-full'} z-[1000] pointer-events-none ${className}`}>
      {/* Global Header Container */}
      <header 
        className="absolute left-0 w-full flex items-center justify-end px-4 md:px-6 pointer-events-none"
        style={{ top: '20px' }}
      >
        <div className="flex items-center gap-5 md:gap-8 pointer-events-auto">
          {/* Resume Button (Pushed UNDER the curtain layers) */}
          <Link
            to="/resume"
            className="cursor-target font-geist text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase leading-[0.5] no-underline px-0.5 py-0 transition-colors duration-500 z-[1000] relative mr-2 md:mr-4"
            style={{ color: menuButtonColor }}
          >
            RESUME
          </Link>

          {/* Contact Button (Pushed UNDER the curtain layers) */}
          <Link
            to="/contact"
            className="cursor-target font-geist text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase leading-[0.5] no-underline px-0.5 py-0 transition-colors duration-500 z-[1000] relative"
            style={{ color: menuButtonColor }}
          >
            CONTACT
          </Link>

          {/* Menu Button (Always ON TOP of the curtain layers) */}
          <button
            ref={toggleBtnRef}
            onClick={toggleMenu}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer group focus:outline-none cursor-target px-0.5 py-0 transition-colors duration-500 z-[1010] relative"
            style={{ color: open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor }}
            aria-label={open ? "Close Menu" : "Open Menu"}
          >
            <div className="w-[2.9rem] md:w-[3.6rem] flex justify-end overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={open ? 'close' : 'menu'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="font-geist text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase leading-[0.5]"
                >
                  {open ? 'CLOSE' : 'MENU'}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className={`relative w-2 h-2 flex items-center justify-center transition-transform duration-600 ease-[cubic-bezier(0.19,1,0.22,1)] ${open ? 'rotate-45' : 'rotate-0'}`}>
              <span className="absolute w-full h-[1.5px] bg-current rotate-0" />
              <span className="absolute w-full h-[1.5px] bg-current rotate-90" />
            </div>
          </button>
        </div>
      </header>

      {/* Animated Multi-Layer Menu Panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[1002] pointer-events-none overflow-hidden">
            {/* Layer 1 (Medium Purple - Subdued) */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 bg-[#a600ff]"
            />
            {/* Layer 2 (Deep Purple - Subdued) */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="absolute inset-0 bg-[#4b0073]"
            />
            {/* Layer 3 (Final Main Layer) */}
            <motion.aside
              ref={panelRef}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
              className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-center p-12 pointer-events-auto"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto">
                <ul className="list-none p-0 m-0 flex flex-col items-center gap-4">
                  {items.map((it, idx) => (
                    <motion.li 
                      key={idx} 
                      variants={itemVariants}
                      className="relative flex items-center justify-center group"
                    >
                      <Link
                        to={it.link}
                        onClick={() => closeMenu()}
                        className="relative flex items-center justify-center text-white no-underline transition-colors duration-200"
                      >
                        {displayItemNumbering && (
                          <span className="absolute right-full mr-8 opacity-20 font-geist text-[10px] md:text-xs font-medium tracking-widest mt-1 md:mt-2 whitespace-nowrap pointer-events-none group-hover:text-[#a600ff] group-hover:opacity-100 transition-all duration-200">
                            (0{idx + 1})
                          </span>
                        )}
                        <span className="cursor-target font-orbitron font-extrabold text-[1.8rem] md:text-[4.5rem] leading-[0.85] tracking-tighter uppercase inline-block px-3 py-2 hover:text-[#a600ff] transition-colors duration-200">
                          {it.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              {displaySocials && socialItems.length > 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="mt-auto w-full max-w-md pt-6 border-t border-white/10 flex flex-col items-center gap-4"
                >
                  <h3 className="font-geist text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.3em] font-semibold">
                    Social Channels
                  </h3>
                  <ul className="list-none p-0 m-0 flex gap-6 flex-wrap justify-center">
                    {socialItems.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target text-white/60 hover:text-[#a600ff] font-geist text-[10px] md:text-[11px] uppercase tracking-widest transition-colors duration-200 px-2 py-0.5"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;

