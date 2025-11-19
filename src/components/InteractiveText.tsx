import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { 
  PARTICLE_CONFIG, 
  AUDIO_CONFIG, 
  TEXT_SIZE_MAP, 
  BREAKPOINTS,
  ANIMATION_TIMINGS 
} from '@/config/constants';

interface InteractiveTextProps {
  text?: string;
  className?: string;
}

const InteractiveText = memo(({ text = "AAYUSH ACHARYA", className = "" }: InteractiveTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGPUWarning, setShowGPUWarning] = useState(false);
  const animationCompleteRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize audio
    audioRef.current = new Audio(AUDIO_CONFIG.DISTORTION_AUDIO_PATH);
    audioRef.current.volume = AUDIO_CONFIG.INITIAL_VOLUME;
    
    // Check GPU acceleration
    const checkGPUAcceleration = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
      
      if (!gl) {
        setShowGPUWarning(true);
        return false;
      }
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        // Check if using software renderer
        if (renderer.toLowerCase().includes('swiftshader') || 
            renderer.toLowerCase().includes('software') ||
            renderer.toLowerCase().includes('llvmpipe')) {
          setShowGPUWarning(true);
          return false;
        }
      }
      return true;
    };
    
    checkGPUAcceleration();

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let geometryCopy: THREE.BufferGeometry;
    let planeArea: THREE.Mesh;
    let animationId: number;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(PARTICLE_CONFIG.MOUSE_OFF_SCREEN_X, PARTICLE_CONFIG.MOUSE_OFF_SCREEN_Y);
    const colorChange = new THREE.Color();
    let isMouseDown = false;
    let volumeInterval: NodeJS.Timeout | null = null;

    // Calculate responsive text size based on screen width
    const getResponsiveTextSize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.SM) return TEXT_SIZE_MAP.MOBILE;
      if (width < BREAKPOINTS.MD) return TEXT_SIZE_MAP.SMALL_TABLET;
      if (width < BREAKPOINTS.LG) return TEXT_SIZE_MAP.TABLET;
      if (width < BREAKPOINTS.XL) return TEXT_SIZE_MAP.SMALL_DESKTOP;
      return TEXT_SIZE_MAP.LARGE_DESKTOP;
    };

    const data: {
      amount: number;
      particleSize: number;
      textSize: number;
      area: number;
      ease: number;
    } = {
      amount: PARTICLE_CONFIG.PARTICLE_AMOUNT,
      particleSize: PARTICLE_CONFIG.PARTICLE_SIZE,
      textSize: getResponsiveTextSize(),
      area: PARTICLE_CONFIG.HOVER_AREA,
      ease: PARTICLE_CONFIG.EASE_DEFAULT,
    };

    // Vertex Shader
    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    // Fragment Shader
    const fragmentShader = `
      uniform vec3 color;
      uniform sampler2D pointTexture;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(color * vColor, 1.0);
        gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
      }
    `;

    const visibleHeightAtZDepth = (depth: number, camera: THREE.PerspectiveCamera) => {
      const cameraOffset = camera.position.z;
      if (depth < cameraOffset) depth -= cameraOffset;
      else depth += cameraOffset;
      const vFOV = (camera.fov * Math.PI) / 180;
      return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    };

    const visibleWidthAtZDepth = (depth: number, camera: THREE.PerspectiveCamera) => {
      const height = visibleHeightAtZDepth(depth, camera);
      return height * camera.aspect;
    };

    const distance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    const createScene = () => {
      scene = new THREE.Scene();
      
      const container = containerRef.current!;
      camera = new THREE.PerspectiveCamera(
        65,
        container.clientWidth / container.clientHeight,
        1,
        10000
      );
      camera.position.set(0, 0, 150);

      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false, // Disable for better performance
        powerPreference: 'high-performance'
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5x for performance
      container.appendChild(renderer.domElement);

      // Create invisible plane for raycasting
      const geometry = new THREE.PlaneGeometry(
        visibleWidthAtZDepth(0, camera),
        visibleHeightAtZDepth(0, camera)
      );
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0,
      });
      planeArea = new THREE.Mesh(geometry, material);
      planeArea.position.z = 0;
      planeArea.visible = false;
      scene.add(planeArea);
    };

    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      return new THREE.CanvasTexture(canvas);
    };

    const createText = (font: any, particleTexture: THREE.Texture) => {
      const thePoints: THREE.Vector3[] = [];
      const shapes = font.generateShapes(text, data.textSize);
      const geometry = new THREE.ShapeGeometry(shapes);
      geometry.computeBoundingBox();

      // Center the geometry properly
      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      const yMid = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
      
      geometry.translate(xMid, yMid, 0);

      const holeShapes: any[] = [];
      for (let q = 0; q < shapes.length; q++) {
        const shape = shapes[q];
        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            const hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }
      shapes.push(...holeShapes);

      const colors: number[] = [];
      const sizes: number[] = [];

      for (let x = 0; x < shapes.length; x++) {
        const shape = shapes[x];
        const amountPoints = shape.type === 'Path' ? data.amount / 2 : data.amount;
        const points = shape.getSpacedPoints(amountPoints);

        points.forEach((element: any) => {
          const a = new THREE.Vector3(element.x, element.y, 0);
          thePoints.push(a);
          colors.push(colorChange.r, colorChange.g, colorChange.b);
          sizes.push(1);
        });
      }

      const geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
      // Center the points geometry based on computed offsets
      geoParticles.translate(xMid, yMid, 0);
      geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
      geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xffffff) },
          pointTexture: { value: particleTexture },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      particles = new THREE.Points(geoParticles, material);
      scene.add(particles);

      geometryCopy = new THREE.BufferGeometry();
      geometryCopy.copy(particles.geometry);
      
      // Scatter particles randomly for initial animation
      const pos = particles.geometry.attributes.position;
      const copy = geometryCopy.attributes.position;
      
      // Pre-calculate scatter positions with less randomness for smoother animation
      for (let i = 0; i < pos.count; i++) {
        const angle = (i / pos.count) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 150 + Math.random() * 150; // Reduced scatter distance
        const targetX = copy.getX(i);
        const targetY = copy.getY(i);
        
        pos.setX(i, targetX + Math.cos(angle) * radius);
        pos.setY(i, targetY + Math.sin(angle) * radius);
        pos.setZ(i, (Math.random() - 0.5) * 50); // Reduced Z spread
      }
      pos.needsUpdate = true;
    };

    const render = () => {
      const time = ((0.001 * performance.now()) % 12) / 12;
      const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;
      
      // Animate particles to form text (first 1.2 seconds) - only run during formation
      if (!animationCompleteRef.current && particles && geometryCopy) {
        const elapsed = performance.now() - (window as unknown as { particleStartTime?: number }).particleStartTime!;
        const animationDuration = 1200; // Reduced to 1.2s for snappier feel
        
        if (elapsed < animationDuration) {
          const progress = Math.min(elapsed / animationDuration, 1);
          // Simple ease-out quadratic - less CPU intensive
          const eased = progress * (2 - progress);
          
          const pos = particles.geometry.attributes.position;
          const copy = geometryCopy.attributes.position;
          const posArray = pos.array as Float32Array;
          const copyArray = copy.array as Float32Array;
          
          // Direct array manipulation for better performance
          const lerpFactor = eased * 0.2;
          for (let i = 0; i < posArray.length; i++) {
            posArray[i] += (copyArray[i] - posArray[i]) * lerpFactor;
          }
          pos.needsUpdate = true;
        } else {
          // Animation complete - snap to final positions and mark as done
          animationCompleteRef.current = true;
          const pos = particles.geometry.attributes.position;
          const copy = geometryCopy.attributes.position;
          pos.array.set(copy.array);
          pos.needsUpdate = true;
        }
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeArea);

      if (intersects.length > 0 && particles) {
        const pos = particles.geometry.attributes.position;
        const copy = geometryCopy.attributes.position;
        const colors = particles.geometry.attributes.customColor;
        const size = particles.geometry.attributes.size;

        const mx = intersects[0].point.x;
        const my = intersects[0].point.y;
        const mz = intersects[0].point.z;

        for (let i = 0, l = pos.count; i < l; i++) {
          const initX = copy.getX(i);
          const initY = copy.getY(i);
          const initZ = copy.getZ(i);

          let px = pos.getX(i);
          let py = pos.getY(i);
          let pz = pos.getZ(i);

          colorChange.setHSL(0.15, 1, 1);
          colors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
          colors.needsUpdate = true;

          size.array[i] = data.particleSize;
          size.needsUpdate = true;

          const dx = mx - px;
          const dy = my - py;
          const mouseDistance = distance(mx, my, px, py);
          const d = dx * dx + dy * dy;
          const f = -data.area / d;

          if (isMouseDown) {
            const t = Math.atan2(dy, dx);
            px -= f * Math.cos(t);
            py -= f * Math.sin(t);

            colorChange.setHSL(0.15 + zigzagTime, 1.0, 0.5);
            colors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
            colors.needsUpdate = true;

            if (
              px > initX + 70 ||
              px < initX - 70 ||
              py > initY + 70 ||
              py < initY - 70
            ) {
              colorChange.setHSL(0.5, 1.0, 0.5);
              colors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
              colors.needsUpdate = true;
            }
          } else {
            if (mouseDistance < data.area) {
              if (i % 5 === 0) {
                const t = Math.atan2(dy, dx);
                px -= 0.03 * Math.cos(t);
                py -= 0.03 * Math.sin(t);

                colorChange.setHSL(0.5, 1.0, 0.5);
                colors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                colors.needsUpdate = true;

                size.array[i] = data.particleSize / 1.2;
                size.needsUpdate = true;
              } else {
                const t = Math.atan2(dy, dx);
                px += f * Math.cos(t);
                py += f * Math.sin(t);

                pos.setXYZ(i, px, py, pz);
                pos.needsUpdate = true;

                size.array[i] = data.particleSize * 1.3;
                size.needsUpdate = true;
              }

              if (
                px > initX + 10 ||
                px < initX - 10 ||
                py > initY + 10 ||
                py < initY - 10
              ) {
                colorChange.setHSL(0.5, 1.0, 0.5);
                colors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                colors.needsUpdate = true;

                size.array[i] = data.particleSize / 1.8;
                size.needsUpdate = true;
              }
            }
          }

          px += (initX - px) * data.ease;
          py += (initY - py) * data.ease;
          pz += (initZ - pz) * data.ease;

          if (Math.abs(px - initX) < 0.01) px = initX;
          if (Math.abs(py - initY) < 0.01) py = initY;
          if (Math.abs(pz - initZ) < 0.01) pz = initZ;

          pos.setXYZ(i, px, py, pz);
          pos.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onMouseDown = (event: MouseEvent) => {
      // Only play sound if clicking within the container
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInsideContainer = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      
      if (!isInsideContainer) return;
      
      isMouseDown = true;
      data.ease = PARTICLE_CONFIG.EASE_ACTIVE;
      
      // Play sound effect with gradual volume increase
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = AUDIO_CONFIG.INITIAL_VOLUME;
        audioRef.current.loop = true;
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        
        // Gradually increase volume over time while holding
        volumeInterval = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < AUDIO_CONFIG.MAX_VOLUME) {
            audioRef.current.volume = Math.min(
              audioRef.current.volume + AUDIO_CONFIG.VOLUME_INCREMENT, 
              AUDIO_CONFIG.MAX_VOLUME
            );
          } else if (volumeInterval) {
            clearInterval(volumeInterval);
            volumeInterval = null;
          }
        }, ANIMATION_TIMINGS.VOLUME_INCREMENT_INTERVAL);
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      data.ease = PARTICLE_CONFIG.EASE_DEFAULT;
      
      // Clear volume interval
      if (volumeInterval) {
        clearInterval(volumeInterval);
        volumeInterval = null;
      }
      
      // Stop sound effect and reset volume
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = AUDIO_CONFIG.INITIAL_VOLUME;
      }
    };

    const onWindowResize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Update raycasting plane to cover the full canvas at z=0
      if (planeArea) {
        const newWidth = visibleWidthAtZDepth(0, camera);
        const newHeight = visibleHeightAtZDepth(0, camera);
        planeArea.geometry.dispose();
        planeArea.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
        planeArea.position.z = 0;
      }

      // Update text size on resize
      const newTextSize = getResponsiveTextSize();
      if (newTextSize !== data.textSize && particles) {
        data.textSize = newTextSize;
        // Recreate text with new size
        scene.remove(particles);
        particles.geometry.dispose();
        geometryCopy.dispose();
        
        const particleTexture = createParticleTexture();
        const fontLoader = new FontLoader();
        fontLoader.load(
          'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json',
          (font) => {
            createText(font, particleTexture);
          }
        );
      }
    };

    // Initialize
    const init = async () => {
      createScene();

      const particleTexture = createParticleTexture();
      const fontLoader = new FontLoader();

      try {
        const font = await fontLoader.loadAsync(
          'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json'
        );
        
        createText(font, particleTexture);
        
        // Store start time for animation
        (window as unknown as { particleStartTime?: number }).particleStartTime = performance.now();

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onWindowResize);

        render();
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    };

    init();

    // Cleanup
    cleanupRef.current = () => {
      if (animationId) cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onWindowResize);
      
      if (renderer && containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (particles) particles.geometry.dispose();
      if (geometryCopy) geometryCopy.dispose();
      if (renderer) renderer.dispose();
      
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [text]);

  return (
    <>
      <div 
        ref={containerRef} 
        className={className}
        style={{ 
          width: '100%', 
          height: '100%',
          fontFamily: "'Playfair Display', serif"
        }}
      />
      
      {/* GPU Warning - Glassmorphic */}
      {showGPUWarning && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            borderRadius: '12px',
            zIndex: 1000,
            fontSize: '13px',
            maxWidth: '280px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 500, opacity: 0.7, letterSpacing: '0.5px' }}>
            PERFORMANCE NOTICE
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', lineHeight: '1.5', opacity: 0.85 }}>
            GPU acceleration unavailable. Enable hardware acceleration for optimal performance.
          </p>
          <button
            onClick={() => setShowGPUWarning(false)}
            style={{
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
});

InteractiveText.displayName = 'InteractiveText';

export default InteractiveText;
