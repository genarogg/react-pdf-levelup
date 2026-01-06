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
    if (value !== undefined) {
      onChange(value)
    }
  }, 1000)


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

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
        label: "LayoutPDF",
        insertText: '<LayoutPDF size="A4" orientation="v" showPageNumbers={true}>\n\n</LayoutPDF>',
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
      etiquetaConSalto("Header"),
      etiquetaConSalto("Main"),
      etiquetaConSalto("Footer"),
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

