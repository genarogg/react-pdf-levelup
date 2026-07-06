const printBase64Pdf = (base64Data: string): void => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
        }, 3000);
    };
};

export default printBase64Pdf;