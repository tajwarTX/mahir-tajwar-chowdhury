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
    videoEl.addEventListener("ended", handleEnded);

    return () => {
      videoEl.removeEventListener("ended", handleEnded);
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
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Loader;