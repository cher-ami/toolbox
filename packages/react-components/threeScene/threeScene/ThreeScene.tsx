import css from "./ThreeScene.module.less";
import React, { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";
import { IFile } from "./3D/AssetManager";
import SceneView from "./3D/SceneView";
import debug from "@wbe/debug";

interface IProps {
  className?: string;
  isVisible?: boolean;
  isPaused?: boolean;
  assets3d: IFile[];
  onSceneIsReady?: () => void;
}

const componentName = "ThreeScene";
const log = debug(`front:${componentName}`);

ThreeScene.defaultProps = {
  isVisible: true,
};

/**
 * @name ThreeScene
 */
function ThreeScene(props: IProps) {
  const rootRef = useRef<HTMLDivElement>();

  // --------------------------------------------------------------------------- 3D SCENE SETUP

  const webglContainerRef = React.useRef(null);
  const sceneViewRef = React.useRef<SceneView>(null);

  const [sceneIsReady, _setSceneIsReady] = useState<boolean>(false);
  const sceneIsReadyRef = React.useRef(sceneIsReady);
  const setSceneIsReady = (is: boolean) => {
    sceneIsReadyRef.current = is;
    _setSceneIsReady(is);
  };

  // TODO: make a hook for the base requirements
  //const [sceneView, isReady] = useThreeSceneView({container, assets})

  useEffect(() => {
    (async () => {
      try {
        // Prepare asset data for 3d asset loader
        const assetsData: IFile[] = props.assets3d;

        // Instanciate new scene view
        sceneViewRef.current = new SceneView();

        // init scene view
        await sceneViewRef.current.init({
          domContainer: webglContainerRef.current,
          assetsData,
          // NOTE: base path to static loaders files here
          staticLoadersBasePath: "./gltf/",
        });
      } catch (error) {
        console.error(error);
      }

      // Start loop on assets and scene ready
      sceneViewRef.current.loop();
      setSceneIsReady(true);
      props.onSceneIsReady?.();

      debug("Three Scene loaded");
    })().catch((err) => {
      console.error(err);
    });

    return () => {
      sceneViewRef.current.destroy();
    };
  }, []);

  /**
   * Control pause scene from parent
   */
  useEffect(() => {
    if (props.isPaused === null || !sceneViewRef.current) return;
    sceneViewRef.current.paused = props.isPaused;
  }, [props.isPaused]);

  // --------------------------------------------------------------------------- INPUT EVENTS

  useEffect(() => {
    if (!sceneIsReady) return;

    // MOUSE EVENT
    const throttleHandleMouseMove = throttle(handleMouseMove, 50, {
      leading: true,
      trailing: true,
    });
    function handleMouseMove(event) {
      sceneViewRef.current.onMouseMove(event);
    }
    // TODO: add raycaster example
    window.addEventListener("mousemove", throttleHandleMouseMove, {
      passive: true,
    });
    // TODO: check if usefull for raycast (on mobile)
    //window.addEventListener("touchmove", throttleHandleMouseMove, { passive: true })

    // CLICK EVENT
    function handleClick(event) {
      sceneViewRef.current.onClick(event);
    }
    window.addEventListener("touchend", handleClick);
    window.addEventListener("mouseup", handleClick);

    // Remove events on unmount
    return () => {
      window.removeEventListener("mousemove", throttleHandleMouseMove);
      // TODO: check if usefull for raycast
      //window.removeEventListener("touchmove", throttleHandleMouseMove)

      window.removeEventListener("touchend", handleClick);
      window.removeEventListener("mouseup", handleClick);
    };
  }, [sceneIsReady]);

  // --------------------------------------------------------------------------- RENDER

  return (
    <div className={[css.root, props.className].filter((e) => e).join(" ")}>
      <div className={css.sceneWrapper}>
        <div
          style={{ visibility: !sceneIsReady ? "hidden" : "initial" }}
          ref={webglContainerRef}
          className={css.sceneContainer}
        />
      </div>
    </div>
  );
}

export default ThreeScene;
