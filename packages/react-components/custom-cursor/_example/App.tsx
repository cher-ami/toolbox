import React, { useRef } from "react";
import CustomCursor from "../customCursor/CustomCursor";
import CustomCursorManager from "../customCursor/CustomCursorManager";
import css from "./App.module.less";

const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------- BUTTON EVENTS

  const onButtonMouseEnterHandler = () => {
    CustomCursorManager.cursorState.dispatch("hidden");
  };

  const onButtonMouseLeaveHandler = () => {
    CustomCursorManager.cursorState.dispatch("default");
  };

  // -------------------------------------------------------------- RENDER

  return (
    <div className={css.root} ref={rootRef}>
      <button
        className={css.button}
        onMouseEnter={onButtonMouseEnterHandler}
        onMouseLeave={onButtonMouseLeaveHandler}
      >
        Hover me
      </button>
      <CustomCursor />
    </div>
  );
};

export default App;
