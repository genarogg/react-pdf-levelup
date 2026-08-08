import decodePDF from "./decodePDF";
import generatePDF from "./generatePDF";
import getFont from "./getFont";
import { generatePDFonWorker } from "./generate-pdf-with-worker/generatePDFWorker";
import __pdfWorkerHandler from "./generate-pdf-with-worker/generatePDFWorker"

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
    generatePDFonWorker,
    __pdfWorkerHandler,
    pdf,
    renderToStream,
    renderToBuffer,
    renderToFile,
    usePDF
};
