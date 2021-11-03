import React from "react";
import Slider from "../slider/Slider";
import css from "./App.module.less";

const SliderItem = (props) => {
  return <div className={css.item}>Item</div>;
};

const App = () => {
  return (
    <div className={css.root}>
      <Slider className={css.slider}>
        {new Array(10).fill(null).map((el, i) => (
          <SliderItem key={i} />
        ))}
      </Slider>
    </div>
  );
};

export default App;
