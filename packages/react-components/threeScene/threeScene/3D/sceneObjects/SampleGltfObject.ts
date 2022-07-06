import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import AssetManager from "../managers/AssetManager";
import BaseSceneObject from "./BaseSceneObject";
import debug from "@wbe/debug";
import { Box3 } from "three";

const componentName = "SampleGltfObject";
const log = debug(`front:3D:${componentName}`);
class SampleGltfObject extends BaseSceneObject {
  constructor() {
    super();
    this._isInteractive = true;
  }

  createSubject() {
    // Get asset data from id
    const gltfData: GLTF = AssetManager.getAsset("model-test").data as GLTF;

    this.subject = gltfData.scene;

    // Set 3D
    this.name = componentName;
    this.subject.name = componentName + "_subject";

    // Set transforms
    this.position.set(0, 0, -3);
  }

  // Auto loop in loops
  loop(deltaTime: number) {
    super.loop(deltaTime);
    this.subject.rotation.y += 0.5 * deltaTime;
  }
}

export { SampleGltfObject as default };
