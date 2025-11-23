import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, SpotLight as ThreeSpotLight } from 'three';
import { Trail } from '@react-three/drei';

interface XWingModelProps {
  active: boolean;
  boosting: boolean;
  warningActive: boolean;
  velocity: number;
}

export const XWingModel: React.FC<XWingModelProps> = ({ active, boosting, warningActive, velocity }) => {
  const warningLightRef = useRef<PointLight>(null);
  const engineLight1 = useRef<PointLight>(null);
  const engineLight2 = useRef<PointLight>(null);
  const engineLight3 = useRef<PointLight>(null);
  const engineLight4 = useRef<PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Warning light
    if (warningLightRef.current) {
      if (warningActive) {
        warningLightRef.current.intensity = Math.sin(t * 15) > 0 ? 3 : 0;
        warningLightRef.current.color.set('#ff0000');
      } else {
        warningLightRef.current.intensity = 0;
      }
    }

    // Engine glow intensity based on velocity
    const intensityBase = boosting ? 4 : (active ? 2 : 0.5);
    const flicker = Math.sin(t * 30) * 0.3;
    const engineIntensity = intensityBase + flicker;

    [engineLight1, engineLight2, engineLight3, engineLight4].forEach(ref => {
      if (ref.current) {
        ref.current.intensity = engineIntensity;
        ref.current.color.set(boosting ? '#ff8800' : '#ff6600');
      }
    });
  });

  // Materials
  const hullMaterial = <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.15} />;
  const accentMaterial = <meshStandardMaterial color="#ff4400" metalness={0.7} roughness={0.3} emissive="#ff2200" emissiveIntensity={0.2} />;
  const cockpitMaterial = <meshStandardMaterial color="#002244" metalness={0.9} roughness={0.05} transparent opacity={0.8} />;
  const engineGlowMaterial = <meshBasicMaterial color={boosting ? '#4488ff' : '#3366ee'} />;

  return (
    <group rotation={[0, Math.PI, 0]} scale={[0.7, 0.7, 0.7]}>
      {/* Warning Light */}
      <pointLight ref={warningLightRef} position={[0, 0.4, -1]} distance={4} decay={2} />

      {/* === MAIN FUSELAGE === */}
      {/* Nose cone - sharper */}
      <mesh position={[0, 0, -4.2]}>
        <coneGeometry args={[0.25, 1.8, 8]} />
        {hullMaterial}
      </mesh>

      {/* Forward fuselage - sleeker */}
      <mesh position={[0, 0, -2.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.38, 2.2, 16]} />
        {hullMaterial}
      </mesh>

      {/* Mid fuselage - streamlined */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.35, 2, 16]} />
        {hullMaterial}
      </mesh>

      {/* Cockpit - refined */}
      <mesh position={[0, 0.3, -2.2]}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        {cockpitMaterial}
      </mesh>

      {/* Rear fuselage - longer and sleeker */}
      <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 3, 16]} />
        {hullMaterial}
      </mesh>

      {/* === ENGINE NACELLES === */}
      {/* Top Left Engine */}
      <group position={[-1.3, 0.9, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 6, 16]} />
          {hullMaterial}
        </mesh>
        {/* Engine glow - Blue */}
        <mesh position={[0, 0, 3.2]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          {engineGlowMaterial}
          <pointLight ref={engineLight1} color={boosting ? '#6699ff' : '#4488ff'} distance={7} decay={2} />
        </mesh>
        {/* Red accent rings */}
        <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          {accentMaterial}
        </mesh>
        <mesh position={[0, 0, 2.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.035, 8, 16]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Top Right Engine */}
      <group position={[1.3, 0.9, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 6, 16]} />
          {hullMaterial}
        </mesh>
        <mesh position={[0, 0, 3.2]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          {engineGlowMaterial}
          <pointLight ref={engineLight2} color={boosting ? '#6699ff' : '#4488ff'} distance={7} decay={2} />
        </mesh>
        <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          {accentMaterial}
        </mesh>
        <mesh position={[0, 0, 2.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.035, 8, 16]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Bottom Left Engine */}
      <group position={[-1.3, -0.9, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 6, 16]} />
          {hullMaterial}
        </mesh>
        <mesh position={[0, 0, 3.2]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          {engineGlowMaterial}
          <pointLight ref={engineLight3} color={boosting ? '#6699ff' : '#4488ff'} distance={7} decay={2} />
        </mesh>
        <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          {accentMaterial}
        </mesh>
        <mesh position={[0, 0, 2.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.035, 8, 16]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Bottom Right Engine */}
      <group position={[1.3, -0.9, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 6, 16]} />
          {hullMaterial}
        </mesh>
        <mesh position={[0, 0, 3.2]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          {engineGlowMaterial}
          <pointLight ref={engineLight4} color={boosting ? '#6699ff' : '#4488ff'} distance={7} decay={2} />
        </mesh>
        <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          {accentMaterial}
        </mesh>
        <mesh position={[0, 0, 2.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.035, 8, 16]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* === S-FOILS (WINGS) === */}
      {/* Top Left Wing */}
      <group position={[-0.65, 0.45, -1]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[3.2, 0.1, 2.8]} />
          {hullMaterial}
        </mesh>
        {/* Wingtip laser cannon */}
        <mesh position={[-1.6, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Top Right Wing */}
      <group position={[0.65, 0.45, -1]}>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[3.2, 0.1, 2.8]} />
          {hullMaterial}
        </mesh>
        <mesh position={[1.6, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Bottom Left Wing */}
      <group position={[-0.65, -0.45, -1]}>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[3.2, 0.1, 2.8]} />
          {hullMaterial}
        </mesh>
        <mesh position={[-1.6, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Bottom Right Wing */}
      <group position={[0.65, -0.45, -1]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[3.2, 0.1, 2.8]} />
          {hullMaterial}
        </mesh>
        <mesh position={[1.6, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* R2 Unit */}
      <group position={[0, 0.1, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 12]} />
          <meshStandardMaterial color="#4488ff" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
