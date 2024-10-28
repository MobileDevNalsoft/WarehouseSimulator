import * as THREE from "three";
import { getPlaneGeometry } from "plane";
import { convertGroupToSingleMesh } from "meshMerge";

export function buildCompund(scene, name, width, depth, wallThickness, wallHeight) {
    const base = getPlaneGeometry(width, depth);

    base.position.set(0, 0, 0);

    scene.add(base);

    const walls = compundWallBuilder(width, depth, wallThickness, wallHeight);

    scene.add(walls);
}

function compundWallBuilder(width, depth, thickness, height) {
    const wallMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.5,
    });

    var warehouseWalls = new THREE.Group();

    // Front Wall
    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(width+1, height, thickness),
        wallMaterial
    );
    frontWall.position.set(0, height / 2, depth / 2); // Position at front
    warehouseWalls.add(frontWall);

    // Back Wall
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(width+1, height, thickness),
        wallMaterial
    );
    backWall.position.set(0, height / 2, -depth / 2); // Position at back
    warehouseWalls.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, height, depth),
        wallMaterial
    );
    leftWall.position.set(-width / 2, height / 2, 0); // Position on left
    warehouseWalls.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, height, depth),
        wallMaterial
    );
    rightWall.position.set(width / 2, height / 2, 0); // Position on right
    warehouseWalls.add(rightWall);

    warehouseWalls.position.set(0, 0, 0);
    warehouseWalls = convertGroupToSingleMesh(warehouseWalls);

    return warehouseWalls;
}