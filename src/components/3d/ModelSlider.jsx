import React, { useEffect, useRef, Suspense } from 'react';
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

const SLIDES_DATA = [
  { index: '0000', title: 'WidowX MKII Arm', path: armModel, margin: 1, centerScale: 0.85, edgeScale: 0.2, position: [0, -1.5, 0], rotation: [0.5, -0.03, -0.15], edgePos: [0, -8.6, 0], edgeRot: [0.03, -3.052, 0.66], baseRotation: [0, -2.07, 0] },
  { index: '0001', title: 'FPV Racing Drone', path: droneModel, margin: 1, centerScale: 0.95, edgeScale: 0.25, position: [0, 0.05, 0], rotation: [0.38, -0.49, 0], edgePos: [0, 0.1, 0], edgeRot: [0.3, 1.47, 0], baseRotation: [0, 0, 0] },
  { index: '0002', title: 'Auto Robot', path: autoRobotModel, margin: 1, centerScale: 0.9, edgeScale: 0.2, position: [1.75, 2.85, 3.2], rotation: [0.14, 0.51, 0.12], edgePos: [-5.1, -2.6, 2.95], edgeRot: [2, 2.692, -2.17], baseRotation: [-0.5, -0.27, -0.16] },
  { index: '0003', title: 'Rocket', path: rocketModel, margin: 1, centerScale: 0.85, edgeScale: 0.35, position: [0, 0, 0], rotation: [0, 0, -0.56], edgePos: [0, 0, 0], edgeRot: [-0.05, 1.81, 2.05], baseRotation: [-1.57, -0.01, 1.38] },
  { index: '0004', title: 'Line Follower Robot', path: lineFollowerModel, margin: 1, centerScale: 0.85, edgeScale: 0.25, position: [0, 0, 0], rotation: [0.62, -0.39, 0], edgePos: [1.3, 0, 0], edgeRot: [0.43, 1.43, 0], baseRotation: [0, 0, 0] },
  { index: '0005', title: 'Humanoid Assembly', path: humanoidModel, margin: 1, centerScale: 0.85, edgeScale: 0.25, position: [0, 0, 0], rotation: [-0.15, 0.47, 0.21], edgePos: [0, 0, 0], edgeRot: [-0.03, -1.6, -0.36], baseRotation: [0, 0, 0] },
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
      smoothV.current = smoothV.current * 0.75 + velocityRef.current * 0.25;
      const v = smoothV.current;

      // ── targets: more aggressive response to inertia ────────────────
      const targetLead  = Math.max(-0.25, Math.min(0.25, v * 0.015));
      const targetLag   = targetLead * 0.18;
      const targetCurve = Math.min(0.11, Math.max(0, Math.abs(v) - 7) * 0.012);

      // ── snappier springs: higher stiffness for better tracking ──────
      leadV.current  += (targetLead  - lead.current)  * 0.15 - leadV.current  * 0.75;
      lead.current   += leadV.current;

      lagV.current   += (targetLag   - lag.current)   * 0.12 - lagV.current  * 0.78;
      lag.current    += lagV.current;

      curveV.current += (targetCurve - curve.current) * 0.15 - curveV.current * 0.7;
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
          // Start scaling down earlier (when half portion is out, approx relX > -0.75)
          edgeWeight = Math.min(1, Math.max(0, (Math.abs(relX) - 0.1) / 0.65));
        } else if (vThreshold < 0 && relX > 0) {
          edgeWeight = Math.min(1, Math.max(0, (relX - 0.1) / 0.65));
        }
        edgeWeight = Math.pow(edgeWeight, 2);
        
        targetWakeScale = 1 + (edgeWeight * Math.abs(vThreshold) * 0.02);
        targetWakeScale = Math.min(1.2, targetWakeScale);
      }

      // Smooth the wakeScale with a spring
      wakeSV.current += (targetWakeScale - wakeS.current) * 0.08 - wakeSV.current * 0.75;
      wakeS.current += wakeSV.current;
      const curWS = wakeS.current;

      // Track scaling down state for top/bottom curvature
      // Only allow scaling down detection if the element was actually scaled up (> 1.01)
      const isScalingDown = (curWS > 1.01) && (curWS < lastWake.current - 0.0001);
      lastWake.current = curWS;
      sdFactor.current = sdFactor.current * 0.85 + (isScalingDown ? 0.15 : 0);

      // Side curve (always okay), Top/bottom curve (only when scaling down, subtle)
      const cS  = c;
      const cTB = c * (sdFactor.current * 0.6);

      const x1 = 0.10, x2 = 0.90, y1 = 0.02, y2 = 0.98;

      // Corners stay fixed - no side shrinking/stretching
      const TRx = x2,  TRy = y1;
      const BRx = x2,  BRy = y2;
      const TLx = x1,  TLy = y1;
      const BLx = x1,  BLy = y2;

      // Right side: from TR → BR — bow OUT when leading, IN when trailing
      const bowDir = v > 0 ? cS : -cS;
      const rc1x = x2 + bowDir,  rc1y = y1 + 0.23;
      const rc2x = x2 + bowDir,  rc2y = y2 - 0.23;

      // Bottom side: from BR → BL — bow UP (toward center)
      const bc1x = BRx + (BLx - BRx) * 0.33, bc1y = BRy - cTB * 0.5;
      const bc2x = BRx + (BLx - BRx) * 0.66, bc2y = BRy - cTB * 0.5;

      // Left side: from BL → TL — bow IN when trailing, OUT when leading
      const lc1x = x1 + bowDir,  lc1y = y2 - 0.23;
      const lc2x = x1 + bowDir,  lc2y = y1 + 0.23;

      // Top side: from TL → TR — bow DOWN (toward center)
      const tc1x = TLx + (TRx - TLx) * 0.33, tc1y = TLy + cTB * 0.5;
      const tc2x = TLx + (TRx - TLx) * 0.66, tc2y = TLy + cTB * 0.5;

      const d =
        `M ${TLx} ${TLy} ` +
        `C ${tc1x} ${tc1y} ${tc2x} ${tc2y} ${TRx} ${TRy} ` +
        `C ${rc1x} ${rc1y} ${rc2x} ${rc2y} ${BRx} ${BRy} ` +
        `C ${bc1x} ${bc1y} ${bc2x} ${bc2y} ${BLx} ${BLy} ` +
        `C ${lc1x} ${lc1y} ${lc2x} ${lc2y} ${TLx} ${TLy} Z`;

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
    [`hsl(${index * 65 + 180}, 90%, 70%)`, `hsl(${index * 65 + 240}, 95%, 65%)`],
    [`hsl(${index * 65 + 200}, 85%, 75%)`, `hsl(${index * 65 + 150}, 90%, 60%)`],
  ];
  const [c1, c2] = colors[index % 2];

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
          willChange: 'clip-path, transform'
        }} 
      />
    </div>
  );
}

