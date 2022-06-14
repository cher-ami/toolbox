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
} from "three"
import SceneBase from "./SceneBase"
import AssetManager, { IFile } from "./AssetManager"
import isMobile from "./utils/isMobile"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { Pane } from "tweakpane"
import SampleObject from "./sceneObjects/SampleObject"
import debug from "@wbe/debug"
import sceneConfig from "./data/sceneConfig"
import SampleGltfObject from "./sceneObjects/SampleGltfObject"
import BaseSceneObject from "./sceneObjects/BaseSceneObject"

const componentName = "SceneView"
const log = debug(`front:3D:${componentName}`)

class SceneView extends SceneBase {
  protected _helpersGroup: Group
  protected _pane
  raycaster: Raycaster
  canInteract: any
  mouse: Vector2

  /**
   * [constructor description]
   */
  constructor() {
    super()

    this._backgroundColor = new Color(sceneConfig.sceneRender.backgroundColor)

    this.mouse = new Vector2(-100, -100) // set mouse first position offset to prevent first raycast

    // add exemple for raycaster
    this.raycaster = new Raycaster()
  }

  /**
   * [init description]
   * @param domContainer [description]
   */
  async init(domContainer: HTMLDivElement, assetsData: IFile[]): Promise<void> {
    await super.init(domContainer, assetsData)

    this.canInteract = true

    this._onSceneReady()

    // TODO
    //process.env.NODE_ENV === "development" && this._initPane()
    this._initPane()
  }

  /**
   * Setup scene env map
   */
  _setupEnvMap(hasBackground: boolean = false) {
    // Setup env map
    const envHdr: Texture = AssetManager.getAsset("envmap").asset as Texture
    envHdr.mapping = EquirectangularReflectionMapping

    // setup env on scene
    this._scene.environment = envHdr
    this._scene.background = hasBackground ? envHdr : null // to debug envmap
  }

  _setupMainCamera() {
    return super._setupMainCamera(
      isMobile ? sceneConfig.mainCamera.fovMobile : sceneConfig.mainCamera.fov,
      sceneConfig.mainCamera.near,
      sceneConfig.mainCamera.far,
      sceneConfig.mainCamera.position
    )
  }

  /**
   * Return objects that will be present in the scene
   *
   * Call at init to add object to main scene
   *
   * @returns Array
   */
  protected _getSceneObjects(): Array<BaseSceneObject | Object3D | Group | Mesh> {
    // Setup scene env map
    this._setupEnvMap(sceneConfig.sceneRender.hasBackgroundEnv)

    // Ambient light
    const ambientLight = new AmbientLight(0xffffff, 1)

    // Directional light
    const directionalLight = new DirectionalLight(0xffffff, 0.5)

    // Get sample object
    const sampleObject = new SampleObject()

    // Get sample object
    const sampleGltfObject = new SampleGltfObject()

    // HELPERS //

    // Axes helper
    const axisHelper = new AxesHelper()

    // Grid helper
    const size = 100
    const divisions = 100
    const gridHelper = new GridHelper(size, divisions)

    // Helper group objects
    this._helpersGroup = new Group()
    this._helpersGroup.name = "Helpers"
    this._helpersGroup.visible = false
    ;[axisHelper, gridHelper].forEach((obj) => this._helpersGroup.add(obj))

    return [
      ambientLight,
      directionalLight,
      sampleObject,
      sampleGltfObject,
      this._helpersGroup,
    ]
  }

  // TODO: add to helpers
  getModelFromGltf(gltf: GLTF, name: string): Mesh | Group | Object3D {
    function findNode(name, array) {
      for (const node of array) {
        if (node.name === name) return node
        if (node.children) {
          const child = findNode(name, node.children)
          if (child) return child
        }
      }
    }
    return findNode(name, gltf?.scene?.children)
  }

  /**
   * Check objects on mouse position and interact with it
   */
  protected _raycastSceneObjects() {
    if (!this.canInteract) return
    // update ray with camera and mouse position

    this.raycaster.setFromCamera(this.mouse as Vector2, this.camera)

    // calculate objects intersecting the picking ray
    // NOTE : can be any objects in scene, more performant than raycast on all objects
    const intersects = this.raycaster.intersectObjects(this._scene.children)
  }

  /**
   * INTERACT EVENT HANDLERS
   */

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._raycastSceneObjects()
  }

  onClick(event) {
    this._raycastSceneObjects()
  }

  /**
   * Init debug panel
   * @returns void
   */
  private _initPane(): void {
    this._pane = new Pane()
    const paneDefaultParams = {
      Postprocessing: sceneConfig.hasPostProcessing,
      "Show helpers": false,
      "Debug Sample Object": false,
      "Activate debug": "ctrl+d or in url #debug",
    }
    // Create main folder
    const f1 = this._pane.addFolder({
      title: "Global parameters",
      expanded: true,
    })
    f1.addInput(paneDefaultParams, "Show helpers").on("change", (ev) => {
      this._helpersGroup.visible = ev.value
    })
    f1.addInput(paneDefaultParams, "Postprocessing").on("change", (ev) => {
      sceneConfig.hasPostProcessing = ev.value
    })
    f1.addInput(paneDefaultParams, "Activate debug")

    // update z index
    document.querySelector(".tp-dfwv")["style"].zIndex = 1000
  }

  private _browserSpecs(): void {
    if (isMobile) {
      // do mobile stuff adaptation here
    }
  }

  private _onSceneReady(): void {
    // this._initPane()

    this._browserSpecs()

    // All things in scene are ready
    debug("Load Complete")
  }

  private _handleMobile() {
    debug("mobile : " + isMobile)
  }

  /**
   * scene view loop
   */
  public loop(elapsedTime?: number): void {
    super.loop(elapsedTime)

    // NOTE : Add your loops here

    // clear the buffer, then render the background
    this.renderer.clear()

    // clear depth buffer, so that the rest of the scene is drawn on top
    this.renderer.clearDepth()
    // render the rest of the scene
    this.render()

    this.performance.end()
  }

  /**
   * destroy scene
   */
  public destroy(): void {
    super.destroy()
    // Dispose the pane
    if (this._pane) this._pane.dispose()
  }
}

export default SceneView