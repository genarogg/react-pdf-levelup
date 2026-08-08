/**
 * Configuración compartida para los scripts de generación masiva de PDFs
 * (generatePdfSingle.ts y generatePdfWorker.ts).
 *
 * Cambia PDF_COUNT para controlar cuántos PDFs se generan en cada corrida,
 * sin tener que tocar los scripts.
 */

import path from "path";
import { fileURLToPath } from "url";

// Carpeta donde vive este archivo (src/useExample), independiente de
// process.cwd() o desde dónde se ejecute el script.
export const USE_EXAMPLE_DIR = path.dirname(fileURLToPath(import.meta.url));

export const PDF_COUNT = 100;

// Cuántas peticiones se mandan en paralelo por lote (1 = secuencial, como
// antes). El endpoint /single solo puede procesar una a la vez en el hilo
// principal, así que subir esto no acelera "single" — solo tiene sentido
// para medir el paralelismo real del pool de workers en "worker".
export const CONCURRENCY = 10;

// Nombre del template TSX a usar (dentro de src/useExample)
export const TEMPLATE_FILE = "Template.tsx";

// Carpetas de salida, dentro de src/useExample/pdfs
export const OUTPUT_DIR_SINGLE = path.join(USE_EXAMPLE_DIR, "pdfs", "singles");
export const OUTPUT_DIR_WORKER = path.join(USE_EXAMPLE_DIR, "pdfs", "workers");

// Archivo markdown donde se acumula el historial de benchmarks, dentro de src/useExample
export const BENCHMARK_MD_FILE = path.join(USE_EXAMPLE_DIR, "BENCHMARKS.md");