import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const DigitalCaliper = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // The caliper translates from X=300 down to X=0 as user scrolls
  const sliderX = useTransform(scrollYProgress, [0, 1], [300, 0]);
  
  const [measurement, setMeasurement] = useState("87.30");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // We map the physical movement to an 87.3mm scale
    const val = (1 - latest) * 87.3;
    setMeasurement(val.toFixed(2));
  });

  return (
    <div className="absolute top-[65%] left-[10%] z-[5] pointer-events-none origin-center transform -rotate-12 scale-[0.6] md:scale-100">
      {/* Significantly reduced drop shadow to look less floating */}
      <svg width="900" height="350" viewBox="0 0 900 350" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.15))' }}>
        <defs>
          <pattern id="rulerTicks" width="10" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="0" y2="10" stroke="#506173" strokeWidth="1" />
          </pattern>
          <pattern id="rulerMajorTicks" width="50" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="0" y2="5" stroke="#506173" strokeWidth="2" />
          </pattern>
        </defs>

        {/* --- FIXED PART --- */}
        <g id="fixed-part">
          {/* Fixed Upper Jaw */}
          <path d="M 100 130 L 100 90 L 115 60 L 130 60 L 130 130 Z" fill="#8a99a8" />
          
          {/* Fixed Lower Jaw */}
          <path d="M 100 170 L 100 240 L 115 300 L 130 300 L 130 170 Z" fill="#8a99a8" />
          
          {/* Jaw Contact Faces (Darker accent) */}
          <rect x="126" y="60" width="4" height="70" fill="#6a7b8c" />
          <rect x="126" y="170" width="4" height="130" fill="#6a7b8c" />

          {/* Main Ruler Bar */}
          <rect x="100" y="130" width="750" height="40" fill="#bcc6cf" rx="2" />
          
          {/* Ruler Groove */}
          <rect x="130" y="145" width="700" height="10" fill="#8a99a8" />
          
          {/* Ticks */}
          <rect x="130" y="130" width="700" height="20" fill="url(#rulerTicks)" />
          <rect x="130" y="130" width="700" height="20" fill="url(#rulerMajorTicks)" />
        </g>

        {/* --- MOVING PART --- */}
        <motion.g style={{ x: sliderX }}>
          
          {/* Moving Upper Jaw */}
          <path d="M 130 130 L 130 60 L 145 60 L 160 90 L 160 130 Z" fill="#8a99a8" />
          
          {/* Moving Lower Jaw */}
          <path d="M 130 170 L 130 300 L 145 300 L 160 240 L 160 170 Z" fill="#8a99a8" />

          {/* Jaw Contact Faces */}
          <rect x="130" y="60" width="4" height="70" fill="#6a7b8c" />
          <rect x="130" y="170" width="4" height="130" fill="#6a7b8c" />

          {/* Top Locking Screw */}
          <rect x="225" y="75" width="10" height="15" fill="#506173" />
          <rect x="215" y="65" width="30" height="10" fill="#506173" rx="2" />

          {/* Main Slider Body */}
          <rect x="130" y="90" width="240" height="100" fill="#8a99a8" rx="6" />

          {/* LCD Screen Border */}
          <rect x="145" y="105" width="150" height="60" fill="#3f4a56" rx="4" />
          {/* LCD Screen Background */}
          <rect x="150" y="110" width="140" height="50" fill="#e2e8e4" rx="2" />
          
          {/* Digital Text */}
          <text 
            x="265" 
            y="137" 
            fill="#3f4a56" 
            fontFamily="'Digital-7 Mono', sans-serif" 
            fontSize="42" 
            fontWeight="normal" 
            textAnchor="end"
            dominantBaseline="middle"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {measurement}
          </text>
          {/* mm label inside screen */}
          <text x="268" y="135" fill="#3f4a56" fontFamily="sans-serif" fontSize="12" fontWeight="bold" dominantBaseline="middle">mm</text>

          {/* Battery Cover / Indent */}
          <rect x="305" y="105" width="50" height="60" fill="#6a7b8c" rx="4" />

          {/* Buttons */}
          <rect x="150" y="172" width="30" height="10" fill="#506173" rx="5" />
          <rect x="195" y="172" width="30" height="10" fill="#506173" rx="5" />
          <rect x="240" y="172" width="30" height="10" fill="#506173" rx="5" />
          
        </motion.g>
      </svg>
    </div>
  );
};

export default DigitalCaliper;
