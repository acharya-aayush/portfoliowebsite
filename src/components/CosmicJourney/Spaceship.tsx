
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, PointLight, MathUtils, InstancedMesh, Object3D, Color, AdditiveBlending } from 'three';
import { useJourneyStore as useStore } from '@/lib/journey/store';
import { Z_LIMIT } from '@/lib/journey/constants';
import { audioManager } from '@/lib/journey/AudioManager';
import { XWingModel } from './XWingModel';
import RaptorModel from './RaptorModel';
import CruiserModel from './CruiserModel';
import StarfighterGLBModel from './StarfighterGLBModel';
import XWingGLBModel from './XWingGLBModel';
import Spaceship1Model from './Spaceship1Model';
import { SHIP_MODELS } from '@/lib/journey/ships';

// --- CONSTANTS & LIMITS ---
const LASER_COUNT = 100;
const ASTEROID_COUNT = 400; // Increased density
const PARTICLE_COUNT = 1200; // Optimized for performance
const TRAIL_COUNT = 1800; // Optimized for performance   

const LASER_SPEED = 250; 
const LASER_COOLDOWN = 0.12; 

// Box dimensions for infinite asteroid field relative to ship
const WRAP_X = 400; // Width +/- 400
const WRAP_Y = 200; // Height +/- 200
const WRAP_Z = 500; // Depth +/- 500

// --- HELPER COMPONENTS ---

const EngineGlow = ({ active, boosting }: { active: boolean, boosting: boolean }) => {
  const lightRef = useRef<PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      const baseIntensity = boosting ? 3 : (active ? 1.5 : 0.5);
      const flicker = Math.sin(t * 30) * 0.2 + Math.cos(t * 50) * 0.1;
      lightRef.current.intensity = baseIntensity + flicker;
      lightRef.current.color.set(boosting ? '#f4cf47' : '#00aaff'); 
    }
  });

  return (
    <pointLight ref={lightRef} distance={5} decay={2} />
  );
};

// --- MANDALORIAN N-1 STYLE MODEL ---
const StarfighterModel = ({ active, boosting, warningActive }: { active: boolean, boosting: boolean, warningActive: boolean }) => {
  const chromeMaterial = <meshStandardMaterial color="#e2e8f0" metalness={1.0} roughness={0.15} envMapIntensity={1.5} />;
  const goldMaterial = <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} envMapIntensity={1.2} />;
  const glassMaterial = <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.05} envMapIntensity={2} />;
  const warningLightRef = useRef<PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (warningLightRef.current) {
        if (warningActive) {
            // Flashing red alarm
            warningLightRef.current.intensity = Math.sin(t * 15) > 0 ? 2 : 0;
            warningLightRef.current.color.set('#ff0000');
        } else {
            warningLightRef.current.intensity = 0;
        }
    }
  });
  
  return (
    <group rotation={[0, Math.PI, 0]} scale={[0.8, 0.8, 0.8]}>
       {/* Cockpit Warning Light */}
       <pointLight ref={warningLightRef} position={[0, 0.5, -0.8]} distance={3} decay={2} />

       {/* --- Main Fuselage --- */}
       <mesh position={[0, 0, -3.5]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.6, 3, 32]} />
          {goldMaterial}
       </mesh>
       <mesh position={[0, 0, -0.5]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.5, 3, 32]} />
          {chromeMaterial}
       </mesh>
       <mesh position={[0, 0, 4]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.1, 6, 32]} />
          {chromeMaterial}
       </mesh>

       {/* --- Cockpit --- */}
       <mesh position={[0, 0.3, -0.8]}>
          <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          {glassMaterial}
       </mesh>

       {/* --- Engines --- */}
       {/* Left Engine */}
       <group position={[-2.5, 0, -1]}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
              {chromeMaterial}
          </mesh>
          <mesh position={[0, 0, -2.1]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.3, 0.08, 16, 32]} />
              {goldMaterial}
          </mesh>
          <mesh position={[0, 0, 2.1]}>
               <sphereGeometry args={[0.35, 16, 16]} />
               <meshBasicMaterial color={boosting ? "#f4cf47" : "#00ffff"} />
               <EngineGlow active={active} boosting={boosting} />
          </mesh>
          <mesh position={[0, 0, 3.5]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[0.35, 0.05, 3, 16]} />
             {chromeMaterial}
          </mesh>
       </group>

       {/* Right Engine */}
       <group position={[2.5, 0, -1]}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 4, 32]} />
              {chromeMaterial}
          </mesh>
          <mesh position={[0, 0, -2.1]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.3, 0.08, 16, 32]} />
              {goldMaterial}
          </mesh>
          <mesh position={[0, 0, 2.1]}>
               <sphereGeometry args={[0.35, 16, 16]} />
               <meshBasicMaterial color={boosting ? "#f4cf47" : "#00ffff"} />
               <EngineGlow active={active} boosting={boosting} />
          </mesh>
          <mesh position={[0, 0, 3.5]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[0.35, 0.05, 3, 16]} />
             {chromeMaterial}
          </mesh>
       </group>

       {/* --- Wings --- */}
       <mesh position={[0, -0.1, -1]}>
          <boxGeometry args={[5, 0.15, 1]} />
          {chromeMaterial}
       </mesh>
    </group>
  );
};

