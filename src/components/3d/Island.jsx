import React, { useRef, useMemo, forwardRef, useEffect, useState } from "react";
import { useGLTF, Center, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import islandscene from "../assets/3d/island.glb";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
useGLTF.preload(islandscene);

const AnnotationMarker = React.memo(({ ann, activeAnnotation, onAnnotationClick, islandRef, onHoverChange }) => {
  const [hovered, setHovered] = useState(false);
  const isSpecial = ann.id === 2;

  const handleMouseEnter = () => {
    setHovered(true);
    onHoverChange(true);
    if (activeAnnotation !== ann.id) document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHoverChange(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <Html
      position={ann.localPosition}
      center
      distanceFactor={isSpecial ? 100 : 70} 
      occlude={[islandRef]} 
      className="pointer-events-none" 
    >
      <style>{`
        @keyframes marker-ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes marker-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        .ripple {
          animation: marker-ripple 2s linear infinite;
        }
        .breathe {
          animation: marker-breathe 2.5s ease-in-out infinite;
        }
      `}</style>
      
      <div
        className={`relative flex flex-col items-center transition-all duration-500
          ${activeAnnotation === ann.id ? "opacity-0 scale-0" : "opacity-100 scale-100"}
        `}
        style={{
          width: isSpecial ? '100px' : '80px',
          height: isSpecial ? '130px' : '110px',
        }}
      >
        <div className="breathe flex flex-col items-center">
          
          {/* Target Cursor Only Locks on this Head */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onAnnotationClick(ann);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-target relative flex items-center justify-center pointer-events-auto"
          >
            {/* Ripple Effect */}
            <div className="ripple absolute w-full h-full border-2 border-[#a600ff] rounded-full"></div>
            
            {/* Main Marker Body */}
            <div 
              className={`relative z-10 flex items-center justify-center rounded-full border-2 border-[#a600ff] transition-all duration-500 
                ${hovered ? 'bg-white scale-110' : 'bg-[#a600ff] shadow-[0_0_20px_#a600ff]'}`}
              style={{
                width: isSpecial ? '68px' : '54px',
                height: isSpecial ? '68px' : '54px',
              }}
            >
              <span 
                className={`font-black transition-colors duration-500 ${hovered ? 'text-[#a600ff]' : 'text-white'}`}
                style={{
                  fontSize: isSpecial ? '28px' : '22px',
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                {ann.id}
              </span>
            </div>
          </div>

          {/* Connection Stem (Laser) */}
          <div className={`w-[3px] h-12 bg-gradient-to-t from-transparent to-[#a600ff] transition-all duration-500 ${hovered ? 'h-16 shadow-[0_0_15px_#a600ff]' : 'h-12 opacity-80'}`}></div>
        </div>

        {/* Base Point */}
        <div className="absolute bottom-4">
          <div className="w-3 h-3 bg-[#a600ff] rounded-full shadow-[0_0_10px_#a600ff]"></div>
        </div>
      </div>
    </Html>
  );
});

const MAX_ROTATION_SPEED = -0.2;

const Island = forwardRef(
  (
    {
      isIntersecting,
      position = [0, 0, 0],
      annotations = [],
      activeAnnotation = null,
      onAnnotationClick = () => {},
      ...props
    },
    ref
  ) => {
    const internalRef = useRef();
    const islandRef = ref || internalRef;
    const { scene } = useGLTF(islandscene, dracoLoader);
    const currentSpeed = useRef(0);
    const targetSpeed = useRef(0);
    const isMarkerHovered = useRef(false);

    useEffect(() => {
      let rampTimeout;
      if (isIntersecting && activeAnnotation === null) {
        rampTimeout = setTimeout(() => {
          targetSpeed.current = MAX_ROTATION_SPEED;
        }, 1000);
      } else {
        targetSpeed.current = 0;
      }
      return () => clearTimeout(rampTimeout);
    }, [isIntersecting, activeAnnotation]);

    useMemo(() => {
      if (!scene) return;
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
          if (child.material) {
            child.material.metalness = 0.2;
            child.material.roughness = 0.8;
          }
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
    }, [scene]);

    useFrame((state, delta) => {
      if (!islandRef.current || !isIntersecting) return;
      
      const actualTargetSpeed = isMarkerHovered.current ? 0 : targetSpeed.current;

      currentSpeed.current = THREE.MathUtils.lerp(
        currentSpeed.current,
        actualTargetSpeed,
        0.05
      );

      if (!islandRef.current.userData.dragging) {
        islandRef.current.rotation.y += delta * currentSpeed.current;
      }
    });

    return (
      <group position={position} {...props}>
        <group ref={islandRef}>
          <Center>
            <primitive 
              object={scene} 
              onClick={(e) => e.stopPropagation()}
            />
          </Center>

          <group name="annotations-container">
            {annotations.map((ann) => (
              <AnnotationMarker 
                key={ann.id}
                ann={ann}
                activeAnnotation={activeAnnotation}
                onAnnotationClick={onAnnotationClick}
                islandRef={islandRef}
                onHoverChange={(hovered) => {
                  isMarkerHovered.current = hovered;
                }}
              />
            ))}
          </group>
        </group>
      </group>
    );
  }
);

Island.displayName = "Island";
export default Island;