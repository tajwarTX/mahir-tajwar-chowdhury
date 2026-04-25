import React, { forwardRef, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF, Clone } from '@react-three/drei';
import MODEL_PATH from '../assets/3d/k-vrc.glb';


const KVRCModel = ({ ...props }) => {
  const { scene, materials } = useGLTF(MODEL_PATH);
  
  React.useMemo(() => {
    // Apply matte finish and performance optimizations
    Object.values(materials).forEach(material => {
      material.roughness = 1;
      material.metalness = 0;
    });

    scene.traverse((child) => {
      if (child.isMesh) {
        // Hide the street (Object_4)
        if (child.name === 'Object_4') {
          child.visible = false;
        }
        child.matrixAutoUpdate = false;
        child.updateMatrix();
        child.frustumCulled = true;
        
        // Disable shadow casting if not needed
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene, materials]);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} position={[0, -2, 0]} />
    </group>
  );
};

const KVRC = forwardRef((props, ref) => {
  // We keep the primitive version as a fallback or structure, 
  // but now we prioritize the GLTF model.
  return (
    <group ref={ref} {...props} dispose={null}>
      <Suspense fallback={null}>
        <KVRCModel />
      </Suspense>
    </group>
  );
});

useGLTF.preload(MODEL_PATH);

export default KVRC;
