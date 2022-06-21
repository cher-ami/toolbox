import {
  Mesh,
  AmbientLight,
  AxesHelper,
  GridHelper,
  Group,
  Object3D,
  Raycaster,
  Vector2,
  EquirectangularReflectionMapping,
  Texture,
  DirectionalLight,
  Color,
  Intersection,
  BufferGeometry,
  Material,
  MeshStandardMaterial,
} from "three";
import SceneBase from "./SceneBase";
import AssetManager, { IFile } from "./managers/AssetManager";
import isMobile from "./utils/isMobile";
import { Pane } from "tweakpane";
import SampleObject from "./sceneObjects/SampleObject";
import debug from "@wbe/debug";
import sceneConfig from "./data/sceneConfig";

// NOTE: remove if no interactive camera used
import CameraManager from "./managers/CameraManager";

// NOTE: sample objects, remove if no use
import SampleGltfObject from "./sceneObjects/SampleGltfObject";
import BaseSceneObject from "./sceneObjects/BaseSceneObject";
import SamplePlaneObject from "./sceneObjects/SamplePlaneObject";
import TransformControlManager from "./managers/TransformControlManager";

const componentName = "SceneView";
const log = debug(`front:3D:${componentName}`);

class SceneView extends SceneBase {
  protected _helpersGroup: Group;
  protected _pane;
  raycaster: Raycaster;
  canInteract: any;
  mouse: Vector2;
  mainCameraControler: CameraManager;
  private _transformControlHelper: TransformControlManager;
  private _mainObjectsGroup: Group;
  _intersectObject: any;

  /**
   * [constructor description]
   */
  constructor() {
    super();

    // NOTE: if scene is not interactive remove mouse and raycaster
    this.mouse = new Vector2(-100, -100); // set mouse first position offset to prevent first raycast

    //  TODO: add exemple for raycaster
    this.raycaster = new Raycaster();
  }

  /**
   * [init description]
   * @param domContainer [description]
   */
  async init({
    domContainer,
    assetsData,
    staticLoadersBasePath,
  }: {
    domContainer: HTMLDivElement;
    assetsData: IFile[];
    staticLoadersBasePath: string;
  }): Promise<void> {
    await super.init({
      domContainer,
      assetsData,
      staticLoadersBasePath,
    });

    if (sceneConfig.mainCamera.isControlable) {
      this._setupCameraControls();
    }

    // NOTE : do your init stuff here before scene is ready and can be interacted
    // ...

    this.canInteract = true;

    this._onSceneReady();

    if (sceneConfig.debug.hasGui) this._initPane();
  }

  /**
   * Setup camera controls
   */
  private _setupCameraControls() {
    this.mainCameraControler = new CameraManager(
      this.camera,
      this.renderer.domElement,
      sceneConfig.mainCamera.controlMode
    );
  }

  /**
   * Setup scene env map
   */
  _setupEnvMap(hasBackground: boolean = false) {
    // Setup env map
    const envHdr: Texture = AssetManager.getAsset("envmap").data as Texture;
    envHdr.mapping = EquirectangularReflectionMapping;

    // setup env on scene
    this._scene.environment = envHdr;
    this._scene.background = hasBackground ? envHdr : null; // to debug envmap
  }

  _setupMainCamera() {
    return super._setupMainCamera(
      isMobile ? sceneConfig.mainCamera.fovMobile : sceneConfig.mainCamera.fov,
      sceneConfig.mainCamera.near,
      sceneConfig.mainCamera.far,
      sceneConfig.mainCamera.position
    );
  }

