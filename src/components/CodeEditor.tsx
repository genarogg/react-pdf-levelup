import React, { useRef, useEffect } from "react"
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

      etiquetaAutoConclusiva("BR"),
      etiquetaAutoConclusiva("Img", 'src="$1"'),

      etiquetaConAtributo("A", 'src="$1"'),

      // Componentes de tabla
      {
        label: "Table",
        insertText:
          "<Table>  <Thead>    <Tr>      <Th></Th>    </Tr>  </Thead>  <Tbody>    <Tr>      <Td></Td>    </Tr>  </Tbody></Table>",
        kind,
      },
      { label: "Thead", insertText: "<Thead>  </Thead>", kind },
      { label: "Tbody", insertText: "<Tbody>  </Tbody>", kind },
      { label: "Tr", insertText: "<Tr>  </Tr>", kind },
      { label: "Th", insertText: "<Th>  </Th>", kind },
      { label: "Td", insertText: "<Td>  </Td>", kind },

      // Componentes de lista
      { label: "UL", insertText: "<UL>  <LI></LI></UL>", kind },
      { label: "OL", insertText: "<OL>  <LI></LI></OL>", kind },
      { label: "LI", insertText: "<LI>  </LI>", kind },

      // Otros componentes

      etiquetaConSalto("Blockquote"),
      {
        label: "QR",
        insertText: `<QR 
      url="https://example.com" 
      size={150} colorData="#3794ff" 
      logo="https://genarogg.github.io/media/genarogg/favicon.png" 
      logoText="Logo"
      dotType="extra-rounded" cornerSquareType="extra-rounded"
      cornerDotType="dot"
      cornerSquareColor="#3794ff"
      cornerDotColor="#e13e83"
        />`,
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Header", insertText: "<Header>  </Header>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Footer", insertText: "<Footer>  </Footer>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Snippets para estilos
      {
        label: "style-object",
        insertText: 'style={{ backgroundColor: "#ffffff", padding: 10, margin: 5 }}',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "style-text",
        insertText: 'style={{ fontSize: 12, fontWeight: "bold", color: "#000000", textAlign: "center" }}',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "style-border",
        insertText: 'style={{ borderWidth: 1, borderColor: "#000000", borderStyle: "solid", borderRadius: 5 }}',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
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

