# CSS Sprite Animator 👾

An extremly light and basic sprite animator

## Basic usage

Create a new `SpriteAnimator` instance with div element where the sprite will be displayed and the spritesheet options.

```tsx
import SpriteAnimator from "./SpriteAnimator";

const App = () => {
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sprite = new SpriteAnimator(spriteRef.current, {
      spriteSheetUrl: "assets/spriteSheet.png",
      frameWidth: 256,
      frameHeight: 256,
      totalFrames: 16,
      columns: 8,
      lines: 2,
      fps: 10,
      autoPlay: true,
      reverse: false,
      loop: false,
    })
  }, []);

  return (
    <div>
      <div ref={spriteRef}>
    </div>
  );
};
```

## React Sprite component

Or you can use the ready to use `Sprite` component :

```tsx
import Sprite from "./Sprite";

const App = () => {
  return (
    <div>
      <Sprite 
        className={"sprite"}
        spriteSheet={"assets/spriteSheet.png"}
        spriteSheetData={{
          frameWidth: 256,
          frameHeight: 256,
          totalFrames: 16,
          columns: 8,
          lines: 2,
        }}
        fps={10}
        play={playSprite}
        reverse={false}
        loop={false}
        yoyo={false}
      />
    </div>
  );
};
```

## Dependencies

No dependencies.

## constructor params

> (\* required params)

| param           | type                  | description                                                              | 
| --------------- | --------------------- | ------------------------------------------------------------------------ | 
| `element`\*     | `HTMLDivElement`      | The div element that will render the sprite                              | 
| `options`\*     | `TSpriteOptions`      | An options object                                                        | 

### options :

| option            | type                  | description                                                              | 
| ----------------- | --------------------- | ------------------------------------------------------------------------ |
| `spriteSheetUrl`\*| `string`              | The url of the spritesheet                                               | 
| `totalFrames`\*   | `number`              | Total of frames in spritesheeet                                          |
| `frameWidth`\*    | `number`              | Original frames width in px                                              |
| `frameHeight`\*   | `number`              | Original frames height in px                                             |
| `columns`\*       | `number`              | Number of columns in spritesheet                                         |
| `lines`\*         | `number`              | Number of lines in spritesheet                                           |
| `fps`\*           | `number`              | Number of fps wanted for animation                                       |
| `autoPlay`        | `boolean`             | True if sprite must play at init. Default: `false`                       |
| `reverse`         | `boolean`             | Will play backward if true. Default: `false`                             |
| `loop`            | `boolean`             | If sprite animation must loop or not. Default: `false`                   |
| `yoyo`            | `boolean`             | If sprite animation must yoyo or not. Default: `false`                   |

## API

### Methods

| method                          | params                                                     | description                                                              | 
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | 
| `play(autoReset)`               | `autoReset: boolean` Will call `reset()` before if `true`  | Play sprite                                                              | 
| `stop()`                        | -                                                          | Stop                                                                     | 
| `playReverse(autoReset)`        | `autoReset: boolean` Will call `reset()` before if `true`  | Set reverse to true and play                                             | 
| `restart()`                     | -                                                          | Restart animation (shortcut for `play(true)`)                            | 
| `reset()`                       | -                                                          | Reset animation to first frame (or last frame if reverse is true) and stop (does not play immediately)  | 
| `nextFrame()`                   | -                                                          | Go to next frame (sync with reverse option)                              | 
| `previousFrame()`               | -                                                          | Go to previous frame (sync with reverse option)                          | 
| `setFrame(frame)`               | `frame: number` Frame to go to                             | Got to given frame                                                       | 
| `destroy()`                     | -                                                          | Remove events listeners and stop rendering loop                          | 

### Properties

| property                        | type                                                       | description                                                              | 
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | 
| `reverse`                       | `boolean`                                                  | Will play backward if true                                               | 
| `loop`                          | `boolean`                                                  | Will continually loop if true                                            | 
| `yoyo`                          | `boolean`                                                  | Will play with yoyo effect                                               | 
| `currentFrame`                  | `number`                                                   | Read only. Index of current sprite frame                                 | 
| `isPlaying`                     | `boolean`                                                  | Read only. Will play backward if true                                    | 
