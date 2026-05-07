import React, { useEffect, useRef, Suspense, useState, memo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, Bounds, Center } from '@react-three/drei';
import Core from 'smooothy';

import armModel from '../../assets/3d/robotic_arm_opt.glb';
import droneModel from '../../assets/3d/fpv_racing_drone_opt.glb';
import lineFollowerModel from '../../assets/3d/line_follower_robot_opt.glb';
import rocketModel from '../../assets/3d/rocket_opt.glb';
import autoRobotModel from '../../assets/3d/auto robot.glb';
import humanoidModel from '../../assets/3d/humanoid_main_opt.glb';

const GLOBAL_SCALE = 0.85;
const BAKED_OFFSET = 36;
const DEBUG = false;

const SLIDES_DATA = [
  { index: '0000', title: 'WidowX MKII Arm', path: armModel, margin: 1, centerScale: 0.9428, edgeScale: 0.0149, position: [0, -1.5, 0], rotation: [0.5, -0.03, -0.15], edgePos: [0, -8.6, 0], edgeRot: [0.03, -3.052, 0.66], baseRotation: [0, -2.07, 0] },
  { index: '0001', title: 'FPV Racing Drone', path: droneModel, margin: 1, centerScale: 1.0899, edgeScale: 0, position: [0, 0.05, 0], rotation: [0.38, -0.49, 0], edgePos: [0, 0.1, 0], edgeRot: [0.3, 1.47, 0], baseRotation: [0, 0, 0] },
  { index: '0002', title: 'Auto Robot', path: autoRobotModel, margin: 1, centerScale: 0.9467, edgeScale: 0, position: [1.75, 3.80, 3.20], rotation: [0.140, 0.510, 0.120], edgePos: [-15.00, -15.00, 1.50], edgeRot: [1.910, 3.680, -2.470], baseRotation: [-0.5, -0.27, -0.16] },
  { index: '0003', title: 'Rocket', path: rocketModel, margin: 1, centerScale: 0.9821, edgeScale: 0.0207, position: [0, 0, 0], rotation: [0, 0, -0.56], edgePos: [0, 0, 0], edgeRot: [-0.05, 1.81, 2.05], baseRotation: [-1.57, -0.01, 1.38] },
  { index: '0004', title: 'Line Follower Robot', path: lineFollowerModel, margin: 1, centerScale: 0.85, edgeScale: 0, position: [0, -0.75, 0], rotation: [0.62, -0.39, 0], edgePos: [1.3, 0, 0], edgeRot: [0.43, 1.43, 0], baseRotation: [0, 0, 0] },
  { index: '0005', title: 'Humanoid Assembly', path: humanoidModel, margin: 1, centerScale: 0.9428, edgeScale: 0.0686, position: [0, 0, 0], rotation: [-0.15, 0.47, 0.21], edgePos: [0, 0, 0], edgeRot: [-0.03, -1.6, -0.36], baseRotation: [0, 0, 0] },
];

SLIDES_DATA.forEach(s => useGLTF.preload(s.path));

