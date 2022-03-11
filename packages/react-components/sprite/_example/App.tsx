import React, { useState } from 'react'
import Sprite from '../src/Sprite';
import spriteSheet from './spritesheet.png';

export default function App() {
  const [playSprite, setPlaySprite] = useState<boolean>(true);
  const [reverse, setReverse] = useState<boolean>(false);

  return (
    <div>
      <Sprite 
        className={"sprite"}
        spriteSheet={spriteSheet}
        spriteSheetData={{
          frameWidth: 256,
          frameHeight: 256,
          totalFrames: 8,
          columns: 4,
          lines: 2,
        }}
        play={playSprite}
        fps={10}
        reverse={reverse}
      />
      <button onClick={() => setPlaySprite(!playSprite)}>Toggle</button>
      <button onClick={() => setReverse(!reverse)}>Toggle Reverse</button>
    </div>
  )
}