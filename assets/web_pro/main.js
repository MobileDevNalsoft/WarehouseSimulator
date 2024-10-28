// Import Three.js core from the import map

import { createRenderer } from "renderer";
import { initScene } from "initScene";
import { addInteractions } from "interactions";

let undoStack = [];
let redoStack = [];
// Store the currently selected object
let selectedObject = null;
let selectedObjectOutline = null;
let localOriginMarker = null;

document.addEventListener("DOMContentLoaded", function () {
  const renderer = createRenderer();

  const { camera, controls, scene , gridHelper} = initScene(renderer);

  addInteractions(scene, camera, renderer, gridHelper);

  // Step 4: Render loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  
});
