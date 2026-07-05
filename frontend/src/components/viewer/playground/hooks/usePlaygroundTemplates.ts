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
    let cancelled = false
    const loadTemplates = async () => {
      try {
        const res = await fetch("/templates/index.json")
        if (!res.ok) throw new Error("Failed to fetch templates")
        const data = await res.json()
        if (!cancelled) setTemplates(data)
      } catch {
        if (!cancelled) setTemplates([])
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    loadTemplates()
    return () => { cancelled = true }
  }, [])

  return { templates, loaded }
}

export { usePlaygroundTemplates }