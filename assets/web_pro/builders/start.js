import { buildCompund } from "compound";

export function startBuildingWarehouse(json, scene){
    json["objects"].forEach(item => {
        switch(item["name"]){
            case "compound":
                buildCompund(scene, item['name'], item['width'], item['depth'], item['wallThickness'], item['wallHeight']);
        }
    });
}