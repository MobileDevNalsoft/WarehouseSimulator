import * as THREE from "three";
import { getPlaneGeometry } from "plane";
import { buildWarehouseExterior } from "warehouse_exterior";
import { convertGroupToSingleMesh } from "meshMerge";

export function buildCompund(json, scene) {
    let name = json['compound']['name'];
    let width = json['compound']['width'];
    let depth = json['compound']['depth'];
    let wallThickness = json['compound']['wallThickness'];
    let wallHeight = json['compound']['wallHeight'];

    const compundGroup = new THREE.Group();

    const base = getPlaneGeometry(width, depth);

    base.position.set(0, 0, 0);

    compundGroup.add(base);

    const walls = compundWallBuilder(width, depth, wallThickness, wallHeight);

    compundGroup.add(walls);

    const compound = convertGroupToSingleMesh(compundGroup);

    compound.name = name;

    scene.add(compound);

    let compoundLeftCorner = new THREE.Vector3(-width/2,0,-depth/2);

    buildWarehouseExterior(json, scene, compoundLeftCorner);
}

function compundWallBuilder(width, depth, thickness, height) {
    const wallMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.5,
    });

    var warehouseWalls = new THREE.Group();

    // Front Wall
    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(width+thickness, height, thickness),
        wallMaterial
    );
    frontWall.position.set(0, height / 2, depth / 2); // Position at front
    warehouseWalls.add(frontWall);

    // Back Wall
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(width+thickness, height, thickness),
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