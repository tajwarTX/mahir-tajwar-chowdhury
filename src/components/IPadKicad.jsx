import React from 'react';

import ipadFullPng from '../assets/ipad/ipad-full.png';

const IPadKicad = () => {
  return (
    <div
      className="relative z-[5] pointer-events-none origin-center"
      style={{
        transform: 'rotate(-8deg) scale(0.95) translate3d(0,0,0)',
        width: '920px',
        height: '660px'
      }}
    >
      {/* Hardware-accelerated box-shadow layer (0 layout thrashing) */}
      <div 
        className="absolute"
        style={{
          top: '6px', bottom: '6px', left: '6px', right: '6px',
          backgroundColor: '#000',
          borderRadius: '42px', // Matches iPad corner curve
          boxShadow: '-10px 14px 22px 4px rgba(0,0,0,0.75), -2px 6px 12px 1px rgba(0,0,0,0.5)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
      <img 
        src={ipadFullPng} 
        alt="High Quality Composite iPad" 
        className="absolute top-0 left-0 w-full h-full object-contain" 
        style={{ pointerEvents: 'none', transform: 'translateZ(0)' }} 
      />
    </div>
  );
};

export default IPadKicad;
