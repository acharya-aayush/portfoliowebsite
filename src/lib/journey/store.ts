import { create } from 'zustand';
import { addVisitedWaypoint as addWaypointToCookie } from './ships';

interface JourneyStore {
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  activeEventId: string | null;
  setActiveEventId: (id: string | null) => void;
  velocity: number;
  setVelocity: (v: number) => void;
  zPos: number;
  setZPos: (z: number) => void;
  xPos: number;
  setXPos: (x: number) => void;
  yPos: number;
  setYPos: (y: number) => void;
  selectedShip: string;
  setSelectedShip: (shipId: string) => void;
  visitedWaypoints: Set<number>;
  addVisitedWaypoint: (id: number) => void;
  health: number;
  maxHealth: number;
  damageFlash: number;
  setHealth: (health: number) => void;
  takeDamage: (amount: number) => void;
  resetHealth: () => void;
  setDamageFlash: (value: number) => void;
  asteroidsDestroyed: number;
  incrementAsteroids: () => void;
  resetAsteroids: () => void;
  enemiesDestroyed: number;
  incrementEnemies: () => void;
  resetEnemies: () => void;
  gameStartTime: number;
  setGameStartTime: (time: number) => void;
  playerLasers: any[];
  setPlayerLasers: (lasers: any[]) => void;
}

export const useJourneyStore = create<JourneyStore>((set) => ({
  gameStarted: false,
  setGameStarted: (started) => set({ gameStarted: started }),
  activeEventId: null,
  setActiveEventId: (id) => set({ activeEventId: id }),
  velocity: 0,
  setVelocity: (v) => set({ velocity: v }),
  zPos: 0,
  setZPos: (z) => set({ zPos: z }),
  xPos: 0,
  setXPos: (x) => set({ xPos: x }),
  yPos: 0,
  setYPos: (y) => set({ yPos: y }),
  selectedShip: 'n1-starfighter',
  setSelectedShip: (shipId) => set({ selectedShip: shipId }),
  visitedWaypoints: new Set(),
  addVisitedWaypoint: (id) => set((state) => {
    const newSet = new Set(state.visitedWaypoints);
    newSet.add(id);
    // Actually save to cookies for persistence!
    addWaypointToCookie(id);
    return { visitedWaypoints: newSet };
  }),
  health: 3,
  maxHealth: 3,
  damageFlash: 0,
  setHealth: (health) => set({ health: Math.max(0, Math.min(health, 3)) }),
  takeDamage: (amount) => set((state) => ({ health: Math.max(0, state.health - amount), damageFlash: 1.0 })),
  resetHealth: () => set({ health: 3 }),
  setDamageFlash: (value) => set({ damageFlash: Math.max(0, value) }),
  asteroidsDestroyed: 0,
  incrementAsteroids: () => set((state) => ({ asteroidsDestroyed: state.asteroidsDestroyed + 1 })),
  resetAsteroids: () => set({ asteroidsDestroyed: 0 }),
  enemiesDestroyed: 0,
  incrementEnemies: () => set((state) => ({ enemiesDestroyed: state.enemiesDestroyed + 1 })),
  resetEnemies: () => set({ enemiesDestroyed: 0 }),
  gameStartTime: 0,
  setGameStartTime: (time) => set({ gameStartTime: time }),
  playerLasers: [],
  setPlayerLasers: (lasers) => set({ playerLasers: lasers }),
}));
