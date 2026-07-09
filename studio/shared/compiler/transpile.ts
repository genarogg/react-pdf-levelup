// Utilidades de transpilación TS/TSX → JS, extraídas de
// client/components/studio/playground/utils/compilePlaygroundCode.ts para
// que sean utilizables tanto desde el navegador (Studio actual, Playground
// legacy) como desde Node (renderizado en servidor).
//
// No tienen ninguna dependencia de DOM/browser: `@babel/standalone` corre
// igual en Node que en un navegador, es solo una librería JS pura. Por eso
// este archivo vive en shared/ y no bajo client/.
import * as Babel from "@babel/standalone"

export type DefaultExportKind = "function" | "class" | "arrow" | "identifier"

export interface DefaultExportInfo {
  name: string
  kind: DefaultExportKind
}

/**
 * Detecta el nombre y la "forma" del `export default` en el código ORIGINAL
 * (antes de remover imports/exports), distinguiendo:
 *  - function Foo
 *  - class Foo
 *  - const/let/var Foo = ...
 *  - identificador suelto: export default Foo;
 * Devuelve null si no se encuentra ningún export default reconocible.
 */
export function extractDefaultExportName(
  sourceCode: string
): DefaultExportInfo | null {
  const defaultFuncMatch = sourceCode.match(
    /export\s+default\s+function\s+([A-Z]\w*)/
  )
  if (defaultFuncMatch) {
    return { name: defaultFuncMatch[1], kind: "function" }
  }

  const defaultClassMatch = sourceCode.match(
    /export\s+default\s+class\s+([A-Z]\w*)/
  )
  if (defaultClassMatch) {
    return { name: defaultClassMatch[1], kind: "class" }
  }

  const defaultArrowMatch = sourceCode.match(
    /export\s+default\s+(?:const|let|var)?\s*([A-Z]\w*)\s*=/
  )
  if (defaultArrowMatch) {
    return { name: defaultArrowMatch[1], kind: "arrow" }
  }

  const defaultExportMatch = sourceCode.match(
    /export\s+default\s+([A-Z]\w*)/
  )
  if (defaultExportMatch) {
    return { name: defaultExportMatch[1], kind: "identifier" }
  }

  return null
}

/**
 * Reescribe el `export default` según su tipo, dejando una declaración
 * "normal" más una línea `const result = Nombre;` al final, que es el
 * contrato que espera el módulo generado por compileWorkspace.
 */
export function stripDefaultExport(
  modifiedCode: string,
  exportInfo: DefaultExportInfo
): string {
  const { name, kind } = exportInfo

  switch (kind) {
    case "function":
      return (
        modifiedCode.replace(
          /export\s+default\s+function\s+([A-Z]\w*)/,
          "function $1"
        ) + `\nconst result = ${name};`
      )
    case "class":
      return (
        modifiedCode.replace(
          /export\s+default\s+class\s+([A-Z]\w*)/,
          "class $1"
        ) + `\nconst result = ${name};`
      )
    case "arrow":
      return (
        modifiedCode.replace(/export\s+default\s*/, "") +
        `\nconst result = ${name};`
      )
    case "identifier":
      return modifiedCode.replace(
        /export\s+default\s+([A-Z]\w*);?/,
        "const result = $1;"
      )
  }
}

export type TranspileResult =
  | { ok: true; code: string }
  | { ok: false; error: string }

/**
 * Transpila TS/TSX + JSX a JS plano usando Babel standalone.
 * No lanza: cualquier error de sintaxis se devuelve como { ok: false }.
 * Funciona igual en navegador y en Node (Babel standalone no toca el DOM).
 */
export function transpileToJs(modifiedCode: string): TranspileResult {
  try {
    const babelResult = Babel.transform(modifiedCode, {
      presets: [
        ["typescript", { isTSX: true, allExtensions: true }],
        "react",
      ] as any,
      filename: "preview.tsx",
    })
    return { ok: true, code: babelResult.code || "" }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error de sintaxis"
    return { ok: false, error: `Error de sintaxis: ${msg}` }
  }
}
