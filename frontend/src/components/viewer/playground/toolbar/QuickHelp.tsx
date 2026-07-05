import React, { useState, useRef } from "react"
import useClickOutside from "../hooks/useClickOutside"
import { HelpCircle, X, Copy, Check, Languages } from "lucide-react"
import { useClipboard } from "../hooks/useClipboard"
import { buildComponentDocs } from "./quickHelp/buildComponentDocs"
import type { TabId, ComponentDoc, PropDoc } from "./quickHelp/types"

type Lang = "es" | "en"

const TAB_LABELS: Record<Lang, Record<TabId, string>> = {
  es: {
    layout: "Layout",
    text: "Texto",
    table: "Tabla",
    position: "Posición",
    lists: "Listas",
    media: "Media",
    page: "Página",
    fonts: "Fuentes",
  },
  en: {
    layout: "Layout",
    text: "Text",
    table: "Table",
    position: "Position",
    lists: "Lists",
    media: "Media",
    page: "Page",
    fonts: "Fonts",
  },
}

const UI_TEXT: Record<Lang, {
  title: string
  example: string
  copy: string
  copied: string
  prop: string
  type: string
  default: string
  description: string
}> = {
  es: {
    title: "Documentación de Componentes",
    example: "Ejemplo",
    copy: "Copiar",
    copied: "Copiado",
    prop: "Prop",
    type: "Tipo",
    default: "Default",
    description: "Descripción",
  },
  en: {
    title: "Component Documentation",
    example: "Example",
    copy: "Copy",
    copied: "Copied",
    prop: "Prop",
    type: "Type",
    default: "Default",
    description: "Description",
  },
}

interface QuickHelpProps {
  inline?: boolean
}

const QuickHelp: React.FC<QuickHelpProps> = ({ inline = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useClickOutside(panelRef, () => setIsOpen(false), isOpen)
  const { copiedKey, copy } = useClipboard()
  const [activeTab, setActiveTab] = useState<TabId>("layout")
  const [lang, setLang] = useState<Lang>("es")

  const toggleLang = () => {
    setLang((prev) => (prev === "es" ? "en" : "es"))
  }

  const toggleHelp = () => {
    setIsOpen(!isOpen)
  }

  const componentDocs = buildComponentDocs(lang)
  const t = UI_TEXT[lang]
  const activeDocs = componentDocs[activeTab]

  return (
    <div className={inline ? "relative z-10" : "fixed bottom-6 left-1/2 -translate-x-1/2 z-50"}>
      {/* Botón de ayuda */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-3.5 py-2 text-base font-medium text-gray-300 hover:text-white from-gray-800/80 to-gray-900/80 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          onClick={toggleHelp}
        >
          {isOpen ? <X size={16} /> : <HelpCircle size={16} />}
        </button>
      </div>

      {/* Panel de ayuda */}
      {isOpen && (
        <div ref={panelRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[900px] max-h-[650px] overflow-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 via-gray-700/10 to-gray-800/5 rounded-xl pointer-events-none" />

          {/* Botón de idioma, esquina superior derecha del contenedor */}
          <button
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-lg shadow-lg transition-all duration-200"
            onClick={toggleLang}
            title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Languages size={14} />
            <span>{lang === "es" ? "ES" : "EN"}</span>
          </button>

          <div className="relative p-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent mb-4 pr-16">
              {t.title}
            </h3>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-gray-800/50">
              {(["layout", "text", "table", "position", "lists", "media", "page", "fonts"] as TabId[]).map((tab) => (
                <button
                  key={tab}
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_LABELS[lang][tab]}
                </button>
              ))}
            </div>

            {/* Contenido de tabs */}
            <div className="space-y-4">
              {activeDocs.map((component: ComponentDoc, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-lg"
                >
                  <h4 className="text-base font-semibold text-gray-200 mb-1">{component.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{component.description}</p>

                  {/* Tabla de props */}
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">{t.prop}</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">{t.type}</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">{t.default}</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">{t.description}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(component.props as PropDoc[]).map((prop, propIndex: number) => (
                          <tr key={prop.name} className="border-b border-gray-800/30 last:border-0">
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-gray-300 rounded text-[12px]">
                                {prop.name}
                              </code>
                            </td>
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-emerald-400/80 rounded text-[12px]">
                                {prop.type}
                              </code>
                            </td>
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-amber-400/80 rounded text-[12px]">
                                {prop.default || "-"}
                              </code>
                            </td>
                            <td className="py-1.5 px-2 text-gray-400">{prop.description ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Ejemplo de código */}
                  {component.example && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="text-sm font-medium text-gray-400">{t.example}</h5>
                        <button
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 text-gray-200 transition-colors"
                          onClick={() => component.example && copy(component.example, index)}
                        >
                          {copiedKey === index ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedKey === index ? t.copied : t.copy}</span>
                        </button>
                      </div>
                      <pre className="p-3 bg-black/50 border border-gray-800/50 rounded-md overflow-x-auto">
                        <code className="text-[12px] text-gray-300 font-mono leading-relaxed">{component.example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea de gradiente inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
      )}
    </div>
  )
}

export default QuickHelp