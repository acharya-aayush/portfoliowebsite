export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  tags: string[];
  position: [number, number, number]; // x, y, z coordinates in 3D space
}

export interface GameState {
  activeEventId: string | null;
  speed: number;
  distance: number;
}
