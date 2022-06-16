import { Mesh, Group, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Find inside a gltf scene object the node with the given name
 * @param {GLTF} gltf - gltf object
 * @param {string} name - name of the object
 * @returns  {Object3D} - object3d
 */
export default function findNodeFromGLTF(
  gltf: GLTF,
  name: string
): Mesh | Group | Object3D {
  function findNode(name, array) {
    for (const node of array) {
      if (node.name === name) return node;
      if (node.children) {
        const child = findNode(name, node.children);
        if (child) return child;
      }
    }
  }
  return findNode(name, gltf?.scene?.children);
}
