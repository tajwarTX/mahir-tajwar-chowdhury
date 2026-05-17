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

      const targetLookAt = ann.lookAt ? new THREE.Vector3(...ann.lookAt) : new THREE.Vector3(0, 0, 0); // Default to center if no lookAt
      
      const worldTarget = targetLookAt.clone();
      islandRef.current.localToWorld(worldTarget);
      
      const targetCameraWorldPos = new THREE.Vector3(...ann.camera.position);
      islandRef.current.localToWorld(targetCameraWorldPos);

      hasActiveAnnotation.current = true;
      isAnimating.current = true;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(camera.position, {
        x: targetCameraWorldPos.x,
        y: targetCameraWorldPos.y,
        z: targetCameraWorldPos.z,
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      tl.to(lookAtTarget.current, {
        x: worldTarget.x,
        y: worldTarget.y,
        z: worldTarget.z,
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
        x: 0,
        y: 0,
        z: 0,
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
      if (camera.position.distanceTo(lookAtTarget.current) > 1) {
        camera.lookAt(lookAtTarget.current);
      }
    }
  });

  return null;
}

