import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ debug: false });


const { ENDPOINT } = process.env;

const petition = async ({ template, data }: { template: string, data: any }) => {
    //ruta de los templates
    const templatePath = path.join(process.cwd(), "src", "useExample", template);
    //convertir a base64
    const tsxCode = fs.readFileSync(templatePath, "utf-8");
    const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

    const res = await fetch(`${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateBase64, data }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error (${res.status}): ${txt}`);
    }

    const json = await res.json();
    const resultBase64 = json?.data?.pdf;

    return resultBase64;
}

const savePDF = (resultBase64: string) => {
    // Convertir base64 a buffer
    const buffer = Buffer.from(resultBase64, "base64");

    // Definir ruta de salida (usando process.cwd() en lugar de __dirname)
    const outputPath = path.join(process.cwd(), "src", "useExample", "example.pdf");

    // Guardar archivo
    fs.writeFileSync(outputPath, buffer);

    console.log("PDF guardado exitosamente en:", outputPath);
}

const generateAndSavePDF = async () => {
    try {
        const data = {
            nombre: "Juan Pérez",
        };

        const resultBase64 = await petition({ template: "template.tsx", data });
        savePDF(resultBase64);

    } catch (error) {
        console.error("Error generating/saving PDF:", error);
    }
};

generateAndSavePDF();