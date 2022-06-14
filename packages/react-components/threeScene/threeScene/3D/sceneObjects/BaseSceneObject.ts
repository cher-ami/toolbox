import { Mesh, BufferGeometry, Material } from "three"

// TODO: extend from BaseSceneObject
class BaseSceneObject {
  sceneObject: Mesh
  isPaused: boolean
  geometry: BufferGeometry
  material: any

  _isDebug: boolean
  get isDebug() {
    return this._isDebug
  }
  set isDebug(value) {
    this._isDebug = value
  }

  constructor() {
    this.createMesh()
  }
  createMesh() {
    this.sceneObject = new Mesh()
  }

  // Auto loop in loops
  loop(deltaTime: number) {
    if (this.isPaused) return
  }
}

export { BaseSceneObject as default }
