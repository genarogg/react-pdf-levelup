import { generatePDF, decodeBase64Pdf } from "react-pdf-levelup";
import Template from "./Template";

const data = {
    nombre: "Juan Pérez",
    edad: 30,
    ciudad: "Madrid",
};

const generateBase64PDF = async () => {
    try {
        const base64PDF = await generatePDF({ template: Template, data });
        console.log("Base64 PDF:", base64PDF);

        return base64PDF;
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

generateBase64PDF();


const downloadPDF = async () => {
    try {
        const base64PDF = await generateBase64PDF();
 
        if (!base64PDF) {
            throw new Error("No se pudo generar el PDF");
        }

        const pdfBlob = decodeBase64Pdf(base64PDF, "expample.pdf");

 
   
    } catch (error) {
        console.error("Error downloading PDF:", error);
    }
};

downloadPDF();

export { generateBase64PDF, downloadPDF };