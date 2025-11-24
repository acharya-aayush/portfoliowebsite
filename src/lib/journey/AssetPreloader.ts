/**
 * AssetPreloader - Comprehensive asset loading system
 * Preloads all game assets during loading screen to prevent lag
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Track loading progress
let isPreloaded = false;
let loadingProgress = 0;
let totalAssets = 0;
let loadedAssets = 0;

/**
 * Get current loading progress (0-100)
 */
export const getLoadingProgress = () => {
  return Math.round((loadedAssets / totalAssets) * 100);
};

/**
 * Check if all assets are preloaded
 */
export const isAssetsPreloaded = () => isPreloaded;

/**
 * Preload all game assets
 */
export const preloadGameAssets = async (onProgress?: (progress: number) => void): Promise<void> => {
  if (isPreloaded) {
    if (onProgress) {
      onProgress(100);
    }
    return Promise.resolve();
  }

  // List of all assets to preload
  const modelPaths = [
    '/model/large-spaceship.glb',
    '/model/Spaceship1.glb',
  ];

  const audioPaths = [
    '/journey/laser.mp3',
    '/journey/explosion.mp3',
    '/journey/starcruiserexplosion.mp3',
    '/journey/gameover.mp3',
  ];

  totalAssets = modelPaths.length + audioPaths.length;
  loadedAssets = 0;
  
  console.log(`Starting asset preload: ${totalAssets} total assets`);
  
  // Report initial progress
  if (onProgress) {
    onProgress(0);
  }

  const updateProgress = () => {
    loadedAssets++;
    loadingProgress = getLoadingProgress();
    console.log(`Loaded ${loadedAssets}/${totalAssets} assets (${loadingProgress}%)`);
    if (onProgress) {
      onProgress(loadingProgress);
    }
  };

  // Preload 3D models
  const modelPromises = modelPaths.map((path) => {
    return new Promise<void>((resolve, reject) => {
      console.log(`Loading model: ${path}`);
      const loader = new GLTFLoader();
      loader.load(
        path,
        () => {
          console.log(`✓ Model loaded: ${path}`);
          updateProgress();
          resolve();
        },
        (progress) => {
          // Progress callback
          if (progress.total > 0) {
            console.log(`Loading ${path}: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
          }
        },
        (error) => {
          console.error(`✗ Failed to preload model: ${path}`, error);
          updateProgress();
          resolve(); // Continue even if one fails
        }
      );
    });
  });

  // Preload audio files
  const audioPromises = audioPaths.map((path) => {
    return new Promise<void>((resolve) => {
      console.log(`Loading audio: ${path}`);
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = path;
      
      let resolved = false;
      
      const onCanPlay = () => {
        if (resolved) return;
        resolved = true;
        console.log(`✓ Audio loaded: ${path}`);
        updateProgress();
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve();
      };
      
      const onError = (error: any) => {
        if (resolved) return;
        resolved = true;
        console.error(`✗ Failed to preload audio: ${path}`, error);
        updateProgress();
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve(); // Continue even if one fails
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('error', onError);
      
      // Fallback timeout
      setTimeout(() => {
        if (!resolved) {
          console.warn(`⚠ Audio timeout: ${path} (forcing complete)`);
          onCanPlay();
        }
      }, 3000);
    });
  });

  // Wait for all assets to load
  try {
    await Promise.all([...modelPromises, ...audioPromises]);
    console.log('✓ All assets preloaded successfully');
    
    // Small delay to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Asset preloading error:', error);
  }
  
  isPreloaded = true;
  if (onProgress) {
    onProgress(100);
  }
  return Promise.resolve();
};

/**
 * Reset preloader state (useful for testing)
 */
export const resetPreloader = () => {
  isPreloaded = false;
  loadingProgress = 0;
  totalAssets = 0;
  loadedAssets = 0;
};
