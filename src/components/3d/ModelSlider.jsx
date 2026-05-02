import React, { useEffect, useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, Bounds, Center } from '@react-three/drei';
import Core from 'smooothy';

import armModel from '../../assets/3d/robotic_arm_opt.glb';
import droneModel from '../../assets/3d/fpv_racing_drone_opt.glb';
import lineFollowerModel from '../../assets/3d/line_follower_robot_opt.glb';
import rocketModel from '../../assets/3d/rocket_opt.glb';
import autoRobotModel from '../../assets/3d/auto robot.glb';
import humanoidModel from '../../assets/3d/humanoid_main_opt.glb';

// GLB model display
function GLBModel({ path }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      firstAction?.play();
    }
  }, [actions, scene, path]);

  return <primitive object={scene} />;
}

// Optimized Wrapper: Receives normalizedDistance as a prop to avoid redundant layout calculations
function DynamicTransformWrapper({ children, normalizedDistance = 0, centerScale = 0.85, edgeScale = 0.25, centerRot = [0,0,0], edgeRot = [0,0,0], centerPos = [0,0,0], edgePos = [0,0,0], float = true }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    
    // Snapping thresholds for crisp transitions (5% threshold)
    let factor = normalizedDistance;
    if (factor < 0.05) factor = 0;
    if (factor > 0.95) factor = 1;
    
    const targetScale = centerScale - factor * (centerScale - edgeScale);
    ref.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);

    const targetRotX = centerRot[0] - factor * (centerRot[0] - edgeRot[0]);
    const targetRotY = centerRot[1] - factor * (centerRot[1] - edgeRot[1]);
    const targetRotZ = centerRot[2] - factor * (centerRot[2] - edgeRot[2]);

    const time = state.clock.elapsedTime;
    const floatY = float ? Math.sin(time * 0.8) * 0.8 * factor : 0;
    const tiltX = float ? Math.cos(time * 0.5) * 0.25 * factor : 0;
    const tiltZ = float ? Math.sin(time * 0.6) * 0.25 * factor : 0;
    const panY = float ? Math.sin(time * 0.4) * 0.2 * factor : 0;

    const mouseX = -state.pointer.x * 0.8 * (1 - factor);
    const mouseY = -state.pointer.y * 0.7 * (1 - factor);

    ref.current.rotation.x += (targetRotX + tiltX - mouseY - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y += (targetRotY + panY + mouseX - ref.current.rotation.y) * 0.1;
    ref.current.rotation.z += (targetRotZ + tiltZ - ref.current.rotation.z) * 0.1;

    const targetPosX = centerPos[0] - factor * (centerPos[0] - edgePos[0]);
    const targetPosY = centerPos[1] - factor * (centerPos[1] - edgePos[1]);
    const targetPosZ = centerPos[2] - factor * (centerPos[2] - edgePos[2]);
    
    ref.current.position.lerp({ x: targetPosX, y: targetPosY + floatY, z: targetPosZ }, 0.1);
  });
  
  return <group ref={ref}>{children}</group>;
}

// Slide content component
function SlideContent({ slide, normalizedDistance }) {
  const { position = [0,0,0], rotation = [0,0,0], edgePos, edgeRot, margin = 1, centerScale = 0.85, edgeScale = 0.25, baseRotation = [0,0,0] } = slide;
  const finalEdgePos = edgePos || position;
  const finalEdgeRot = edgeRot || rotation;
  const shouldFloat = slide.title !== 'FPV Racing Drone';

  return (
    <Suspense fallback={null}>
      <Bounds fit clip margin={margin}>
        <DynamicTransformWrapper 
          normalizedDistance={normalizedDistance}
          centerScale={centerScale} edgeScale={edgeScale}
          centerPos={position} edgePos={finalEdgePos}
          centerRot={rotation} edgeRot={finalEdgeRot}
          float={shouldFloat}
        >
          <group rotation={baseRotation}>
            <Center>
              <GLBModel path={slide.path} />
            </Center>
          </group>
        </DynamicTransformWrapper>
      </Bounds>
      <Environment preset="city" />
    </Suspense>
  );
}

