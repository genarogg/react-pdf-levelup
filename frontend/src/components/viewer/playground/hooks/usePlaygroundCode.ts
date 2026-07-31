import { useState, useEffect } from "react"
import { loadTemplateFile } from "../utils/templateLoader"
import type { TemplateMeta } from "./usePlaygroundTemplates"

const STORAGE_KEY = "react-pdf-levelup-code"
const DEMO_TEMPLATE_ID = "__demo__"
const DEMO_CODE_KEY = "playground:demo:code"
const DEMO_TS_KEY = "playground:demo:ts"

export function usePlaygroundCode(templateId: string | undefined, templates: TemplateMeta[], templatesLoaded: boolean) {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const loadCode = async () => {
      if (!templatesLoaded) return
      setIsLoading(true)

      try {
        if (templateId === DEMO_TEMPLATE_ID) {
          const demoCode = localStorage.getItem(DEMO_CODE_KEY)
          if (demoCode) {
            if (!cancelled) setCode(demoCode)
            localStorage.removeItem(DEMO_CODE_KEY)
            localStorage.removeItem(DEMO_TS_KEY)
            return
          }
        }

        if (templateId && templateId !== DEMO_TEMPLATE_ID) {
          const selected = templates.find((t) => t.id === templateId)
          if (selected) {
            const templateContent = await loadTemplateFile(selected.path)
            if (!cancelled) setCode(templateContent)
            return
          } else {
            console.warn(`Template no encontrado: ${templateId}`)
            setCode("")
            return
          }
        }

        const savedCode = localStorage.getItem(STORAGE_KEY)
        if (savedCode) {
          setCode(savedCode)
          return
        }

        const defaultTemplate = templates.find((t) => t.id === "default")
        if (defaultTemplate) {
          const templateContent = await loadTemplateFile(defaultTemplate.path)
          setCode(templateContent)
        } else {
          setCode("")
        }
      } catch (error) {
        console.error("Error al cargar template:", error)
        setCode("")
      } finally {
        setIsLoading(false)
      }
    }

    loadCode()
    return () => { cancelled = true }
  }, [templateId, templatesLoaded, templates])

  useEffect(() => {
    if (!isLoading && !templateId) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading, templateId])

  return { code, setCode, isLoading }
}

