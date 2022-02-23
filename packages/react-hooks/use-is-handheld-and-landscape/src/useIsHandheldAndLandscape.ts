import { useEffect, useState } from "react"

const isHandheldDevice =
  /(tablet|ipad|playbook|silk)|(android(?!.*mobi))|Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
    navigator.userAgent
  )

/**
 * useIsHandheldAndLandscape
 * Check if the device of user is handheld & in landscape orientation
 * @return boolean
 */
export function useIsHandheldAndLandscape(): boolean {
  const [isHandheldAndLandscape, setIsHandheldAndLandscape] = useState<boolean>(
    isHandheldDevice && window.innerWidth > window.innerHeight
  )

  const handler = () => {
    setIsHandheldAndLandscape(isHandheldDevice && window.innerWidth > window.innerHeight)
  }

  useEffect(() => {
    handler()
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [])

  return isHandheldAndLandscape
}
