/**
 * ModelCompiler - GPU compilation for GLB models
 * Prevents freeze/lag when models first render by pre-compiling shaders
 */

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

let isCompiled = false;

/**
 * Component that compiles models on the GPU to prevent lag on first render
 */
export const useModelCompiler = () => {
  const { gl, scene } = useThree();
  const [compiled, setCompiled] = useState(isCompiled);

  useEffect(() => {
    if (isCompiled) {
      setCompiled(true);
      return;
    }

    const compileModels = async () => {
      console.log('🔧 Starting GPU model compilation...');
      
      try {
        // Load models
        const largeShip = await useGLTF.preload('/model/large-spaceship.glb');
        const regularShip = await useGLTF.preload('/model/Spaceship1.glb');

        // Create temporary scene for compilation
        const tempScene = new THREE.Scene();
        
        // Add models to temp scene
        const largeClone = largeShip.scene.clone();
        const regularClone = regularShip.scene.clone();
        
        tempScene.add(largeClone);
        tempScene.add(regularClone);

        // Compile the scene with the renderer
        gl.compile(tempScene, new THREE.Camera());
        
        // Clean up temp scene
        tempScene.clear();
        
        console.log('✓ GPU model compilation complete');
        isCompiled = true;
        setCompiled(true);
      } catch (error) {
        console.error('GPU compilation error:', error);
        setCompiled(true); // Continue anyway
      }
    };

    compileModels();
  }, [gl, scene]);

  return compiled;
};
