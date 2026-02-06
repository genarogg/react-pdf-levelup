import React from 'react';
import examplePdf from '../../useExample/example.pdf';

const PdfViewer = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Visor de PDF</h2>
      <div className="w-full h-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        <iframe
          src={examplePdf}
          className="w-full h-full"
          title="Documento PDF"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
