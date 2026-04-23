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
        <div className="flex flex-col items-center gap-6">
          {/* Minimal High-Tech Transition Loader */}
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[#a600ff]"
            />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="font-geist text-[9px] text-[#a600ff] uppercase tracking-[0.5em] animate-pulse">
              System_Syncing
            </span>
            <span className="font-geist text-[7px] text-white/20 uppercase tracking-[0.2em]">
              Accessing_Archive_Dossier
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
