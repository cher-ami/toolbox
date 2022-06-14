import { Vector3 } from "three"
const sceneConfig = {
  assets3dBasePath: import.meta.env.BASE_URL,
  hasPostProcessing: false,
  sceneRender: {
    backgroundColor: 0xf1f2f3,
    hasBackgroundEnv: false,
  },
  mainCamera: {
    fov: 75,
    fovMobile: null,
    near: 0.1,
    far: 500,
    position: new Vector3(0, 1.2, 3.5),
    rotation: new Vector3(0, 0, 0),
  },
  hasEnvmap: false,
  hasBackground: false,
  backgroundColor: 0xffffff,
}
export default sceneConfig
