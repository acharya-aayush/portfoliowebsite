import { useRef } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface RaptorModelProps {
  engineGlow?: number;
}

export default function RaptorModel({ engineGlow = 0 }: RaptorModelProps) {
  const groupRef = useRef<Group>(null);
  const exhaustGlowRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (exhaustGlowRef.current && engineGlow > 0) {
      const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.3 + 0.7;
      exhaustGlowRef.current.scale.setScalar(0.8 + engineGlow * 0.4 * pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Fuselage - Angular body sections */}
      {/* Front section - narrow */}
      <mesh position={[0, 0, 2.5]} castShadow>
        <boxGeometry args={[0.6, 0.5, 2]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#0a0a1a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Mid section - wider */}
      <mesh position={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[1.2, 0.6, 3]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#0a0a1a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Rear section - tapered */}
      <mesh position={[0, 0, -1.5]} castShadow>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#0a0a1a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Nose Cone - Sharp pointed front */}
      <mesh position={[0, 0, 3.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial 
          color="#2d2d44" 
          metalness={0.95} 
          roughness={0.05}
        />
      </mesh>

      {/* Cockpit Canopy - Glowing blue tint */}
      <mesh position={[0, 0.25, 1.8]} scale={[0.8, 0.6, 1.4]} castShadow>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.6}
          emissive="#0088ff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Main Wings - Swept back design */}
      {/* Left Wing */}
      <group position={[-0.4, 0, -0.5]} rotation={[0, 0, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[3.5, 0.15, 2.5]} />
          <meshStandardMaterial 
            color="#1f1f3a" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
        {/* Wing tip detail */}
        <mesh position={[-1.6, 0, -0.3]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.4, 0.12, 1.5]} />
          <meshStandardMaterial 
            color="#ff3366" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#ff0044"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.4, 0, -0.5]} rotation={[0, 0, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[3.5, 0.15, 2.5]} />
          <meshStandardMaterial 
            color="#1f1f3a" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
        {/* Wing tip detail */}
        <mesh position={[1.6, 0, -0.3]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.4, 0.12, 1.5]} />
          <meshStandardMaterial 
            color="#ff3366" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#ff0044"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Stabilizer Fins - Top and bottom */}
      {/* Top Fin */}
      <mesh position={[0, 0.6, -2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 1.2, 1.8]} />
        <meshStandardMaterial 
          color="#16162b" 
          metalness={0.88} 
          roughness={0.12}
        />
      </mesh>

      {/* Bottom Fins */}
      <mesh position={[-0.3, -0.4, -2]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.8, 1.5]} />
        <meshStandardMaterial 
          color="#16162b" 
          metalness={0.88} 
          roughness={0.12}
        />
      </mesh>
      <mesh position={[0.3, -0.4, -2]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.8, 1.5]} />
        <meshStandardMaterial 
          color="#16162b" 
          metalness={0.88} 
          roughness={0.12}
        />
      </mesh>

      {/* Engine Pods - Triple engine configuration - Angular design */}
      {/* Left Engine */}
      <group position={[-1.2, -0.1, -1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 2]} />
          <meshStandardMaterial 
            color="#0f0f1f" 
            metalness={0.92} 
            roughness={0.08}
          />
        </mesh>
        {/* Engine Exhaust */}
        <mesh position={[0, 0, -1.1]}>
          <boxGeometry args={[0.5, 0.5, 0.3]} />
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff4400"
            emissiveIntensity={engineGlow * 2}
          />
        </mesh>
      </group>

      {/* Right Engine */}
      <group position={[1.2, -0.1, -1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 2]} />
          <meshStandardMaterial 
            color="#0f0f1f" 
            metalness={0.92} 
            roughness={0.08}
          />
        </mesh>
        {/* Engine Exhaust */}
        <mesh position={[0, 0, -1.1]}>
          <boxGeometry args={[0.5, 0.5, 0.3]} />
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff4400"
            emissiveIntensity={engineGlow * 2}
          />
        </mesh>
      </group>

      {/* Center Engine - Main thruster - Hexagonal */}
      <group position={[0, -0.15, -2.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.5, 6]} />
          <meshStandardMaterial 
            color="#0a0a18" 
            metalness={0.95} 
            roughness={0.05}
          />
        </mesh>
        {/* Main Engine Exhaust */}
        <mesh position={[0, 0, -1.4]}>
          <cylinderGeometry args={[0.42, 0.42, 0.4, 6]} />
          <meshStandardMaterial 
            color="#ff8800" 
            emissive="#ff6600"
            emissiveIntensity={engineGlow * 2.5}
          />
        </mesh>
        {/* Exhaust glow effect */}
        <mesh ref={exhaustGlowRef} position={[0, 0, -1.6]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color="#ff8800" 
            transparent 
            opacity={engineGlow * 0.6}
          />
        </mesh>
      </group>

      {/* Weapon Hardpoints - Under wings */}
      {/* Left Weapon */}
      <mesh position={[-1.5, -0.2, 0.5]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial 
          color="#444455" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-1.5, -0.2, 1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ff0000"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Weapon */}
      <mesh position={[1.5, -0.2, 0.5]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial 
          color="#444455" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      <mesh position={[1.5, -0.2, 1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ff0000"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hull Paneling Details */}
      {/* Left side panel */}
      <mesh position={[-0.35, 0.1, 0.5]} castShadow>
        <boxGeometry args={[0.08, 0.6, 3]} />
        <meshStandardMaterial 
          color="#252540" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>

      {/* Right side panel */}
      <mesh position={[0.35, 0.1, 0.5]} castShadow>
        <boxGeometry args={[0.08, 0.6, 3]} />
        <meshStandardMaterial 
          color="#252540" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>

      {/* Accent Lights - Navigation */}
      {/* Left wing light */}
      <mesh position={[-2.3, 0, -0.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Right wing light */}
      <mesh position={[2.3, 0, -0.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Rear formation lights */}
      <mesh position={[0, 0.5, -3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}
