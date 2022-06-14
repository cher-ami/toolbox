import { Cache, Loader } from "three"
import { createElementNS } from "three/src/utils.js"

class VideoLoader extends Loader {
  constructor(manager) {
    super(manager)
  }

  load(url, onLoad, onProgress, onError) {
    if (this.path !== undefined) url = this.path + url

    url = this.manager.resolveURL(url)

    const scope = this

    const cached = Cache.get(url)

    if (cached !== undefined) {
      scope.manager.itemStart(url)

      setTimeout(function () {
        if (onLoad) onLoad(cached)

        scope.manager.itemEnd(url)
      }, 0)

      return cached
    }

    const video = createElementNS("video")

    function onVideoLoad() {
      removeEventListeners()

      Cache.add(url, this)

      if (onLoad) onLoad(this)

      scope.manager.itemEnd(url)
    }

    function onVideoError(event) {
      removeEventListeners()

      if (onError) onError(event)

      scope.manager.itemError(url)
      scope.manager.itemEnd(url)
    }

    function removeEventListeners() {
      video.removeEventListener("loadeddata", onVideoLoad, false)
      video.removeEventListener("loadedmetadata", onVideoLoad, false)
      video.removeEventListener("error", onVideoError, false)
    }

    video.addEventListener("loadeddata", onVideoLoad, false)
    video.addEventListener("loadedmetadata", onVideoLoad, false)
    video.addEventListener("error", onVideoError, false)

    if (url.substr(0, 5) !== "data:") {
      if (this.crossOrigin !== undefined) video.crossOrigin = this.crossOrigin
    }

    scope.manager.itemStart(url)

    video.src = url
    return video
  }
}

export { VideoLoader }
