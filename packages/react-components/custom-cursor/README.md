# React Custom Cursor

A basic React Custom Cursor. It move only on mouse move. It is possible to animate child elements by listening to the state of the cursor from the CustomCursorManager.

## Usage

Copy / past the component folder in your React project:

```tsx
import { CustomCursor } from "./CustomCursor";

const App = () => {
  return (
    <div>
      <CustomCursor />
    </div>
  );
};
```

Change the style as needed in [CustomCursor.module.less](customCursor/CustomCursor.module.less).

## Dependencies

- [@solid-js/signal](https://www.npmjs.com/package/@solid-js/signal)

## props

| props               | type                                     | description                                                           | default value                       | optional |
| ------------------- | ---------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- | -------- |
| className           | `string`                                 | (check default props)                                                 | /                                   | true     |

## Example

Install dependencies from root:

```shell
npm i & lerna bootstrap
```

Start dev server from this package:

```shell
npm run dev
```
