// components/Loader.jsx
import React, { useEffect, useState } from "react";

const Loader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "INITIALIZING CORE SYSTEMS...",
    "CALIBRATING SENSORS...",
    "SYNCING NEURAL INTERFACE...",
    "ESTABLISHING SECURE LINK...",
    "DECRYPTING ARCHIVES...",
    "LOADING 3D MODULES...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999] overflow-hidden font-orbitron">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#a600ff 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }} 
      />

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center">
        {/* Glowing Circuit Ring */}
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-white/5 stroke-[2]"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-[#a600ff] stroke-[3]"
              style={{
                strokeDasharray: '283',
                strokeDashoffset: 283 - (283 * progress) / 100,
                filter: 'drop-shadow(0 0 8px #a600ff)',
                transition: 'stroke-dashoffset 0.1s linear'
              }}
            />
          </svg>
          
          {/* Inner Decorative Rings */}
          <div className="absolute inset-4 border border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute inset-8 border border-[#a600ff]/20 rounded-full animate-reverse-spin" />

          {/* Percentage Counter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
              {progress}<span className="text-[#a600ff] text-xl md:text-2xl ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Status Text Area */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#a600ff] rounded-full animate-pulse" />
            <span className="text-[10px] md:text-xs text-white/60 uppercase tracking-[0.4em] font-medium min-w-[200px] text-center">
              {statuses[statusIndex]}
            </span>
          </div>

          {/* Progress Bar Detail */}
          <div className="w-48 md:w-64 h-[2px] bg-white/5 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-[#a600ff] transition-all duration-100 ease-linear shadow-[0_0_10px_#a600ff]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-[8px] text-[#a600ff]/40 uppercase tracking-[0.2em] mt-2">
            Protocol: SECURE_AUTH_v4.2 // PORTFOLIO_LOAD
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
