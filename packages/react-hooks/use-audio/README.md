# useAudio

TODO: Write description

## Dependencies

This library uses :

- [@solid-js/signal](https://www.npmjs.com/package/@solid-js/signal)
- [howler](https://www.npmjs.com/package/howler)
- [@wbe/deferred-promise](https://www.npmjs.com/package/@wbe/deferred-promise)
- [@wbe/debug](https://www.npmjs.com/package/@wbe/debug)

```shell
$ npm i @solid-js/signal howler @wbe/deferred-promise @wbe/debug
```

## Usage

```tsx
import { useAudio } from "./useAudio"
import sound from "./sound.mp3"

const audioApiInstance = useAudio(sound, { volume: 0.5 })
```

## API

# Play
```play(): number```

# Pause
```pause(): void```

# Replay
```replay(): void```

# Stop
```stop(): void```

# Loop
```loop(): Promise<void>```

# FadeIn
```fadeIn(duration: number = 1000): Promise<void>```

# FadeOut
```fadeOut(duration: number = 1000): Promise<void>```

# Mute
```mute(): void```

## props

| props     | type     | description           | default value | optional |
| --------- | -------- | --------------------- | ------------- | -------- |
| volume | `number` | Set volume of played sound. From 0.0 to 1.0 | 1             | true     |
| --------- | -------- | --------------------- | ------------- | -------- |
| autoplay | `boolean` | Decide if sound must be autoplayed | false             | true     |
| --------- | -------- | --------------------- | ------------- | -------- |
| loop | `boolean` | Decipe if sound must be played in loop | false             | true     |
| --------- | -------- | --------------------- | ------------- | -------- |
| preload | `boolean` | Decide if sound must be preloaded | true             | true     |
| --------- | -------- | --------------------- | ------------- | -------- |
| html5 | `boolean` | Same as [Howler's](https://github.com/goldfire/howler.js#html5-boolean-false)| true     |
| --------- | -------- | --------------------- | ------------- | -------- |
| delay | `number` | Set a delay in ms before sound is played | 0             | true     |
| --------- | -------- | --------------------- | ------------- | -------- |

## Example

TODO: Setup an example to test this hook

```shell
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```
