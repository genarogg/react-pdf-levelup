declare module "@babel/standalone" {
  export function transform(
    code: string,
    options: {
      presets?: string[]
      plugins?: string[]
      filename?: string
    },
  ): {
    code: string
    map: any
    ast: any
  }
}

declare module "*.pdf" {
  const content: string;
  export default content;
}

declare module "*.mdx" {
  import type { ComponentType } from "react"
  // @mdx-js/rollup compila cada .mdx a un módulo cuyo export default es un
  // componente de React (el contenido renderizado). MDXContent es el nombre
  // convencional que usa la documentación de MDX para este tipo.
  const MDXContent: ComponentType<Record<string, unknown>>
  export default MDXContent
}

