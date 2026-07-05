import * as Babel from "@babel/standalone"
import type * as React from "react"

/**
 * Elimina imports y exports "planos" (named exports, `export const/function/...`)
 * del código fuente, dejando intacta la lógica de `export default`, que se
 * maneja aparte en `extractDefaultExportName` + `stripDefaultExport`.
 */

export function stripImportsAndExports(code: string): string {
  return code
    .replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
    .replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
    .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
    .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")
}

export type DefaultExportKind = "function" | "class" | "arrow" | "identifier"

export interface DefaultExportInfo {
  name: string
  kind: DefaultExportKind
}

/**
 * Detecta el nombre y la "forma" del `export default` en el código ORIGINAL
 * (antes de stripImportsAndExports), distinguiendo:
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
 * contrato que espera el módulo generado por buildAndRunComponent.
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

/**
 * Devuelve los nombres de CoreComponents que son "usables" dentro del
 * módulo generado (funciones u objetos, p. ej. forwardRef/memo).
 *
 * IMPORTANTE: también se incluyen los valores `typeof === "string"`.
 * `@react-pdf/renderer` no implementa sus primitivas (`Text`, `View`,
 * `Document`, `Page`, `Image`, `Link`, `Svg`, etc.) como componentes React
 * reales: las exporta como strings literales ("TEXT", "VIEW", "DOCUMENT"...)
 * que su reconciler interpreta como tipos de elemento "host" (igual que
 * "div" lo es para react-dom). Si se excluyen aquí, nunca quedan declaradas
 * como variable local dentro del módulo `eval`'d en `buildAndRunComponent`,
 * y el JSX `<Text>`/`<Document>`/`<Image>` termina resolviendo contra el
 * global del navegador del mismo nombre (window.Text, window.Document,
 * window.Image), que exige `new` y revienta con
 * "Failed to construct 'Text': Please use the 'new' operator".
 */
export function getUsableComponentNames(
  coreComponents: Record<string, unknown>
): string[] {
  return Object.keys(coreComponents).filter(key => {
    const value = coreComponents[key]
    return (
      typeof value === "function" ||
      typeof value === "object" ||
      typeof value === "string"
    )
  })
}

export type BuildResult =
  | { ok: true; component: React.ComponentType }
  | { ok: false; error: string }

/**
 * Construye el string de módulo seguro y lo ejecuta con `new Function`,
 * devolviendo el componente resultante o un error legible.
 * No lanza: todos los fallos (ejecución o forma inválida del resultado)
 * se devuelven como { ok: false }.
 */
export function buildAndRunComponent(
  transpiledCode: string,
  componentNames: string[],
  reactInstance: typeof React,
  coreComponents: Record<string, unknown>
): BuildResult {
  const moduleCode = `
    'use strict';

    const React = arguments[0];
    const CoreComponents = arguments[1];
    const { ${componentNames.join(", ")} } = CoreComponents;

    ${transpiledCode}

    if (typeof result === "undefined") {
      throw new Error("No se encontró componente válido.");
    }

    return result;
  `

  let candidate: unknown

  try {
    const evalFn = new Function(moduleCode)
    candidate = evalFn(reactInstance, coreComponents)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error de ejecución"
    return { ok: false, error: `Error de ejecución: ${msg}` }
  }

  if (!candidate || typeof candidate !== "function") {
    return {
      ok: false,
      error: "El código no devolvió un componente React válido.",
    }
  }

  return { ok: true, component: candidate as React.ComponentType }
}