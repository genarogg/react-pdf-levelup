import { useEffect, useState } from "react";
import { PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer";
import { Editor } from "@monaco-editor/react";

const ReactPDFLevelUp = () => {
  const [isClient, setIsClient] = useState(false);
  const [code, setCode] = useState("Escribe aquí...");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorChange = (value: any) => {
    setCode(value || "");
  };

  return (
    <div className="container-playground">
      <div className="container-editor fade-in">
        <Editor
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          defaultLanguage="javascript"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>
      <div className="container-render fade-in">
        {isClient ? (
          <PDFViewer style={{ width: "100%", height: "500px" }}>
            <Document>
              <Page size="A4">
                <View>
                  <Text>{code}</Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        ) : (
          <p>Cargando visor de PDF...</p>
        )}
      </div>
    </div>
  );
};

export default ReactPDFLevelUp;
