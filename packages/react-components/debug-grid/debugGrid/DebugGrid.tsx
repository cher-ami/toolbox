import css from "./DebugGrid.module.less"
import React, { useEffect, useState } from "react"

interface IProps {
  /**
   * Number of column on desktop (resolutions over @breakpoint-laptop declared in breakpoints.less)
   * Type: number
   */
  columnsDesktop: number
  /**
   * Number of column on tablet (resolutions over @breakpoint-tablet declared in breakpoints.less)
   * Type: number
   */
  columnsTablet: number
  /**
   * Number of column on mobile (resolutions under @breakpoint-tablet declared in breakpoints.less)
   * Type: number
   */
  columnsMobile: number
  /**
   * Max resolution : If setted, over this resolution the grid will stop growing proportionnaly and columns width will be setted in px
   * Type: number
   * Default: undefined
   */
  maxSize?: number
  /**
   * The color of the lines
   * Type: string (hex code)
   * Default: "#f323fa" (pink)
   */
  color?: string
  /**
   * The key that will display the grid if it is pressed
   * Type: string
   * Default: g
   */
  triggerKey?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' 
  | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' 
  | 'y' | 'z' | 'Space' | 'Enter'
}

/**
 * @name DebugGrid
 */
function DebugGrid(props: IProps) {
  const [showGrid, setShowGrid] = useState<boolean>(false)

  useEffect(() => {
    const keyHandler = (e) => {            
      if (e.key === (props.triggerKey?.replace('Space', ' ') || "g")) {
        setShowGrid(!showGrid)
      }
    }
    window.addEventListener("keydown", keyHandler)

    return () => {
      window.removeEventListener("keydown", keyHandler)
    }
  }, [showGrid])

  return (
    <div className={css.root}>
      {showGrid &&
        Array.from(Array(props.columnsDesktop + 1)).map((el, i) => {
          return (
            <div
              className={[
                css.line,
                i > props.columnsMobile + 1 && css.lineDesktop,
                i > props.columnsTablet + 1 && css.lineTablet,
              ].filter((e) => e).join(" ")}
              style={{
                ["--mobile-width" as string]: 100 / props.columnsMobile + "vw",
                ["--tablet-width" as string]: 100 / props.columnsTablet + "vw",
                ["--laptop-width" as string]: 100 / props.columnsDesktop + "vw",
                ["--bigLaptop-width" as string]: props.maxSize ? `${props.maxSize / props.columnsDesktop}px` : `${100 / props.columnsDesktop}vw`,
                ["--color" as string]: /^#([0-9A-F]{3}){1,2}$/i.test(props.color || null) ? props.color : "#f323fa",
              }}
              key={i}
            />
          )
        })}
    </div>
  )
}

export default DebugGrid