  /**
   * Return objects that will be present in the scene
   *
   * Call at init to add object to main scene
   *
   * @returns Array
   */
  protected _getSceneObjects(): Array<
    BaseSceneObject | Object3D | Group | Mesh
  > {
    // Setup scene env map
    if (sceneConfig.sceneEnvBackground.enabled) {
      this._setupEnvMap(sceneConfig.sceneEnvBackground.show);
    }

    // SAMPLE SCENE //
    // NOTE: add your scene objects here (you can remove sample objects and lights)

    // Ambient light
    const ambientLight = new AmbientLight(0xffffff, 1);

    // Directional light
    const directionalLight = new DirectionalLight(0xffffff, 0.5);

    // MAIN OBJECTS //

    // NOTE : objects in this group are raycastable
    this._mainObjectsGroup = new Group();

    // Get sample object
    const sampleObject = new SampleObject();

    // Get sample gltf object
    const sampleGltfObject = new SampleGltfObject();

    // Get sample plan object
    const samplePlaneObject = new SamplePlaneObject();

    [sampleObject, sampleGltfObject, samplePlaneObject].forEach((obj) =>
      this._mainObjectsGroup.add(obj)
    );

    // HELPERS //

    // Axes helper
    const axisHelper = new AxesHelper();

    // Grid helper
    const size = 100;
    const divisions = 100;
    const gridHelper = new GridHelper(size, divisions);

    // Transform  helper
    this._transformControlHelper = new TransformControlManager({
      camera: this._cameraDebug,
      cameraControls: this._cameraDebugControls,
      rendererDomContainer: this._domContainer,
      transformableObjects: this._mainObjectsGroup.children,
    });

    // Helper group objects
    this._helpersGroup = new Group();
    this._helpersGroup.name = "Helpers";
    this._helpersGroup.visible = false;
    [axisHelper, gridHelper].forEach((obj) => this._helpersGroup.add(obj));

    return [
      ambientLight,
      directionalLight,
      this._mainObjectsGroup,
      this._helpersGroup,
      this._transformControlHelper.controls,
    ];
  }

  private _browserSpecs(): void {
    if (isMobile) {
      // do mobile stuff adaptation here
    }
  }

  private _onSceneReady(): void {
    // this._initPane()

    this._browserSpecs();

    // All things in scene are ready
    debug("Load Complete");
  }

  private _handleMobile() {
    debug("mobile : " + isMobile);
  }

  // TODO: scene base
  // --------------------------------------------------------------------------------  INTERACT EVENT HANDLERS

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const intersects = this._raycastSceneObjects();

