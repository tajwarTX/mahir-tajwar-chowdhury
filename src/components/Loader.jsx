// components/Loader.jsx
import React, { useEffect, useRef } from "react";
import loaderVideo from "../assets/loader.mp4"; // adjust path if needed

const Loader = ({ onFinish }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleEnded = () => {
      onFinish(); // notify App that video ended
    };

    const videoEl = videoRef.current;
    if (videoEl) {
      // Rigorously enforce muted and playsinline to satisfy iOS Safari autoplay strictly.
      videoEl.muted = true;
      videoEl.defaultMuted = true;
      videoEl.setAttribute("playsinline", "");
      videoEl.setAttribute("webkit-playsinline", "");
      
      videoEl.addEventListener("ended", handleEnded);
      
      // Force play on mobile and ensure autoplay works
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Autoplay failed:", error);
          // If autoplay is blocked (like in Safari Low Power Mode), 
          // skip the loader completely to avoid getting stuck on a play button.
          onFinish();
        });
      }
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("ended", handleEnded);
      }
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <video
        ref={videoRef}
        src={loaderVideo}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        controls={false}
        className="w-full h-full object-cover pointer-events-none"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default Loader;