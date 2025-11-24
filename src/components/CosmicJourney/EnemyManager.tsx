import { useState, useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { useJourneyStore } from '@/lib/journey/store';
import { EnemyShip } from './EnemyShip';

// Waypoint-based spawning checkpoints
const SPAWN_CHECKPOINTS = {
  3: { count: 2, largeCruiser: false },  // 2 enemies after 3rd waypoint
  5: { count: 3, largeCruiser: false },  // 3 enemies after 5th waypoint
  7: { count: 3, largeCruiser: false },  // 3 enemies after 7th waypoint
  9: { count: 1, largeCruiser: true },   // 1 large cruiser (Battlecruiser MK-IV) at 9th waypoint
};

interface Enemy {
  id: number;
  position: Vector3;
  active: boolean; // Can shoot and move
  visible: boolean; // Rendered in scene (pre-spawned but dormant)
  isLargeCruiser?: boolean;
  waypointTrigger?: number; // Which waypoint activates this enemy
  pooled?: boolean; // Track if this is a pooled instance
}

interface EnemyManagerProps {
  tutorialComplete: boolean;
}

export const EnemyManager = ({ tutorialComplete }: EnemyManagerProps) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const gameStarted = useJourneyStore((state) => state.gameStarted);
  const health = useJourneyStore((state) => state.health);
  const visitedWaypoints = useJourneyStore((state) => state.visitedWaypoints);
  
  // Pre-spawn all enemies at their waypoint positions during game start
  useEffect(() => {
    if (!gameStarted || !tutorialComplete) return;
    
    const preSpawnedEnemies: Enemy[] = [];
    let enemyIdCounter = 0;
    
    // Pre-spawn enemies for all checkpoints
    Object.entries(SPAWN_CHECKPOINTS).forEach(([waypoint, config]) => {
      const waypointNum = parseInt(waypoint);
      const waypointZ = waypointNum * -200; // Approximate waypoint Z position
      
      for (let i = 0; i < config.count; i++) {
        const spawnPos = new Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20,
          waypointZ - 100 - (i * 35)
        );
        
        preSpawnedEnemies.push({
          id: enemyIdCounter++,
          position: spawnPos,
          active: false, // Not shooting or moving yet
          visible: true, // Rendered but dormant
          isLargeCruiser: config.largeCruiser,
          waypointTrigger: waypointNum,
          pooled: false,
        });
      }
    });
    
    console.log(`✓ Pre-spawned ${preSpawnedEnemies.length} enemies at waypoints`);
    setEnemies(preSpawnedEnemies);
  }, [gameStarted, tutorialComplete]);
  
  // Activate enemies when player reaches their waypoint trigger
  useEffect(() => {
    if (!tutorialComplete || health <= 0) return;

    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        // Check if this enemy should be activated
        if (!enemy.active && enemy.waypointTrigger && 
            visitedWaypoints.has(enemy.waypointTrigger - 1)) {
          console.log(`🎯 Activating enemy at waypoint ${enemy.waypointTrigger}`);
          return { ...enemy, active: true };
        }
        return enemy;
      })
    );
  }, [visitedWaypoints, tutorialComplete, health]);
  
  const takeDamage = useJourneyStore((state) => state.takeDamage);
  const playerLasers = useJourneyStore((state) => state.playerLasers);
  const lastDamageTime = useRef(0);
  const PLAYER_INVINCIBILITY = 2.0;

  const incrementEnemies = useJourneyStore((state) => state.incrementEnemies);
  
  const handleEnemyDestroy = (id: number) => {
    // Remove destroyed enemy from the array
    setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.id !== id));
    incrementEnemies();
  };

  const handlePlayerDamage = () => {
    const time = Date.now() / 1000;
    if (time - lastDamageTime.current > PLAYER_INVINCIBILITY) {
      takeDamage(1);
      lastDamageTime.current = time;
    }
  };

  return (
    <>
      {enemies.map(enemy => (
        <EnemyShip
          key={enemy.id}
          enemyId={enemy.id}
          position={enemy.position}
          active={enemy.active}
          onDestroy={handleEnemyDestroy}
          onDamagePlayer={handlePlayerDamage}
          playerLasers={playerLasers}
          isLargeCruiser={enemy.isLargeCruiser}
        />
      ))}
    </>
  );
};
