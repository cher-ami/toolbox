import { Euler, Vector3 } from "three";
import { ISceneConfig } from "./types";

const sceneConfig: ISceneConfig = {
  assets3dBasePath: import.meta.env.BASE_URL,
  renderer: {
    antialias: true,
  },
  sceneEnvBackground: {
    enabled: true,
    show: true,
    color: 0xefefef,
    intensity: 1,
  },
  sceneFog: {
    enabled: true,
    color: null, // take background color by default
    near: 0,
    far: 300,
  },
  postprocessing: {
    enabled: false,
    smaaEnabled: true,
  },
  mainCamera: {
    fov: 75,
    fovMobile: null,
    near: 0.1,
    far: 500,
    position: new Vector3(0, 0.5, 5), //new Vector3(0, 0.5, 3.5),
    rotation: new Euler(0, 0, 0),
    isControlable: true,
    controlMode: "orbit",
  },
  debug: {
    hasGui: true,
  },
};

export default sceneConfig;
