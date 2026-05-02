import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, OrbitControls, Bounds, Center, Float } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import Core from 'smooothy';

import armModel from '../assets/3d/robotic_arm_opt.glb';
import droneModel from '../assets/3d/fpv_racing_drone_opt.glb';
import lineFollowerModel from '../assets/3d/line_follower_robot_opt.glb';
import rocketModel from '../assets/3d/rocket_opt.glb';
import lidarModel from '../assets/3d/RobotLIDAR_opt.glb';
import humanoidModel from '../assets/3d/humanoid_main_opt.glb';

// GLB model display
function GLBModel({ path }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (path.includes('RobotLIDAR')) {
      console.log('Lidar Model Scene:', scene);
      scene.traverse((child) => {
        console.log('Node found:', child.name, child.type);
        if (child.isMesh) {
          console.log('Mesh found:', child.name);
          console.log('Material:', child.material);
          if (Array.isArray(child.material)) {
            console.log('Materials array length:', child.material.length);
          }
        }
      });
    }
    // If the model has baked animations, play the first one automatically
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      firstAction?.play();
    }
  }, [actions, scene, path]);

  return <primitive object={scene} />;
}

// STL model display
function STLModel({ path }) {
  const geom = useLoader(STLLoader, path);
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#cccccc" roughness={0.4} metalness={0.6} />
    </mesh>
  );
}

// Dynamic model display
function AnyModel({ path }) {
  if (path.toLowerCase().endsWith('.stl')) {
    return <STLModel path={path} />;
  }
  return <GLBModel path={path} />;
}

// Wrapper to handle scaling based on center proximity
function ScalingWrapper({ children, centerScale = 0.85, edgeScale = 0.25 }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    
    // Get canvas DOM position
    const canvas = state.gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const screenCenter = window.innerWidth / 2;
    
    // Calculate distance from center (0 = center, 1 = edge)
    const distance = Math.abs(screenCenter - centerX);
    const maxDistance = window.innerWidth / 1.5;
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    // Dynamic scale based on props
    const targetScale = centerScale - normalizedDistance * (centerScale - edgeScale);
    
    // Smooth transition
    ref.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.1
    );
  });
  
  return <group ref={ref}>{children}</group>;
}

// Slide data — 6 new models
const SLIDES = [
  { index: '0000', title: 'WidowX MKII Arm', path: armModel, margin: 1, rotation: [5 * (Math.PI/180), -98 * (Math.PI/180), 0 * (Math.PI/180)], position: [0, 0, 0] },
  { index: '0001', title: 'FPV Racing Drone', path: droneModel, disableFloat: true, margin: 0.85, rotation: [25 * (Math.PI/180), -29 * (Math.PI/180), 0 * (Math.PI/180)], position: [0, 0.1, 0.1] },
  { index: '0002', title: 'Line Follower Robot', path: lineFollowerModel, margin: 1.1, rotation: [15 * (Math.PI/180), -20 * (Math.PI/180), 0 * (Math.PI/180)], position: [0, 0, 0] },
  { index: '0003', title: 'Rocket', path: rocketModel, margin: 0.9, rotation: [-90 * (Math.PI/180), 30 * (Math.PI/180), 0 * (Math.PI/180)], position: [5, 5, 0] },
  { index: '0004', title: 'Lidar Robot', path: lidarModel, margin: 0.85, rotation: [90 * (Math.PI/180), 15 * (Math.PI/180), 48 * (Math.PI/180)], position: [0, 0, 0] },
  { index: '0005', title: 'Humanoid Assembly', path: humanoidModel, margin: 0.9, rotation: [11 * (Math.PI/180), -38 * (Math.PI/180), -13 * (Math.PI/180)], position: [-5, -1.1, 0] },
];

// Preload GLTF models
SLIDES.forEach(s => {
  if (!s.path.toLowerCase().endsWith('.stl')) {
    useGLTF.preload(s.path);
  }
});

