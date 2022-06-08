export type TSpriteOptions = {
    spriteSheetUrl: string
    totalFrames: number
    frameWidth?: number
    frameHeight?: number
    columns: number
    lines: number
    fps: number
    autoPlay?: boolean
    reverse?: boolean
    loop?: boolean
    yoyo?: boolean
  }
  
  type TPosition = {
    x: number
    y: number
  }

export default class SpriteAnimator {
    private element: HTMLDivElement
    private options: TSpriteOptions
    private frameDuration: number
    private _currentFrame: number
    private _isPlaying: boolean
    private boundingRect: DOMRect
    private raf: number
    public reverse: boolean
    public loop: boolean
    public yoyo: boolean
    private currentYoyoDirection: (1 | -1)

    private lastTime: number
    private currentTime: number

    get isPlaying () {
        return this._isPlaying
    }

    get currentFrame () {
        return this._currentFrame
    }

    constructor(element: HTMLDivElement, options: TSpriteOptions) 
    {
        this.element = element
        this.options = options
        this.frameDuration = 1000 / options.fps
        this._currentFrame = 1
        this.loop = options.loop
        this.yoyo = options.yoyo
        this.currentYoyoDirection = 1
        
        this.reverse = options.reverse

        this.lastTime = Date.now()
        this.currentTime = 0

        // Bind methods to keep right context
        const methods = ["nextFrame", "resizeHandler", "render"]
        methods.forEach((method) => {
            this[method] = this[method].bind(this)
        })

        this.init()
    }

    /**
     * Init
     */
    private init () 
    {
        this.element.style.background = `url(${this.options.spriteSheetUrl})`
        this.resizeHandler()
        this.setFrame(this.reverse ? this.options.totalFrames : this._currentFrame)
        this.addEventListener()
        this.options.autoPlay && this.play()
    }

    /**
     * Got to indicated frame
     * @param newFrame
     */
    public setFrame(newFrame: number) 
    {
        if ((newFrame > this.options.totalFrames || newFrame < 1) && !this.loop) {
            this.stop()
            return
        }
    
        this._currentFrame =
            newFrame > this.options.totalFrames
            ? 1
            : newFrame < 1
            ? this.options.totalFrames
            : newFrame
        const { x, y } = this.getBackgroundPositionsByFrame(this._currentFrame)
        this.element.style.backgroundPosition = `-${x}px -${y}px`
    }

    /**
     * Start playing
     */
    public play (autoReset?: boolean) 
    {
        if (this._isPlaying) return
        autoReset && this.reset()
        this._isPlaying = true
        this.raf = window.requestAnimationFrame(this.render)
    }

    /**
     * Start playing reverse
     */
    public playReverse (autoReset?: boolean) 
    {        
        this.reverse = true
        this.play(autoReset)
    }

    /**
     * Stop playing
     */
    public stop () 
    {
        if (!this._isPlaying) return
        this._isPlaying = false
        window.cancelAnimationFrame(this.raf)
    }

    /**
     * Start playing
     * Shortcut for this.play(true)
     */
    public restart () 
    {
        this.play(true)
    }

    /**
     * Start playing
     */
    public reset () 
    {        
        this._isPlaying = false
        this.setFrame(this.reverse ? this.options.totalFrames : 1)
    }

    /**
     * Got to next frame
     */
    public nextFrame () 
    {
        let newFrame: number

        if (this.yoyo) {
            newFrame = this._currentFrame + this.currentYoyoDirection
    
            if (newFrame > this.options.totalFrames) {
                this.currentYoyoDirection = -1
                if (this.loop || !this.reverse) {
                    newFrame = this.options.totalFrames - 1
                }
            } else if (newFrame < 1) {
                this.currentYoyoDirection = 1
                if (this.loop || this.reverse) {
                    newFrame = 2
                }
            }
        } else {
            newFrame = this.reverse ? this._currentFrame - 1 : this._currentFrame + 1
        }

        this.setFrame(newFrame)
    }

    /**
     * Got to next frame
     */
    public previousFrame () 
    {
        let newFrame: number

        if (this.yoyo) {
            newFrame = this._currentFrame - this.currentYoyoDirection
    
            if (newFrame > this.options.totalFrames) {
                this.currentYoyoDirection = 1
                newFrame = this.options.totalFrames - 1
            } else if (newFrame < 1) {
                this.currentYoyoDirection = -1
                newFrame = 2
            }
        } else {
            newFrame = this.reverse ? this._currentFrame + 1 : this._currentFrame - 1
        }

        this.setFrame(newFrame)
    }

    /**
     * Give the background position associated to given frame
     * @param frame
     * @returns TPosition {x, y}: background position
     */
    private getBackgroundPositionsByFrame (frame: number): TPosition 
    {
        const frameIndex = frame - 1
        const x = (frameIndex % this.options.columns) * this.boundingRect.width
        const y = Math.floor(frameIndex / this.options.columns) * this.boundingRect.height
        return { x, y }
    }
  
    /**
     * Resize handler
     */
    private resizeHandler () 
    {
        this.boundingRect = this.element.getBoundingClientRect()
        this.element.style.height = `${
            this.boundingRect.width * (this.options.frameHeight / this.options.frameWidth)
        }px`
        this.boundingRect = this.element.getBoundingClientRect()
        this.element.style.backgroundSize = `${
            this.options.columns * this.boundingRect.width
        }px ${this.options.lines * this.boundingRect.height}px`
        this.setFrame(this.currentFrame)
    }

    /**
     * Add events listeners
     */
    private addEventListener()
    {
        window.addEventListener("resize", this.resizeHandler)
    }

    /**
     * Remove events listeners
     */
    private removeEventListener()
    {
        window.removeEventListener("resize", this.resizeHandler)
    }

    /**
     * Destroy events and timeout
     */
    public destroy()
    {
        this._isPlaying = false
        this.stop()
        this.removeEventListener()
    }

    private render() 
    {
        this.currentTime = Date.now()
        const delta = this.currentTime - this.lastTime

        if (delta > this.frameDuration) {
            this.lastTime = this.currentTime - (delta % this.frameDuration)
            this.nextFrame()
        }
        if (!this._isPlaying) return
        this.raf = window.requestAnimationFrame(this.render)
    }
}