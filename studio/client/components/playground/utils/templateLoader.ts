// Utility to load template files
export const loadTemplateFile = async (templatePath: string): Promise<string> => {
  try {
    // Resolvemos la ruta usando el BASE_URL de Vite, para que las plantillas
    // sigan cargando correctamente si el sitio alguna vez se despliega bajo
    // un subpath (p. ej. "https://ejemplo.com/mi-app/" en vez de la raíz del
    // dominio, donde BASE_URL sería "/mi-app/" en vez de "/").
    // Si templatePath ya es una URL absoluta (http/https), se usa tal cual.
    const resolveUrl = (path: string) => {
      if (/^https?:\/\//i.test(path)) return path
      const base = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`
      return `${base}${path.replace(/^\//, "")}`
    }

    const response = await fetch(resolveUrl(templatePath))
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error loading template:", error)
    throw error
  }
}