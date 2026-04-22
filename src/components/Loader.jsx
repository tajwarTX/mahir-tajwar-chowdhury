// components/Loader.jsx
import React, { useEffect } from "react";

const Loader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Adjust duration to match the GIF length

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      <video
        src="/src/assets/loader.mp4"
        autoPlay
        muted
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Loader;
