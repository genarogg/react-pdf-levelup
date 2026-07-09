// Versión servidor de la construcción del grafo de módulos (plan de
// migración, paso 1 + sección 3.2 del rediseño). Reusa 1:1 la lógica de
// shared/compiler/moduleGraph.ts (regex de imports relativos, resolución
// de rutas, BFS) inyectando una lectura de archivo basada en `fs` real en
// vez de `fetch`, tal como describe la tabla de la sección 3.2:
//
//   Cliente (hoy): fetch('/api/file?path=...')
//   Servidor (nuevo): fs.readFile directo contra WORKSPACE_DIR,
//                      reutilizando resolveSafe() — sin red de por medio.
//
// Reutiliza workspace.model.ts (no fs/promises directo) para no duplicar
// el manejo de imágenes (data URL base64) que ya vive ahí y que usa
// GET /api/file — así el comportamiento del compilador es idéntico sea
// cual sea el archivo (código o imagen), en cliente o en servidor.
import * as workspaceModel from "../models/workspace.model.js"
import {
  buildModuleGraph as buildModuleGraphShared,
  isImagePath,
  type ModuleGraph,
  type WorkspaceFileReader,
} from "../../shared/compiler/moduleGraph.js"

export type { ModuleGraph } from "../../shared/compiler/moduleGraph.js"
export { isImagePath } from "../../shared/compiler/moduleGraph.js"

const readFileFromDisk: WorkspaceFileReader = async (path) => {
  if (!(await workspaceModel.exists(path))) return null

  const mime = workspaceModel.imageMimeType(path)
  const content = mime
    ? await workspaceModel.readFileAsDataUrl(path, mime)
    : await workspaceModel.readFile(path)

  return { content }
}

/**
 * Construye el grafo de módulos a partir de `entryPath`, leyendo del
 * filesystem real (vía resolveSafe, mismo jail que protege el resto del
 * server) en lugar de hacer requests HTTP internos a /api/file.
 */
export async function buildServerModuleGraph(entryPath: string): Promise<ModuleGraph> {
  return buildModuleGraphShared(entryPath, readFileFromDisk)
}
