import React from 'react';

const CuttingMatLayer = () => {
  // To cover 300vh, we assume an average viewport height of 1000px, so ~3000px height.
  // We will generate an SVG that relies on patterns for the grid to stretch infinitely,
  // while absolute elements (angles, protractors) are positioned relative to the top-left or centers.

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" style={{ backgroundColor: '#0E4735' }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Minor Grid Pattern */}
          <pattern id="minorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1.8" />
          </pattern>

          {/* Major Grid Pattern */}
          <pattern id="majorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#minorGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          </pattern>
          
          {/* Tick Pattern */}
          <pattern id="ticksX" width="100" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 10 3 M 20 0 L 20 5 M 30 0 L 30 3 M 40 0 L 40 5 M 50 0 L 50 7 M 60 0 L 60 5 M 70 0 L 70 3 M 80 0 L 80 5 M 90 0 L 90 3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          </pattern>
          <pattern id="ticksY" width="10" height="100" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 3 10 M 0 20 L 5 20 M 0 30 L 3 30 M 0 40 L 5 40 M 0 50 L 7 50 M 0 60 L 5 60 M 0 70 L 3 70 M 0 80 L 5 80 M 0 90 L 3 90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          </pattern>
        </defs>

        {/* Base Grid Layer */}
        <rect width="100%" height="100%" fill="url(#majorGrid)" />

        {/* Borders and Numbering Group */}
        <g stroke="none" fill="rgba(255,255,255,0.2)" fontFamily="monospace" fontSize="14">
          
          {/* Horizontal Rulers (Top, Middle, Bottom sections) */}
          <rect x="0" y="0" width="100%" height="10" fill="url(#ticksX)" stroke="none" />
          
          {Array.from({ length: 41 }).map((_, i) => (
            <text key={`top-num-${i}`} x={i * 100 + 2} y="16">{i}</text>
          ))}
          
          {/* Vertical Rulers */}
          <rect x="0" y="0" width="10" height="100%" fill="url(#ticksY)" stroke="none" />
          
          {Array.from({ length: 90 }).map((_, i) => (
            <text key={`left-num-${i}`} x="2" y={i * 100 + 14}>{i}</text>
          ))}
        </g>

        {/* Protractor Arcs in Lower Left Corner of 2nd screen (~1800px down) */}
        <g transform="translate(100, 1800) scale(1.5)" stroke="rgba(255,255,255,0.2)" fill="none">
          <circle cx="0" cy="0" r="100" />
          <circle cx="0" cy="0" r="150" />
          <circle cx="0" cy="0" r="200" strokeDasharray="5,5" />
          
          {/* Radiating lines for 0-90 degrees */}
          {[0, 15, 30, 45, 60, 75, 90].map(deg => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 200;
            const y = -Math.sin(rad) * 200;
            return (
              <g key={`deg-${deg}`}>
                <line x1="0" y1="0" x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
                <text x={x + 5} y={y - 5} fill="rgba(255,255,255,0.2)" fontSize="10" stroke="none">{deg}°</text>
              </g>
            );
          })}
        </g>

        {/* Angle Projections from top-left (Origin) */}
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" strokeDasharray="10,5">
          <line x1="0" y1="0" x2="3000" y2="3000" /> {/* 45 deg */}
          <text x="500" y="490" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(45, 500, 500)">45°</text>
          
          <line x1="0" y1="0" x2="3000" y2="1732" /> {/* 30 deg */}
          <text x="500" y="278" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(30, 500, 288)">30°</text>

          <line x1="0" y1="0" x2="1732" y2="3000" /> {/* 60 deg */}
          <text x="288" y="490" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(60, 288, 500)">60°</text>
        </g>

        {/* Paper Layout Bounds */}
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" strokeDasharray="5,5" fill="none">
          {/* A4 Size approx in pixels (e.g., 210x297 mm -> 595x842 px) */}
          <rect x="200" y="200" width="595" height="842" />
          <text x="210" y="220" fill="rgba(255,255,255,0.2)" fontSize="14" stroke="none" fontWeight="bold">A4</text>
          
          {/* A5 Size */}
          <rect x="200" y="1100" width="420" height="595" />
          <text x="210" y="1120" fill="rgba(255,255,255,0.2)" fontSize="14" stroke="none" fontWeight="bold">A5</text>
          
          {/* A6 Size */}
          <rect x="200" y="1800" width="298" height="420" />
          <text x="210" y="1820" fill="rgba(255,255,255,0.2)" fontSize="14" stroke="none" fontWeight="bold">A6</text>
        </g>
      </svg>
    </div>
  );
};

export default CuttingMatLayer;
