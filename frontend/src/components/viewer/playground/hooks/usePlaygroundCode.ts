import { useState, useEffect } from "react"
import { loadTemplateFile } from "../utils/templateLoader"
import type { TemplateMeta } from "./usePlaygroundTemplates"

const STORAGE_KEY = "react-pdf-levelup-code"

function usePlaygroundCode(templateId: string | undefined, templates: TemplateMeta[], templatesLoaded: boolean) {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCode = async () => {
      if (!templatesLoaded) return
      setIsLoading(true)

      try {
        if (templateId) {
          const selected = templates.find((t) => t.id === templateId)
          if (selected) {
            const templateContent = await loadTemplateFile(selected.path)
            setCode(templateContent)
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
  }, [templateId, templatesLoaded, templates])

  useEffect(() => {
    // Solo persistimos cuando estamos en el playground "libre" (sin :templateId
    // en la URL). Si guardáramos siempre que !isLoading, visitar cualquier
    // plantilla sobrescribiría el último código guardado del usuario apenas
    // termina de cargar (isLoading pasa a false con el contenido de la
    // plantilla ya en el estado `code`), perdiendo su trabajo previo sin que
    // el usuario haya editado nada todavía.
    if (!isLoading && !templateId) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading, templateId])

  return { code, setCode, isLoading }
}

export { usePlaygroundCode }