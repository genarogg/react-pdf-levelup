import { useEffect, type RefObject } from "react"

function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return

    const handler = (e: MouseEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside()
      }
    }

    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [active, onOutside, ref])
}

export default useClickOutside
