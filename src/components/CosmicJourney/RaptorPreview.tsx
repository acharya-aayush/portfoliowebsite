import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import RaptorModel from './RaptorModel';
import { useState } from 'react';

export default function RaptorPreview() {
  const [engineGlow, setEngineGlow] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Canvas camera={{ position: [8, 4, 8], fov: 50 }}>
        <color attach="background" args={['#000008']} />
        <Stars radius={300} depth={60} count={5000} factor={7} fade speed={1} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4488ff" />
        
        <RaptorModel engineGlow={engineGlow} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-8 left-8 text-white font-mono space-y-4">
        <h1 className="text-3xl font-bold mb-2">RAPTOR MK-III</h1>
        <p className="text-gray-400 mb-6">Advanced Strike Fighter</p>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-500">SPECIFICATIONS</div>
          <div className="text-xs space-y-1">
            <div>• Triple Engine Configuration</div>
            <div>• Swept-Wing Design</div>
            <div>• Dual Hardpoint Weapons</div>
            <div>• Navigation Lighting</div>
            <div>• Cockpit Canopy</div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs text-gray-500 mb-2">ENGINE POWER</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={engineGlow}
            onChange={(e) => setEngineGlow(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <div>Use mouse to rotate and zoom</div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute top-8 right-8 text-white font-mono">
        <div className="bg-black/50 backdrop-blur-md border border-white/20 p-4 rounded-lg space-y-2">
          <div className="text-xs text-gray-500 mb-2">PERFORMANCE</div>
          <div className="flex justify-between gap-8">
            <span className="text-gray-400">SPEED</span>
            <span className="text-cyan-400">★★★★★</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-gray-400">HANDLING</span>
            <span className="text-cyan-400">★★★★★</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-gray-400">POWER</span>
            <span className="text-cyan-400">★★★★★</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-amber-400">
            🏆 Unlock: Destroy 15 asteroids
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => window.location.reload()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-mono transition-all"
      >
        Close Preview
      </button>
    </div>
  );
}
