import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Adjusted camera position
  camera.position.set(10, 10, 30); // Set to view the scene correctly

  return camera;
}
