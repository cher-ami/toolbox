import css from "./Slider.module.less"
import React, { ReactNode, useEffect, useRef } from "react"
import SmoothSlider from "./SmoothSlider"

interface IProps {
  className?: string
  children: ReactNode
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
