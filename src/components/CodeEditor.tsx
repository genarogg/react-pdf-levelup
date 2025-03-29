"use client"
import { Editor } from "@monaco-editor/react"
import { useRef, useEffect } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null)

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Definir las etiquetas personalizadas para el autocompletado
    const customTags = [
      // Componentes de layout
      {
        label: "LayoutPDF",
        insertText: '<LayoutPDF size="A4" padding={30} showPageNumbers={true}>\n  \n</LayoutPDF>',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "Container",
        insertText: "<Container>\n  \n</Container>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Row", insertText: "<Row>\n  \n</Row>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de columnas
      { label: "Col1", insertText: "<Col1>\n  \n</Col1>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col2", insertText: "<Col2>\n  \n</Col2>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col3", insertText: "<Col3>\n  \n</Col3>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col4", insertText: "<Col4>\n  \n</Col4>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col5", insertText: "<Col5>\n  \n</Col5>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col6", insertText: "<Col6>\n  \n</Col6>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col7", insertText: "<Col7>\n  \n</Col7>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col8", insertText: "<Col8>\n  \n</Col8>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col9", insertText: "<Col9>\n  \n</Col9>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col10", insertText: "<Col10>\n  \n</Col10>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col11", insertText: "<Col11>\n  \n</Col11>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col12", insertText: "<Col12>\n  \n</Col12>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de texto
      { label: "P", insertText: "<P>\n  \n</P>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H1", insertText: "<H1>\n  \n</H1>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H2", insertText: "<H2>\n  \n</H2>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H3", insertText: "<H3>\n  \n</H3>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H4", insertText: "<H4>\n  \n</H4>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H5", insertText: "<H5>\n  \n</H5>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H6", insertText: "<H6>\n  \n</H6>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Strong", insertText: "<Strong>\n  \n</Strong>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Em", insertText: "<Em>\n  \n</Em>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "U", insertText: "<U>\n  \n</U>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Small", insertText: "<Small>\n  \n</Small>", kind: monaco.languages.CompletionItemKind.Snippet },
      {
        label: "Blockquote",
        insertText: "<Blockquote>\n  \n</Blockquote>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Mark", insertText: "<Mark>\n  \n</Mark>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Span", insertText: "<Span>\n  \n</Span>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "BR", insertText: "<BR />", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "A", insertText: '<A href="">\n  \n</A>', kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de posicionamiento
      { label: "Left", insertText: "<Left>\n  \n</Left>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Right", insertText: "<Right>\n  \n</Right>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Center", insertText: "<Center>\n  \n</Center>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de tabla
      {
        label: "Table",
        insertText:
          "<Table>\n  <Thead>\n    <Tr>\n      <Th></Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td></Td>\n    </Tr>\n  </Tbody>\n</Table>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Thead", insertText: "<Thead>\n  \n</Thead>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Tbody", insertText: "<Tbody>\n  \n</Tbody>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Tr", insertText: "<Tr>\n  \n</Tr>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Th", insertText: "<Th>\n  \n</Th>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Td", insertText: "<Td>\n  \n</Td>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de lista
      { label: "UL", insertText: "<UL>\n  <LI></LI>\n</UL>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "OL", insertText: "<OL>\n  <LI></LI>\n</OL>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "LI", insertText: "<LI>\n  \n</LI>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Otros componentes
      {
        label: "Img",
        insertText: '<Img src="" style={{}} />',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "QR",
        insertText: '<QR value="" size={150} colorDark="#000000" />',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Header", insertText: "<Header>\n  \n</Header>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Footer", insertText: "<Footer>\n  \n</Footer>", kind: monaco.languages.CompletionItemKind.Snippet },

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

