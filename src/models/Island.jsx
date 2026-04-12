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
  ({ isIntersecting, position = [0, 0, 0], annotations = [], ...props }, ref) => {
    const islandRef = ref || useRef();
    const { scene } = useGLTF(islandscene, dracoLoader);
    const baseY = position[1];
    const [activeAnnotation, setActiveAnnotation] = useState(null);

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
            distanceFactor={15} // Reduced distance factor for better mobile visibility
            occlude
          >
            <div
              className="touch-none cursor-pointer bg-white/90 rounded-md p-2 text-black text-[10px] md:text-sm transition-all hover:scale-105 select-none"
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag triggering on click
                setActiveAnnotation(ann.id === activeAnnotation ? null : ann.id);
              }}
            >
              {ann.title}
              {activeAnnotation === ann.id && (
                <div className="mt-2 bg-white rounded-md p-2 shadow-lg max-w-[150px] md:max-w-xs text-black z-50">
                  <h3 className="font-bold text-xs md:text-base">{ann.title}</h3>
                  <p className="text-[10px] md:text-sm">{ann.description}</p>
                </div>
              )}
            </div>
          </Html>
        ))}
      </a.group>
    );
  }
);

export default Island;