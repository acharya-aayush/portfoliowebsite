import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, PointLight, Color, InstancedMesh, Object3D, AdditiveBlending } from 'three';
import { useJourneyStore } from '@/lib/journey/store';

interface EnemyShipProps {
  enemyId: number;
  position: Vector3;
  active: boolean;
  onDestroy: (id: number) => void;
  onDamagePlayer: () => void;
  playerLasers?: { position: Vector3; active: boolean }[];
  isLargeCruiser?: boolean;
}

const ENEMY_LASER_COUNT = 20;
const ENEMY_LASER_SPEED = 150;
const ENEMY_LASER_COOLDOWN = 2.5;
const ENEMY_FOLLOW_SPEED = 15;
const ENEMY_KEEP_DISTANCE = 30;
const SMALL_ENEMY_HEALTH = 1;
const LARGE_CRUISER_HEALTH = 15;
const ENEMY_HIT_RADIUS = 3;

export const EnemyShip = ({ enemyId, position, active, onDestroy, onDamagePlayer, playerLasers, isLargeCruiser = false }: EnemyShipProps) => {
  const groupRef = useRef<Group>(null);
  const health = useRef(isLargeCruiser ? LARGE_CRUISER_HEALTH : SMALL_ENEMY_HEALTH);
  const lastShotTime = useRef(0);
  const targetPosition = useRef(new Vector3());
  const hitLasers = useRef<Set<number>>(new Set()); // Track which lasers already hit this enemy
  const explosionPlayed = useRef(false);
  
  // Explosion particles
  const particleMeshRef = useRef<InstancedMesh>(null);
  const particles = useRef<{ position: Vector3; velocity: Vector3; life: number; maxLife: number; color: Color; scale: number }[]>([]);
  
  const shipPos = useJourneyStore((state) => new Vector3(state.xPos, state.yPos, state.zPos));
  
  // Enemy laser system
  const laserMeshRef = useRef<InstancedMesh>(null);
  const lasers = useRef<{ position: Vector3; velocity: Vector3; active: boolean; life: number }[]>([]);
  const tempObj = useRef(new Object3D());

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
    
    // Initialize explosion particles
    for (let i = 0; i < 100; i++) {
      particles.current.push({
        position: new Vector3(),
        velocity: new Vector3(),
        life: 0,
        maxLife: 1,
        color: new Color('#ff0000'),
        scale: 1
      });
    }
  }, []);
  
  const spawnExplosion = (pos: Vector3) => {
    let spawned = 0;
    const count = isLargeCruiser ? 60 : 30;
    for (let i = 0; i < particles.current.length; i++) {
      if (spawned >= count) break;
      const p = particles.current[i];
      if (p.life <= 0) {
        p.life = 1.0;
        p.maxLife = 0.5 + Math.random() * 0.8;
        p.position.copy(pos);
        const speed = 10 + Math.random() * 30;
        p.velocity.set(
          (Math.random()-0.5),
          (Math.random()-0.5),
          (Math.random()-0.5)
        ).normalize().multiplyScalar(speed);
        p.scale = 0.5 + Math.random() * 1.5;
        const r = Math.random();
        if (r > 0.8) p.color.set('#ffffff');
        else if (r > 0.5) p.color.set('#f4cf47');
        else if (r > 0.2) p.color.set('#ef4444');
        else p.color.set('#333333');
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
      
      // Play enemy laser sound
      const laserSound = new Audio('/journey/laser.mp3');
      laserSound.volume = 0.15; // Quieter than player laser
      laserSound.play().catch(() => {});
    }
  };

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Calculate direction to player
    targetPosition.current.copy(shipPos).sub(position);
    const distanceToPlayer = targetPosition.current.length();
    
    // Performance optimization: Skip distant enemies
    if (distanceToPlayer > 200) {
      return; // Don't update enemies too far away
    }

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
    
    // Rotate to face player
    groupRef.current.lookAt(shipPos);

    // Check collision with player lasers
    if (playerLasers) {
      playerLasers.forEach((laser, index) => {
        if (laser.active && !hitLasers.current.has(index)) {
          const dist = laser.position.distanceTo(position);
          if (dist < ENEMY_HIT_RADIUS) {
            health.current -= 1;
            hitLasers.current.add(index);
            
            // Play laser hit sound
            const hitSound = new Audio('/journey/laser.mp3');
            hitSound.volume = 0.4;
            hitSound.play().catch(() => {});
            
            // Spawn small hit particles
            const hitParticles = 5;
            let spawned = 0;
            for (let i = 0; i < particles.current.length; i++) {
              if (spawned >= hitParticles) break;
              const p = particles.current[i];
              if (p.life <= 0) {
                p.life = 1.0;
                p.maxLife = 0.3;
                p.position.copy(position);
                const speed = 5 + Math.random() * 10;
                p.velocity.set(
                  (Math.random()-0.5),
                  (Math.random()-0.5),
                  (Math.random()-0.5)
                ).normalize().multiplyScalar(speed);
                p.scale = 0.3;
                p.color.set('#ffaa00');
                spawned++;
              }
            }
            
            if (health.current <= 0 && !explosionPlayed.current) {
              explosionPlayed.current = true;
              
              // Play explosion sound
              const explosionSound = new Audio(isLargeCruiser ? '/journey/starcruiserexplosion.mp3' : '/journey/explosion.mp3');
              explosionSound.volume = 0.5;
              explosionSound.play().catch(() => {});
              
              // Create explosion effect
              spawnExplosion(position);
              
              setTimeout(() => onDestroy(enemyId), 100);
            }
          }
        }
      });
    }

    // Update explosion particles
    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      if (p.life > 0) {
        p.life -= delta;
        p.position.add(p.velocity.clone().multiplyScalar(delta));
        const lifeRatio = p.life / p.maxLife;
        const scale = p.scale * lifeRatio;
        tempObj.current.position.copy(p.position);
        tempObj.current.scale.set(scale, scale, scale);
        tempObj.current.updateMatrix();
        particleMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
      } else {
        tempObj.current.position.set(0, -10000, 0);
        tempObj.current.scale.set(0, 0, 0);
        tempObj.current.updateMatrix();
        particleMeshRef.current?.setMatrixAt(i, tempObj.current.matrix);
      }
    }
    if (particleMeshRef.current?.instanceMatrix) {
      particleMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Shoot at player
    if (time - lastShotTime.current > ENEMY_LASER_COOLDOWN && distanceToPlayer < 100) {
      const shootDirection = targetPosition.current.clone().normalize();
      spawnEnemyLaser(position.clone(), shootDirection);
      lastShotTime.current = time;
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

  return (
    <>
      <group ref={groupRef} position={position}>
        {/* Enemy Ship Body - Red/Dark theme */}
        <mesh>
          <boxGeometry args={[2, 1, 3]} />
          <meshStandardMaterial color="#660000" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Wings */}
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[6, 0.2, 1.5]} />
          <meshStandardMaterial color="#440000" metalness={0.7} roughness={0.4} />
        </mesh>
        
        {/* Cockpit */}
        <mesh position={[0, 0.3, 0.5]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#220000" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Engine Thrusters - Red glow */}
        <group position={[-1.5, 0, -1.5]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <pointLight color="#ff0000" intensity={2} distance={5} decay={2} />
        </group>
        
        <group position={[1.5, 0, -1.5]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <pointLight color="#ff0000" intensity={2} distance={5} decay={2} />
        </group>
      </group>

      {/* Enemy Lasers - Red */}
      <instancedMesh ref={laserMeshRef} args={[undefined, undefined, ENEMY_LASER_COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff0044" toneMapped={false} />
      </instancedMesh>
      
      {/* Explosion particles */}
      <instancedMesh ref={particleMeshRef} args={[undefined, undefined, 100]} frustumCulled={false}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.8} blending={AdditiveBlending} />
      </instancedMesh>
    </>
  );
};
