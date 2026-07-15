import React, { Suspense, useMemo } from "react"
import { MDXProvider } from "@mdx-js/react"
import { mdxComponents } from "./MdxComponents"

/** Props que acepta cualquier componente MDX compilado por @mdx-js/mdx. */
type MDXComponentProps = {
  components?: Record<string, React.ComponentType<any>>
}

interface MdxRendererProps {
  /** Cargador perezoso del módulo .mdx (ver useTemplateContent) */
  loader: () => Promise<{ default: React.ComponentType<MDXComponentProps> }>
}

const MdxRenderer: React.FC<MdxRendererProps> = ({ loader }) => {
  const LazyMdx = useMemo(() => React.lazy(async () => {
    const mod = await loader()
    return { default: mod.default }
  }), [loader])

  return (
    <MDXProvider components={mdxComponents}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin" />
          </div>
        }
      >
        <div className="mdx-content">
          <LazyMdx components={mdxComponents} />
        </div>
      </Suspense>
    </MDXProvider>
  )
}

export default MdxRenderer