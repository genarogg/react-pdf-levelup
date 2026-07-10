import { useRef, useEffect, useMemo } from "react"
import { Editor } from "@monaco-editor/react"
import { getMonacoSnippets } from './utils/monacoSnippets';

const safeDispose = (disposable: { dispose: () => void } | null | undefined, label: string) => {
  if (!disposable) return
  try { disposable.dispose() } catch (e) { console.warn(`Error al disponer ${label}:`, e) }
}

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

// Detecta declaraciones `import` completas (de una o varias líneas) para
// poder eliminarlas automáticamente del editor. El código del Playground se
// ejecuta en un scope aislado con `new Function` (ver compilePlaygroundCode.ts),
// donde Layout, P, Table, QR, etc. ya están inyectados como "globales": los
// imports reales nunca funcionarían ahí, así que no tiene sentido dejar que
// el usuario los deje escritos (por error o al pegar código de otro lado).
//
// - Primera alternativa: `import ... from 'paquete'`, admite bloques
//   multilínea (`import {\n  Foo\n} from 'paquete'`) gracias al `[\s\S]*?`
//   no-codicioso, que se detiene en el primer `from '...'` que encuentra.
// - Segunda alternativa: imports de solo efecto, `import 'paquete'`.
// Ambas consumen el `;` final (opcional) y el salto de línea siguiente, para
// no dejar una línea en blanco al borrar.
const IMPORT_STATEMENT_REGEX =
  /^[ \t]*import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?[ \t]*\r?\n?|^[ \t]*import\s+['"][^'"]*['"]\s*;?[ \t]*\r?\n?/gm

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null)
  const completionProvidersRef = useRef<{ dispose: () => void }[]>([])
  const contentChangeListenerRef = useRef<{ dispose: () => void } | null>(null)

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

    const provideCompletionItems = (model: any, position: any) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      return { suggestions: customTags.map((tag) => ({ ...tag, range })) }
    }

    completionProvidersRef.current = ["javascript", "typescript"].map((lang) =>
      monaco.languages.registerCompletionItemProvider(lang, { provideCompletionItems })
    )

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

    // Auto-eliminar imports: en cuanto una declaración `import` queda
    // completa (el usuario terminó de escribir la comilla de cierre del
    // paquete, o la pegó junto con más código), se borra directamente del
    // modelo. No hace falta esperar al onChange debounced de arriba: esto
    // corre en cada cambio de contenido, así que reacciona al instante.
    contentChangeListenerRef.current = editor.onDidChangeModelContent(() => {
      const model = editor.getModel()
      if (!model) return

      const fullText = model.getValue()
      // Salida rápida: evita el trabajo de armar ediciones en cada
      // pulsación cuando no hay ningún "import" en el texto.
      if (!fullText.includes("import")) return

      const matches: { start: number; end: number }[] = []
      let match: RegExpExecArray | null
      IMPORT_STATEMENT_REGEX.lastIndex = 0
      while ((match = IMPORT_STATEMENT_REGEX.exec(fullText)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length })
        // Sin esto, un match de longitud 0 (no debería pasar aquí, pero por
        // seguridad) dejaría el regex girando en el mismo índice.
        if (match[0].length === 0) IMPORT_STATEMENT_REGEX.lastIndex++
      }

      if (matches.length === 0) return

      // De atrás hacia adelante: borrar un tramo no debe desplazar los
      // offsets de los tramos todavía pendientes de procesar.
      const edits = matches
        .sort((a, b) => b.start - a.start)
        .map(({ start, end }) => {
          const startPos = model.getPositionAt(start)
          const endPos = model.getPositionAt(end)
          return {
            range: {
              startLineNumber: startPos.lineNumber,
              startColumn: startPos.column,
              endLineNumber: endPos.lineNumber,
              endColumn: endPos.column,
            },
            text: "",
          }
        })

      editor.executeEdits("remove-imports", edits)
    })
  }

  // Limpiar el editor cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Disponer los proveedores de autocompletado (JS y TS) para evitar que se dupliquen
      // las sugerencias en cada montaje/desmontaje del editor (ver bug #3)
      completionProvidersRef.current.forEach((provider) => {
        safeDispose(provider, "del completion provider")
      })
      completionProvidersRef.current = []

      // Disponer el listener de auto-eliminación de imports (ver bug de
      // duplicación de proveedores más arriba: el mismo riesgo aplica aquí
      // si el editor se remonta sin limpiar el listener anterior).
      if (contentChangeListenerRef.current) {
        safeDispose(contentChangeListenerRef.current, "del listener de imports")
        contentChangeListenerRef.current = null
      }

      if (editorRef.current) {
        // Paso 1: Obtener el modelo actual
        const model = editorRef.current.getModel()


        // Paso 2: Desasociar el modelo del editor antes de eliminarlo
        if (model) {
            editorRef.current.setModel(null)
            safeDispose(model, "del modelo")
        }

        // Paso 3: Limpiar cualquier suscripción o evento
          safeDispose(editorRef.current, "del editor")

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