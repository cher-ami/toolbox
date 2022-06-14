import { EFileType, IFile } from "../AssetManager"

const assets3dData: IFile[] = [
  {
    path: "https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
    id: "model-spot",
    type: EFileType.GLTF,
  },
  {
    path: "https://github.khronos.org/glTF-Sample-Viewer-Release/assets/environments/footprint_court.hdr",
    id: "envmap",
    type: EFileType.HDR,
  },
]

export default assets3dData
