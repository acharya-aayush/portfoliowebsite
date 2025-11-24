import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, PointLight, Color, InstancedMesh, Object3D, AdditiveBlending, BoxGeometry, SphereGeometry, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import * as THREE from 'three';
import { useGLTF, Clone } from '@react-three/drei';
import { useJourneyStore } from '@/lib/journey/store';
import { AudioPool } from '@/lib/journey/AudioPool';

// Preload enemy ship models
useGLTF.preload('/model/large-spaceship.glb');
useGLTF.preload('/model/Spaceship1.glb');

// Cache for processed model clones (one per type)
let largeShipClone: THREE.Group | null = null;
let regularShipClone: THREE.Group | null = null;

// Shared geometries cache - created once and reused
let sharedGeometries: {
  shipBody: BoxGeometry;
  shipWings: BoxGeometry;
  shipCockpit: SphereGeometry;
  shipEngine: SphereGeometry;
  laserBox: BoxGeometry;
  particleSphere: SphereGeometry;
} | null = null;

let sharedMaterials: {
  shipBody: MeshStandardMaterial;
  shipWings: MeshStandardMaterial;
  shipCockpit: MeshStandardMaterial;
  shipEngine: MeshBasicMaterial;
  laser: MeshBasicMaterial;
  particle: MeshBasicMaterial;
} | null = null;

const getSharedGeometries = () => {
  if (!sharedGeometries) {
    sharedGeometries = {
      shipBody: new BoxGeometry(2, 1, 3),
      shipWings: new BoxGeometry(6, 0.2, 1.5),
      shipCockpit: new SphereGeometry(0.6, 8, 8),
      shipEngine: new SphereGeometry(0.3, 6, 6),
      laserBox: new BoxGeometry(1, 1, 1),
      particleSphere: new SphereGeometry(0.5, 6, 6),
    };
  }
  return sharedGeometries;
};

const getSharedMaterials = () => {
  if (!sharedMaterials) {
    sharedMaterials = {
      shipBody: new MeshStandardMaterial({ color: '#660000', metalness: 0.8, roughness: 0.3 }),
      shipWings: new MeshStandardMaterial({ color: '#440000', metalness: 0.7, roughness: 0.4 }),
      shipCockpit: new MeshStandardMaterial({ color: '#220000', metalness: 0.9, roughness: 0.1 }),
      shipEngine: new MeshBasicMaterial({ color: '#ff0000' }),
      laser: new MeshBasicMaterial({ color: '#ff0044', toneMapped: false }),
      particle: new MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.8, blending: AdditiveBlending }),
    };
  }
  return sharedMaterials;
};

interface EnemyShipProps {
  enemyId: number;
  position: Vector3;
  active: boolean;
  onDestroy: (id: number) => void;
  onDamagePlayer: () => void;
  playerLasers?: { position: Vector3; active: boolean }[];
  isLargeCruiser?: boolean;
  isTutorial?: boolean;
  canShootInTutorial?: boolean;
}

const ENEMY_LASER_COUNT = 12; // Optimized from 15 for better performance
const ENEMY_LASER_SPEED = 150;
const ENEMY_LASER_COOLDOWN = 2.5;
const ENEMY_FOLLOW_SPEED = 15;
const ENEMY_KEEP_DISTANCE = 30;
const SMALL_ENEMY_HEALTH = 1;
const LARGE_CRUISER_HEALTH = 15;
const ENEMY_HIT_RADIUS = 3;

