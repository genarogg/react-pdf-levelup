import * as Babel from "@babel/standalone"
import type * as React from "react"

/**
 * Paquetes npm que el código del usuario puede importar directamente en el
 * Playground. `new Function` no soporta `import`, así que estos imports no
 * pueden dejarse (ni quitarse sin más, como antes): se reescriben como
 * declaraciones locales que apuntan al módulo real, inyectado como
 * argumento extra al ejecutar el código (ver buildAndRunComponent).
 *
 * Debe mantenerse igual a ALLOWED_NPM_SPECIFIERS en
 * viewer/studio/compiler/compileWorkspace.ts.
 */
export const ALLOWED_NPM_SPECIFIERS = [
  "react",
  "@react-pdf/renderer",
  "@react-pdf-levelup/core",
  "@react-pdf-levelup/qr",
  "@react-pdf-levelup/chart",
] as const

export type NpmModuleRegistry = Record<string, unknown>

interface NpmImportBinding {
  specifier: string
  defaultLocal: string | null
  namespaceLocal: string | null
  namedLocals: { imported: string; local: string }[]
}

function parseImportClause(clause: string): {
  defaultLocal: string | null
  namespaceLocal: string | null
  namedLocals: { imported: string; local: string }[]
} {
  let defaultLocal: string | null = null
  let namespaceLocal: string | null = null
  const namedLocals: { imported: string; local: string }[] = []

  const namespaceMatch = clause.match(/\*\s+as\s+([A-Za-z0-9_$]+)/)
  if (namespaceMatch) namespaceLocal = namespaceMatch[1]

  const namedMatch = clause.match(/\{([^}]*)\}/)
  const defaultPart = clause
    .replace(/\{[^}]*\}/, "")
    .replace(/\*\s+as\s+[A-Za-z0-9_$]+/, "")
    .replace(/,/g, "")
    .trim()
  if (defaultPart) defaultLocal = defaultPart

  if (namedMatch) {
    for (const piece of namedMatch[1].split(",")) {
      const trimmed = piece.trim()
      if (!trimmed) continue
      const asMatch = trimmed.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/)
      if (asMatch) namedLocals.push({ imported: asMatch[1], local: asMatch[2] })
      else namedLocals.push({ imported: trimmed, local: trimmed })
    }
  }

  return { defaultLocal, namespaceLocal, namedLocals }
}

/**
 * Elimina imports y exports "planos" (named exports, `export const/function/...`)
 * del código fuente, dejando intacta la lógica de `export default`, que se
 * maneja aparte en `extractDefaultExportName` + `stripDefaultExport`.
 *
 * Los imports de paquetes npm permitidos (ALLOWED_NPM_SPECIFIERS) no se
 * descartan sin más: se capturan en `npmImports` y se devuelven aparte,
 * para que quien llame pueda anteponer declaraciones locales que los
 * conecten con los módulos reales ya cargados (ver buildAndRunComponent).
 * Cualquier otro paquete importado se reporta en `unresolvedSpecifiers`.
 */
export function stripImportsAndExports(code: string): {
  code: string
  npmImports: NpmImportBinding[]
  unresolvedSpecifiers: string[]
} {
  const npmImports: NpmImportBinding[] = []
  const unresolvedSpecifiers: string[] = []

  const withoutNamedImports = code.replace(
    /(^|\n)[ \t]*import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"];?/g,
    (full, lead, clause, specifier) => {
      if ((ALLOWED_NPM_SPECIFIERS as readonly string[]).includes(specifier)) {
        const { defaultLocal, namespaceLocal, namedLocals } = parseImportClause(clause)
        npmImports.push({ specifier, defaultLocal, namespaceLocal, namedLocals })
        return lead
      }
      unresolvedSpecifiers.push(specifier)
      return lead
    }
  )

  const cleaned = withoutNamedImports
    .replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
    .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
    .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")

  return { code: cleaned, npmImports, unresolvedSpecifiers }
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
  reactInstance: typeof React,
  npmImports: NpmImportBinding[] = [],
  npmModules: NpmModuleRegistry = {}
): BuildResult {
  // Cada import npm permitido se expone como una variable local
  // __npm_argN, inyectada como argumento posicional (después de React) al
  // ejecutar el código, y desde ahí se arman default/namespace/named
  // exports tal como los pidió el código del usuario.
  const npmArgDeclarations: string[] = []
  const localDeclarations: string[] = []

  npmImports.forEach((imp, i) => {
    const npmVar = `__npm_arg${i}`
    npmArgDeclarations.push(`const ${npmVar} = arguments[${i + 1}];`)

    if (imp.namespaceLocal) {
      localDeclarations.push(`const ${imp.namespaceLocal} = ${npmVar};`)
    }
    if (imp.defaultLocal) {
      localDeclarations.push(
        `const ${imp.defaultLocal} = ${npmVar} && ${npmVar}.default !== undefined ? ${npmVar}.default : ${npmVar};`
      )
    }
    for (const { imported, local } of imp.namedLocals) {
      localDeclarations.push(`const ${local} = ${npmVar}[${JSON.stringify(imported)}];`)
    }
  })

  const moduleCode = `
    'use strict';

    const React = arguments[0];
    ${npmArgDeclarations.join("\n")}
    ${localDeclarations.join("\n")}

    ${transpiledCode}

    if (typeof result === "undefined") {
      throw new Error("No se encontró componente válido.");
    }

    return result;
  `

  let candidate: unknown

  try {
    const evalFn = new Function(moduleCode)
    const npmArgs = npmImports.map(({ specifier }) => {
      if (!(specifier in npmModules)) {
        throw new Error(
          `El paquete "${specifier}" está permitido pero no fue provisto al compilador (falta en npmModules).`
        )
      }
      return npmModules[specifier]
    })
    candidate = evalFn(reactInstance, ...npmArgs)
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