import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface Spaceship1ModelProps {
  engineGlow?: number;
  active?: boolean;
  boosting?: boolean;
}

export default function Spaceship1Model({ engineGlow = 0, active = true, boosting = false }: Spaceship1ModelProps) {
  const groupRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  const { scene } = useGLTF('/model/Spaceship1.glb', undefined, undefined, (error) => {
    console.error('Error loading Spaceship1.glb:', error);
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

  // Fallback procedural model
  if (modelError || !scene) {
    return (
      <group ref={groupRef} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 4, 16]} />
          <meshStandardMaterial color="#2a5599" metalness={0.8} roughness={0.2} />
        </mesh>
        
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.15, 1.5]} />
          <meshStandardMaterial color="#4477bb" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      
      {/* Engine glow lights */}
      <pointLight 
        position={[0, 0, 2.5]} 
        color={boosting ? "#00ffff" : "#0088ff"} 
        intensity={boosting ? 3 : 1.5} 
        distance={5} 
        decay={2} 
      />
    </group>
  );
}
