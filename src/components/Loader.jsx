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
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Main Glowing Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px) brightness(2)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px) brightness(1.2)"
              }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_20px_rgba(166,0,255,0.4)]" 
              />
            </motion.div>

            {/* Glitch Layer 1 */}
            <motion.div
              animate={{ 
                opacity: [0, 0.3, 0, 0.2, 0],
                x: [0, -4, 4, -2, 0],
                clipPath: [
                  "inset(20% 0 50% 0)",
                  "inset(10% 0 80% 0)",
                  "inset(40% 0 30% 0)",
                  "inset(60% 0 10% 0)",
                  "inset(20% 0 50% 0)"
                ]
              }}
              transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }}
              className="absolute inset-0 pointer-events-none"
            >
              <img 
                src="/logo.png" 
                alt="Logo Glitch" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain brightness-200 hue-rotate-[280deg]" 
              />
            </motion.div>

            {/* Scanline Effect */}
            <motion.div 
              className="absolute inset-0 w-full h-[2px] bg-[#a600ff] opacity-40 z-10"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ boxShadow: "0 0 10px #a600ff" }}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="font-geist text-[9px] text-[#a600ff] uppercase tracking-[0.6em] animate-pulse">
              System_Recalibrating
            </span>
            <span className="font-geist text-[7px] text-white/20 uppercase tracking-[0.2em]">
              Archive_Access_Authorized
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