const SLIDES_DATA = [
  { 
    index: '0000', 
    title: 'WidowX MKII Arm', 
    path: armModel,
    margin: 1, 
    centerScale: 0.85, 
    edgeScale: 0.2, 
    position: [0, -1.5, 0], 
    rotation: [0.5, -0.03, -0.15], 
    edgePos: [0, -8.6, 0], 
    edgeRot: [0.03, -3.052, 0.66], 
    baseRotation: [0, -2.07, 0] 
  },
  { 
    index: '0001', 
    title: 'FPV Racing Drone', 
    path: droneModel,
    margin: 1, 
    centerScale: 0.95, 
    edgeScale: 0.25, 
    position: [0, 0.05, 0], 
    rotation: [0.38, -0.49, 0], 
    edgePos: [0, 0.1, 0], 
    edgeRot: [0.3, 1.47, 0], 
    baseRotation: [0, 0, 0] 
  },
  { 
    index: '0002', 
    title: 'Auto Robot', 
    path: autoRobotModel,
    margin: 1, 
    centerScale: 0.9, 
    edgeScale: 0.2, 
    position: [1.75, 2.85, 3.2], 
    rotation: [0.14, 0.51, 0.12], 
    edgePos: [-5.1, -2.6, 2.95], 
    edgeRot: [2, 2.692, -2.17], 
    baseRotation: [-0.5, -0.27, -0.16] 
  },
  { 
    index: '0003', 
    title: 'Rocket', 
    path: rocketModel,
    margin: 1, 
    centerScale: 0.85, 
    edgeScale: 0.35, 
    position: [0, 0, 0], 
    rotation: [0, 0, -0.56], 
    edgePos: [0, 0, 0], 
    edgeRot: [-0.05, 1.81, 2.05], 
    baseRotation: [-1.57, -0.01, 1.38] 
  },
  { 
    index: '0004', 
    title: 'Line Follower Robot', 
    path: lineFollowerModel,
    margin: 1, 
    centerScale: 0.85, 
    edgeScale: 0.25, 
    position: [0, 0, 0], 
    rotation: [0.62, -0.39, 0], 
    edgePos: [1.3, 0, 0], 
    edgeRot: [0.43, 1.43, 0], 
    baseRotation: [0, 0, 0] 
  },
  { 
    index: '0005', 
    title: 'Humanoid Assembly', 
    path: humanoidModel,
    margin: 1, 
    centerScale: 0.85, 
    edgeScale: 0.25, 
    position: [0, 0, 0], 
    rotation: [-0.15, 0.47, 0.21], 
    edgePos: [0, 0, 0], 
    edgeRot: [-0.03, -1.6, -0.36], 
    baseRotation: [0, 0, 0] 
  },
];

SLIDES_DATA.forEach(s => useGLTF.preload(s.path));

// Individual Slide Wrapper to manage its own normalized distance
function SlideItem({ slide, index }) {
  const [normalizedDistance, setNormalizedDistance] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const screenCenter = window.innerWidth / 2;
      const distance = Math.abs(screenCenter - centerX);
      const maxDistance = window.innerWidth / 1.5;
      const nd = Math.min(distance / maxDistance, 1);
      setNormalizedDistance(nd);
      
      // Update Z-index based on proximity to center
      containerRef.current.style.zIndex = Math.round(1000 - distance);
    };

    // Use a small interval or requestAnimationFrame for smoother but less frequent updates if needed
    // However, since we are doing this per slide and ONLY on scroll/move, it's already much better.
    const interval = setInterval(update, 30); // 33fps update for position is plenty
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flexShrink: 0,
        width: 'clamp(280px, 35vw, 450px)',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>--</span>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{slide.index}</span>
      </div>

      <div style={{ position: 'relative', height: 'clamp(300px, 40vw, 450px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute',
          top: '15%', bottom: '15%', left: '15%', right: '15%',
          background: `linear-gradient(-45deg, hsl(${index * 65 + 180}, 80%, 50%), hsl(${index * 65 + 230}, 80%, 30%), hsl(${index * 65 + 280}, 80%, 50%), hsl(${index * 65 + 130}, 80%, 30%))`,
          backgroundSize: '400% 400%',
          animation: 'gradientWave 12s ease infinite',
          zIndex: 0
        }} />

        <div style={{ position: 'absolute', top: '-100%', bottom: '-100%', left: '-50%', right: '-50%', zIndex: 1, pointerEvents: 'none' }}>
          <Canvas
            camera={{ position: [0, 0, 3.5], fov: 45 }}
            gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[3, 5, 3]} intensity={2} />
            <SlideContent slide={slide} normalizedDistance={normalizedDistance} />
          </Canvas>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>33.23¥</span>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>"{slide.title}"</span>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>33.23¥</span>
      </div>
    </div>
  );
}

export default function ModelSlider() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const slider = new Core(wrapperRef.current, {
      infinite: true,
      snap: true,
      dragSensitivity: 0.003,
      lerpFactor: 0.06,
      scrollInput: true,
    });

    const update = () => {
      slider.update();
      requestAnimationFrame(update);
    };
    const animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      slider.destroy();
    };
  }, []);

  return (
    <div className="w-full select-none" style={{ padding: '100px 0' }}>
      <style>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="flex items-center justify-end px-6 md:px-12 mb-8">
        <span
          style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.4em' }}
          className="text-white/30 uppercase"
        >
          {SLIDES_DATA.length} OBJECTS
        </span>
      </div>

      <div ref={wrapperRef} data-slider style={{ display: 'flex' }}>
        {SLIDES_DATA.map((slide, i) => (
          <SlideItem key={slide.index} slide={slide} index={i} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4px', paddingLeft: '1rem', marginTop: '1.5rem', paddingRight: '1rem' }}>
        {SLIDES_DATA.map((s) => (
          <div key={s.index} style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.12)' }} />
        ))}
      </div>
    </div>
  );
}