// ─── Velocity-warp background rectangle ───────────────────────────────────────
function WarpRect({ velocityRef, index, containerRef }) {
  const clipId  = `warp-clip-${index}`;
  const pathRef = useRef(null);

  // Spring state — all refs, zero re-renders
  const lead   = useRef(0); // leading-edge offset  (right side when dragging right)
  const leadV  = useRef(0);
  const lag    = useRef(0); // trailing-edge offset (left side when dragging right)
  const lagV   = useRef(0);
  const curve  = useRef(0); // inward bow at high speed
  const curveV = useRef(0);
  const smoothV = useRef(0); // smoothed velocity input
  const lastWake = useRef(1);
  const sdFactor = useRef(0);
  const wakeS = useRef(1);
  const wakeSV = useRef(0);

  useEffect(() => {
    let id;

    const tick = () => {
      // ── smooth the raw velocity slightly for a responsive feel ──────
      smoothV.current = smoothV.current * 0.4 + velocityRef.current * 0.6;
      const v = smoothV.current;

      // ── targets: more aggressive response to inertia ────────────────
      const targetLead  = Math.max(-0.25, Math.min(0.25, v * 0.015));
      // Even more aggressive gating: only strong pulls trigger the shrink/skew
      const lagGating   = Math.max(0, Math.min(1, (Math.abs(v) - 45) / 10));
      const targetLag   = targetLead * 0.4 * lagGating;
      // Gate the curve (bow) more as well
      const targetCurve = Math.min(0.11, Math.max(0, Math.abs(v) - 15) * 0.008);

      // ── snappier springs: higher stiffness for better tracking ──────
      leadV.current  += (targetLead  - lead.current)  * 0.22 - leadV.current  * 0.8;
      lead.current   += leadV.current;

      lagV.current   += (targetLag   - lag.current)   * 0.22 - lagV.current  * 0.82;
      lag.current    += lagV.current;

      curveV.current += (targetCurve - curve.current) * 0.22 - curveV.current * 0.8;
      curve.current  += curveV.current;

      // ── build path in objectBoundingBox space (0–1) ─────────────────
      const lo = lead.current;  // leading  side offset (right side when +)
      const la = lag.current;   // lagging  side offset (left  side when +)
      const c  = curve.current; // bow amount (always ≥ 0)

      // Calculate relative screen position for wake scaling
      const rect = containerRef.current?.getBoundingClientRect();
      let targetWakeScale = 1;
      if (rect) {
        const screenCenterX = window.innerWidth / 2;
        const elementCenterX = rect.left + rect.width / 2;
        const relX = (elementCenterX - screenCenterX) / (window.innerWidth / 2);
        
        // Only scale elements "entering" from the edges
        const vThreshold = Math.abs(v) > 2 ? v : 0;
        let edgeWeight = 0;
        
        if (vThreshold > 0 && relX < 0) {
          // Shift peak off-screen so it's already shrinking when it enters (peak at relX ≈ 1.5)
          edgeWeight = Math.min(1, Math.max(0, (Math.abs(relX) - 0.25) / 1.25));
        } else if (vThreshold < 0 && relX > 0) {
          edgeWeight = Math.min(1, Math.max(0, (relX - 0.25) / 1.25));
        }
        edgeWeight = Math.pow(edgeWeight, 2);
        
        targetWakeScale = 1 + (edgeWeight * Math.abs(vThreshold) * 0.015);
        targetWakeScale = Math.min(1.15, targetWakeScale);
      }

      // Smooth the wakeScale with a faster spring for snappier scale-down
      wakeSV.current += (targetWakeScale - wakeS.current) * 0.14 - wakeSV.current * 0.7;
      wakeS.current += wakeSV.current;
      const curWS = wakeS.current;

      // Track scaling down state — only if element was actually expanded (> 1.02)
      const isScalingDown = (curWS > 1.02) && (curWS < lastWake.current - 0.0002);
      lastWake.current = curWS;
      // Faster decay so the curve snaps back quickly
      sdFactor.current = sdFactor.current * 0.78 + (isScalingDown ? 0.22 : 0);

      // Top/bottom curve — subtle, ONLY on elements actively scaling down
      const cTB = c * sdFactor.current * 0.4;
      const cS  = c; // Side curve always

      // ── Build path with dynamic corners (Shrink & Skew) ──────────────
      // ── Build path with dynamic corners (Subtle Shrink & Skew) ────────
      const x1 = 0.10, x2 = 0.90, y1 = 0.02, y2 = 0.98;

      let TLx = x1, TLy = y1, BLx = x1, BLy = y2;
      let TRx = x2, TRy = y1, BRx = x2, BRy = y2;

      // Warp ONLY the trailing side, and ONLY at high velocity (via targetLag/la)
      if (v > 0) { // Scrolling RIGHT (Trailing is LEFT side)
        TLx = x1 + la * 0.5;
        TLy = y1 + Math.abs(la) * 0.6;
        BLx = x1 + la * 0.2;
        BLy = y2 - Math.abs(la) * 0.6;
      } else { // Scrolling LEFT (Trailing is RIGHT side)
        TRx = x2 + la * 0.5;
        TRy = y1 + Math.abs(la) * 0.6;
        BRx = x2 + la * 0.2;
        BRy = y2 - Math.abs(la) * 0.6;
      }

      // ── Build Control Points for Liquid Deformation ────────────────
      const bowDir = v > 0 ? cS : -cS;
      
      // Top side: from TL → TR
      const tc1x = TLx + (TRx - TLx) * 0.33, tc1y = TLy + cTB * 0.5;
      const tc2x = TLx + (TRx - TLx) * 0.66, tc2y = TLy + cTB * 0.5;

      // Right side: from TR → BR
      const rc1x = TRx + bowDir, rc1y = TRy + (BRy - TRy) * 0.23;
      const rc2x = BRx + bowDir, rc2y = BRy - (BRy - TRy) * 0.23;

      // Bottom side: from BR → BL
      const bc1x = BRx + (BLx - BRx) * 0.33, bc1y = BRy - cTB * 0.5;
      const bc2x = BRx + (BLx - BRx) * 0.66, bc2y = BRy - cTB * 0.5;

      // Left side: from BL → TL
      const lc1x = BLx + bowDir, lc1y = BLy - (BLy - TLy) * 0.23;
      const lc2x = TLx + bowDir, lc2y = TLy + (BLy - TLy) * 0.23;

      // ── Ocean Wave Path (optimized resolution) ────────────────────
      const tOcean = performance.now() * 0.005;
      const res = 20; // reduced from 60 for performance — still visually smooth
      
      const getCubic = (p0, p1, p2, p3, f) => {
        const u = 1 - f;
        const uu = u * u, uuu = uu * u;
        const ff = f * f, fff = ff * f;
        return {
          x: uuu*p0.x + 3*uu*f*p1.x + 3*u*ff*p2.x + fff*p3.x,
          y: uuu*p0.y + 3*uu*f*p1.y + 3*u*ff*p2.y + fff*p3.y
        };
      };

      let d = `M ${TLx} ${TLy} `;

      // Top Edge: TL -> TR
      for(let i=1; i<=res; i++) {
        const f = i/res;
        const p = getCubic({x:TLx,y:TLy}, {x:tc1x,y:tc1y}, {x:tc2x,y:tc2y}, {x:TRx,y:TRy}, f);
        const freq = 4 + (index % 3) * 1.5;
        const wave = Math.sin((p.x + p.y) * freq + tOcean + index * 3) * 0.002;
        d += `L ${p.x} ${p.y + wave} `;
      }
      // Right Edge: TR -> BR
      for(let i=1; i<=res; i++) {
        const f = i/res;
        const p = getCubic({x:TRx,y:TRy}, {x:rc1x,y:rc1y}, {x:rc2x,y:rc2y}, {x:BRx,y:BRy}, f);
        const freq = 4 + (index % 3) * 1.5;
        const wave = Math.sin((p.x + p.y) * freq + tOcean + index * 3) * 0.002;
        d += `L ${p.x + wave} ${p.y} `;
      }
      // Bottom Edge: BR -> BL
      for(let i=1; i<=res; i++) {
        const f = i/res;
        const p = getCubic({x:BRx,y:BRy}, {x:bc1x,y:bc1y}, {x:bc2x,y:bc2y}, {x:BLx,y:BLy}, f);
        const freq = 4 + (index % 3) * 1.5;
        const wave = Math.sin((p.x + p.y) * freq + tOcean + index * 3) * 0.002;
        d += `L ${p.x} ${p.y + wave} `;
      }
      // Left Edge: BL -> TL
      for(let i=1; i<=res; i++) {
        const f = i/res;
        const p = getCubic({x:BLx,y:BLy}, {x:lc1x,y:lc1y}, {x:lc2x,y:lc2y}, {x:TLx,y:TLy}, f);
        const freq = 4 + (index % 3) * 1.5;
        const wave = Math.sin((p.x + p.y) * freq + tOcean + index * 3) * 0.002;
        d += `L ${p.x + wave} ${p.y} `;
      }
      d += 'Z';

      if (pathRef.current) pathRef.current.setAttribute('d', d);
      
      // Apply smoothed wake scale
      const gradDiv = containerRef.current?.querySelector('.warp-gradient');
      if (gradDiv) {
        gradDiv.style.transform = `scale(${curWS})`;
      }

      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [velocityRef, containerRef]);

  const colors = [
    ['#4c1d95', '#a600ff'], // Deep Violet to Bright Purple
    ['#581c87', '#d946ef'], // Dark Purple to Fuchsia
    ['#2e1065', '#7c3aed'], // Rich Purple to Lavender
    ['#1e1b4b', '#6d28d9'], // Indigo Purple
  ];
  const [c1, c2] = colors[index % colors.length];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'visible' }}>
      {/* Hidden SVG just to define the clipPath */}
      <svg style={{ width: 0, height: 0, position: 'absolute', overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            {/* Default flat rect; JS will mutate d every frame */}
            <path ref={pathRef} d={`M .15 .15 L .85 .15 L .85 .85 L .15 .85 Z`} />
          </clipPath>
        </defs>
      </svg>
      {/* Actual gradient div — clipped to the morphing path */}
      <div 
        className="warp-gradient"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(-45deg, ${c1}, ${c2}, ${c1})`,
          backgroundSize: '300% 300%',
          animation: 'gradientWave 12s ease infinite',
          clipPath: `url(#${clipId})`,
          willChange: 'transform',
          opacity: 0.35
        }} 
      />
    </div>
  );
}

