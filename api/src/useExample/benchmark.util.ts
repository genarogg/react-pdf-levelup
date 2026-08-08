/**
 * Utilidades de medición de rendimiento para las corridas de generación
 * masiva de PDFs (single vs worker).
 */

import fs from "fs";
import path from "path";

export type RunStats = {
    label: string;
    total: number;
    ok: number;
    failed: number;
    totalTimeMs: number;
    avgTimeMs: number;
    minTimeMs: number;
    maxTimeMs: number;
    pdfsPerSecond: number;
    times: number[];
    // Opcionales: solo presentes cuando la corrida usó concurrencia > 1.
    // wallTimeMs = tiempo real de reloj de toda la corrida (con
    // solapamiento). pdfsPerSecond arriba usa totalTimeMs (suma de tiempos
    // individuales) y NO refleja paralelismo; wallPdfsPerSecond sí.
    concurrency?: number;
    wallTimeMs?: number;
    wallPdfsPerSecond?: number;
};

export const ensureDir = (dirPath: string) => {
    fs.mkdirSync(dirPath, { recursive: true });
};

/**
 * Corre `tasks` (funciones que devuelven una promesa) con como máximo
 * `concurrency` en vuelo al mismo tiempo. A diferencia de un `for` con
 * `await` uno por uno (concurrency=1 efectivo), esto permite mandar varias
 * peticiones en simultáneo — necesario para medir el paralelismo real de
 * un pool de worker threads.
 */
export const runWithConcurrency = async <T>(
    tasks: Array<() => Promise<T>>,
    concurrency: number,
    onSettled?: (index: number, result: { ok: true; value: T } | { ok: false; error: unknown }) => void
): Promise<void> => {
    let nextIndex = 0;

    const worker = async () => {
        while (true) {
            const i = nextIndex++;
            if (i >= tasks.length) return;

            try {
                const value = await tasks[i]();
                onSettled?.(i, { ok: true, value });
            } catch (error) {
                onSettled?.(i, { ok: false, error });
            }
        }
    };

    const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
    await Promise.all(workers);
};

export const buildStats = (label: string, times: number[], failed: number): RunStats => {
    const total = times.length + failed;
    const totalTimeMs = times.reduce((acc, t) => acc + t, 0);
    const ok = times.length;

    return {
        label,
        total,
        ok,
        failed,
        totalTimeMs,
        avgTimeMs: ok > 0 ? totalTimeMs / ok : 0,
        minTimeMs: ok > 0 ? Math.min(...times) : 0,
        maxTimeMs: ok > 0 ? Math.max(...times) : 0,
        pdfsPerSecond: totalTimeMs > 0 ? (ok / totalTimeMs) * 1000 : 0,
        times,
    };
};

export const printStats = (stats: RunStats) => {
    console.log(`\n=== Resultados: ${stats.label} ===`);
    console.log(`PDFs generados: ${stats.ok}/${stats.total} (fallidos: ${stats.failed})`);
    console.log(`Tiempo total:   ${(stats.totalTimeMs / 1000).toFixed(2)} s`);
    console.log(`Tiempo promedio por PDF: ${stats.avgTimeMs.toFixed(2)} ms`);
    console.log(`Tiempo mínimo:  ${stats.minTimeMs.toFixed(2)} ms`);
    console.log(`Tiempo máximo:  ${stats.maxTimeMs.toFixed(2)} ms`);
    console.log(`Rendimiento:    ${stats.pdfsPerSecond.toFixed(2)} PDFs/segundo`);
};

/**
 * Guarda las estadísticas de una corrida en JSON dentro de la carpeta de
 * salida, para poder comparar single vs worker después.
 */
export const saveStatsToFile = (stats: RunStats, outputDir: string) => {
    const filePath = path.join(outputDir, "_stats.json");
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), "utf-8");
    console.log(`Estadísticas guardadas en: ${filePath}`);
};

/**
 * Extrae el número más alto de "## Benchmark N" ya presente en el archivo
 * markdown, para saber qué número le toca a la corrida nueva.
 */
