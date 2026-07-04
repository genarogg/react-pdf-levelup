import path from "path";
import { pathToFileURL } from "url";
import { promises as fs } from "fs";

/**
 * Forma que debe tener el archivo de configuración
 * `react-pdf-levelup.config.ts` o `react-pdf-levelup.config.js`
 * ubicado en la raíz del proyecto del usuario (junto a node_modules).
 */
export interface ReactPdfLevelupConfig {
  /** Ruta al directorio de plantillas del Studio. Puede ser relativa a la raíz del proyecto. */
  templatesDir?: string;
  /** Puerto en el que se levanta el servidor del Studio. */
  port?: number;
}

const CONFIG_BASENAME = "react-pdf-levelup.config";
// Orden de prioridad de extensiones al buscar el archivo de configuración.
const CONFIG_EXTENSIONS = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"];

/**
 * Busca `react-pdf-levelup.config.{js,ts,...}` en el directorio indicado
 * (por defecto, el cwd del proceso) y devuelve la ruta absoluta si existe.
 */
async function findConfigFile(rootDir: string): Promise<string | null> {
  for (const ext of CONFIG_EXTENSIONS) {
    const candidate = path.join(rootDir, `${CONFIG_BASENAME}${ext}`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // No existe con esta extensión, seguimos probando.
    }
  }
  return null;
}

/**
 * Carga la configuración del usuario si existe. Si no existe, devuelve un
 * objeto vacío (y el llamador aplicará sus propios valores por defecto).
 *
 * Soporte:
 *  - .js / .mjs / .cjs: se importan directamente vía `import()` dinámico.
 *  - .ts / .mts / .cts: se intenta importar directamente (funciona si el
 *    usuario corre el CLI con un loader de TS, p. ej. `tsx` o `ts-node`).
 *    Si falla, se avisa por consola y se continúa sin config.
 */
export async function loadConfig(
  rootDir: string = process.cwd()
): Promise<ReactPdfLevelupConfig> {
  const configPath = await findConfigFile(rootDir);

  if (!configPath) {
    return {};
  }

  try {
    const fileUrl = pathToFileURL(configPath).href;
    const mod = await import(fileUrl);
    const config: ReactPdfLevelupConfig = mod.default ?? mod;

    console.log(`⚙️  Configuración cargada desde ${path.relative(rootDir, configPath)}`);
    return config;
  } catch (err) {
    console.error(
      `⚠️  No se pudo cargar ${path.relative(rootDir, configPath)}. Se usarán los valores por defecto.`
    );
    if (configPath.endsWith(".ts") || configPath.endsWith(".mts") || configPath.endsWith(".cts")) {
      console.error(
        `   Para usar un archivo .ts asegúrate de ejecutar el CLI con soporte de TypeScript (por ejemplo, "tsx" o "ts-node").`
      );
    }
    console.error(err);
    return {};
  }
}

/**
 * Resuelve `templatesDir` respetando la siguiente prioridad:
 * 1. Flag explícito de CLI (--dir), si el usuario lo pasó.
 * 2. `templatesDir` definido en react-pdf-levelup.config.*
 * 3. Valor por defecto ("templates" en el cwd).
 */
export function resolveTemplatesDir(
  cliValue: string | undefined,
  cliDefault: string,
  config: ReactPdfLevelupConfig,
  rootDir: string
): string {
  if (cliValue && cliValue !== cliDefault) {
    return path.resolve(cliValue);
  }
  if (config.templatesDir) {
    return path.resolve(rootDir, config.templatesDir);
  }
  return path.resolve(cliDefault);
}

/**
 * Resuelve `port` respetando la siguiente prioridad:
 * 1. Flag explícito de CLI (--port), si el usuario lo pasó.
 * 2. `port` definido en react-pdf-levelup.config.*
 * 3. Valor por defecto.
 */
export function resolvePort(
  cliValue: string | undefined,
  cliDefault: string,
  config: ReactPdfLevelupConfig
): number {
  if (cliValue && cliValue !== cliDefault) {
    return parseInt(cliValue, 10);
  }
  if (config.port) {
    return config.port;
  }
  return parseInt(cliDefault, 10);
}
