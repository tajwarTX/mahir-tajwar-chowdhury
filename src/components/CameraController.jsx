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

      const baseRotationY = (124 * Math.PI) / 180;
      const rotationDelta = ann.modelRotationY - baseRotationY;

      // The calibrated camera position from Home.jsx
      const calibPos = new THREE.Vector3(...ann.camera.position);

      // Rotate the calibrated position so it matches the island's new rotation
      calibPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationDelta);

      const cameraDestX = calibPos.x;
      const cameraDestY = calibPos.y;
      const cameraDestZ = calibPos.z;

      // Default orbit controls target during calibration was [0,0,0]
      const focusTarget = new THREE.Vector3(0, 0, 0);

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

