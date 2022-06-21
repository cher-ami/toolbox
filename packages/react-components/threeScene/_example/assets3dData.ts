import { EFileType, IFile } from "../threeScene/3D/managers/AssetManager";
import damagedHelmet from "./assets/DamagedHelmet.glb?url";
import testBasisTexture from "./assets/test-basis-texture.ktx2?url";
import footprintCourt from "./assets/footprint_court.hdr?url";

// Move to data folder for example
const assets3dData: IFile[] = [
  {
    // TODO: add local files
    path: damagedHelmet,
    id: "model-test",
    type: EFileType.GLTF,
  },
  {
    path: footprintCourt,
    id: "envmap",
    type: EFileType.HDR,
  },
  {
    path: testBasisTexture,
    id: "test-basis-texture",
    type: EFileType.KTX2,
  },
];

export default assets3dData;
