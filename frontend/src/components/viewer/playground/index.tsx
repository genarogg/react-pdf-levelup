import { useState } from "react"
import { useParams } from "react-router-dom"
import PDFPreview from "./PDFPreview"
import CodeEditor from "./CodeEditor"
import ToolBar from "./toolbar/ToolBar"
import { useMobileDetection } from "./hooks/useMobileDetection"
import { MobileWarning } from "./components/MobileWarning"
import Header from '@/components/viewer/layout/Header'
import { usePlaygroundTemplates } from "./hooks/usePlaygroundTemplates"
import { usePlaygroundCode } from "./hooks/usePlaygroundCode"

function Editor() {
  const { templateId } = useParams<{ templateId: string }>()
  const [showMobileWarning, setShowMobileWarning] = useState(true)
  const isMobile = useMobileDetection()

  const { templates, loaded: templatesLoaded } = usePlaygroundTemplates()
  const { code, setCode, isLoading } = usePlaygroundCode(templateId, templates, templatesLoaded)

  // Show mobile warning for mobile devices
  if (isMobile && showMobileWarning) {
    return <MobileWarning onContinue={() => setShowMobileWarning(false)} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
     
      <Header code={code} context="playgroud" />

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
          <ToolBar code={code} />
        </div>
        <div className="w-1/2 bg-gray-100">
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default Editor