// Import Three.js core from the import map
import * as THREE from "three";

// Import loaders and controls from the same version on jsDelivr
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/geometries/TextGeometry.js";

//Global Variables
var container,
  renderer,
  raycaster,
  mouse,
  lastPos,
  scene,
  camera,
  controls,
  ambientLight,
  directionalLight,
  clock,
  walkAction,
  rack = new THREE.Object3D(),
  warehouseDepth,
  warehouseWidth,
  mixers = [],
  manOriginalmixer,
  animations;

document.addEventListener("DOMContentLoaded", function () {
  function init() {
    container = document.createElement("div");
    // creating a container section(division) on our html page(not yet visible).
    document.body.appendChild(container);
    // assigning div to document's visible structure i.e. body.

    renderingSetup();
    sceneSetup();
    addSkyDome();
    cameraSetup();
    controlsSetup();
    lightSetup();
    raycastingSetup();
    clockSetup();

    buildGround();
    buildCompund();
    buildWarehouse();
    addRacks();
    container.appendChild(renderer.domElement);

    animate();
  }

  init();

  function renderingSetup() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // PMREM Generator for improved environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
  }

  function raycastingSetup() {
    raycaster = new THREE.Raycaster();
    // need mouse coordinates for raycasting.
    mouse = new THREE.Vector2();
    lastPos = new THREE.Vector2();
  }

  function sceneSetup() {
    scene = new THREE.Scene();
  }

  function cameraSetup() {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.z = 500;
    camera.position.y = 500;
    scene.add(camera);
  }

  function controlsSetup() {
    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);

    // Optional: Enable damping (inertia)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Optional: Set limits for zooming and rotating
    controls.minDistance = 10; // Minimum zoom distance
    controls.maxDistance = 1000; // Maximum zoom distance

    // limiting vertical rotation around x axis
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.2;

    // limiting horizontal rotation around y axis
    controls.minAzimuthAngle = -Math.PI;
    controls.maxAzimuthAngle = Math.PI;

    var minPan = new THREE.Vector3(-300, -300, -300);
    var maxPan = new THREE.Vector3(300, 300, 300);

    // Function to clamp target position
    function clampTarget() {
      controls.target.x = Math.max(
        minPan.x,
        Math.min(maxPan.x, controls.target.x)
      );
      controls.target.y = Math.max(
        minPan.y,
        Math.min(maxPan.y, controls.target.y)
      );
      controls.target.z = Math.max(
        minPan.z,
        Math.min(maxPan.z, controls.target.z)
      );
    }

    // Listen for changes in controls
    controls.addEventListener("change", clampTarget);

    // Initial call to set target within bounds if necessary
    clampTarget();

    // Make the camera look at a specific point (optional)
    const center = new THREE.Vector3(0, 0, 0); // Adjust this based on your scene
    controls.target.copy(center);

    // Update controls to reflect the target position
    controls.update();
  }

  function lightSetup() {
    // Add ambient light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // // Add directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
    directionalLight.position.set(0, 100, 100); // Position the light
    scene.add(directionalLight);
  }

  function clockSetup() {
    // Render loop
    clock = new THREE.Clock();
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // seconds.
    // Update all mixers
    mixers.forEach((mixer) => {
      mixer.update(delta); // Update each mixer with delta time
    });

    // Update controls
    controls.update(); // This will use OrbitControls damping if enabled
    renderer.render(scene, camera);
  }

  function addSkyDome() {
    // Load the skydome texture
    const loader = new THREE.TextureLoader();
    loader.load("../images/sky_box.jpg", function (texture) {
      // Create a large sphere geometry for the skydome
      const geometry = new THREE.SphereGeometry(1000, 32, 32);

      texture.wrapS = THREE.RepeatWrapping; // Ensure the texture wraps horizontally
      texture.wrapT = THREE.ClampToEdgeWrapping; // Optionally clamp vertically to prevent top/bottom seams
      texture.minFilter = THREE.LinearFilter; // Smooth out texture if it's low-res

      // Create a material using the loaded texture
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide, // Render the inside of the sphere
      });

      // Create the skydome mesh
      const skydome = new THREE.Mesh(geometry, material);

      skydome.rotation.y = Math.PI/2;

      skydome.position.y = 100;

      // Add the skydome to the scene
      scene.add(skydome);
    });
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

    // Create Mesh
    const plane = new THREE.Mesh(geometry, material);
    //   plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal

    // Rotate Plane to be perpendicular to Y-axis
    plane.rotation.x = -Math.PI / 2;

    return plane;
  }

  //ground model
  function buildGround() {
    // Add Plane to Scene
    scene.add(buildPlane(2000, 2000, "../images/ground.png", 10, 10));
  }

  function buildCompund() {
    // Define wall dimensions
    const wallHeight = 36; // Height of the walls
    const wallThickness = 2; // Thickness of the walls
    const roomWidth = 400; // Width of the room
    const roomDepth = 300; // Depth of the room

    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("../images/wall.jpg", function () {
      // Set texture repeat
      texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
      texture.repeat.set(5); // Number of times to repeat in each direction
    }); // Replace with your texture path

    // Create Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.5,
    });

    const compundWalls = new THREE.Group();

    // Front Wall
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth + 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWall.position.set(0, wallHeight / 2, -roomDepth / 2); // Position at front
    compundWalls.add(frontWall);

    // Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth + 2, wallHeight, wallThickness),
      wallMaterial
    );
    backWall.position.set(0, wallHeight / 2, roomDepth / 2); // Position at back
    compundWalls.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth),
      wallMaterial
    );
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0); // Position on left
    compundWalls.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth),
      wallMaterial
    );
    rightWall.position.set(roomWidth / 2, wallHeight / 2, 0); // Position on right
    compundWalls.add(rightWall);

    // Add Walls to Scene
    scene.add(compundWalls);

    const flooring = buildPlane(
      roomWidth,
      roomDepth,
      "../images/compound_flooring.jpg",
      50,
      100
    );

    flooring.position.set(0, 0.005, 0);

    flooring.rotation.x = -Math.PI / 2;

    scene.add(flooring);
  }

  function buildWarehouse() {
    buildWarehouseWall();
    buildWarehouseAreas();
  }

  function buildWarehouseWall() {
    // Define wall dimensions
    const wallHeight = 24; // Height of the walls
    const wallThickness = 2; // Thickness of the walls
    warehouseWidth = 200; // Width of the room
    warehouseDepth = 120; // Depth of the room

    // Load Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "../images/warehouse_wall.jpg",
      function () {
        // Set texture repeat
        texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
        texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
        texture.repeat.set(10, 5); // Number of times to repeat in each direction
      }
    ); // Replace with your texture path

    // Create Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.5,
    });

    const warehouseWalls = new THREE.Group();

    // Front Wall
    const frontWallLeft = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3 + 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWallLeft.position.set(
      -warehouseWidth / 3,
      wallHeight / 2,
      warehouseDepth / 2
    ); // Position at front
    const frontWallRight = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3 + 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWallRight.position.set(
      warehouseWidth / 3,
      wallHeight / 2,
      warehouseDepth / 2
    ); // Position at front
    const frontWallMiddle = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3 + 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWallMiddle.position.set(0, wallHeight / 2, warehouseDepth / 2 - 10); // Position at front
    const frontWallLeftTurn = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 8),
      wallMaterial
    );
    frontWallLeftTurn.position.set(
      -warehouseWidth / 6,
      wallHeight / 2,
      warehouseDepth / 2 - 5
    ); // Position at front
    const frontWallRightTurn = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 8),
      wallMaterial
    );
    frontWallRightTurn.position.set(
      warehouseWidth / 6,
      wallHeight / 2,
      warehouseDepth / 2 - 5
    ); // Position at front
    warehouseWalls.add(frontWallLeft);
    warehouseWalls.add(frontWallRight);
    warehouseWalls.add(frontWallMiddle);
    warehouseWalls.add(frontWallLeftTurn);
    warehouseWalls.add(frontWallRightTurn);

    // Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth + 2, wallHeight, wallThickness),
      wallMaterial
    );
    backWall.position.set(0, wallHeight / 2, -warehouseDepth / 2); // Position at back
    warehouseWalls.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, warehouseDepth),
      wallMaterial
    );
    leftWall.position.set(-warehouseWidth / 2, wallHeight / 2, 0); // Position on left
    warehouseWalls.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, warehouseDepth),
      wallMaterial
    );
    rightWall.position.set(warehouseWidth / 2, wallHeight / 2, 0); // Position on right
    warehouseWalls.add(rightWall);

    warehouseWalls.position.set(-warehouseDepth / 3, 0, -warehouseWidth / 4);

    // Add Walls to Scene
    scene.add(warehouseWalls);
  }

  function buildWarehouseAreas() {
    const storageArea = buildPlane(135, 62);
    storageArea.material.color.set(0x8fb0a9);
    storageArea.position.set(-72, 0.01, -80);
    scene.add(storageArea);

    write3DText("Storage Area", (textMesh) => {
      textMesh.position.set(-90, 0.015, -60);
      scene.add(textMesh); // Add to the scene if desired
    });

    const inspectionArea = buildPlane(65, 62);
    inspectionArea.material.color.set(0x9fc4ea);
    inspectionArea.position.set(27, 0.015, -80);
    scene.add(inspectionArea);

    write3DText("Inspection Area", (textMesh) => {
      textMesh.position.set(3, 0.015, -60);
      scene.add(textMesh); // Add to the scene if desired
    });

    const stagingArea = buildPlane(66, 58);
    stagingArea.material.color.set(0xdcf0ac);
    stagingArea.position.set(-107, 0.015, -20);
    scene.add(stagingArea);

    write3DText("Staging Area", (textMesh) => {
      textMesh.position.set(-125, 0.015, -38);
      scene.add(textMesh); // Add to the scene if desired
    });

    const receivingArea = buildPlane(66, 58);
    receivingArea.material.color.set(0xafe8d8);
    receivingArea.position.set(27, 0.015, -20);
    scene.add(receivingArea);

    write3DText("Receving Area", (textMesh) => {
      textMesh.position.set(4, 0.015, -38);
      scene.add(textMesh); // Add to the scene if desired
    });

    const activityArea = buildPlane(68, 48);
    activityArea.material.color.set(0xe8dfaf);
    activityArea.position.set(-40, 0.015, -25);
    scene.add(activityArea);

    write3DText("Activity Area", (textMesh) => {
      textMesh.position.set(-60, 0.015, -38);
      scene.add(textMesh); // Add to the scene if desired
    });
  }

  function addRacks() {
    const Loader = new GLTFLoader();

    // Configure the loader to load textures
    Loader.loadTexture = true;
    Loader.load(
      "../glbs/rack.glb",
      function (gltf) {
        rack = gltf.scene;

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(rack);
        const dimensions = new THREE.Vector3();
        box.getSize(dimensions);

        const numberOfRacks = 5; // Number of racks to clone
        const spacing = dimensions.x * 3; // Distance between each rack in the x-axis

        for (let i = 0; i < numberOfRacks; i++) {
          // Clone the original rack
          const rackClone = rack.clone();

          rackClone.traverse((obj) => {
            if (obj.isMesh) {
              if (obj.name.includes("rack")) {
                obj.name = "rack" + i;
              }
            }
          });

          // console.log(dumpObject(rackClone).join('\n'));

          // Set position for each clone
          rackClone.position.set(
            (-warehouseWidth * 11.5) / 20 + i * spacing,
            0,
            (-warehouseDepth * 2) / 3
          );

          // Add cloned rack to the scene
          scene.add(rackClone);
        }

        scene.updateMatrixWorld(true);

        addWorker();
      },
      undefined,
      function (error) {
        console.error(error.toString());
      }
    );
  }

  function addWorker() {
    const Loader = new GLTFLoader();

    // Configure the loader to load textures
    Loader.loadTexture = true;
    Loader.load(
      "../glbs/walk.glb",
      function (gltf) {
        var man = gltf.scene;

        man.position.set(-90, 0, -60);
        man.scale.set(2.5, 2.5, 2.5);

        scene.add(man);

        animations = gltf.animations;

        // Set up animation mixer
        manOriginalmixer = new THREE.AnimationMixer(man);
        const clip = animations[0];
        walkAction = manOriginalmixer.clipAction(clip);
        walkAction.play();

        mixers.push(manOriginalmixer);
        scene.updateMatrixWorld(true);
        animate();
      },
      undefined,
      function (error) {
        console.error(error.toString());
      }
    );
  }

  function dumpObject(obj, lines = [], isLast = true, prefix = "") {
    const localPrefix = isLast ? "└─" : "├─";
    lines.push(
      `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
        obj.type
      }]`
    );
    const newPrefix = prefix + (isLast ? "  " : "│ ");
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }
});

function write3DText(text, callback) {
  const fontLoader = new FontLoader();
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      // Create the 3D text using the loaded font
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 5,
        depth: 0.001,
        curveSegments: 4,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.rotation.x = -Math.PI / 2;
      callback(textMesh);
    }
  );
}
