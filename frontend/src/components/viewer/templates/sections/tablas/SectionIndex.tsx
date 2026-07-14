import React from "react"
import { Link } from "react-router-dom"
import { ImageOff } from "lucide-react"
import { useTemplateComponents } from "../../lib/useTemplateContent"

interface SectionIndexProps {
  /** Slug de la sección, ej: "tablas" */
  section: string
  /** Ruta base para armar los links a cada componente, ej: "/templates/tablas" */
  basePath: string
  /** Título mostrado arriba de la grilla */
  title: string
  /** Descripción corta debajo del título */
  description?: string
}

const SectionIndex: React.FC<SectionIndexProps> = ({ section, basePath, title, description }) => {
  const components = useTemplateComponents(section)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>
      {description && <p className="text-gray-400 mb-8 max-w-2xl">{description}</p>}

      {components.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-10 text-center text-gray-400">
          Todavía no hay componentes en esta sección.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {components.map((component) => (
            <Link
              key={component.slug}
              to={`${basePath}/${component.slug}`}
              className="group rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden hover:border-blue-500/50 hover:bg-white/[0.04] transition-all duration-200"
            >
              <div className="aspect-[4/3] bg-black/30 flex items-center justify-center overflow-hidden">
                {component.imageUrl ? (
                  <img
                    src={component.imageUrl}
                    alt={component.title}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <ImageOff className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {component.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SectionIndex
