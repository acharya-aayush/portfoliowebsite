import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface CruiserModelProps {
  engineGlow?: number;
  active?: boolean;
  boosting?: boolean;
}

export default function CruiserModel({ engineGlow = 0, active = true, boosting = false }: CruiserModelProps) {
  const groupRef = useRef<Group>(null);
  const [modelError, setModelError] = useState(false);
  
  const { scene } = useGLTF('/model/large-spaceship.glb', undefined, undefined, (error) => {
    console.error('Error loading cruiser model:', error);
    setModelError(true);
  });

  useEffect(() => {
    if (scene && !modelError) {
      // Scale and rotate the model if needed - adjust these values based on the actual model
      scene.scale.set(1.35, 1.35, 1.35); // Scale for massive battlecruiser (reduced by 10%)
      scene.rotation.set(0, Math.PI / 2, 0); // Rotate 90 degrees to face forward (flipped from -90 to fix front/back)
      
      // Apply materials/effects
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Make materials more metallic/shiny
          if (child.material) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
          }
        }
      });
    }
  }, [scene, modelError]);

  useFrame((state) => {
    if (groupRef.current && active) {
      // Keep stable - no rotation animation to maintain -90 degree orientation
    }
  });

  // Fallback procedural model if GLB doesn't load
  if (modelError || !scene) {
    return (
      <group ref={groupRef} scale={[1.5, 1.5, 1.5]}>
        {/* Main Hull - Large angular battleship */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 1, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Front Hull */}
        <mesh position={[0, 0, 4.5]} castShadow>
          <boxGeometry args={[1.5, 0.8, 1]} />
          <meshStandardMaterial color="#2d2d44" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Command Bridge */}
        <mesh position={[0, 0.8, 1]} castShadow>
          <boxGeometry args={[1, 0.6, 2]} />
          <meshStandardMaterial color="#1f1f3a" metalness={0.85} roughness={0.15} />
        </mesh>
        
        {/* Wing Structures */}
        <mesh position={[-1.5, 0, -1]} castShadow>
          <boxGeometry args={[1, 0.3, 4]} />
          <meshStandardMaterial color="#16162b" metalness={0.88} roughness={0.12} />
        </mesh>
        <mesh position={[1.5, 0, -1]} castShadow>
          <boxGeometry args={[1, 0.3, 4]} />
          <meshStandardMaterial color="#16162b" metalness={0.88} roughness={0.12} />
        </mesh>
        
        {/* Engine Array - 4 Large Engines */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
          <group key={i} position={[x, -0.3, -4]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.4, 1.5, 6]} />
              <meshStandardMaterial color="#0a0a18" metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0, -0.9]}>
              <cylinderGeometry args={[0.42, 0.42, 0.3, 6]} />
              <meshStandardMaterial 
                color="#00ddff" 
                emissive="#00bbff"
                emissiveIntensity={engineGlow * 2}
              />
            </mesh>
          </group>
        ))}
        
        {/* Weapon Turrets */}
        <mesh position={[0, 0.5, 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
          <meshStandardMaterial color="#444455" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Engine glow effects */}
        {engineGlow > 0 && (
          <>
            <pointLight position={[0, 0, -5]} intensity={engineGlow * 3} color="#00ddff" distance={15} />
            <pointLight position={[0, 0, -5]} intensity={engineGlow * 2} color="#4488ff" distance={12} />
          </>
        )}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone()} />
      
      {/* Engine glow effects */}
      {engineGlow > 0 && (
        <>
          <pointLight position={[0, 0, -3]} intensity={engineGlow * 2} color="#00ddff" distance={10} />
          <pointLight position={[0, 0, -3]} intensity={engineGlow * 1.5} color="#ff8800" distance={8} />
        </>
      )}
    </group>
  );
}

// Try to preload the model but don't crash if it fails
try {
  useGLTF.preload('/model/large-spaceship.glb');
} catch (e) {
  console.log('GLB model not found, using fallback geometry');
}
