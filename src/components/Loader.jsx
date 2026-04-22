// components/Loader.jsx
import React, { useEffect, useState } from "react";

// Reference assets directly from the public folder to avoid Vite compression
const LOADER_VIDEO = "/loader.mp4";
const LOADER_GIF = "/loader.gif";

const Loader = ({ onFinish }) => {
  const [videoError, setVideoError] = useState(false);
  const [cacheBuster] = useState(Date.now());

  useEffect(() => {
    // If using a GIF, we need a timeout fallback
    const timer = setTimeout(() => {
      onFinish();
    }, 4500); 

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999] overflow-hidden">
      {/* Cinematic Grain Overlay to mask compression artifacts */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay animate-grain" />
      
      {!videoError ? (
        <video
          src={`${LOADER_VIDEO}?v=${cacheBuster}`}
          autoPlay
          muted
          playsInline
          onEnded={onFinish}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover pointer-events-none"
          style={{ 
            display: "block",
            filter: "contrast(1.02) brightness(1.02) saturate(1.05) sharp(1px)", /* Sharpening */
            imageRendering: "high-quality",
            transform: "translateZ(0)",
          }}
        />
      ) : (
        <img
          src={`${LOADER_GIF}?v=${cacheBuster}`}
          alt="Loading Portfolio..."
          className="w-full h-full object-cover pointer-events-none"
          style={{ 
            display: "block",
            imageRendering: "-webkit-optimize-contrast",
            filter: "contrast(1.1) brightness(1.1)",
            transform: "translateZ(0)"
          }}
        />
      )}

      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-grain {
          background-image: url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Stop_Frame_Grain.png");
          background-size: 200px;
          width: 300%;
          height: 300%;
          left: -100%;
          top: -100%;
        }
      `}</style>
    </div>
  );
};

export default Loader;