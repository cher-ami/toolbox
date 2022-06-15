// TODO: import types
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
import { OrbitControls } from "./utils/controls/OrbitControls";
import threeDevToolBrowserPlugin from "./helpers/threeDevToolBrowserPlugin";
import {
  BloomEffect,
  SMAAEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  DepthOfFieldEffect,
} from "postprocessing";

import PerformanceWatcher from "./PerformanceWatcher";
import AssetManager, { IFile } from "./AssetManager";
import debug from "@wbe/debug";
import { limitNumberRange } from "./utils/limitNumberRange";
import BaseSceneObject from "./sceneObjects/BaseSceneObject";
import sceneConfig from "./data/sceneConfig";

// TODO: add https://github.com/pmndrs/detect-gpu
// TODO : add camera controls
// TODO: let it optional

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

// TODO: postprocessing conditional
// TODO: all scene specific params outside

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

  protected _cameraDebugControls: OrbitControls;
  protected _cameraHelper: CameraHelper;

  protected _clock: Clock;
  protected _deltaTime: number;
  public get deltaTime() {
    return this._deltaTime;
  }
  protected _rafId: number;
  protected _resizeThrottled: () => {};
  protected _loopBinded: () => void;

  // TODO: remove
  //protected _passes: {}

  protected _ready: boolean = false;

  protected _resizeObserver: ResizeObserver;

  protected _composer: any; // EffectComposer
  protected _composerReady: boolean = false;

  public performance: PerformanceWatcher;

  public paused: boolean = false;

  /**
   * [constructor description]
   */
  constructor() {
    this._isDebugSceneActive = window.location.hash === "#debug";
    this._backgroundColor = new Color(0xffffff);

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
  }
  ): Promise<void> {
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
    //this._renderer.toneMapping = ReinhardToneMapping // Advised tone mapping for realistic rendering

    this._renderer.setSize(this._rendererSize.width, this._rendererSize.height);
    this._domContainer.appendChild(this._renderer.domElement);

    this._clock = new Clock();

    this._setupScene();

    // Load assets
    try {
      if (assetsData && assetsData.length > 0)
        await AssetManager.init({renderer: this._renderer, staticLoadersBasePath });
        await AssetManager.load(assetsData);
    } catch (error) {
      console.error("Failed to load asset", error);
    }

    this._initSceneObjects();

    // Add smaa in post processing
    // LoaderManager.loadSmaa().then((assets) =>
    //   this._setupPostProcessing(assets)
    // );

    this._setupPostProcessing();

    this._ready = true;

    const resizeObserver = new ResizeObserver((entries) =>
      this._resize(entries[0])
    );
    resizeObserver.observe(this._domContainer);

    this.setDebugMode(this._isDebugSceneActive);

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
    this._fog = new Fog(this._backgroundColor, 0, 70);
    this._scene.fog = this._fog;

    // Main Camera
    this._camera = this._setupMainCamera();

    // Debug Camera
    const [cameraDebug, cameraDebugControls] = this._setupDebugCamera();
    this._cameraDebug = cameraDebug;
    this._cameraDebugControls = cameraDebugControls;

    // Setup camera helper
    this._cameraHelper = new CameraHelper(this._camera);
    this._cameraHelper.visible = false;
    this._scene.add(this._cameraHelper);
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
        object3d["sceneObject"]
          ? object3d["sceneObject"]
          : object3d["mesh"]
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
    // TODO: add to config
    const camera = new PerspectiveCamera(fov, screenRatio, near, far);
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    return camera;
  }

  /**
   * key "ctrl+d" to trigger debug camera
   */
  protected _setupDebugCamera(): [PerspectiveCamera, OrbitControls] {
    // debug camera
    const cameraDebug = new PerspectiveCamera(
      45,
      this._rendererSize.width / this._rendererSize.height,
      1,
      10000
    );
    const cameraDebugControls = new OrbitControls(
      cameraDebug,
      this._renderer.domElement
    );

    cameraDebug.position.set(0, 10, 50);
    // NOTE : controls.update() must be called after any manual changes to the camera's transform
    cameraDebugControls.update();

    return [cameraDebug, cameraDebugControls];
  }

  /**
   * Listen to shortcut ctrl+key to toggle debug
   */
  private _listenEventDebug() {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "d") {
        this.setDebugMode(!this._isDebugSceneActive);
      }
    });
  }

  /**
   * Set scene debug mode
   */
  protected setDebugMode(isDebug: boolean): void {
    this._isDebugSceneActive = isDebug;
    this._cameraHelper.visible = isDebug;

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

  // TODO: move outside
  /**
   * [_setupPostProcessing description]
   */
  protected _setupPostProcessing(): void {
    const context = this._renderer.getContext();

    if (
      typeof (context as WebGL2RenderingContext).MAX_SAMPLES !== "undefined"
    ) {
      const MAX_SAMPLES = context.getParameter(
        (context as WebGL2RenderingContext).MAX_SAMPLES
      );
      this._composer = new EffectComposer(this._renderer, {
        multisampling: Math.min(8, MAX_SAMPLES),
      });
    } else {
      this._composer = new EffectComposer(this._renderer);
    }

    const renderPass = new RenderPass(this._scene, this._camera);

    // Depth of field
    const depthOfFieldEffect = new DepthOfFieldEffect(this._camera, {
      focusDistance: 0.013,
      focalLength: 0.025,
      bokehScale: 3,
    });

    depthOfFieldEffect.blurPass.resolution.scale = 1;

    // Bloom
    const bloomEffect = new BloomEffect(this._scene, this._camera);

    // SMAA
    const smaaEffect = new SMAAEffect();

    const smaaPass = new EffectPass(this._camera, smaaEffect);
    // TODO: temp remove effect not used for now. Need to check if view 3d models and anim need those
    const bloomPass = new EffectPass(this._camera, bloomEffect);
    const depthOfFieldPass = new EffectPass(this._camera, depthOfFieldEffect);

    // this._composer.addPass(worldPositionPass);
    // Set all effect pass for composer render
    this._composer.addPass(renderPass);
    this._composer.addPass(smaaPass);
    this._composer.addPass(bloomPass);
    this._composer.addPass(depthOfFieldPass);

    this._composerReady = true;
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
      this._cameraDebugControls.update();
    } else {
      if (sceneConfig.hasPostProcessing) {
        if (this._composerReady) this._composer.render(this.deltaTime);
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
    this._sceneObjects.forEach(
      (sceneObject: BaseSceneObject) =>
        sceneObject.loop && sceneObject.loop(this._deltaTime, elapsedTime)
    );
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

  // TODO: add to helpers
  cleanMaterial(material) {
    debug("dispose material " + material.name);
    material.dispose();

    // dispose textures
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value && typeof value === "object" && "minFilter" in value) {
        value.dispose();
      }
    }
  }

  /**
   * [destroy description]
   */
  public destroy(): void {
    cancelAnimationFrame(this._rafId);
    window.removeEventListener("resize", this._resize.bind(this));
    this._renderer.dispose();
    this._renderer.domElement.remove();
    this._renderer.renderLists.dispose();

    this._scene.traverse((object: Mesh<BufferGeometry, Material>) => {
      if (!object.isMesh) return;

      log("dispose geometry " + object.name);
      object.geometry.dispose();

      if (object.material.isMaterial) {
        this.cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object["material"] as unknown as Material[])
          this.cleanMaterial(material);
      }
    });

    this._scene = null;
  }
}

export default SceneBase;
