import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, PointLight } from 'three';
import { useFrame } from '@react-three/fiber';

interface StarfighterGLBModelProps {
  active?: boolean;
  boosting?: boolean;
  warningActive?: boolean;
}

export default function StarfighterGLBModel({ active = true, boosting = false, warningActive = false }: StarfighterGLBModelProps) {
  const groupRef = useRef<Group>(null);
  const warningLightRef = useRef<PointLight>(null);
  const [modelError, setModelError] = useState(false);
  
  const { scene } = useGLTF('/model/Spaceship.glb', undefined, undefined, (error) => {
    console.error('Error loading Spaceship.glb:', error);
    setModelError(true);
  });

  useEffect(() => {
    if (scene && !modelError) {
      scene.scale.set(0.8, 0.8, 0.8);
      scene.rotation.set(0, Math.PI, 0);
      
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
          }
        }
      });
    }
  }, [scene, modelError]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (warningLightRef.current) {
      if (warningActive) {
        warningLightRef.current.intensity = Math.sin(t * 15) > 0 ? 2 : 0;
        warningLightRef.current.color.set('#ff0000');
      } else {
        warningLightRef.current.intensity = 0;
      }
    }
  });

  // Fallback to procedural model if GLB fails
  if (modelError || !scene) {
    const chromeMaterial = <meshStandardMaterial color="#e2e8f0" metalness={1.0} roughness={0.15} />;
    const goldMaterial = <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />;
    
    return (
      <group ref={groupRef} rotation={[0, Math.PI, 0]} scale={[0.8, 0.8, 0.8]}>
        <pointLight ref={warningLightRef} position={[0, 0.5, -0.8]} distance={3} decay={2} />
        
        {/* Simple fallback model */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 4, 16]} />
          {chromeMaterial}
        </mesh>
        
        {/* Wings */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[4, 0.1, 0.8]} />
          {goldMaterial}
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <pointLight ref={warningLightRef} position={[0, 0.5, -0.8]} distance={3} decay={2} />
      <primitive object={scene} />
      
      {/* Engine glow lights - 4 thrusters */}
      <pointLight position={[-1.5, 0.5, 3]} color={boosting ? "#f4cf47" : "#00ffff"} intensity={boosting ? 3 : 1.5} distance={5} decay={2} />
      <pointLight position={[1.5, 0.5, 3]} color={boosting ? "#f4cf47" : "#00ffff"} intensity={boosting ? 3 : 1.5} distance={5} decay={2} />
      <pointLight position={[-1.5, -0.5, 3]} color={boosting ? "#f4cf47" : "#00ffff"} intensity={boosting ? 3 : 1.5} distance={5} decay={2} />
      <pointLight position={[1.5, -0.5, 3]} color={boosting ? "#f4cf47" : "#00ffff"} intensity={boosting ? 3 : 1.5} distance={5} decay={2} />
    </group>
  );
}
