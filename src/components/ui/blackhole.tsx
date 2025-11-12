import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface BlackHoleProps {
  mousePosition?: { x: number; y: number };
}

export const BlackHole: React.FC<BlackHoleProps> = ({ mousePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4, 1, 5); // Position camera to view model on the right
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    console.log('Black hole initialized:', { width, height });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffaa66, 1);
    pointLight2.position.set(-5, 3, 2);
    scene.add(pointLight2);

    // OrbitControls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 1; // Allow closer zoom
    controls.maxDistance = 15; // Allow zooming out to see full scene
    controls.target.set(2, 0, 0); // Focus on the right where model is
    controlsRef.current = controls;

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/model/blackhole.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and position the model to the right side
        model.scale.set(1.2, 1.2, 1.2); // Larger for better visibility when zoomed
        model.position.set(2, 0, 0); // Position to the right
        
        scene.add(model);
        modelRef.current = model;
        
        console.log('Black hole model loaded successfully');
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
      },
      (error) => {
        console.error('Error loading black hole model:', error);
      }
    );

    // Backup shader in case model doesn't load
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      varying vec2 vUv;

      // 3D sphere raymarching for black hole
      float sphereSDF(vec3 p, float r) {
        return length(p) - r;
      }

      // 3D accretion disk in orbital plane
      float accretionDisk3D(vec3 p, float innerRadius, float outerRadius) {
        float distFromCenter = length(p.xy);
        float diskThickness = 0.08;
        
        // Disk exists in XY plane
        if (abs(p.z) < diskThickness && distFromCenter > innerRadius && distFromCenter < outerRadius) {
          // Rotation
          float angle = atan(p.y, p.x);
          float rotatedAngle = angle - time * 0.5;
          
          // Turbulent patterns
          float noise = sin(distFromCenter * 20.0 + rotatedAngle * 5.0 - time * 2.0) * 0.5 + 0.5;
          noise += sin(distFromCenter * 35.0 - time * 3.0) * 0.3;
          
          // Density falloff
          float radialFade = smoothstep(innerRadius, innerRadius + 0.1, distFromCenter) * 
                            smoothstep(outerRadius, outerRadius - 0.3, distFromCenter);
          float verticalFade = 1.0 - abs(p.z) / diskThickness;
          
          return noise * radialFade * verticalFade;
        }
        return 0.0;
      }

      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= resolution.x / resolution.y;
        
        // Position black hole in right area
        vec2 offset = vec2(0.25, 0.0);
        uv += offset;
        
        // Camera setup for 3D view
        vec3 rayOrigin = vec3(0.0, 0.0, -2.0);
        vec3 rayDir = normalize(vec3(uv, 1.0));
        
        // Tilt the view slightly to show 3D
        float tiltAngle = -0.3;
        mat3 rotX = mat3(
          1.0, 0.0, 0.0,
          0.0, cos(tiltAngle), -sin(tiltAngle),
          0.0, sin(tiltAngle), cos(tiltAngle)
        );
        rayDir = rotX * rayDir;
        
        vec3 color = vec3(0.0);
        
        // Raymarch
        float t = 0.0;
        float sphereRadius = 0.25;
        float diskInner = 0.35;
        float diskOuter = 0.9;
        
        for (int i = 0; i < 80; i++) {
          vec3 p = rayOrigin + rayDir * t;
          
          // Check sphere (event horizon shadow)
          float sphereDist = sphereSDF(p, sphereRadius);
          
          if (sphereDist < 0.01) {
            // Hit the black hole sphere - pure black
            color = vec3(0.0);
            break;
          }
          
          // Check accretion disk
          float diskDensity = accretionDisk3D(p, diskInner, diskOuter);
          
          if (diskDensity > 0.01) {
            float distFromCenter = length(p.xy);
            
            // Color based on temperature and position
            vec3 hotColor = vec3(1.0, 0.95, 0.85);      // White-yellow hot
            vec3 warmColor = vec3(1.0, 0.7, 0.4);       // Orange
            vec3 coolColor = vec3(0.8, 0.6, 0.3);       // Darker orange
            
            // Temperature gradient (hotter closer to center)
            float temp = 1.0 - smoothstep(diskInner, diskOuter, distFromCenter);
            
            // Doppler shift effect
            float angle = atan(p.y, p.x);
            float doppler = sin(angle - time * 2.0) * 0.3 + 0.7;
            
            vec3 diskColor = mix(coolColor, hotColor, temp * doppler);
            
            // Accumulate color with depth
            float alpha = diskDensity * 0.4;
            color += diskColor * alpha * (1.0 - length(color));
            
            if (length(color) > 0.95) break;
          }
          
          t += 0.02;
          if (t > 3.0) break;
        }
        
        // Gravitational lensing glow around sphere
        vec2 centerUv = vUv - vec2(0.72, 0.5);
        float distToCenter = length(centerUv);
        float glow = exp(-distToCenter * 8.0) * 0.3;
        color += vec3(1.0, 0.9, 0.7) * glow;
        
        // Vignette
        float vignette = smoothstep(0.8, 0.2, length(vUv - vec2(0.5)));
        color *= vignette;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create material with shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        )},
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader,
      fragmentShader,
    });

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Continuous slow rotation
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.003; // Always rotate slowly
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      renderer.dispose();
    };
  }, []);

  // Mouse position not needed with OrbitControls
  useEffect(() => {
    // Controls handle all mouse interaction
  }, [mousePosition]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        mixBlendMode: 'normal',
        opacity: 1,
        zIndex: 1
      }}
    >
      {/* Blocking overlay on left side to prevent interaction with canvas */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full"
        style={{
          pointerEvents: 'auto',
          zIndex: 10,
          background: 'transparent'
        }}
      />
    </div>
  );
};
