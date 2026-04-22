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

      hasActiveAnnotation.current = true;
      isAnimating.current = true;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Animate model rotation to best viewing angle for this annotation
      tl.to(islandRef.current.rotation, {
        y: ann.modelRotationY,
        duration: 1.2,
        ease: "power2.inOut",
      }, 0);

      // Animate camera position
      tl.to(camera.position, {
        x: ann.camera.position[0],
        y: ann.camera.position[1],
        z: ann.camera.position[2],
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      // Animate lookAt target
      tl.to(lookAtTarget.current, {
        x: ann.camera.target[0],
        y: ann.camera.target[1],
        z: ann.camera.target[2],
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      }, 0);

    } else if (hasActiveAnnotation.current) {
      // Reset to default view
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

      // Get island's current position for reset transition
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

  // Keep camera looking at the target while annotation is active or during transition
  useFrame(() => {
    if (hasActiveAnnotation.current || isAnimating.current) {
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}

