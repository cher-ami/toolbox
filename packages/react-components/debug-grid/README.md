# Debug grid

A debug layout grid to use in development

## Usage

Copy / past the component folder in your React project and import the `DebugGrid` into the app:

```tsx
import { DebugGrid } from "./DebugGrid";

const App = () => {
  return (
    <div>
      <DebugGrid columnsDesktop={40} columnsTablet={28} columnsMobile={20} />
    </div>
  );
};
```

Set the right numbers of column you want for each breakpoints

## Dependencies

No dependencies.

## props

> (\* no optional props)

| props             | type                       | description                                                                                                                       | default value |
| ----------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| columnsDesktop\*  | `number`                   | Number of column on desktop (resolutions over @breakpoint-laptop declared in breakpoints.less)                                    | -          |
| columnsTablet\*   | `number`                   | Number of column on tablet (resolutions over @breakpoint-tablet declared in breakpoints.less)                                     | -          |
| columnsMobile\*   | `number`                   | Number of column on mobile (resolutions under @breakpoint-tablet declared in breakpoints.less)                                    | -          |
| maxSize           | `number`                   | Max resolution : If setted, over this resolution the grid will stop growing proportionnaly and columns width will be setted in px | -          |
| color             | `string`                   | An hex code for the color of the lines. Had to match with `/^#([0-9A-F]{3}){1,2}$/i` or default value will be used                | `#f323fa`     |
| triggerKey        | `string`                   | The key that will display the grid if it is pressed. Had to match with `/[a-z]\|Space\|Enter/m` or default value will be used       | `g`           |

## Tips

The purpose of this grid is to check if layout is respected during development phase, it should not be display in prod.
Use an environment variable has condition to render `DebugGrid`.

```tsx

const App = () => {
  return (
    <div>
        {
            import.meta.env.VITE_SHOW_GRID != "true" &&
            <DebugGrid columnsDesktop={40} columnsTablet={28} columnsMobile={20} />
        }
    </div>
  );
};
```

## Example

Install dependencies from root

```shell
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```
