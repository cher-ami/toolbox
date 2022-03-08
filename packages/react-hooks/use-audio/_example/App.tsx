import React, { useEffect, useRef } from "react";
import { AudioApi, useAudio, useMuteAudio } from "../src/useAudio";
import css from "./App.module.less";

import drumHitRim from "./assets/drum_hit_rim.mp3";
import drumSnakeRoll from "./assets/drum_snake_roll.mp3";
import harpAscend from "./assets/harp_ascend.mp3";
import applause from "./assets/applause.wav";
import heartbeat from "./assets/heartbeat.wav";

const App = () => {
  const applauseSound = useAudio(applause, { volume: 0.8, loop: true });
  const heartbeatSound = useAudio(heartbeat, { volume: 0.8 });

  const [isMuted, setIsMuted] = useMuteAudio()

  return (
    <div className={css.root}>
      <div className={css.container}>
        <div className={css.wrapper}>
          <h2 className={css.name}>Applause</h2>
          <p className={css.options}>loop - volume : 0.8</p>
          <div className={css.buttons}>
            <button
              className={css.button}
              onClick={() => applauseSound.play()}
            >
              Play
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.pause()}
            >
              Pause
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.stop()}
            >
              Stop
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.replay()}
            >
              Replay
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.fadeIn()}
            >
              FadeIn
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.fadeOut()}
            >
              FadeOut
            </button>
            <button
              className={css.button}
              onClick={() => applauseSound.mute()}
            >
              Mute
            </button>
          </div>
        </div>

        <div className={css.wrapper}>
          <h2 className={css.name}>Heartbeat</h2>
          <p className={css.options}>volume : 0.8</p>
          <div className={css.buttons}>
            <button
              className={css.button}
              onClick={() => heartbeatSound.play()}
            >
              Play
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.pause()}
            >
              Pause
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.stop()}
            >
              Stop
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.replay()}
            >
              Replay
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.fadeIn()}
            >
              FadeIn
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.fadeOut()}
            >
              FadeOut
            </button>
            <button
              className={css.button}
              onClick={() => heartbeatSound.mute()}
            >
              Mute
            </button>
          </div>
        </div>

        <button className={isMuted ? css.active : ""} onClick={() => setIsMuted(!isMuted)}>Mute all</button>
      </div>
    </div>
  );
};

export default App;
