# CSS Sprite Animator

An extremly light and basic sprite animator

## Usage

Copy / past the component folder in your React project:

```tsx
import Sprite from "./Sprite";

const App = () => {
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sprite = new Sprite(spriteRef.current, {
      spriteSheetUrl: spriteSheet,
      frameWidth: 49,
      frameHeight: 49,
      totalFrames: 21,
      columns: 7,
      lines: 3,
      fps: 10,
      autoPlay: true
    })
  }, []);

  return (
    <div>
      <div ref={spriteRef}>
    </div>
  );
};
```

## Dependencies

No dependencies.

## constructor params

> (\* required params)

| param         | type                  | description                                                              | 
| ------------- | --------------------- | ------------------------------------------------------------------------ | 
| `element`\*     | `HTMLDivElement`      | The div element that will render the sprite                              | 
| `options`\*     | `TSpriteOptions`      | An options object                                                        | 

## options

| option          | type                  | description                                                              | 
| --------------- | --------------------- | ------------------------------------------------------------------------ |
| `spriteSheetUrl`\*| `string`              | The url of the spritesheet                                               | 
| `totalFrames`\*   | `number`              | Total of frames in spritesheeet                                          |
| `frameWidth`\*    | `number`              | Original frames width in px                                              |
| `frameHeight`\*   | `number`              | Original frames height in px                                             |
| `columns`\*       | `number`              | Number of columns in spritesheet                                         |
| `lines`\*         | `number`              | Number of lines in spritesheet                                           |
| `fps`\*           | `number`              | Number of fps wanted for animation                                       |
| `autoPlay`        | `boolean`             | True if sprite must play at init                                         |
| `reverse`         | `boolean`             | Will play backward if true                                               |

## API

### Methods

| method                          | params                                                     | description                                                              | 
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | 
| `play()`                        | -                                                          | The div element that will render the sprite                              | 
| `stop()`                        | -                                                          | An options object                                                        | 
| `nextFrame()`                   | -                                                          | Go to next frame                                                         | 
| `previousFrame()`               | -                                                          | Go to previous frame                                                     | 
| `setFrame(frame)`               | `frame: number` Frame to go to                             | Got to given frame                                                       | 
| `destroy()`                     | -                                                          | Remove events listeners and stop rendering loop                          | 

### Properties

| properties                      | type                                                       | description                                                              | 
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | 
| `reverse`                       | `boolean`                                                  | Will play backward if true                                               | 
| `currentFrame`                  | `number`                                                   | Read only. Index of current sprite frame                                 | 
| `isPlaying`                     | `boolean`                                                  | Read only. Will play backward if true                                    | 
