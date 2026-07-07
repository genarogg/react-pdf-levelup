import { useState, useEffect } from "react"

const STORAGE_KEY = "react-pdf-levelup-code"

export function usePlaygroundCode() {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY)
      if (savedCode) setCode(savedCode)
    } catch (error) {
      console.error("Error al cargar código guardado:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading])

  return { code, setCode, isLoading }
}

