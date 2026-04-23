import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import { useGLTF, Center, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
    const currentSpeed = useRef(0);
    const targetSpeed = useRef(0);
    const baseRotationY = props.rotation ? props.rotation[1] : 0;

    useEffect(() => {
      if (scene) {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
      }
    }, [scene]);

    useEffect(() => {
      let rampTimeout;
      if (isIntersecting && activeAnnotation === null) {
        rampTimeout = setTimeout(() => {
          targetSpeed.current = MAX_ROTATION_SPEED;
        }, 1000);
      } else if (activeAnnotation !== null) {
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
      if (!islandRef.current || !isIntersecting) return;
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

    const [lastClick, setLastClick] = React.useState(null);

    const onModelClick = (e) => {
      e.stopPropagation();
      if (e.point) {
        const localPoint = islandRef.current.worldToLocal(e.point.clone());
        const coords = [
          parseFloat(localPoint.x.toFixed(2)),
          parseFloat(localPoint.y.toFixed(2)),
          parseFloat(localPoint.z.toFixed(2))
        ];
        console.log(`[Surface Click] localPosition:`, coords);
        setLastClick(coords);
      }
    };

    return (
      <group ref={islandRef} position={position} {...props}>
        {lastClick && (
          <Html position={lastClick} center pointerEvents="none">
            <div className="bg-[#a600ff] text-white px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap border border-white/50 shadow-lg">
              LAST_CLICK: [{lastClick.join(", ")}]
            </div>
          </Html>
        )}

        <Center>
          <primitive 
            object={optimizedScene} 
            onClick={onModelClick}
          />
        </Center>

        <group name="annotations-container">
          {annotations.map((ann) => (
            <Html
              key={ann.id}
              position={ann.localPosition}
              center
              distanceFactor={90} 
              occlude
              zIndexRange={[10, 0]}
              style={{ 
                pointerEvents: "auto",
                userSelect: "none"
              }}
            >
              <div
                className="annotation-marker-wrapper cursor-target"
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
      </group>
    );
  }
);

Island.displayName = "Island";
export default Island;