import React from 'react'
import { Editor } from "@monaco-editor/react"
import { useRef } from "react"

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
        insertText: '<LayoutPDF size="A4" padding={30} showPageNumbers={true}></LayoutPDF>',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "Container",
        insertText: "<Container></Container>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Row", insertText: "<Row></Row>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de columnas
      { label: "Col1", insertText: "<Col1></Col1>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col2", insertText: "<Col2></Col2>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col3", insertText: "<Col3></Col3>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col4", insertText: "<Col4></Col4>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col5", insertText: "<Col5></Col5>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col6", insertText: "<Col6></Col6>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col7", insertText: "<Col7></Col7>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col8", insertText: "<Col8></Col8>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col9", insertText: "<Col9></Col9>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col10", insertText: "<Col10></Col10>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col11", insertText: "<Col11></Col11>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Col12", insertText: "<Col12></Col12>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de texto
      { label: "P", insertText: "<P></P>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H1", insertText: "<H1></H1>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H2", insertText: "<H2></H2>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H3", insertText: "<H3></H3>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H4", insertText: "<H4></H4>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H5", insertText: "<H5></H5>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "H6", insertText: "<H6></H6>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Strong", insertText: "<Strong></Strong>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Em", insertText: "<Em></Em>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "U", insertText: "<U></U>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Small", insertText: "<Small></Small>", kind: monaco.languages.CompletionItemKind.Snippet },
      {
        label: "Blockquote",
        insertText: "<Blockquote></Blockquote>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Mark", insertText: "<Mark></Mark>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Span", insertText: "<Span></Span>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "BR", insertText: "<BR />", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "A", insertText: '<A href=""></A>', kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de posicionamiento
      { label: "Left", insertText: "<Left></Left>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Right", insertText: "<Right></Right>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Center", insertText: "<Center></Center>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de tabla
      {
        label: "Table",
        insertText:
          "<Table>\n  <Thead>\n    <Tr>\n      <Th></Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td></Td>\n    </Tr>\n  </Tbody>\n</Table>",
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Thead", insertText: "<Thead></Thead>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Tbody", insertText: "<Tbody></Tbody>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Tr", insertText: "<Tr></Tr>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Th", insertText: "<Th></Th>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Td", insertText: "<Td></Td>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Componentes de lista
      { label: "UL", insertText: "<UL>\n  <LI></LI>\n</UL>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "OL", insertText: "<OL>\n  <LI></LI>\n</OL>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "LI", insertText: "<LI></LI>", kind: monaco.languages.CompletionItemKind.Snippet },

      // Otros componentes
      {
        label: "Img",
        insertText: '<Img src="" style={{  }} />',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      {
        label: "QR",
        insertText: '<QR value="" size={150} colorDark="#000000" />',
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
      { label: "Header", insertText: "<Header></Header>", kind: monaco.languages.CompletionItemKind.Snippet },
      { label: "Footer", insertText: "<Footer></Footer>", kind: monaco.languages.CompletionItemKind.Snippet },
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

