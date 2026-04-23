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
        <div className="flex flex-col items-center justify-center gap-10 w-full h-full relative overflow-hidden">
          {/* Subtle Digital Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(166,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(166,0,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative">
            {/* High Intensity Glow Base */}
            <div className="absolute inset-0 bg-[#a600ff] blur-[60px] opacity-20 animate-pulse" />

            {/* Main Logo with Chromatic Aberration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px) brightness(3)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px) brightness(1.1)"
              }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-10"
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(166,0,255,0.6)]" 
              />
            </motion.div>

            {/* Red Glitch Offset */}
            <motion.div
              animate={{ 
                opacity: [0, 0.4, 0, 0.2, 0],
                x: [-2, 3, -4, 2, 0],
                y: [1, -2, 2, -1, 0],
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.1 }}
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
            >
              <img 
                src="/logo.png" 
                alt="Logo Glitch Red" 
                className="w-32 h-32 md:w-44 md:h-44 object-contain brightness-200 saturate-[5] hue-rotate-[0deg]" 
              />
            </motion.div>

            {/* Cyan Glitch Offset */}
            <motion.div
              animate={{ 
                opacity: [0, 0.4, 0, 0.2, 0],
                x: [2, -3, 4, -2, 0],
                y: [-1, 2, -2, 1, 0],
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.15 }}
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
            >
              <img 
                src="/logo.png" 
                alt="Logo Glitch Cyan" 
                className="w-32 h-32 md:w-44 md:h-44 object-contain brightness-200 saturate-[5] hue-rotate-[180deg]" 
              />
            </motion.div>

            {/* Fast Scanline */}
            <motion.div 
              className="absolute inset-0 w-full h-[3px] bg-white opacity-60 z-20"
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              style={{ boxShadow: "0 0 15px #a600ff" }}
            />
          </div>

          <div className="flex flex-col items-center gap-2 z-10">
            <span className="font-orbitron text-[11px] md:text-[13px] text-white font-bold uppercase tracking-[0.8em] animate-pulse">
              SYNCING_INTERFACE
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-[#a600ff]/30" />
              <span className="font-geist text-[8px] text-[#a600ff] uppercase tracking-[0.4em] font-medium">
                ESTABLISHING_LINK
              </span>
              <div className="w-12 h-[1px] bg-[#a600ff]/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
