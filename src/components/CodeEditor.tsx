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
    const insertTextRules =  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet

    // Definir las etiquetas personalizadas para el autocompletado
    const customTags = [
      // Componentes de layout
      {
        label: "LayoutPDF",
        insertText: '<LayoutPDF size="A4" orientation="v" showPageNumbers={true}>\n\n</LayoutPDF>',
        kind,
      },
      {
        label: "Container",
        insertText: "<Container>  </Container>",
        kind,
      },
      { label: "Row", insertText: "<Row></Row>", kind },

      // Componentes de columnas
      { label: "Col1", insertText: "<Col1>  </Col1>", kind },
      { label: "Col2", insertText: "<Col2>  </Col2>", kind },
      { label: "Col3", insertText: "<Col3>  </Col3>", kind },
      { label: "Col4", insertText: "<Col4>  </Col4>", kind },
      { label: "Col5", insertText: "<Col5>  </Col5>", kind },
      { label: "Col6", insertText: "<Col6>  </Col6>", kind },
      { label: "Col7", insertText: "<Col7>  </Col7>", kind },
      { label: "Col8", insertText: "<Col8>  </Col8>", kind },
      { label: "Col9", insertText: "<Col9>  </Col9>", kind },
      { label: "Col10", insertText: "<Col10>  </Col10>", kind },
      { label: "Col11", insertText: "<Col11>  </Col11>", kind },
      { label: "Col12", insertText: "<Col12>  </Col12>", kind },

      // Componentes de texto
      {
        label: "P",
        insertText: "<P>$1</P>",
        kind,
        insertTextRules
      },
      { label: "H1", insertText: "<H1>  </H1>", kind },
      { label: "H2", insertText: "<H2>  </H2>", kind },
      { label: "H3", insertText: "<H3>  </H3>", kind },
      { label: "H4", insertText: "<H4>  </H4>", kind },
      { label: "H5", insertText: "<H5>  </H5>", kind },
      { label: "H6", insertText: "<H6>  </H6>", kind },
      { label: "Strong", insertText: "<Strong>  </Strong>", kind },
      { label: "Em", insertText: "<Em>  </Em>", kind },
      { label: "U", insertText: "<U>  </U>", kind },
      { label: "Small", insertText: "<Small>  </Small>", kind },
      {
        label: "Blockquote",
        insertText: "<Blockquote>  </Blockquote>",
        kind,
      },
      { label: "Mark", insertText: "<Mark>  </Mark>", kind },
      { label: "Span", insertText: "<Span>  </Span>", kind },
      { label: "BR", insertText: "<BR />", kind },
      { label: "A", insertText: '<A href="">  </A>', kind },

      // Componentes de posicionamiento
      { label: "Left", insertText: "<Left>  </Left>", kind },
      { label: "Right", insertText: "<Right>  </Right>", kind },
      { label: "Center", insertText: "<Center>  </Center>", kind },

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
      {
        label: "Img",
        insertText: '<Img src="" style={{}} />',
        kind,
      },
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

