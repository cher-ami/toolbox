import { Scene, Renderer } from "three"

/**
 * Init browser plugin three dev tool (chrome, firefox)
 * @param  {Renderer} renderer Three renderer
 * @param  {Scene} scene Three scene
 */
function threeDevToolBrowserPlugin(renderer: Renderer, scene: Scene) {
  // Observe scene for three dev tool plugin (https://chrome.google.com/webstore/detail/threejs-developer-tools/ebpnegggocnnhleeicgljbedjkganaek/related)
  // @ts-ignore
  if (typeof __THREE_DEVTOOLS__ !== "undefined") {
    // @ts-ignore
    __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: scene }))
    // @ts-ignore
    __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: renderer }))
  }
}

export default threeDevToolBrowserPlugin
