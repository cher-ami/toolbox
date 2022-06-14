import { Mesh, Group, BufferGeometry, Material } from "three"


// TODO:  extend 3dObject
class BaseSceneObject {
  sceneObject: Mesh<BufferGeometry, Material | Material[]> | Group

  geometry: BufferGeometry
  material: any

  _isDebug: boolean
  get isDebug() {
    return this._isDebug
  }
  set isDebug(value) {
    this._isDebug = value
  }

  _isPaused: boolean
  get isPaused() {
    return this._isPaused
  }
  set isPaused(value) {
    this._isPaused = value
  }

  _isVisible: boolean
  get isVisible() {
    return this._isVisible
  }
  set isVisible(value) {
    this._isVisible = value
    this.sceneObject.visible = value
  }

  constructor() {
    this.createMesh()
  }
  createMesh() {
    this.sceneObject = new Mesh()
  }

  // Auto loop in loops
  loop(deltaTime?: number, elapsedTime?: number) {
    if (this._isPaused) return
  }
}

export { BaseSceneObject as default }
