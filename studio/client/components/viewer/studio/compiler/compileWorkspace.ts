import * as CoreComponents from "@react-pdf-levelup/core"
import {
  transpileToJs,
  extractDefaultExportName,
  stripDefaultExport,
  getUsableComponentNames,
} from "@/components/playground/utils/compilePlaygroundCode"
import type { ModuleGraph } from "./moduleGraph"
import type * as React from "react"

export type WorkspaceCompileResult =
  | { ok: true; component: React.ComponentType }
  | { ok: false; error: string }

interface RelativeImportBinding {
  specifier: string
  defaultLocal: string | null
  namedLocals: { imported: string; local: string }[]
}

/**
 * Recorre el código fuente ORIGINAL (antes de transpilar) y separa los
 * imports en dos grupos:
 *  - de paquetes npm: se remueven del texto (los recibe el módulo como
 *    CoreComponents inyectado, igual que hoy en compilePlaygroundCode.ts).
 *  - relativos (a otros archivos del workspace): también se remueven del
 *    texto, pero se devuelven aparte para reescribirlos como declaraciones
 *    locales que apuntan a la variable de módulo ya resuelta.
 */
function extractImports(code: string): {
  codeWithoutImports: string
  relativeImports: RelativeImportBinding[]
} {
  const relativeImports: RelativeImportBinding[] = []

  const codeWithoutImports = code.replace(
    /(^|\n)[ \t]*import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"];?/g,
    (full, lead, clause, specifier) => {
      if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
        return lead
      }

      let defaultLocal: string | null = null
      const namedLocals: { imported: string; local: string }[] = []

      const namedMatch = clause.match(/\{([^}]*)\}/)
      const defaultPart = clause.replace(/\{[^}]*\}/, "").replace(/,/g, "").trim()
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

      relativeImports.push({ specifier, defaultLocal, namedLocals })
      return lead
    }
  )

  return { codeWithoutImports, relativeImports }
}

function resolveRelativeSpecifier(fromPath: string, importPath: string): string {
  const fromDir = fromPath.split("/").slice(0, -1)
  const parts = importPath.split("/")
  for (const part of parts) {
    if (part === ".") continue
    else if (part === "..") fromDir.pop()
    else fromDir.push(part)
  }
  return fromDir.join("/")
}

const CANDIDATE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"]

function findGraphKeyFor(files: Map<string, string>, basePath: string): string | null {
  if (files.has(basePath)) return basePath
  for (const ext of CANDIDATE_EXTENSIONS) {
    if (files.has(basePath + ext)) return basePath + ext
  }
  return null
}

function moduleVarName(index: number): string {
  return `__mod_${index}`
}

/**
 * Orden topológico simple (DFS) sobre el grafo de dependencias relativas.
 * Si hay un ciclo, el archivo involucrado se ejecuta en el orden en que
 * aparece (best-effort) — el error resultante, si el ciclo rompe algo,
 * queda igual como "usado antes de ser definido", tal como documenta la
 * spec (§5.4).
 */
function topologicalOrder(
  files: Map<string, string>,
  dependenciesByPath: Map<string, string[]>
): string[] {
  const order: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(path: string) {
    if (visited.has(path)) return
    if (visiting.has(path)) return
    visiting.add(path)

    for (const dep of dependenciesByPath.get(path) ?? []) {
      visit(dep)
    }

    visiting.delete(path)
    visited.add(path)
    order.push(path)
  }

  for (const path of files.keys()) visit(path)
  return order
}

