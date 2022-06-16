import { Mesh, Group, BufferGeometry, Material, Object3D } from "three";

class BaseSceneObject extends Object3D {
  sceneObject: Mesh<BufferGeometry, Material | Material[]> | Group;

  geometry: BufferGeometry;
  material: any;

  _isDebug: boolean;
  get isDebug() {
    return this._isDebug;
  }
  set isDebug(value) {
    this._isDebug = value;
  }

  _isPaused: boolean;
  get isPaused() {
    return this._isPaused;
  }
  set isPaused(value) {
    this._isPaused = value;
  }

  constructor() {
    super();
    this.createMesh();
    this.add(this.sceneObject);
  }
  createMesh() {
    this.sceneObject = new Mesh();
  }

  // Auto loop in loops
  loop(deltaTime?: number, elapsedTime?: number) {
    if (this._isPaused) return;
  }
}

export { BaseSceneObject as default };
