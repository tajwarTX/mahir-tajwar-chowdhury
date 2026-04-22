import React, { useRef, useMemo, useState, forwardRef, useEffect } from "react";
import { useGLTF, Center, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { a } from "@react-spring/three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import islandscene from "../assets/3d/island.glb";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
useGLTF.preload(islandscene);

const PARALLAX_STRENGTH = 0.03;
const MAX_ROTATION_SPEED = -0.2;

const Island = forwardRef(
  ({ isIntersecting, position = [0, 0, 0], annotations = [], activeAnnotation = null, onAnnotationClick = () => {}, onResetView = () => {}, ...props }, ref) => {
    const islandRef = ref || useRef();
    const { scene } = useGLTF(islandscene, dracoLoader);
    const baseY = position[1];

    const currentSpeed = useRef(0);
    const targetSpeed = useRef(0);
    const baseRotationY = props.rotation ? props.rotation[1] : 0;

    useEffect(() => {
      let rampTimeout;
      if (isIntersecting) {
        rampTimeout = setTimeout(() => {
          targetSpeed.current = MAX_ROTATION_SPEED;
        }, 1000);
      } else {
        targetSpeed.current = 0;
        currentSpeed.current = 0;
        if (islandRef.current) {
          islandRef.current.rotation.y = baseRotationY;
        }
      }
      return () => clearTimeout(rampTimeout);
    }, [isIntersecting, baseRotationY]);

    const optimizedScene = useMemo(() => {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
          child.material.metalness = 0.2;
          child.material.roughness = 0.8;
        }
      });
      return scene;
    }, [scene]);

    useFrame((state, delta) => {
      if (!islandRef.current) return;

      // 1. Parallax (Desktop focus, subtle on mobile)
      const scrollY = window.scrollY;
      islandRef.current.position.y = baseY - scrollY * PARALLAX_STRENGTH;

      // 2. Speed Ramping
      currentSpeed.current = THREE.MathUtils.lerp(
        currentSpeed.current,
        targetSpeed.current,
        0.01
      );

      // 3. Apply Rotation (Block auto-rotate while dragging)
      if (!islandRef.current.userData.dragging) {
        islandRef.current.rotation.y += delta * currentSpeed.current;
      }
    });

    return (
      <a.group ref={islandRef} position={position} {...props}>
        <Center>
          <primitive object={optimizedScene} />
        </Center>

        {annotations.map((ann) => (
          <Html
            key={ann.id}
            position={ann.position}
            center
            distanceFactor={1200}
            occlude={false}
          >
            <div
              className={`touch-none cursor-pointer transition-all duration-300 select-none transform ${
                activeAnnotation === ann.id ? "scale-125" : "scale-100 hover:scale-110"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onAnnotationClick(ann);
              }}
            >
              {/* Annotation Dot */}
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 border-2 ${
                  activeAnnotation === ann.id
                    ? "bg-[#a600ff] border-[#a600ff] shadow-lg shadow-[#a600ff]"
                    : "bg-white/30 border-white/60 hover:bg-white/50"
                }`}
              >
                <span className="text-white text-xs md:text-sm font-bold">{ann.id}</span>
              </div>

              {/* Annotation Label */}
              <div className="mt-2 bg-black/70 backdrop-blur-md rounded-lg px-3 py-2 whitespace-nowrap text-white text-xs md:text-sm font-geist font-medium border border-white/20">
                {ann.title}
              </div>
            </div>
          </Html>
        ))}

        {/* Active Annotation Info Panel */}
        {activeAnnotation && (
          <Html position={[0, 0, 0]} center distanceFactor={1}>
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-md border border-[#a600ff]/50 rounded-lg p-6 md:p-8 max-w-md md:max-w-lg">
              {(() => {
                const annotation = annotations.find((a) => a.id === activeAnnotation);
                return annotation ? (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-[#a600ff] font-geist text-xs md:text-sm uppercase tracking-[0.3em] font-bold mb-1">
                          Annotation {annotation.id}
                        </h3>
                        <h2 className="text-white font-orbitron text-xl md:text-2xl font-bold uppercase">
                          {annotation.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-white/70 font-geist text-sm md:text-base leading-relaxed">
                      {annotation.description}
                    </p>
                  </>
                ) : null;
              })()}
            </div>
          </Html>
        )}
      </a.group>
    );
  }
);

Island.displayName = "Island";

export default Island;