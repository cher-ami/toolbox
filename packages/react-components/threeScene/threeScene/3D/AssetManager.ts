import { LoadingManager, TextureLoader, Texture, WebGLRenderer } from "three";
import { VideoTextureLoader } from "./helpers/VideoTextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import EventEmitter from "events";
import pathJoin from "./helpers/pathJoin";
import debug from "@wbe/debug";
import sceneConfig from "./data/sceneConfig";
const log = debug(`front:3D:AssetManager`);

const BASE_PATH = sceneConfig.assets3dBasePath;
const BASE64_PLACEHOLDER_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";

export enum EFileType {
  GLTF = "gltf",
  IMAGE = "image",
  HDR = "hdr",
  VIDEO = "video",
  TTF = "ttf",
  KTX2 = "ktx2",
}

export interface IFile {
  id?: string;
  path: string;
  data?: {};
  type?: EFileType;
  metaData?: {
    [key: string]: any;
  };
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
  [EFileType.KTX2]: KTX2Loader,
  [EFileType.TTF]: TTFLoader,
};

class AssetManager extends EventEmitter {
  protected _assets: IFile[];
  private _staticLoadersBasePath: string;
  private _renderer: WebGLRenderer;
  private _loaderInstances = {};
  get assets() {
    return this._assets;
  }

  constructor() {
    super();
  }

  init({
    renderer,
    staticLoadersBasePath,
  }: {
    renderer: WebGLRenderer;
    staticLoadersBasePath: string;
  }) {
    this._staticLoadersBasePath = staticLoadersBasePath;
    this._renderer = renderer;
  }

  // TODO: add basis loader https://threejs.org/docs/#examples/en/loaders/BasisTextureLoader

  /**
   * Loads scene assets.
   *
   * @return {Promise} Returns loaded assets when ready.
   */
  load(fileData: IFile[] | IFile) {
    // Set to array if single file
    const filesData = Array.isArray(fileData) ? fileData : [fileData];
    this._assets = [];
    this._loaderInstances = {};
    const loadingManager = new LoadingManager();

    // Create placeholder image for texture fallback
    const placeHolderImage = new Image();
    placeHolderImage.src = BASE64_PLACEHOLDER_IMAGE;

    return new Promise((resolve, reject) => {
      // loop on filedata and load textures
      filesData.forEach((fileData) => {
        const fileType = this._getFileTypeFromAsset(fileData.path);

        // Init loader from file type
        if (!(fileType in this._loaderInstances)) {
          const currentLoaderInstance = new LoaderType[fileType](
            loadingManager
          );
          // switch set side loaders for corresponding file type
          switch (fileType) {
            case EFileType.GLTF:
              this._setGLTFSideLoaders(currentLoaderInstance);
              break;
            case EFileType.KTX2:
              this._setKTX2LoaderDependencies(
                currentLoaderInstance,
                this._renderer
              );
              break;
            default:
              break;
          }

          this._loaderInstances[fileType] = currentLoaderInstance;
        }

        if (!this._loaderInstances[fileType])
          console.error("Three Loader model type not found from", fileType);

        // add filedata base data to asset list
        this._assets.push(fileData);

        // get file url
        const fileUrl = this._getFileUrl(fileData.path);

        const fileId = this._getFileId(fileData);

        // load file
        this._loaderInstances[fileType].load(
          fileUrl,
          (asset) => {
            fileData.data = asset;
            fileData.id = fileId;
            fileData.type = fileType;
          },
          undefined,
          (error) => {
            console.error(`Failed to load asset type ${fileType}: ${error}`);
            // On file data image failed replace texture with placeholder
            if (fileType === EFileType.IMAGE) {
              fileData.data = new Texture(placeHolderImage);
            }
          }
        );
      });

      loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        log(
          "Started loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
        );
        this.emit(EAssetManagerEvents.START, { url, itemsLoaded, itemsTotal });
      };

      loadingManager.onLoad = () => {
        log("All Slider assets loaded");
        resolve(this._assets);
        this.emit(EAssetManagerEvents.LOADED);
      };

      loadingManager.onError = (url) => {
        console.error("There was an error loading " + url);
        reject(url);
      };
    });
  }

  /**
   * Get asset by id
   * @param  {string} id
   * @returns IFile
   */
  getAsset(id: string): IFile | null {
    return this._assets.find((asset) => asset.id === id) || null;
  }

  /**
   * Take a file path and return the file type from the file name extension
   * @param {path} file path
   * @returns {EFileType} file type
   */
  private _getFileTypeFromAsset(path: string): EFileType {
    // switch on file extension to get corresponding file type
    const fileExtension = path.split(".").pop();
    switch (fileExtension) {
      case "gltf":
        return EFileType.GLTF;
      case "glb":
        return EFileType.GLTF;
      case "png":
        return EFileType.IMAGE;
      case "jpg":
        return EFileType.IMAGE;
      case "gif":
        return EFileType.IMAGE;
      case "dds":
        return EFileType.IMAGE;
      case "hdr":
        return EFileType.HDR;
      case "ktx2":
        return EFileType.KTX2;
      case "webm":
        return EFileType.VIDEO;
      case "mp4":
        return EFileType.VIDEO;
      case "ttf":
        return EFileType.TTF;
      default:
        console.error(`AssetManager - Unknown file type: ${fileExtension}`);
    }
  }

  /**
   * Get asset url from path
   */
  private _getFileUrl(url: string): string {
    return url.indexOf("http://") === 0 || url.indexOf("https://") === 0
      ? url
      : pathJoin(BASE_PATH, url);
  }

  private _getFileId(fileData: IFile) {
    // return file id if it exists else return file name from path without extension
    const fileName = fileData.path.split("/").pop();
    return fileData.id || fileName.split(".").shift();
  }

  // -------------------------------------------------------------------------------- SIDE LOADERS

  private _setGLTFSideLoaders(GLTFLoaderInstance: GLTFLoader) {
    const DRACOLoader = this._getDracoLoader();
    const BASISLoader = this._getBasisLoader(this._renderer);
    GLTFLoaderInstance.setCrossOrigin("anonymous")
      .setDRACOLoader(DRACOLoader)
      .setKTX2Loader(BASISLoader)
      .setMeshoptDecoder(MeshoptDecoder);
  }

  private _setKTX2LoaderDependencies(
    currentLoaderInstance: KTX2Loader,
    renderer: WebGLRenderer
  ) {
    currentLoaderInstance
      .setTranscoderPath(pathJoin(this._staticLoadersBasePath, "/basis") + "/")
      .detectSupport(renderer);
  }

  private _getDracoLoader(): DRACOLoader {
    // Configure and create Draco decoder.
    const dracoLoader = new DRACOLoader();
    const decoderPath = pathJoin(this._staticLoadersBasePath, "/draco" + "/");
    dracoLoader.setDecoderPath(decoderPath);
    dracoLoader.setDecoderConfig({ type: "js" });
    return dracoLoader;
  }

  private _getBasisLoader(renderer: WebGLRenderer): KTX2Loader {
    const ktx2Loader =
      EFileType.KTX2 in this._loaderInstances
        ? this._loaderInstances[EFileType.KTX2]
        : new KTX2Loader();
    this._setKTX2LoaderDependencies(ktx2Loader, renderer);
    this._loaderInstances[EFileType.KTX2] = ktx2Loader;
    return ktx2Loader;
  }
}

export default new AssetManager();
