// components/Loader.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import loaderGif from "../assets/loading.gif";

const Loader = ({ onFinish, isInitial }) => {
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    // Longer duration for initial GIF, shorter for page transitions
    const duration = isInitial ? 3000 : 1200; 
    
    // For transitions, we run a numeric counter
    let interval;
    if (!isInitial) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Fast, slightly irregular increments for a 'loading' feel
          const inc = Math.floor(Math.random() * 20) + 10;
          return Math.min(prev + inc, 100);
        });
      }, 80);
    }

    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
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
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* Background Trace of the number for depth */}
            <span className="absolute inset-0 font-orbitron text-[120px] md:text-[180px] font-black text-[#a600ff]/5 select-none blur-sm">
              {progress}%
            </span>
            
            {/* Main Numeric Counter */}
            <motion.span 
              key={progress}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative font-orbitron text-[120px] md:text-[180px] font-black text-white tracking-tighter leading-none"
            >
              {progress}<span className="text-[#a600ff]">%</span>
            </motion.span>
          </div>

          <div className="flex flex-col items-center mt-[-10px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "240px" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="h-[2px] bg-[#a600ff] shadow-[0_0_15px_#a600ff]"
            />
            <span className="font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.8em] mt-4 animate-pulse font-bold">
              SYSTEM_SYNCHRONIZING
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