// ─── 3-D helpers ─────────────────────────────────────────────────────────────
const GLBModel = memo(function GLBModel({ path }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0)
      actions[Object.keys(actions)[0]]?.play();
  }, [actions, scene]);
  return <primitive object={scene} />;
});

function DynamicTransformWrapper({ children, containerRef, centerScale = 0.85, edgeScale = 0.25, centerRot = [0,0,0], edgeRot = [0,0,0], centerPos = [0,0,0], edgePos = [0,0,0], float = true, isRocket = false }) {
  const ref = useRef();
  const initialized = useRef(false);
  const cachedRect = useRef(null);
  const frameSkip = useRef(0);

  useFrame((state) => {
    if (!ref.current || !containerRef.current) return;
    // Throttle expensive getBoundingClientRect to every 2nd frame
    if (frameSkip.current++ % 2 === 0) {
      cachedRect.current = containerRef.current.getBoundingClientRect();
    }
    const rect = cachedRect.current;
    if (!rect) return;
    const dist = Math.abs(window.innerWidth / 2 - (rect.left + rect.width / 2));
    let factor = Math.min(dist / (window.innerWidth / (1.5 * GLOBAL_SCALE)), 1);
    if (factor < 0.05) factor = 0;
    if (factor > 0.95) factor = 1;
    containerRef.current.style.zIndex = Math.round(1000 - dist);

    const tScale = centerScale - factor * (centerScale - edgeScale);
    const tRX = centerRot[0] - factor * (centerRot[0] - edgeRot[0]);
    const tRY = centerRot[1] - factor * (centerRot[1] - edgeRot[1]);
    const tRZ = centerRot[2] - factor * (centerRot[2] - edgeRot[2]);
    const t   = state.clock.elapsedTime;
    
    // Breathing effect (active always, strong)
    const breathY     = float ? Math.sin(t * 0.45) * 0.65 : 0;
    const breathScale = float ? 1 + Math.sin(t * 0.45) * 0.03 : 1;

    // Edge float effect (active only at edges)
    const floatY  = float ? Math.sin(t * 1.1) * 0.6 * factor : 0;
    const tX  = float ? Math.cos(t * 0.5) * 0.25 * factor : 0;
    const tZ  = float ? Math.sin(t * 0.6) * 0.25 * factor : 0;
    const pY  = float ? Math.sin(t * 0.4) * 0.2 * factor : 0;
    
    // Mouse follow effect — boosted if it's the rocket
    const mouseMult = isRocket ? 0.6 : 0.12;
    const mX  = -state.pointer.x * mouseMult * (1 - factor);
    const mY  = -state.pointer.y * (mouseMult * 0.8) * (1 - factor);

    const finalScale = tScale * breathScale;

    if (!initialized.current) {
      ref.current.scale.set(finalScale, finalScale, finalScale);
      ref.current.rotation.set(tRX + tX - mY, tRY + pY + mX, tRZ + tZ);
      initialized.current = true;
    } else {
      ref.current.scale.lerp({ x: finalScale, y: finalScale, z: finalScale }, 0.1);
      ref.current.rotation.x += (tRX + tX - mY - ref.current.rotation.x) * 0.1;
      ref.current.rotation.y += (tRY + pY + mX - ref.current.rotation.y) * 0.1;
      ref.current.rotation.z += (tRZ + tZ - ref.current.rotation.z) * 0.1;
    }
    const tPX = centerPos[0] - factor * (centerPos[0] - edgePos[0]);
    const tPY = centerPos[1] - factor * (centerPos[1] - edgePos[1]);
    const tPZ = centerPos[2] - factor * (centerPos[2] - edgePos[2]);
    ref.current.position.lerp({ x: tPX, y: tPY + floatY + breathY, z: tPZ }, 0.1);
  });

  return <group ref={ref}>{children}</group>;
}

