import * as THREE from 'three';

export function addLights(scene){
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity 1, and range 100
  pointLight.position.set(10, 10, 10); // Set its position in the scene
  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);
}