# React slider

A simple React slider. It move only on drag gesture with min/max limit.

## Usage

Copy / past the component folder in your React project:

```tsx
const App = () => {
  return (
    <div>
      <Slider>
        <SliderItem />
        <SliderItem />
        <SliderItem />
        <SliderItem />
      </Slider>
    </div>
  );
};
```

Change the style as needed in [Slider.module.less](slider/Slider.module.less)

**important**:

- set `overflow-x: hidden` on body
- set a `height` value on Slider root

## Dependencies

- [gsap](https://github.com/greensock/GSAP)
- [react-use-gesture](https://github.com/pmndrs/use-gesture)
- [@wbe/use-window-size](https://github.com/willybrauner/use-window-size)

## props

| props      | type          | description                         | default value | optional |
| ---------- | ------------- | ----------------------------------- | ------------- | -------- |
| children\* | `ReactNode[]` | Slider item component / DOM element | /             | false    |
| className  | `string`      | (check default props)               | /             | true     |

## Example

Install dependencies from root:

```shell
npm i & lerna bootstrap
```

Start dev server from this package:

```shell
npm run dev
```
