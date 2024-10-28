import * as THREE from "three";
import { addLights } from "./lights";
import { addControls } from "./controls";
import { addCamera } from "./camera";
import type { WebGLRenderer } from "three";

export function initScene(renderer: WebGLRenderer) {
  const scene = new THREE.Scene();
  const threeDView = document.getElementById("threeDView");
  renderer.setSize(threeDView!.clientWidth, threeDView!.clientHeight);

  // Adding GridHelper (a grid for visualizing the ground plane)
  const gridHelper = new THREE.GridHelper(1000, 1000, 0x888888, 0x444444);
  scene.add(gridHelper);

  // Adding AxesHelper (x: red, y: green, z: blue)
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);

  const camera = addCamera(scene);

  const controls = addControls(camera, renderer);

  addLights(scene);

  return {camera, controls, scene, gridHelper};
}
