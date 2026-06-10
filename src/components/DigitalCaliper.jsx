import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const DigitalCaliper = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const sliderX = useTransform(scrollYProgress, [0, 1], [250, 0]);
  
  const mainTextRef = React.useRef(null);
  const decimalTextRef = React.useRef(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Maps scroll states dynamically to a standard metric scale (40px = 10mm -> 1mm = 4px)
    // Max sliderX is 250px -> 250 / 4 = 62.5mm
    const val = (1 - latest) * 62.5;
    const strVal = val.toFixed(1);
    const [main, dec] = strVal.split('.');
    
    if (mainTextRef.current) mainTextRef.current.textContent = main;
    if (decimalTextRef.current) decimalTextRef.current.textContent = "." + dec;
  });

  return (
    // Re-applied unified CSS rotation so the whole parallel assembly tilts together elegantly
    <div className="absolute top-[50%] left-[5%] z-[5] pointer-events-none origin-center transform rotate-[18deg] scale-[0.55] md:scale-95">
      <svg width="1150" height="380" viewBox="0 0 1150 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* TRUE NEUTRAL Black plastic carbon feel for scale and jaws */}
          <linearGradient id="carbonPlastic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#303030" />
            <stop offset="20%" stopColor="#202020" />
            <stop offset="80%" stopColor="#202020" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>

          {/* Subtle diagonal micro-texture for carbon effect */}
          <pattern id="carbonTexture" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="url(#carbonPlastic)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3d3d3d" strokeWidth="0.5" opacity="0.4" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="#141414" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          
          <linearGradient id="matteBlackHousing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="30%" stopColor="#222222" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          
          {/* Metallic gradient for the main measuring track insert */}
          <linearGradient id="metallicScale" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e5e5" />
            <stop offset="15%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>

          {/* Machine-cut tick patterns */}
          <pattern id="metricTicks" width="8" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="14" x2="0" y2="4" stroke="#555555" strokeWidth="1" />
          </pattern>
          <pattern id="metricMajorTicks" width="40" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="14" x2="0" y2="0" stroke="#111111" strokeWidth="1.8" />
          </pattern>
        </defs>

        {/* --- DYNAMIC DEPTH PROBE ROD --- */}
        <motion.g style={{ x: sliderX }}>
          {/* 3D Under-Shadow */}
          <rect x="300" y="130" width="570" height="8" fill="#080808" />
          {/* Top Face */}
          <rect x="300" y="126" width="570" height="8" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" />
          {/* Top Edge Highlight */}
          <rect x="300" y="127" width="570" height="1.5" fill="#444444" opacity="0.6" />
        </motion.g>

        {/* --- FIXED SECTION (Main Scale Rule & Left Measuring Jaws) --- */}
        <g id="fixed-assembly">
          {/* Main Carbon Plastic Ruler Beam 3D Extrusion */}
          <rect x="115" y="112" width="735" height="44" fill="#080808" rx="1" />
          
          {/* Main Carbon Plastic Ruler Beam */}
          <rect x="115" y="108" width="735" height="44" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" rx="1" />
          <rect x="116" y="109" width="733" height="2" fill="#444444" opacity="0.6" />
          
          {/* Precision Scale Sticker Insert Array / Measurement Scale */}
          {/* Deep Groove Base representing the gap */}
          <rect x="150" y="114" width="690" height="27" fill="#0c0c0c" rx="1" />
          {/* Main Metallic Ruler Insert */}
          <rect x="150" y="115" width="690" height="26" fill="url(#metallicScale)" stroke="#999999" strokeWidth="0.5"/>
          
          {/* Track Lighting & Inner Geometry */}
          {/* Top highlight / metallic glare along the whole length */}
          <rect x="151" y="116" width="688" height="8" fill="#ffffff" opacity="0.5" />
          {/* Inner Drop Shadow cast downwards by the top carbon rim groove */}
          <rect x="151" y="115" width="688" height="3" fill="#050505" opacity="0.15" />
          <rect x="151" y="115" width="688" height="1" fill="#050505" opacity="0.3" />
          {/* Bottom Inner Shadow to sink the bottom edge */}
          <rect x="151" y="139" width="688" height="2" fill="#555555" opacity="0.3" />
          
          <rect x="160" y="127" width="670" height="14" fill="url(#metricTicks)" opacity="0.8" />
          <rect x="160" y="127" width="670" height="14" fill="url(#metricMajorTicks)" />
          
          <g fill="#222222" fontFamily="sans-serif" fontSize="12" fontWeight="bold" opacity="0.85">
            <text x="160" y="124" textAnchor="middle">0</text>
            <text x="200" y="124" textAnchor="middle">10</text>
            <text x="240" y="124" textAnchor="middle">20</text>
            <text x="280" y="124" textAnchor="middle">30</text>
            <text x="320" y="124" textAnchor="middle">40</text>
            <text x="360" y="124" textAnchor="middle">50</text>
            <text x="400" y="124" textAnchor="middle">60</text>
            <text x="440" y="124" textAnchor="middle">70</text>
            <text x="480" y="124" textAnchor="middle">80</text>
            <text x="520" y="124" textAnchor="middle">90</text>
            <text x="560" y="124" textAnchor="middle">100</text>
            <text x="600" y="124" textAnchor="middle">110</text>
            <text x="640" y="124" textAnchor="middle">120</text>
            <text x="680" y="124" textAnchor="middle">130</text>
            <text x="720" y="124" textAnchor="middle">140</text>
            <text x="760" y="124" textAnchor="middle">150</text>
          </g>

          {/* FIXED UPPER JAW - bigger curve, shifted left */}
          <path d="M 145 113 
                   L 145 50 
                   L 149 50 
                   Q 165 75, 173 113 Z" fill="#080808" />
          <path d="M 145 108 
                   L 145 45 
                   L 148 45 
                   Q 164 70, 171 108 Z" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" />
          <path d="M 148 46 Q 163 72, 169 107" stroke="#444444" strokeWidth="1" opacity="0.6" fill="none" />

          {/* FIXED LOWER JAW */}
          <path d="M 160 157 
                   L 160 275 
                   L 155 275 
                   Q 135 195, 115 175 
                   L 115 157 Z" fill="#080808" />
          <path d="M 160 152 
                   L 160 270 
                   L 155 270 
                   Q 135 190, 115 170 
                   L 115 152 Z" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" />
          <path d="M 115 170 Q 135 190, 155 270 L 152 270 Q 132 193, 113 170 Z" fill="#777777" opacity="0.2" />
        </g>

        {/* --- SLIDING ASSEMBLY --- */}
        <motion.g style={{ x: sliderX }}>
          
          {/* MOVING UPPER JAW - bigger curve, shifted left */}
          <path d="M 145 113 
                   L 145 50 
                   L 141 50 
                   Q 125 75, 117 113 Z" fill="#080808" />
          <path d="M 145 108 
                   L 145 45 
                   L 142 45 
                   Q 126 70, 119 108 Z" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" />
          <path d="M 142 46 Q 127 72, 121 107" stroke="#444444" strokeWidth="1" opacity="0.6" fill="none" />

          {/* BRIDGE CONNECTOR — bottom-right edge, jaw meets housing body */}
          {/* 3D under-shadow */}
          <rect x="145" y="95" width="16" height="18" fill="#050505" rx="1" />
          {/* Main body */}
          <rect x="145" y="92" width="16" height="18" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" rx="1" />
          {/* Top edge highlight */}
          <rect x="146" y="93" width="14" height="1.5" fill="#555555" opacity="0.7" />
          {/* Right edge highlight (butts into housing) */}
          <rect x="159" y="93" width="2" height="17" fill="#555555" opacity="0.4" />

          {/* MOVING LOWER JAW */}
          <path d="M 160 157 
                   L 160 275 
                   L 165 275 
                   Q 185 195, 205 175 
                   L 205 157 Z" fill="#080808" />
          <path d="M 160 152 
                   L 160 270 
                   L 165 270 
                   Q 185 190, 205 170 
                   L 205 152 Z" fill="url(#carbonTexture)" stroke="#1c1c1c" strokeWidth="0.5" />
          <path d="M 205 170 Q 185 190, 165 270 L 168 270 Q 188 193, 207 170 Z" fill="#ffffff" opacity="0.05" />

          {/* MAIN BLACK DIGITAL HOUSING BLOCK */}
          {/* 3D Under-shadow Extrusion */}
          <rect x="156" y="85" width="190" height="90" fill="#0a0a0a" rx="6" />
          <rect x="156" y="80" width="190" height="90" fill="url(#matteBlackHousing)" rx="6" stroke="#151515" strokeWidth="1" />
          {/* Top highlight for thick geometry */}
          <path d="M 162 81 L 340 81" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          
          {/* Display Window Rim Accent */}
          <rect x="166" y="103" width="145" height="46" fill="#050505" rx="4" />
          <rect x="166" y="102" width="145" height="46" fill="#111111" rx="4" stroke="#050505" strokeWidth="1" />
          
          {/* LCD Panel Glass Screen - 3D inner drop shadow & glass effects */}
          {/* Deep inner bevel/gap */}
          <rect x="171" y="106" width="135" height="38" fill="#0f0f0f" rx="3" />
          {/* Main LCD background (classic pale greenish-grey) */}
          <rect x="172" y="107" width="133" height="36" fill="#aab2a1" rx="2" />
          {/* LCD inner shadow at top & left */}
          <rect x="172" y="107" width="133" height="4" fill="#676d5e" rx="2" opacity="0.5" />
          <rect x="172" y="107" width="4" height="36" fill="#676d5e" rx="2" opacity="0.3" />
          
          {/* Faint 'Ghost' 88.8 inactive hardware segments just behind the real text */}
          <g fill="#8f9588" fontFamily="'Digital-7', 'DS-Digital', 'DSEG7 Classic', monospace" fontSize="36" fontWeight="bold">
            <text x="250" y="136" textAnchor="end" letterSpacing="1">88</text>
            <text x="250" y="136" textAnchor="start" letterSpacing="1">.8</text>
          </g>

          <g fill="#1a1c18" fontFamily="'Digital-7', 'DS-Digital', 'DSEG7 Classic', monospace" fontSize="36" fontWeight="bold" opacity="0.9">
            {/* Integer part anchored to grow left from the decimal */}
            <text ref={mainTextRef} x="250" y="136" textAnchor="end" letterSpacing="1">
              62
            </text>
            {/* Decimal dot and fractional part anchored to stay fixed */}
            <text ref={decimalTextRef} x="250" y="136" textAnchor="start" letterSpacing="1">
              .5
            </text>
          </g>
          <text x="298" y="122" fill="#1a1c18" fontFamily="sans-serif" fontSize="10" fontWeight="800" textAnchor="end" opacity="0.9">mm</text>

          {/* Faint Glass Glare Reflection over the screen */}
          <path d="M 172 107 L 230 107 L 195 143 L 172 143 Z" fill="#ffffff" opacity="0.12" style={{ pointerEvents: 'none' }} />

          {/* Control Interface Branding & Graphics */}
          <rect x="166" y="86" width="120" height="12" fill="#101010" rx="2" />
          <text x="172" y="95" fill="#38bdf8" fontFamily="sans-serif" fontSize="8" fontWeight="800">mm/inch</text>
          <rect x="235" y="88" width="14" height="8" fill="#0284c7" rx="1.5" />

          {/* Base Instrument System Controls */}
          {/* Buttons 3D Extrusion */}
          <rect x="166" y="152" width="145" height="14" fill="#101010" rx="2" />
          
          <text x="182" y="161" fill="#a0a0a0" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">OFF</text>
          <rect x="195" y="157" width="10" height="6" fill="#7f1d1d" rx="1" />
          <rect x="195" y="155" width="10" height="6" fill="#ef4444" rx="1" />
          
          <text x="220" y="161" fill="#a0a0a0" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">ON</text>
          
          <rect x="250" y="157" width="10" height="6" fill="#713f12" rx="1" />
          <rect x="250" y="155" width="10" height="6" fill="#eab308" rx="1" />
          
          <text x="280" y="161" fill="#a0a0a0" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">ZERO</text>

          {/* MECHANICAL ANCILLARY THUMB HARDWARE */}
          <path d="M 230 72 L 242 72 L 240 82 L 232 82 Z" fill="#111111" />
          <path d="M 230 68 L 242 68 L 240 78 L 232 78 Z" fill="#555555" />
          <rect x="226" y="65" width="20" height="5" rx="1" fill="#999999" />

          <path d="M 300 174 C 300 212, 342 212, 342 174 Z" fill="#111111" />
          <path d="M 300 170 C 300 208, 342 208, 342 170 Z" fill="#222222" />
          <g stroke="#111111" strokeWidth="1.8">
            <line x1="305" y1="170" x2="305" y2="190" />
            <line x1="311" y1="170" x2="311" y2="196" />
            <line x1="317" y1="170" x2="317" y2="199" />
            <line x1="323" y1="170" x2="323" y2="199" />
            <line x1="329" y1="170" x2="329" y2="196" />
            <line x1="335" y1="170" x2="335" y2="190" />
          </g>

        </motion.g>
      </svg>
    </div>
  );
};

export default DigitalCaliper;