function SlideContent({ slide, containerRef, debugData, robotDebug }) {
  const { position=[0,0,0], rotation=[0,0,0], edgePos, edgeRot, margin=1, baseRotation=[0,0,0] } = slide;
  
  const ambientRef = useRef();
  const directRef = useRef();
  const isRobot = slide.index === '0002';
  const cScale = isRobot ? robotDebug.centerScale : (debugData?.centerScale ?? slide.centerScale ?? 0.85);
  const eScale = isRobot ? robotDebug.edgeScale   : (debugData?.edgeScale ?? slide.edgeScale ?? 0.25);
  
  const cPos = isRobot ? robotDebug.centerPos : [position[0], debugData?.yPos ?? position[1], position[2]];
  const cRot = isRobot ? robotDebug.centerRot : rotation;
  const ePos = isRobot ? robotDebug.edgePos   : (edgePos || cPos);
  const eRot = isRobot ? robotDebug.edgeRot   : (edgeRot || cRot);

  const cachedRect2 = useRef(null);
  const frameSkip2 = useRef(0);
  const canvasDivRef = useRef(null);

  useFrame(() => {
    if (!containerRef.current) return;
    // Cache the canvas-container DOM lookup
    if (!canvasDivRef.current) {
      canvasDivRef.current = containerRef.current.querySelector('.canvas-container');
    }
    // Throttle getBoundingClientRect to every 2nd frame
    if (frameSkip2.current++ % 2 === 0) {
      cachedRect2.current = containerRef.current.getBoundingClientRect();
    }
    const rect = cachedRect2.current;
    if (!rect) return;
    const dist = Math.abs(window.innerWidth / 2 - (rect.left + rect.width / 2));
    let factor = Math.min(dist / (window.innerWidth / (1.5 * GLOBAL_SCALE)), 1);
    if (factor < 0.05) factor = 0;
    if (factor > 0.95) factor = 1;

    // Spotlight lighting - high contrast, deep blacks
    if (ambientRef.current) ambientRef.current.intensity = 0.5 - (0.5 - 0.1) * factor;
    if (directRef.current)  directRef.current.intensity  = 4.5 * (1 - factor);

    // Spotlight grayscale filter
    if (canvasDivRef.current) {
      canvasDivRef.current.style.filter = `grayscale(${factor})`;
      canvasDivRef.current.style.opacity = 1 - (factor * 0.3);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight ref={directRef} position={[3,5,3]} intensity={4.5} />
      <Bounds fit clip margin={margin}>
        <DynamicTransformWrapper containerRef={containerRef}
          centerScale={cScale} edgeScale={eScale}
          centerPos={cPos} edgePos={ePos}
          centerRot={cRot} edgeRot={eRot}
          float={slide.title !== 'FPV Racing Drone'}
          isRocket={slide.index === '0003'}
        >
          <group rotation={baseRotation}>
            <Center><GLBModel path={slide.path} /></Center>
          </group>
        </DynamicTransformWrapper>
      </Bounds>
      <Environment preset="city" />
    </>
  );
}

// ─── Slide item ───────────────────────────────────────────────────────────────
function SlideItem({ slide, index, velocityRef, debugData, robotDebug }) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{
      flexShrink: 0,
      width: `calc(clamp(320px, 45vw, 550px) * ${GLOBAL_SCALE})`,
      paddingLeft: `calc(2rem * ${GLOBAL_SCALE})`,
      paddingRight: `calc(2rem * ${GLOBAL_SCALE})`,
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:`calc(2rem * ${GLOBAL_SCALE})` }}>
        <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.4)' }}>--</span>
        <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.8)' }}>{slide.index}</span>
      </div>

      <div style={{ position:'relative', height:`calc(clamp(350px, 50vw, 550px) * ${GLOBAL_SCALE})`, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'visible' }}>
        {/* Morphing background rect */}
        <WarpRect velocityRef={velocityRef} index={index} containerRef={containerRef} />

        {/* 3-D canvas — GPU-optimized settings */}
        <div className="canvas-container" style={{ position:'absolute', top:'-100%', bottom:'-100%', left:'-50%', right:'-50%', zIndex:1, pointerEvents:'none' }}>
          <Canvas camera={{ position:[0,0,3.5], fov:45 }}
            gl={{ antialias:false, powerPreference:'high-performance', alpha:true, stencil:false, depth:true }}
            dpr={[1,1]} frameloop="always">
            <SlideContent slide={slide} containerRef={containerRef} debugData={debugData} robotDebug={robotDebug} />
          </Canvas>
        </div>

        {/* Title overlay - sitting on top layer */}
        <div style={{ position:'absolute', bottom:'calc(2rem * -1.2)', zIndex: 10, width:'100%', textAlign:'center', pointerEvents:'none' }}>
          <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.8)', textTransform:'uppercase' }}>"{slide.title}"</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root slider ──────────────────────────────────────────────────────────────
