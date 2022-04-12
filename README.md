# cher-ami toolbox

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Local and external tools collection for cher-ami projects. 

This README contains two types of tools:

- Local and NOT published tools (available on this repository)
- Externals and published tools ↗

## Why not publish tools of this repo on npm?

Because some tools need to be re-handled according to use, without that we want to re-develop them from scratch.
If a tool or component can be customized only via parameters, it should not have its place in this repository but become an independent library.

## How to contribute to this repos?

- Copy/past the [\_template](template) folder in the corresponding folder of your tool
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
- [@wbe/react-image](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-image) ↗ (React wrapper of [@wbe/lazy-image](https://github.com/willybrauner/lazy-image))
- [@wbe/react-video](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-video) ↗
- [@wbe/react-transition](https://github.com/willybrauner/react-libraries/tree/main/packages/react-components/react-transition) ↗

### react-hooks

- [use-is-handheld-and-landscape](packages/react-hooks/use-is-handheld-and-landscape)
- [@wbe/use-window-size](https://github.com/willybrauner/react-libraries/tree/main/packages/react-hooks/use-window-size) ↗
- [@wbe/use-did-update](https://github.com/willybrauner/react-libraries/tree/main/packages/react-hooks/use-did-update) ↗
- [@react-hook/media-query](https://github.com/jaredLunde/react-hook/tree/master/packages/media-query) ↗

### react-routing

- [@cher-ami/router](https://github.com/cher-ami/router) ↗

### managers

- [@cher-ami/transition-manager](https://github.com/cher-ami/transitions-manager) ↗
- [@cher-ami/smooth-scroll](https://github.com/cher-ami/smooth-scroll) ↗
- [@cher-ami/audio-manager](https://github.com/cher-ami/audio-manager) ↗


### utils


- [shareUrls](packages/social/shareUrls.ts)
- [@wbe/lazy-image](https://github.com/willybrauner/lazy-image) ↗
- [@wbe/debug](https://github.com/willybrauner/debug) ↗
- [@wbe/deferred-promise](https://github.com/willybrauner/deferred-promise) ↗
- [@solid-js/signal](https://github.com/solid-js/solid/tree/master/libraries/iso-signal) ↗


## Credits

© cher-ami

## Licence

[MIT](LICENSE)
