import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import { useGLTF, Center, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { a } from "@react-spring/three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import islandscene from "../assets/3d/island.glb";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
useGLTF.preload(islandscene);

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
    const islandRef = ref || useRef();
    const { scene } = useGLTF(islandscene, dracoLoader);
    const baseY = position[1];

    const currentSpeed = useRef(0);
    const targetSpeed = useRef(0);
    const baseRotationY = props.rotation ? props.rotation[1] : 0;

    // Log bounding box on load for debugging
    useEffect(() => {
      if (scene) {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        console.log("[Island] Bounding Box Size:", size);
        console.log("[Island] Bounding Box Center:", center);
        console.log("[Island] Bounding Box Min:", box.min);
        console.log("[Island] Bounding Box Max:", box.max);
      }
    }, [scene]);

    useEffect(() => {
      let rampTimeout;
      if (isIntersecting && activeAnnotation === null) {
        rampTimeout = setTimeout(() => {
          targetSpeed.current = MAX_ROTATION_SPEED;
        }, 1000);
      } else if (activeAnnotation !== null) {
        // Stop rotation when annotation is active
        targetSpeed.current = 0;
        currentSpeed.current = 0;
      } else {
        targetSpeed.current = 0;
        currentSpeed.current = 0;
        if (islandRef.current) {
          islandRef.current.rotation.y = baseRotationY;
        }
      }
      return () => clearTimeout(rampTimeout);
    }, [isIntersecting, baseRotationY, activeAnnotation]);

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

      // Only auto-rotate when no annotation is active
      if (activeAnnotation === null) {
        currentSpeed.current = THREE.MathUtils.lerp(
          currentSpeed.current,
          targetSpeed.current,
          0.01
        );

        if (!islandRef.current.userData.dragging) {
          islandRef.current.rotation.y += delta * currentSpeed.current;
        }
      }
    });

    const onModelClick = (e) => {
      e.stopPropagation();
      if (e.point) {
        // Log the clicked point in local coordinates relative to the island group
        const localPoint = islandRef.current.worldToLocal(e.point.clone());
        console.log(`[Surface Click] localPosition: [${localPoint.x.toFixed(2)}, ${localPoint.y.toFixed(2)}, ${localPoint.z.toFixed(2)}]`);
      }
    };

    return (
      <a.group ref={islandRef} position={position} {...props}>
        <Center>
          <primitive 
            object={optimizedScene} 
            onClick={onModelClick}
          />
        </Center>

        {/* 3D Annotation Markers - Optimized for Depth & Performance */}
        <group name="annotations-container">
          {annotations.map((ann) => (
            <Html
              key={ann.id}
              position={ann.localPosition}
              center
              distanceFactor={90} /* Slightly larger base size */
              occlude /* Enable depth hiding */
              zIndexRange={[10, 0]}
              style={{ 
                pointerEvents: "auto",
                userSelect: "none",
                willChange: "transform, opacity"
              }}
            >
              <div
                className="annotation-marker-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnnotationClick(ann);
                }}
              >
                <div
                  className={`annotation-dot ${
                    activeAnnotation === ann.id ? "active" : ""
                  }`}
                >
                  <span>{ann.id}</span>
                </div>
                <div className="annotation-label">{ann.title}</div>
              </div>
            </Html>
          ))}
        </group>

      </a.group>
    );
  }
);

Island.displayName = "Island";

export default Island;