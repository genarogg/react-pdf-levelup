import React from 'react'
import { useState, useEffect } from "react"

import PDFPreview from "./components/PDFPreview"
import QuickHelp from "./components/QuickHelp"
import CodeEditor from "./components/CodeEditor"
import { loadTemplateFile } from "./utils/templateLoader"
import { templates } from "./data/templates"
//@ts-ignore
import "./App.css"

import Header from './components/Header'

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



  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      <Header code={code} />

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

