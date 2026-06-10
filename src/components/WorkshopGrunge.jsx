import React, { useRef, useEffect } from 'react';

/**
 * WorkshopGrunge — A lightweight, canvas-based texture overlay that simulates
 * a heavily-used workshop cutting mat. Rendered once on mount and cached as a
 * static background image so it causes zero scroll/layout jank.
 */
export default function WorkshopGrunge() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas layout and drawing occur in a single asynchronous batch 
    // now highly optimized via offscreen pre-rendering and reduced loop bounds.
    let isMounted = true;
    const deferTimer = requestAnimationFrame(async () => {
      if (!isMounted) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d', { alpha: true });
      ctx.scale(dpr, dpr);

      let seed = 867530999;
      const seededRandom = () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
      const _random = seededRandom;
      const rand = (min = 0, max = 1) => _random() * (max - min) + min;

      // ─── Pre-render extremely heavy Smudge Gradient to offscreen canvas ───
      const smudgeCache = document.createElement('canvas');
      const scSize = 400;
      smudgeCache.width = scSize;
      smudgeCache.height = scSize;
      const sctx = smudgeCache.getContext('2d');
      for (let j = 0; j < 8; j++) {
        const oR = (scSize / 2) * rand(0, 0.4);
        const oA = rand(0, Math.PI * 2);
        const dcx = (scSize / 2) + Math.cos(oA) * oR;
        const dcy = (scSize / 2) + Math.sin(oA) * oR;
        const dr = (scSize / 2) * rand(0.5, 0.9);
        const grad = sctx.createRadialGradient(dcx, dcy, 0, dcx, dcy, dr);
        grad.addColorStop(0, `rgba(30, 25, 20, ${rand(0.04, 0.08)})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = grad;
        sctx.beginPath();
        sctx.ellipse(dcx, dcy, dr, dr * rand(0.7, 1.3), rand(0, Math.PI), 0, Math.PI * 2);
        sctx.fill();
      }

      await new Promise(r => setTimeout(r, 0));

      const drawScratch = (x, y, len, angle, opacity, width, isGouge = false) => {
        const endX = x + Math.cos(angle) * len;
        const endY = y + Math.sin(angle) * len;
        ctx.save();
        ctx.lineCap = 'round';
        if (isGouge) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = '#003B42'; 
          ctx.lineWidth = width * 1.5;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();

          ctx.globalCompositeOperation = 'multiply';
          ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 2.5})`;
          ctx.lineWidth = width;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();

          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.8})`;
          ctx.lineWidth = width * 0.5;
          ctx.beginPath(); ctx.moveTo(x + 0.5, y + 0.5); ctx.lineTo(endX + 0.5, endY + 0.5); ctx.stroke();
        } else {
          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = width;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();
        }
        ctx.restore();
      };

      const CONST_W = 2500;
      const CONST_H = 4000;

      // 1. BLADE MARKS 
      const bladeCount = Math.floor(CONST_W * CONST_H / 500000); 
      for (let i = 0; i < bladeCount; i++) {
        let biasY = CONST_H * (1 - Math.pow(_random(), 1.5));
        drawScratch(rand(0, CONST_W), biasY, rand(40, 300), rand(0, Math.PI * 2), rand(0.15, 0.35), rand(0.8, 2.5), true);
      }

      // 1b. FEW SPARSE DEEP CUTS IN THE TOP SECTION
      const topCutCount = Math.floor(rand(3, 7));
      for (let i = 0; i < topCutCount; i++) {
        // Restrict y to top 30% of the canvas
        const y = rand(0, CONST_H * 0.30);
        drawScratch(rand(0, CONST_W), y, rand(30, 160), rand(0, Math.PI * 2), rand(0.2, 0.4), rand(1.0, 2.2), true);
      }

      const clusterCount = Math.floor(rand(2, 5));
      for (let i = 0; i < clusterCount; i++) {
        const cx = rand(0, CONST_W);
        const cy = CONST_H * (1 - Math.pow(_random(), 2)); 
        const density = Math.floor(rand(5, 12));
        for (let j = 0; j < density; j++) {
          drawScratch(cx + rand(-50, 50), cy + rand(-50, 50), rand(2, 15), rand(0, Math.PI * 2), rand(0.08, 0.18), rand(0.4, 1.0), false);
        }
      }

      // 1c. 2-3 SMALL INK/PAINT DROPS IN THE TOP SECTION
      const dropCount = Math.floor(rand(2, 4));
      for (let i = 0; i < dropCount; i++) {
        const dx = rand(CONST_W * 0.05, CONST_W * 0.95);
        const dy = rand(CONST_H * 0.02, CONST_H * 0.28); // constrained to top section
        const dr = rand(4, 11);

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';

        // Main drop body
        ctx.fillStyle = `rgba(8, 5, 2, ${rand(0.45, 0.75)})`;
        ctx.beginPath();
        ctx.ellipse(dx, dy, dr, dr * rand(0.8, 1.3), rand(0, Math.PI), 0, Math.PI * 2);
        ctx.fill();

        // Tiny splatter dots around it
        const splatCount = Math.floor(rand(2, 5));
        for (let j = 0; j < splatCount; j++) {
          const angle = rand(0, Math.PI * 2);
          const dist = rand(dr * 1.2, dr * 3.5);
          const sr = rand(0.8, 2.5);
          ctx.fillStyle = `rgba(8, 5, 2, ${rand(0.2, 0.5)})`;
          ctx.beginPath();
          ctx.arc(dx + Math.cos(angle) * dist, dy + Math.sin(angle) * dist, sr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Thin drip tail going downward
        if (_random() > 0.4) {
          const tailLen = rand(8, 35);
          ctx.strokeStyle = `rgba(8, 5, 2, ${rand(0.25, 0.5)})`;
          ctx.lineWidth = rand(1, 2.5);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(dx, dy + dr);
          ctx.lineTo(dx + rand(-4, 4), dy + dr + tailLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. FINGERPRINT OILS & DIRTY GRIME (USING CACHE = INSTANT)
      const smudgeCount = Math.floor(CONST_W * CONST_H / 400000) + 15; 
      for (let i = 0; i < smudgeCount; i++) {
        const cx = rand(0, CONST_W);
        let cy = (CONST_H * 0.95) * (1 - Math.pow(_random(), 1.5));
        const radius = rand(100, 400);

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.translate(cx, cy);
        ctx.rotate(rand(0, Math.PI * 2));
        // Draw pre-rendered smudge map instantly
        ctx.drawImage(smudgeCache, -radius, -radius, radius * 2, radius * 2);

        if (_random() > 0.8) {
          const hr = rand(2, 8);
          ctx.fillStyle = `rgba(10, 8, 5, ${rand(0.1, 0.3)})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, hr, hr * rand(0.4, 2.5), 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. BROWN CHEMICAL STAINS
      const stainCount = Math.floor(rand(10, 20));
      for (let i = 0; i < stainCount; i++) {
        const cx = rand(0, CONST_W);
        const cy = rand(CONST_H * 0.05, CONST_H * 0.95);
        const r = rand(10, 50);
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const alpha = rand(0.1, 0.3);
        grad.addColorStop(0, `rgba(60, 40, 20, ${alpha})`);
        grad.addColorStop(1, 'rgba(40, 20, 5, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

    // 5. DUST
      const dustCount = Math.floor(rand(80, 150));
      for (let i = 0; i < dustCount; i++) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255,255,255,${rand(0.01, 0.03)})`;
        ctx.beginPath();
        ctx.arc(rand(0, CONST_W), rand(0, CONST_H), rand(0.2, 0.8), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(deferTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ backgroundColor: '#003B42' }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
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
          <rect x="0" y="0" width="100vw" height="10" fill="url(#ticksX)" stroke="none" />
          
          {Array.from({ length: 40 }).map((_, i) => (
            <text key={`top-num-${i}`} x={i * 100 + 2} y="16">{i}</text>
          ))}
          
          {/* Vertical Rulers */}
          <rect x="0" y="0" width="10" height="100%" fill="url(#ticksY)" stroke="none" />
          
          {Array.from({ length: 150 }).map((_, i) => (
            <text key={`left-num-${i}`} x="2" y={i * 100 + 14}>{i}</text>
          ))}
        </g>

        {/* Protractor Arcs in Lower Left Corner of 2nd screen (~1800px down) */}
        <g>
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
            <line x1="0" y1="0" x2="8000" y2="8000" /> {/* 45 deg */}
            <text x="500" y="490" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(45, 500, 500)">45°</text>
            
            <line x1="0" y1="0" x2="8000" y2="4618" /> {/* 30 deg */}
            <text x="500" y="278" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(30, 500, 288)">30°</text>

            <line x1="0" y1="0" x2="4618" y2="8000" /> {/* 60 deg */}
            <text x="288" y="490" fill="rgba(255,255,255,0.2)" fontSize="24" stroke="none" transform="rotate(60, 288, 500)">60°</text>
          </g>
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

      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
