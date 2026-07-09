// Adaptado del decodeBase64Pdf.ts provisto originalmente por el usuario.
//
// Cambio respecto al original: ya NO dispara una descarga automática del
// archivo ni abre una pestaña nueva del navegador (window.open) — eso
// era correcto para una descarga puntual bajo demanda, pero el panel de
// preview del Studio se auto-renderiza en cada cambio de código
// (debounce ~300ms), y repetir descarga + pestaña nueva en cada tecla
// sería inutilizable.
//
// En su lugar, esta versión arma el mismo Blob y devuelve su blobUrl para
// que el caller (StudioPDFPreviewServerFile.tsx) lo muestre embebido en
// el <iframe> del panel — "la misma pestaña", el propio Studio — en vez
// de una pestaña aparte. La decodificación de base64 -> Blob es idéntica
// a la original.
const decodeBase64Pdf = (base64: string, fileName: string): string | undefined => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  if (document === undefined) {
    console.error("document is undefined, only works in browser context");
    return;
  }

  // Nota: fileName se conserva en la firma (mismo contrato que el
  // original) por si en el futuro se agrega un botón de descarga manual
  // en el panel que sí quiera usarlo; el auto-render no lo usa.
  void fileName;

  return blobUrl;
};

export default decodeBase64Pdf;
