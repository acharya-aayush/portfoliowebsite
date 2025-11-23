class AudioManager {
  private ctx: AudioContext | null = null;
  
  // Nodes for Engine
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private boostOsc: OscillatorNode | null = null;
  private boostGain: GainNode | null = null;

  // Nodes for Ambience
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private isInitialized = false;

  constructor() {
    // Lazy initialization to handle SSR/Next.js contexts safely if needed
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  async initialize() {
    if (this.isInitialized || !this.ctx) return;

    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.setupAmbience();
    this.setupEngine();
    this.isInitialized = true;
  }

  private createBrownNoise(): AudioBufferSourceNode {
    if (!this.ctx) throw new Error("No Audio Context");
    
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    
    // Generate Brown Noise (1/f^2) for a deep rumble
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate for gain loss
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    return noise;
  }

  private setupEngine() {
    if (!this.ctx) return;

    // 1. Rumble Source (Brown Noise)
    const noise = this.createBrownNoise();
    
    // 2. Filter (Lowpass to mufffle the noise into a hum)
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 150; // Start deep
    this.engineFilter.Q.value = 1;

    // 3. Master Engine Gain
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.05; // Idle volume

    // Connect Graph: Noise -> Filter -> Gain -> Dest
    noise.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    noise.start();

    // 4. Boost Sound (High pitch sine wave for "Warp" feel)
    this.boostOsc = this.ctx.createOscillator();
    this.boostOsc.type = 'sine';
    this.boostOsc.frequency.value = 100; // Starts low
    
    this.boostGain = this.ctx.createGain();
    this.boostGain.gain.value = 0; // Silent by default

    this.boostOsc.connect(this.boostGain);
    this.boostGain.connect(this.ctx.destination);
    this.boostOsc.start();
  }

  private setupAmbience() {
    if (!this.ctx) return;

    // Create a binaural beat effect / dark drone
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'triangle';
    this.droneOsc1.frequency.value = 50;

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.value = 55; // 5hz difference creates beating

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.05; // Very quiet background

    this.droneOsc1.connect(this.droneGain);
    this.droneOsc2.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  // Called continuously from the game loop
  updateEngine(velocity: number, isBoosting: boolean) {
    if (!this.ctx || !this.engineFilter || !this.engineGain || !this.boostOsc || !this.boostGain) return;

    const now = this.ctx.currentTime;

    // Normalize velocity (0 to ~30)
    const speedRatio = Math.min(velocity / 30, 1);

    // 1. Update Rumble Pitch (Filter Frequency)
    // Idle: 150Hz, Max: 600Hz
    const targetFreq = 150 + (speedRatio * 450);
    this.engineFilter.frequency.setTargetAtTime(targetFreq, now, 0.1);

    // 2. Update Rumble Volume
    // Idle: 0.05, Max: 0.2
    const targetVol = 0.05 + (speedRatio * 0.15);
    this.engineGain.gain.setTargetAtTime(targetVol, now, 0.1);

    // 3. Boost Logic
    if (isBoosting) {
        // Ramp up boost volume
        this.boostGain.gain.setTargetAtTime(0.1, now, 0.2);
        // Ramp up frequency
        this.boostOsc.frequency.setTargetAtTime(200 + (speedRatio * 400), now, 0.5);
    } else {
        // Fade out boost
        this.boostGain.gain.setTargetAtTime(0, now, 0.3);
        this.boostOsc.frequency.setTargetAtTime(100, now, 0.5);
    }
  }

  playLaser() {
    // Play laser.mp3 sound file
    const laserSound = new Audio('/journey/laser.mp3');
    laserSound.volume = 0.3;
    laserSound.play().catch(() => {});
  }

  playExplosion() {
    // Play asteroid_explosion.mp3 sound file
    const explosionSound = new Audio('/journey/asteroid_explosion.mp3');
    explosionSound.volume = 0.4;
    explosionSound.play().catch(() => {});
  }

  playWarning() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Double beep alarm
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.setValueAtTime(0, t + 0.1); // Silence
    osc.frequency.setValueAtTime(880, t + 0.15); // A5
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.setValueAtTime(0, t + 0.1);
    gain.gain.setValueAtTime(0.05, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playTurbulence() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  // Cleanup method to stop all audio when exiting the game
  stopAll() {
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;

    // Fade out all gains to avoid clicks
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.1);
    }
    if (this.boostGain) {
      this.boostGain.gain.setTargetAtTime(0, now, 0.1);
    }
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0, now, 0.1);
    }

    // After fade, suspend the context
    setTimeout(() => {
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
    }, 200);
  }

  // Resume audio when starting the game again
  resume() {
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // Restore gain levels
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(0.05, now, 0.1);
    }
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0.05, now, 0.1);
    }
  }
}

export const audioManager = new AudioManager();
