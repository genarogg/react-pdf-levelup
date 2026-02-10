import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Loader2,
  Upload,
  FileText
} from "lucide-react";


import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  url?: string;
  file?: string | File;
  className?: string;
  toolbarClassName?: string;
  viewerClassName?: string;
  pageClassName?: string;
  showUploadButton?: boolean;
}

const PdfViewer = ({ 
  url,
  file, 
  className,
  toolbarClassName,
  viewerClassName,
  pageClassName,
  showUploadButton = true
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<string | File | undefined>(file || url);
  const [fileName, setFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pdfSource = currentFile;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError('');
    setPageNumber(1);
    console.log('✅ PDF cargado correctamente. Total de páginas:', numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('❌ Error cargando PDF:', error);
    setIsLoading(false);
    setError(error.message);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setCurrentFile(file);
        setFileName(file.name);
        setIsLoading(true);
        setError('');
        console.log('📄 Cargando archivo:', file.name);
      } else {
        setError('Por favor selecciona un archivo PDF válido');
      }
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.max(1, Math.min(newPage, numPages));
    });
  }

  function handleZoom(delta: number) {
    setScale(prevScale => Math.max(0.5, Math.min(prevScale + delta, 3.0)));
  }

  function handleRotate() {
    setRotation(prev => (prev + 90) % 360);
  }

  function handleDownload() {
    if (!pdfSource) return;
    
    const link = document.createElement('a');
    if (typeof pdfSource === 'string') {
      link.href = pdfSource;
      link.download = fileName || 'documento.pdf';
    } else if (pdfSource instanceof File) {
      link.href = URL.createObjectURL(pdfSource);
      link.download = pdfSource.name;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (pdfSource instanceof File) {
      URL.revokeObjectURL(link.href);
    }
  }

  if (!pdfSource) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-blue-100 rounded-full">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            No hay PDF cargado
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Carga un archivo PDF para comenzar
          </p>
          {showUploadButton && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={handleUploadClick}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Cargar PDF
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-[85vh] w-full bg-gray-100 rounded-xl overflow-hidden shadow-xl border border-gray-200", className)}>
      {/* Toolbar */}
      <div className={cn("flex flex-wrap items-center justify-between p-3 bg-white border-b shadow-sm gap-2", toolbarClassName)}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón de carga */}
          {showUploadButton && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={handleUploadClick}
                variant="outline"
                size="sm"
                className="gap-1.5"
                title="Cargar otro PDF"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cargar</span>
              </Button>
            </>
          )}

          {/* Nombre del archivo */}
          {fileName && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              <FileText className="h-3 w-3" />
              <span className="max-w-[150px] truncate">{fileName}</span>
            </div>
          )}

          {/* Controles de navegación */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1 || !numPages}
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <span className="hidden sm:inline">Página</span>
              <Input 
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) setPageNumber(page);
                }}
                disabled={!numPages}
                className="w-14 h-8 text-center px-1"
              />
              <span>de {numPages || '--'}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages || !numPages}
              title="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Controles de zoom */}
          <div className="flex items-center bg-gray-50 rounded-md border p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(-0.1)}
              className="h-7 w-7"
              title="Reducir zoom"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(0.1)}
              className="h-7 w-7"
              title="Aumentar zoom"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Rotar */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRotate}
            title="Rotar"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          {/* Descargar */}
          <Button
            variant="default"
            size="icon"
            onClick={handleDownload}
            title="Descargar PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewer */}
      <div className={cn("flex-1 overflow-auto bg-slate-200/50 flex justify-center p-8 relative", viewerClassName)}>
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Cargando documento...</p>
            </div>
          </div>
        )}
        
        <Document
          file={pdfSource}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
          }
          error={
            <div className="text-red-500 font-medium p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
              <p className="font-bold mb-2">❌ Error al cargar el PDF</p>
              <p className="text-sm mb-4">{error || 'Error desconocido'}</p>
              <div className="text-xs bg-white p-3 rounded border border-red-200">
                <p className="font-semibold mb-1">Verifica:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>El archivo no está corrupto</li>
                  <li>Es un PDF válido</li>
                  <li>La consola del navegador (F12)</li>
                </ul>
              </div>
              {showUploadButton && (
                <Button 
                  onClick={handleUploadClick}
                  variant="outline"
                  className="mt-4 gap-2"
                  size="sm"
                >
                  <Upload className="h-4 w-4" />
                  Intentar con otro archivo
                </Button>
              )}
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            rotate={rotation}
            className={cn("bg-white shadow-lg", pageClassName)}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex items-center justify-center h-96 bg-gray-100">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;