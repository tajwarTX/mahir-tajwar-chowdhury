// components/Loader.jsx
import React, { useEffect } from "react";
import loaderGif from "../assets/loader.gif"; // We are now assuming there is a loader.gif in assets

const Loader = ({ onFinish }) => {
  useEffect(() => {
    // Because GIFs do not have an "ended" event like videos do, 
    // we use a timeout to remove the loader. 
    // You can adjust this '3670' (3.67 seconds) to perfectly match your GIF's length.
    const timer = setTimeout(() => {
      onFinish();
    }, 3670); 

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <img
        src={loaderGif}
        alt="Loading Portfolio..."
        className="w-full h-full object-cover pointer-events-none"
        style={{ 
          display: "block",
          imageRendering: "high-quality"
        }}
      />
    </div>
  );
};

export default Loader;