import * as THREE from 'three';

export function addGround(
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