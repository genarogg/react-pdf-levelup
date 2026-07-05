import { useState, useEffect } from "react"

export interface TemplateMeta {
  id: string
  name: string
  path: string
}

function usePlaygroundTemplates() {
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/templates/index.json")
        if (!res.ok) throw new Error("Failed to fetch templates")
        const data = await res.json()
        setTemplates(data)
      } catch {
        setTemplates([])
      } finally {
        setLoaded(true)
      }
    }
    loadTemplates()
  }, [])

  return { templates, loaded }
}

export { usePlaygroundTemplates }