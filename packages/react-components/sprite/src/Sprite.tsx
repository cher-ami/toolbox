import css from "./Sprite.module.less";
import React, { useEffect, useRef, useState } from "react";
import SpriteAnimator from "./SpriteAnimator";

export type TSpriteSheetData = {
    totalFrames: number,
    frameWidth: number,
    frameHeight: number,
    columns: number,
    lines: number,
}

interface IProps {
  /**
   * Class name to style the container div
   * Default: ""
   */
  className?: string;
  /**
   * The url of spritesheet to use
   */
  spriteSheet: string;
  /**
   * Spritesheet data
   */
  spriteSheetData: TSpriteSheetData
  /**
   * If sprite must play
   */
  play?: boolean;
  /**
   * Wanted fps
   * default: 15
   */
  fps?: number
  /**
   * Set current frame
   * default: 1
   */
  frame?: number
  /**
   * Set current frame
   * default: false
   */
  reverse?: boolean
}

/**
 * @name Sprite
 */
function Sprite(props: IProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const spriteRef = useRef<SpriteAnimator>(null);
  
    useEffect(() => {
      spriteRef.current = new SpriteAnimator(rootRef.current, {
        ...props.spriteSheetData,
        spriteSheetUrl: props.spriteSheet,
        fps: props.fps || 15,
        autoPlay: props.play,
        reverse: props.reverse
      })
  
      return () => {
        spriteRef.current.destroy()
      }
    }, []);
  
    useEffect(() => {
      if (props.play) {      
        spriteRef.current.play()
      } else {
        spriteRef.current.stop()
      }
    }, [props.play]);

    useEffect(() => {
        if (props.frame) {
            spriteRef.current.setFrame(props.frame)
        }
    }, [props.frame]);

    useEffect(() => {
        spriteRef.current.reverse = props.reverse
    }, [props.reverse]);

    return (<div className={[css.root, props.className].filter((v) => v).join(" ")} ref={rootRef} />)
}

export default Sprite;
