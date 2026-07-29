import { createElement } from "react";

/**
 * Tipos de entrada compartidos.
 */
interface PDFTemplateData {
    template: React.ElementType;
    data?: any;
}

/* ─────────────────────────────────────────────────────────
 * OUTPUTS POR ENTORNO
 * ───────────────────────────────────────────────────────── */

type BackendOutput = "base64" | "buffer" | "stream";
type FrontendOutput = "blob" | "url" | "download";

interface BackendParams extends PDFTemplateData {
    output?: BackendOutput;
}

interface FrontendParams extends PDFTemplateData {
    output?: FrontendOutput;
    fileName?: string; 
}

/* ─────────────────────────────────────────────────────────
 * DETECCIÓN DE ENTORNO
 * ───────────────────────────────────────────────────────── */

const isBackend = typeof window === "undefined";

/* ─────────────────────────────────────────────────────────
 * BACKEND (Node) — @react-pdf/renderer -> renderToStream
 * ───────────────────────────────────────────────────────── */

const generarPDFBackend = async ({
    template: Template,
    data,
    output = "base64",
}: BackendParams): Promise<string | Buffer | NodeJS.ReadableStream> => {
    const { renderToStream } = await import("@react-pdf/renderer");

    if (!Template) {
        throw new Error("Template not provided");
    }

    const MyDocument = createElement(Template, { data });
    const stream = await renderToStream(MyDocument);

    if (output === "stream") {
        return stream;
    }

    const buffer: Buffer = await new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", (error) => reject(error));
    });

    if (output === "buffer") {
        return buffer;
    }

    // output === "base64" (default)
    return buffer.toString("base64");
};

/* ─────────────────────────────────────────────────────────
 * FRONTEND (browser) — @react-pdf/renderer -> pdf().toBlob()
 * ───────────────────────────────────────────────────────── */

const generarPDFFrontend = async ({
    template: Template,
    data,
    output = "download",
    fileName = "document.pdf",
}: FrontendParams): Promise<Blob | string | void> => {
    const { pdf } = await import("@react-pdf/renderer");

    if (!Template) {
        throw new Error("Template not provided");
    }

    const MyDocument = createElement(Template, { data });
    const blob = await pdf(MyDocument).toBlob();

    if (output === "blob") {
        return blob;
    }

    if (output === "url") {
        return URL.createObjectURL(blob);
    }

    // output === "download" (default) -> dispara la descarga, no devuelve nada
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/* ─────────────────────────────────────────────────────────
 * FUNCIÓN PÚBLICA UNIFICADA
 * ───────────────────────────────────────────────────────── */

/**
 * Genera un PDF a partir de un template + data, detectando automáticamente
 * si se ejecuta en backend (Node) o frontend (browser) y devolviendo el
 * formato indicado por `output`.
 *
 * Backend  (default output: "base64"): "base64" | "buffer" | "stream"
 * Frontend (default output: "download"): "blob" | "url" | "download"
 *
 * @example Backend
 * const base64 = await generarPDF({ template: MiPlantilla, data });
 *
 * @example Frontend, forzando blob
 * const blob = await generarPDF({ template: MiPlantilla, data, output: "blob" });
 */
async function generarPDF(
    params: BackendParams
): Promise<string | Buffer | NodeJS.ReadableStream>;
async function generarPDF(
    params: FrontendParams
): Promise<Blob | string | void>;
async function generarPDF(params: BackendParams | FrontendParams) {
    if (isBackend) {
        return generarPDFBackend(params as BackendParams);
    }
    return generarPDFFrontend(params as FrontendParams);
}

export default generarPDF;
export type { BackendOutput, FrontendOutput, BackendParams, FrontendParams };