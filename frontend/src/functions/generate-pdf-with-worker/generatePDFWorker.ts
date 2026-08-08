// generatePDFonWorkerWorker.ts
//
// Archivo único y autocontenido para generar PDFs vía un pool de worker
// threads (Piscina). Piscina usa ESTE MISMO archivo compilado como entry
// point de cada worker (filename: __filename), así que corre con dos
// roles distintos según el hilo que lo cargue:
//
//  - Hilo principal (isMainThread === true): arma el pool UNA sola vez
//    y expone la API pública `generatePDFonWorker` / `closePDFPool`.
//  - Cada worker del pool (isMainThread === false): Piscina vuelve a
//    cargar este archivo y usa el export nombrado `__pdfWorkerHandler`
//    (ver `name` en las opciones de Piscina, más abajo) como la función
//    que ejecuta por cada tarea.
//
// El guard `isMainThread` en la creación del pool es lo que evita que
// cada worker, al recargar este mismo archivo, intente crear SU PROPIO
// pool y dispare workers hijos sin fin.
//
// Paridad uno a uno con `generarPDF` (no-worker): mismos `data`/`output`,
// mismo default ("base64"), mismo tipo de retorno (`string | Buffer`).
// Única diferencia: recibe `templatePath` (ruta de archivo) en vez de
// `template` (componente), porque un worker thread no puede recibir una
// función/componente a través del boundary de postMessage.

import { isMainThread } from "node:worker_threads";
import { createElement } from "react";
import Piscina from "piscina";
import { fileURLToPath, pathToFileURL } from "node:url";
/** Mismos valores que el `output` de `generarPDF` en su rama backend. */
type BackendOutput = "base64" | "buffer";

interface PDFWorkerData {
    templatePath: string; // ruta absoluta al módulo que exporta el template (default export)
    data?: any;
    output?: BackendOutput;
}

/**
 * Renderiza un template a PDF y devuelve el Buffer crudo. Corre DENTRO de
 * cada worker: reimporta el módulo del template en ese hilo, lo que
 * también dispara -- una sola vez por worker, gracias al cache de
 * módulos ESM por hilo -- cualquier registro de fuentes a nivel de
 * módulo (como GetFuentes) que ocurra en ese archivo.
 *
 * Nota: siempre devuelve Buffer, nunca decide el `output`. La conversión
 * a base64 ocurre después, en `generatePDFonWorker` (hilo principal), una vez
 * recibido el resultado -- así se transfiere el binario compacto entre
 * threads en vez de un string base64 (~33% más pesado).
 */
async function renderInWorker({ templatePath, data }: PDFWorkerData): Promise<Buffer> {
    if (!templatePath) {
        throw new Error("templatePath not provided");
    }

    let mod: any;
    try {
        // pathToFileURL es necesario para que funcione en Windows: el loader
        // ESM de Node no acepta rutas absolutas tipo "A:\...\archivo.js" en
        // import() -- la letra de unidad seguida de ":" se interpreta como
        // el scheme de la URL. Hay que convertirla siempre a "file://...".
        const templateUrl = pathToFileURL(templatePath).href;
        mod = await import(templateUrl);
    } catch (error) {
        throw new Error(
            `No se pudo importar el template en "${templatePath}": ` +
                (error instanceof Error ? error.message : "Unknown error")
        );
    }

    const Template = mod?.default ?? mod;
    if (!Template || typeof Template !== "function") {
        throw new Error(`No se encontró un export default válido en "${templatePath}"`);
    }

    const { renderToStream } = await import("@react-pdf/renderer");
    const stream = await renderToStream(createElement(Template, { data }) as any);

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(new Uint8Array(chunk as Buffer));
    }

    return Buffer.concat(chunks);
}

/* ─────────────────────────────────────────────────────────
 * HILO PRINCIPAL — pool + API pública
 * ───────────────────────────────────────────────────────── */

import os from "node:os";

const __filename = fileURLToPath(import.meta.url);
const cores = os.availableParallelism();