export default function ModelSlider() {
  const wrapperRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const slider = new Core(wrapperRef.current, {
      infinite: true,
      snap: true,
      dragSensitivity: 0.003,
      lerpFactor: 0.06,
      scrollInput: true,
    });

    function animate() {
      slider.update();
      
      // Dynamically set z-index for slides so the middle one is always on top
      if (wrapperRef.current) {
        const slides = wrapperRef.current.children;
        const screenCenter = window.innerWidth / 2;
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          const rect = slide.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const distance = Math.abs(screenCenter - centerX);
          // Higher z-index for items closer to the center
          slide.style.zIndex = Math.round(1000 - distance);
        }
      }
      
      sliderRef.current = requestAnimationFrame(animate);
    }
    sliderRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(sliderRef.current);
      slider.destroy();
    };
  }, []);

  return (
    <div className="w-full select-none" style={{ cursor: 'grab', padding: '100px 0' }}>
      <style>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Header row — matches demo site style */}
      <div className="flex items-center justify-between px-6 md:px-12 mb-8">
        <span
          style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.4em' }}
          className="text-white/30 uppercase"
        >
          DRAG TO EXPLORE
        </span>
        <span
          style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.4em' }}
          className="text-white/30 uppercase"
        >
          {SLIDES.length} OBJECTS
        </span>
      </div>

      {/* Slider track */}
      <div
        ref={wrapperRef}
        data-slider
        style={{ display: 'flex', cursor: 'grab' }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.index}
            style={{
              flexShrink: 0,
              width: 'clamp(320px, 45vw, 550px)',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative', // Necessary for zIndex to work
            }}
          >
            {/* Top text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>--</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{slide.index}</span>
            </div>

            {/* Central visual area */}
            <div style={{ position: 'relative', height: 'clamp(350px, 50vw, 550px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Colorful background box (smaller inset) */}
              <div style={{
                position: 'absolute',
                top: '15%', bottom: '15%', left: '15%', right: '15%',
                background: `linear-gradient(-45deg, hsl(${i * 65 + 180}, 80%, 50%), hsl(${i * 65 + 230}, 80%, 30%), hsl(${i * 65 + 280}, 80%, 50%), hsl(${i * 65 + 130}, 80%, 30%))`,
                backgroundSize: '400% 400%',
                animation: 'gradientWave 12s ease infinite',
                zIndex: 0
              }} />

              {/* 3D Canvas (larger, bleeds out) */}
              <div style={{ position: 'absolute', top: '-100%', bottom: '-100%', left: '-50%', right: '-50%', zIndex: 1, pointerEvents: 'none' }}>
                <Canvas
                  camera={{ position: [0, 0, 3.5], fov: 45 }}
                  gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
                  dpr={[1, 1.5]}
                >
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[3, 5, 3]} intensity={2} />
                  <Suspense fallback={null}>
                    <Bounds fit clip margin={slide.margin}>
                        {slide.disableFloat ? (
                          <ScalingWrapper>
                            <group position={slide.position || [0, 0, 0]} rotation={slide.rotation || [0, 0, 0]}>
                              <Center>
                                <AnyModel path={slide.path} />
                              </Center>
                            </group>
                          </ScalingWrapper>
                        ) : (
                          <Float speed={2.5} rotationIntensity={0.6} floatIntensity={2} floatingRange={[-0.15, 0.15]}>
                            <ScalingWrapper>
                              <group position={slide.position || [0, 0, 0]} rotation={slide.rotation || [0, 0, 0]}>
                                <Center>
                                  <AnyModel path={slide.path} />
                                </Center>
                              </group>
                            </ScalingWrapper>
                          </Float>
                        )}
                    </Bounds>
                    <Environment preset="city" />
                  </Suspense>
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1.2}
                  />
                </Canvas>
              </div>
            </div>

            {/* Bottom text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>33.23¥</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>"{slide.title}"</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>33.23¥</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom dash divider — matches demo site */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          paddingLeft: '1rem',
          marginTop: '1.5rem',
          paddingRight: '1rem',
        }}
      >
        {SLIDES.map((s) => (
          <div
            key={s.index}
            style={{
              height: '1px',
              flex: 1,
              background: 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