    if (intersects && intersects.length > 0) {
    }
    this._exampleHoverObjects(intersects);
  }

  onClick(event) {
    this._raycastSceneObjects();

    if (this._intersectObject) {
      this._exampleClickObject(this._intersectObject);
    }
  }

  /**
   * Check objects on mouse position and interact with it
   */
  protected _raycastSceneObjects(): Array<Intersection<Object3D>> {
    if (!this.canInteract || this._isDebugSceneActive) return;
    // update ray with camera and mouse position

    this.raycaster.setFromCamera(this.mouse as Vector2, this.camera);

    // calculate objects intersecting the picking ray
    // NOTE : can be any objects in scene, more performant than raycast on all objects
    const intersects = this.raycaster.intersectObjects(
      this._mainObjectsGroup.children.map((child) =>
        child["sceneObject"] ? child["sceneObject"] : (null as Object3D)
      ),
      true
    );

    return intersects ? intersects : [];
  }

  // SAMPLE INTERACTIVE OBJECT METHODS //
  // NOTE : methods for demo, remove this when you have your own interaction logic

  private _exampleHoverObjects(
    intersects: Array<Intersection<Object3D>>
  ): void {
    if (intersects && intersects.length > 0) {
      if (this._intersectObject != intersects[0].object) {
        if (this._intersectObject)
          this._intersectObject.material.emissive.setHex(
            this._intersectObject.currentHex
          );

        this._intersectObject = intersects[0].object;
        this._intersectObject.currentHex =
          this._intersectObject.material.emissive.getHex();
        this._intersectObject.material.emissive.setHex(0xff0000);
      }
    } else {
      if (this._intersectObject)
        this._intersectObject.material.emissive.setHex(
          this._intersectObject.currentHex
        );

      this._intersectObject = null;
    }
  }

  private _exampleClickObject(clickedObject: any): void {
    function getParentSceneObject(sceneObject: Object3D): Object3D {
      if (sceneObject.parent) {
        if (sceneObject.parent.name.includes("sceneObject")) {
          return sceneObject.parent;
        }
        return getParentSceneObject(sceneObject.parent);
      }
    }
    // get the object intersected
    const sceneObject = clickedObject.name.includes("sceneObject")
      ? clickedObject
      : getParentSceneObject(clickedObject);

    alert(`Clicked on ${sceneObject.name}`);
    clickedObject.material.emissive.setHex(clickedObject.currentHex);
  }

  // --------------------------------------------------------------------------------  LOOP & RENDER

  /**
   * scene view loop
   */
  public loop(deltaTime?: number): void {
    super.loop(deltaTime);

    // NOTE: remove if you don't need to have interactive camera
    // Update camera controls
    if (sceneConfig.mainCamera.isControlable && this.mainCameraControler) {
      this.mainCameraControler.loop(deltaTime);
    }

    // NOTE : Add your loops here

    // ...

    // Clear the buffer, then render the background
    this.renderer.clear();

    // Clear depth buffer, so that the rest of the scene is drawn on top
    this.renderer.clearDepth();

    // Render the rest of the scene
    this.render();

    this.performance.end();
  }

  // --------------------------------------------------------------------------------  DISPOSE

  /**
   * destroy scene
   */
  public destroy(): void {
    super.destroy();
    // Dispose camera controls
    if (this.mainCameraControler) this.mainCameraControler.dispose();
    // Dispose transform controler
    if (this._transformControlHelper) this._transformControlHelper.dispose();
    // Dispose the pane
    if (this._pane) this._pane.dispose();
  }

  // --------------------------------------------------------------------------------  DEBUG

  protected _setDebugMode(isDebug: boolean): void {
    super._setDebugMode(isDebug);

    // camera main controler
    if (this.mainCameraControler) this.mainCameraControler.enabled = !isDebug;

    // debug transform objects controler
    if (this._transformControlHelper)
      this._transformControlHelper.enabled = isDebug;
  }

  /**
   * Init debug panel
   * @returns void
   */
  private _initPane(): void {
    this._pane = new Pane();
    const paneDefaultParams = {
      Postprocessing: sceneConfig.postprocessing.enabled,
      "Show helpers": false,
      "Show scene envmap": sceneConfig.sceneEnvBackground.enabled,
      "Switch camera mode": sceneConfig.mainCamera.controlMode,
      "Activate debug": "ctrl+d or in url #debug",
    };
    // Create main folder
    const f1 = this._pane.addFolder({
      title: "Global parameters",
      expanded: true,
    });
    f1.addInput(paneDefaultParams, "Show helpers").on("change", (ev) => {
      this._helpersGroup.visible = ev.value;
    });
    f1.addInput(paneDefaultParams, "Postprocessing").on("change", (ev) => {
      sceneConfig.postprocessing.enabled = ev.value;
    });
    f1.addInput(paneDefaultParams, "Show scene envmap").on("change", (ev) => {
      this._scene.background = ev.value ? this._scene.environment : null;
    });
    if (sceneConfig.mainCamera.isControlable) {
      f1.addInput(paneDefaultParams, "Switch camera mode", {
        options: {
          orbit: "orbit",
          firstPerson: "firstPerson",
        },
      }).on("change", (ev) => {
        this.mainCameraControler.setMode(ev.value);
      });
    }
    f1.addInput(paneDefaultParams, "Activate debug");

    if (this._transformControlHelper) {
      // Object transform folder
      const f2 = this._pane.addFolder({
        title: "Object transform",
        expanded: true,
      });
      f2.hidden = true;

      const objectTransforms = {
        name: "",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      };

      f2.addMonitor(objectTransforms, "name");
      f2.addInput(objectTransforms, "position").on("change", (e) => {
        if (e.last) {
          const { x, y, z } = e.value;
          this._transformControlHelper.transformControlMesh.position.set(
            x,
            y,
            z
          );
        }
      });
      f2.addInput(objectTransforms, "rotation").on("change", (e) => {
        if (e.last) {
          const { x, y, z } = e.value;
          this._transformControlHelper.transformControlMesh.rotation.set(
            x,
            y,
            z
          );
        }
      });

      this._transformControlHelper.controls.addEventListener("change", () => {
        if (!this._transformControlHelper.transformControlMesh || !this._transformControlHelper.controls.object) {
          f2.hidden = true;
          return;
        }
        f2.hidden = false;
        // set position
        const {
          x: posX,
          y: posY,
          z: posZ,
        } = this._transformControlHelper.transformControlMesh.position;
        // set rotation
        objectTransforms.position = {
          x: posX,
          y: posY,
          z: posZ,
        };
        const {
          x: rotX,
          y: rotY,
          z: rotZ,
        } = this._transformControlHelper.transformControlMesh.rotation;

        objectTransforms.rotation = {
          x: rotX,
          y: rotY,
          z: rotZ,
        };

        // set name
        objectTransforms.name =
          this._transformControlHelper.transformControlMesh.name;


        // refresh pane
        this._pane.refresh();
      });
    }
    // update z index gui dom
    document.querySelector(".tp-dfwv")["style"].zIndex = 1000;
  }
}

export default SceneView;