// ─── 3-D helpers ─────────────────────────────────────────────────────────────
function GLBModel({ path }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0)
      actions[Object.keys(actions)[0]]?.play();
  }, [actions, scene]);
  return <primitive object={scene} />;
}

function DynamicTransformWrapper({ children, containerRef, centerScale = 0.85, edgeScale = 0.25, centerRot = [0,0,0], edgeRot = [0,0,0], centerPos = [0,0,0], edgePos = [0,0,0], float = true }) {
  const ref = useRef();
  const initialized = useRef(false);

  useFrame((state) => {
    if (!ref.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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
    const fY  = float ? Math.sin(t * 0.8) * 0.8 * factor : 0;
    const tX  = float ? Math.cos(t * 0.5) * 0.25 * factor : 0;
    const tZ  = float ? Math.sin(t * 0.6) * 0.25 * factor : 0;
    const pY  = float ? Math.sin(t * 0.4) * 0.2 * factor : 0;
    const mX  = factor === 0 ? -state.pointer.x * 0.8 : 0;
    const mY  = factor === 0 ? -state.pointer.y * 0.7 : 0;

    if (!initialized.current) {
      ref.current.scale.set(tScale, tScale, tScale);
      ref.current.rotation.set(tRX + tX - mY, tRY + pY + mX, tRZ + tZ);
      initialized.current = true;
    } else {
      ref.current.scale.lerp({ x: tScale, y: tScale, z: tScale }, 0.1);
      ref.current.rotation.x += (tRX + tX - mY - ref.current.rotation.x) * 0.1;
      ref.current.rotation.y += (tRY + pY + mX - ref.current.rotation.y) * 0.1;
      ref.current.rotation.z += (tRZ + tZ - ref.current.rotation.z) * 0.1;
    }
    const tPX = centerPos[0] - factor * (centerPos[0] - edgePos[0]);
    const tPY = centerPos[1] - factor * (centerPos[1] - edgePos[1]);
    const tPZ = centerPos[2] - factor * (centerPos[2] - edgePos[2]);
    ref.current.position.lerp({ x: tPX, y: tPY + fY, z: tPZ }, 0.1);
  });

  return <group ref={ref}>{children}</group>;
}

function SlideContent({ slide, containerRef }) {
  const { position=[0,0,0], rotation=[0,0,0], edgePos, edgeRot, margin=1, centerScale=0.85, edgeScale=0.25, baseRotation=[0,0,0] } = slide;
  return (
    <>
      <Bounds fit clip margin={margin}>
        <DynamicTransformWrapper containerRef={containerRef}
          centerScale={centerScale} edgeScale={edgeScale}
          centerPos={position} edgePos={edgePos || position}
          centerRot={rotation} edgeRot={edgeRot || rotation}
          float={slide.title !== 'FPV Racing Drone'}
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
function SlideItem({ slide, index, velocityRef }) {
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

        {/* 3-D canvas */}
        <div style={{ position:'absolute', top:'-100%', bottom:'-100%', left:'-50%', right:'-50%', zIndex:1, pointerEvents:'none' }}>
          <Canvas camera={{ position:[0,0,3.5], fov:45 }}
            gl={{ antialias:false, powerPreference:'high-performance', alpha:true }}
            dpr={[1,1.2]} frameloop="always">
            <ambientLight intensity={1.5} />
            <directionalLight position={[3,5,3]} intensity={2} />
            <SlideContent slide={slide} containerRef={containerRef} />
          </Canvas>
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:`calc(2rem * ${GLOBAL_SCALE})` }}>
        <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.8)' }}>33.23¥</span>
        <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.8)', textTransform:'uppercase' }}>"{slide.title}"</span>
        <span style={{ fontFamily:'monospace', fontSize:`calc(11px * ${GLOBAL_SCALE})`, color:'rgba(255,255,255,0.8)' }}>33.23¥</span>
      </div>
    </div>
  );
}

