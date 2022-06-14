import React from "react";
import ThreeScene from "../threeScene/ThreeScene";
import css from "./App.module.less";



const App = () => {
  return (
    <div className={css.root}>
        <ThreeScene
          isVisible={true}
          isPaused={false}
          // TODO: add on scene start callback
          onSceneIsReady={() => console.log('ThreeScene ready')}
        />
    </div>
  );
};

export default App;
