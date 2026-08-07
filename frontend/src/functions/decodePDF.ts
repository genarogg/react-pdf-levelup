/**
 * Formatos de entrada aceptados. Un stream de Node no cruza al frontend
 * (y viceversa un ReadableStream de browser no existe en Node), así que
 * no se soporta acá — hay que resolverlo a uno de estos tres antes de
 * llamar a decodePDF.
 */
type PDFInput = string | Buffer | Blob;

interface DecodePDFParams {
    pdf: PDFInput;
    name: string;
    download?: boolean;
    showBlob?: boolean;
    saveSRC?: string;
}

const isBackend = typeof window === "undefined";

/* ─────────────────────────────────────────────────────────
 * HELPERS DE NORMALIZACIÓN
 * ───────────────────────────────────────────────────────── */

const ensurePdfExtension = (name: string): string =>
    name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;

/** Detecta si el input es un string base64 (vs un string de otra cosa). */
const isBase64String = (value: unknown): value is string =>
    typeof value === "string";

/** Convierte cualquier PDFInput a Buffer (uso exclusivo backend). */
const toBuffer = async (pdfInput: PDFInput): Promise<Buffer> => {
    if (Buffer.isBuffer(pdfInput)) {
        return pdfInput;
    }
    if (isBase64String(pdfInput)) {
        return Buffer.from(pdfInput, "base64");
    }
    // Blob en contexto backend (Node 18+ tiene Blob global) — poco común, pero cubierto.
    const arrayBuffer = await (pdfInput as Blob).arrayBuffer();
    return Buffer.from(arrayBuffer);
};

/** Convierte cualquier PDFInput a Blob (uso exclusivo frontend). */
const toBlob = (pdfInput: PDFInput): Blob => {
    if (pdfInput instanceof Blob) {
        return pdfInput;
    }
    if (isBase64String(pdfInput)) {
        const byteCharacters = atob(pdfInput);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
    }
    // Buffer en contexto frontend (no debería pasar, pero cubierto por robustez).
    return new Blob([new Uint8Array(pdfInput as unknown as ArrayBuffer)], {
        type: "application/pdf",
    });
};

/* ─────────────────────────────────────────────────────────
 * BACKEND (Node) — guarda en disco, showBlob no aplica
 * ───────────────────────────────────────────────────────── */

const decodePDFBackend = async ({
    pdf,
    name,
    showBlob = true,
    saveSRC,
}: DecodePDFParams): Promise<void> => {
    if (!saveSRC) {
        throw new Error(
            "decodePDF en backend requiere 'saveSRC' (ruta de disco donde guardar el PDF)."
        );
    }

    if (showBlob) {
        console.warn(
            "'showBlob' no tiene efecto en backend (no hay pestaña de navegador que abrir) — se ignora."
        );
    }

    const { writeFile } = await import("fs/promises");
    const path = await import("path");

    const buffer = await toBuffer(pdf);
    const fileName = ensurePdfExtension(name);
    const fullPath = path.join(saveSRC, fileName);

    await writeFile(fullPath, new Uint8Array(buffer));
};

/* ─────────────────────────────────────────────────────────
 * FRONTEND (browser) — descarga y/o abre en pestaña nueva
 * ───────────────────────────────────────────────────────── */

const decodePDFFrontend = ({
    pdf,
    name,
    download = true,
    showBlob = true,
    saveSRC,
}: DecodePDFParams): void => {
    const blob = toBlob(pdf);
    const fileName = ensurePdfExtension(name);
    const blobUrl = URL.createObjectURL(blob);

    // saveSRC no aplica en frontend (no hay disco); si viene, download queda
    // deshabilitado (no tiene sentido guardar Y descargar) pero showBlob sigue activo.
    const shouldDownload = saveSRC ? false : download;

    if (shouldDownload) {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (showBlob) {
        window.open(blobUrl, "_blank");
    }

    const cleanupDelay = showBlob ? 30000 : 3000;
    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, cleanupDelay);
};

/* ─────────────────────────────────────────────────────────
 * FUNCIÓN PÚBLICA UNIFICADA
 * ───────────────────────────────────────────────────────── */

/**
 * Recibe un PDF ya generado (en base64, Buffer o Blob — lo que sea que
 * haya devuelto `generarPDF`) y lo procesa según el entorno:
 *
 * - Frontend: puede descargarlo (`download`) y/o abrirlo en una pestaña
 *   nueva (`showBlob`).
 * - Backend: requiere `saveSRC` (ruta de disco) y lo guarda ahí.
 *   `download` no aplica en backend.
 *
 * @param pdf      PDF en base64, Buffer o Blob.
 * @param name     Nombre del archivo (se le agrega ".pdf" si falta).
 * @param download Frontend: si dispara la descarga automática. Default true.
 * @param showBlob Frontend: si abre el PDF en una pestaña nueva. Default true.
 * @param saveSRC  Backend: ruta de disco donde guardar el PDF. Sin esto, lanza error en backend.
 */
const decodePDF = async (params: DecodePDFParams): Promise<void> => {
    if (!params.pdf) {
        throw new Error("decodePDF: 'pdf' is required.");
    }
    if (!params.name) {
        throw new Error("decodePDF: 'name' is required.");
    }

    if (isBackend) {
        return decodePDFBackend(params);
    }
    return decodePDFFrontend(params);
};

export default decodePDF;
export type { DecodePDFParams, PDFInput };