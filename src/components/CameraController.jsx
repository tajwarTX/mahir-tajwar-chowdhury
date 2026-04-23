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

      const worldTarget = new THREE.Vector3(...ann.localPosition);
      islandRef.current.localToWorld(worldTarget);

      // Use explicit target from config if provided, otherwise focus on annotation position
      const finalTarget = ann.camera.target
        ? new THREE.Vector3(...ann.camera.target)
        : worldTarget;

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
        x: ann.camera.position[0],
        y: ann.camera.position[1],
        z: ann.camera.position[2],
        duration: 1.5,
        ease: "power3.inOut",
      }, 0);

      tl.to(lookAtTarget.current, {
        x: finalTarget.x,
        y: finalTarget.y,
        z: finalTarget.z,
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

