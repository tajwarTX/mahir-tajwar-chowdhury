// components/Loader.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import loaderVideo from "../assets/loader.mp4";

const Loader = ({ onFinish, isInitial }) => {
  useEffect(() => {
    // Longer duration for initial video, shorter for page transitions
    const duration = isInitial ? 3000 : 1200; 
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, isInitial]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      {isInitial ? (
        <video
          src={loaderVideo}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black relative overflow-hidden">
          {/* Industrial Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <div className="relative flex flex-col items-center gap-12">
            {/* LDR Style Icon Sequence */}
            <div className="flex items-center gap-8 md:gap-12">
              <LDRIcon type="heart" />
              <LDRIcon type="cross" />
              <LDRIcon type="robot" />
            </div>

            {/* Cinematic Status Text */}
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={{ opacity: [1, 0.5, 1, 0.8, 1] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="font-orbitron text-[12px] md:text-[14px] text-white font-black uppercase tracking-[1em]"
              >
                SYSTEM_SEQUENCING
              </motion.div>
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* Extreme Glitch Overlays */}
          <motion.div 
            animate={{ 
              opacity: [0, 0.1, 0, 0.05, 0],
              backgroundColor: ["transparent", "#ffffff", "transparent", "#a600ff", "transparent"]
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 pointer-events-none z-50"
          />
        </div>
      )}
    </div>
  );
};

// Internal component for the LDR icons
const LDRIcon = ({ type }) => {
  const icons = {
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 md:w-16 md:h-16 text-white">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    cross: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-12 h-12 md:w-16 md:h-16 text-white">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    robot: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 md:w-16 md:h-16 text-white">
        <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
      </svg>
    )
  };

  return (
    <motion.div
      animate={{ 
        scale: [1, 1.1, 0.9, 1.05, 1],
        opacity: [1, 0.7, 1, 0.9, 1],
        x: [0, -2, 2, -1, 0],
        filter: ["brightness(1)", "brightness(2)", "brightness(1)", "brightness(3)", "brightness(1)"]
      }}
      transition={{ 
        duration: 0.15, 
        repeat: Infinity, 
        repeatType: "reverse",
        delay: Math.random() * 0.5 
      }}
      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
    >
      {icons[type]}
    </motion.div>
  );
};

export default Loader;
