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
      ImgBg,
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
      <header className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800/50 px-2.5 py-3 shadow-2xl backdrop-blur-sm h-[70px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-gray-700/20 to-gray-800/10 animate-pulse"></div>

        <div className="flex justify-between items-center relative z-10 h-full w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">📄</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent">
              React PDF Editor
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="bg-gray-800/30 backdrop-blur-md rounded-lg p-1">
              <TemplateSelector />
            </div>

            <a
              href="/docs"
              className="group flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25 hover:scale-105 border border-gray-600/50"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline font-medium text-sm">Docs</span>
            </a>

            <button
              className="group flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25 hover:scale-105 border border-gray-500/50"
              onClick={() => downloadTemplate(code)}
            >
              <Download size={16} className="group-hover:animate-bounce" />
              <span className="hidden sm:inline font-medium text-sm">Download</span>
            </button>

            <a
              href="https://www.paypal.com/paypalme/genaroggpaypal"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-500 hover:to-yellow-600 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-600/25 hover:scale-105 border border-yellow-600/50"
            >
              <Coffee size={16} className="group-hover:animate-pulse" />
              <span className="hidden sm:inline font-medium text-sm">Support</span>
            </a>

            <a
              href="https://github.com/genarogg/react-pdf-levelup"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-gray-200 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-700/25 hover:scale-105 border border-gray-700/50"
            >
              <Github size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-medium text-sm">GitHub</span>
            </a>

            <div className="hidden md:flex items-center gap-2 bg-gray-800/30 backdrop-blur-md rounded-lg p-1 border border-gray-700/50">
              <ColorPicker onColorSelect={handleColorSelect} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
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

