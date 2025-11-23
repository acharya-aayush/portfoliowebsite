// Animation Constants
export const ANIMATION_TIMINGS = {
  FADE_IN: 0.8,
  FADE_OUT: 0.5,
  DELAY_SHORT: 0.4,
  DELAY_MEDIUM: 0.6,
  LOADING_SCREEN_DURATION: 3000,
  PARTICLE_TEXT_FADE_IN: 100,
  VOLUME_INCREMENT_INTERVAL: 50,
} as const;

// Color Constants
export const COLORS = {
  GOLD: '#D4AF37',
  WHITE: '#ffffff',
  TRANSPARENT: 'transparent',
} as const;

// Particle System Constants
export const PARTICLE_CONFIG = {
  QUANTITY: 150,
  EASE: 80,
  STATICITY: 50,
  SIZE: 0.8,
  PARTICLE_AMOUNT: 800, // Reduced from 2000 for better performance
  PARTICLE_SIZE: 2,
  HOVER_AREA: 50,
  EASE_DEFAULT: 0.12,
  EASE_ACTIVE: 0.02,
  MOUSE_OFF_SCREEN_X: -10000,
  MOUSE_OFF_SCREEN_Y: -10000,
} as const;

// Audio Constants
export const AUDIO_CONFIG = {
  INITIAL_VOLUME: 0.3,
  MAX_VOLUME: 0.375, // 1.25x of initial
  VOLUME_INCREMENT: 0.005,
  DISTORTION_AUDIO_PATH: '/home/distortion.mp3',
} as const;

// Responsive Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Text Size Map for Responsive Design
export const TEXT_SIZE_MAP = {
  MOBILE: 10,
  SMALL_TABLET: 12,
  TABLET: 14,
  SMALL_DESKTOP: 16,
  LARGE_DESKTOP: 18,
} as const;

// Loading Screen Probabilities
export const LOADER_PROBABILITIES = {
  BLACKHOLE: 0.25,
  BICYCLE: 0.25,
  RECORDING: 0.08,
  CUBE: 0, // Disabled
  WALKING: 0.22,
  ASTRONAUT: 0.20,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  BACKGROUND: 0,
  PARTICLES: 5,
  CONTENT: 10,
  MODAL: 50,
  LOADING: 100,
} as const;
