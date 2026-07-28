import { pdf } from "@react-pdf/renderer";
import { createElement } from "react";

interface PDFData {
    template: React.ElementType;
    data?: any;
}

/**
 * Genera un PDF en el navegador y devuelve un Blob.
 * Útil si luego querés subirlo, mandarlo por fetch, etc.
 */
const generatePDFBlob = async ({ template: Template, data }: PDFData): Promise<Blob> => {
    if (!Template) {
        throw new Error("Template not provided");
    }

    try {
        const MyDocument = createElement(Template, { data });
        const blob = await pdf(MyDocument).toBlob();
        return blob;
    } catch (error) {
        throw new Error("Error generating PDF: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

/**
 * Genera el PDF y dispara la descarga directamente en el navegador.
 */
const downloadPDF = async ({ template, data }: PDFData, fileName = "document.pdf"): Promise<void> => {
    const blob = await generatePDFBlob({ template, data });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Genera el PDF y devuelve una URL de objeto para previsualizarlo,
 * por ejemplo en un <iframe src={url} /> o <embed>.
 */
const generatePDFPreviewUrl = async ({ template, data }: PDFData): Promise<string> => {
    const blob = await generatePDFBlob({ template, data });
    return URL.createObjectURL(blob);
};

export { generatePDFBlob, downloadPDF, generatePDFPreviewUrl };