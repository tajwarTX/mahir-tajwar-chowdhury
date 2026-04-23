// components/Loader.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderGif from "../assets/loading.gif";

const DigitShuffle = ({ value }) => {
  const [display, setDisplay] = useState(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const chars = "0123456789";
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(chars[Math.floor(Math.random() * chars.length)]);
      iterations++;
      if (iterations >= 2) {
        clearInterval(interval);
        setDisplay(value);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [value]);

  return <span>{display}</span>;
};

const Loader = ({ onFinish, isInitial }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = isInitial ? 3000 : 1500; // Slightly longer to appreciate the shuffle
    
    if (!isInitial) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 1 : 100));
      }, duration / 100);
      
      const timer = setTimeout(() => {
        onFinish();
      }, duration + 200);

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

  const pString = progress.toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999] overflow-hidden">
      {isInitial ? (
        <img
          src={loaderGif}
          alt="Loading..."
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full relative">
          
          {/* Orbital Scanner Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 border border-white/5 rounded-full"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#a600ff] rounded-full shadow-[0_0_15px_#a600ff]" />
          </motion.div>

          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-80 h-80 border border-white/5 rounded-full opacity-50"
          >
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full" />
          </motion.div>

          {/* Background Data Particles */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             {[...Array(20)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ 
                   opacity: [0, 1, 0], 
                   scale: [0, 1, 0],
                   x: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
                   y: [Math.random() * 1000 - 500, Math.random() * 1000 - 500]
                 }}
                 transition={{ 
                   duration: Math.random() * 2 + 1, 
                   repeat: Infinity,
                   delay: Math.random() * 2
                 }}
                 className="absolute w-0.5 h-0.5 bg-[#a600ff] rounded-full"
               />
             ))}
          </div>

          <div className="relative flex flex-col items-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-baseline"
            >
              <div className="font-orbitron text-[40px] md:text-[56px] font-black text-white leading-none tracking-tighter select-none w-[110px] md:w-[150px] flex justify-center">
                <DigitShuffle value={pString[0]} />
                {pString.length > 2 ? (
                   <>
                     <DigitShuffle value={pString[1]} />
                     <DigitShuffle value={pString[2]} />
                   </>
                ) : (
                  <DigitShuffle value={pString[1]} />
                )}
              </div>
              <span className="font-geist text-[14px] text-[#a600ff] font-bold uppercase tracking-widest -ml-2">
                %
              </span>
            </motion.div>

            {/* Progress Bar */}
            <div className="mt-6 w-32 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#a600ff] shadow-[0_0_10px_#a600ff]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
               <span className="font-geist text-[8px] text-[#a600ff] uppercase tracking-[0.6em]">
                 Linking_To_Mainframe
               </span>
               <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 h-1 bg-[#a600ff] rounded-full"
                    />
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