// ─── Root slider ──────────────────────────────────────────────────────────────
export default function ModelSlider() {
  const wrapperRef    = useRef(null);
  const sliderRootRef = useRef(null);
  const velocityRef   = useRef(0);   // shared across all slides

  // ── Custom target cursor that chases the real mouse ──────────────────────────
  const cursorRef     = useRef(null);
  const mouseX        = useRef(0);
  const mouseY        = useRef(0);
  const targetX       = useRef(0);
  const targetY       = useRef(0);
  const lastTargetX   = useRef(0);
  const insideSlider  = useRef(false);

  useEffect(() => {
    const root = sliderRootRef.current;
    if (!root) return;

    const onMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    const onMouseEnter = () => { insideSlider.current = true; };
    const onMouseLeave = () => {
      insideSlider.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    root.addEventListener('mousemove', onMouseMove);
    root.addEventListener('mouseenter', onMouseEnter);
    root.addEventListener('mouseleave', onMouseLeave);
    return () => {
      root.removeEventListener('mousemove', onMouseMove);
      root.removeEventListener('mouseenter', onMouseEnter);
      root.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // ── Slider init + target cursor animation loop ─────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current) return;
    const slider = new Core(wrapperRef.current, {
      infinite: true, snap: false,
      dragSensitivity: 0.003, lerpFactor: 0.02, scrollInput: true,
    });

    let inertia = 0;
    let dragging = false;
    let lastMouseDownX = 0;

    const onPointerDown = (e) => {
      dragging = true;
      lastMouseDownX = targetX.current; // anchor to target cursor
    };
    const onPointerUp = () => { dragging = false; };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    const loop = () => {
      // ── Lerp target cursor toward real mouse (lazy chase) ───────────────
      const lerpFactor = 0.055; // lower = slower chase, more lag
      targetX.current += (mouseX.current - targetX.current) * lerpFactor;
      targetY.current += (mouseY.current - targetY.current) * lerpFactor;

      // ── Drive velocityRef from target cursor delta ───────────────────────
      const deltaX = targetX.current - lastTargetX.current;
      velocityRef.current = deltaX * 16; // normalise to ~60fps equivalent
      lastTargetX.current = targetX.current;

      // ── Update custom cursor element ─────────────────────────────────────
      if (cursorRef.current && insideSlider.current) {
        cursorRef.current.style.transform = `translate(${targetX.current}px, ${targetY.current}px)`;
        cursorRef.current.style.opacity = '1';
      }

      // ── Slider scrolling driven by target cursor ─────────────────────────
      if (dragging) {
        inertia = deltaX * 0.007;
      } else {
        velocityRef.current *= 0.92;
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

    const id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      slider.destroy();
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <div ref={sliderRootRef} className="w-full select-none" style={{ padding:'100px 0', position:'relative', cursor:'none' }}>
      <style>{`
        @keyframes gradientWave {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .slider-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          margin-left: -6px; margin-top: -6px;
          transition: opacity 0.2s ease;
          mix-blend-mode: difference;
          box-shadow: 0 0 12px rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Target cursor dot */}
      <div ref={cursorRef} className="slider-cursor" />

      <div className="flex items-center justify-end px-6 md:px-12 mb-8">
        <span style={{ fontFamily:'monospace', fontSize:'10px', letterSpacing:'0.4em' }}
          className="text-white/30 uppercase">
          {SLIDES_DATA.length} OBJECTS
        </span>
      </div>

      <div ref={wrapperRef} data-slider
        style={{ display:'flex', gap:0, margin:0, paddingLeft:`${BAKED_OFFSET}%` }}>
        {SLIDES_DATA.map((slide, i) => (
          <SlideItem key={slide.index} slide={slide} index={i} velocityRef={velocityRef} />
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
