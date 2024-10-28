import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function addControls(camera, renderer){
    // Adding OrbitControls for mouse interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  return controls;
}