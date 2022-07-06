# React ThreeSCene

A react component for instanciating a base [Three.js](https://threejs.org/) scene with :

- Basic postprocessing (disabled by default)
- An assetmanager to load 3d assets with corresponding loaders :
 - Gltf support meshoptimise extension and draco
 - Basis texture support (.ktx2)
- [Scene objects architecture](./3D/sceneObjects/) with "in-object" controls :
- Debug mode with camera orbit control
- Gui with [tweakpane](https://www.npmjs.com/package/tweakpane)
- Basic env lighting
- Camera manager with two modes : `orbit control`, `first person`
- Transform control in debug mode

## Usage

Copy / past the component folder in your React project:

```tsx
import ThreeScene from "./threeScene/ThreeScene";

const App = () => {
  return (
    <div>
      <ThreeScene
        isVisible={true}
        isPaused={false}
        assets3d={myAssetsData}
        onSceneIsReady={() => {
          log("Three scene is ready");
        }}
      />
    </div>
  );
};
```

### Adding custom loaders static .js

Copy content of `publicAsset` in your `public` folder and set path to `SceneView` init constructor parameter `staticLoadersBasePath`

### Loading shaders files .frag & .vert

Add module declaration from `global.d.ts`

You can then load a shader file like :

```javascript
import frag from "./test.frag?raw";
```

## Dependencies

- [three](https://www.npmjs.com/package/three)
- [lodash.throttle](https://www.npmjs.com/package/lodash.throttle)
- [events](https://www.npmjs.com/package/events)
- [postprocessing](https://www.npmjs.com/package/postprocessing)
- [tweakpane](https://www.npmjs.com/package/tweakpane)
- [@tweakpane/core](https://www.npmjs.com/package/@tweakpane/core)
- [@wbe/debug](https://www.npmjs.com/package/@wbe/debug)
- [camera-controls](https://www.npmjs.com/package/camera-controls)

Install all dependencies :
`npm i three @types/three0.140 lodash.throttle events camera-controls postprocessing tweakpane @tweakpane/core @wbe/debug`

## props

> (\* no optional props)

| props          | type      | description                  | default value |
| -------------- | --------- | ---------------------------- | ------------- |
| isPaused       | `boolean` | If scene is paused           | `false`       |
| isVisible      | `boolean` | If scene is visible          | `false`       |
| onSceneIsReady | `void`    | Callback when scene is ready | ` `           |
| className      | `string`  | Class name on root element   | `""`          |

## Demo

https://cherami-threejs-base-component.netlify.app/

## Assets optimisations

### GLTF/GLB

Use [meshoptimiser](https://meshoptimizer.org/gltf/) to optimise and compress glb files. It includes .basis texture compression.

- Installation :

```bash
npm install -g gltfpack
```

- Compress a gltf :

```bash
gltfpack -i ./input.gltf  -o ./output.glb -cc -tc -kn -km -tp
```

Details on options : https://meshoptimizer.org/gltf/#options

### Textures

Use [basis](https://medium.com/samsung-internet-dev/using-basis-textures-in-three-js-6eb7e104447d#:~:text=Textures%20in%20Three.-,js,and%20requires%20the%20latest%20THREE.) compression under .ktx2 container :

- Install basis_universal

```bash
brew install basis_universal
```

- Convert a .png (not working with .jpg) :

```bash
basisu -y_flip -ktx2  -uastc -uastc_rdo_l 1.0 -mipmap input.png
```

Details on options : https://github.com/BinomialLLC/basis_universal#:~:text=basisu%20%2Duastc%20%2Duastc_level%202%20%2Duastc_rdo_l%20.75%20x.png
