import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import log from "../func/log";
import { PDF_COUNT, CONCURRENCY, TEMPLATE_FILE, OUTPUT_DIR_WORKER, OUTPUT_DIR_SINGLE, BENCHMARK_MD_FILE, USE_EXAMPLE_DIR } from "./benchmark.config";
import { ensureDir, buildStats, printStats, saveStatsToFile, compareIfBothExist, appendBenchmarkToMarkdown, runWithConcurrency } from "./benchmark.util";

dotenv.config({ debug: false });

const { ENDPOINT_API } = process.env;

type ApiResponse = {
    data?: {
        pdf?: string
    }
}

const petitionWorker = async ({ template, data }: { template: string, data: any }): Promise<string> => {
    const templatePath = path.join(USE_EXAMPLE_DIR, template);
    const tsxCode = fs.readFileSync(templatePath, "utf-8");
    const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

    const res = await fetch(`${ENDPOINT_API}/api/worker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            template: templateBase64,
            data,
            credentials: {
                username: "admin",
                password: "123456",
            }
        }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error (${res.status}): ${txt}`);
    }

    const json = await res.json() as ApiResponse;

    if (!json?.data?.pdf) {
        throw new Error(`Respuesta sin PDF: ${JSON.stringify(json)}`);
    }

    return json.data.pdf;
}

const savePDF = (resultBase64: string, outputDir: string, index: number) => {
    const buffer = Buffer.from(resultBase64, "base64");
    const fileName = `worker-${String(index).padStart(4, "0")}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, new Uint8Array(buffer));

    return outputPath;
}

const generateAndSaveWorkerPDF = async () => {
    console.log("Using API endpoint (worker):", `${ENDPOINT_API}/api/worker`);
    console.log(`Generando ${PDF_COUNT} PDFs (worker) con concurrencia=${CONCURRENCY}...`);

    ensureDir(OUTPUT_DIR_WORKER);

    const times: number[] = [];
    let failed = 0;
    let firstError: unknown = null;
    let done = 0;

    const tasks = Array.from({ length: PDF_COUNT }, (_, idx) => {
        const i = idx + 1;
        return async () => {
            const data = { nombre: `Genaro Gonzalez ${i}` };
            const start = performance.now();
            const resultBase64 = await petitionWorker({ template: TEMPLATE_FILE, data });
            savePDF(resultBase64, OUTPUT_DIR_WORKER, i);
            return performance.now() - start;
        };
    });

    const overallStart = performance.now();

    await runWithConcurrency(tasks, CONCURRENCY, (i, result) => {
        done++;
        if (result.ok) {
            times.push(result.value);
        } else {
            failed++;
            if (!firstError) firstError = result.error;
            console.error(`\nError generando PDF #${i + 1} (worker):`, result.error);
        }
        process.stdout.write(`\r[worker] ${done}/${PDF_COUNT} generados`);
    });

    const overallElapsedMs = performance.now() - overallStart;

    console.log("\n");

    if (firstError) {
        console.error("Primer error encontrado en esta corrida:", firstError);
    }

    // buildStats suma los tiempos individuales (útil para promedio/min/max),
    // pero con concurrencia > 1 el tiempo de PARED real de la corrida es
    // menor a esa suma, así que lo mostramos aparte para no confundir.
    const stats = buildStats("worker", times, failed);
    stats.concurrency = CONCURRENCY;
    stats.wallTimeMs = overallElapsedMs;
    stats.wallPdfsPerSecond = stats.ok / (overallElapsedMs / 1000);

    printStats(stats);
    console.log(`Tiempo de pared (real, con concurrencia=${CONCURRENCY}): ${(overallElapsedMs / 1000).toFixed(2)} s`);
    console.log(`Rendimiento real: ${stats.wallPdfsPerSecond.toFixed(2)} PDFs/segundo`);

    saveStatsToFile(stats, OUTPUT_DIR_WORKER);

    appendBenchmarkToMarkdown(stats, BENCHMARK_MD_FILE);

    log.success(`PDFs guardados en: ${OUTPUT_DIR_WORKER}`);

    compareIfBothExist(OUTPUT_DIR_SINGLE, OUTPUT_DIR_WORKER);
};

generateAndSaveWorkerPDF();