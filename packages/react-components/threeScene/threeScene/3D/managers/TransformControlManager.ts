import {
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector2,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import CameraManager from "./CameraManager";

/**
 * []
 * @class TransformControlManager
 */
class TransformControlManager {
  protected _controls: TransformControls;
  protected _isTransformControlsModeActive: boolean;
  public transformControlMesh: Object3D;
  protected _raycaster: Raycaster;
  protected _pointer: Vector2;
  private _cameraControls: CameraManager;

  protected _enabled: boolean = false;
  private _rendererDomContainer: HTMLElement;
  private _camera: PerspectiveCamera | OrthographicCamera;
  private _transformableObjects: any;
  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this._controls.enabled = enabled;
  }
  get enabled(): boolean {
    return this._enabled;
  }

  get controls() {
    return this._controls;
  }

  constructor({
    camera,
    cameraControls,
    rendererDomContainer,
    transformableObjects,
  }: {
    camera: PerspectiveCamera | OrthographicCamera;
    cameraControls: CameraManager;
    rendererDomContainer: HTMLElement;
    transformableObjects: Object3D[];
  }) {
    this._camera = camera;
    this._cameraControls = cameraControls;
    this._rendererDomContainer = rendererDomContainer;
    this._transformableObjects = transformableObjects;

    this._controls = new TransformControls(camera, rendererDomContainer);
    this._controls.showY = false;

    this._raycaster = new Raycaster();
    this._pointer = new Vector2();

    this._initEvents();
  }

  // init events keyboard
  _initEvents() {
    // register event keydown on key Meta
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.enabled) return;
      // Enable mode transform
      if (e.key === "Meta") {
        this._isTransformControlsModeActive = true;
        this.controls.attach(this.transformControlMesh);
        this._cameraControls.enabled = false;

        this.controls.showX = true;
        this.controls.showY = true;
        this.controls.showZ = true;
        this.controls.setMode("translate");
      }

      // Enable mode shift
      if (e.key === "Shift") {
        if (this._isTransformControlsModeActive) {
          this.controls.setMode("rotate");
          this.controls.showX = true;
          this.controls.showY = true;
          this.controls.showZ = true;
        }
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (!this.enabled) return;
      if (e.key === "Meta") {
        this._isTransformControlsModeActive = false;
        this.controls.detach();
        this._cameraControls.enabled = true;
        this.controls.showX = false;
        this.controls.showY = false;
        this.controls.showZ = false;
        this.controls.setMode("translate");
      }

      if (e.key === "Shift") {
        if (this._isTransformControlsModeActive) {
          this.controls.setMode("rotate");
          this.controls.showX = false;
          this.controls.showY = false;
          this.controls.showZ = false;
        }
      }
    });

    // on mouse click set pointer position
    document.addEventListener("click", (e: MouseEvent) => {
      if (!this.enabled) return;
      this._pointer.x =
        (e.clientX / this._rendererDomContainer.clientWidth) * 2 - 1;
      this._pointer.y =
        -(e.clientY / this._rendererDomContainer.clientHeight) * 2 + 1;

      this._raycastObjects(this._transformableObjects);
    });
  }

  private _raycastObjects(sceneObjects: Object3D[]) {
    // update the picking ray with the camera and pointer position
    this._raycaster.setFromCamera(this._pointer, this._camera);

    // calculate objects intersecting the picking ray
    const intersects = this._raycaster.intersectObjects(sceneObjects);
    // if there is one (or more) intersections
    if (intersects.length > 0) {
      // get the first one
      const intersect = intersects[0];
      // get the object intersected
      const sceneObject = intersect.object.name.includes("sceneObject")
        ? intersect.object
        : this._getParentSceneObject(intersect.object);

      this.setTransformMesh(sceneObject);
    }
  }

  private _getParentSceneObject(sceneObject: Object3D) {
    // recursively find the parent with name include sceneObject
    if (sceneObject.parent) {
      if (sceneObject.parent.name.includes("sceneObject")) {
        return sceneObject.parent;
      }
      return this._getParentSceneObject(sceneObject.parent);
    }
  }

  public setTransformMesh(mesh: Object3D) {
    this.transformControlMesh = mesh;

    if (this._isTransformControlsModeActive) {
      this.controls.detach();
      this.controls.attach(this.transformControlMesh);
    }
  }

  public dispose() {
    this.controls.dispose();
  }
}

export default TransformControlManager;
