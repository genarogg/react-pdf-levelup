// Compilación server-side del workspace (plan de migración, paso 1 +
// sección 3.3 del rediseño). Reusa la lógica de compilación compartida
// (shared/compiler/compileWorkspace.ts) SIN modificarla: esa función ya
// aceptaba un `npmModules: Record<string, unknown>` arbitrario y usa
// `Object.keys(npmModules)` como lista de specifiers permitidos.
//
// La diferencia real está en CÓMO se arma ese objeto antes de compilar:
//   - Cliente: los módulos ya vienen precargados a mano desde
//     react-pdf-levelup-config.ts (bundle de Vite, build-time).
//   - Servidor (acá): se escanean todos los specifiers npm usados en el
//     grafo (shared/compiler/npmSpecifiers.ts) y se resuelven en el
//     momento con `await import(specifier)` real contra el node_modules
//     del proceso — sin whitelist que mantener a mano. Ver sección 3.3 del
//     documento de rediseño para el razonamiento completo.
import * as React from "react"
import {
  compileWorkspace as compileWorkspaceShared,
  type NpmModuleRegistry,
  type WorkspaceCompileResult,
} from "../../shared/compiler/compileWorkspace.js"
import { scanNpmSpecifiers } from "../../shared/compiler/npmSpecifiers.js"
import type { ModuleGraph } from "./serverModuleGraph.js"

/**
 * Intenta resolver un specifier de paquete npm contra el node_modules real
 * del proceso. No lanza: cualquier fallo (paquete no instalado, error al
 * evaluarlo, etc.) se devuelve como { ok: false } para que quien llame
 * pueda dar un mensaje de error específico por paquete, en vez de un solo
 * error genérico agregando todos los fallos.
 */
async function resolveNpmImport(
  specifier: string
): Promise<{ ok: true; module: unknown } | { ok: false; error: string }> {
  try {
    const mod = await import(/* @vite-ignore */ specifier)
    return { ok: true, module: mod }
  } catch {
    return {
      ok: false,
      error: `No se pudo resolver el paquete "${specifier}". ¿Está instalado en el proyecto?`,
    }
  }
}

/**
 * Compila el grafo de módulos del workspace en un componente React
 * ejecutable.
 *
 * Resolución de imports npm (paso 6 del plan — sección 5 del documento de
 * rediseño):
 *   - `whitelist` ausente/undefined (default, comportamiento ya validado
 *     en los pasos 1-3): sin whitelist, cualquier paquete instalado en el
 *     node_modules real del proceso se resuelve dinámicamente. Este es el
 *     modelo de amenaza "single-user, proyecto propio" que describe la
 *     sección 5 como default razonable.
 *   - `whitelist` definida (array, incluso vacío []): modo estricto
 *     opcional. Solo specifiers presentes en esa lista se intentan
 *     resolver; cualquier otro corta temprano con 422 antes de llegar a
 *     `import()`. Pensado para cuando el Studio se exponga a más de un
 *     usuario — ver server/lib/loadUserConfig.ts, campo
 *     `serverNpmWhitelist`, que es de donde sale este parámetro en la
 *     práctica (ver render.controller.ts).
 */
export async function compileServerWorkspace(
  graph: ModuleGraph,
  whitelist?: string[]
): Promise<WorkspaceCompileResult> {
  const specifiers = scanNpmSpecifiers(graph.files)
  const allowedSet = whitelist ? new Set(whitelist) : null

  const npmModules: NpmModuleRegistry = {
    // 'react' se resuelve una sola vez acá (ya lo tenemos importado como
    // reactInstance más abajo) en vez de reimportarlo dinámicamente si el
    // usuario también hace `import React from "react"` en su código.
    // Nota: 'react' está permitido implícitamente incluso en modo
    // estricto — es una dependencia del propio compilador, no un import
    // "de usuario" que la whitelist deba filtrar.
    react: React,
  }

  for (const specifier of specifiers) {
    if (specifier in npmModules) continue

    if (allowedSet && !allowedSet.has(specifier)) {
      return {
        ok: false,
        error: `El paquete "${specifier}" no está permitido por la whitelist del servidor (serverNpmWhitelist en react-pdf-levelup-config.ts).`,
      }
    }

    const resolved = await resolveNpmImport(specifier)
    if (!resolved.ok) {
      // Falla rápido con un mensaje específico por paquete, en vez de
      // dejar que compileWorkspace lo reporte más adelante como "no
      // disponible en el Studio" (mensaje pensado para la whitelist del
      // cliente, no para este flujo).
      return { ok: false, error: resolved.error }
    }
    npmModules[specifier] = resolved.module
  }

  return compileWorkspaceShared(graph, React, npmModules)
}
