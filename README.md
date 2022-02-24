# Toolbox

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

List of tools for cher-ami projects.
Some of these tools are **not published on npm and not compiled**. You have to copy/past the selected tool in your cher-ami project.

## Why not published some tools on npm?

Because some tools need to be re-handled according to use, without that we want to re-develop them from scratch.
If a tool or component can be customized only via parameters, it should not have its place in this repository but become an independent library. 

## How to contribute?

- Copy/past the template in the corresponding folder of your tool
- Add name and description in package.json / README.md
- Add your tool in src
- Create an example in "\_example" folder if needed. A vitejs project is setup in each package, ready to be.
- If you create a new folder in [packages](packages) folder, add it in the [lerna.json](lerna.json) file.
- Add the new tool in main [README.md](README.md) file.

## Summary

### react-components

- [cookies-banner](packages/react-components/cookies-banner)
- [marquee](packages/react-components/marquee)
- [slider](packages/react-components/slider)
- [custom-cursor](packages/react-components/custom-cursor)
- [react-image](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-image) ↗
- [react-video](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-video) ↗
- [react-transition](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-transition) ↗

### react-hooks

- [use-audio](packages/react-hooks/use-audio)
- [use-is-handheld-and-landscape](packages/react-hooks/use-is-handheld-and-landscape)
- [use-window-size](https://github.com/willybrauner/react-libraries/tree/main/packages/react-hooks/use-window-size) ↗
- [use-did-update](https://github.com/willybrauner/react-libraries/tree/main/packages/react-hooks/use-did-update) ↗

### social

- [shareUrls](packages/social/shareUrls)

## Credits

© cher-ami

## Licence

[MIT](LICENSE)