// Solo se crea si isMainThread es true. Si esto corriera también dentro
// de cada worker (porque Piscina reimporta este mismo archivo), cada
// worker terminaría armando su propio pool recursivamente.
const pool = isMainThread
    ? new Piscina({
          filename: __filename,
          name: "__pdfWorkerHandler",
          maxThreads: Math.max(1, cores - 1), // deja 1 core libre para el hilo principal / Fastify
          minThreads: Math.max(1, Math.floor(cores / 2)), // menos arranques en frío
          idleTimeout: 30_000,
      })
    : undefined;

/**
 * Igual que `generatePDFonWorker` (no-worker) en su rama backend, pero recibe
 * `templatePath` en vez de `template`.
 *
 * Backend (default output: "base64"): "base64" | "buffer"
 *
 * @example
 * const base64 = await generatePDFonWorker({ templatePath: "/abs/path/Invoice.js", data });
 *
 * @example Forzando buffer
 * const buffer = await generatePDFonWorker({ templatePath: "/abs/path/Invoice.js", data, output: "buffer" });
 */
async function generatePDFonWorker({
    templatePath,
    data,
    output = "base64",
}: PDFWorkerData): Promise<string | Buffer> {
    if (!pool) {
        throw new Error("generatePDFonWorker solo puede invocarse desde el hilo principal.");
    }

    // OJO: aunque renderInWorker() devuelve un Buffer real DENTRO del
    // worker, pool.run() lo transfiere a este hilo vía postMessage
    // (structured clone), y ese boundary degrada el Buffer a un
    // Uint8Array plano -- Buffer.isBuffer(raw) da false acá, aunque
    // el tipo declarado diga "Buffer". Uint8Array no tiene el
    // toString(encoding) especial de Buffer: hereda el toString de
    // Array, que ignora cualquier argumento y hace join(','), así que
    // `.toString("base64")` sobre ese Uint8Array NO tira error pero
    // devuelve algo tipo "37,80,68,70,..." en vez de base64 real.
    // Por eso hay que reconstruirlo explícitamente antes de usarlo.
    const raw: Buffer = await pool.run({ templatePath, data });
    const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);

    if (output === "buffer") {
        return buffer;
    }

    // output === "base64" (default)
    return buffer.toString("base64");
}

// Cierre ordenado del pool (esperar a que terminen las tareas en curso).
// Llamar, por ejemplo, en el hook onClose de Fastify al apagar el server.
async function closePDFPool(): Promise<void> {
    await pool?.close();
}

interface PoolStats {
    threads: number;        // workers vivos ahora mismo
    queueSize: number;       // tareas esperando (ningún worker libre)
    completed: number;       // tareas completadas desde que arrancó el pool
    utilization: number;     // 0..1, qué tan ocupado está el pool
    maxThreads: number;      // techo configurado (autodetectado si no se especifica)
    minThreads: number;
}

/**
 * Snapshot del estado del pool en este instante. Útil para loggear en cada
 * request y confirmar cuántos workers realmente se están usando.
 *
 * Vive en este mismo archivo (no en uno separado) porque `pool` es una
 * variable privada del módulo, no está exportada — solo el código que
 * comparte este scope puede leerla.
 */
function getPoolStats(): PoolStats | null {
    if (!pool) return null;

    return {
        threads: pool.threads.length,
        queueSize: pool.queueSize,
        completed: pool.completed,
        utilization: pool.utilization,
        maxThreads: pool.options.maxThreads,
        minThreads: pool.options.minThreads,
    };
}

/* ─────────────────────────────────────────────────────────
 * EXPORTS
 *
 * Todos juntos al final. `__pdfWorkerHandler` es el que Piscina busca por
 * nombre (ver `name` en las opciones del pool, más arriba) cuando carga
 * este mismo archivo dentro de cada worker thread -- ya no hay
 * `export default`, así que Piscina nunca busca `.default`.
 * ───────────────────────────────────────────────────────── */

export {
    renderInWorker as __pdfWorkerHandler,
    generatePDFonWorker,
    closePDFPool,
    getPoolStats,
};

export type { PDFWorkerData, BackendOutput, PoolStats };