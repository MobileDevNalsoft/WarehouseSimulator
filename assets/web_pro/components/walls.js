export function addWalls(height, width, depth) {
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