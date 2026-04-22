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
            filter: "none",
            transform: "translateZ(0)", /* Force hardware acceleration */
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
            filter: "none"
          }}
        />
      )}
    </div>
  );
};

export default Loader;