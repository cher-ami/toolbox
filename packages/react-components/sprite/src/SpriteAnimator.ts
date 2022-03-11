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
}

type TPosition = {
    x: number, y: number
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

        this.reverse = options.reverse

        this.lastTime = Date.now()
        this.currentTime = 0

        // Bind methods to keep right context
        const methods = [
            "nextFrame",
            "resizeHandler",
            "render",
        ]
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
        this.element.style.backgroundSize = `${this.options.columns*100}%`
        this.resizeHandler()
        this.setFrame(this._currentFrame)
        this.addEventListener()
        this.options.autoPlay && this.play()
    }

    /**
     * Got to indicated frame
     * @param newFrame 
     */
    public setFrame(newFrame: number) 
    {
        if (
            (newFrame > this.options.totalFrames || newFrame < 1) &&
            !this.loop
        ) {
            this.stop()
            return
        }

        this._currentFrame = newFrame > this.options.totalFrames ? 1 : newFrame < 1 ? this.options.totalFrames : newFrame
        const {x, y} = this.getBackgroundPositionsByFrame(this._currentFrame)
        this.element.style.backgroundPosition = `-${x}px -${y}px`
    }

    /**
     * Start playing
     */
    public play () 
    {
        if (this._isPlaying) return
        this._isPlaying = true
        this.raf = window.requestAnimationFrame(this.render)
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
     */
    public restart () 
    {
        this.reset()
        this.play()
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
        this.setFrame(this._currentFrame + 1)
    }

    /**
     * Got to next frame
     */
    public previousFrame () 
    {        
        this.setFrame(this._currentFrame - 1)
    }

    /**
     * Give the background position associated to given frame
     * @param frame 
     * @returns TPosition {x, y}: background position 
     */
    private getBackgroundPositionsByFrame(frame: number): TPosition
    {        
        const frameIndex = frame-1        
        const x = frameIndex%this.options.columns * (this.boundingRect.width)
        const y = Math.floor(frameIndex/this.options.columns) * (this.boundingRect.height)
        return {x, y}
    }

    /**
     * Resize handler
     */
    private resizeHandler()
    {       
        this.boundingRect = this.element.getBoundingClientRect() 
        this.element.style.height = `${this.boundingRect.width*(this.options.frameHeight/this.options.frameWidth)}px`
        this.boundingRect = this.element.getBoundingClientRect() 
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
        const delta = (this.currentTime - this.lastTime)

        if (delta > this.frameDuration) {
            this.lastTime = this.currentTime - (delta % this.frameDuration);
            if (this.reverse) {
                this.previousFrame()
            } else {
                this.nextFrame()
            }
        }
        if (!this._isPlaying) return
        this.raf = window.requestAnimationFrame(this.render)
    }
}