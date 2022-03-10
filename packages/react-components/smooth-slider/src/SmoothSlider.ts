import lerp from "./helper/lerp"

enum ESliderSettings {
  SPEED = 1.5, // > 1 and slider will move faster than mouse; < 1 and it will move slower
  LERP_SPEED = 0.12,
}

export default class SmoothSlider {
  private _wrapper: HTMLDivElement
  private _itemsContainer: HTMLDivElement

  // Used in _startDragHandler AND _dragHandler
  private _startClientX: number
  private _startClientY: number
  private _startSliderX: number

  // Min and Max Scroll position in px
  private _minScroll: number = 0
  private _maxScroll: number

  private _isDragging: boolean
  public allowSliderScroll: boolean = false
  public preventSliderScroll: boolean = false

  private _progressCallback: (progress: number, time?: number) => void

  // Destination is rough slider position
  // Position is smoothed slider position
  private _xPosition: number = 0
  private _xDestination: number = 0

  // requestAnimationFrame ID
  private _raf: number

  constructor(wrapper: HTMLDivElement, itemsContainer: HTMLDivElement) {
    this._wrapper = wrapper
    this._itemsContainer = itemsContainer

    // Bind methods to keep right context
    const methods = [
      "_render",
      "_startDragHandler",
      "_dragHandler",
      "_endDragHandler",
      "updateScrollLength",
    ]
    methods.forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  public init() {
    this._raf = window.requestAnimationFrame(this._render)
    this._maxScroll = this._getMaxScroll()
    this._addEventsListeners()
  }

  /**
   * Get max scrollable distance in px
   */
  private _getMaxScroll(): number {
    const children = Array.from(this._itemsContainer.children) as HTMLDivElement[]
    if (children?.length < 1) return
    const lastItem = children[children.length - 1]
    // Set margin left to margin right value
    const marginRight: number = children[0]?.offsetLeft
    const sliderViewWidth = window.innerWidth

    return (
      lastItem.offsetLeft +
      lastItem.getBoundingClientRect().width -
      sliderViewWidth +
      marginRight
    )
  }

  /**
   * Handle drag start
   * Save start position that will be used when we move
   * @param event
   */
  private _startDragHandler(event: MouseEvent & TouchEvent): void {
    this._isDragging = true

    this._startClientX = event.touches ? event.touches[0].clientX : event.clientX

    this._startClientY = event.touches ? event.touches[0].clientY : event.clientY

    // Save this value
    this._startSliderX = this._xDestination
  }

  /**
   * Handle drag moves
   * Calculate new slider destination
   * @param e
   */
  private _dragHandler(e): void {
    if (!this._isDragging) return

    let clientX: number = e.touches ? e.touches[0].clientX : e.clientX
    let clientY: number = e.touches ? e.touches[0].clientY : e.clientY
    let dragDiffX: number = clientX - this._startClientX
    let dragDiffY: number = clientY - this._startClientY

    if (
      !this.allowSliderScroll &&
      !this.preventSliderScroll &&
      // si la diff est plus grande que 10px...
      Math.max(Math.abs(dragDiffY), Math.abs(dragDiffX)) > 10
    ) {
      // si on est en deplacement horizontal
      if (Math.abs(dragDiffX) > Math.abs(dragDiffY)) {
        // autorise le slide
        this.allowSliderScroll = true
      } else {
        // si non, on ne permet le slide
        this.preventSliderScroll = true
      }
    }

    let calculatedDest: number = this._startSliderX - dragDiffX * ESliderSettings.SPEED

    if (!this.allowSliderScroll) return

    // Prevent dragging away from limits
    this._xDestination =
      calculatedDest < this._minScroll
        ? this._minScroll
        : calculatedDest > this._maxScroll
        ? this._maxScroll
        : calculatedDest
      
    if (this._raf === null) this._raf = window.requestAnimationFrame(this._render)
  }

  /**
   * Handle drag end
   */
  private _endDragHandler(event: MouseEvent & DragEvent): void {
    this.allowSliderScroll && event.preventDefault()
    this._isDragging = false
    this.allowSliderScroll = false
    this.preventSliderScroll = false
  }

  /**
   * On window resize
   */
  public updateScrollLength(): void {
    this._maxScroll = this._getMaxScroll()

    // Prevent slider to be out of limit when we resize the window
    if (this._xDestination < this._minScroll) {
      this._xDestination = this._minScroll
    } else if (this._xDestination > this._maxScroll) {
      this._xDestination = this._maxScroll
    }

    this._xPosition = this._xDestination
  }

  // prettier-ignore
  private _addEventsListeners() {
        // Start dragging
        this._wrapper.addEventListener("mousedown", this._startDragHandler);
        this._wrapper.addEventListener("touchstart", this._startDragHandler, false );

        // Prevent scroll if we are draging the slider
        this._wrapper.addEventListener("touchmove", (e) => {
            this.allowSliderScroll && e.preventDefault()
        }, false);

        // Prevent default event only on mousedown
        this._wrapper.addEventListener("mousedown", (e) => {
            e.preventDefault();
        });

        // Drag
        window.addEventListener("mousemove", this._dragHandler);
        window.addEventListener("touchmove", this._dragHandler, true);

        // Stop dragging
        window.addEventListener("mouseup", this._endDragHandler);
        window.addEventListener("touchend", this._endDragHandler, true);

        // On resize
        window.addEventListener("resize", this.updateScrollLength);
    }

  private _removeEventsListeners() {
    // Start dragging
    this._wrapper?.removeEventListener("mousedown", this._startDragHandler)
    this._wrapper?.removeEventListener("touchstart", this._startDragHandler, false)

    // Prevent scroll if we are draging the slider
    this._wrapper?.removeEventListener("touchmove", (e) => {
            this.allowSliderScroll && e.preventDefault()
        }, false);

    // Prevent default event only on mousedown
    this._wrapper?.removeEventListener("mousedown", (e) => {
      e.preventDefault()
    })

    // Drag
    window.removeEventListener("mousemove", this._dragHandler)
    window.removeEventListener("touchmove", this._dragHandler, true)

    // Stop dragging
    window.removeEventListener("mouseup", this._endDragHandler)
    window.removeEventListener("touchend", this._endDragHandler, true)

    // On resize
    window.removeEventListener("resize", this.updateScrollLength)
  }

  /**
   * Render
   * Set slider transform translateX
   */
  private _render(time: number) {
    // Use linear interpolation for a smooth result
    this._xPosition = lerp(
      this._xPosition,
      this._xDestination,
      ESliderSettings.LERP_SPEED
    )

    // Execute progress callback if exists
    this._progressCallback &&
      this._progressCallback(
        Math.round((this._xPosition / this._maxScroll) * 100) / 100,
        time
      )

    // Apply transformation
    this._itemsContainer.style.transform = `translateX(-${this._xPosition}px)`

    // Loop
    if (Math.abs(this._xPosition - this._xDestination) < 0.2) {
        this._raf = null
    } else {
        this._raf = window.requestAnimationFrame(this._render)
    }
  }

  public destroy() {
    this._removeEventsListeners()
    window.cancelAnimationFrame(this._raf)
    this._itemsContainer.style.transform = `none`
  }

  public onProgress(callback: (progress: number, time?: number) => void): void {
    this._progressCallback = callback
  }
}
