import React from "react";
import Slider from "../src/Slider";

const App = () => {
  return (
    <div>
      <Slider className={"slider"} onProgress={(e) => console.log(e)}>
        <div className={"items"}/>
        <div className={"items"} />
        <div className={"items"} />
        <div className={"items"} />
        <div className={"items"} />
      </Slider>
    </div>
  );
};

export default App;
