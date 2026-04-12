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
      videoEl.addEventListener("ended", handleEnded);
      
      // Force play on mobile and ensure autoplay works
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Autoplay failed:", error);
          // Retry play after a short delay
          setTimeout(() => {
            videoEl.play().catch(() => console.log("Play retry failed"));
          }, 100);
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
        controls={false}
        className="w-full h-full object-cover"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default Loader;