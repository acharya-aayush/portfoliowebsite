import { useState, useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { useJourneyStore } from '@/lib/journey/store';
import { EnemyShip } from './EnemyShip';

interface TutorialEnemyManagerProps {
  tutorialStep: number;
}

interface TutorialEnemy {
  id: number;
  position: Vector3;
  active: boolean;
  canShoot: boolean;
}

export const TutorialEnemyManager = ({ tutorialStep }: TutorialEnemyManagerProps) => {
  const [tutorialEnemy, setTutorialEnemy] = useState<TutorialEnemy | null>(null);
  const spawnInitiated = useRef(false);
  const playerLasers = useJourneyStore((state) => state.playerLasers);
  const shipPos = useJourneyStore((state) => new Vector3(state.xPos, state.yPos, state.zPos));
  const incrementEnemies = useJourneyStore((state) => state.incrementEnemies);

  // Spawn single tutorial enemy at step 5
  useEffect(() => {
    if (tutorialStep === 5 && !spawnInitiated.current) {
      spawnInitiated.current = true;
      
      // Spawn enemy directly ahead of player
      const spawnPos = new Vector3(
        shipPos.x,
        shipPos.y,
        shipPos.z - 80
      );

      setTutorialEnemy({
        id: 9991,
        position: spawnPos,
        active: true,
        canShoot: false, // Don't shoot in tutorial
      });
    }
  }, [tutorialStep, shipPos]);

  // Reset when tutorial step changes
  useEffect(() => {
    if (tutorialStep !== 5) {
      setTutorialEnemy(null);
      spawnInitiated.current = false;
    }
  }, [tutorialStep]);

  const handleEnemyDestroy = (id: number) => {
    setTutorialEnemy(null);
    incrementEnemies(); // Increment the counter when tutorial enemy is destroyed
  };

  const handlePlayerDamage = () => {
    // Do nothing - tutorial enemies don't damage player
  };

  return (
    <>
      {tutorialEnemy && tutorialEnemy.active && (
        <EnemyShip
          key={tutorialEnemy.id}
          enemyId={tutorialEnemy.id}
          position={tutorialEnemy.position}
          active={tutorialEnemy.active}
          onDestroy={handleEnemyDestroy}
          onDamagePlayer={handlePlayerDamage}
          playerLasers={playerLasers}
          isLargeCruiser={false}
          isTutorial={true}
          canShootInTutorial={tutorialEnemy.canShoot}
        />
      )}
    </>
  );
};
