import * as THREE from "three";
import { addLights } from "lights";

export function initScene(renderer, camera) {
  const scene = new THREE.Scene();
  const threeDView = document.getElementById("threeDView");
  renderer.setSize(threeDView.clientWidth, threeDView.clientHeight);

  // Adding GridHelper (a grid for visualizing the ground plane)
  const gridHelper = new THREE.GridHelper(1000, 1000, 0x888888, 0x444444);
  gridHelper.material.transparent = true; // Enable transparency
  gridHelper.material.opacity = 0.2; // Set desired opacity (0.0 to 1.0)
  scene.add(gridHelper);

  // Adding AxesHelper (x: red, y: green, z: blue)
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);

  scene.add(camera);

  addLights(scene);

  window.addEventListener("resize", () => {
    camera.aspect = threeDView.clientWidth / threeDView.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeDView.clientWidth, threeDView.clientHeight);
  });

  return { scene, gridHelper };
}
