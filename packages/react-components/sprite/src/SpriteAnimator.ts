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
}

type TPosition = {
    x: number, y: number
}

export default class SpriteAnimator {
    private element: HTMLDivElement
    private options: TSpriteOptions
    private frameDuration: number
    public currentFrame: number
    public isPlaying: boolean
    private boundingRect: DOMRect
    private raf: number
    public reverse?: boolean

    private lastTime: number
    private currentTime: number

    constructor(element: HTMLDivElement, options: TSpriteOptions) 
    {
        this.element = element
        this.options = options
        this.frameDuration = 1000 / options.fps
        this.currentFrame = 1

        this.reverse = options.reverse

        this.lastTime = Date.now()
        this.currentTime = 0

        // Bind methods to keep right context
        const methods = [
            "nextFrame",
            "resizeHandler",
            "loop",
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
        this.setFrame(this.currentFrame)
        this.addEventListener()
        this.options.autoPlay && this.play()
    }

    /**
     * Got to indicated frame
     * @param newFrame 
     */
    public setFrame(newFrame: number) 
    {
        this.currentFrame = newFrame > this.options.totalFrames ? 1 : newFrame < 1 ? this.options.totalFrames : newFrame
        const {x, y} = this.getBackgroundPositionsByFrame(this.currentFrame)
        this.element.style.backgroundPosition = `-${x}px -${y}px`
    }

    /**
     * Start playing
     */
    public play () 
    {
        if (this.isPlaying) return
        this.isPlaying = true
        this.raf = window.requestAnimationFrame(this.loop)
    }

    /**
     * Stop playing
     */
    public stop () 
    {
        if (!this.isPlaying) return
        this.isPlaying = false
        window.cancelAnimationFrame(this.raf)
    }

    /**
     * Got to next frame
     */
    public nextFrame () 
    {        
        this.setFrame(this.currentFrame + 1)
    }

    /**
     * Got to next frame
     */
    public previousFrame () 
    {        
        this.setFrame(this.currentFrame - 1)
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
        this.stop()
        this.removeEventListener()
    }

    private loop() 
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
        this.raf = window.requestAnimationFrame(this.loop)
    }
}