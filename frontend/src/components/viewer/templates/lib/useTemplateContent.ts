import { useMemo } from "react"
import type React from "react"

/** Props que acepta cualquier componente MDX compilado por @mdx-js/mdx. */
type MDXComponentProps = {
  components?: Record<string, React.ComponentType<any>>
}

/**
 * Autodescubrimiento de contenido de templates.
 *
 * Convención de carpetas (ver skill/consigna del usuario):
 *
 *   content/
 *     <seccion>/                      (ej: "tablas", "certificados", "carnet")
 *       <NombreDelComponente>/        (el nombre de la carpeta = título del componente)
 *         image.(png|jpg|jpeg|webp)   → resultado renderizado (tab 1)
 *         levelup.mdx                 → cómo se construye con react-pdf-levelup (tab 2)
 *         react-pdf.mdx               → cómo se construye con @react-pdf/renderer (tab 3)
 *
 * Todo se resuelve en build-time vía import.meta.glob: agregar una carpeta
 * nueva bajo content/<seccion>/ es suficiente para que aparezca en el sitio,
 * sin tocar ningún index.json ni registrar nada a mano.
 */

// --- Imágenes: eager + ?url, son livianas (solo la URL final, no el binario en el JS bundle) ---
const imageModules = import.meta.glob(
  "../content/*/*/image.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>

// --- MDX: NO eager. Cada .mdx puede traer bloques de código largos; solo se
// compila/descarga cuando el usuario realmente abre ese componente/tab. ---
const levelupModules = import.meta.glob(
  "../content/*/*/levelup.mdx"
) as Record<string, () => Promise<{ default: React.ComponentType<MDXComponentProps> }>>

const reactPdfModules = import.meta.glob(
  "../content/*/*/react-pdf.mdx"
) as Record<string, () => Promise<{ default: React.ComponentType<MDXComponentProps> }>>

// Todas las globs anteriores comparten esta forma de ruta:
//   ../content/<seccion>/<componente>/<archivo>
const PATH_RE = /\.\.\/content\/([^/]+)\/([^/]+)\/[^/]+$/

export interface TemplateComponentMeta {
  /** Slug de la sección, ej: "tablas" */
  section: string
  /** Slug de la carpeta del componente, usado en la URL (kebab-case tal cual está en disco) */
  slug: string
  /** Título mostrado: se deriva del nombre de carpeta, "tabla-con-zebra" -> "Tabla Con Zebra" */
  title: string
  /** URL de la imagen de resultado (tab 1), o null si la carpeta no trae image.* */
  imageUrl: string | null
  /** Cargador perezoso del MDX de react-pdf-levelup (tab 2), o null si no existe */
  loadLevelup: (() => Promise<{ default: React.ComponentType<MDXComponentProps> }>) | null
  /** Cargador perezoso del MDX de @react-pdf/renderer (tab 3), o null si no existe */
  loadReactPdf: (() => Promise<{ default: React.ComponentType<MDXComponentProps> }>) | null
}

function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Construye el índice completo (todas las secciones, todos los componentes) una sola vez. */
function buildIndex(): Map<string, Map<string, TemplateComponentMeta>> {
  // section -> slug -> meta
  const index = new Map<string, Map<string, TemplateComponentMeta>>()

  const ensure = (section: string, slug: string): TemplateComponentMeta => {
    if (!index.has(section)) index.set(section, new Map())
    const bySlug = index.get(section)!
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        section,
        slug,
        title: slugToTitle(slug),
        imageUrl: null,
        loadLevelup: null,
        loadReactPdf: null,
      })
    }
    return bySlug.get(slug)!
  }

  for (const [path, url] of Object.entries(imageModules)) {
    const match = PATH_RE.exec(path)
    if (!match) continue
    const [, section, slug] = match
    ensure(section, slug).imageUrl = url
  }

  for (const [path, loader] of Object.entries(levelupModules)) {
    const match = PATH_RE.exec(path)
    if (!match) continue
    const [, section, slug] = match
    ensure(section, slug).loadLevelup = loader
  }

  for (const [path, loader] of Object.entries(reactPdfModules)) {
    const match = PATH_RE.exec(path)
    if (!match) continue
    const [, section, slug] = match
    ensure(section, slug).loadReactPdf = loader
  }

  return index
}

// Se calcula una sola vez por carga de módulo (no por render): las globs de
// Vite ya están resueltas de forma estática en build-time, así que no hay
// nada async que esperar aquí.
let cachedIndex: Map<string, Map<string, TemplateComponentMeta>> | null = null
function getIndex() {
  if (!cachedIndex) cachedIndex = buildIndex()
  return cachedIndex
}

/** Lista de slugs de sección que realmente tienen contenido (ej: ["tablas"]). */
export function useTemplateSections(): string[] {
  return useMemo(() => Array.from(getIndex().keys()).sort(), [])
}

/** Todos los componentes de una sección, ordenados alfabéticamente por título. */
export function useTemplateComponents(section: string): TemplateComponentMeta[] {
  return useMemo(() => {
    const bySlug = getIndex().get(section)
    if (!bySlug) return []
    return Array.from(bySlug.values()).sort((a, b) => a.title.localeCompare(b.title))
  }, [section])
}

/** Un componente puntual dentro de una sección, por su slug de carpeta. */
export function useTemplateComponent(
  section: string,
  slug: string
): TemplateComponentMeta | null {
  return useMemo(() => {
    return getIndex().get(section)?.get(slug) ?? null
  }, [section, slug])
}