// components/Loader.jsx
import React, { useEffect, useState } from "react";
import loaderGif from "../assets/loader.gif";
import loaderVideo from "../assets/loader.mp4";

const Loader = ({ onFinish }) => {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // If using a GIF, we need a timeout fallback
    // If the video is playing, it will handle onFinish via onEnded
    const timer = setTimeout(() => {
      onFinish();
    }, 4500); // Slightly longer fallback

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 overflow-hidden">
      {!videoError ? (
        <video
          src={loaderVideo}
          autoPlay
          muted
          playsInline
          onEnded={onFinish}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover pointer-events-none"
          style={{ display: "block" }}
        />
      ) : (
        <img
          src={loaderGif}
          alt="Loading Portfolio..."
          className="w-full h-full object-cover pointer-events-none"
          style={{ 
            display: "block",
            imageRendering: "-webkit-optimize-contrast"
          }}
        />
      )}
    </div>
  );
};

export default Loader;