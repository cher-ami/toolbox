import React, { useEffect, useRef } from "react";
import { AudioApi, useAudio } from "../src/useAudio";
import css from "./App.module.less";

import drumHitRim from "./assets/drum_hit_rim.mp3";
import drumSnakeRoll from "./assets/drum_snake_roll.mp3";
import harpAscend from "./assets/harp_ascend.mp3";

const App = () => {

  const drumHitRimSound = useAudio(drumHitRim, {volume: 0.8});
  const drumSnakeRollSound = useAudio(drumSnakeRoll, {volume: 0.8});

  return (
    <div className={css.container}>
      <div className={css.wrapper}>
        <p className={css.name}>Drum Hit Rim</p>
        <div className={css.buttons}>
          <button className={css.button} onClick={drumHitRimSound.play()}>Play</button>
          <button className={css.button}>Pause</button>
          <button className={css.button}>Stop</button>
          <button className={css.button}>Replay</button>
          <button className={css.button}>Loop</button>
          <button className={css.button}>FadeIn</button>
          <button className={css.button}>FadeOut</button>
          <button className={css.button}>Mute</button>
        </div>
      </div>


      <div className={css.wrapper}>
        <p className={css.name}>Drum Snake Roll</p>
        <div className={css.buttons}>
          <button className={css.button}>Play</button>
          <button className={css.button}>Pause</button>
          <button className={css.button}>Stop</button>
          <button className={css.button}>Replay</button>
          <button className={css.button}>Loop</button>
          <button className={css.button}>FadeIn</button>
          <button className={css.button}>FadeOut</button>
          <button className={css.button}>Mute</button>
        </div>
      </div>
    </div>
  );
};

export default App;
