import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT_QUERY = '(max-width: 768px)'

const MOBILE_USER_AGENT_KEYWORDS = [
  'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry',
  'windows phone', 'mobile', 'tablet', 'touch'
]

const isMobileUserAgent = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return MOBILE_USER_AGENT_KEYWORDS.some(keyword => userAgent.includes(keyword))
}

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(
    () => isMobileUserAgent() || window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
  )

  useEffect(() => {
    // El user agent no cambia durante la vida de la página, se calcula
    // una sola vez y queda fijo para todo el efecto.
    const mobileUA = isMobileUserAgent()
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY)

    const updateIsMobile = (matchesSmallScreen: boolean) => {
      setIsMobile(mobileUA || matchesSmallScreen)
    }

    // Por si el tamaño cambió entre el useState inicial y el montaje del efecto
    updateIsMobile(mediaQuery.matches)

    // `matchMedia` solo dispara "change" cuando efectivamente se cruza el
    // umbral de 768px, no en cada pixel que cambia durante un resize —
    // a diferencia del evento "resize", no hace falta throttle/debounce.
    const handleChange = (event: MediaQueryListEvent) => updateIsMobile(event.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}