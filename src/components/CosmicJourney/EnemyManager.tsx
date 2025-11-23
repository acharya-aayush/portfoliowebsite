import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useJourneyStore } from '@/lib/journey/store';
import { EnemyShip } from './EnemyShip';

const MAX_ENEMIES = 5;
const SPAWN_INTERVAL = 12; // seconds
const SPAWN_DISTANCE = 100; // units ahead of player
const LARGE_CRUISER_SPAWN_TIME = 90; // Spawn large cruiser after 90 seconds

interface Enemy {
  id: number;
  position: Vector3;
  active: boolean;
  isLargeCruiser?: boolean;
}

export const EnemyManager = () => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const lastSpawnTime = useRef(0);
  const nextEnemyId = useRef(0);
  const gameStartTime = useJourneyStore((state) => state.gameStartTime);
  const health = useJourneyStore((state) => state.health);
  const takeDamage = useJourneyStore((state) => state.takeDamage);
  const playerLasers = useJourneyStore((state) => state.playerLasers);
  const lastDamageTime = useRef(0);
  const PLAYER_INVINCIBILITY = 2.0;
  const largeCruiserSpawned = useRef(false);

  const shipPos = useJourneyStore((state) => new Vector3(state.xPos, state.yPos, state.zPos));

  useFrame((state) => {
    if (health <= 0) return; // Don't spawn if game over

    const time = state.clock.elapsedTime;
    const gameTime = (Date.now() - gameStartTime) / 1000;

    // Spawn large cruiser near end of journey (after 90 seconds)
    if (gameTime > LARGE_CRUISER_SPAWN_TIME && !largeCruiserSpawned.current) {
      const cruiserPos = new Vector3(
        shipPos.x + (Math.random() - 0.5) * 50,
        shipPos.y + (Math.random() - 0.5) * 30,
        shipPos.z - SPAWN_DISTANCE * 1.5 // Spawn ahead of player
      );

      const largeCruiser: Enemy = {
        id: nextEnemyId.current++,
        position: cruiserPos,
        active: true,
        isLargeCruiser: true,
      };

      setEnemies(prev => [...prev, largeCruiser]);
      largeCruiserSpawned.current = true;
    }

    // Start spawning regular enemies after 10 seconds of gameplay
    if (gameTime > 10 && time - lastSpawnTime.current > SPAWN_INTERVAL) {
      const activeEnemies = enemies.filter(e => e.active && !e.isLargeCruiser).length;
      if (activeEnemies < MAX_ENEMIES) {
        // Randomly spawn 1-3 enemies at once
        const spawnCount = Math.floor(Math.random() * 3) + 1;
        const newEnemies: Enemy[] = [];

        for (let i = 0; i < spawnCount; i++) {
          // Spawn enemies ahead of player with random offset
          const spawnPos = new Vector3(
            shipPos.x + (Math.random() - 0.5) * 60,
            shipPos.y + (Math.random() - 0.5) * 30,
            shipPos.z - SPAWN_DISTANCE - (i * 20) // Spawn ahead, staggered
          );

          newEnemies.push({
            id: nextEnemyId.current++,
            position: spawnPos,
            active: true,
            isLargeCruiser: false,
          });
        }

        setEnemies(prev => [...prev, ...newEnemies]);
        lastSpawnTime.current = time;
      }
    }
  });

  const incrementEnemies = useJourneyStore((state) => state.incrementEnemies);
  
  const handleEnemyDestroy = (id: number) => {
    setEnemies(prev => prev.filter(e => e.id !== id));
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
        enemy.active && (
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
        )
      ))}
    </>
  );
};
