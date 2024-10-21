// Import Three.js core from the import map
import * as THREE from "three";

// Import loaders and controls from the same version on jsDelivr
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js";
// Step 2: Setting up the 3D Scene with Grid and Axes
const scene = new THREE.Scene();

// Adjusted camera position
const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth * 0.8) / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 30); // Set to view the scene correctly

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("threeCanvas"),
});
renderer.setSize(window.innerWidth * 0.8, window.innerHeight);

// Adding OrbitControls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Adding GridHelper (a grid for visualizing the ground plane)
const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x444444);
scene.add(gridHelper);

// Adding AxesHelper (x: red, y: green, z: blue)
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

// Step 3: Creating a basic lighting setup
const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
scene.add(ambientLight);

// Stronger directional light to highlight objects
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Step 4: Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Step 5: Drag-and-Drop Functionality
const draggableElements = document.querySelectorAll(".draggable");
let draggedObjectType = null;

draggableElements.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    draggedObjectType = event.target.id; // Get the type of object (cube, sphere, cylinder)
  });
});

const threeCanvas = document.getElementById("threeCanvas");
threeCanvas.addEventListener("dragover", (event) => {
  event.preventDefault(); // Allow dropping
});

threeCanvas.addEventListener("drop", (event) => {
  event.preventDefault();

  // Find the drop position in 3D space using raycasting
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 0.8 * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(gridHelper);

  if (intersects.length > 0) {
    const position = intersects[0].point;
    addObjectToScene(draggedObjectType, position);
  }
});

// Step 6: Add Objects to Scene
function addObjectToScene(type, position) {
  let object;

  switch (type) {
    case "cube":
      object = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      );
      break;
    case "sphere":
      object = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x0000ff })
      );
      break;
    case "cylinder":
      object = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2, 32),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      break;
    case "plane":
      object = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color: 0xff0000}));
      object.rotation.x = -Math.PI/2;
      break;
    default:
      return;
  }

  object.position.copy(position);
  object.position.y += object.geometry.parameters.height / 2 || 1; // Adjust height
  scene.add(object);
}

function buildPlane(
  width,
  depth,
  textureImg,
  repeatHorizontal,
  repeatVertical
) {
  // Create Plane Geometry
  const geometry = new THREE.PlaneGeometry(width, depth);

  var texture;

  if (textureImg) {
    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    texture = textureLoader.load(textureImg, function () {
      // Set texture repeat
      texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
      texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
      texture.repeat.set(repeatHorizontal, repeatVertical); // Number of times to repeat in each direction
    }); // Replace with your texture path
  }

  // Create Material with Texture
  const material = new THREE.MeshStandardMaterial({
    map: textureImg != null ? texture : null,
    metalness: 0.1,
    roughness: 0.5,
  });

  material.color.set(0xff0000);

  // Create Mesh
  const plane = new THREE.Mesh(geometry, material);
  //   plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal

  // Rotate Plane to be perpendicular to Y-axis
  plane.rotation.x = -Math.PI / 2;

  return plane;
}

// Step 7: Handle Window Resizing
window.addEventListener("resize", () => {
  camera.aspect = (window.innerWidth * 0.8) / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
});