const getNextBenchmarkNumber = (mdPath: string): number => {
    if (!fs.existsSync(mdPath)) return 1;

    const content = fs.readFileSync(mdPath, "utf-8");
    const matches = [...content.matchAll(/^##\s*Benchmark\s+(\d+)/gim)];

    if (matches.length === 0) return 1;

    const max = Math.max(...matches.map((m) => parseInt(m[1], 10)));
    return max + 1;
};

const formatBenchmarkSection = (n: number, stats: RunStats): string => {
    const fecha = new Date().toLocaleString("es-ES");

    const lines: string[] = [];
    lines.push(`## Benchmark ${n}`);
    lines.push("");
    lines.push(`- **Modo:** ${stats.label}`);
    lines.push(`- **Fecha:** ${fecha}`);
    if (stats.concurrency !== undefined) {
        lines.push(`- **Concurrencia:** ${stats.concurrency}`);
    }
    lines.push("");
    lines.push("| Métrica | Valor |");
    lines.push("| --- | --- |");
    lines.push(`| PDFs generados | ${stats.ok}/${stats.total} (fallidos: ${stats.failed}) |`);
    lines.push(`| Tiempo total (suma individual) | ${(stats.totalTimeMs / 1000).toFixed(2)} s |`);
    lines.push(`| Tiempo promedio por PDF | ${stats.avgTimeMs.toFixed(2)} ms |`);
    lines.push(`| Tiempo mínimo | ${stats.minTimeMs.toFixed(2)} ms |`);
    lines.push(`| Tiempo máximo | ${stats.maxTimeMs.toFixed(2)} ms |`);
    lines.push(`| Rendimiento (sin solapar) | ${stats.pdfsPerSecond.toFixed(2)} PDFs/segundo |`);
    if (stats.wallTimeMs !== undefined && stats.wallPdfsPerSecond !== undefined) {
        lines.push(`| Tiempo de pared (real) | ${(stats.wallTimeMs / 1000).toFixed(2)} s |`);
        lines.push(`| **Rendimiento real (con solapamiento)** | **${stats.wallPdfsPerSecond.toFixed(2)} PDFs/segundo** |`);
    }
    lines.push("");

    return lines.join("\n");
};

/**
 * Antepone (más reciente arriba) los resultados de la corrida actual a un
 * archivo markdown compartido entre single y worker, llevando un contador
 * incremental "Benchmark N" independiente del modo usado.
 *
 * Resultado esperado en el archivo (más reciente primero):
 *   ## Benchmark 3
 *   ## Benchmark 2
 *   ## Benchmark 1
 */
export const appendBenchmarkToMarkdown = (stats: RunStats, mdFilePath: string) => {
    const exists = fs.existsSync(mdFilePath);
    const n = getNextBenchmarkNumber(mdFilePath);
    const newSection = formatBenchmarkSection(n, stats);

    const previousBody = exists
        ? fs.readFileSync(mdFilePath, "utf-8").replace(/^#\s*Benchmarks\s*\n+/i, "")
        : "";

    const header = "# Benchmarks\n\n";
    const finalContent = header + newSection + (previousBody ? "\n" + previousBody : "\n");

    fs.writeFileSync(mdFilePath, finalContent, "utf-8");
    console.log(`Benchmark ${n} agregado a: ${mdFilePath}`);
};

/**
 * Si existen los dos archivos _stats.json (singles y workers), imprime una
 * comparación de cuál fue más rápida.
 */
export const compareIfBothExist = (singleDir: string, workerDir: string) => {
    const singlePath = path.join(singleDir, "_stats.json");
    const workerPath = path.join(workerDir, "_stats.json");

    if (!fs.existsSync(singlePath) || !fs.existsSync(workerPath)) {
        return;
    }

    const single: RunStats = JSON.parse(fs.readFileSync(singlePath, "utf-8"));
    const worker: RunStats = JSON.parse(fs.readFileSync(workerPath, "utf-8"));

    console.log(`\n=== Comparación single vs worker ===`);
    console.log(
        `single:  ${single.pdfsPerSecond.toFixed(2)} PDFs/s | promedio ${single.avgTimeMs.toFixed(2)} ms | total ${(single.totalTimeMs / 1000).toFixed(2)} s`
    );
    console.log(
        `worker:  ${worker.pdfsPerSecond.toFixed(2)} PDFs/s | promedio ${worker.avgTimeMs.toFixed(2)} ms | total ${(worker.totalTimeMs / 1000).toFixed(2)} s`
    );

    if (single.pdfsPerSecond === worker.pdfsPerSecond) {
        console.log("Resultado: empate en rendimiento.");
        return;
    }

    const faster = single.pdfsPerSecond > worker.pdfsPerSecond ? "single" : "worker";
    const slower = faster === "single" ? worker : single;
    const fasterStats = faster === "single" ? single : worker;
    const diffPct = ((fasterStats.pdfsPerSecond - slower.pdfsPerSecond) / slower.pdfsPerSecond) * 100;

    console.log(`Resultado: "${faster}" fue más rápida por ${diffPct.toFixed(1)}%.`);
};