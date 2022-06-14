import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import AssetManager from "../AssetManager"
import BaseSceneObject from "./BaseSceneObject"
import debug from "@wbe/debug"

const componentName = "SampleGltfObject"
const log = debug(`front:3D:${componentName}`)
class SampleObject extends BaseSceneObject {
  constructor() {
    super()
  }

  createMesh() {
    const gltfData: GLTF = AssetManager.getAsset("model-spot").asset as GLTF;
    this.sceneObject = gltfData.scene
    this.sceneObject.name = componentName
    this.sceneObject.position.set(0, 0.5, 0)
  }

  // Auto loop in loops
  loop(deltaTime: number) {
    super.loop(deltaTime)
    this.sceneObject.rotation.y += 0.5 * deltaTime
  }
}

export { SampleObject as default }
