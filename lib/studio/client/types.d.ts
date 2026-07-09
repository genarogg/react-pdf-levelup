// Tipado de las variables de entorno expuestas por Vite (prefijo VITE_).
interface ImportMetaEnv {
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "@babel/standalone" {
  export function transform(
    code: string,
    options: {
      presets?: (string | [string, Record<string, unknown>])[]
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
  const content: string
  export default content
}

// Imágenes importadas por los templates del Studio: en runtime se
// resuelven como data URL (ver compileWorkspace.ts + server file.controller),
// así que basta con tipar el default export como string.
declare module "*.jpg" {
  const content: string
  export default content
}
declare module "*.jpeg" {
  const content: string
  export default content
}
declare module "*.png" {
  const content: string
  export default content
}
declare module "*.gif" {
  const content: string
  export default content
}
declare module "*.webp" {
  const content: string
  export default content
}
declare module "*.svg" {
  const content: string
  export default content
}

// Sufijo ?raw de Vite: importa el contenido de cualquier archivo como
// string crudo en vez de resolverlo como módulo. Se usa para poder incluir
// el código fuente de Icon.tsx en el .tsx que se descarga desde el Studio.
declare module "*?raw" {
  const content: string
  export default content
}

// "canvas" solo se importa dinámicamente en rama server-side (Node) dentro
// de un try/catch — nunca corre en el navegador, donde vive el Studio. No
// se instala el paquete real (requiere compilación nativa); esta
// declaración solo satisface el chequeo estático de tipos.
declare module "canvas" {
  export function createCanvas(width: number, height: number): any
  export const Image: any
}

// Los tipos internos de @react-pdf/renderer (basados en su propio React.Component)
// no calzan exactamente con la versión de @types/react instalada en este
// proyecto, lo que hace que TS rechace <Document>, <Page>, <Text> y <View>
// como JSX válido aunque funcionen bien en runtime. Este override reemplaza
// sus tipos por componentes funcionales genéricos, sin tocar cada archivo
// que los usa.
// declare module "@react-pdf/renderer" {
//   import type { FC, PropsWithChildren } from "react"
//   export const Document: FC<PropsWithChildren<any>>
//   export const Page: FC<PropsWithChildren<any>>
//   export const Text: FC<PropsWithChildren<any>>
//   export const View: FC<PropsWithChildren<any>>
  
// }