export const EnemyShip = ({ enemyId, position, active, onDestroy, onDamagePlayer, playerLasers, isLargeCruiser = false, isTutorial = false, canShootInTutorial = false }: EnemyShipProps) => {
  const groupRef = useRef<Group>(null);
  const health = useRef(isLargeCruiser ? LARGE_CRUISER_HEALTH : SMALL_ENEMY_HEALTH);
  const lastShotTime = useRef(0);
  const spawnTime = useRef(Date.now() / 1000);
  const canShoot = useRef(false);
  const targetPosition = useRef(new Vector3());
  const hitLasers = useRef<Set<number>>(new Set()); // Track which lasers already hit this enemy
  const explosionPlayed = useRef(false);
  const wasActive = useRef(active); // Track previous active state
  
  // Explosion particles
  const particleMeshRef = useRef<InstancedMesh>(null);
  const particles = useRef<{ position: Vector3; velocity: Vector3; life: number; maxLife: number; color: Color; scale: number }[]>([]);
  
  const shipPos = useJourneyStore((state) => new Vector3(state.xPos, state.yPos, state.zPos));
  
  // Enemy laser system
  const laserMeshRef = useRef<InstancedMesh>(null);
  const lasers = useRef<{ position: Vector3; velocity: Vector3; active: boolean; life: number }[]>([]);
  const tempObj = useRef(new Object3D());
  
  // Reset enemy state when reactivated from pool
  useEffect(() => {
    if (active && !wasActive.current) {
      // Enemy is being reactivated from pool
      health.current = isLargeCruiser ? LARGE_CRUISER_HEALTH : SMALL_ENEMY_HEALTH;
      lastShotTime.current = 0;
      spawnTime.current = Date.now() / 1000;
      canShoot.current = false;
      hitLasers.current.clear();
      explosionPlayed.current = false;
      
      // Clear all lasers
      lasers.current.forEach(laser => {
        laser.active = false;
        laser.life = 0;
      });
      
      // Clear all particles
      particles.current.forEach(p => {
        p.life = 0;
      });
    }
    wasActive.current = active;
  }, [active, isLargeCruiser]);

  useEffect(() => {
    // Initialize enemy lasers
    for (let i = 0; i < ENEMY_LASER_COUNT; i++) {
      lasers.current.push({ 
        position: new Vector3(), 
        velocity: new Vector3(), 
        active: false, 
        life: 0 
      });
    }
    
    // Initialize explosion particles (heavily optimized for no-lag destruction)
    const particleCount = isLargeCruiser ? 30 : 20; // Further reduced for performance
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        position: new Vector3(),
        velocity: new Vector3(),
        life: 0,
        maxLife: 1,
        color: new Color('#ff0000'),
        scale: 1
      });
    }
  }, [isLargeCruiser]);
  
  const spawnExplosion = (pos: Vector3) => {
    // Optimized: spawn fewer particles, simpler calculations
    const count = isLargeCruiser ? 15 : 10; // Heavily reduced for no-lag
    let spawned = 0;
    
    for (let i = 0; i < particles.current.length && spawned < count; i++) {
      const p = particles.current[i];
      if (p.life <= 0) {
        p.life = 1.0;
        p.maxLife = 0.6;
        p.position.copy(pos);
        // Simpler, faster velocity calculation
        const angle = (spawned / count) * Math.PI * 2;
        const speed = 15 + Math.random() * 15;
        p.velocity.set(
          Math.cos(angle) * speed,
          (Math.random() - 0.5) * speed,
          Math.sin(angle) * speed
        );
        p.scale = 0.8 + Math.random();
        // Simplified color selection
        p.color.set(spawned % 3 === 0 ? '#ffffff' : spawned % 2 === 0 ? '#f4cf47' : '#ef4444');
        spawned++;
      }
    }
  };

  const spawnEnemyLaser = (pos: Vector3, direction: Vector3) => {
    const laser = lasers.current.find(l => !l.active);
    if (laser) {
      laser.active = true;
      laser.position.copy(pos);
      laser.velocity.copy(direction.normalize().multiplyScalar(ENEMY_LASER_SPEED));
      laser.life = 3.0;
      
      // Play enemy laser sound using audio pool
      AudioPool.play('/journey/laser.mp3', 0.15);
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const currentTime = Date.now() / 1000;
    
    // If not active, skip all behavior (shooting, movement, collision detection)
    // Enemy is visible but dormant - just update existing particles/lasers for cleanup
    if (!active) {
      // Clean up any existing particles
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.life > 0) {
          p.life -= delta;
          if (p.life <= 0) {
            tempObj.current.position.set(0, -10000, 0);
            tempObj.current.scale.set(0, 0, 0);
            tempObj.current.updateMatrix();
            particleMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
          }
        }
      }
      if (particleMeshRef.current?.instanceMatrix) {
        particleMeshRef.current.instanceMatrix.needsUpdate = true;
      }
      
      // Clean up any existing lasers
      for (let i = 0; i < lasers.current.length; i++) {
        const laser = lasers.current[i];
        if (laser.active) {
          laser.life -= delta;
          if (laser.life <= 0) {
            laser.active = false;
            tempObj.current.position.set(0, -10000, 0);
            tempObj.current.scale.set(0, 0, 0);
            tempObj.current.updateMatrix();
            laserMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
          }
        }
      }
      if (laserMeshRef.current?.instanceMatrix) {
        laserMeshRef.current.instanceMatrix.needsUpdate = true;
      }
      
      return; // Skip all active behavior
    }
    
    // Enable shooting after 2 second delay
    if (!canShoot.current && currentTime - spawnTime.current > 2.0) {
      canShoot.current = true;
    }

    // Calculate direction to player
    targetPosition.current.copy(shipPos).sub(position);
    const distanceToPlayer = targetPosition.current.length();
    
    // Performance optimization: Skip very distant enemies
    if (distanceToPlayer > 250) {
      return; // Don't update enemies too far away
    }
    
    // Use LOD - simpler updates for distant enemies
    const isDistant = distanceToPlayer > 100;

    // AI Follow behavior - maintain distance
    if (distanceToPlayer > ENEMY_KEEP_DISTANCE) {
      const moveDirection = targetPosition.current.clone().normalize().multiplyScalar(ENEMY_FOLLOW_SPEED * delta);
      position.add(moveDirection);
    } else if (distanceToPlayer < ENEMY_KEEP_DISTANCE - 10) {
      const moveDirection = targetPosition.current.clone().normalize().multiplyScalar(-ENEMY_FOLLOW_SPEED * delta * 0.5);
      position.add(moveDirection);
    }

    // Update enemy ship position
    groupRef.current.position.copy(position);
    
    // Rotate to face player (skip for distant enemies to save performance)
    if (!isDistant) {
      groupRef.current.lookAt(shipPos);
    }

    // Check collision with player lasers
    if (playerLasers) {
      playerLasers.forEach((laser, index) => {
        if (laser.active && !hitLasers.current.has(index)) {
          const dist = laser.position.distanceTo(position);
          if (dist < ENEMY_HIT_RADIUS) {
            health.current -= 1;
            hitLasers.current.add(index);
            
            // Play laser hit sound using audio pool
            AudioPool.play('/journey/laser.mp3', 0.4);
            
            // Spawn small hit particles (minimal for performance)
            const hitParticles = 2; // Further reduced
            let spawned = 0;
            for (let i = 0; i < particles.current.length && spawned < hitParticles; i++) {
              const p = particles.current[i];
              if (p.life <= 0) {
                p.life = 1.0;
                p.maxLife = 0.25;
                p.position.copy(position);
                const speed = 8;
                p.velocity.set(
                  (Math.random()-0.5) * speed,
                  (Math.random()-0.5) * speed,
                  (Math.random()-0.5) * speed
                );
                p.scale = 0.3;
                p.color.set('#ffaa00');
                spawned++;
              }
            }
            
            if (health.current <= 0 && !explosionPlayed.current) {
              explosionPlayed.current = true;
              
              // Play explosion sound using audio pool
              AudioPool.play(
                isLargeCruiser ? '/journey/starcruiserexplosion.mp3' : '/journey/explosion.mp3',
                0.5
              );
              
              // Create explosion effect
              spawnExplosion(position);
              
              // Instant cleanup - no setTimeout delay to prevent lag
              onDestroy(enemyId);
            }
          }
        }
      });
    }

    // Update explosion particles (skip for very distant enemies)
    // Optimized: batch updates and skip unnecessary operations
    if (!isDistant || distanceToPlayer < 150) {
      let needsUpdate = false;
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.life > 0) {
          p.life -= delta;
          if (p.life > 0) {
            p.position.add(p.velocity.clone().multiplyScalar(delta));
            const lifeRatio = p.life / p.maxLife;
            const scale = p.scale * lifeRatio;
            tempObj.current.position.copy(p.position);
            tempObj.current.scale.set(scale, scale, scale);
            tempObj.current.updateMatrix();
            particleMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
            needsUpdate = true;
          } else {
            // Dead particle - hide it
            tempObj.current.position.set(0, -10000, 0);
            tempObj.current.scale.set(0, 0, 0);
            tempObj.current.updateMatrix();
            particleMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
            needsUpdate = true;
          }
        }
      }
      // Batch update: only set needsUpdate once if any particle changed
      if (needsUpdate && particleMeshRef.current?.instanceMatrix) {
        particleMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // Shoot at player (only after 2s delay, skip for distant enemies)
    // Don't shoot in tutorial mode unless explicitly allowed
    if ((!isTutorial || canShootInTutorial) && !isDistant) {
      if (canShoot.current && time - lastShotTime.current > ENEMY_LASER_COOLDOWN && distanceToPlayer < 100) {
        const shootDirection = targetPosition.current.clone().normalize();
        spawnEnemyLaser(position.clone(), shootDirection);
        lastShotTime.current = time;
      }
    }

    // Update enemy lasers
    if (!tempObj.current) tempObj.current = new Object3D();
    
    for (let i = 0; i < lasers.current.length; i++) {
      const laser = lasers.current[i];
      if (laser.active) {
        laser.life -= delta;
        if (laser.life <= 0) {
          laser.active = false;
        } else {
          laser.position.add(laser.velocity.clone().multiplyScalar(delta));
          
          // Check collision with player
          const distToPlayer = laser.position.distanceTo(shipPos);
          if (distToPlayer < 3) {
            laser.active = false;
            onDamagePlayer();
          }

          tempObj.current.position.copy(laser.position);
          tempObj.current.scale.set(0.4, 0.4, 3);
          tempObj.current.lookAt(laser.position.clone().add(laser.velocity));
          tempObj.current.updateMatrix();
          laserMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
        }
      } else {
        tempObj.current.position.set(0, -10000, 0);
        tempObj.current.scale.set(0, 0, 0);
        tempObj.current.updateMatrix();
        laserMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
      }
    }
    
    if (laserMeshRef.current?.instanceMatrix) {
      laserMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Get shared geometries for lasers and particles
  const geometries = getSharedGeometries();
  const materials = getSharedMaterials();
  
  // Don't render inactive pooled enemies
  if (!active) {
    return null;
  }
  
  // Scale multiplier for large cruisers
  const scale = isLargeCruiser ? 3.5 : 1.2;

  // Select the correct model path
  const modelPath = isLargeCruiser ? '/model/large-spaceship.glb' : '/model/Spaceship1.glb';
  const enemyColor = isLargeCruiser ? '#880000' : '#660000';
  
  // Get preloaded models from cache
  const largeShipModel = useGLTF('/model/large-spaceship.glb');
  const regularShipModel = useGLTF('/model/Spaceship1.glb');
  
  // Correct rotations: regular ships face forward, large cruiser rotated 90 degrees
  const rotation: [number, number, number] = isLargeCruiser ? [0, Math.PI / 2, 0] : [0, 0, 0];

  return (
    <>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Enemy Ship Model - Using Clone for efficient instancing */}
        <Clone 
          object={isLargeCruiser ? largeShipModel.scene : regularShipModel.scene}
          rotation={rotation}
          inject={<meshStandardMaterial color={enemyColor} metalness={0.8} roughness={0.3} />}
        />
        
        {/* Engine lights */}
        <pointLight 
          position={[-1, 0, -2]} 
          color="#ff0000" 
          intensity={isLargeCruiser ? 8 : 4} 
          distance={isLargeCruiser ? 15 : 8} 
          decay={2} 
        />
        <pointLight 
          position={[1, 0, -2]} 
          color="#ff0000" 
          intensity={isLargeCruiser ? 8 : 4} 
          distance={isLargeCruiser ? 15 : 8} 
          decay={2} 
        />
        
        {/* Large Cruiser Badge - Only for Battlecruiser MK-IV */}
        {isLargeCruiser && (
          <>
            <mesh position={[0, 2, 0]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>
            <pointLight position={[0, 2, 0]} color="#ffaa00" intensity={6} distance={12} decay={2} />
          </>
        )}
      </group>

      {/* Enemy Lasers - Red - Using shared geometry */}
      <instancedMesh ref={laserMeshRef} args={[geometries.laserBox, materials.laser, ENEMY_LASER_COUNT]} frustumCulled={false} />
      
      {/* Explosion particles - Using shared geometry */}
      <instancedMesh ref={particleMeshRef} args={[geometries.particleSphere, materials.particle, isLargeCruiser ? 50 : 40]} frustumCulled={false} />
    </>
  );
};
