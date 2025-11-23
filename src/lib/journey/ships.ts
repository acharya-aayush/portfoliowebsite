// Spaceship model definitions and unlock system

export interface ShipModel {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockCondition: string;
  requiredWaypoints: number;
  requiredAsteroids?: number;
  stats: {
    speed: number;
    handling: number;
    firepower: number;
  };
  trailColor: string;
  laserColor: string;
  engineColor: string;
}

export const SHIP_MODELS: ShipModel[] = [
  {
    id: 'n1-starfighter',
    name: 'Interceptor MK-I',
    description: 'Standard issue reconnaissance vessel',
    unlocked: true,
    unlockCondition: 'Default',
    requiredWaypoints: 0,
    stats: {
      speed: 7,
      handling: 8,
      firepower: 6,
    },
    trailColor: '#00aaff',
    laserColor: '#ff0044',
    engineColor: '#00ffff',
  },
  {
    id: 'x-wing',
    name: 'Vanguard MK-II',
    description: 'Advanced tactical fighter',
    unlocked: false,
    unlockCondition: 'Complete all waypoints',
    requiredWaypoints: 10,
    stats: {
      speed: 8,
      handling: 7,
      firepower: 9,
    },
    trailColor: '#ff6600',
    laserColor: '#ff0000',
    engineColor: '#ff8800',
  },
  {
    id: 'spaceship1',
    name: 'Phantom MK-II',
    description: 'Stealth-class interceptor with advanced systems',
    unlocked: false,
    unlockCondition: 'Destroy 10 asteroids',
    requiredWaypoints: 0,
    requiredAsteroids: 10,
    stats: {
      speed: 9,
      handling: 9,
      firepower: 8,
    },
    trailColor: '#00ffaa',
    laserColor: '#00ff88',
    engineColor: '#0088ff',
  },
  {
    id: 'raptor',
    name: 'Raptor MK-III',
    description: 'Elite strike fighter with triple engine configuration',
    unlocked: false,
    unlockCondition: 'Destroy 15 asteroids',
    requiredWaypoints: 0,
    requiredAsteroids: 15,
    stats: {
      speed: 10,
      handling: 10,
      firepower: 10,
    },
    trailColor: '#00ccff',
    laserColor: '#00ddff',
    engineColor: '#ff8800',
  },
  {
    id: 'cruiser',
    name: 'Battlecruiser MK-IV',
    description: 'Massive capital ship with overwhelming firepower',
    unlocked: false,
    unlockCondition: 'Complete all waypoints + Destroy 25 asteroids',
    requiredWaypoints: 10,
    requiredAsteroids: 25,
    stats: {
      speed: 6,
      handling: 5,
      firepower: 15,
    },
    trailColor: '#4488ff',
    laserColor: '#00bbff',
    engineColor: '#00ddff',
  },
];

// Cookie management for waypoints
const WAYPOINTS_COOKIE = 'cosmic_journey_waypoints';
const UNLOCKED_SHIPS_COOKIE = 'cosmic_journey_unlocked_ships';
const ASTEROIDS_DESTROYED_COOKIE = 'cosmic_journey_asteroids_destroyed';

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Waypoint tracking
export const getVisitedWaypoints = (): number[] => {
  try {
    const cookie = getCookie(WAYPOINTS_COOKIE);
    return cookie ? JSON.parse(cookie) : [];
  } catch {
    return [];
  }
};

export const addVisitedWaypoint = (waypointId: number): boolean => {
  const visited = getVisitedWaypoints();
  if (!visited.includes(waypointId)) {
    visited.push(waypointId);
    setCookie(WAYPOINTS_COOKIE, JSON.stringify(visited));
    
    // Check for ship unlocks
    checkAndUnlockShips(visited.length);
    return true; // New waypoint
  }
  return false; // Already visited
};

export const getWaypointCount = (): number => {
  return getVisitedWaypoints().length;
};

// Ship unlock management
export const getUnlockedShips = (): string[] => {
  try {
    const cookie = getCookie(UNLOCKED_SHIPS_COOKIE);
    return cookie ? JSON.parse(cookie) : ['n1-starfighter'];
  } catch {
    return ['n1-starfighter'];
  }
};

export const unlockShip = (shipId: string): void => {
  const unlocked = getUnlockedShips();
  if (!unlocked.includes(shipId)) {
    unlocked.push(shipId);
    setCookie(UNLOCKED_SHIPS_COOKIE, JSON.stringify(unlocked));
  }
};

export const isShipUnlocked = (shipId: string): boolean => {
  return getUnlockedShips().includes(shipId);
};

const checkAndUnlockShips = (waypointCount: number): void => {
  SHIP_MODELS.forEach(ship => {
    if (!ship.unlocked && waypointCount >= ship.requiredWaypoints) {
      unlockShip(ship.id);
    }
  });
};

// Asteroid destruction tracking
export const getDestroyedAsteroidCount = (): number => {
  try {
    const cookie = getCookie(ASTEROIDS_DESTROYED_COOKIE);
    return cookie ? parseInt(cookie, 10) : 0;
  } catch {
    return 0;
  }
};

export const incrementAsteroidCount = (): number => {
  const count = getDestroyedAsteroidCount() + 1;
  setCookie(ASTEROIDS_DESTROYED_COOKIE, count.toString());
  
  // Check for ship unlocks based on asteroids
  checkAndUnlockShipsByAsteroids(count);
  return count;
};

const checkAndUnlockShipsByAsteroids = (asteroidCount: number): void => {
  SHIP_MODELS.forEach(ship => {
    if (!ship.unlocked && ship.requiredAsteroids && asteroidCount >= ship.requiredAsteroids) {
      unlockShip(ship.id);
      // Dispatch event to show notification
      window.dispatchEvent(new CustomEvent('shipUnlocked', { detail: { shipId: ship.id, shipName: ship.name } }));
    }
  });
};

// Cheat code: Unlock all ships (for all current and future ships)
export const unlockAllShips = (): void => {
  const allShipIds = SHIP_MODELS.map(ship => ship.id);
  setCookie(UNLOCKED_SHIPS_COOKIE, JSON.stringify(allShipIds));
  // Dispatch event to refresh UI
  window.dispatchEvent(new CustomEvent('shipsUnlocked'));
};

// Tutorial completion tracking
const TUTORIAL_COMPLETED_COOKIE = 'cosmic_journey_tutorial_completed';

export const isTutorialCompleted = (): boolean => {
  const cookie = getCookie(TUTORIAL_COMPLETED_COOKIE);
  return cookie === 'true';
};

export const setTutorialCompleted = (): void => {
  setCookie(TUTORIAL_COMPLETED_COOKIE, 'true');
};