export function compileWorkspace(
  graph: ModuleGraph,
  reactInstance: typeof React
): WorkspaceCompileResult {
  const entryKey = findGraphKeyFor(graph.files, graph.entry) ?? graph.entry
  const pathList = Array.from(graph.files.keys())
  const varNameByPath = new Map<string, string>()
  pathList.forEach((path, i) => varNameByPath.set(path, moduleVarName(i)))

  const dependenciesByPath = new Map<string, string[]>()
  const moduleBodySourceByPath = new Map<string, string>()

  // 1) Para cada archivo: separar imports (npm vs. relativos), resolver a
  //    qué módulo del grafo apunta cada import relativo, y armar el código
  //    fuente final del módulo (sin imports, con declaraciones locales que
  //    apuntan a las variables de los módulos de los que depende).
  for (const path of pathList) {
    const originalSource = graph.files.get(path)!
    const { codeWithoutImports, relativeImports } = extractImports(originalSource)

    const deps: string[] = []
    const localDeclarations: string[] = []

    for (const imp of relativeImports) {
      const resolvedBase = resolveRelativeSpecifier(path, imp.specifier)
      const depKey = findGraphKeyFor(graph.files, resolvedBase)
      if (!depKey) {
        return {
          ok: false,
          error: `No se pudo resolver el import "${imp.specifier}" en ${path}`,
        }
      }
      deps.push(depKey)
      const depVar = varNameByPath.get(depKey)!

      if (imp.defaultLocal) {
        localDeclarations.push(`const ${imp.defaultLocal} = ${depVar}.default;`)
      }
      for (const { imported, local } of imp.namedLocals) {
        localDeclarations.push(`const ${local} = ${depVar}.exports[${JSON.stringify(imported)}];`)
      }
    }

    dependenciesByPath.set(path, deps)
    moduleBodySourceByPath.set(path, localDeclarations.join("\n") + "\n" + codeWithoutImports)
  }

  // 2) Orden topológico: dependencias antes que quien las usa.
  const order = topologicalOrder(graph.files, dependenciesByPath)

  // 3) Para cada módulo (en orden topológico): extraer su export default
  //    (sobre el código original), transpilar TS/TSX + JSX, y envolverlo en
  //    una función que expone `.default`.
  const moduleDeclarations: string[] = []

  for (const path of order) {
    const varName = varNameByPath.get(path)!
    const originalSource = graph.files.get(path)!
    const bodySource = moduleBodySourceByPath.get(path)!
    const defaultExportInfo = extractDefaultExportName(originalSource)

    const bodyWithDefault = defaultExportInfo
      ? stripDefaultExport(bodySource, defaultExportInfo)
      : bodySource

    const transpiled = transpileToJs(bodyWithDefault)
    if (!transpiled.ok) {
      return { ok: false, error: `Error de sintaxis en ${path}: ${transpiled.error}` }
    }

    moduleDeclarations.push(`
      const ${varName} = (function () {
        ${transpiled.code}
        return {
          default: typeof result !== "undefined" ? result : undefined,
          exports: {}
        };
      })();
    `)
  }

  const entryVar = varNameByPath.get(entryKey)
  if (!entryVar) {
    return { ok: false, error: `No se encontró el módulo de entrada "${graph.entry}" en el grafo.` }
  }

  // 4) Concatenar todos los módulos dentro de un único `new Function`,
  //    exactamente con el mismo mecanismo de `buildAndRunComponent` — pero
  //    con N módulos en vez de 1.
  const componentNames = getUsableComponentNames(CoreComponents)

  const moduleCode = `
    'use strict';

    const React = arguments[0];
    const CoreComponents = arguments[1];
    const { ${componentNames.join(", ")} } = CoreComponents;

    ${moduleDeclarations.join("\n")}

    const result = ${entryVar}.default;

    if (typeof result === "undefined") {
      throw new Error("No se encontró componente válido en el archivo principal.");
    }

    return result;
  `

  let candidate: unknown

  try {
    const evalFn = new Function(moduleCode)
    candidate = evalFn(reactInstance, CoreComponents)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error de ejecución"
    return { ok: false, error: `Error de ejecución: ${msg}` }
  }

  if (!candidate || typeof candidate !== "function") {
    return {
      ok: false,
      error: "El archivo principal no exporta un componente React válido.",
    }
  }

  return { ok: true, component: candidate as React.ComponentType }
}
