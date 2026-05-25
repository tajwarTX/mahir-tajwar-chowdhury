import React, { useRef, useEffect } from 'react';

/**
 * WorkshopGrunge — A lightweight, canvas-based texture overlay that simulates
 * a heavily-used workshop cutting mat. Rendered once on mount and cached as a
 * static background image so it causes zero scroll/layout jank.
 */
export default function WorkshopGrunge() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the canvas to the full scrollable area of the parent
    const parent = canvas.parentElement;
    const w = parent.scrollWidth || parent.offsetWidth;
    const h = parent.scrollHeight || parent.offsetHeight;

    // Use a lower resolution and scale up for performance
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Run drawing asynchronously to prevent blocking the main thread (fixes loader freezing)
    (async () => {
      // Yield to the browser to ensure the DOM (and loaders) are fully painted first
      await new Promise(r => setTimeout(r, 50));

    // ─── Utility: Seeded Deterministic Random ───
    // This ensures the scratches and smudges are exactly the same on every page load
    let seed = 987654321; // You can change this number to get a completely new random layout
    const seededRandom = () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    
    // Override Math.random internally for this canvas
    const _random = seededRandom;
    const rand = (min = 0, max = 1) => _random() * (max - min) + min;

    const drawScratch = (x, y, len, angle, opacity, width, isGouge = false) => {
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;
      
      ctx.save();
      ctx.lineCap = 'round';
      
      if (isGouge) {
        // 1. "Grid Erosion" - Draw a thick line in the mat's base color to break the SVG grid below
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#0E4735'; 
        ctx.lineWidth = width * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 2. Shadow (Inside the cut)
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 2.5})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 3. Highlight (Light hitting the burr/edge) - offset slightly
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.8})`;
        ctx.lineWidth = width * 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, y + 0.5);
        ctx.lineTo(endX + 0.5, endY + 0.5);
        ctx.stroke();
        
        // 4. "Burr" flakes at ends
        if (_random() > 0.7) {
          ctx.fillStyle = `rgba(255, 255, 255, ${rand(0.2, 0.5)})`;
          ctx.beginPath();
          ctx.arc(endX, endY, rand(0.5, 1.5), 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ═══════════════════════════════════════════════════════════════════
    // 1. BLADE MARKS & 3D GOUGES
    // ═══════════════════════════════════════════════════════════════════
    const bladeCount = Math.floor(w * h / 250000); 
    for (let i = 0; i < bladeCount; i++) {
      if (i % 50 === 0) await new Promise(r => setTimeout(r, 0));
      drawScratch(rand(0, w), rand(0, h), rand(40, 300), rand(0, Math.PI * 2), rand(0.15, 0.35), rand(0.8, 2.5), true);
    }

    // A few occasional deeper "hero" cuts in the 3rd section and beyond
    const heavyUseCount = Math.floor(w * h / 800000); 
    for (let i = 0; i < heavyUseCount; i++) {
      const x = rand(0, w);
      const y = rand(h * 0.4, h); 
      drawScratch(x, y, rand(60, 300), rand(0, Math.PI * 2), rand(0.2, 0.45), rand(1.0, 2.8), true);
    }

    // High-frequency multidirectional "Scuff Clusters"
    const clusterCount = Math.floor(rand(4, 9));
    for (let i = 0; i < clusterCount; i++) {
      const cx = rand(0, w);
      const cy = rand(0, h);
      const density = Math.floor(rand(5, 15));
      for (let j = 0; j < density; j++) {
        drawScratch(cx + rand(-50, 50), cy + rand(-50, 50), rand(2, 15), rand(0, Math.PI * 2), rand(0.08, 0.18), rand(0.4, 1.0), false);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 2. FINGERPRINT OILS & DIRTY GRIME
    // ═══════════════════════════════════════════════════════════════════
    const smudgeCount = Math.floor(rand(25, 45)); 

    for (let i = 0; i < smudgeCount; i++) {
      if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      const cx = rand(0, w);
      // Generate standard vertical position
      let cy = rand(0, h * 0.75);
      
      // If a smudge lands in Section 2 (approx 25% to 50% of the mat), 
      // push 100% of them down into Section 3 and Section 4 (last section).
      // Section 1 (< 25%) remains completely mathematically untouched.
      if (cy > h * 0.25 && cy < h * 0.50) {
        if (i % 2 === 0) {
          cy += h * 0.35; // Push exactly half into Section 3
        } else {
          cy += h * 0.50; // Push the other half into Section 4
        }
      }

      const radius = rand(150, 600);

      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      
      const dabs = 15;
      for (let j = 0; j < dabs; j++) {
        const offsetRadius = radius * rand(0, 0.6);
        const offsetAngle = rand(0, Math.PI * 2);
        const dcx = cx + Math.cos(offsetAngle) * offsetRadius;
        const dcy = cy + Math.sin(offsetAngle) * offsetRadius;
        const dr = radius * rand(0.5, 1.0);
        
        const grad = ctx.createRadialGradient(dcx, dcy, 0, dcx, dcy, dr);
        const opacity = rand(0.01, 0.04);
        grad.addColorStop(0, `rgba(30, 25, 20, ${opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(dcx, dcy, dr, dr * rand(0.6, 1.4), rand(0, Math.PI), 0, Math.PI * 2);
        ctx.fill();
      }

      // "Hard" Ink/Grease Spots
      if (_random() > 0.7) {
        const hx = cx + rand(-50, 50);
        const hy = cy + rand(-50, 50);
        const hr = rand(2, 10);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(10, 8, 5, ${rand(0.1, 0.3)})`;
        ctx.beginPath();
        ctx.ellipse(hx, hy, hr, hr * rand(0.4, 2.5), rand(0, Math.PI), 0, Math.PI * 2);
        ctx.fill();
        
        // Smear tail
        ctx.strokeStyle = `rgba(10, 8, 5, ${rand(0.05, 0.15)})`;
        ctx.lineWidth = hr * 0.5;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + rand(-30, 30), hy + rand(-30, 30));
        ctx.stroke();
      }
      
      ctx.restore();
    }

    // ═══════════════════════════════════════════════════════════════════
    // 3. BROWN CHEMICAL STAINS
    // ═══════════════════════════════════════════════════════════════════
    const stainCount = Math.floor(rand(10, 20));
    await new Promise(r => setTimeout(r, 0));
    for (let i = 0; i < stainCount; i++) {
      const cx = rand(0, w);
      const cy = rand(h * 0.05, h * 0.95);
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

    // ═══════════════════════════════════════════════════════════════════
    // 4. SPECULAR HOTSPOT (Light Sheen) - Reduced to prevent fading
    // ═══════════════════════════════════════════════════════════════════
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const spotX = w * 0.7;
    const spotY = h * 0.2;
    const spotR = Math.max(w, h) * 0.8;
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotR);
    spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)'); // Half the previous opacity
    spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // ═══════════════════════════════════════════════════════════════════
    // 5. DUST - Reduced to prevent fading
    // ═══════════════════════════════════════════════════════════════════
    const dustCount = Math.floor(rand(80, 150));
    for (let i = 0; i < dustCount; i++) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255,255,255,${rand(0.01, 0.03)})`;
      ctx.beginPath();
      ctx.arc(rand(0, w), rand(0, h), rand(0.2, 0.8), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    })(); // End of async rendering
  }, []); // Render once on mount

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
