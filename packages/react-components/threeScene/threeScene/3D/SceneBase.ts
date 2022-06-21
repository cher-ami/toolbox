import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  CameraHelper,
  Fog,
  BufferGeometry,
  Material,
  Mesh,
  Euler,
  Vector3,
  Color,
  Object3D,
  Group,
} from "three";
import threeDevToolBrowserPlugin from "./helpers/threeDevToolBrowserPlugin";

import PerformanceWatcher from "./PerformanceWatcher";
import AssetManager, { IFile } from "./managers/AssetManager";
import debug from "@wbe/debug";
import { limitNumberRange } from "./utils/limitNumberRange";
import BaseSceneObject from "./sceneObjects/BaseSceneObject";
import sceneConfig from "./data/sceneConfig";
// NOTE: Remove if not using postprocessing
import PostProcessing from "./PostProcessing";
import cleanMaterial from "./helpers/cleanMaterial";
import CameraManager from "./managers/CameraManager";

// TODO: add https://github.com/pmndrs/detect-gpu

const componentName = "SceneBase";
const log = debug(`front:3D:${componentName}`);

export interface IObjectTransforms {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export const BASE_RENDERER_SIZE = {
  width: window.innerWidth,
  height: window.innerHeight,
};
export const BACKGROUND_COLOR = 0xf1f2f3;

/**
 * Bare minimum to setup a three scene with a camera and a renderer
 * in context of the threeScene react component
 * @class SceneBase
 */
class SceneBase {
  protected _domContainer: HTMLElement;
  protected _renderer: WebGLRenderer;
  _sceneObjects: Array<BaseSceneObject | Object3D>;
  protected _backgroundColor: Color;
  public get renderer() {
    return this._renderer;
  }
  protected _camera: PerspectiveCamera;
  public get camera() {
    return this._camera;
  }
  protected _isDebugSceneActive: boolean;
  protected get isDebugSceneActive(): boolean {
    return this._isDebugSceneActive;
  }
  protected _cameraDebug: PerspectiveCamera;
  protected _scene: Scene;
  public get scene() {
    return this._scene;
  }
  protected _rendererSize: { width: number; height: number };

  protected _fog: Fog;

  protected _centerCoords: { x: number; y: number };

  protected _cameraDebugControls: CameraManager;
  protected _cameraHelper: CameraHelper;

  protected _clock: Clock;
  protected _deltaTime: number;
  public get deltaTime() {
    return this._deltaTime;
  }
  protected _rafId: number;
  protected _resizeThrottled: () => {};
  protected _loopBinded: () => void;

  protected _ready: boolean = false;

  protected _resizeObserver: ResizeObserver;

  protected _postprocessing: PostProcessing; // EffectComposer

  public performance: PerformanceWatcher;

  public paused: boolean = false;

  /**
   * Constructor of the scene base class (threeScene)
   * @constructor SceneBase
   */
  constructor() {
    this._isDebugSceneActive = window.location.hash === "#debug";
    this._backgroundColor = new Color(sceneConfig.sceneEnvBackground.color);

    this.performance = new PerformanceWatcher();

    this._loopBinded = this.loop.bind(this);
  }

  /**
   * [init description]
   * @param domContainer [description]
   */
  public async init({
    domContainer,
    assetsData,
    staticLoadersBasePath,
  }: {
    domContainer: HTMLDivElement;
    assetsData: IFile[];
    staticLoadersBasePath: string;
  }): Promise<void> {
    this._domContainer = domContainer;

    // set renderer size from node container
    this._rendererSize = {
      width: domContainer.clientWidth,
      height: domContainer.clientHeight,
    };
    this._centerCoords = {
      x: this._rendererSize.width * 0.5,
      y: this._rendererSize.height * 0.5,
    };

    this._renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: true,
      alpha: true,
    });
    this._renderer.autoClear = false;
    this._renderer.info.autoReset = false; // https://bit.ly/3ICFdf8

