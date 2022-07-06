import { Mesh, Group, BufferGeometry, Material, Object3D, Box3 } from "three";
import EventEmitter from "events";

const componentName = "BaseSceneObject";

class BaseSceneObject extends Object3D {
  subject: Mesh<BufferGeometry, Material | Material[]> | Group;
  events: EventEmitter;
  geometry: BufferGeometry;
  material: any;

  _isDebug: boolean;
  componentName: string;
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

  _isInteractive: boolean = false;
  get isInteractive() {
    return this._isInteractive;
  }
  set isInteractive(value) {
    this._isInteractive = value;
  }

  constructor(initiated: boolean = true) {
    super();
    this.componentName = componentName;
    if (initiated) this.init();

    this.events = new EventEmitter();
    this.events.on("click", this.onClick.bind(this));
  }

  init() {
    this.createSubject();
    this.add(this.subject);
  }

  createSubject() {
    this.subject = new Mesh();
  }

  onClick(event) {
    console.log(event);
  }

  /**
   * [findObjectByName find object3d in object's children by name]
   */
  public findObjectByName(name: string, parent: Object3D = null): Object3D {
    let mesh: Object3D = null;
    parent = parent || this.subject;

    if (!parent) return;

    parent.traverse((child: Object3D) => {
      if (child.name === name) {
        mesh = child;
      }
    });
    return mesh;
  }

  // Auto loop in loops
  loop(deltaTime?: number, elapsedTime?: number) {
    if (this._isPaused) return;
  }
}

export { BaseSceneObject as default };
