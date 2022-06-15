import { EFileType, IFile } from "../threeScene/3D/AssetManager"

// Move to data folder for example
const assets3dData: IFile[] = [
  {
    // TODO: add local files
    path: "https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
    id: "model-test",
    type: EFileType.GLTF,
  },
  {
    // TODO: add local files
    path: "https://github.khronos.org/glTF-Sample-Viewer-Release/assets/environments/footprint_court.hdr",
    id: "envmap",
    type: EFileType.HDR,
  },
]

export default assets3dData
