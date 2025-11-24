import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * GeometryPreloader - Pre-creates and caches all geometries used by enemy ships
 * This eliminates lag when enemies spawn by having all geometries ready in memory
 */
export const GeometryPreloader = () => {
  // Pre-create all geometries that enemy ships use
  const geometries = useMemo(() => {
    return {
      // Enemy ship body
      shipBody: new THREE.BoxGeometry(2, 1, 3),
      // Enemy ship wings
      shipWings: new THREE.BoxGeometry(6, 0.2, 1.5),
      // Enemy cockpit
      shipCockpit: new THREE.SphereGeometry(0.6, 8, 8),
      // Engine thrusters
      shipEngine: new THREE.SphereGeometry(0.3, 6, 6),
      // Laser geometry
      laserBox: new THREE.BoxGeometry(1, 1, 1),
      // Particle explosions
      particleSphere: new THREE.SphereGeometry(0.5, 6, 6),
    };
  }, []);

  // Pre-create materials
  const materials = useMemo(() => {
    return {
      shipBodyMaterial: new THREE.MeshStandardMaterial({
        color: '#660000',
        metalness: 0.8,
        roughness: 0.3,
      }),
      shipWingsMaterial: new THREE.MeshStandardMaterial({
        color: '#440000',
        metalness: 0.7,
        roughness: 0.4,
      }),
      shipCockpitMaterial: new THREE.MeshStandardMaterial({
        color: '#220000',
        metalness: 0.9,
        roughness: 0.1,
      }),
      shipEngineMaterial: new THREE.MeshBasicMaterial({
        color: '#ff0000',
      }),
      laserMaterial: new THREE.MeshBasicMaterial({
        color: '#ff0044',
        toneMapped: false,
      }),
      particleMaterial: new THREE.MeshBasicMaterial({
        toneMapped: false,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Dispose geometries
      Object.values(geometries).forEach(geom => geom.dispose());
      // Dispose materials
      Object.values(materials).forEach(mat => mat.dispose());
    };
  }, [geometries, materials]);

  // This component doesn't render anything - it just preloads resources
  return null;
};

// Export shared geometries for use in EnemyShip
export const getPreloadedGeometries = () => {
  // These will be cached after first call
  return {
    shipBody: new THREE.BoxGeometry(2, 1, 3),
    shipWings: new THREE.BoxGeometry(6, 0.2, 1.5),
    shipCockpit: new THREE.SphereGeometry(0.6, 8, 8),
    shipEngine: new THREE.SphereGeometry(0.3, 6, 6),
    laserBox: new THREE.BoxGeometry(1, 1, 1),
    particleSphere: new THREE.SphereGeometry(0.5, 6, 6),
  };
};
