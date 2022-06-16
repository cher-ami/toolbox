# React Custom Cursor

A basic React Custom Cursor. It move only on mouse move. It is possible to animate child elements by listening to the state of the cursor from the CustomCursorManager.

## Dependencies

- [@solid-js/signal](https://www.npmjs.com/package/@solid-js/signal)

```shell
$ npm i @solid-js/signal
```

## Usage

Copy / past the component folder in your React project and import the `CustomCursor` into the app:

```tsx
import {CustomCursor} from "./customCursor";

const App = () => {
  return (
    <div>
      <CustomCursor/>
    </div>
  );
};
```

Change the style as needed in [CustomCursor.module.less](customCursor/CustomCursor.module.less).

The state of the custom cursor can be modified by the `CustomCursorManager.ts` from anywhere in the application. States can be added in `TCursorState` in [CustomCursorManager.ts](customCursor/CustomCursorManager.ts).

```ts
// CustomCursorManager.ts
export type TCursorState = "hidden" | "default" | "myCursorState";

// MyButton.tsx
const MyButton = () => {
  
  const onButtonMouseEnterHandler = () => {
    CustomCursorManager.cursorState.dispatch("myCursorState");
  };

  const onButtonMouseLeaveHandler = () => {
    CustomCursorManager.cursorState.dispatch("default");
  };

  return (
    <button
      onMouseEnter={onButtonMouseEnterHandler}
      onMouseLeave={onButtonMouseLeaveHandler}
    >
      Hover me
    </button>
  );
};
```

To animate the cursor or its child elements, you need to listen to the `CustomCursorManager` state change from the `CustomCursor`. Depending on the state, elements can be animated or not.

```tsx
function CustomCursor(props: IProps) {

  // ...

  const [cursorType, setCursorType] = useState<TCursorState>(CustomCursorManager.defaultType);
  
  useEffect(() => {
    const handleCursorType = async (pCursorType: TCursorState): Promise<void> => {
      setCursorType(pCursorType);
    };
    return CustomCursorManager.cursorState.on(handleCursorType);
  }, []);

  
  useEffect(() => {
    if (cursorType === "default") {

      // Display cursor
      
    } else if (cursorType === "hidden") {
      
      // Hide cursor
      
    }
  }, [cursorType]);

  // ...

  return (
    <div>
      Custom Cursor
    </div>
  );
};
```

## props

| props     | type     | description           | default value | optional |
| --------- | -------- | --------------------- | ------------- | -------- |
| className | `string` | (check default props) | /             | true     |

## Example

Install dependencies from root:

```shell
npm i & lerna bootstrap
```

Start dev server from this package:

```shell
npm run dev
```
