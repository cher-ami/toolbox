# Smooth slider

A no deps smooth slider with a smoothy LERP guarantee 🍃

## Usage

Copy / past the component folder in your React project and import the `Slider` into the app:

```tsx
import { Slider } from "./Slider";

const App = () => {
  return (
    <div>
      <Slider className={"slider"} onProgress={(progress) => console.log(progress)}>
        <div className={"item"} />
        <div className={"item"} />
        <div className={"item"} />
        <div className={"item"} />
        <div className={"item"} />
      </Slider>
    </div>
  );
};
```

## Dependencies

No dependencies.

## props

> (\* no optional props)

| props             | type                       | description                                                                                                                                                   | default value |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| className         | `string`                   | Optional className of the slider                                                                                                                              | -             |
| onProgress        | `(progress, time?) => void`| A callback executed when slider moves. Params: `progress: number`: scroll position of slider in percentage, `time: DOMHighResTimeStamp` raf native time param | -             |

## Tips

You may need to set a min width to your items.  

## Example

Install dependencies from root

```shell
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```
