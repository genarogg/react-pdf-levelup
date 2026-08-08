import decodePDF from "./decodePDF";
import generatePDF from "./generatePDF";
import getFont from "./getFont";
import {
    __pdfWorkerHandler,
    generatePDFonWorker,
    closePDFPool,
    getPoolStats,
} from "./generate-pdf-with-worker/generatePDFWorker";


import {
    pdf,
    renderToStream,
    renderToBuffer,
    renderToFile,
    usePDF
} from "@react-pdf/renderer"

export {
    decodePDF,
    generatePDF,
    getFont,
    pdf,
    renderToStream,
    renderToBuffer,
    renderToFile,
    usePDF,
    // workers
    __pdfWorkerHandler,
    generatePDFonWorker,
    closePDFPool,
    getPoolStats,
};
