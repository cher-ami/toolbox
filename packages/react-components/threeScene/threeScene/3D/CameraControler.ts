import CameraControls from "camera-controls";
import {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  PerspectiveCamera,
  OrthographicCamera,
} from "three";
import sceneConfig from "./data/sceneConfig";

// Get only what we need for camera controls
const subsetOfTHREE = {
  MOUSE: MOUSE,
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

export type TCameraControlMode = "orbit" | "firstPerson";
const EPS = 1e-5;

// TODO: rajouter un click sur un objet mouvement camera
/**
 * Controler for camera interactions and movements
 * @class CameraControler
 */
class CameraControler {
  camera: PerspectiveCamera | OrthographicCamera;
  rendererDomContainer: HTMLElement;
  controls: CameraControls;
  hasControlsUpdated: boolean;
  basePosition: Vector3;

  private _mode: TCameraControlMode;
  set mode(mode: string) {
    this.setMode(mode);
    this.mode = mode;
  }
  get mode(): TCameraControlMode {
    return this._mode;
  }

  private _enabled: boolean = true;
  set enabled(enabled: boolean) {
    this.controls.enabled = enabled;
    this._enabled = enabled;
  }
  get enabled(): boolean {
    return this._enabled;
  }

  constructor(
    camera: PerspectiveCamera | OrthographicCamera,
    rendererDomContainer: HTMLElement,
    mode: TCameraControlMode = "orbit"
  ) {
    this.camera = camera;
    this.rendererDomContainer = rendererDomContainer;

    CameraControls.install({ THREE: subsetOfTHREE });

    this.basePosition = this.camera.position.clone();

    // in order to archive FPS look, set EPSILON for the distance to the center
    this.camera.position.set(0, 0, EPS);

    this.controls = new CameraControls(this.camera, this.rendererDomContainer);

    this.setMode(mode);

    // TODO: temp
    window["__CAM_CONTROLS__"] = this;
  }

  setMode(mode: string) {
    this.controls.reset();
    if (mode === "orbit") {
      this.setupModeOrbit();
    } else if (mode === "firstPerson") {
      this.setupModeFirstPerson();
    }
  }

  setupModeOrbit() {
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;
    this.controls.azimuthRotateSpeed = 1;
    this.controls.polarRotateSpeed = 1;
    this.controls.truckSpeed = 2;
    this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
    this.controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;

    this.controls.moveTo(
      this.basePosition.x,
      this.basePosition.y,
      this.basePosition.z,
      false
    );
    this.controls.setTarget(0, 0, EPS);

    this.controls.saveState();
  }

  setupModeFirstPerson() {
    this.controls.minDistance = this.controls.maxDistance = 1;
    this.controls.azimuthRotateSpeed = -0.3; // negative value to invert rotation direction
    this.controls.polarRotateSpeed = -0.3; // negative value to invert rotation direction
    this.controls.truckSpeed = 10;
    this.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    this.controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;

    this.controls.moveTo(0, 0, EPS, false);
    this.controls.setTarget(0, 0, 0);

    this.controls.saveState();
  }

  loop(deltaTime: number) {
    if (!this._enabled) return;
    // update camera controls
    this.hasControlsUpdated = this.controls.update(deltaTime);
  }

  dispose() {
    this.controls.dispose();
  }
}

export default CameraControler;
