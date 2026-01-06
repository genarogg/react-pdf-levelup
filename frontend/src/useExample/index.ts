import { generatePDF } from "react-pdf-levelup";
import Template from "./Template";
import fs from "fs";
import path from "path";

const data = {
    nombre: "Juan Pérez",
    edad: 30,
    ciudad: "Madrid",
};

const generateAndSavePDF = async () => {
    try {
        console.log("Generando PDF...");
        const base64PDF = await generatePDF({ template: Template, data });

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

generateAndSavePDF();

export { generateAndSavePDF };
