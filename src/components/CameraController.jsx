import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export default function CameraController({
  activeAnnotation,
  annotations,
  islandRef,
  defaultCameraPosition = [0, 0, 50],
}) {
  const { camera } = useThree();
  const timelineRef = useRef(null);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  const hasActiveAnnotation = useRef(false);

  useEffect(() => {
    if (timelineRef.current) timelineRef.current.kill();

    if (activeAnnotation !== null) {
      const ann = annotations.find((a) => a.id === activeAnnotation);
      if (!ann || !islandRef.current) return;

      const simulatedIsland = new THREE.Object3D();
      simulatedIsland.position.copy(islandRef.current.position);
      simulatedIsland.scale.copy(islandRef.current.scale);
      simulatedIsland.rotation.copy(islandRef.current.rotation);
      simulatedIsland.rotation.y = ann.modelRotationY;
      simulatedIsland.updateMatrixWorld();

      const targetWorldPos = new THREE.Vector3(...ann.localPosition);
      targetWorldPos.applyMatrix4(simulatedIsland.matrixWorld);

      // "right above the annotations"
      const cameraDestX = targetWorldPos.x;
      const cameraDestY = targetWorldPos.y + 60; // Adjust this height if needed
      const cameraDestZ = targetWorldPos.z;

      // "focusing in the centre of the model"
      const focusTarget = islandRef.current.position.clone();

      hasActiveAnnotation.current = true;
      isAnimating.current = true;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(islandRef.current.rotation, {
        y: ann.modelRotationY,
        duration: 1.2,
        ease: "power2.inOut",
      }, 0);

      tl.to(camera.position, {
        x: cameraDestX,
        y: cameraDestY,
        z: cameraDestZ,
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      tl.to(lookAtTarget.current, {
        x: focusTarget.x,
        y: focusTarget.y,
        z: focusTarget.z,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      }, 0);

    } else if (hasActiveAnnotation.current) {

      hasActiveAnnotation.current = false;
      isAnimating.current = true;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(camera.position, {
        x: defaultCameraPosition[0],
        y: defaultCameraPosition[1],
        z: defaultCameraPosition[2],
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      const currentIslandPos = islandRef.current.position;

      tl.to(lookAtTarget.current, {
        x: currentIslandPos.x,
        y: currentIslandPos.y,
        z: currentIslandPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      }, 0);
    }

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [activeAnnotation]);

  useFrame(() => {
    if (hasActiveAnnotation.current || isAnimating.current) {
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}

