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

      const targetLookAt = ann.lookAt ? new THREE.Vector3(...ann.lookAt) : new THREE.Vector3(...ann.localPosition);
      const worldTarget = targetLookAt.clone();
      islandRef.current.localToWorld(worldTarget);

      hasActiveAnnotation.current = true;
      isAnimating.current = true;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      if (ann.model) {
        tl.to(islandRef.current.position, {
          x: ann.model.position[0],
          y: ann.model.position[1],
          z: ann.model.position[2],
          duration: 1.2,
          ease: "power2.inOut",
        }, 0);

        tl.to(islandRef.current.rotation, {
          x: ann.model.rotation[0],
          y: ann.model.rotation[1],
          z: ann.model.rotation[2],
          duration: 1.2,
          ease: "power2.inOut",
        }, 0);

        tl.to(islandRef.current.scale, {
          x: ann.model.scale,
          y: ann.model.scale,
          z: ann.model.scale,
          duration: 1.2,
          ease: "power2.inOut",
        }, 0);
      }

      tl.to(camera.position, {
        x: ann.camera.position[0],
        y: ann.camera.position[1],
        z: ann.camera.position[2],
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

      // Reset Island to base state
      tl.to(islandRef.current.position, {
        x: defaultCameraPosition[0] === 0 ? -2 : -2, // Using BASE_POSITION values manually or from props if available
        y: 0,
        z: -63,
        duration: 1.2,
        ease: "power2.inOut",
      }, 0);

      tl.to(islandRef.current.rotation, {
        x: -8 * (Math.PI / 180),
        y: 124 * (Math.PI / 180),
        z: 0,
        duration: 1.2,
        ease: "power2.inOut",
      }, 0);

      tl.to(islandRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.2,
        ease: "power2.inOut",
      }, 0);

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
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}

