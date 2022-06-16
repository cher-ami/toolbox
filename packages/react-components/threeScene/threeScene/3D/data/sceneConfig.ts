import { Vector3 } from "three";
const sceneConfig = {
  assets3dBasePath: import.meta.env.BASE_URL,
  sceneEnvBackground: {
    enabled: true,
    show: false,
    color: 0xf1f2f3,
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
    position: new Vector3(0, 0.5, 3.5),
    rotation: new Vector3(0, 0, 0),
  },
};
export default sceneConfig;
