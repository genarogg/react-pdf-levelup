import { fetchFile } from "../api/studioApi"

export interface ModuleGraph {
  entry: string
  files: Map<string, string> // path normalizado del workspace → contenido crudo
}

// Extrae los specifiers de import que empiezan con "." o "/"
// (imports relativos al workspace). Los de npm (@react-pdf-levelup/core, etc.)
// no matchean este regex y se ignoran acá: quedan intactos en el código y
// los resuelve el propio bundler/runtime, tal como los escribió el usuario.
const RELATIVE_IMPORT_RE = /import\s+[^'"]*?from\s+['"](\.[^'"]+)['"]/g

function resolveRelativePath(fromPath: string, importPath: string): string {
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

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]

export function isImagePath(path: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext))
}

async function fetchFileWithExtensionFallback(path: string) {
  // Si el import ya trae extensión (de código o de imagen), se pide directo.
  // Si no, se prueba cada extensión candidata de código hasta que el
  // backend responda 200. Las imágenes siempre se importan con extensión
  // explícita (`./img.jpg`), así que nunca deberían pasar por el fallback.
  const hasExtension =
    isImagePath(path) || CANDIDATE_EXTENSIONS.some((ext) => path.endsWith(ext))
  const candidates = hasExtension ? [path] : CANDIDATE_EXTENSIONS.map((ext) => path + ext)

  for (const candidate of candidates) {
    const result = await fetchFile(candidate) // GET /api/file?path=...
    if (result) return { content: result.content, resolvedPath: candidate }
  }
  throw new Error(`No se pudo resolver el import "${path}"`)
}

export async function buildModuleGraph(entryPath: string): Promise<ModuleGraph> {
  const files = new Map<string, string>()
  const pending = [entryPath]
  const seen = new Set<string>()

  while (pending.length > 0) {
    const currentPath = pending.pop()!
    if (seen.has(currentPath)) continue
    seen.add(currentPath)

    const { content, resolvedPath } = await fetchFileWithExtensionFallback(currentPath)
    if (files.has(resolvedPath)) continue
    files.set(resolvedPath, content)

    // Un archivo de imagen (data URL base64) no tiene imports que seguir:
    // buscarlos ahí es trabajo innecesario y, en teoría, podría matchear
    // algo espurio en el base64.
    if (isImagePath(resolvedPath)) continue

    let match: RegExpExecArray | null
    RELATIVE_IMPORT_RE.lastIndex = 0
    while ((match = RELATIVE_IMPORT_RE.exec(content))) {
      const importedPath = resolveRelativePath(resolvedPath, match[1])
      if (!seen.has(importedPath)) pending.push(importedPath)
    }
  }

  return { entry: entryPath, files }
}
