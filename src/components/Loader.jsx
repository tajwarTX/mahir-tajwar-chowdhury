
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderGif from "../assets/loading.gif";
import { useProgress } from "@react-three/drei";

const Loader = ({ onFinish, isInitial }) => {
  const [progress, setProgress] = useState(0);
  const { active } = useProgress();
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const isProjectsRoute = typeof window !== 'undefined' && window.location.pathname === '/projects';
    const minDuration = isInitial 
      ? (isProjectsRoute ? 4000 : 3000) 
      : 1200;
      
    const startTime = Date.now();
    let interval;
    let finishTimer;

    const checkFinish = () => {
      const elapsed = Date.now() - startTime;
      
      // If we are on the projects route and models are still loading, wait
      if (isProjectsRoute && activeRef.current) {
        finishTimer = setTimeout(checkFinish, 100);
        return;
      }

      if (elapsed < minDuration) {
        finishTimer = setTimeout(checkFinish, 100);
        return;
      }
      
      // Additional small delay for shader compilation after active becomes false
      if (isProjectsRoute) {
        setProgress(100);
        finishTimer = setTimeout(onFinish, 100);
      } else {
        setProgress(100);
        finishTimer = setTimeout(onFinish, 100);
      }
    };

    if (!isInitial) {
      interval = setInterval(() => {
        setProgress(prev => {
           if (isProjectsRoute && activeRef.current) {
             return prev < 99 ? prev + 1 : 99; // Pause at 99% if still loading
           }
           return prev < 100 ? prev + 1 : 100;
        });
      }, minDuration / 100);
    }

    checkFinish();

    return () => {
      clearTimeout(finishTimer);
      clearInterval(interval);
    };
  }, [onFinish, isInitial]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
    >
      {isInitial ? (
        <img
          src={loaderGif}
          alt="Loading..."
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#a600ff]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline"
            >
              <span className="font-orbitron text-[48px] md:text-[64px] font-black text-white leading-none tracking-tighter select-none">
                {progress.toString().padStart(2, '0')}
              </span>
              <span className="font-geist text-[14px] md:text-[16px] text-[#a600ff] font-bold ml-1 uppercase tracking-widest">
                %
              </span>
            </motion.div>

            <motion.div
              animate={{ 
                opacity: [0, 0.4, 0, 0.2, 0],
                x: [0, -3, 3, -1, 0]
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute inset-0 flex items-baseline justify-center pointer-events-none select-none mix-blend-screen"
            >
              <span className="font-orbitron text-[48px] md:text-[64px] font-black text-[#a600ff]/30 leading-none tracking-tighter">
                {progress.toString().padStart(2, '0')}
              </span>
            </motion.div>

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
    </motion.div>
  );
};

export default Loader;
