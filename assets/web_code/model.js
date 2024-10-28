// Import Three.js core from the import map
import * as THREE from "three";

// Import loaders and controls from the same version on jsDelivr
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import { TransformControls } from "three/examples/jsm/Addons.js";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

let undoStack = [];
let redoStack = [];
// Store the currently selected object
let selectedObject = null;
let selectedObjectOutline = null;
let localOriginMarker = null;

document.addEventListener("DOMContentLoaded", function () {
  //create left panel
  const leftPanel = document.createElement("div");
  leftPanel.id = "leftPanel";

  const heading = document.createElement("h3");
  heading.textContent = "Warehouse Components";
  leftPanel.appendChild(heading);

  // Array of draggable items
  const draggableItems = [
    { id: "ground", text: "ground" },
    { id: "warehouse", text: "warehouse" },
  ];

  // Loop through the array to create draggable items
  draggableItems.forEach((item) => {
    const draggableDiv = document.createElement("div");
    draggableDiv.className = "draggable";
    draggableDiv.id = item.id;
    draggableDiv.setAttribute("draggable", true);
    draggableDiv.textContent = item.text;
    leftPanel.appendChild(draggableDiv);
  });

  const dropdownSheet = document.createElement("div");
  dropdownSheet.id = "dropdownSheet";
  dropdownSheet.style.display = "none";

  // create right panel
  const rightPanel = document.createElement("div");
  rightPanel.id = "rightPanel";

  // create canvas for 3d view
  const threeCanvas = document.createElement("canvas");
  threeCanvas.id = "threeCanvas";
  rightPanel.appendChild(threeCanvas);

  // create export button
  const exportButton = document.createElement("button");
  exportButton.id = "exportButton";
  exportButton.textContent = "export";

  // create export button
  const importButton = document.createElement("button");
  importButton.id = "importButton";
  importButton.textContent = "import";

  document.body.appendChild(leftPanel);
  document.body.appendChild(rightPanel);
  document.body.appendChild(exportButton);
  document.body.appendChild(importButton);
  document.body.appendChild(dropdownSheet);

  //declarations
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Adjusted camera position
  camera.position.set(10, 10, 30); // Set to view the scene correctly

  const renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));

  // PMREM Generator for improved environment lighting
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const raycaster = new THREE.Raycaster();

  // need mouse coordinates for raycasting.
  const mouse = new THREE.Vector2();
  const lastPos = new THREE.Vector2();

  // Adding OrbitControls for mouse interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Create a TransformControls instance
  const transformControls = new TransformControls(camera, renderer.domElement);
  scene.add(transformControls);

  // Adding GridHelper (a grid for visualizing the ground plane)
  const gridHelper = new THREE.GridHelper(1000, 1000, 0x888888, 0x444444);
  scene.add(gridHelper);

  // Adding AxesHelper (x: red, y: green, z: blue)
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);

  // Step 3: Creating a basic lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
  scene.add(ambientLight);

  // Step 3: Replacing AmbientLight with PointLight
  const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity 1, and range 100
  pointLight.position.set(10, 10, 10); // Set its position in the scene
  scene.add(pointLight);

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

  // Export function for GLB
  function exportGLB() {
    const exporter = new GLTFExporter();
    scene.remove(gridHelper);
    scene.remove(axesHelper);
    exporter.parse(
      scene,
      function (result) {
        const blob = new Blob([JSON.stringify(result)], {
          type: "model/gltf-binary",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "scene.glb";
        link.click();
      },
      { binary: true, includeCustomExtensions: true } // Export as .glb (Binary GLTF)
    );
    scene.add(gridHelper);
    scene.add(axesHelper);
  }

  // Button to trigger export
  exportButton.addEventListener("click", exportGLB);

  const draggableElements = document.querySelectorAll(".draggable");
  let draggedObjectType = null;

  draggableElements.forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      draggedObjectType = event.target.id; // Get the type of object (cube, sphere, cylinder)
    });
  });

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
      addObjectToScene(draggedObjectType);
    }
  });

  // Step 6: Add Objects to Scene
  function addObjectToScene(type) {
    let object;
    const container = document.createElement("div");
    container.id = "container";

    switch (type) {
      case "ground":
        const { container: width, inputElement: widthInput } = createInputField(
          "width",
          100
        );
        const { container: depth, inputElement: depthInput } = createInputField(
          "depth",
          100
        );
        container.appendChild(width);
        container.appendChild(depth);
        object = addGround(widthInput.value, depthInput.value);
        scene.add(object);
        widthInput.addEventListener("input", function (event) {
          scene.remove(object);
          object = addGround(event.target.value, depthInput.value);
          scene.add(object);
        });
        depthInput.addEventListener("input", function (event) {
          scene.remove(object);
          object = addGround(widthInput.value, event.target.value);
          scene.add(object);
        });
        break;
      case "warehouse":
        const { container: warehouseWidth, inputElement: warehouseWidthInput } =
          createInputField("warehouseWidth", 60);
        const { container: warehouseDepth, inputElement: warehouseDepthInput } =
          createInputField("warehouseDepth", 30);
        const {
          container: warehouseHeight,
          inputElement: warehouseHeightInput,
        } = createInputField("warehouseHeight", 5);
        container.appendChild(warehouseWidth);
        container.appendChild(warehouseDepth);
        container.appendChild(warehouseHeight);
        object = addWarehouse(
          warehouseHeightInput.value,
          warehouseWidthInput.value,
          warehouseDepthInput.value
        );
        scene.add(object);
        warehouseWidthInput.addEventListener("input", function (event) {
          scene.remove(object);
          object = addWarehouse(
            warehouseHeightInput.value,
            event.target.value,
            warehouseDepthInput.value
          );
          scene.add(object);
        });
        warehouseDepthInput.addEventListener("input", function (event) {
          scene.remove(object);
          object = addWarehouse(
            warehouseHeightInput.value,
            warehouseWidthInput.value,
            event.target.value
          );
          scene.add(object);
        });
        warehouseHeightInput.addEventListener("input", function (event) {
          scene.remove(object);
          object = addWarehouse(
            event.target.value,
            warehouseWidthInput.value,
            warehouseDepthInput.value
          );
          scene.add(object);
        });
        break;
      default:
        return;
    }
    document.getElementById(draggedObjectType).after(container);

    // Record the action for undo
    undoStack.push({
      action: "add",
      object: object,
    });

    // clear redo stack when a new action is made
    redoStack = [];
  }

  function createInputField(label, defaultValue) {
    const container = document.createElement("div");

    const labelElement = document.createElement("label");
    labelElement.textContent = label;

    const inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.value = defaultValue;

    container.appendChild(labelElement);
    container.appendChild(inputElement);

    return { container, inputElement };
  }

  function addGround(
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
    const ground = new THREE.Mesh(geometry, material);
    //   plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal

    // Rotate Plane to be perpendicular to Y-axis
    ground.rotation.x = -Math.PI / 2;

    ground.position.set(0, 0.05, 0);
    return ground;
  }

  function addWarehouse(height, width, depth) {
    // Define wall dimensions
    const wallHeight = height; // Height of the walls
    const thickness = 0.25; // Thickness of the walls
    const warehouseWidth = width; // Width of the room
    const warehouseDepth = depth; // Depth of the room

    // Load Texture
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load(
    //   "../images/warehouse_wall.jpg",
    //   function () {
    //     // Set texture repeat
    //     texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
    //     texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
    //     texture.repeat.set(10, 5); // Number of times to repeat in each direction
    //   }
    // ); // Replace with your texture path

    // Create Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      // map: texture,
      metalness: 0.1,
      roughness: 0.5,
    });

    var warehouseWalls = new THREE.Group();

    // Front Wall
    const frontWallLeft = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3, wallHeight, thickness),
      wallMaterial
    );
    frontWallLeft.position.set(
      -warehouseWidth / 3,
      wallHeight / 2,
      warehouseDepth / 2
    ); // Position at front
    const frontWallRight = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3, wallHeight, thickness),
      wallMaterial
    );
    frontWallRight.position.set(
      warehouseWidth / 3,
      wallHeight / 2,
      warehouseDepth / 2
    ); // Position at front
    const frontWallMiddle = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth / 3, wallHeight, thickness),
      wallMaterial
    );
    frontWallMiddle.position.set(
      0,
      wallHeight / 2,
      warehouseDepth / 2 - warehouseDepth / 8
    ); // Position at front
    const frontWallLeftTurn = new THREE.Mesh(
      new THREE.BoxGeometry(
        thickness,
        wallHeight,
        (warehouseDepth * 125) / 1000 + thickness
      ),
      wallMaterial
    );
    frontWallLeftTurn.position.set(
      -warehouseWidth / 6,
      wallHeight / 2,
      (warehouseDepth * 875) / 2000
    ); // Position at front
    const frontWallRightTurn = new THREE.Mesh(
      new THREE.BoxGeometry(
        thickness,
        wallHeight,
        (warehouseDepth * 125) / 1000 + thickness
      ),
      wallMaterial
    );
    frontWallRightTurn.position.set(
      warehouseWidth / 6,
      wallHeight / 2,
      (warehouseDepth * 875) / 2000
    ); // Position at front
    warehouseWalls.add(frontWallLeft);
    warehouseWalls.add(frontWallRight);
    warehouseWalls.add(frontWallMiddle);
    warehouseWalls.add(frontWallLeftTurn);
    warehouseWalls.add(frontWallRightTurn);

    // Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth, wallHeight, thickness),
      wallMaterial
    );
    backWall.position.set(0, wallHeight / 2, -warehouseDepth / 2); // Position at back
    warehouseWalls.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(thickness, wallHeight, warehouseDepth),
      wallMaterial
    );
    leftWall.position.set(-warehouseWidth / 2, wallHeight / 2, 0); // Position on left
    warehouseWalls.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(thickness, wallHeight, warehouseDepth),
      wallMaterial
    );
    rightWall.position.set(warehouseWidth / 2, wallHeight / 2, 0); // Position on right
    warehouseWalls.add(rightWall);

    warehouseWalls.position.set(0, 0, 0);
    // warehouseWalls = convertGroupToSingleMesh(warehouseWalls);

    return warehouseWalls;
  }

  function convertGroupToSingleMesh(group) {
    let mergedGeometry = new THREE.BufferGeometry(); // Placeholder for the merged geometry
    let mergedMaterial = null; // Will be used to store the material

    let geometries = [];

    // Traverse all child objects in the group
    group.traverse((child) => {
      if (child.isMesh) {
        // Ensure the geometry is in world space for proper merging
        child.updateMatrixWorld();

        // Apply the mesh's world transform to its geometry
        const clonedGeometry = child.geometry.clone();
        clonedGeometry.applyMatrix4(child.matrixWorld);

        // Collect the geometry for merging
        geometries.push(clonedGeometry);

        // Store the material of the first mesh (assuming all meshes use the same material)
        if (!mergedMaterial) {
          mergedMaterial = child.material;
        }
      }
    });

    // Merge all geometries into a single geometry
    mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

    // Create a new mesh from the merged geometry and the material
    const mergedMesh = new THREE.Mesh(mergedGeometry, mergedMaterial);

    // Optionally remove the original group from the scene and add the new mesh

    return mergedMesh; // Return the new merged mesh
  }

  function undoAction() {
    if (undoStack.length === 0) return;

    const lastAction = undoStack.pop();

    if (lastAction.action === "add") {
      scene.remove(lastAction.object);

      redoStack.push(lastAction);
    }
  }

  function redoAction() {
    if (redoStack.length === 0) return;

    const lastUndo = redoStack.pop();

    if (lastUndo.action === "add") {
      scene.add(lastUndo.object);

      undoStack.push(lastUndo);
    }
  }

  // Function to create a small sphere to represent the local origin
  function createLocalOriginMarker() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const marker = new THREE.Mesh(geometry, material);
    scene.add(marker);
    return marker;
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "z") {
      event.preventDefault();
      undoAction();
    } else if (event.ctrlKey && event.key === "y") {
      event.preventDefault();
      redoAction();
    }
  });

  // Step 7: Handle Window Resizing
  window.addEventListener("resize", () => {
    camera.aspect = (window.innerWidth * 0.8) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
  });

  function onMouseMove(e) {
    // regularly updating the position of mouse pointer when it is moved on rendered window.
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onMouseDown(e) {
    lastPos.x = (e.clientX / window.innerWidth) * 2 - 1;
    lastPos.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  // Function to create an outline for the object
  function createOutline(object) {
    // Use EdgesGeometry to create geometry for edges only
    const edgesGeometry = new THREE.EdgesGeometry(object.geometry.clone());
    const outline = new THREE.LineSegments(
      edgesGeometry,
      new THREE.LineBasicMaterial({
        color: 0x00ff00, // Set to green for highlighting
        linewidth: 2, // Line width (though this might not be visible in all renderers)
      })
    );
    outline.position.copy(object.position);
    outline.rotation.copy(object.rotation);
    outline.scale.copy(object.scale);

    // Manually update the matrix to ensure it matches perfectly
    outline.matrixAutoUpdate = false; // Disable auto update
    outline.updateMatrix(); // Apply the matrix updates
    return outline;
  }

  // function onMouseUp(e) {
  //   if ((lastPos.distanceTo(mouse) === 0) & (e.button === 0)) {
  //     raycaster.setFromCamera(mouse, camera);
  //     // This method sets up the raycaster to cast a ray from the camera into the 3D scene based on the current mouse position. It allows you to determine which objects in the scene are intersected by that ray.
  //     const intersects = raycaster.intersectObjects(
  //       scene.children.filter((object) => {
  //         return object !== gridHelper && object != axesHelper;
  //       }),
  //       true
  //     );
  //     // we get the objects from the model as list that are intersected by the casted ray.

  //     if (intersects.length > 0) {
  //       // Get the first intersected object
  //       const newSelectedObject = intersects[0].object;

  //       // Deselect the previous object if it exists
  //       if (selectedObject && selectedObjectOutline) {
  //         selectedObject.remove(selectedObjectOutline);
  //         scene.remove(localOriginMarker); // Remove previous local origin marker
  //       }

  //       // Update the selected object
  //       selectedObject = newSelectedObject;

  //       // Create and add the outline for the new selected object
  //       selectedObjectOutline = createOutline(selectedObject);
  //       selectedObject.add(selectedObjectOutline);

  //       // Create and position the local origin marker
  //       if (!localOriginMarker) {
  //         localOriginMarker = createLocalOriginMarker();
  //       }
  //       localOriginMarker.position.copy(selectedObject.position);
  //       localOriginMarker.visible = true; // Show local origin marker

  //       // Attach TransformControls to the selected object
  //       transformControls.attach(selectedObject);
  //       // Disable OrbitControls when interacting with TransformControls
  //       transformControls.addEventListener(
  //         "dragging-changed",
  //         function (event) {
  //           controls.enabled = !event.value;
  //         }
  //       );
  //     } else {
  //       // If no object is selected, detach controls and hide the origin marker
  //       transformControls.detach(selectedObject);
  //       if (localOriginMarker) {
  //         localOriginMarker.visible = false;
  //       }
  //       // Remove outline and deselect if nothing was clicked
  //       if (selectedObjectOutline) {
  //         selectedObject.remove(selectedObjectOutline);
  //         selectedObjectOutline = null;
  //       }
  //       selectedObject = null;
  //     }
  //   }
  // }

  function onMouseUp(e) {
    if ((lastPos.distanceTo(mouse) === 0) & (e.button === 0)) {
      raycaster.setFromCamera(mouse, camera);
      // This method sets up the raycaster to cast a ray from the camera into the 3D scene based on the current mouse position. It allows you to determine which objects in the scene are intersected by that ray.
      const intersects = raycaster.intersectObjects(
        scene.children.filter((object) => {
          return object !== gridHelper && object != axesHelper;
        }),
        true
      );
      // we get the objects from the model as list that are intersected by the casted ray.

      if (intersects.length > 0) {
        // Get the first intersected object
        const newSelectedObject = intersects[0].object;

        // Deselect the previous object if it exists
        if (selectedObject && selectedObjectOutline) {
          selectedObject.remove(selectedObjectOutline);
          scene.remove(localOriginMarker); // Remove previous local origin marker
        }

        // Update the selected object
        selectedObject = newSelectedObject;

        // Create and add the outline for the new selected object
        selectedObjectOutline = createOutline(selectedObject);
        selectedObject.add(selectedObjectOutline);

        // Create and position the local origin marker
        if (!localOriginMarker) {
          localOriginMarker = createLocalOriginMarker();
        }
        localOriginMarker.position.copy(selectedObject.position);
        localOriginMarker.visible = true; // Show local origin marker

        // Attach TransformControls to the selected object
        transformControls.attach(selectedObject);
        // Disable OrbitControls when interacting with TransformControls
        transformControls.addEventListener(
          "dragging-changed",
          function (event) {
            controls.enabled = !event.value;
          }
        );
      } else {
        // If no object is selected, detach controls and hide the origin marker
        transformControls.detach(selectedObject);
        if (localOriginMarker) {
          localOriginMarker.visible = false;
        }
        // Remove outline and deselect if nothing was clicked
        if (selectedObjectOutline) {
          selectedObject.remove(selectedObjectOutline);
          selectedObjectOutline = null;
        }
        selectedObject = null;
      }
    }
  }

  // // Texture upload button and file input handling
  // const uploadButton = document.getElementById('uploadButton');
  // const fileInput = document.getElementById('textureUpload');

  // // Button click to trigger the hidden file input
  // uploadButton.addEventListener('click', () => {
  //     fileInput.click();
  // });

  // // File input change event to load and apply the texture
  // fileInput.addEventListener('change', (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.onload = function (e) {
  //             const textureLoader = new THREE.TextureLoader();
  //             textureLoader.load(e.target.result, (texture) => {
  //                 if (selectedObject) {
  //                     if (selectedObject.material.map) {
  //                         selectedObject.material.map.dispose(); // Free old texture
  //                     }
  //                     selectedObject.material.map = texture;
  //                     selectedObject.material.needsUpdate = true;
  //                 }
  //             });
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // });

  window.addEventListener("mousemove", onMouseMove); // triggered when mouse pointer is moved.
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp); // triggered when mouse pointer is clicked.
});
