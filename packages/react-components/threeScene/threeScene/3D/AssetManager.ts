import { LoadingManager, TextureLoader, Texture } from "three"
import { VideoTextureLoader } from "./helpers/VideoTextureLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import EventEmitter from "events"
import pathJoin from "./helpers/pathJoin"
import debug from "@wbe/debug"
import sceneConfig from "./data/sceneConfig"
const log = debug(`front:3D:AssetManager`)

// TODO: file type from file name extension
// TODO: add to config
const BASE_PATH = sceneConfig.assets3dBasePath
const BASE64_PLACEHOLDER_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="

export enum EFileType {
  GLTF = "gltf",
  IMAGE = "image",
  HDR = "hdr",
  VIDEO = "video",
  TTF = "video",
}

export interface IFile {
  id?: string
  path?: string
  // TODO: rename data
  asset?: {}
  type?: EFileType
  metaData?: {
    [key: string]: any
  }
}

export enum EAssetManagerEvents {
  LOADED = "loaded",
  START = "start",
}

export const LoaderType = {
  [EFileType.GLTF]: GLTFLoader,
  [EFileType.VIDEO]: VideoTextureLoader,
  [EFileType.IMAGE]: TextureLoader,
  [EFileType.HDR]: RGBELoader,
  [EFileType.TTF]: TTFLoader,
}

class AssetManagerClass extends EventEmitter {
  protected _assets: IFile[]
  get assets() {
    return this._assets
  }

  constructor() {
    super()
  }

  // TODO: add basis loader https://threejs.org/docs/#examples/en/loaders/BasisTextureLoader

  /**
   * Loads scene assets.
   *
   * @return {Promise} Returns loaded assets when ready.
   */
  load(fileData: IFile[] | IFile) {
    // Set to array if single file
    const filesData = Array.isArray(fileData) ? fileData : [fileData]
    this._assets = []
    let loaderInstances = {}
    const loadingManager = new LoadingManager()

    // Create placeholder image for texture fallback
    const placeHolderImage = new Image()
    placeHolderImage.src = BASE64_PLACEHOLDER_IMAGE

    return new Promise((resolve, reject) => {
      // loop on filedata and load textures
      filesData.forEach((fileData) => {
        // init loader from file type
        loaderInstances[fileData.type] =
          fileData.type in loaderInstances
            ? loaderInstances[fileData.type]
            : new LoaderType[fileData.type](loadingManager)

        if (!loaderInstances[fileData.type])
          console.error("Three Loader model type not found from", fileData.type)

        // add filedata base data to asset list
        this._assets.push(fileData)

        // get file url
        const fileUrl =
          fileData.path.indexOf("http://") === 0 ||
          fileData.path.indexOf("https://") === 0
            ? fileData.path
            : pathJoin(BASE_PATH, fileData.path)

        // load file
        loaderInstances[fileData.type].load(
          fileUrl,
          (asset) => (fileData.asset = asset),
          undefined,
          (error) => {
            console.error(`Failed to load asset type ${fileData.type}: ${error}`)
            // On file data image failed replace texture with placeholder
            if (fileData.type === EFileType.IMAGE) {
              fileData.asset = new Texture(placeHolderImage)
            }
          }
        )
      })

      loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        log(
          "Started loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
        )
        this.emit(EAssetManagerEvents.START, { url, itemsLoaded, itemsTotal })
      }

      loadingManager.onLoad = () => {
        log("All Slider assets loaded")
        resolve(this._assets)
        this.emit(EAssetManagerEvents.LOADED)
      }
      loadingManager.onError = (url) => {
        console.error("There was an error loading " + url)
        reject(url)
      }
    })
  }

  /**
   * Get asset by id
   * @param  {string} id
   * @returns IFile
   */
  getAsset(id: string): IFile | null {
    return this._assets.find((asset) => asset.id === id) || null
  }
}

const AssetManager = new AssetManagerClass()

export default AssetManager
