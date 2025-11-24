
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Environment, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Spaceship } from './Spaceship';
import { TimelineRoute } from './TimelineRoute';
import { EnemyManager } from './EnemyManager';
import { TutorialEnemyManager } from './TutorialEnemyManager';
import { GeometryPreloader } from './GeometryPreloader';
import { COLORS } from '@/lib/journey/constants';
import { useJourneyStore as useStore } from '@/lib/journey/store';

// Preload enemy models to prevent lag on first spawn
useGLTF.preload('/model/large-spaceship.glb');
useGLTF.preload('/model/Spaceship1.glb');

// Component to precompile models on GPU
const ModelPrecompiler: React.FC = () => {
  const { gl, scene } = useThree();
  const compiled = useRef(false);
  
  useEffect(() => {
    if (compiled.current) return;
    
    const compile = async () => {
      try {
        console.log('🔧 GPU: Compiling enemy ship models...');
        
        // Load models
        const largeShip = useGLTF('/model/large-spaceship.glb');
        const regularShip = useGLTF('/model/Spaceship1.glb');
        
        // Create temp scene
        const tempScene = new THREE.Scene();
        tempScene.add(largeShip.scene.clone());
        tempScene.add(regularShip.scene.clone());
        
        // Compile
        gl.compile(tempScene, new THREE.PerspectiveCamera());
        
        // Cleanup
        tempScene.clear();
        
        console.log('✓ GPU: Model compilation complete - no freeze on spawn!');
        compiled.current = true;
      } catch (error) {
        console.error('GPU compilation error:', error);
      }
    };
    
    compile();
  }, [gl]);
  
  return null;
};

const CosmicDust: React.FC = () => {
  const count = 700; // Reduced from 2000 for better performance
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
  tutorialComplete: boolean;
  tutorialStep: number;
  gameMode: 'play' | 'explore';
}

export const CosmicScene: React.FC<CosmicSceneProps> = ({ selectedShip, tutorialComplete, tutorialStep, gameMode }) => {
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
      
      {/* GPU Model Precompiler - prevents freeze on first enemy spawn */}
      <ModelPrecompiler />
      
      {/* Infinite Environment Group */}
      <InfiniteStars />
      <CosmicDust />
      <NebulaGlow />

      {/* Extended Fog to hide the far plane but reveal more of the world */}
      <fog attach="fog" args={['#020202', 50, 500]} />

      {/* Preload geometries to prevent lag on enemy spawn */}
      <GeometryPreloader />

      {/* Game Objects */}
      <Spaceship />
      <TimelineRoute />
      
      {/* Only spawn enemies in Play mode */}
      {gameMode === 'play' && (
        <>
          <TutorialEnemyManager tutorialStep={tutorialStep} />
          <EnemyManager tutorialComplete={tutorialComplete} />
        </>
      )}

      <EffectComposer multisampling={0}>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          height={300} 
          intensity={1.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </Canvas>
  );
};
