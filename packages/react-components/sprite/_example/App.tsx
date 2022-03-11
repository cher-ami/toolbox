import React, { useEffect, useRef, useState } from 'react'
import SpriteAnimator from '../src/SpriteAnimator';
import spritesheet from './spritesheet.png';

export default function App() {
  const spriteRef = useRef<SpriteAnimator>(null);
  const spriteContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    spriteRef.current = new SpriteAnimator(spriteContainerRef.current, {
      spriteSheetUrl: spritesheet,
      frameWidth: 256,
      frameHeight: 256,
      totalFrames: 8,
      columns: 4,
      lines: 2,
      fps: 10,
      autoPlay: true,
      reverse: false
    })

    return () => {
      spriteRef.current.destroy()
    }
  }, []);

  const [reverse, setReverse] = useState<boolean>(false);

  useEffect(() => {
    spriteRef.current.reverse = reverse
  }, [reverse]);

  const [loop, setLoop] = useState<boolean>(false);

  useEffect(() => {
    spriteRef.current.loop = loop
  }, [loop]);

  return (
    <div>
      <div style={{width: "78vw"}} ref={spriteContainerRef} />
      <button onClick={() => spriteRef.current.play()}>Play</button>
      <button onClick={() => spriteRef.current.stop()}>Stop</button>
      <button onClick={() => spriteRef.current.restart()}>Restart</button>
      <button onClick={() => spriteRef.current.reset()}>Reset</button>
      <button onClick={() => setReverse(!reverse)}>Reverse : {reverse ? "true" : "false"}</button>
      <button onClick={() => setLoop(!loop)}>Loop : {loop ? "true" : "false"}</button>
    </div>
  )
}