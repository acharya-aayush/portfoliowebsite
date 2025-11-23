
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { TIMELINE_EVENTS, COLORS, Z_LIMIT } from '@/lib/journey/constants';
import { useJourneyStore as useStore } from '@/lib/journey/store';
import { Mesh, Vector3, CatmullRomCurve3, MathUtils, MeshStandardMaterial, MeshBasicMaterial, AdditiveBlending, Object3D, InstancedMesh } from 'three';

const EventPlanet: React.FC<{ event: typeof TIMELINE_EVENTS[0], isActive: boolean }> = ({ event, isActive }) => {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      
      // Dynamic Pulse Logic
      const baseScale = isActive ? 2.4 : 1.2; 
      const breathing = isActive ? Math.sin(t * 2.5) * 0.15 : 0;
      const targetScale = baseScale + breathing;

      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
      
      const mat = meshRef.current.material as MeshStandardMaterial;
      if (mat) {
          const targetEmissive = isActive ? 1.5 : 0.1;
          mat.emissiveIntensity = MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
          mat.color.set(isActive ? COLORS.bright : COLORS.primary);
      }
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
      ringRef.current.rotation.y = t * 0.1;
      
      const targetRingScale = isActive ? 1.4 : 1.0;
      ringRef.current.scale.lerp(new Vector3(targetRingScale, targetRingScale, targetRingScale), 0.1);
      
      const mat = ringRef.current.material as MeshBasicMaterial;
      if (mat) {
          mat.opacity = MathUtils.lerp(mat.opacity, isActive ? 0.8 : 0.3, 0.1);
          mat.color.set(isActive ? COLORS.bright : COLORS.warm);
      }
    }

    if (glowRef.current) {
        const targetGlow = isActive ? 1.0 : 0.0;
        glowRef.current.scale.lerp(new Vector3(targetGlow, targetGlow, targetGlow), 0.1);
        glowRef.current.rotation.z = -t * 0.2;
    }
  });

  return (
    <group position={new Vector3(...event.position)}>
      {/* Planet Mesh */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial 
            color={COLORS.primary} 
            emissive={COLORS.primary}
            emissiveIntensity={0.1}
            roughness={0.6}
            metalness={0.8}
            flatShading
          />
        </mesh>
      </Float>
      
      {/* Glow Aura */}
      <mesh ref={glowRef} scale={[0, 0, 0]}>
         <sphereGeometry args={[2.8, 32, 32]} />
         <meshBasicMaterial 
            color={COLORS.bright} 
            transparent 
            opacity={0.25} 
            blending={AdditiveBlending} 
            depthWrite={false}
         />
      </mesh>
      
      {/* Orbital Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.5, 0.05, 16, 64]} />
        <meshBasicMaterial color={COLORS.warm} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0.5, 0.5, 0]}>
         <torusGeometry args={[5, 0.02, 16, 64]} />
         <meshBasicMaterial color={COLORS.deep} transparent opacity={0.2} />
      </mesh>

      {/* Floating Labels */}
      <group position={[0, 5, 0]} scale={isActive ? 1.2 : 1}>
        <Text
          fontSize={1.5}
          color={isActive ? '#ffffff' : COLORS.warm}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {event.date}
        </Text>
        <Text
           position={[0, -1.2, 0]}
           fontSize={1}
           maxWidth={15} 
           textAlign="center"
           lineHeight={1.2}
           color={isActive ? COLORS.bright : '#9ca3af'}
           anchorX="center"
           anchorY="top"
           outlineWidth={0.02}
           outlineColor="#000000"
        >
          {event.title}
        </Text>
      </group>
    </group>
  );
};

export const TimelineRoute: React.FC = () => {
  const zPos = useStore((state) => state.zPos);
  const xPos = useStore((state) => state.xPos);
  const yPos = useStore((state) => state.yPos);
  const setActiveEventId = useStore((state) => state.setActiveEventId);
  const addVisitedWaypoint = useStore((state) => state.addVisitedWaypoint);
  const activeEventIdRef = useRef<string | null>(null);
  const visitedInSession = useRef<Set<number>>(new Set());
  
  const meshRef = useRef<InstancedMesh>(null);
  const tempObj = useMemo(() => new Object3D(), []);

  // Create a curve path through all events
  const curve = useMemo(() => {
    const points = [
      new Vector3(0, 0, 10), // Start behind
      ...TIMELINE_EVENTS.map(e => new Vector3(...e.position)),
      new Vector3(0, 0, Z_LIMIT - 100) // Lead out past the last event (using Z_LIMIT)
    ];
    return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  // Generate Spaced Points for consistent density along the curve
  const pathPoints = useMemo(() => {
    return curve.getSpacedPoints(300); // Increased point count for longer path
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // 1. Waypoint Collection Detection (Proximity to planets)
    TIMELINE_EVENTS.forEach((event, index) => {
      if (!visitedInSession.current.has(index)) {
        const dx = xPos - event.position[0];
        const dy = yPos - event.position[1];
        const dz = zPos - event.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Detection radius - fly near the planet to collect
        if (distance < 20) {
          visitedInSession.current.add(index);
          addVisitedWaypoint(index);
          // Dispatch event for notification
          window.dispatchEvent(new CustomEvent('waypointCollected', { 
            detail: { 
              waypoint: index + 1, 
              total: TIMELINE_EVENTS.length,
              title: event.title 
            } 
          }));
        }
      }
    });

    // 2. Active Event Logic (for info display)
    let nearestId = null;
    let minDistance = 30; 
    for (const event of TIMELINE_EVENTS) {
       const distZ = Math.abs(zPos - event.position[2]);
       if (distZ < minDistance) nearestId = event.id;
    }
    if (nearestId !== activeEventIdRef.current) {
      activeEventIdRef.current = nearestId;
      setActiveEventId(nearestId);
    }

    // 2. Waypoint Pulsing Animation
    if (meshRef.current && meshRef.current.instanceMatrix) {
        pathPoints.forEach((pos, i) => {
            tempObj.position.copy(pos);
            const wave = Math.sin(t * 3 + i * 0.1);
            const scale = 0.4 + (wave * 0.15);
            tempObj.scale.setScalar(scale);
            tempObj.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObj.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Events */}
      {TIMELINE_EVENTS.map((event) => {
        const isActive = Math.abs(zPos - event.position[2]) < 30;
        return <EventPlanet key={event.id} event={event} isActive={isActive} />;
      })}

      {/* Waypoint Dots */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, pathPoints.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial 
          color={COLORS.warm} 
          transparent 
          opacity={0.8}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
};
