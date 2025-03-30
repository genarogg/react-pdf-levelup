const decodeBase64Pdf = (base64: string, fileName: string) => {
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

  // Crear un enlace para descargar el archivo
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Abrir el PDF en una nueva pestaña
  window.open(blobUrl, '_blank');

  // Revocar el objeto URL después de un tiempo
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
};

export default decodeBase64Pdf;