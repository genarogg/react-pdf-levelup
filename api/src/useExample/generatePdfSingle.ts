import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import log from "../func/log";
import { PDF_COUNT, TEMPLATE_FILE, OUTPUT_DIR_SINGLE, OUTPUT_DIR_WORKER, BENCHMARK_MD_FILE, USE_EXAMPLE_DIR } from "./benchmark.config";
import { ensureDir, buildStats, printStats, saveStatsToFile, compareIfBothExist, appendBenchmarkToMarkdown } from "./benchmark.util";

dotenv.config({ debug: false });

const { ENDPOINT_API } = process.env;

type ApiResponse = {
    data?: {
        pdf?: string
    }
}

const petition = async ({ template, data }: { template: string, data: any }): Promise<string> => {
    const templatePath = path.join(USE_EXAMPLE_DIR, template);
    const tsxCode = fs.readFileSync(templatePath, "utf-8");
    const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

    const res = await fetch(`${ENDPOINT_API}/api/single`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateBase64, data }),
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
    const fileName = `single-${String(index).padStart(4, "0")}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, new Uint8Array(buffer));

    return outputPath;
}

const generateAndSavePDF = async () => {
    console.log("Using API endpoint (single):", `${ENDPOINT_API}/api/single`);
    console.log(`Generando ${PDF_COUNT} PDFs (single)...`);

    ensureDir(OUTPUT_DIR_SINGLE);

    const times: number[] = [];
    let failed = 0;
    let firstError: unknown = null;

    for (let i = 1; i <= PDF_COUNT; i++) {
        const data = {
            nombre: `Genaro Gonzalez ${i}`,
        };

        const start = performance.now();
        try {
            const resultBase64 = await petition({ template: TEMPLATE_FILE, data });
            savePDF(resultBase64, OUTPUT_DIR_SINGLE, i);
            const elapsed = performance.now() - start;
            times.push(elapsed);

            process.stdout.write(`\r[single] ${i}/${PDF_COUNT} generados`);
        } catch (error) {
            failed++;
            if (!firstError) firstError = error;
            console.error(`\nError generando PDF #${i} (single):`, error);
        }
    }

    console.log("\n");

    if (firstError) {
        console.error("Primer error encontrado en esta corrida:", firstError);
    }

    const stats = buildStats("single", times, failed);
    printStats(stats);
    saveStatsToFile(stats, OUTPUT_DIR_SINGLE);

    appendBenchmarkToMarkdown(stats, BENCHMARK_MD_FILE);

    log.success(`PDFs guardados en: ${OUTPUT_DIR_SINGLE}`);

    compareIfBothExist(OUTPUT_DIR_SINGLE, OUTPUT_DIR_WORKER);
};

generateAndSavePDF();