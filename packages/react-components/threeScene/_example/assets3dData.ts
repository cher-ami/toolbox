import { EFileType, IFile } from "../threeScene/3D/managers/AssetManager";
import damagedHelmet from "./assets/DamagedHelmet.glb?url";
import testBasisTexture from "./assets/test-basis-texture.ktx2?url";
import footprintCourt from "./assets/footprint_court.hdr?url";

// Move to data folder for example
const assets3dData: IFile[] = [
  {
    path: damagedHelmet,
    id: "model-test",
  },
  {
    path: footprintCourt,
    id: "envmap",
  },
  {
    path: testBasisTexture,
    id: "test-basis-texture",
  },
];

export default assets3dData;
