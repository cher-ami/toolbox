import { StateSignal } from "@zouloux/signal"
import { isHandheldDevice } from "@cher-ami/utils"
import { lerp } from "@cher-ami/utils"

export type TCursorState = "hidden" | "default"

class CustomCursorManager {
  public defaultType: TCursorState = "default"
  public cursorState = StateSignal<TCursorState>(this.defaultType)

  public isInit: boolean
  public relativePosition = { x: 0, y: 0 }
  public position = { x: 0, y: 0 }
  protected raf: number
  protected $element: HTMLElement
  protected speed: number

  /**
   * Start mouse position render
   * @param $element
   * @param speed
   * @returns
   */
  public start($element: HTMLElement, speed = 0.15) {
    if (isHandheldDevice) return

    this.isInit = true
    this.$element = $element
    this.speed = speed
    this.initEvents()

    // Start raf on render transformation
    this.render(this.position)
  }

  public stop() {
    this.isInit = false
    this.removeEvent()
    window.cancelAnimationFrame(this.raf)
  }

  public initEvents(): void {
    document.addEventListener("mousemove", this.handleMouseMove.bind(this))
  }

  public removeEvent(): void {
    document.removeEventListener("mousemove", this.handleMouseMove)
  }

  /**
   * Get and register in local var, relative position
   * @param event
   */
  protected handleMouseMove(event: MouseEvent): void {
    this.relativePosition = this.calcCursorPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  /**
   * Calc mouse coordinates
   * @param mouseCoordinates
   * @returns
   */
  protected calcCursorPosition = (mouseCoordinates: {
    x: number
    y: number
  }): { x: number; y: number } => {
    return {
      x: mouseCoordinates.x - this.$element.offsetLeft - this.$element.clientWidth / 2,
      y: mouseCoordinates.y - this.$element.offsetTop - this.$element.clientHeight / 2,
    }
  }

  /**
   * Anim $element
   * @param position
   */
  protected anim(position): void {
    // Calc lerp values
    this.position.x = lerp(this.position.x, this.relativePosition.x, this.speed)
    this.position.y = lerp(this.position.y, this.relativePosition.y, this.speed)

    // Anim
    this.$element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
  }

  /**
   *
   * @param position
   */
  protected render(position = this.position): void {
    this.anim(position)
    this.raf = window.requestAnimationFrame(() => this.render(position))
  }
}

export default new CustomCursorManager()
