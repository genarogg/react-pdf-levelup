"use client"
import React from 'react'
import { Button } from "../ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-provider"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <div className="flex gap-1">
        <Button
          variant={language === "es" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLanguage("es")}
          className={`text-xs px-2 py-1 h-auto ${
            language === "es" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          ES
        </Button>
        <Button
          variant={language === "en" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className={`text-xs px-2 py-1 h-auto ${
            language === "en" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          EN
        </Button>
      </div>
    </div>
  )
}
