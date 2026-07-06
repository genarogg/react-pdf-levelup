import Header from "@/components/layout/Header"
import { StudioProvider } from "./StudioContext"
import { FileExplorer } from "./fileExplorer/FileExplorer"
import { EditorPanel } from "./editor/EditorPanel"
import { StudioPDFPreview } from "./preview/StudioPDFPreview"
import { StudioStatusBar } from "./toolbar/StudioStatusBar"

export default function Studio() {
  return (
    <StudioProvider>
      <div className="flex flex-col h-screen bg-black">
        <Header context="studio" />

        <div className="flex flex-1 min-h-0">
          <aside className="w-64 flex-shrink-0">
            <FileExplorer />
          </aside>

          <main className="flex-1 min-w-0">
            <EditorPanel />
          </main>

          <section className="flex-1 min-w-0 border-l border-gray-800">
            <StudioPDFPreview />
          </section>
        </div>

        <StudioStatusBar />
      </div>
    </StudioProvider>
  )
}
