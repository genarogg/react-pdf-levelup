import React from 'react'
import { useState, useEffect } from "react"
import { Github, Download, Coffee } from "lucide-react"

import PDFPreview from "./components/PDFPreview"
import TemplateSelector from "./components/TemplateSelector"
import QuickHelp from "./components/QuickHelp"
import ColorPicker from "./components/ColorPicker"
import CodeEditor from "./components/CodeEditor"
import { loadTemplateFile } from "./utils/templateLoader"
import { templates } from "./data/templates"
//@ts-ignore
import "./App.css"

function App() {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load the default template on component mount
    const loadDefaultTemplate = async () => {
      try {
        setIsLoading(true)
        const defaultTemplate = templates.find((t) => t.id === "default")
        if (defaultTemplate) {
          const templateContent = await loadTemplateFile(defaultTemplate.path)
          setCode(templateContent)
        } else {
          // Fallback to hardcoded template if file loading fails
          setCode(``)
        }
      } catch (error) {
        console.error("Failed to load default template:", error)
        // Fallback to empty code if loading fails
        setCode("")
      } finally {
        setIsLoading(false)
      }
    }

    loadDefaultTemplate()
  }, [])

  const handleColorSelect = (color: string) => {
    console.log("Color seleccionado:", color)
  }

  const downloadTemplate = (templateCode: string) => {
    // Add necessary imports to the template
    const importsSection = `import React from "react";
import { 
      LayoutPDF, 
      Container, 
      Row, 
      Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12,
      P, H1, H2, H3, H4, H5, H6, Strong, Em, U, Small, Blockquote, Mark, Span, BR, A,
      Table, Thead, Tbody, Tr, Th, Td,
      Left, Right, Center,
      Img, QR,
      Header, Footer,
      UL, OL, LI,
      View, Text, StyleSheet, Font,
    } from "react-pdf-levelup";

`

    // Create the full template content with imports
    const fullTemplateContent = importsSection + templateCode

    // Create a blob with the content
    const blob = new Blob([fullTemplateContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element to trigger the download
    const a = document.createElement("a")
    a.href = url
    a.download = "template.tsx"
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-400">React PDF Editor</h1>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
              onClick={() => downloadTemplate(code)}
            >
              <Download size={18} />
              <span className="hidden md:inline">Download Template</span>
            </button>

            <a
              href="https://www.paypal.com/paypalme/genaroggpaypal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
            >
              <Coffee size={18} />
       
            </a>

            <a
              href="https://github.com/genarogg/react-pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
            >
              <Github size={18} />
         
            </a>

            <div className="hidden md:flex items-center gap-3">
              <ColorPicker onColorSelect={handleColorSelect} />
              <TemplateSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="flex md:hidden items-center justify-center gap-3 py-2 bg-gray-800 border-b border-gray-700">
        <ColorPicker onColorSelect={handleColorSelect} />
        <TemplateSelector />
      </div>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full bg-gray-800">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading template...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={setCode as any} />
            </div>
          )}
          <QuickHelp />
        </div>
        <div className="w-1/2 bg-gray-100">
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default App