    this.renderer.setPixelRatio(
      limitNumberRange(1, window.devicePixelRatio, 2)
    );

    // Tone mapping
    //this._renderer.toneMapping = ReinhardToneMapping // NOTE: Advised tone mapping for realistic rendering

    this._renderer.setSize(this._rendererSize.width, this._rendererSize.height);
    this._domContainer.appendChild(this._renderer.domElement);

    this._clock = new Clock();

    this._setupScene();

    // Load assets
    try {
      if (assetsData && assetsData.length > 0)
        await AssetManager.init({
          renderer: this._renderer,
          staticLoadersBasePath,
        });
      await AssetManager.load(assetsData);
    } catch (error) {
      console.error("Failed to load asset", error);
    }

    this._initSceneObjects();

    // NOTE: remove if not using postprocessing
    this._postprocessing = new PostProcessing({
      renderer: this._renderer,
      scene: this._scene,
      camera: this._camera,
    });

    this._ready = true;

    const resizeObserver = new ResizeObserver((entries) =>
      this._resize(entries[0])
    );
    resizeObserver.observe(this._domContainer);

    this._setDebugMode(this._isDebugSceneActive);

    // Listen to debug event
    this._listenEventDebug();

    // init plugin browser for dev tools
    threeDevToolBrowserPlugin(this.renderer, this.scene);
  }

  /**
   * Setup main scene & elements
   */
  protected _setupScene(): void {
    this._scene = new Scene();

    //this._scene.background =
    if (sceneConfig.sceneFog.enabled) {
      this._fog = new Fog(
        sceneConfig.sceneFog.color || this._backgroundColor,
        sceneConfig.sceneFog.near,
        sceneConfig.sceneFog.far
      );
      this._scene.fog = this._fog;
    }

    // Main Camera
    this._camera = this._setupMainCamera();

    // Setup camera helper
    this._cameraHelper = new CameraHelper(this._camera);
    this._cameraHelper.name = "mainCameraHelper";
    this._cameraHelper.visible = false;
    this._scene.add(this._cameraHelper);

    // Debug Camera
    const [cameraDebug, cameraDebugControls] = this._setupDebugCamera();
    this._cameraDebug = cameraDebug;
    this._cameraDebugControls = cameraDebugControls;
  }

  protected _getSceneObjects(): Array<
    BaseSceneObject | Object3D | Group | Mesh
  > {
    return [];
  }

  protected _initSceneObjects() {
    // Add scene objects to scene from
    this._sceneObjects = this._getSceneObjects();
    this._sceneObjects.forEach((object3d) =>
      this._scene.add(
        // check if object3d is BaseSceneObject
        object3d["sceneObject"]
          ? object3d
          : // if not, check if object3d has mesh
          object3d["mesh"]
          ? object3d["mesh"]
          : object3d
      )
    );
  }
  /**
   * Main camera
   * @param {number} fov
   * @param {number} near
   * @param {number} far
   * @param {Vector3} position
   * @returns {PerspectiveCamera}
   */
  protected _setupMainCamera(
    fov: number = 75,
    near: number = 0.1,
    far: number = 500,
    position: Vector3 = new Vector3(0, 0, 5),
    rotation: Euler = new Euler(0, 0, 0)
  ): PerspectiveCamera {
    const screenRatio = this._rendererSize.width / this._rendererSize.height;
    const camera = new PerspectiveCamera(fov, screenRatio, near, far);
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    return camera;
  }

  /**
   * key "ctrl+d" to trigger debug camera
   */
  protected _setupDebugCamera(): [PerspectiveCamera, CameraManager] {
    // debug camera
    const cameraDebug = new PerspectiveCamera(
      45,
      this._rendererSize.width / this._rendererSize.height,
      1,
      10000
    );
    cameraDebug.position.set(0, 10, 40);
    const cameraDebugControls = new CameraManager(
      cameraDebug,
      this._renderer.domElement,
      "orbit"
    );
    cameraDebugControls.enabled = this._isDebugSceneActive;

    return [cameraDebug, cameraDebugControls];
  }

  /**
   * Listen to shortcut ctrl+key to toggle debug
   */
  private _listenEventDebug() {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "d") {
        this._setDebugMode(!this._isDebugSceneActive);
      }
    });
  }

  /**
   * Set scene debug mode
   */
  protected _setDebugMode(isDebug: boolean): void {
    this._isDebugSceneActive = isDebug;

    // camera switch
    this._cameraHelper.visible = isDebug;
    this._cameraDebugControls.enabled = isDebug;

    if (this._scene?.fog) {
      if (isDebug) {
        this._scene.fog = null;
      } else {
        this._scene.fog = this._fog;
      }
    }

    if (this._sceneObjects.length > 0) {
      this._sceneObjects.forEach((sceneObject: BaseSceneObject, i) => {
        if ("isDebug" in sceneObject)
          sceneObject.isDebug = sceneObject.isDebug || isDebug;
      });
    }

    this._domContainer.parentElement.style.zIndex = isDebug ? "1" : "0";
  }

  /**
   * [updateProjectionMatrix description]
   */
  protected _resize = (containerElement): void => {
    this._rendererSize = {
      width:
        containerElement?.contentRect?.width || containerElement.clientWidth,
      height:
        containerElement?.contentRect?.height || containerElement.clientHeight,
    };

    this._camera.aspect = this._rendererSize.width / this._rendererSize.height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(this._rendererSize.width, this._rendererSize.height);
  };

  public render() {
    // switch camera when render for debug
    if (this._isDebugSceneActive) {
      this._renderer.render(this.scene, this._cameraDebug);
      // required if controls.enableDamping or controls.autoRotate are set to true
      this._cameraDebugControls.loop(this.deltaTime);
    } else {
      if (sceneConfig.postprocessing.enabled) {
        if (this._postprocessing && this._postprocessing.composerReady)
          this._postprocessing.composer.render(this.deltaTime);
      } else {
        this._renderer.render(this.scene, this.camera);
      }
    }
  }

  /**
   * [loop description]
   */
  public loop(elapsedTime?): void {
    this.performance.start();
    this._deltaTime = this._clock.getDelta();
    this._rafId = requestAnimationFrame(this._loopBinded);
    this._renderer.info.reset();

    if (!this._ready) return;
    if (this.paused) return;

    // Do loop stuff here
    this._sceneObjects.forEach((sceneObject: BaseSceneObject) => {
      const isGroup = sceneObject["isGroup"];
      const loopObjects = (sceneObjects: Array<BaseSceneObject | Object3D>) =>
        sceneObjects.forEach(
          (sceneObject) =>
            sceneObject["loop"] &&
            sceneObject["loop"](this._deltaTime, elapsedTime)
        );

      if (isGroup) {
        loopObjects(sceneObject.children);
      } else {
        loopObjects([sceneObject]);
      }
    });
  }

  /**
   * [if description]
   * @param  object [description]
   */
  protected _removeFromScene = (object): void => {
    if (object) {
      object.parent.remove(object);
    }
  };

  /**
   * [destroy description]
   */
  public destroy(): void {
    this.paused = true;
    cancelAnimationFrame(this._rafId);
    window.removeEventListener("resize", this._resize.bind(this));
    if (this._postprocessing) this._postprocessing.dispose();
    this._renderer.dispose();
    this._renderer.domElement.remove();
    this._renderer.renderLists.dispose();

    this._scene.traverse((object: Mesh<BufferGeometry, Material>) => {
      if (!object.isMesh) return;

      log("dispose geometry " + object.name);
      object.geometry.dispose();

      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object["material"] as unknown as Material[])
          cleanMaterial(material);
      }
    });

    this._scene = null;
  }
}

export default SceneBase;
