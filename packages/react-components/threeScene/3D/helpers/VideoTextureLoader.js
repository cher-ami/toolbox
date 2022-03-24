import { Loader, VideoTexture } from "three"
import { VideoLoader } from "./VideoLoader"

class VideoTextureLoader extends Loader {
  constructor(manager) {
    super(manager)
  }

  load(url, onLoad, onProgress, onError) {
    let texture

    const loader = new VideoLoader(this.manager)
    loader.setCrossOrigin(this.crossOrigin)
    loader.setPath(this.path)

    loader.load(
      url,
      function (video) {
        texture = new VideoTexture(video)

        if (onLoad !== undefined) {
          onLoad(texture)
        }
      },
      onProgress,
      onError
    )

    return texture
  }
}

export { VideoTextureLoader }
