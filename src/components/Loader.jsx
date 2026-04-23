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
      <img
        src={loaderGif}
        alt="Loading..."
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Loader;
