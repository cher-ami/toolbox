import React from "react";
import Marquee from "../marquee/Marquee";
import css from "./App.module.less";

const App = () => {
  return (
    <div className={css.root}>
      {new Array(10).fill(null).map((el, i) => {
        return (
          <div key={i}>
            <Marquee
              speed={100 * (i + 1)}
              className={[css.marquee, css.marquee_duplicated].join(" ")}
            >
              <span className={css.element}>{"duplicated child"}</span>
            </Marquee>
            <Marquee
              speed={100 * (i + 1)}
              cloneChild={false}
              className={[css.marquee, css.marquee_noDuplicated].join(" ")}
            >
              <span className={css.element}>{"duplicated child"}</span>
            </Marquee>
          </div>
        );
      })}
    </div>
  );
};

export default App;
