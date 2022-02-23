import css from "./DebugGrid.module.less"
import React, { useEffect, useState } from "react"
import { merge } from "../../helpers/merge"
import debug from "@wbe/debug"

interface IProps {
  className?: string
  columnsDesktop: number
  columnsTablet: number
  columnsMobile: number
}

const componentName = "DebugGrid"
const log = debug(`front:${componentName}`)

/**
 * @name DebugGrid
 */
function DebugGrid(props: IProps) {
  const [showGrid, setShowGrid] = useState<boolean>(false)

  useEffect(() => {
    if (import.meta.env.VITE_SHOW_GRID != "true") return
    const keyHandler = (e) => {
      if (e.key === "g") {
        setShowGrid(!showGrid)
      }
    }
    window.addEventListener("keydown", keyHandler)

    return () => {
      window.removeEventListener("keydown", keyHandler)
    }
  }, [showGrid])

  return (
    <div className={merge([css.root, props.className])}>
      {showGrid &&
        Array.from(Array(props.columnsDesktop + 1)).map((el, i) => {
          return (
            <div
              className={merge([
                css.line,
                i > props.columnsMobile + 1 && css.lineDesktop,
                i > props.columnsTablet + 1 && css.lineTablet,
              ])}
              key={i}
            ></div>
          )
        })}
    </div>
  )
}

export default DebugGrid
