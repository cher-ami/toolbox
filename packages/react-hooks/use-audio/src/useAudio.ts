import { useEffect, useLayoutEffect, useState } from "react"
import { Howl, Howler } from "howler"
import { deferredPromise, TDeferredPromise } from "@wbe/deferred-promise"
import { StateSignal } from "@solid-js/signal"
import debug from "@wbe/debug"

const componentName = "AudioApi"
const log = debug(`front:${componentName}`)

export type TAudioApiOptions = {
  volume?: number
  autoplay?: boolean
  loop?: boolean
  preload?: boolean
  html5?: boolean
  delay?: number // ms
  sprite?: any
}

// --------------------------------------------------------------------------- GLOBAL

/**
 * Global Signal state
 */
export const MUTE_AUDIO_SIGNAL = StateSignal<boolean>(false)

// --------------------------------------------------------------------------- API

/**
 * Audio API Control a single sound
 * @dep Howl https://github.com/goldfire/howler.js
 */
class AudioApi {
  protected loadedPromise: TDeferredPromise<any>

  protected audioApiDefaultOptions: TAudioApiOptions = {
    volume: 1,
    autoplay: false,
    loop: false,
    preload: true,
    html5: false,
    delay: 0,
  }

  protected url: string
  protected options: TAudioApiOptions
  protected sound: Howl
  public id: number
  public isPlaying: boolean = false
  protected isLoaded: boolean = false
  protected isMute: boolean = false

  constructor(url: string, options?: TAudioApiOptions) {
    this.loadedPromise = deferredPromise()
    this.url = url
    this.options = {
      ...this.audioApiDefaultOptions,
      ...(options || {}),

      // si option.volume a une valeur, elle est * 0.5
      // si non elle est à 0 * 0.5
      volume: (options?.volume || this.audioApiDefaultOptions.volume) * 0.5,
    }
    this.autoInit()
  }

  protected autoInit(): void {
    this.initEvent()

    this.sound = new Howl({
      src: [this.url],
      ...this.options,
      onload: () => {
        this.isLoaded = true
        this.loadedPromise.resolve()
        if (this.isMute) this.mute()
      },
    })
  }

  protected initEvent(): void {
    // Trigger mute handler on init to set directly global mute state
    this.muteHandler(MUTE_AUDIO_SIGNAL.state);
    MUTE_AUDIO_SIGNAL.on(this.muteHandler.bind(this))
  }
  public destroy(): void {
    MUTE_AUDIO_SIGNAL.off(this.muteHandler)
    this.sound.unload()
  }

  protected muteHandler = (mute: boolean): void => {
    this.muteAllInstances(mute)
  }

  public play(): any {
    setTimeout(() => {
      if (this.id === undefined) {
        this.id = this.sound.play()
      } else {
        this.sound.play()
      }
      log("sound.play()")
      this.isPlaying = true
    }, this.options.delay)

    return this.id
  }

  public pause() {
    if (!this.isLoaded) return
    log("sound.pause()", this.id)
    this.sound.pause(this.id)
  }

  public replay(): void {
    this.stop()
    this.play()
  }

  public async stop() {
    this.sound.stop(this.id)
    log("sound.stop()", this.id)
    this.isPlaying = false
  }

  public async loop() {
    if (!this.isLoaded) await this.loadedPromise.promise
    this.sound.loop(true, this.id)
    this.isPlaying = true
  }

  public async fadeIn(duration: number = 1000) {
    if (!this.isLoaded) await this.loadedPromise.promise
    if (this.id === undefined) {
      this.id = this.sound.play()
    } else {
      this.sound.play(this.id)
    }
    this.isPlaying = true
    this.sound.fade(0, this.options.volume, duration, this.id)
    log("fadeIn", this.id)
  }

  public async fadeOut(duration: number = 1000) {
    if (!this.isLoaded) await this.loadedPromise.promise
    this.isPlaying = false
    // TODO: add audio stop
    this.sound.fade(this.options.volume, 0, duration, this.id)
    log("fadeOut", this.id)
  }

  public muteAllInstances(muteState: boolean = MUTE_AUDIO_SIGNAL.state): void {
    Howler.mute(muteState)
  }

  public mute(muteState: boolean = MUTE_AUDIO_SIGNAL.state): void {
    this.sound.mute(muteState, this.id)
  }
}

// --------------------------------------------------------------------------- HOOK

/**
 * return audio API instance for one audio file
 */
export const useAudio = (file: string, options?: TAudioApiOptions): AudioApi => {
  const [instance] = useState<AudioApi>(() => new AudioApi(file, options))
  useLayoutEffect(() => {
    return () => {
      instance.destroy()
    }
  }, [])

  return instance
}

/**
 * get and set mute sound state
 */
export const useMuteAudio = (): [boolean, (isMuted: boolean) => void] => {
  const [isMuted, setIsMuted] = useState<boolean>(MUTE_AUDIO_SIGNAL.state)

  useEffect(() => {
    const handler = (state: boolean) => {
      setIsMuted(state)
    }
    return MUTE_AUDIO_SIGNAL.on(handler)
  }, [])

  const setIsMutedState = (state: boolean) => {
    MUTE_AUDIO_SIGNAL.dispatch(state)
  }

  return [isMuted, setIsMutedState]
}
