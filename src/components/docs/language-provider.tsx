"use client"
import React, { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

const translations: Record<Language, any> = {
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
  en: {}, // 🚨 vacío, pero existe para que no dé error TS
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: typeof translations[Language]
  t: (key: string) => string
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
        return key
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
        t,
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
