import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, PointLight } from 'three';
import { useFrame } from '@react-three/fiber';

interface XWingGLBModelProps {
  active?: boolean;
  boosting?: boolean;
  warningActive?: boolean;
  velocity?: number;
}

export default function XWingGLBModel({ active = true, boosting = false, warningActive = false, velocity = 0 }: XWingGLBModelProps) {
  const groupRef = useRef<Group>(null);
  const warningLightRef = useRef<PointLight>(null);
  const [modelError, setModelError] = useState(false);
  
  const { scene } = useGLTF('/model/Spaceship2.glb', undefined, undefined, (error) => {
    console.error('Error loading Spaceship2.glb:', error);
    setModelError(true);
  });

  useEffect(() => {
    if (scene && !modelError) {
      scene.scale.set(1, 1, 1);
      scene.rotation.set(0, Math.PI, 0);
      
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.3;
          }
        }
      });
    }
  }, [scene, modelError]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (warningLightRef.current) {
      if (warningActive) {
        warningLightRef.current.intensity = Math.sin(t * 15) > 0 ? 3 : 0;
        warningLightRef.current.color.set('#ff0000');
      } else {
        warningLightRef.current.intensity = 0;
      }
    }
    
    // S-Foils opening animation based on velocity
    if (groupRef.current && scene) {
      const openAmount = Math.abs(velocity) > 20 ? 1 : 0;
      // TODO: Implement S-foil animation if model has separate wing parts
    }
  });

  // Fallback to procedural model if GLB fails
  if (modelError || !scene) {
    const redMaterial = <meshStandardMaterial color="#bb2244" metalness={0.8} roughness={0.3} />;
    const grayMaterial = <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />;
    
    return (
      <group ref={groupRef} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]}>
        <pointLight ref={warningLightRef} position={[0, 0.3, -1]} distance={4} decay={2} />
        
        {/* Simple X-Wing fallback */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 5, 16]} />
          {grayMaterial}
        </mesh>
        
        {/* X-Wings */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/4]}>
          <boxGeometry args={[4, 0.1, 1]} />
          {redMaterial}
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI/4]}>
          <boxGeometry args={[4, 0.1, 1]} />
          {redMaterial}
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <pointLight ref={warningLightRef} position={[0, 0.3, -1]} distance={4} decay={2} />
      <primitive object={scene} />
      
      {/* Engine glow lights for 4 engines */}
      <pointLight position={[-1.5, 1.5, 2.5]} color={boosting ? "#ff4400" : "#ff0000"} intensity={boosting ? 2 : 1} distance={4} decay={2} />
      <pointLight position={[1.5, 1.5, 2.5]} color={boosting ? "#ff4400" : "#ff0000"} intensity={boosting ? 2 : 1} distance={4} decay={2} />
      <pointLight position={[-1.5, -1.5, 2.5]} color={boosting ? "#ff4400" : "#ff0000"} intensity={boosting ? 2 : 1} distance={4} decay={2} />
      <pointLight position={[1.5, -1.5, 2.5]} color={boosting ? "#ff4400" : "#ff0000"} intensity={boosting ? 2 : 1} distance={4} decay={2} />
    </group>
  );
}
