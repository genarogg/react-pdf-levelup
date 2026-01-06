"use client"

import React, { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
 
type TemplateMeta = {
  id: string
  name: string
}

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/templates/index.json")
        if (!res.ok) throw new Error("Failed to fetch templates")
        const data = await res.json()
        setTemplates(data)
      } catch {
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Navigate to the template page with the selected template
    window.location.href = `/template/${templateId}`
  }

  return (
    <div className="template-selector-dropdown">
      <Select value={selectedTemplate} onValueChange={handleSelectTemplate}>
        <SelectTrigger className="w-[160px] bg-gray-800/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/50 transition-colors">
          <FileText className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder="Templates" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {!loading && templates.map((template) => (
            <SelectItem
              key={template.id}
              value={template.id}
              className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white cursor-pointer"
            >
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TemplateSelector
