import { renderToStream } from "@react-pdf/renderer";
import { createElement } from "react";

interface PDFData {
    template: React.ElementType;
    data?: any;
}

const generatePDF = async ({ template: Template, data }: PDFData): Promise<string> => {
    try {
        if (!Template) {
            throw new Error("Template not provided");
        }

        // Crear el componente con los datos
        const MyDocument = createElement(Template, { data });

        // Renderizar a stream
        const stream = await renderToStream(MyDocument);

        const base64String: string = await new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
            stream.on("error", (error) => reject(error));
        });

        return base64String;
    } catch (error) {
        throw new Error("Error generating PDF: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export default generatePDF;
