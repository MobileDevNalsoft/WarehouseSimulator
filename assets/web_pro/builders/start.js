import * as THREE from 'three';
import { buildCompund } from "compound";
import { buildWarehouseExterior } from "warehouse_exterior";
import { buildAreas } from 'warehouse_interior';

let compoundLeftCorner = new THREE.Vector3();
let warehouseCenter = new THREE.Vector3();

export function startBuildingWarehouse(json, scene){
    buildCompund(json ,scene);
    // json["objects"].forEach(item => {
    //     console.log("name " + item["name"]);
    //     switch(item["name"]){
    //         case "compound":
    //             console.log("inside name " + item["name"]);
    //             compoundLeftCorner.set(-item['width']/2,0,-item['depth']/2);
    //             buildCompund(scene, item['name'], item['width'], item['depth'], item['wallThickness'], item['wallHeight']);
    //             break;
    //         case "warehouse_exterior":
    //             console.log("inside name " + item["name"]);
    //             warehouseCenter = buildWarehouseExterior(scene, item['name'], item['width'], item['depth'], item['wallThickness'], item['wallHeight'], compoundLeftCorner);
    //             break;
    //         case "areas":
    //             console.log("inside name " + item["name"]);
    //             buildAreas(scene, item, warehouseCenter);
    //     }
    // });
}