import {
  MeshStandardMaterial,
  Mesh,
  TorusKnotGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Texture,
  LinearFilter,
} from "three";
import BaseSceneObject from "./BaseSceneObject";
import debug from "@wbe/debug";
import AssetManager from "../AssetManager";

const componentName = "SampleObject";
const log = debug(`front:3D:${componentName}`);

class SamplePlaneObject extends BaseSceneObject {
  constructor() {
    super();
  }

  createMesh() {
    // PlaneGeometry UVs assume flipY=true, which compressed textures don't support.
    this.geometry = new PlaneGeometry();
    //this.geometry = this._flipY(new PlaneGeometry());
    this.material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
    });
    const texture = AssetManager.getAsset("test-basis-texture").data as Texture;
    //texture.needsUpdate = true;

    //texture.magFilter = texture.minFilter = LinearFilter; // just added this in reply to forerunrun but no success
    this.material.map = texture;
    this.material.transparent = true;

    this.material.needsUpdate = true;

    this.sceneObject = new Mesh(this.geometry, this.material);
    this.sceneObject.name = componentName;

    this.sceneObject.position.set(-3, 0, 2);
  }

  // Auto loop in loops
  loop(deltaTime: number) {
    super.loop(deltaTime);
    this.sceneObject.rotation.x += 0.5 * deltaTime;
    this.sceneObject.rotation.y += 0.5 * deltaTime;
  }

  /** Correct UVs to be compatible with `flipY=false` textures. */
  _flipY(geometry) {
    const uv = geometry.attributes.uv;

    for (let i = 0; i < uv.count; i++) {
      uv.setY(i, 1 - uv.getY(i));
    }

    return geometry;
  }
}

export { SamplePlaneObject as default };