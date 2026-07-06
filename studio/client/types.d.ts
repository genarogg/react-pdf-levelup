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
