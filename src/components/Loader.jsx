// components/Loader.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderVideo from "../assets/loader.mp4";

const Loader = ({ onFinish, isInitial }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Longer duration for initial video, shorter for page transitions
    const duration = isInitial ? 3000 : 1500; 
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    // If it's a transition, trigger the morph halfway through
    if (!isInitial) {
      const morphTimer = setTimeout(() => setShowLogo(true), 700);
      return () => {
        clearTimeout(timer);
        clearTimeout(morphTimer);
      };
    }

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
        <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
          {/* Subtle Digital Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(166,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(166,0,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <AnimatePresence mode="wait">
            {!showLogo ? (
              <motion.div
                key="tx-text"
                initial={{ opacity: 0, scale: 0.8, letterSpacing: "1.5em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em" }}
                exit={{ 
                  opacity: [1, 0.8, 1, 0],
                  x: [0, -10, 10, 0],
                  filter: ["blur(0px)", "blur(20px)", "blur(0px)", "blur(40px)"],
                  scale: [1, 1.2, 0.9, 1.5]
                }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="font-orbitron text-7xl md:text-9xl font-black text-white italic relative z-10"
              >
                <span className="text-[#a600ff]">T</span>X
                {/* Glow behind text */}
                <div className="absolute inset-0 bg-[#a600ff] blur-[50px] opacity-20 -z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="logo-image"
                initial={{ opacity: 0, scale: 1.5, filter: "blur(20px) brightness(3)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10"
              >
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(166,0,255,0.6)]" 
                />
                
                {/* Fast Scanline on logo */}
                <motion.div 
                  className="absolute inset-0 w-full h-[3px] bg-white opacity-40"
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  style={{ boxShadow: "0 0 15px #a600ff" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent Status Bar at bottom */}
          <div className="absolute bottom-20 flex flex-col items-center gap-2">
             <div className="w-32 h-[1px] bg-[#a600ff]/20 overflow-hidden relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[#a600ff]"
                />
             </div>
             <span className="font-geist text-[8px] text-[#a600ff] uppercase tracking-[0.6em] animate-pulse">
                Initializing_Neural_Link
             </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
