# React ThreeSCene

A react component for instanciating a base [Three.js](https://threejs.org/) scene with :
- Basic postprocessing (disabled by default)
- An assetmanager to load 3d assets with corresponding loaders
- [Scene objects architecture](./3D/sceneObjects/) with "in-object" controls : 
- Debug mode with camera orbit control
- Gui with [tweakpane](https://www.npmjs.com/package/tweakpane)
- Basic env lighting

## Usage

Copy / past the component folder in your React project:

```tsx
import ThreeScene from "./threeScene/ThreeScene"

const App = () => {
  return (
    <div>
      <ThreeScene
        isVisible={true}
        isPaused={false}
        onSceneIsReady={() => {
          log("Three scene is ready")
        }}
      />
    </div>
  );
};
```

## Dependencies

- [three](https://www.npmjs.com/package/three)
- [lodash.throttle](https://www.npmjs.com/package/lodash.throttle)
- [events](https://www.npmjs.com/package/events)
- [postprocessing](https://www.npmjs.com/package/postprocessing)
- [tweakpane](https://www.npmjs.com/package/tweakpane)
- [@tweakpane/core](https://www.npmjs.com/package/@tweakpane/core)
- [@wbe/debug](https://www.npmjs.com/package/@wbe/debug)

Install all dependencies : 
`npm i three lodash.throttle events postprocessing tweakpane @tweakpane/core @wbe/debug`

## props

> (\* no optional props)

| props        | type                  | description                                                              | default value |
| ------------ | --------------------- | ------------------------------------------------------------------------ | ------------- |
| isPaused     | `boolean`             | If scene is paused                                                       | `false`           |
| isVisible    | `boolean`             | If scene is visible                                                      | `false`           |
| onSceneIsReady | `void`             | Callback when scene is ready                                              | ` `           |
| className    | `string`              | Class name on root element                                               | `""`          |

## Demo
https://cherami-threejs-base-component.netlify.app/

## TODO
- [ ] Add shader loader
- [ ] Add gltf optimisation instructions