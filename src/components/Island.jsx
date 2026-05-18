import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import { useGLTF, Center, Billboard, Text, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import islandscene from "../assets/3d_models/island.glb";

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
    const currentSpeed = useRef(0);
    const targetSpeed = useRef(0);
    const baseRotationY = props.rotation ? props.rotation[1] : 0;

    const [isAnnotationHovered, setIsAnnotationHovered] = React.useState(false);

    useEffect(() => {
      if (scene) {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
      }
    }, [scene]);

    useEffect(() => {
      if (isIntersecting && activeAnnotation === null && !isAnnotationHovered) {
        targetSpeed.current = MAX_ROTATION_SPEED;
      } else {
        targetSpeed.current = 0;
      }
    }, [isIntersecting, baseRotationY, activeAnnotation, isAnnotationHovered]);

    const optimizedScene = useMemo(() => {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
          child.material.metalness = 0.2;
          child.material.roughness = 0.8;
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
      return scene;
    }, [scene]);

    useFrame((state, delta) => {
      if (!islandRef.current || !isIntersecting) return;
      
      const isStopping = targetSpeed.current === 0;
      const lerpFactor = isStopping ? 0.08 : 0.03; 

      currentSpeed.current = THREE.MathUtils.lerp(
        currentSpeed.current,
        targetSpeed.current,
        lerpFactor
      );

      if (!islandRef.current.userData.dragging) {
        islandRef.current.rotation.y = (islandRef.current.rotation.y + delta * currentSpeed.current) % (Math.PI * 2);
      }
    });

    const onModelClick = (e) => {
      e.stopPropagation();
      if (e.point) {
        const localPoint = islandRef.current.worldToLocal(e.point.clone());
      }
    };

    const modelRef = useRef();

    const renderedAnnotations = useMemo(() => {
      if (!scene) return null;
      return annotations.map((ann) => (
        <Html
          key={ann.id}
          position={ann.localPosition}
          distanceFactor={80}
          center
          occlude={[modelRef]}
          style={{
            transition: 'all 0.5s',
            opacity: activeAnnotation === ann.id ? 0 : 1,
            pointerEvents: activeAnnotation === ann.id ? 'none' : 'auto'
          }}
        >
          <div 
            className="annotation-marker-wrapper group"
            style={{
              transform: `scale(${ann.markerScale || 1})`
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAnnotationClick(ann);
            }}
          >
            <div className="annotation-label">
              {ann.title}
            </div>
            <div 
              className={`annotation-dot ${activeAnnotation === ann.id ? 'active' : ''} cursor-target`}
              onMouseEnter={() => setIsAnnotationHovered(true)}
              onMouseLeave={() => setIsAnnotationHovered(false)}
            >
              <div className="annotation-pulse-ring" />
              <span>{ann.id}</span>
            </div>
            <div className="annotation-stem" />
            <div className="annotation-anchor" />
          </div>
        </Html>
      ));
    }, [scene, annotations, activeAnnotation, isAnnotationHovered, onAnnotationClick]);

    return (
      <group ref={islandRef} position={position} {...props}>
        <Center>
          <primitive 
            ref={modelRef}
            object={optimizedScene} 
            onClick={onModelClick}
          />
        </Center>

        <group name="annotations-container">
          {renderedAnnotations}
        </group>
      </group>
    );
  }
);

Island.displayName = "Island";
export default Island;