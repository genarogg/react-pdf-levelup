import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ debug: false });

const data = {
    nombre: "Juan Pérez",
};

const generateAndSavePDF = async ({ template, data }: { template: string, data: any }) => {
    try {
        console.log("Generando PDF vía API...");

        const BACKEND_PORT = Number(process.env.BACKEND_PORT) || 4000;
        const url = `http://localhost:${BACKEND_PORT}/api/pdf`;

        const templatePath = path.join(process.cwd(), "src", "useExample", template);
        const tsxCode = fs.readFileSync(templatePath, "utf-8");
        const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

        const body = JSON.stringify({ template: templateBase64, data });
        console.log("url:");
        console.log("body:", body);
        console.log("url:");

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`API error (${res.status}): ${txt}`);
        }

        const json = await res.json();
        const base64PDF = json?.data?.pdf;

        if (!base64PDF) {
            throw new Error("No se pudo generar el PDF");
        }

        // Convertir base64 a buffer
        const buffer = Buffer.from(base64PDF, "base64");

        // Definir ruta de salida (usando process.cwd() en lugar de __dirname)
        const outputPath = path.join(process.cwd(), "frontend", "src", "useExample", "example.pdf");

        // Guardar archivo
        fs.writeFileSync(outputPath, buffer);
        console.log(`PDF guardado exitosamente en: ${outputPath}`);

    } catch (error) {
        console.error("Error generating/saving PDF:", error);
    }
};

generateAndSavePDF({ template: "template.tsx", data });
