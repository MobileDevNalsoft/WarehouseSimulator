import * as THREE from "three";
import { getBoxGeometry } from "box";
import { convertGroupToSingleMesh } from "meshMerge";
import { buildAreas } from "warehouse_interior";

export function buildWarehouseExterior(
  json,
  scene,
  compoundLeftCorner
) {
  let name = json['warehouse_exterior']['name'];
  let width = json['warehouse_exterior']['width'];
  let depth = json['warehouse_exterior']['depth'];
  let wallThickness = json['warehouse_exterior']['wallThickness'];
  let wallHeight = json['warehouse_exterior']['wallHeight'];

  var warehouseWalls = new THREE.Group();

  // Front Wall
  const frontWall = getBoxGeometry(width+wallThickness, wallHeight, wallThickness);
  frontWall.position.set(0, wallHeight / 2, depth / 2); // Position at back
  warehouseWalls.add(frontWall);

  // // Back Wall
  const backWall = getBoxGeometry(width+wallThickness, wallHeight, wallThickness);
  backWall.position.set(0, wallHeight / 2, -depth / 2); // Position at back
  warehouseWalls.add(backWall);

  // Left Wall
  const leftWall = getBoxGeometry(wallThickness, wallHeight, depth);
  leftWall.position.set(-width / 2, wallHeight / 2, 0); // Position on left
  warehouseWalls.add(leftWall);

  // Right Wall
  const rightWall = getBoxGeometry(wallThickness, wallHeight, depth);
  rightWall.position.set(width / 2, wallHeight / 2, 0); // Position on right
  warehouseWalls.add(rightWall);

  warehouseWalls = convertGroupToSingleMesh(warehouseWalls);
  warehouseWalls.position.set(compoundLeftCorner.x+width/2+14, compoundLeftCorner.y, compoundLeftCorner.z+depth/2+14);

  warehouseWalls.name = name;

  scene.add(warehouseWalls);
  
  let worldPosition = new THREE.Vector3();
  warehouseWalls.updateMatrixWorld();
  warehouseWalls.getWorldPosition(worldPosition);

  buildAreas(json, scene, worldPosition, width, depth);
}

function buildFrontWall(width, depth, wallThickness, wallHeight) {
  const frontWallGroup = new THREE.Group();

  // Front Wall
  const frontWallLeft = getBoxGeometry(width / 3, wallHeight, wallThickness);
  frontWallLeft.position.set(-width / 3, wallHeight / 2, depth / 2); // Position at front
  frontWallGroup.add(frontWallLeft);

  const frontWallRight = getBoxGeometry(width / 3, wallHeight, wallThickness);
  frontWallRight.position.set(width / 3, wallHeight / 2, depth / 2); // Position at front
  frontWallGroup.add(frontWallRight);

  const frontWallMiddle = getBoxGeometry(width / 3, wallHeight, wallThickness);
  frontWallMiddle.position.set(0, wallHeight / 2, depth / 2 - depth / 8); // Position at front
  frontWallGroup.add(frontWallMiddle);

  const frontWallLeftTurn = getBoxGeometry(
    wallThickness,
    wallHeight,
    (depth * 125) / 1000 + wallThickness
  );
  frontWallLeftTurn.position.set(
    -width / 6,
    wallHeight / 2,
    (depth * 875) / 2000
  ); // Position at front
  frontWallGroup.add(frontWallLeftTurn);

  const frontWallRightTurn = getBoxGeometry(
    wallThickness,
    wallHeight,
    (depth * 125) / 1000 + wallThickness
  );
  frontWallRightTurn.position.set(
    width / 6,
    wallHeight / 2,
    (depth * 875) / 2000
  ); // Position at front
  frontWallGroup.add(frontWallRightTurn);

  return frontWallGroup;
}