export default function ModelSlider() {
  const wrapperRef   = useRef(null);
  const velocityRef  = useRef(0);
  const [robotDebug, setRobotDebug] = useState({
    centerScale: 0.9467,
    edgeScale: 0,
    centerPos: [1.75, 3.80, 3.2],
    centerRot: [0.14, 0.51, 0.12],
    edgePos: [-15.00, -12.65, 1.15],
    edgeRot: [1.910, 3.850, -2.470]
  });

  const handleRobotChange = (type, axis, val) => {
    setRobotDebug(prev => {
      if (type.includes('Scale')) {
        return { ...prev, [type]: parseFloat(val) };
      }
      const next = { ...prev, [type]: [...prev[type]] };
      next[type][axis] = parseFloat(val);
      return next;
    });
  };

  const copyRobot = () => {
    const output = `centerPos: [${robotDebug.centerPos.map(v => v.toFixed(2)).join(', ')}],\ncenterRot: [${robotDebug.centerRot.map(v => v.toFixed(3)).join(', ')}],\nedgePos: [${robotDebug.edgePos.map(v => v.toFixed(2)).join(', ')}],\nedgeRot: [${robotDebug.edgeRot.map(v => v.toFixed(3)).join(', ')}]`;
    navigator.clipboard.writeText(output);
    alert('Copied Robot data!');
  };

  const [debugData, setDebugData] = useState(SLIDES_DATA.map(s => ({
    index: s.index,
    title: s.title,
    centerScale: s.centerScale || 0.85,
    edgeScale: s.edgeScale || 0.25,
    yPos: s.position?.[1] || 0
  })));

  const handleDebugChange = (idx, field, val) => {
    setDebugData(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: parseFloat(val) };
      return next;
    });
  };

  const copyAll = () => {
    const output = debugData.map(s => 
      `{ index: '${s.index}', centerScale: ${s.centerScale.toFixed(4)}, edgeScale: ${s.edgeScale.toFixed(4)}, yPos: ${s.yPos.toFixed(2)} }`
    ).join(',\n');
    navigator.clipboard.writeText(output);
    alert('Copied all debug data!');
  };

  useEffect(() => {
    let lastX = 0, lastT = 0, dragging = false;
    const onDown = (e) => { dragging = true; lastX = e.clientX; lastT = Date.now(); };
    const onMove = (e) => {
      if (!dragging) return;
      const now = Date.now();
      const dt  = Math.max(now - lastT, 1);
      velocityRef.current = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX; lastT = now;
    };
    const onUp = () => { dragging = false; };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const slider = new Core(wrapperRef.current, {
      infinite: true, snap: false,
      dragSensitivity: 0.003, lerpFactor: 0.02, scrollInput: false,
    });

    // Explicitly block wheel and touch-scroll events from affecting the slider
    const blockScroll = (e) => {
      // We don't preventDefault so the page can still scroll vertically if needed,
      // but we stop propagation to ensure the slider's internal listeners (if any) don't trigger.
      e.stopPropagation();
    };
    
    const el = wrapperRef.current;
    el.addEventListener('wheel', blockScroll, { passive: true, capture: true });
    el.addEventListener('touchmove', blockScroll, { passive: true, capture: true });

    slider.target = -1;
    slider.current = -1;

    let inertia = 0;
    const loop = () => {
      if (slider.isDragging) { inertia = velocityRef.current * 0.001; }
      else {
        velocityRef.current *= 0.82;
        slider.target += inertia;
        inertia *= 0.92;
        if (Math.abs(inertia) < 0.01) {
          const bias = Math.max(-0.2, Math.min(0.2, inertia * 5));
          const nearest = Math.round(slider.target + bias);
          slider.target += (nearest - slider.target) * 0.038;
          inertia *= 0.8; 
          velocityRef.current *= 0.8;
        }
      }
      slider.update();
      requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        inertia = 0;
        velocityRef.current = 0;
      }
    }, { threshold: 0.1 });
    observer.observe(wrapperRef.current);

    const id = requestAnimationFrame(loop);
    return () => { 
      cancelAnimationFrame(id); 
      slider.destroy(); 
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full select-none" style={{ padding:'100px 0', position:'relative' }}>
      {DEBUG && (
        <div style={{ 
          position:'fixed', top:'20px', left:'20px', zIndex:9999, 
          background:'black', color:'white', padding:'20px', 
          maxHeight:'80vh', overflowY:'auto', border:'1px solid white',
          fontSize:'11px', fontFamily:'monospace', width:'250px'
        }}>
          <button onClick={copyRobot} style={{ width:'100%', marginBottom:'15px', padding:'10px', cursor:'pointer' }}>COPY ROBOT DATA</button>
          
          <div style={{ fontWeight:'bold', borderBottom:'1px solid #444', pb:'5px', mb:'10px' }}>AUTO ROBOT CALIBRATION</div>
          
          <div style={{ marginBottom:'15px' }}>
            <div style={{ color:'#888' }}>Scales</div>
            <div style={{ margin:'5px 0' }}>
              C-Scale: {robotDebug.centerScale.toFixed(4)}
              <input type="range" min="0" max="2" step="0.0001" value={robotDebug.centerScale} 
                style={{ width:'100%' }} onChange={(e) => handleRobotChange('centerScale', 0, e.target.value)} />
            </div>
            <div style={{ margin:'5px 0' }}>
              E-Scale: {robotDebug.edgeScale.toFixed(4)}
              <input type="range" min="0" max="1" step="0.0001" value={robotDebug.edgeScale} 
                style={{ width:'100%' }} onChange={(e) => handleRobotChange('edgeScale', 0, e.target.value)} />
            </div>
          </div>
          {['centerPos', 'edgePos'].map(type => (
            <div key={type} style={{ marginBottom:'15px' }}>
              <div style={{ color:'#888' }}>{type}</div>
              {[0,1,2].map(axis => (
                <div key={axis} style={{ display:'flex', alignItems:'center', gap:'5px', margin:'5px 0' }}>
                  <span style={{ width:'10px' }}>{['X','Y','Z'][axis]}</span>
                  <input type="range" min="-15" max="15" step="0.05" 
                    value={robotDebug[type][axis]} 
                    style={{ flex:1 }}
                    onChange={(e) => handleRobotChange(type, axis, e.target.value)} />
                  <span style={{ width:'40px', textAlign:'right' }}>{robotDebug[type][axis].toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}

          {['centerRot', 'edgeRot'].map(type => (
            <div key={type} style={{ marginBottom:'15px' }}>
              <div style={{ color:'#888' }}>{type}</div>
              {[0,1,2].map(axis => (
                <div key={axis} style={{ display:'flex', alignItems:'center', gap:'5px', margin:'5px 0' }}>
                  <span style={{ width:'10px' }}>{['X','Y','Z'][axis]}</span>
                  <input type="range" min="-6.28" max="6.28" step="0.01" 
                    value={robotDebug[type][axis]} 
                    style={{ flex:1 }}
                    onChange={(e) => handleRobotChange(type, axis, e.target.value)} />
                  <span style={{ width:'40px', textAlign:'right' }}>{robotDebug[type][axis].toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes gradientWave {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>


      <div ref={wrapperRef} data-slider
        style={{ display:'flex', gap:0, margin:0, paddingLeft:`${BAKED_OFFSET}%` }}>
        {SLIDES_DATA.map((slide, i) => (
          <SlideItem key={slide.index} slide={slide} index={i} velocityRef={velocityRef} debugData={debugData[i]} robotDebug={robotDebug} />
        ))}
      </div>

      <div style={{ display:'flex', gap:'4px', paddingLeft:'1rem', marginTop:'1.5rem', paddingRight:'1rem' }}>
        {SLIDES_DATA.map(s => (
          <div key={s.index} style={{ height:'1px', flex:1, background:'rgba(255,255,255,0.12)' }} />
        ))}
      </div>
    </div>
  );
}
