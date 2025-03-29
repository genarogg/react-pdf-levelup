// Utility to load template files
export const loadTemplateFile = async (templatePath: string): Promise<string> => {
  try {
    // Use Vite's import.meta.env.BASE_URL to ensure correct path resolution
    const response = await fetch(templatePath)
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error loading template:", error)
    throw error
  }
}

