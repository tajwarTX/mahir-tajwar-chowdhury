// components/Loader.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderGif from "../assets/loading.gif";

const Loader = ({ onFinish, isInitial }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Longer duration for initial GIF, shorter for page transitions
    const duration = isInitial ? 3000 : 1200; 
    
    if (!isInitial) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 1 : 100));
      }, duration / 100);
      
      const timer = setTimeout(() => {
        onFinish();
      }, duration + 100); // Small buffer

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      const timer = setTimeout(() => {
        onFinish();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onFinish, isInitial]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      {isInitial ? (
        <img
          src={loaderGif}
          alt="Loading..."
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden bg-[#050505]">
          {/* Background Animated Logo (Stroked/Watermark feel) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.img 
              src="/logo.png" 
              alt="Background Logo" 
              className="w-[120vw] max-w-none opacity-[0.03] grayscale invert brightness-200"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 80, repeat: Infinity, ease: "linear" },
                scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#a600ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

          {/* Minimal Percentage Counter */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline"
            >
              <span className="font-orbitron text-[32px] md:text-[48px] font-black text-white leading-none tracking-tighter select-none">
                {progress.toString().padStart(2, '0')}
              </span>
              <span className="font-geist text-[12px] md:text-[14px] text-[#a600ff] font-bold ml-1 uppercase tracking-widest">
                %
              </span>
            </motion.div>

            {/* Glitch Overlay Text (intermittent) */}
            <motion.div
              animate={{ 
                opacity: [0, 0.4, 0, 0.2, 0],
                x: [0, -3, 3, -1, 0]
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute inset-0 flex items-baseline justify-center pointer-events-none select-none mix-blend-screen"
            >
              <span className="font-orbitron text-[32px] md:text-[48px] font-black text-[#a600ff]/30 leading-none tracking-tighter">
                {progress.toString().padStart(2, '0')}
              </span>
            </motion.div>

            {/* Progress Bar */}
            <div className="mt-4 w-32 h-[1px] bg-white/5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#a600ff] shadow-[0_0_10px_#a600ff]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
