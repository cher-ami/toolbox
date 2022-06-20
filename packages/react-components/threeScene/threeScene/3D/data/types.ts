import { Euler, Vector3 } from "three";
import { TCameraControlMode } from "../CameraControler";

// ------------------------------------------------------------------------------------------------------------ SCENE CONFIG INTERFACE

export interface ISceneConfig {
  assets3dBasePath: string;
  sceneEnvBackground: ISceneEnvBackground;
  sceneFog: ISceneFog;
  postprocessing: IPostprocessing;
  mainCamera: IMainCamera;
}

export interface ISceneEnvBackground {
  enabled: boolean;
  show: boolean;
  color: number;
}

export interface ISceneFog {
  enabled: boolean;
  color?: any;
  near: number;
  far: number;
}

export interface IPostprocessing {
  enabled: boolean;
  smaaEnabled: boolean;
}

export interface IMainCamera {
  fov: number;
  fovMobile?: any;
  near: number;
  far: number;
  position: Vector3;
  rotation: Euler;
  isControlable: boolean;
  controlMode: TCameraControlMode;
}
