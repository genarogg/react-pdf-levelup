"use client"
import React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Copy, Check } from "lucide-react"


interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
        <code className={`language-${language} text-gray-300`}>{code}</code>
      </pre>
    </div>
  )
}