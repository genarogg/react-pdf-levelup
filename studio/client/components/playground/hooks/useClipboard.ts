import { useRef, useState } from "react"

export function useClipboard(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | number | null>(null)
  const timeoutRef = useRef<any>(null)

  const copy = async (text: string, key: string | number) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand("copy") } finally { document.body.removeChild(textarea) }
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCopiedKey(key)
    timeoutRef.current = setTimeout(() => setCopiedKey(null), timeout)
  }

  return { copiedKey, copy }
}
