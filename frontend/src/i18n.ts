import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  es: {
    translation: {
      hero: {
        badge: "Código abierto y gratuito",
        title_start: "Crea PDFs hermosos con",
        title_highlight: "Componentes de React",
        description:
          "La forma moderna de crear documentos PDF usando componentes de React. Tipado seguro, alto rendimiento y una experiencia pensada para desarrolladores. Olvídate de pelear con librerías de bajo nivel.",
        playground: "Ir al Playground",
        docs: "Ver documentación",
        copy_aria: "Copiar comando de instalación"
      }
    }
  },
  en: {
    translation: {
      hero: {
        badge: "Open source and free",
        title_start: "Build beautiful PDFs with",
        title_highlight: "React Components",
        description:
          "The modern way to create PDF documents using React components. Type-safe, high performance, and an experience built for developers. Forget fighting with low-level libraries.",
        playground: "Go to Playground",
        docs: "View documentation",
        copy_aria: "Copy install command"
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false }
})

export default i18n

