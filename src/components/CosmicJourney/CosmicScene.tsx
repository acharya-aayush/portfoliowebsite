
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Spaceship } from './Spaceship';
import { TimelineRoute } from './TimelineRoute';
import { EnemyManager } from './EnemyManager';
import { COLORS } from '@/lib/journey/constants';
import { useJourneyStore as useStore } from '@/lib/journey/store';

const CosmicDust: React.FC = () => {
  const count = 2000;
  const mesh = useRef<THREE.Points>(null);
  
  // Use a simpler initial spread, we will recycle in useFrame
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 500;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 500;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }
    return temp;
  }, []);

  useFrame(({ camera }) => {
    if (!mesh.current) return;
    
    // Infinite Dust Logic
    // We manually check particle positions relative to camera and wrap them
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const camZ = camera.position.z;
    const camX = camera.position.x;
    const camY = camera.position.y;

    for (let i = 0; i < count; i++) {
      let ix = i * 3;
      let iy = i * 3 + 1;
      let iz = i * 3 + 2;

      // Check Z distance (Forward/Back)
      // If particle is behind camera (z > camZ + offset), move it far ahead
      if (positions[iz] > camZ + 20) {
         positions[iz] = camZ - 400 - Math.random() * 200;
         // Reshuffle X/Y to stay within view tunnel
         positions[ix] = camX + (Math.random() - 0.5) * 300;
         positions[iy] = camY + (Math.random() - 0.5) * 200;
      } 
      // If particle is too far ahead (unlikely, but good for init)
      else if (positions[iz] < camZ - 650) {
         positions[iz] = camZ + 10;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.z += 0.0005; // Subtle roll
  });

  return (
    <points ref={mesh} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color={COLORS.bright}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const NebulaGlow: React.FC = () => {
  // Make nebula move slightly with camera to simulate distance, but not 1:1
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ camera }) => {
      if(groupRef.current) {
          // Follow camera on Z but slower (parallax)
          groupRef.current.position.z = camera.position.z * 0.8;
          // Center X/Y roughly
          groupRef.current.position.x = camera.position.x * 0.5;
          groupRef.current.position.y = camera.position.y * 0.5;
      }
  })

  return (
    <group ref={groupRef}>
       {/* Golden Haze Left */}
       <mesh position={[-80, 20, -200]}>
          <sphereGeometry args={[60, 32, 32]} />
          <meshBasicMaterial color={COLORS.deep} transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
       </mesh>
       {/* Golden Haze Right */}
       <mesh position={[80, -30, -400]}>
          <sphereGeometry args={[70, 32, 32]} />
          <meshBasicMaterial color={COLORS.warm} transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
       </mesh>
       {/* Deep Space Blue/Purple Haze for contrast */}
       <mesh position={[0, 50, -500]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#1e1b4b" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
       </mesh>
    </group>
  )
}

const InfiniteStars: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ camera }) => {
    if (groupRef.current) {
        // Center the star sphere on the camera at all times
        groupRef.current.position.copy(camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Large radius ensures we don't see the boundary easily */}
      <Stars radius={200} depth={50} count={8000} factor={6} saturation={0.5} fade speed={1} />
    </group>
  );
};

interface CosmicSceneProps {
  selectedShip?: string;
}

export const CosmicScene: React.FC<CosmicSceneProps> = ({ selectedShip }) => {
  // Zoom out camera for cruiser to show entire large ship
  const cameraZ = selectedShip === 'cruiser' ? 8 : 5;
  const cameraY = selectedShip === 'cruiser' ? 3 : 2;
  
  return (
    <Canvas shadows camera={{ position: [0, cameraY, cameraZ], fov: 60 }} gl={{ antialias: false }}>
      <color attach="background" args={['#020202']} />
      
      <Environment preset="city" background={false} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.primary} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c1d95" />
      
      {/* Infinite Environment Group */}
      <InfiniteStars />
      <CosmicDust />
      <NebulaGlow />

      {/* Extended Fog to hide the far plane but reveal more of the world */}
      <fog attach="fog" args={['#020202', 50, 500]} />

      {/* Game Objects */}
      <Spaceship />
      <TimelineRoute />
      <EnemyManager />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          height={300} 
          intensity={1.2} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </Canvas>
  );
};
