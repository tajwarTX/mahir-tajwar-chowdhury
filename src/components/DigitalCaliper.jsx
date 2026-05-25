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
    <div className="absolute top-[65%] left-[10%] z-[5] pointer-events-none origin-center transform rotate-0 scale-[0.6] md:scale-100">
      {/* Significantly reduced drop shadow to look less floating */}
      <svg width="900" height="350" viewBox="0 0 900 350" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.15))' }}>
        <defs>
          <linearGradient id="metalBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd6e0" />
            <stop offset="35%" stopColor="#a7b4c2" />
            <stop offset="100%" stopColor="#919eac" />
          </linearGradient>
          <linearGradient id="metalJaw" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a2b0be" />
            <stop offset="55%" stopColor="#7d8d9f" />
            <stop offset="100%" stopColor="#aebbc8" />
          </linearGradient>
          <linearGradient id="metalSlider" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfd9e2" />
            <stop offset="45%" stopColor="#a5b2bf" />
            <stop offset="100%" stopColor="#8a98a8" />
          </linearGradient>
          <linearGradient id="plasticBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2230" />
            <stop offset="100%" stopColor="#0a0f16" />
          </linearGradient>
          <linearGradient id="screenGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef3ee" />
            <stop offset="100%" stopColor="#d3ddd7" />
          </linearGradient>
          <pattern id="microBrushed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          </pattern>
          <filter id="softInner" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
            <feColorMatrix
              in="innerShadow"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.38 0"
            />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
          <pattern id="rulerTicks" width="10" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="0" y2="10" stroke="#1f2a36" strokeWidth="1" />
          </pattern>
          <pattern id="rulerMajorTicks" width="50" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="0" y2="5" stroke="#1f2a36" strokeWidth="2" />
          </pattern>
        </defs>

        {/* --- FIXED PART --- */}
        <g id="fixed-part">
          {/* Fixed Upper Jaw */}
          {/* Fixed Upper Jaw */}
          <path d="M 100 130 L 100 90 L 115 60 L 130 60 L 130 130 Z" fill="#111a24" />
          
          {/* Fixed Lower Jaw */}
          <path d="M 100 170 L 100 240 L 115 300 L 130 300 L 130 170 Z" fill="#111a24" />
          
          {/* Jaw Contact Faces (Darker accent) */}
          {/* Jaw Contact Faces (Darker accent) */}
          <rect x="126" y="60" width="4" height="70" fill="#cfd7de" />
          <rect x="126" y="170" width="4" height="130" fill="#cfd7de" />

          {/* Main Ruler Bar */}
          <rect x="100" y="130" width="750" height="40" fill="#d8dfe6" rx="2" />
          <rect x="100" y="156" width="750" height="14" fill="#aeb6be" rx="2" opacity="0.95" />
          
          {/* Ruler Groove */}
          {/* Ruler Groove */}
          <rect x="130" y="145" width="700" height="10" fill="#c4ccd4" opacity="0.9" />

          {/* Major Ticks */}
          <rect x="130" y="130" width="700" height="20" fill="url(#rulerMajorTicks)" />
          {/* Minor Ticks (Offset to prevent overlap) */}
          <g transform="translate(0,0)">
            <rect x="130" y="130" width="700" height="20" fill="url(#rulerTicks)" />
          </g>

          <rect x="100" y="130" width="40" height="40" fill="#d8dfe6" rx="2" />
          <rect x="100" y="156" width="40" height="14" fill="#aeb6be" rx="2" opacity="0.95" />

          <g opacity="0.75">
            <text x="130" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">0</text>
            <text x="180" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">5</text>
            <text x="230" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">10</text>
            <text x="280" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">15</text>
            <text x="330" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">20</text>
            <text x="380" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">25</text>
            <text x="430" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">30</text>
            <text x="480" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">35</text>
            <text x="530" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">40</text>
            <text x="580" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">45</text>
            <text x="630" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">50</text>
            <text x="680" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">55</text>
            <text x="730" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">60</text>
            <text x="780" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">65</text>
            <text x="830" y="144" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="700">70</text>
          </g>

          <rect x="620" y="136" width="210" height="28" fill="#e3e8ed" rx="3" opacity="0.95" />
          <text x="642" y="149" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="800" opacity="0.85">ELECTRONIC</text>
          <text x="642" y="161" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="800" opacity="0.85">DIGITAL CALIPER</text>

          {/* A more subtle highlight/shadow for depth on the fixed bar */}
          <rect x="100" y="130" width="750" height="40" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" rx="2" />

          {/* Subtle highlights and shadows for jaws and body to enhance 3D effect */}
        </g>

        {/* --- MOVING PART --- */}
        <motion.g style={{ x: sliderX }}>
          
          {/* Moving Upper Jaw */}
          <path d="M 130 130 L 130 60 L 145 60 L 160 90 L 160 130 Z" fill="#111a24" />
          
          {/* Moving Lower Jaw */}
          <path d="M 130 170 L 130 300 L 145 300 L 160 240 L 160 170 Z" fill="#111a24" />

          {/* Jaw Contact Faces */}
          <rect x="130" y="60" width="4" height="70" fill="#cfd7de" />
          <rect x="130" y="170" width="4" height="130" fill="#cfd7de" />

          {/* Subtle highlights and shadows for moving jaw and body */}
          <rect x="130" y="90" width="252" height="104" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" rx="10" />
          <rect x="130" y="90" width="252" height="104" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" rx="10" transform="translate(0,1)" />

          {/* Top Locking Screw */}

          {/* Main Slider Body */}
          <rect x="130" y="90" width="252" height="104" fill="url(#plasticBlack)" rx="10" />
          <rect x="132" y="92" width="248" height="100" fill="#111a24" rx="9" opacity="0.65" />
          <rect x="138" y="96" width="236" height="10" fill="#0b0f14" rx="6" opacity="0.9" />

          {/* LCD Screen Border */}
          <rect x="144" y="106" width="170" height="58" fill="#0b0f14" rx="4" />
          {/* LCD Screen Background */}
          {/* LCD Screen Background with subtle inner shadow */}
          <rect x="150" y="112" width="158" height="46" fill="#c6d0cc" rx="2" />
          <rect x="150" y="112" width="158" height="46" fill="none" stroke="rgba(0,0,0,0.24)" strokeWidth="1" rx="2" />

          {/* Digital Text */}
          <text 
            x="272" 
            y="136" 
            fill="#0b0f14" 
            fontFamily="'Digital-7 Mono', sans-serif" 
            fontSize="40" 
            fontWeight="normal" 
            textAnchor="end"
            dominantBaseline="middle"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {measurement}
          </text>
          {/* mm label inside screen */}
          <text x="300" y="136" fill="#0b0f14" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="800" dominantBaseline="middle" textAnchor="end">mm</text>

          {/* Battery Cover / Indent */}
          <rect x="320" y="96" width="56" height="98" fill="#0b0f14" rx="4" />
          <rect x="324" y="100" width="48" height="90" fill="#111a24" rx="3" opacity="0.85" />
          <g opacity="0.35">
            <line x1="328" y1="104" x2="372" y2="104" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="110" x2="372" y2="110" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="116" x2="372" y2="116" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="122" x2="372" y2="122" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="128" x2="372" y2="128" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="134" x2="372" y2="134" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="140" x2="372" y2="140" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="146" x2="372" y2="146" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="152" x2="372" y2="152" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="158" x2="372" y2="158" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="164" x2="372" y2="164" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="170" x2="372" y2="170" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="176" x2="372" y2="176" stroke="#ffffff" strokeWidth="1" />
            <line x1="328" y1="182" x2="372" y2="182" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Buttons */}
          {/* Buttons with subtle bevels */}
          <text x="156" y="102" fill="#ffffff" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" opacity="0.9">mm/inch</text>
          <rect x="222" y="95" width="20" height="6" fill="#2ea7ff" rx="1.5" opacity="0.9" />

          <rect x="150" y="168" width="166" height="18" fill="#0b0f14" rx="3" opacity="0.9" />

          <text x="178" y="180" fill="#ffffff" fontFamily="ui-sans-serif, system-ui" fontSize="9.5" fontWeight="800" dominantBaseline="middle" textAnchor="middle" opacity="0.92">OFF</text>
          <rect x="193" y="176" width="20" height="6" fill="#e03a3a" rx="1.5" />
          <text x="228" y="180" fill="#ffffff" fontFamily="ui-sans-serif, system-ui" fontSize="9.5" fontWeight="800" dominantBaseline="middle" textAnchor="middle" opacity="0.92">ON</text>
          <rect x="263" y="176" width="20" height="6" fill="#f2d34b" rx="1.5" />
          <text x="299" y="180" fill="#ffffff" fontFamily="ui-sans-serif, system-ui" fontSize="9.5" fontWeight="800" dominantBaseline="middle" textAnchor="middle" opacity="0.92">ZERO</text>

          {/* Bevel on the slider body (top edge) */}
          <path d="M 130 90 L 382 90 L 380 92 L 132 92 Z" fill="rgba(255,255,255,0.06)" />
          {/* Bevel on the slider body (bottom edge) */}
          <path d="M 130 194 L 382 194 L 380 192 L 132 192 Z" fill="rgba(0,0,0,0.1)" />
          
        </motion.g>
      </svg>
    </div>
  );
};

export default DigitalCaliper;
