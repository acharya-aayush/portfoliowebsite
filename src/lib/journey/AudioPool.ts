/**
 * Audio Pool Manager for optimized audio playback
 * Reuses audio instances to prevent lag from creating new Audio objects
 */

class AudioPoolManager {
  private pools: Map<string, HTMLAudioElement[]> = new Map();
  private maxPoolSize = 5; // Max instances per sound

  /**
   * Play a sound with optional volume
   */
  play(src: string, volume: number = 0.5): void {
    try {
      let pool = this.pools.get(src);
      
      // Create pool if doesn't exist
      if (!pool) {
        pool = [];
        this.pools.set(src, pool);
      }

      // Find available audio instance
      let audio = pool.find(a => a.paused || a.ended);
      
      // Create new instance if none available and under pool limit
      if (!audio && pool.length < this.maxPoolSize) {
        audio = new Audio(src);
        pool.push(audio);
      }

      // Play the audio if available
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0; // Reset to start
        audio.play().catch(() => {}); // Ignore errors silently
      }
    } catch (e) {
      // Silently fail if audio can't play
    }
  }

  /**
   * Preload a sound into the pool
   */
  preload(src: string, count: number = 2): void {
    try {
      let pool = this.pools.get(src);
      
      if (!pool) {
        pool = [];
        this.pools.set(src, pool);
      }

      // Create initial instances
      for (let i = 0; i < Math.min(count, this.maxPoolSize); i++) {
        if (pool.length < this.maxPoolSize) {
          const audio = new Audio(src);
          audio.load(); // Preload the audio
          pool.push(audio);
        }
      }
    } catch (e) {
      // Silently fail if audio can't preload
    }
  }

  /**
   * Clear all audio pools (useful for cleanup)
   */
  clear(): void {
    this.pools.forEach(pool => {
      pool.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    });
    this.pools.clear();
  }
}

// Export singleton instance
export const AudioPool = new AudioPoolManager();

// Preload common sounds
AudioPool.preload('/journey/laser.mp3', 3);
AudioPool.preload('/journey/explosion.mp3', 2);
AudioPool.preload('/journey/starcruiserexplosion.mp3', 2);
