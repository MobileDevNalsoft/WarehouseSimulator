// import { addPlane } from "plane";

// export function addObjectToScene(scene, type) {
//     let object;
//     const container = document.createElement("div");
//     container.id = "container";

//     switch (type) {
//       case "ground":
//         const { container: width, inputElement: widthInput } = createInputField(
//           "width",
//           100
//         );
//         const { container: depth, inputElement: depthInput } = createInputField(
//           "depth",
//           100
//         );
//         container.appendChild(width);
//         container.appendChild(depth);
//         object = addGround(widthInput.value, depthInput.value);
//         scene.add(object);
//         widthInput.addEventListener("input", function (event) {
//           scene.remove(object);
//           object = addGround(event.target.value, depthInput.value);
//           scene.add(object);
//         });
//         depthInput.addEventListener("input", function (event) {
//           scene.remove(object);
//           object = addGround(widthInput.value, event.target.value);
//           scene.add(object);
//         });
//         break;
//       case "warehouse":
//         const { container: warehouseWidth, inputElement: warehouseWidthInput } =
//           createInputField("warehouseWidth", 60);
//         const { container: warehouseDepth, inputElement: warehouseDepthInput } =
//           createInputField("warehouseDepth", 30);
//         const {
//           container: warehouseHeight,
//           inputElement: warehouseHeightInput,
//         } = createInputField("warehouseHeight", 5);
//         container.appendChild(warehouseWidth);
//         container.appendChild(warehouseDepth);
//         container.appendChild(warehouseHeight);
//         object = addWarehouse(
//           warehouseHeightInput.value,
//           warehouseWidthInput.value,
//           warehouseDepthInput.value
//         );
//         scene.add(object);
//         warehouseWidthInput.addEventListener("input", function (event) {
//           scene.remove(object);
//           object = addWarehouse(
//             warehouseHeightInput.value,
//             event.target.value,
//             warehouseDepthInput.value
//           );
//           scene.add(object);
//         });
//         warehouseDepthInput.addEventListener("input", function (event) {
//           scene.remove(object);
//           object = addWarehouse(
//             warehouseHeightInput.value,
//             warehouseWidthInput.value,
//             event.target.value
//           );
//           scene.add(object);
//         });
//         warehouseHeightInput.addEventListener("input", function (event) {
//           scene.remove(object);
//           object = addWarehouse(
//             event.target.value,
//             warehouseWidthInput.value,
//             warehouseDepthInput.value
//           );
//           scene.add(object);
//         });
//         break;
//       default:
//         return;
//     }
//     document.getElementById(type).after(container);

//     // Record the action for undo
//     undoStack.push({
//       action: "add",
//       object: object,
//     });

//     // clear redo stack when a new action is made
//     redoStack = [];
//   }

//   function createInputField(label, defaultValue) {
//     const container = document.createElement("div");

//     const labelElement = document.createElement("label");
//     labelElement.textContent = label;

//     const inputElement = document.createElement("input");
//     inputElement.type = "number";
//     inputElement.value = defaultValue;

//     container.appendChild(labelElement);
//     container.appendChild(inputElement);

//     return { container, inputElement };
//   }