export const Spaceship: React.FC = () => {
  const shipRef = useRef<Group>(null);
  const { camera } = useThree();
  
  const gameStarted = useStore((state) => state.gameStarted);
  const setVelocity = useStore((state) => state.setVelocity);
  const setZPos = useStore((state) => state.setZPos);
  const setXPos = useStore((state) => state.setXPos);
  const setYPos = useStore((state) => state.setYPos);
  const selectedShip = useStore((state) => state.selectedShip);

  const currentShipData = SHIP_MODELS.find(s => s.id === selectedShip) || SHIP_MODELS[0];

  // Physics state
  const shipPos = useRef(new Vector3(0, 0, 0));
  const shipRot = useRef(new Vector3(0, 0, 0)); // X=Pitch, Y=Yaw, Z=Roll
  
  // Local velocity: X (Strafe), Y (Elevation), Z (Forward/Back)
  const localVelocity = useRef(new Vector3(0, 0, 0));

  // Controls state
  const keys = useRef<{ [key: string]: boolean }>({});
  const mouseDown = useRef(false);
  const lastShotTime = useRef(0);
  const isBoosting = useRef(false);
  const cameraShake = useRef(0);
  
  // Warning System State
  const warningActive = useRef(false);
  const lastWarningTime = useRef(0);
  
  // Health & Damage System
  const takeDamage = useStore((state) => state.takeDamage);
  const health = useStore((state) => state.health);
  const damageFlash = useStore((state) => state.damageFlash);
  const setDamageFlash = useStore((state) => state.setDamageFlash);
  const incrementAsteroids = useStore((state) => state.incrementAsteroids);
  const setPlayerLasers = useStore((state) => state.setPlayerLasers);
  const lastDamageTime = useRef(0);
  const INVINCIBILITY_DURATION = 2.0; // 2 seconds of invincibility after taking damage
  const shipExploded = useRef(false);
  
  // Weapon System State (for cruiser)
  const lastMissileFire = useRef(0);
  const lastRailgunFire = useRef(0);
  const lastEMPFire = useRef(0);
  const MISSILE_COOLDOWN = 5.0;
  const RAILGUN_COOLDOWN = 8.0;
  const EMP_COOLDOWN = 15.0;

  // --- INSTANCING REFS ---
  const laserMeshRef = useRef<InstancedMesh>(null);
  
  // Split asteroids into 3 groups for visual variety
  const asteroidRef1 = useRef<InstancedMesh>(null); // Dodecahedron
  const asteroidRef2 = useRef<InstancedMesh>(null); // Icosahedron
  const asteroidRef3 = useRef<InstancedMesh>(null); // Icosahedron Low Poly

  const particleMeshRef = useRef<InstancedMesh>(null); 
  const trailMeshRef = useRef<InstancedMesh>(null);    

  // --- DATA ARRAYS ---
  const lasers = useRef<{ position: Vector3; velocity: Vector3; active: boolean; life: number }[]>([]);
  const asteroids = useRef<{ position: Vector3; scale: Vector3; rotation: Vector3; rotSpeed: Vector3; active: boolean }[]>([]);
  const particles = useRef<{ position: Vector3; velocity: Vector3; life: number; maxLife: number; color: Color; scale: number }[]>([]);
  const trails = useRef<{ position: Vector3; life: number; maxLife: number; active: boolean; color: Color; initialScale: number }[]>([]);
  
  const tempObj = useMemo(() => new Object3D(), []);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Initialize camera position to prevent flickering on start
    const initialCamPos = new Vector3(0, 6, 18);
    camera.position.copy(initialCamPos);
    camera.lookAt(new Vector3(0, 0, -40));
    
    // Init Lasers
    for (let i = 0; i < LASER_COUNT; i++) {
      lasers.current.push({ position: new Vector3(), velocity: new Vector3(), active: false, life: 0 });
    }
    // Init Asteroids
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      // Irregular "potato" scaling
      const scaleBase = 1.5 + Math.random() * 2.0;
      const scale = new Vector3(
          scaleBase * (0.5 + Math.random() * 0.8),
          scaleBase * (0.5 + Math.random() * 0.8),
          scaleBase * (0.5 + Math.random() * 0.8)
      );

      // Spread asteroids initially in the wrap volume
      asteroids.current.push({
        position: new Vector3(
            (Math.random() - 0.5) * (WRAP_X * 2), 
            (Math.random() - 0.5) * (WRAP_Y * 2), 
            (Math.random() - 0.5) * (WRAP_Z * 2)
        ),
        scale: scale,
        rotation: new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        // VERY slow rotation
        rotSpeed: new Vector3(
            (Math.random()-0.5) * 0.02, 
            (Math.random()-0.5) * 0.02, 
            (Math.random()-0.5) * 0.02
        ),
        active: true
      });
    }
    // Init Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.current.push({ position: new Vector3(), velocity: new Vector3(), life: 0, maxLife: 1, color: new Color(), scale: 0 });
    }
    // Init Trails
    for (let i = 0; i < TRAIL_COUNT; i++) {
        trails.current.push({ position: new Vector3(), life: 0, maxLife: 0.5, active: false, color: new Color(), initialScale: 0.4 });
    }

    const handleKeyDown = (e: KeyboardEvent) => { 
        // Only capture input and prevent scrolling if the game is running
        // Access the boolean from the store directly or via the prop passed down (though here we use store ref which is outside)
        // For safety, we check useStore.getState().gameStarted if we were outside react, but here we can just check the keys logic
        
        // We can't easily access state inside event listener without ref, so we'll just prevent default for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault(); 
        }
        
        keys.current[e.code] = true; 
    };
    
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    const handleMouseDown = () => { mouseDown.current = true; };
    const handleMouseUp = () => { mouseDown.current = false; };
    
    // Attach to window so we don't lose focus, but in a real integration consider attaching to canvas
    // For now, window is safest for a game feel.
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [camera]);

  // --- SPAWNERS ---
  const spawnLaser = (position: Vector3, rotationY: number) => {
    // Cruiser fires 4 lasers in a burst pattern
    if (selectedShip === 'cruiser') {
      const laserOffsets = [
        { x: -2.5, y: -0.3 },  // Left outer
        { x: -1.0, y: -0.2 },  // Left inner
        { x: 1.0, y: -0.2 },   // Right inner
        { x: 2.5, y: -0.3 }    // Right outer
      ];
      
      laserOffsets.forEach((offset, idx) => {
        const laser = lasers.current.find(l => !l.active) || lasers.current[idx];
        if (laser) {
          laser.active = true;
          laser.position.copy(position);
          
          const offsetVec = new Vector3(offset.x, offset.y, -4.0).applyAxisAngle(new Vector3(0,1,0), rotationY);
          laser.position.add(offsetVec);

          const vel = new Vector3(0, 0, -LASER_SPEED).applyAxisAngle(new Vector3(0,1,0), rotationY);
          laser.velocity.copy(vel);

          laser.life = 2.0;
        }
      });
      audioManager.playLaser();
    } else {
      // Standard single laser for other ships
      const laser = lasers.current.find(l => !l.active) || lasers.current[0];
      laser.active = true;
      laser.position.copy(position);
      
      const offsetLoc = Math.random() > 0.5 ? 0.6 : -0.6;
      const offsetVec = new Vector3(offsetLoc, -0.2, -3.5).applyAxisAngle(new Vector3(0,1,0), rotationY);
      laser.position.add(offsetVec);

      const vel = new Vector3(0, 0, -LASER_SPEED).applyAxisAngle(new Vector3(0,1,0), rotationY);
      laser.velocity.copy(vel);

      laser.life = 2.0;
      audioManager.playLaser();
    }
  };

  const spawnExplosion = (pos: Vector3) => {
    let spawned = 0;
    const count = 30; 
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

  const spawnShipExplosion = (pos: Vector3) => {
    let spawned = 0;
    const count = 150; // Large explosion for ship death
    for (let i = 0; i < particles.current.length; i++) {
        if (spawned >= count) break;
        const p = particles.current[i];
        if (p.life <= 0) {
            p.life = 1.0; 
            p.maxLife = 1.5 + Math.random() * 1.5; // Longer lasting
            p.position.copy(pos);
            const speed = 15 + Math.random() * 50; // Faster, more dramatic
            p.velocity.set(
                (Math.random()-0.5),
                (Math.random()-0.5),
                (Math.random()-0.5)
            ).normalize().multiplyScalar(speed);
            p.scale = 1.0 + Math.random() * 2.5; // Larger particles
            const r = Math.random();
            if (r > 0.7) p.color.set('#ffffff'); 
            else if (r > 0.4) p.color.set('#ff8800'); // More orange
            else if (r > 0.2) p.color.set('#ff3300'); // Bright red
            else p.color.set('#ffaa00'); // Yellow-orange
            spawned++;
        }
    }
  };

  const spawnBoostParticles = (pos: Vector3, offsetSide: number, rotationY: number) => {
    const count = 2; 
    let spawned = 0;
    for (let i = 0; i < particles.current.length; i++) {
        if (spawned >= count) break;
        const p = particles.current[i];
        if (p.life <= 0) {
            p.life = 1.0;
            p.maxLife = 0.2 + Math.random() * 0.3; 
            
            const offset = new Vector3(offsetSide * 2.5, 0, 3.0); 
            offset.applyAxisAngle(new Vector3(0, 1, 0), rotationY);
            p.position.copy(pos).add(offset);
            
            const speed = 20 + Math.random() * 10;
            const v = new Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                speed 
            );
            v.applyAxisAngle(new Vector3(0, 1, 0), rotationY);
            p.velocity.copy(v);
            
            p.scale = 0.2 + Math.random() * 0.3;
            
            if (Math.random() > 0.4) p.color.set('#f4cf47'); 
            else p.color.set('#ffffff');
            
            spawned++;
        }
    }
  };

  const spawnEngineTrail = (pos: Vector3, offsetX: number, offsetY: number, rotationY: number, isXWing: boolean) => {
      const t = trails.current.find(tr => !tr.active);
      if (t) {
          t.active = true;
          t.life = 0.35;
          t.maxLife = 0.35;
          
          // Position: Align with engine nozzles
          // For N-1: X: +/- 2.5, Y: 0, Z: 1.8
          // For X-Wing: X: +/- 1.3, Y: +/- 0.9, Z: 2.2
          const xPos = isXWing ? offsetX : offsetX * 2.5;
          const zPos = isXWing ? 2.2 : 1.8;
          const offset = new Vector3(xPos, offsetY, zPos).applyAxisAngle(new Vector3(0,1,0), rotationY);
          
          // Add slight jitter for turbulent exhaust look
          const jitter = new Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
          );
          
          t.position.copy(pos).add(offset).add(jitter);
          
          // Color: X-Wing uses blue, N-1 uses gold
          if (isXWing) {
              if (Math.random() > 0.3) {
                  t.color.set('#4488ff'); // Blue
              } else {
                  t.color.set('#88ccff'); // Light blue core
              }
          } else {
              if (Math.random() > 0.3) {
                  t.color.set('#f4cf47'); // Gold
              } else {
                  t.color.set('#ffffff'); // White hot core
              }
          }
          
          // Random starting size for variety
          t.initialScale = 0.4 + Math.random() * 0.3;
      }
  }

  const spawnLaserTrail = (pos: Vector3) => {
    const t = trails.current.find(tr => !tr.active);
    if (t) {
        t.active = true;
        t.life = 0.4;
        t.maxLife = 0.4;
        t.position.copy(pos);
        t.color.set('#ff0044').multiplyScalar(20); 
        t.initialScale = 0.6; 
    }
  };

  // --- MAIN LOOP ---
  useFrame((state, delta) => {
    // Trigger ship explosion when health reaches 0
    if (health <= 0) {
      if (!shipExploded.current) {
        shipExploded.current = true;
        // Create large explosion at ship position
        spawnShipExplosion(shipPos.current);
        // Play ship explosion sound with reduced volume
        const explosionSound = new Audio('/journey/starcruiserexplosion.mp3');
        explosionSound.volume = 0.35;
        explosionSound.play().catch(() => {});
      }
      
      // Continue updating particles for explosion effect with slow-mo
      delta = Math.min(delta, 0.1) * 0.3; // 30% speed for slow-motion effect
      
      // Update particles for explosion
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.life > 0) {
            p.life -= delta;
            p.position.add(p.velocity.clone().multiplyScalar(delta));
            p.velocity.multiplyScalar(0.95); 
            
            // Distance-based culling
            const distSq = p.position.distanceToSquared(shipPos.current);
            if (distSq > 250000) {
                p.life = 0;
                tempObj.position.set(0, -10000, 0);
                tempObj.scale.set(0,0,0);
                tempObj.updateMatrix();
                particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
                continue;
            }
            
            const scale = p.scale * (p.life / p.maxLife);
            tempObj.position.copy(p.position);
            tempObj.scale.setScalar(scale);
            tempObj.lookAt(camera.position);
            tempObj.updateMatrix();
            particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
            particleMeshRef.current!.setColorAt(i, p.color);
        } else {
            tempObj.position.set(0, -10000, 0);
            tempObj.scale.set(0,0,0);
            tempObj.updateMatrix();
            particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
        }
      }
      if (particleMeshRef.current && particleMeshRef.current.instanceMatrix) {
        particleMeshRef.current.instanceMatrix.needsUpdate = true;
        if (particleMeshRef.current.instanceColor) {
            particleMeshRef.current.instanceColor.needsUpdate = true;
        }
      }
      
      // Stop all other updates
      return;
    } else {
      // Reset explosion flag when health is restored
      shipExploded.current = false;
    }

    // Clamp delta to prevent huge jumps on first frame or lag spikes
    delta = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime;

    // --- INPUT PROCESSING ---
    let throttle = 0;
    let strafeX = 0;
    let strafeY = 0;
    let yawInput = 0;
    let isFiring = false;
    let isShift = false;

    if (gameStarted) {
        isShift = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
        throttle = (keys.current['KeyW'] ? 1 : 0) - (keys.current['KeyS'] ? 1 : 0);
        const strafeLeft = keys.current['ArrowLeft'];
        const strafeRight = keys.current['ArrowRight'];
        strafeX = (strafeRight ? 1 : 0) - (strafeLeft ? 1 : 0);
        const upInput = keys.current['Space'] || keys.current['ArrowUp'];
        const downInput = keys.current['KeyC'] || keys.current['ArrowDown'];
        strafeY = (upInput ? 1 : 0) - (downInput ? 1 : 0);
        const turnLeft = keys.current['KeyA'];
        const turnRight = keys.current['KeyD'];
        yawInput = (turnLeft ? 1 : 0) - (turnRight ? 1 : 0);
        isFiring = mouseDown.current || keys.current['KeyF'] || keys.current['Enter'];
    } else {
        // Idle Auto-pilot when menu is open
        // Slow forward drift
        throttle = 0.05; 
        // Gentle swaying
        yawInput = Math.sin(time * 0.5) * 0.1;
        strafeY = Math.cos(time * 0.3) * 0.1;
    }

    isBoosting.current = isShift;

    // --- PHYSICS ---

    // A. ROTATION
    // Apply handling multiplier based on ship (Cruiser turns slower)
    const handlingMultiplier = selectedShip === 'cruiser' ? 0.4 : 1.0;
    const turnSpeed = 2.5 * handlingMultiplier;
    shipRot.current.y += yawInput * turnSpeed * delta;
    
    const bankFromTurn = yawInput * 0.5; 
    const bankFromStrafe = -strafeX * 0.5; 
    const targetRoll = bankFromTurn + bankFromStrafe;
    shipRot.current.z = MathUtils.lerp(shipRot.current.z, targetRoll, delta * 6);

    // Cruiser has much less pitch to avoid awkward angles
    const pitchMultiplier = selectedShip === 'cruiser' ? 0.15 : 0.5;
    const targetPitch = strafeY * pitchMultiplier; 
    shipRot.current.x = MathUtils.lerp(shipRot.current.x, targetPitch, delta * 5); 

    // B. VELOCITY
    // Apply speed multiplier based on ship stats (Cruiser is slower, Raptor keeps 1.5x, others reduced by 25%)
    const speedMultiplier = selectedShip === 'cruiser' ? 0.375 : selectedShip === 'raptor' ? 1.5 : 0.75;
    const maxSpeed = (isShift ? 80 : 40) * speedMultiplier; 
    const friction = 8.0; 

    // Cruiser: 75% slower when elevating (up/down) - much more restricted vertical movement
    const elevationPenalty = selectedShip === 'cruiser' && strafeY !== 0 ? 0.25 : 1.0;

    const targetZ = -throttle * maxSpeed; 
    const targetX = strafeX * (maxSpeed * 0.8);
    const targetY = strafeY * (maxSpeed * 0.8 * elevationPenalty);

    const zFactor = throttle === 0 ? friction : 3;
    const xFactor = strafeX === 0 ? friction : 3;
    const yFactor = strafeY === 0 ? friction : 3;

    localVelocity.current.z = MathUtils.lerp(localVelocity.current.z, targetZ, delta * zFactor);
    localVelocity.current.x = MathUtils.lerp(localVelocity.current.x, targetX, delta * xFactor);
    localVelocity.current.y = MathUtils.lerp(localVelocity.current.y, targetY, delta * yFactor);
    
    if (Math.abs(localVelocity.current.z) < 0.01) localVelocity.current.z = 0;
    if (Math.abs(localVelocity.current.x) < 0.01) localVelocity.current.x = 0;
    if (Math.abs(localVelocity.current.y) < 0.01) localVelocity.current.y = 0;

    // C. POSITION UPDATE
    const forwardDir = new Vector3(0, 0, 1).applyAxisAngle(new Vector3(0,1,0), shipRot.current.y);
    const rightDir = new Vector3(1, 0, 0).applyAxisAngle(new Vector3(0,1,0), shipRot.current.y);
    const upDir = new Vector3(0, 1, 0);

    const moveVec = new Vector3()
        .addScaledVector(forwardDir, localVelocity.current.z)
        .addScaledVector(rightDir, localVelocity.current.x)
        .addScaledVector(upDir, localVelocity.current.y);
    
    // Capture speed based on vector magnitude before scaling with delta
    const currentSpeed = localVelocity.current.length();

    // Apply movement scaled by time delta
    shipPos.current.add(moveVec.multiplyScalar(delta));

    // Bounds
    shipPos.current.x = MathUtils.clamp(shipPos.current.x, -300, 300);
    shipPos.current.y = MathUtils.clamp(shipPos.current.y, -150, 150);
    if (shipPos.current.z > 100) shipPos.current.z = 100;
    if (shipPos.current.z < Z_LIMIT - 100) shipPos.current.z = Z_LIMIT - 100;

    // Update Store (Use currentSpeed which is units/second)
    setVelocity(currentSpeed);
    setZPos(shipPos.current.z);
    setXPos(shipPos.current.x);
    setYPos(shipPos.current.y);
    
    // Update audio only if game is started, else mute engine or keep it very low
    if (gameStarted) {
      audioManager.updateEngine(currentSpeed, isShift);
    } else {
      // Silent or very quiet idle
      audioManager.updateEngine(0, false);
    }

    if (shipRef.current) {
      shipRef.current.position.copy(shipPos.current);
      shipRef.current.rotation.set(shipRot.current.x, shipRot.current.y, shipRot.current.z);
    }

    // --- DAMAGE FLASH ---
    if (damageFlash > 0) {
      setDamageFlash(MathUtils.lerp(damageFlash, 0, delta * 3));
    }

    // --- CAMERA ---
    if (cameraShake.current > 0) cameraShake.current = MathUtils.lerp(cameraShake.current, 0, delta * 4);
    const shakeX = (Math.random() - 0.5) * cameraShake.current;
    const shakeY = (Math.random() - 0.5) * cameraShake.current;
    
    const camDist = 18;
    const camHeight = 6;
    const camOffset = new Vector3(0, camHeight, camDist).applyAxisAngle(new Vector3(0, 1, 0), shipRot.current.y);
    const targetCamPos = shipPos.current.clone().add(camOffset);
    targetCamPos.x += shakeX;
    targetCamPos.y += shakeY;
    
    // Smooth camera follow with adaptive lerp factor
    const lerpFactor = Math.min(delta * 8, 0.5); // Cap max lerp to prevent jumps
    camera.position.lerp(targetCamPos, lerpFactor);
    
    const lookOffset = new Vector3(0, 0, -40).applyAxisAngle(new Vector3(0, 1, 0), shipRot.current.y);
    camera.lookAt(shipPos.current.clone().add(lookOffset));

    // 2. SYSTEMS UPDATE
    if (isFiring && time - lastShotTime.current > LASER_COOLDOWN) {
        spawnLaser(shipPos.current, shipRot.current.y);
        lastShotTime.current = time;
    }
    
    // Weapon Systems (Cruiser only)
    if (selectedShip === 'cruiser' && gameStarted) {
      // G - Missile Salvo
      if (keys.current['KeyG'] && time - lastMissileFire.current > MISSILE_COOLDOWN) {
        console.log('🚀 MISSILE SALVO FIRED!');
        cameraShake.current = 1.5;
        lastMissileFire.current = time;
        // TODO: Implement missile spawning
      }
      
      // H - Railgun
      if (keys.current['KeyH'] && time - lastRailgunFire.current > RAILGUN_COOLDOWN) {
        console.log('⚡ RAILGUN DISCHARGED!');
        cameraShake.current = 3.0;
        lastRailgunFire.current = time;
        // TODO: Implement railgun beam
      }
      
      // J - EMP Burst
      if (keys.current['KeyJ'] && time - lastEMPFire.current > EMP_COOLDOWN) {
        console.log('💥 EMP BURST ACTIVATED!');
        cameraShake.current = 2.5;
        lastEMPFire.current = time;
        // TODO: Implement EMP shockwave
      }
    }
    
    // Engine trails - Always active for visual feedback, but less intense when idle
    const showTrails = gameStarted ? (throttle !== 0 || isShift) : true;
    
    if (showTrails) {
        if (selectedShip === 'cruiser') {
            // Cruiser has multiple large engines
            spawnEngineTrail(shipPos.current, -2, -0.5, shipRot.current.y, true); // Left outer
            spawnEngineTrail(shipPos.current, -0.8, -0.3, shipRot.current.y, true); // Left inner
            spawnEngineTrail(shipPos.current, 0.8, -0.3, shipRot.current.y, true);  // Right inner
            spawnEngineTrail(shipPos.current, 2, -0.5, shipRot.current.y, true);   // Right outer
            
            if (isShift) {
                spawnEngineTrail(shipPos.current, -2, -0.5, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, -0.8, -0.3, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 0.8, -0.3, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 2, -0.5, shipRot.current.y, true);
                spawnBoostParticles(shipPos.current, -2, shipRot.current.y);
                spawnBoostParticles(shipPos.current, 0, shipRot.current.y);
                spawnBoostParticles(shipPos.current, 2, shipRot.current.y);
            }
        } else if (selectedShip === 'raptor') {
            // Raptor has 3 engines - 2 side + 1 main
            spawnEngineTrail(shipPos.current, -1.2, -0.1, shipRot.current.y, true); // Left Engine
            spawnEngineTrail(shipPos.current, 1.2, -0.1, shipRot.current.y, true);  // Right Engine
            spawnEngineTrail(shipPos.current, 0, -0.15, shipRot.current.y, true);   // Main Engine
            
            if (isShift) {
                spawnEngineTrail(shipPos.current, -1.2, -0.1, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 1.2, -0.1, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 0, -0.15, shipRot.current.y, true);
                spawnBoostParticles(shipPos.current, -1.2, shipRot.current.y);
                spawnBoostParticles(shipPos.current, 0, shipRot.current.y);
                spawnBoostParticles(shipPos.current, 1.2, shipRot.current.y);
            }
        } else if (selectedShip === 'x-wing') {
            // X-Wing has 4 engines
            spawnEngineTrail(shipPos.current, -1.3, 0.9, shipRot.current.y, true); // Top Left
            spawnEngineTrail(shipPos.current, 1.3, 0.9, shipRot.current.y, true);  // Top Right
            spawnEngineTrail(shipPos.current, -1.3, -0.9, shipRot.current.y, true); // Bottom Left
            spawnEngineTrail(shipPos.current, 1.3, -0.9, shipRot.current.y, true); // Bottom Right
            
            if (isShift) {
                spawnEngineTrail(shipPos.current, -1.3, 0.9, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 1.3, 0.9, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, -1.3, -0.9, shipRot.current.y, true);
                spawnEngineTrail(shipPos.current, 1.3, -0.9, shipRot.current.y, true);
                spawnBoostParticles(shipPos.current, -1.3, shipRot.current.y);
                spawnBoostParticles(shipPos.current, 1.3, shipRot.current.y);
            }
        } else {
            // N-1 Starfighter has 2 engines
            spawnEngineTrail(shipPos.current, -1, 0, shipRot.current.y, false);
            spawnEngineTrail(shipPos.current, 1, 0, shipRot.current.y, false);
            
            if (isShift) {
               spawnEngineTrail(shipPos.current, -1, 0, shipRot.current.y, false);
               spawnEngineTrail(shipPos.current, 1, 0, shipRot.current.y, false);
               spawnBoostParticles(shipPos.current, -1, shipRot.current.y);
               spawnBoostParticles(shipPos.current, 1, shipRot.current.y);
            }
        }
    }

    // Lasers & Collision
    for (let i = 0; i < lasers.current.length; i++) {
        const laser = lasers.current[i];
        if (laser.active) {
            laser.position.add(laser.velocity.clone().multiplyScalar(delta));
            laser.life -= delta;
            spawnLaserTrail(laser.position);

            if (laser.life <= 0 || laser.position.distanceTo(shipPos.current) > 400) { 
                laser.active = false;
            } else {
                for (let j = 0; j < asteroids.current.length; j++) {
                    const ast = asteroids.current[j];
                    if (ast.active) {
                        const rad = Math.max(ast.scale.x, ast.scale.y, ast.scale.z);
                        const hitRadius = rad * 1.5; // Increased hit detection radius
                        const dx = laser.position.x - ast.position.x;
                        const dy = laser.position.y - ast.position.y;
                        const dz = laser.position.z - ast.position.z;
                        const distSq = dx*dx + dy*dy + dz*dz;
                        
                        if (distSq < hitRadius * hitRadius) {
                            ast.active = false;
                            laser.active = false;
                            spawnExplosion(ast.position);
                            audioManager.playExplosion();
                            incrementAsteroids();
                            break; 
                        }
                    }
                }
            }
            tempObj.position.copy(laser.position);
            tempObj.lookAt(laser.position.clone().add(laser.velocity));
            tempObj.scale.set(0.15, 0.15, 3); 
            tempObj.updateMatrix();
            laserMeshRef.current!.setMatrixAt(i, tempObj.matrix);
        } else {
            tempObj.position.set(0, -10000, 0);
            tempObj.scale.set(0,0,0);
            tempObj.updateMatrix();
            laserMeshRef.current!.setMatrixAt(i, tempObj.matrix);
        }
    }
    if (laserMeshRef.current && laserMeshRef.current.instanceMatrix) {
        laserMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Asteroids Update (Infinite Wrapping) & SHIP COLLISION
    let idx1 = 0, idx2 = 0, idx3 = 0;
    const currentShipX = shipPos.current.x;
    const currentShipY = shipPos.current.y;
    const currentShipZ = shipPos.current.z;
    let isNearMiss = false;
    
    for (let i = 0; i < asteroids.current.length; i++) {
        const ast = asteroids.current[i];
        
        // 1. Wrap Logic
        const dx = ast.position.x - currentShipX;
        const dy = ast.position.y - currentShipY;
        const dz = ast.position.z - currentShipZ;

        if (dx > WRAP_X) ast.position.x -= WRAP_X * 2;
        if (dx < -WRAP_X) ast.position.x += WRAP_X * 2;

        if (dy > WRAP_Y) ast.position.y -= WRAP_Y * 2;
        if (dy < -WRAP_Y) ast.position.y += WRAP_Y * 2;

        if (dz > WRAP_Z) ast.position.z -= WRAP_Z * 2;
        if (dz < -WRAP_Z) ast.position.z += WRAP_Z * 2;

        if (ast.active) {
            ast.rotation.x += ast.rotSpeed.x * delta;
            ast.rotation.y += ast.rotSpeed.y * delta;
            ast.rotation.z += ast.rotSpeed.z * delta;

            // Collision Detection
            // Use squared distance for efficiency
            const distSq = dx*dx + dy*dy + dz*dz;
            const radius = Math.max(ast.scale.x, ast.scale.y, ast.scale.z);
            // Hit radius: asteroid radius + ship radius (approx 2)
            const hitRadius = radius + 2.0;
            // Warning/Turbulence radius
            const warningRadius = radius + 12.0; 

            if (distSq < hitRadius * hitRadius) {
               // Direct Impact
               ast.active = false;
               spawnExplosion(ast.position);
               audioManager.playExplosion(); // Big Boom
               incrementAsteroids();
               
               // Check invincibility and apply damage
               if (time - lastDamageTime.current > INVINCIBILITY_DURATION) {
                 takeDamage(1); // This also sets damageFlash to 1.0
                 lastDamageTime.current = time;
               }
               
               // Strong shake
               cameraShake.current = 1.5;
               // Trigger warning light
               warningActive.current = true;
            } else if (distSq < warningRadius * warningRadius) {
               // Near Miss / Debris Field
               isNearMiss = true;
               
               // Calculate intensity based on proximity (0 to 1)
               const dist = Math.sqrt(distSq);
               const intensity = 1 - ((dist - hitRadius) / (warningRadius - hitRadius));
               
               // Add turbulence shake
               if (intensity > 0.2) {
                  cameraShake.current = Math.max(cameraShake.current, intensity * 0.3);
               }
            }

            tempObj.position.copy(ast.position);
            tempObj.rotation.set(ast.rotation.x, ast.rotation.y, ast.rotation.z);
            tempObj.scale.copy(ast.scale);
            tempObj.updateMatrix();
        } else {
            if (Math.abs(dx) > 300 || Math.abs(dz) > 400) {
                ast.active = true;
            }
            tempObj.position.set(0, -10000, 0);
            tempObj.updateMatrix();
        }

        if (i % 3 === 0 && asteroidRef1.current) {
            asteroidRef1.current.setMatrixAt(idx1++, tempObj.matrix);
        } else if (i % 3 === 1 && asteroidRef2.current) {
            asteroidRef2.current.setMatrixAt(idx2++, tempObj.matrix);
        } else if (i % 3 === 2 && asteroidRef3.current) {
            asteroidRef3.current.setMatrixAt(idx3++, tempObj.matrix);
        }
    }
    
    // Share player lasers with store for enemy collision detection
    setPlayerLasers(lasers.current);

    // Handle Warning System State
    if (isNearMiss) {
        warningActive.current = true;
        // Audio Cooldown to prevent spamming
        if (time - lastWarningTime.current > 1.5) {
             // 30% chance for warning beep, 70% for turbulence noise
             if (Math.random() > 0.7) {
                 audioManager.playWarning();
             } else {
                 audioManager.playTurbulence();
             }
             lastWarningTime.current = time;
        }
    } else {
        // Turn off warning if clear for a bit
        if (time - lastWarningTime.current > 0.5) {
            warningActive.current = false;
        }
    }

    if (asteroidRef1.current && asteroidRef1.current.instanceMatrix) asteroidRef1.current.instanceMatrix.needsUpdate = true;
    if (asteroidRef2.current && asteroidRef2.current.instanceMatrix) asteroidRef2.current.instanceMatrix.needsUpdate = true;
    if (asteroidRef3.current && asteroidRef3.current.instanceMatrix) asteroidRef3.current.instanceMatrix.needsUpdate = true;

    // Particles - optimized with distance culling
    for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.life > 0) {
            p.life -= delta;
            p.position.add(p.velocity.clone().multiplyScalar(delta));
            p.velocity.multiplyScalar(0.95); 
            
            // Distance-based culling - skip particles too far away
            const distSq = p.position.distanceToSquared(shipPos.current);
            if (distSq > 250000) { // ~500 units squared
                p.life = 0;
                tempObj.position.set(0, -10000, 0);
                tempObj.scale.set(0,0,0);
                tempObj.updateMatrix();
                particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
                continue;
            }
            
            const scale = p.scale * (p.life / p.maxLife);
            tempObj.position.copy(p.position);
            tempObj.scale.setScalar(scale);
            tempObj.lookAt(camera.position);
            tempObj.updateMatrix();
            particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
            particleMeshRef.current!.setColorAt(i, p.color);
        } else {
            tempObj.position.set(0, -10000, 0);
            tempObj.scale.set(0,0,0);
            tempObj.updateMatrix();
            particleMeshRef.current!.setMatrixAt(i, tempObj.matrix);
        }
    }
    if (particleMeshRef.current && particleMeshRef.current.instanceMatrix) {
        particleMeshRef.current.instanceMatrix.needsUpdate = true;
        if (particleMeshRef.current.instanceColor) {
            particleMeshRef.current.instanceColor.needsUpdate = true;
        }
    }

    // Trails - optimized with distance culling
    for (let i = 0; i < trails.current.length; i++) {
        const t = trails.current[i];
        if (t.active) {
            t.life -= delta;
            if (t.life <= 0) t.active = false;
            
            // Distance-based culling for trails
            const distSq = t.position.distanceToSquared(shipPos.current);
            if (distSq > 300000) { // ~550 units squared
                t.active = false;
                tempObj.position.set(0, -10000, 0);
                tempObj.scale.set(0,0,0);
                tempObj.updateMatrix();
                trailMeshRef.current!.setMatrixAt(i, tempObj.matrix);
                continue;
            }
            
            const lifeRatio = t.life / t.maxLife;
            // Shrink as it dies
            const scale = t.initialScale * lifeRatio;
            
            tempObj.position.copy(t.position);
            tempObj.scale.setScalar(scale);
            tempObj.lookAt(camera.position);
            tempObj.updateMatrix();
            trailMeshRef.current!.setMatrixAt(i, tempObj.matrix);
            trailMeshRef.current!.setColorAt(i, t.color);
        } else {
             tempObj.position.set(0, -10000, 0);
             tempObj.scale.set(0,0,0);
             tempObj.updateMatrix();
             trailMeshRef.current!.setMatrixAt(i, tempObj.matrix);
        }
    }
    if (trailMeshRef.current && trailMeshRef.current.instanceMatrix) {
        trailMeshRef.current.instanceMatrix.needsUpdate = true;
        if (trailMeshRef.current.instanceColor) {
            trailMeshRef.current.instanceColor.needsUpdate = true;
        }
    }

  });

  return (
    <>
      <group ref={shipRef}>
        {selectedShip === 'cruiser' ? (
          <CruiserModel engineGlow={isBoosting.current ? 1 : 0.5} active={true} boosting={isBoosting.current} />
        ) : selectedShip === 'raptor' ? (
          <group rotation={[0, Math.PI, 0]}>
            <RaptorModel engineGlow={isBoosting.current ? 1 : 0.5} />
          </group>
        ) : selectedShip === 'spaceship1' ? (
          <Spaceship1Model engineGlow={isBoosting.current ? 1 : 0.5} active={true} boosting={isBoosting.current} />
        ) : selectedShip === 'x-wing' ? (
          <XWingGLBModel active={true} boosting={isBoosting.current} warningActive={warningActive.current} velocity={localVelocity.current.z} />
        ) : (
          <StarfighterGLBModel active={true} boosting={isBoosting.current} warningActive={warningActive.current} />
        )}
      </group>

      {/* Lasers - Color based on ship */}
      <instancedMesh ref={laserMeshRef} args={[undefined, undefined, LASER_COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial key={selectedShip} color={currentShipData.laserColor} toneMapped={false} />
      </instancedMesh>

      {/* Asteroid 1: Blocky Dodecahedron */}
      <instancedMesh ref={asteroidRef1} args={[undefined, undefined, Math.ceil(ASTEROID_COUNT/3)]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.2} />
      </instancedMesh>

      {/* Asteroid 2: Medium Poly Icosahedron */}
      <instancedMesh ref={asteroidRef2} args={[undefined, undefined, Math.ceil(ASTEROID_COUNT/3)]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#444" roughness={0.9} metalness={0.1} flatShading />
      </instancedMesh>

      {/* Asteroid 3: Low Poly Icosahedron (Irregular Rock) */}
      <instancedMesh ref={asteroidRef3} args={[undefined, undefined, Math.ceil(ASTEROID_COUNT/3)]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2a2a2a" roughness={1.0} metalness={0.0} flatShading />
      </instancedMesh>

      {/* Particles */}
      <instancedMesh ref={particleMeshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.8} blending={AdditiveBlending} />
      </instancedMesh>

      {/* Trails - Updated to CircleGeometry for smoother look */}
      <instancedMesh ref={trailMeshRef} args={[undefined, undefined, TRAIL_COUNT]} frustumCulled={false}>
        <circleGeometry args={[0.4, 8]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.8} blending={AdditiveBlending} />
      </instancedMesh>
    </>
  );
};
