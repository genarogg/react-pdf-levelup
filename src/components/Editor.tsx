import React from 'react'
import { Editor as MonacoEditor } from "@monaco-editor/react"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

const Editor = ({ value, onChange }: EditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="javascript"
      value={value}
      theme="vs-dark"
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "on",
        folding: true,
        automaticLayout: true,
        renderLineHighlight: "all",
      }}
    />
  )
}

export default Editor

