import {
  transpileToJs,
  extractDefaultExportName,
  stripDefaultExport,
} from "@/components/studio/playground/utils/compilePlaygroundCode"
import type { ModuleGraph } from "./moduleGraph"
import type * as React from "react"

export type WorkspaceCompileResult =
  | { ok: true; component: React.ComponentType }
  | { ok: false; error: string }

interface RelativeImportBinding {
  specifier: string
  defaultLocal: string | null
  namedLocals: { imported: string; local: string }[]
  namespaceLocal: string | null
}

interface NpmImportBinding {
  specifier: string
  defaultLocal: string | null
  namedLocals: { imported: string; local: string }[]
  namespaceLocal: string | null
}

/**
 * Paquetes npm que el código del usuario puede importar directamente.
 * `new Function` no soporta `import`, así que estos specifiers no se dejan
 * en el texto: se reescriben como referencias a los módulos reales, ya
 * cargados por el bundle de la propia app (mismo objeto que usa el resto
 * del Studio), y se pasan como argumentos extra al ejecutar el código.
 *
 * Si se agrega un nuevo paquete permitido para los usuarios, hay que:
 *  1) importarlo arriba de este archivo,
 *  2) añadirlo a NPM_MODULES,
 *  3) y pasarlo en `compileWorkspace` al llamar a `runModuleCode`.
 */
export const ALLOWED_NPM_SPECIFIERS = [
  "react",
  "@react-pdf/renderer",
  "@react-pdf-levelup/core",
  "@react-pdf-levelup/qr",
  "@react-pdf-levelup/chart",
] as const

/**
 * Recorre el código fuente ORIGINAL (antes de transpilar) y separa los
 * imports en tres grupos, removiéndolos siempre del texto (`new Function`
 * no soporta `import`):
 *  - relativos (a otros archivos del workspace): se devuelven aparte para
 *    reescribirlos como declaraciones locales que apuntan a la variable de
 *    módulo del workspace ya resuelta.
 *  - de paquetes npm permitidos (ALLOWED_NPM_SPECIFIERS): se devuelven
 *    aparte para reescribirlos como declaraciones locales que apuntan al
 *    módulo real, inyectado como argumento al ejecutar el código.
 *  - cualquier otro paquete: se reporta como specifier no resuelto, para
 *    que compileWorkspace devuelva un error explícito en vez de dejar un
 *    `import` suelto que rompería en tiempo de ejecución.
 */
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

function extractImports(code: string): {
  codeWithoutImports: string
  relativeImports: RelativeImportBinding[]
  npmImports: NpmImportBinding[]
  unresolvedSpecifiers: string[]
} {
  const relativeImports: RelativeImportBinding[] = []
  const npmImports: NpmImportBinding[] = []
  const unresolvedSpecifiers: string[] = []

  const codeWithoutImports = code.replace(
    /(^|\n)[ \t]*import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"];?/g,
    (full, lead, clause, specifier) => {
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        const { defaultLocal, namespaceLocal, namedLocals } = parseImportClause(clause)
        relativeImports.push({ specifier, defaultLocal, namespaceLocal, namedLocals })
        return lead
      }

      if ((ALLOWED_NPM_SPECIFIERS as readonly string[]).includes(specifier)) {
        const { defaultLocal, namespaceLocal, namedLocals } = parseImportClause(clause)
        npmImports.push({ specifier, defaultLocal, namespaceLocal, namedLocals })
        return lead
      }

      // Paquete no soportado dentro del Studio: no se puede dejar como
      // `import` (rompería en `new Function`), así que se reporta como
      // error explícito en vez de fallar con un mensaje genérico.
      unresolvedSpecifiers.push(specifier)
      return lead
    }
  )

  return { codeWithoutImports, relativeImports, npmImports, unresolvedSpecifiers }
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

/**
 * Módulos npm reales (los que carga Vite/el bundle de la app, con `import`
 * de verdad) que se ponen a disposición del código del usuario. Las keys
 * deben coincidir con ALLOWED_NPM_SPECIFIERS.
 */
export type NpmModuleRegistry = Record<string, unknown>

function npmModuleVarName(index: number): string {
  return `__npm_${index}`
}

export function compileWorkspace(
  graph: ModuleGraph,
  reactInstance: typeof React,
  npmModules: NpmModuleRegistry = {}
): WorkspaceCompileResult {
  const entryKey = findGraphKeyFor(graph.files, graph.entry) ?? graph.entry
  const pathList = Array.from(graph.files.keys())
  const varNameByPath = new Map<string, string>()
  pathList.forEach((path, i) => varNameByPath.set(path, moduleVarName(i)))

  const dependenciesByPath = new Map<string, string[]>()
  const moduleBodySourceByPath = new Map<string, string>()

  // Módulos npm efectivamente usados en el workspace, en un orden estable,
  // para poder pasarlos como argumentos posicionales a `new Function`.
  const usedNpmSpecifiers: string[] = []
  const npmVarBySpecifier = new Map<string, string>()

  function getOrCreateNpmVar(specifier: string): string {
    let varName = npmVarBySpecifier.get(specifier)
    if (!varName) {
      varName = npmModuleVarName(usedNpmSpecifiers.length)
      npmVarBySpecifier.set(specifier, varName)
      usedNpmSpecifiers.push(specifier)
    }
    return varName
  }

  // 1) Para cada archivo: separar imports (npm permitidos vs. relativos),
  //    resolver a qué módulo del grafo apunta cada import relativo, y armar
  //    el código fuente final del módulo (sin imports, con declaraciones
  //    locales que apuntan a las variables ya resueltas).
  for (const path of pathList) {
    const originalSource = graph.files.get(path)!
    const { codeWithoutImports, relativeImports, npmImports, unresolvedSpecifiers } =
      extractImports(originalSource)

    if (unresolvedSpecifiers.length > 0) {
      return {
        ok: false,
        error: `El paquete "${unresolvedSpecifiers[0]}" (importado en ${path}) no está disponible en el Studio. Paquetes permitidos: ${ALLOWED_NPM_SPECIFIERS.join(", ")}.`,
      }
    }

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

      if (imp.namespaceLocal) {
        localDeclarations.push(`const ${imp.namespaceLocal} = ${depVar}.exports;`)
      }
      if (imp.defaultLocal) {
        localDeclarations.push(`const ${imp.defaultLocal} = ${depVar}.default;`)
      }
      for (const { imported, local } of imp.namedLocals) {
        localDeclarations.push(`const ${local} = ${depVar}.exports[${JSON.stringify(imported)}];`)
      }
    }

    // Imports de paquetes npm permitidos (react, @react-pdf/renderer, ...):
    // se reescriben como referencias al módulo real ya cargado, que se
    // inyecta como argumento extra al ejecutar el código (ver más abajo).
    for (const imp of npmImports) {
      const npmVar = getOrCreateNpmVar(imp.specifier)

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
  //    con N módulos en vez de 1. Los módulos npm usados por el workspace
  //    se pasan como argumentos posicionales adicionales (después de
  //    React), en el mismo orden en que fueron descubiertos.
  const npmArgNames = usedNpmSpecifiers.map((_, i) => npmModuleVarName(i))
  const npmArgDeclarations = npmArgNames
    .map((varName, i) => `const ${varName} = arguments[${i + 1}];`)
    .join("\n")

  const moduleCode = `
    'use strict';

    const React = arguments[0];
    ${npmArgDeclarations}

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
    const npmArgs = usedNpmSpecifiers.map((specifier) => {
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
      error: "El archivo principal no exporta un componente React válido.",
    }
  }

  return { ok: true, component: candidate as React.ComponentType }
}
