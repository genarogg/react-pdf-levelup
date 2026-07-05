import { useRef, useEffect, useMemo } from "react"
import { Editor } from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
}

// Movido fuera del componente: es una fábrica pura, no necesita recrearse en cada render.
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null)
  const completionProvidersRef = useRef<{ dispose: () => void }[]>([])

  // Referencia siempre actualizada a la última versión de onChange, para que el
  // debounce memoizado (creado una sola vez) nunca quede con una closure vieja.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Memoizado una sola vez: evita que un re-render (p. ej. por useMobileDetection
  // en un resize) cree una nueva instancia de debounce con su propio timeoutId,
  // dejando "huérfano" el setTimeout pendiente de la instancia anterior.
  const handleEditorChange = useMemo(
    () =>
      debounce((value: string | undefined) => {
        if (value === undefined) return
        const sanitizeAll = (text: string) => {
          let s = text
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
        onChangeRef.current(sanitized)
      }, 1000),
    []
  )


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    const sanitizePastedText = (text: string) => {
      let s = text
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

    // El código del Playground es TSX (anotaciones de tipo + JSX), pero el
    // modelo se estaba tratando como JavaScript puro (ver prop `defaultLanguage`
    // más abajo, ahora "typescript" + path=".tsx"). Sin esto, el worker de TS
    // de Monaco marca cualquier anotación de tipo con el error 8010
    // ("Type annotations can only be used in TypeScript files").
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      allowJs: true,
      noEmit: true,
    })

    // El código se ejecuta en un scope aislado (new Function) sin imports
    // reales: Layout, P, Table, QR, etc. se inyectan como "globales" en
    // tiempo de ejecución (ver PDFPreview.tsx), pero el language service de
    // TypeScript no tiene forma de saberlo. Sin apagar la validación
    // semántica, marcaría como error "Cannot find name" cada una de esas
    // etiquetas. La validación de sintaxis se deja activa para seguir
    // avisando errores reales (JSX sin cerrar, llaves faltantes, etc.).
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })

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
        insertText: `const MyDocument = () => (
  <Layout size="A4" orientation="v" pagination={true}>

  </Layout>
);

export default MyDocument;`,
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


      //Form
      etiquetaConSalto("Form"),
      etiquetaAutoConclusiva("Input", 'label="$1"'),
      etiquetaAutoConclusiva("TextArea", 'label="$1"'),
      etiquetaAutoConclusiva("Checkbox", 'label="$1"'),

      // Componentes de columnas
      // etiquetaConSalto("Container"),
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

      etiquetaAutoConclusiva("NextPage"),

      etiquetaAutoConclusiva("BR"),
      etiquetaAutoConclusiva("HR", "style={{ borderTop: '1px solid #000' }}"),
      etiquetaAutoConclusiva("Img", 'src="$1"'),
      etiquetaAutoConclusiva("Icon", 'ico="$1"'),

      etiquetaConAtributo("A", 'href="$1"'),

      // Componentes de tabla
      etiquetaAvanzada("Table", "<Table>\n  <Thead>\n    <Tr>\n      <Th>$1</Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td></Td>\n    </Tr>\n  </Tbody>\n</Table>"),

      // container 
      etiquetaAvanzada("Container", "<Container>\n <Row>\n <Col6>\n  $1\n</Col6>\n<Col6>\n  \n</Col6> \n</Row> \n</Container>"),

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
          url="https://example.com" 
          size={150} 
          colorDark="#3794ff" 
          colorLight="#ffffff"
          logo="https://example.com/logo.png" 
          logoWidth={30}
          logoHeight={30}
          margin={0}
          errorCorrectionLevel="H"
        />`),

      etiquetaAvanzada("QRstyle", `
        <QRstyle
          url="https://example.com"
          size={300}
          colorDark="#3794ff"
          colorLight="#ffffff"
          image="https://example.com/logo.png"
          dotsOptions={{ color: "#3794ff", type: "rounded" }}
          backgroundOptions={{ color: "#ffffff" }}
          imageOptions={{ margin: 0, imageSize: 0.4 }}
          cornersSquareOptions={{ type: "extra-rounded", color: "#3794ff" }}
          cornersDotOptions={{ type: "dot", color: "#3794ff" }}
          margin={0}
          errorCorrectionLevel="H"
        />`),
    ]

    // Registrar el proveedor de autocompletado
    const jsProvider = monaco.languages.registerCompletionItemProvider("javascript", {
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
    const tsProvider = monaco.languages.registerCompletionItemProvider("typescript", {
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

    // Guardar los disposables para poder limpiarlos al desmontar el editor
    completionProvidersRef.current.push(jsProvider, tsProvider)

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
      // Disponer los proveedores de autocompletado (JS y TS) para evitar que se dupliquen
      // las sugerencias en cada montaje/desmontaje del editor (ver bug #3)
      completionProvidersRef.current.forEach((provider) => {
        try {
          provider.dispose()
        } catch (e) {
          console.log("Error al disponer del completion provider:", e)
        }
      })
      completionProvidersRef.current = []

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
      defaultLanguage="typescript"
      path="playground-code.tsx"
      value={value}
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