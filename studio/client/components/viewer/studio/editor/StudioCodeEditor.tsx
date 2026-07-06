import { useRef, useEffect, useMemo } from "react"
import { Editor } from "@monaco-editor/react"
import { getMonacoSnippets } from "@/components/playground/utils/monacoSnippets"

const safeDispose = (disposable: { dispose: () => void } | null | undefined, label: string) => {
  if (!disposable) return
  try {
    disposable.dispose()
  } catch (e) {
    console.warn(`Error al disponer ${label}:`, e)
  }
}

interface StudioCodeEditorProps {
  path: string
  language: string
  value: string
  onSave: (content: string) => void
}

// Igual que en el Playground, pero acá SÍ queremos conservar los imports:
// en el Studio cada archivo es real en disco y `import Foo from "./Foo"`
// es la forma normal de componer módulos (ver moduleGraph.ts /
// compileWorkspace.ts). No hay auto-eliminación de imports.
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const MONACO_LANGUAGE_BY_STUDIO_LANGUAGE: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  json: "json",
  plaintext: "plaintext",
}

export function StudioCodeEditor({ path, language, value, onSave }: StudioCodeEditorProps) {
  const editorRef = useRef<any>(null)
  const completionProvidersRef = useRef<{ dispose: () => void }[]>([])

  const onSaveRef = useRef(onSave)
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  // Memoizado una sola vez: si se recreara en cada render (p. ej. al cambiar
  // de archivo) quedaría "huérfano" cualquier setTimeout pendiente de la
  // instancia anterior, perdiendo ese guardado. onSaveRef siempre apunta a
  // la versión más reciente sin necesidad de recrear el debounce.
  const debouncedSave = useMemo(
    () =>
      debounce((nextValue: string | undefined) => {
        if (nextValue === undefined) return
        onSaveRef.current(nextValue)
      }, 800),
    []
  )

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowNonTsExtensions: true,
      allowJs: true,
      noEmit: true,
    })

    // A diferencia del Playground (donde todo corre en un scope aislado sin
    // imports reales), acá los imports relativos SÍ son válidos — pero el
    // language service de Monaco no tiene visibilidad del resto de archivos
    // del workspace ni de los paquetes npm del proyecto real, así que igual
    // marcaría error semántico en cualquier import. Se deja únicamente la
    // validación de sintaxis activa.
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })

    const customTags = getMonacoSnippets(
      monaco.languages.CompletionItemKind,
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    )

    const provideCompletionItems = (model: any, position: any) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      return { suggestions: customTags.map((tag: any) => ({ ...tag, range })) }
    }

    completionProvidersRef.current = ["javascript", "typescript"].map((lang) =>
      monaco.languages.registerCompletionItemProvider(lang, { provideCompletionItems })
    )

    editor.updateOptions({
      quickSuggestions: { other: true, comments: true, strings: true },
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
    })
  }

  useEffect(() => {
    return () => {
      completionProvidersRef.current.forEach((provider) => safeDispose(provider, "del completion provider"))
      completionProvidersRef.current = []

      if (editorRef.current) {
        const model = editorRef.current.getModel()
        if (model) {
          editorRef.current.setModel(null)
          safeDispose(model, "del modelo")
        }
        safeDispose(editorRef.current, "del editor")
        editorRef.current = null
      }
    }
  }, [])

  const monacoLanguage = MONACO_LANGUAGE_BY_STUDIO_LANGUAGE[language] ?? "plaintext"

  return (
    <Editor
      height="100%"
      key={path}
      defaultLanguage={monacoLanguage}
      path={path}
      value={value}
      theme="vs-dark"
      onChange={debouncedSave}
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
