import { useRef, useEffect, useMemo } from "react"
import { Editor } from "@monaco-editor/react"
import { getMonacoSnippets } from './utils/monacoSnippets';

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
        onChangeRef.current(value)
      }, 1000),
    []
  )


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    const pasteHandler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text/plain")
      if (!text) return
      // Directly insert the text without sanitization
      const selections = editor.getSelections() || [editor.getSelection()]
      const edits = selections.map((sel: any) => ({
        range: sel,
        text: text,
        forceMoveMarkers: true,
      }))
      editor.executeEdits("paste-sanitize", edits)
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


    const customTags = getMonacoSnippets(monaco.languages.CompletionItemKind, monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet);

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