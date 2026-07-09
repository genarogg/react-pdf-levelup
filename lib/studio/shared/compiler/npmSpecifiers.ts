// Escanea todos los archivos de un ModuleGraph y devuelve, en orden de
// aparición y sin duplicados, los specifiers de import que NO son
// relativos al workspace (es decir, paquetes npm).
//
// Por qué existe: compileWorkspace() necesita recibir un objeto
// `npmModules` YA POBLADO con los módulos reales antes de compilar (usa
// `Object.keys(npmModules)` como lista de specifiers permitidos). En el
// cliente ese objeto se arma a mano en react-pdf-levelup-config.ts. En el
// servidor (rediseño server-side), en cambio, se arma dinámicamente:
// primero hay que descubrir QUÉ specifiers usa el código del usuario, para
// después intentar `await import(specifier)` sobre cada uno — ver
// server/lib/serverCompileWorkspace.ts. Esta función es el paso 1 de eso.
//
// Usa el mismo criterio que compileWorkspace para reconocer un import
// ("import ... from '...'", specifier sin "." ni "/" al inicio) — se
// mantiene como una regex separada (en vez de compartir la de
// compileWorkspace) porque acá no importa reescribir el código, solo
// enumerar specifiers.
import { isImagePath } from "./moduleGraph.js"

const IMPORT_FROM_RE = /(?:^|\n)[ \t]*import\s+[^'";]+?\s+from\s+['"]([^'"]+)['"];?/g

export function scanNpmSpecifiers(files: Map<string, string>): string[] {
  const seen = new Set<string>()
  const ordered: string[] = []

  for (const [path, content] of files) {
    // Un archivo de imagen es un data URL, no código: no tiene imports.
    if (isImagePath(path)) continue

    let match: RegExpExecArray | null
    IMPORT_FROM_RE.lastIndex = 0
    while ((match = IMPORT_FROM_RE.exec(content))) {
      const specifier = match[1]
      if (specifier.startsWith(".") || specifier.startsWith("/")) continue
      if (seen.has(specifier)) continue
      seen.add(specifier)
      ordered.push(specifier)
    }
  }

  return ordered
}
