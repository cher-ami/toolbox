import {
  MeshStandardMaterial,
  Mesh,
  FrontSide,
  TorusKnotGeometry,
} from "three";
import BaseSceneObject from "./BaseSceneObject";
import debug from "@wbe/debug";

const componentName = "SampleObject";
const log = debug(`front:3D:${componentName}`);

class SampleObject extends BaseSceneObject {
  declare geometry: TorusKnotGeometry;
  declare material: MeshStandardMaterial;

  constructor() {
    super();
    this._isInteractive = true;
  }

  set isDebug(value: boolean) {
    if (this.material) this.material.wireframe = value;
    this._isDebug = value;
  }

  createSubject() {
    this.geometry = new TorusKnotGeometry(0.75, 0.25, 100, 16);

    this.material = new MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5,
      side: FrontSide,
    });

    this.subject = new Mesh(this.geometry, this.material);

    this.name = componentName;
    this.subject.name = componentName + "_subject";

    // Set transforms
    this.scale.set(0.5, 0.5, 0.5);
    this.position.set(3, 0, 2);
  }

  // Auto loop in loops
  loop(deltaTime: number) {
    super.loop(deltaTime);
    this.subject.rotation.x += 0.5 * deltaTime;
    this.subject.rotation.y += 0.5 * deltaTime;
  }
}

export { SampleObject as default };
