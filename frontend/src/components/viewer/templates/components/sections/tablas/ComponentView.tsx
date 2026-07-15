import React from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import { ChevronLeft, ImageIcon, Code2, FileCode } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTemplateComponent } from "../../lib/useTemplateContent"
import MdxRenderer from "../../mdx/MdxRenderer"

interface ComponentViewProps {
  /** Slug de la sección a la que pertenece, ej: "tablas" */
  section: string
  /** Ruta base de la sección para el botón "volver", ej: "/templates/tablas" */
  sectionBasePath: string
  /** Nombre mostrado de la sección, ej: "Tablas" */
  sectionLabel: string
}

const ComponentView: React.FC<ComponentViewProps> = ({ section, sectionBasePath, sectionLabel }) => {
  const { componentSlug } = useParams<{ componentSlug: string }>()
  const meta = useTemplateComponent(section, componentSlug || "")

  if (!componentSlug) {
    return <Navigate to={sectionBasePath} replace />
  }

  if (!meta) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">
          No se encontró el componente <span className="font-mono text-white">{componentSlug}</span> en {sectionLabel}.
        </p>
        <Link to={sectionBasePath} className="inline-flex items-center gap-1 mt-4 text-blue-400 hover:text-blue-300">
          <ChevronLeft className="w-4 h-4" /> Volver a {sectionLabel}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to={sectionBasePath}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Volver a {sectionLabel}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">{meta.title}</h1>

      <Tabs defaultValue="resultado" className="w-full">
        <TabsList
          className="mb-6 w-full max-w-full min-h-[42px] overflow-x-auto overflow-y-hidden flex-nowrap justify-start items-center"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
        >
          <TabsTrigger
            value="resultado"
            className="gap-1.5 shrink-0 py-2 data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            <ImageIcon className="w-4 h-4" /> Resultado
          </TabsTrigger>
          <TabsTrigger
            value="levelup"
            className="gap-1.5 shrink-0 py-2 data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            <Code2 className="w-4 h-4" /> react-pdf-levelup
          </TabsTrigger>
          <TabsTrigger
            value="react-pdf"
            className="gap-1.5 shrink-0 py-2 data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            <FileCode className="w-4 h-4" /> react-pdf/renderer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resultado">
          {meta.imageUrl ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 flex justify-center">
              <img
                src={meta.imageUrl}
                alt={`Resultado de ${meta.title}`}
                className="max-w-full rounded shadow-lg"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              Esta plantilla todavía no tiene imagen de resultado (image.png).
            </p>
          )}
        </TabsContent>

        <TabsContent value="levelup">
          {meta.loadLevelup ? (
            <MdxRenderer loader={meta.loadLevelup} />
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              Todavía no hay un ejemplo con react-pdf-levelup (levelup.mdx) para este componente.
            </p>
          )}
        </TabsContent>

        <TabsContent value="react-pdf">
          {meta.loadReactPdf ? (
            <MdxRenderer loader={meta.loadReactPdf} />
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              Todavía no hay un ejemplo con @react-pdf/renderer (react-pdf.mdx) para este componente.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ComponentView