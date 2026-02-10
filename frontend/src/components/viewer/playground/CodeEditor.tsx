import { useRef, useEffect } from "react"
import { Editor } from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null)

  // Add a debounce function to delay updates
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleEditorChange = debounce((value: string | undefined) => {
    if (value === undefined) return
    const sanitizeAll = (text: string) => {
      let s = text
      s = s.replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
      s = s.replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
      s = s.replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")
      s = s.replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
      s = s.replace(/export\s+default\s+function\s+([A-Z]\w*)\s*\(/g, "function $1(")
      s = s.replace(/export\s+default\s+class\s+([A-Z]\w*)/g, "class $1")
      s = s.replace(/(^|\n)\s*export\s+default\s+/g, "\n")
      return s
    }
    const sanitized = sanitizeAll(value)
    if (editorRef.current) {
      const current = editorRef.current.getValue()
      if (sanitized !== current) {
        const model = editorRef.current.getModel()
        if (model) {
          const fullRange = model.getFullModelRange()
          editorRef.current.executeEdits("sanitize-change", [{ range: fullRange, text: sanitized, forceMoveMarkers: true }])
        } else {
          editorRef.current.setValue(sanitized)
        }
      }
    }
    onChange(sanitized)
  }, 1000)


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    const sanitizePastedText = (text: string) => {
      let s = text
      s = s.replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
      s = s.replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
      s = s.replace(/export\s+default\s+function\s+([A-Z]\w*)\s*\(/g, "function $1(")
      s = s.replace(/export\s+default\s+class\s+([A-Z]\w*)/g, "class $1")
      s = s.replace(/(^|\n)\s*export\s+default\s+/g, "\n")
      s = s.replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")
      s = s.replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
      return s
    }

    const pasteHandler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text/plain")
      if (!text) return
      const sanitized = sanitizePastedText(text)
      if (sanitized !== text) {
        e.preventDefault()
        const selections = editor.getSelections() || [editor.getSelection()]
        const edits = selections.map((sel: any) => ({
          range: sel,
          text: sanitized,
          forceMoveMarkers: true,
        }))
        editor.executeEdits("paste-sanitize", edits)
      }
    }

    const domNode = editor.getDomNode()
    if (domNode) {
      domNode.addEventListener("paste", pasteHandler as any)
      editorRef.current.__pasteHandler = pasteHandler
    }

    const kind = monaco.languages.CompletionItemKind
    const insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet

    const etiqueta = (label: string) => {
      return {
        label,
        insertText: `<${label}>$1</${label}>`,
        kind,
        insertTextRules,
      }
    }

    const etiquetaAvanzada = (label: string, insertText: string) => {
      return {
        label,
        insertText,
        kind,
        insertTextRules,
      }
    }

    const etiquetaConAtributo = (label: string, atributo?: string) => {
      return {
        label,
        insertText: `<${label} ${atributo ? atributo : ""}>$5</${label}>`,
        kind,
        insertTextRules,
      }
    }

    const etiquetaConSalto = (label: string) => {
      return {
        label,
        insertText: `<${label}>\n$1\n</${label}>`,
        kind,
        insertTextRules,
      }
    }

    const etiquetaAutoConclusiva = (label: string, atributo?: string) => {
      return {
        label,
        insertText: `<${label} ${atributo ? atributo : ""}/>\n$1`,
        kind,
        insertTextRules,
      }
    }

    // Definir las etiquetas personalizadas para el autocompletado
    const customTags = [
      // Componentes de layout
      {
        label: "Layout",
        insertText: '<Layout size="A4" orientation="v" showPageNumbers={true}>\n\n</Layout>',
        kind,
      },

      // Componentes de texto
      etiqueta("P"),
      etiqueta("H1"),
      etiqueta("H2"),
      etiqueta("H3"),
      etiqueta("H4"),
      etiqueta("H5"),
      etiqueta("H6"),
      etiqueta("Strong"),
      etiqueta("Em"),
      etiqueta("U"),
      etiqueta("Small"),
      etiqueta("Mark"),
      etiqueta("Span"),
      etiqueta("Div"),


      // Componentes de columnas
      etiquetaConSalto("Container"),
      etiquetaConSalto("Row"),
      etiquetaConSalto("Col1"),
      etiquetaConSalto("Col2"),
      etiquetaConSalto("Col3"),
      etiquetaConSalto("Col4"),
      etiquetaConSalto("Col5"),
      etiquetaConSalto("Col6"),
      etiquetaConSalto("Col7"),
      etiquetaConSalto("Col8"),
      etiquetaConSalto("Col9"),
      etiquetaConSalto("Col10"),
      etiquetaConSalto("Col11"),
      etiquetaConSalto("Col12"),

      // Componentes de posicionamiento
      etiquetaConSalto("Left"),
      etiquetaConSalto("Right"),
      etiquetaConSalto("Center"),

      //header y footer
      //etiquetaConSalto("Header"),
      //etiquetaConSalto("Main"),
      //etiquetaConSalto("Footer"),
      etiquetaConSalto("ImgBg"),



      etiquetaAutoConclusiva("BR"),
      etiquetaAutoConclusiva("HR"),
      etiquetaAutoConclusiva("Img", 'src="$1"'),

      etiquetaConAtributo("A", 'src="$1"'),

      // Componentes de tabla
      etiquetaAvanzada("Table", "<Table>\n  <Thead>\n    <Tr>\n      <Th></Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td></Td>\n    </Tr>\n  </Tbody>\n</Table>"),

      etiquetaConSalto("Thead"),
      etiquetaConSalto("Tbody"),
      etiquetaConSalto("Tr"),
      etiquetaConSalto("Th"),
      etiquetaConSalto("Td"),

      // Componentes de lista
      etiquetaAvanzada("UL", "<UL>\n<LI>$1</LI>\n</UL>"),
      etiquetaAvanzada("OL", "<OL>\n<LI>$1</LI>\n</OL>"),

      etiquetaConSalto("LI"),
      // Otros componentes

      etiquetaConSalto("Blockquote"),

      etiquetaAvanzada("QR", `
        <QR 
          value="https://example.com" 
          size={150} 
          colorDark="#3794ff" 
          colorLight="#ffffff"
          logo="https://genarogg.github.io/media/genarogg/favicon.png" 
          logoWidth={30}
          logoHeight={30}
          margin={0}
          errorCorrectionLevel="H"
        />`),
    ]

    // Registrar el proveedor de autocompletado
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        return {
          suggestions: customTags.map((tag) => ({
            ...tag,
            range,
          })),
        }
      },
    })

    // También registrar para TypeScript y JSX
    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        return {
          suggestions: customTags.map((tag) => ({
            ...tag,
            range,
          })),
        }
      },
    })

    // Configurar el editor para mostrar sugerencias automáticamente
    editor.updateOptions({
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
    })
  }

  // Limpiar el editor cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        // Paso 1: Obtener el modelo actual
        const model = editorRef.current.getModel()
        const domNode = editorRef.current.getDomNode()
        if (domNode && editorRef.current.__pasteHandler) {
          domNode.removeEventListener("paste", editorRef.current.__pasteHandler as any)
        }

        // Paso 2: Desasociar el modelo del editor antes de eliminarlo
        if (model) {
          try {
            // Desasociar el modelo del editor
            editorRef.current.setModel(null)

            // Disponer del modelo
            model.dispose()
          } catch (e) {
            console.log("Error al disponer del modelo:", e)
          }
        }

        // Paso 3: Limpiar cualquier suscripción o evento
        try {
          // Intentar disponer del editor si es posible
          if (typeof editorRef.current.dispose === "function") {
            editorRef.current.dispose()
          }
        } catch (e) {
          console.log("Error al disponer del editor:", e)
        }

        // Paso 4: Limpiar la referencia
        editorRef.current = null
      }
    }
  }, [])

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue={value}
      theme="vs-dark"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "on",
        folding: true,
        automaticLayout: true,
        tabCompletion: "on",
        snippetSuggestions: "top",
      }}
    />
  )
}

export default CodeEditor

