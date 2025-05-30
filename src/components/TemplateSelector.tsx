import React from "react"
import { useState } from "react"
import { templates } from "../data/templates"

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Navigate to the template page with the selected template
    window.location.href = `/template/${templateId}`
  }

  return (
    <div className="template-selector-dropdown">
      <select
        className="template-select"
        onChange={(e) => handleSelectTemplate(e.target.value)}
        value={selectedTemplate}
        title="Select Template"
      >
        <option value="" disabled>
          Templates
        </option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TemplateSelector

