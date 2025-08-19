"use client"
import React from 'react'

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: typeof translations.es
  t: (key: string) => string // Added t function to interface
}

const translations = {
  es: {
    // Header
    pdfComponents: "Componentes PDF",
    interactiveDocumentation: "Documentación Interactiva",

    // Categories
    gettingStarted: "COMENZANDO",
    layout: "DISEÑO",
    media: "MEDIOS",
    content: "CONTENIDO",
    categories: {
      Layout: "Diseño",
      Content: "Contenido",
      Media: "Medios",
    },

    // Navigation
    overview: "Resumen",
    implementation: "Implementación",
    backendFrontendUsage: "Uso en Backend y Frontend",
    props: "Propiedades",
    examples: "Ejemplos",
    usage: "Uso",

    // Component Detail translations
    componentNotFound: "Componente no encontrado",
    copiedToClipboard: "Copiado al portapapeles",
    codeHasBeenCopied: "El código ha sido copiado a tu portapapeles.",
    componentOverview: "Resumen del Componente",
    understandingComponent: "Entendiendo el componente {component}",
    keyFeatures: "Características Principales",
    propsInterface: "Interfaz de Propiedades",
    allAvailableProps: "Todas las propiedades disponibles para {component}",
    required: "Requerido",
    optional: "Opcional",
    type: "Tipo",
    default: "Por defecto",
    copy: "Copiar",
    usageGuidelines: "Guías de Uso",
    bestPractices: "Mejores prácticas y notas de implementación",

    // Component Overview translations
    pdfComponentsDocumentation: "Documentación de Componentes PDF",
    comprehensiveCollection:
      "Una colección completa de componentes React para generar PDFs profesionales con @react-pdf/renderer",
    interactive: "Interactivo",
    tenComponents: "10 Componentes",
    completeSetDescription: "Conjunto completo de componentes PDF para tablas, imágenes, diseños y más",
    interactiveExamples: "Ejemplos Interactivos",
    liveCodeExamples: "Ejemplos de código en vivo con resaltado de sintaxis y funcionalidad de copia",
    typescriptSupport: "Soporte TypeScript",
    fullTypescriptDefinitions: "Definiciones completas de TypeScript con interfaces de propiedades detalladas",
    professionalDesign: "Diseño Profesional",
    cleanModernInterface: "Interfaz limpia y moderna inspirada en React PDF Editor",
    quickStart: "Inicio Rápido",
    getStartedMinutes: "Comienza con componentes PDF en minutos",
    importAnyComponent:
      "Importa cualquier componente desde la barra lateral para ver documentación detallada, propiedades y ejemplos interactivos.",
    exploreComponents: "Explorar Componentes",

    // Components
    tablet: "Tabla",
    tableComponent: "Componente de tabla",
    gridSystem: "Sistema de Cuadrícula",
    bootstrapLikeGrid: "Cuadrícula tipo Bootstrap",
    position: "Posición",
    positioningWrapper: "Envoltorio de posicionamiento",
    layoutPdf: "LayoutPDF",
    pdfLayout: "Diseño PDF",
    image: "Imagen",
    imageDisplay: "Visualización de imagen",
    imgBg: "ImgBg",
    backgroundImages: "Imágenes de fondo",
    qrCode: "Código QR",
    qrCodeDisplay: "Visualización de código QR",
    textElements: "Elementos de Texto",
    typographyComponents: "Componentes de tipografía",
    lists: "Listas",
    listComponents: "Componentes de lista",

    // Language selector
    language: "Idioma",
  },
  en: {
    // Header
    pdfComponents: "PDF Components",
    interactiveDocumentation: "Interactive Documentation",

    // Categories
    gettingStarted: "GETTING STARTED",
    layout: "LAYOUT",
    media: "MEDIA",
    content: "CONTENT",
    categories: {
      Layout: "Layout",
      Content: "Content",
      Media: "Media",
    },

    // Navigation
    overview: "Overview",
    implementation: "Implementation",
    backendFrontendUsage: "Backend & Frontend Usage",
    props: "Props",
    examples: "Examples",
    usage: "Usage",

    // Component Detail translations
    componentNotFound: "Component not found",
    copiedToClipboard: "Copied to clipboard",
    codeHasBeenCopied: "Code has been copied to your clipboard.",
    componentOverview: "Component Overview",
    understandingComponent: "Understanding the {component} component",
    keyFeatures: "Key Features",
    propsInterface: "Props Interface",
    allAvailableProps: "All available props for {component}",
    required: "Required",
    optional: "Optional",
    type: "Type",
    default: "Default",
    copy: "Copy",
    usageGuidelines: "Usage Guidelines",
    bestPractices: "Best practices and implementation notes",

    // Component Overview translations
    pdfComponentsDocumentation: "PDF Components Documentation",
    comprehensiveCollection:
      "A comprehensive collection of React components for generating professional PDFs with @react-pdf/renderer",
    interactive: "Interactive",
    tenComponents: "10 Components",
    completeSetDescription: "Complete set of PDF components for tables, images, layouts, and more",
    interactiveExamples: "Interactive Examples",
    liveCodeExamples: "Live code examples with syntax highlighting and copy functionality",
    typescriptSupport: "TypeScript Support",
    fullTypescriptDefinitions: "Full TypeScript definitions with detailed prop interfaces",
    professionalDesign: "Professional Design",
    cleanModernInterface: "Clean, modern interface inspired by React PDF Editor",
    quickStart: "Quick Start",
    getStartedMinutes: "Get started with PDF components in minutes",
    importAnyComponent:
      "Import any component from the sidebar to see detailed documentation, props, and interactive examples.",
    exploreComponents: "Explore Components",

    // Components
    tablet: "Tablet",
    tableComponent: "Table component",
    gridSystem: "Grid System",
    bootstrapLikeGrid: "Bootstrap-like grid",
    position: "Position",
    positioningWrapper: "Positioning wrapper",
    layoutPdf: "LayoutPDF",
    pdfLayout: "PDF layout",
    image: "Image",
    imageDisplay: "Image display",
    imgBg: "ImgBg",
    backgroundImages: "Background images",
    qrCode: "QR Code",
    qrCodeDisplay: "QR code display",
    textElements: "Text Elements",
    typographyComponents: "Typography components",
    lists: "Lists",
    listComponents: "List components",

    // Language selector
    language: "Language",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
        t, // Added t function to context value
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
