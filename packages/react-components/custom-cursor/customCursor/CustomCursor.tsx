import css from "./CustomCursor.module.less";
import React, { useEffect, useRef, useState } from "react";
import CustomCursorManager, { TCursorState } from "./CustomCursorManager";
import { isHandeldDevice } from "./helpers/isHandeldDevice";

interface IProps {
  /**
   * Class name to style the container div
   * Type: string
   * Default: ""
   */
  className?: string;
}

/**
 * @name CustomCursor
 */
function CustomCursor(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Listen cursorState
   */
  const [cursorType, setCursorType] = useState<TCursorState>(CustomCursorManager.defaultType);

  useEffect(() => {
    const handleCursorType = async (pCursorType: TCursorState): Promise<void> => {
      setCursorType(pCursorType);
    };
    return CustomCursorManager.cursorState.on(handleCursorType);
  }, []);

  /**
   * Changing styles according to the cursorState
   */
  useEffect(() => {
    if (cursorType === "default") {
      rootRef.current.style.opacity = "1";
    } else if (cursorType === "hidden") {
      rootRef.current.style.opacity = "0";
    }
  }, [cursorType]);

  /**
   * Start mouse movement
   */
  useEffect(() => {
    CustomCursorManager.start(rootRef.current);
    return () => {
      CustomCursorManager.stop();
    };
  }, []);

  // ----------------------------------------------------------------------------- RENDER

  if (isHandeldDevice) {
    return <div />;
  }

  return (
    <div className={[css.root, props.className].filter((v) => v).join(" ")} ref={rootRef}>
      Custom Cursor
    </div>
  );
}

export default CustomCursor;
