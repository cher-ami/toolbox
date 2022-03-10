import css from "./Slider.module.less"
import React, { ReactNode, useEffect, useRef } from "react"
import SmoothSlider from "./SmoothSlider"

interface IProps {
  /**
   * Optional className of the slider
   * Type: string
   */
  className?: string
  /**
   * Children of the sliders
   * Type: ReactNode
   */
  children: ReactNode
  /**
   * Callback that will be exectuted when the slider moves
   * Type: (progess: number, time?: number) => void
   * Params:
   *   progress: number -> Slider scroll position in percentage
   *   time: number (DOMHighResTimeStamp) -> the requestAnimationFrame DOMHighResTimeStamp, 
   *         similar to the one returned by performance.now(), indicating the point in time 
   *         when requestAnimationFrame() starts to execute callback functions.
   */
  onProgress?: (progess: number, time?: number) => void
}

/**
 * @name Slider
 */
function Slider(props: IProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const slider = useRef<SmoothSlider>(null)

  useEffect(() => {
    slider.current = new SmoothSlider(wrapperRef.current, itemsContainerRef.current)
    slider.current.init()
    props.onProgress && slider.current.onProgress(props.onProgress)

    return () => {
      slider.current.destroy()
    }
  }, [])

  return (
    <div className={[css.root, props.className].filter((e) => e).join(" ")}>
      <div className={css.wrapper} ref={wrapperRef}>
        <div className={css.itemsContainer} ref={itemsContainerRef}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Slider
