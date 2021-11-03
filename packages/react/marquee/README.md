# React marquee

A Marquee component animated and controlled by css variables.

## Usage

Copy / past the component folder in your React project:

```tsx
import Marquee from "./Marquee";

const App = () => {
  return (
    <div>
      <Marquee>
        <span>{"text"}</span>
      </Marquee>

      <Marquee cloneChild={false}>
        <span>{"text"}</span>
      </Marquee>
    </div>
  );
};
```

## Dependencies

No dependencies.

## props

> (\* no optional props)

| props        | type                  | description                                                              | default value |
| ------------ | --------------------- | ------------------------------------------------------------------------ | ------------- |
| children\*   | `ReactNode`           | The children rendered inside the marquee                                 | /             |
| style        | `React.CSSProperties` | Inline style on root element                                             | `{}`          |
| play         | `boolean`             | Play or pause the marquee                                                | `true`        |
| pauseOnHover | `boolean`             | Pause the component animation when hovered                               | `false`       |
| pauseOnClick | `boolean`             | Pause the component animation when clicked                               | `false`       |
| direction    | `left / right`        | Animation direction                                                      | `left`        |
| speed        | `number`              | Duration to delay the animation after render                             | `20`          |
| delay        | `number`              | The number of times the marquee should loop, 0 is equivalent to infinite | `0`           |
| loop         | `boolean`             | The children rendered inside the marquee                                 | `0`           |
| cloneChild   | `boolean`             | Clone child element if is smaller than window width                      | `true`        |
| className    | `string`              | Class name on root element                                               | `""`          |

## Example

Install dependencies from root:

```shell
npm i & lerna bootstrap
```

Start dev server from this package:

```shell
npm run dev
```
