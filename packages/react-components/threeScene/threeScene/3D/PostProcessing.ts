import { Scene, WebGLRenderer, Camera } from "three";
import {
  BloomEffect,
  SMAAEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  DepthOfFieldEffect,
  SMAAPreset,
  KernelSize,
} from "postprocessing";

/**
 * post processing for the 3D scene
 * @class PostProcessing
 */
class PostProcessing {
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: Camera;
  public composer: EffectComposer;
  public composerReady: boolean;
  depthOfFieldEffect: DepthOfFieldEffect;
  bloomEffect: BloomEffect;
  smaaEffect: SMAAEffect;
  constructor({
    renderer,
    scene,
    camera,
  }: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
  }) {
    this._renderer = renderer;
    this._scene = scene;
    this._camera = camera;

    this._initComposer();

    this._setupEffects();

    this._setupPasses();

    this.composerReady = true;
  }

  /**
   * Init composer for post processing
   */
  protected _initComposer() {
    const context = this._renderer.getContext();

    if (
      typeof (context as WebGL2RenderingContext).MAX_SAMPLES !== "undefined"
    ) {
      const MAX_SAMPLES = context.getParameter(
        (context as WebGL2RenderingContext).MAX_SAMPLES
      );
      this.composer = new EffectComposer(this._renderer, {
        multisampling: Math.min(8, MAX_SAMPLES),
      });
    } else {
      this.composer = new EffectComposer(this._renderer);
    }
  }

  /**
   * Setup post processing effects for the scene
   */
  protected _setupEffects() {
    // SMAA
    this.smaaEffect = new SMAAEffect({ preset: SMAAPreset.MEDIUM });

    // Depth of field
    this.depthOfFieldEffect = new DepthOfFieldEffect(this._camera, {
      worldFocusDistance: 2,
      worldFocusRange: 5,
      bokehScale: 3.0,
    });

    // Bloom
    this.bloomEffect = new BloomEffect({
      kernelSize: KernelSize.MEDIUM,
      luminanceThreshold: 0.5,
    });
  }

  /**
   * Setup post processing passes for the scene
   */
  protected _setupPasses() {
    const renderPass = new RenderPass(this._scene, this._camera);

    const smaaPass = new EffectPass(this._camera, this.smaaEffect);
    const bloomPass = new EffectPass(this._camera, this.bloomEffect);
    const depthOfFieldPass = new EffectPass(
      this._camera,
      this.depthOfFieldEffect
    );

    // Set all effect pass for composer render
    this.composer.addPass(renderPass);
    this.composer.addPass(smaaPass);
    this.composer.addPass(bloomPass);
    this.composer.addPass(depthOfFieldPass);
  }

  /**
   * Dispose post processing passes for the scene
   */
  public dispose() {
    this.composer.dispose();
  }
}

export default PostProcessing;
