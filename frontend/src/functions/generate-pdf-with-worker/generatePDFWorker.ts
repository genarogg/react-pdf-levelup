// generatePDF.ts
// Hilo principal: mantiene un pool fijo de workers reutilizables (Piscina)
// en vez de crear un Worker nuevo (con su costo de arranque) en cada llamada.
import Piscina from "piscina";
import { join } from "node:path";
import type { PDFData } from "./pdf-worker";

const pool = new Piscina({
  // Debe apuntar al .js COMPILADO de pdf-worker.ts: Piscina crea un Worker
  // real de Node y carga ese archivo directamente, sin transpilar TS.
  // Tras tu build (tsc/tsup), pdf-worker.js queda junto a este archivo.
  filename: join(__dirname, "pdf-worker.js"),
  // Sin maxThreads/minThreads: Piscina ya autodetecta según
  // os.availableParallelism() (maxThreads = parallelism * 1.5).
  // idleTimeout explícito: por defecto es 0, así que cualquier worker
  // por encima de minThreads se destruye apenas queda libre y la próxima
  // ráfaga vuelve a pagar el arranque en frío (carga de @react-pdf/renderer).
  // Con esto se mantienen "tibios" 30s antes de matarlos.
  idleTimeout: 30_000,
});

export function generatePDF(input: PDFData): Promise<string> {
  return pool.run(input);
}

// Cierre ordenado del pool (esperar a que terminen las tareas en curso).
// Llamar, por ejemplo, en el hook onClose de Fastify al apagar el server.
export async function closePDFPool(): Promise<void> {
  await pool.close();
}

export default generatePDF;
