import React from "react";
import ThreeScene from "../threeScene/ThreeScene";
import css from "./App.module.less";
import assets3dData from "./assets3dData";



const App = () => {
  return (
    <div className={css.root}>
        <ThreeScene
          isVisible={true}
          isPaused={false}
          assets3d={assets3dData}
          // TODO: add on scene start callback
          onSceneIsReady={() => console.log('ThreeScene ready')}
        />
    </div>
  );
};

export default App;
