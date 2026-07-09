import { useState, useEffect, useCallback, useRef } from "react"
import CompilingIndicator from "@/components/studio/playground/components/CompilingIndicator"
import { renderPdfFile } from "../api/renderFileApi"
import { useStudio } from "../StudioContext"
import decodeBase64Pdf from "./decodeBase64Pdf"

function EmptyState() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#374151",
        background: "#ffffff",
        gap: 8,
        textAlign: "center",
        padding: 24,
      }}
    >
      <p style={{ fontSize: 20, margin: 0 }}>Esperando código...</p>
      <p style={{ margin: 0 }}>Escribe tu código para generar el PDF.</p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 8,
          backgroundColor: "#ffffff",
          border: "1px solid #fecaca",
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#b91c1c" }}>
          ⚠ Error al generar el documento
        </p>
        <p style={{ fontSize: 12, color: "#374151", marginBottom: 12, lineHeight: 1.6 }}>
          Se produjo un problema al procesar tu código.
        </p>
        <div
          style={{
            padding: 12,
            backgroundColor: "#fef2f2",
            borderRadius: 6,
            border: "1px solid #fee2e2",
          }}
        >
          <p style={{ fontSize: 10, color: "#7f1d1d", margin: 0, whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        </div>
        <p style={{ fontSize: 9, color: "#6b7280", marginTop: 14 }}>
          Verifica la sintaxis y revisa la consola para más detalles.
        </p>
      </div>
    </div>
  )
}

/**
 * Visualizador de PDF del Studio (modo servidor, único modo soportado).
 *
 * 1. Llama a GET /api/render/file — el backend genera el PDF con
 *    generatePDF.ts (renderToStream) y lo GUARDA en disco
 *    (.playground/output/render.pdf dentro del workspace).
 * 2. Recibe la cadena base64 del PDF ya guardado.
 * 3. La decodifica con decodeBase64Pdf.ts (adaptado para no descargar
 *    automáticamente en cada render — ver ese archivo) y muestra el
 *    resultado embebido en un <iframe>.
 */
export function StudioPDFPreviewServerFile() {
  const { mainFile, saveVersion, setCompileStatus } = useStudio()

  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRenderedKeyRef = useRef("")
  const isFirstRunRef = useRef(true)
  const requestIdRef = useRef(0)
  // Blob URL previa, para revocarla cuando llega una nueva (o al
  // desmontar) y no ir acumulando objetos en memoria en cada render.
  const currentBlobUrlRef = useRef<string | null>(null)

  const rerender = useCallback(async () => {
    if (!mainFile) {
      setBlobUrl(null)
      setErrorMessage(null)
      setCompileStatus("idle")
      return
    }

    const requestId = ++requestIdRef.current
    setIsCompiling(true)
    setCompileStatus("compiling")

    try {
      const result = await renderPdfFile(mainFile)
      if (requestId !== requestIdRef.current) return // llegó una respuesta más nueva primero

      if (!result.ok || !result.pdfBase64) {
        setErrorMessage(result.error || "Error desconocido al generar el PDF")
        setBlobUrl(null)
        setCompileStatus("error")
        return
      }

      const fileName = result.fileName || "render.pdf"
      const newBlobUrl = decodeBase64Pdf(result.pdfBase64, fileName)

      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
      }
      currentBlobUrlRef.current = newBlobUrl ?? null

      setBlobUrl(newBlobUrl ?? null)
      setErrorMessage(null)
      setCompileStatus("ok")
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      const msg = err instanceof Error ? err.message : "Error desconocido al contactar el servidor"
      setErrorMessage(msg)
      setBlobUrl(null)
      setCompileStatus("error")
    } finally {
      if (requestId === requestIdRef.current) setIsCompiling(false)
    }
  }, [mainFile, setCompileStatus])

  useEffect(() => {
    const key = `${mainFile ?? ""}:${saveVersion}`
    if (key === lastRenderedKeyRef.current) return
    lastRenderedKeyRef.current = key

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      rerender()
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      rerender()
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [mainFile, saveVersion, rerender])

  // Limpieza final al desmontar el panel.
  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
      }
    }
  }, [])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isCompiling && <CompilingIndicator />}

      {errorMessage ? (
        <ErrorState message={errorMessage} />
      ) : blobUrl ? (
        <iframe
          src={blobUrl}
          title="Vista previa del PDF (generado y guardado en el backend)"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
