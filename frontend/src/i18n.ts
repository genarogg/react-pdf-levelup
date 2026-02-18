import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

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
      },
      value: {
        heading: "¿Por qué react-pdf-levelup?",
        subheading: "Todo lo que necesitas para crear documentos PDF profesionales con React.",
        features: {
          react: {
            title: "Nativo de React",
            desc:
              "Escribe PDFs usando los patrones que ya conoces. Componentes, props y JSX, sin aprender nuevas sintaxis extrañas."
          },
          typescript: {
            title: "TypeScript Completo",
            desc:
              "Definiciones de tipos robustas para todos los componentes. Detecta errores mientras escribes, no en producción."
          },
          performance: {
            title: "Rendimiento Optimizado",
            desc:
              "Diseñado para la velocidad con renderizado eficiente y un tamaño de paquete mínimo. Genera documentos al instante."
          },
          styling: {
            title: "Estilos Flexibles",
            desc:
              "Estiliza tus PDFs con una API similar a CSS. Flexbox, fuentes personalizadas y diseños que se adaptan a tus necesidades."
          }
        }
      },
      templates: {
        badge: "Plantillas Profesionales",
        title: "Plantillas Listas para Usar",
        desc: "Comienza con plantillas profesionales y personalízalas según tus necesidades. Formato optimizado y diseño moderno.",
        cta_line: "¿No encuentras lo que buscas?",
        cta_link: "Explora más plantillas"
      },
      how: {
        heading: "Cómo Funciona",
        subheading: "De cero a PDF en menos de 5 minutos",
        steps: {
          s1: {
            title: "Instala la librería",
            desc: "Agrega react-pdf-levelup a tu proyecto con npm."
          },
          s2: {
            title: "Crea tu template en el Playground",
            desc:
              "Abre /playground y define un componente de React para tu PDF usando los componentes de react-pdf-levelup (Layout, texto, tablas, QR, etc.)."
          },
          s3: {
            title: "Genera tu PDF (frontend o backend)",
            desc:
              "Usa la librería para generar el PDF donde lo necesites. En navegador puedes previsualizar y descargar; en servidor guardas el archivo."
          }
        }
      },
      dev: {
        heading: "Creado para Desarrolladores",
        subheading:
          "Nos obsesionamos con los pequeños detalles para que puedas concentrarte en programar. Cada decisión de la librería está pensada en la experiencia del desarrollador.",
        features: {
          ts: {
            title: "Tipado completo con TypeScript",
            desc:
              "IntelliSense, autocompletado y seguridad en tiempo de compilación para todos los componentes y props."
          },
          frameworks: {
            title: "Funciona con Frameworks Modernos",
            desc:
              "Integración perfecta con Vite, Next.js, Remix y Create React App."
          },
          composable: {
            title: "Componentes Componibles",
            desc:
              "Construye diseños complejos combinando bloques de construcción simples y reutilizables."
          },
          plugins: {
            title: "Plugins Poderosos y Extensibles",
            desc:
              "Añade códigos QR, gráficos y más con plugins oficiales como @react-pdf-levelup/qr y @react-pdf-levelup/chart."
          },
          theming: {
            title: "Temas y Personalización Fáciles",
            desc:
              "Sobrescribe colores, fuentes y espaciado con un objeto de tema simple o sintaxis tipo CSS."
          },
          scale: {
            title: "Diseñado para Escalar",
            desc:
              "Genera miles de PDFs eficientemente con renderizado y caché optimizados."
          }
        }
      },
      use: {
        heading: "Diseñado para cada caso de uso",
        subheading:
          "Desde startups hasta grandes empresas, react-pdf-levelup impulsa la generación de PDFs en múltiples industrias.",
        cases: {
          business: {
            title: "Empresarial",
            desc:
              "Genera reportes, contratos y documentación a gran escala con una identidad visual consistente.",
            examples: ["Reportes financieros", "Documentos legales", "Contratos de RRHH"]
          },
          education: {
            title: "Educación",
            desc:
              "Crea certificados, calificaciones y materiales educativos de forma programática.",
            examples: ["Certificados", "Boletines de notas", "Materiales de cursos"]
          },
          ecommerce: {
            title: "Comercio electrónico",
            desc:
              "Automatiza la generación de facturas, etiquetas de envío y confirmaciones de pedidos.",
            examples: ["Facturas", "Recibos", "Etiquetas de envío"]
          },
          saas: {
            title: "Aplicaciones SaaS",
            desc:
              "Agrega exportación a PDF en tu aplicación web con el mínimo esfuerzo.",
            examples: ["Exportación de datos", "Reportes de usuarios", "Dashboards de analítica"]
          }
        }
      },
      api: {
        badge: "Multi‑lenguaje • HTTP • Self‑hosting",
        heading: "API REST que lleva React PDF Level Up a cualquier lenguaje",
        subheading:
          "Integra generación de PDFs con templates React desde Node, Python, PHP, C#, Java y más. Envía tu template TSX en base64 junto con datos en JSON y recibe el PDF en base64 listo para guardar o enviar.",
        features: {
          anylang: {
            title: "Funciona con cualquier lenguaje",
            desc: "HTTP simple: usa tu stack actual sin cambios mayores."
          },
          instant: {
            title: "Integración inmediata",
            desc: "POST JSON, respuesta base64: sin SDKs adicionales."
          },
          hosting: {
            title: "Cloud o Self‑hosting",
            desc: "Usa el endpoint gestionado o despliega tu propia instancia."
          },
          secure: {
            title: "Seguro y escalable",
            desc: "Contratos deterministas, fácil de horizontalizar."
          }
        },
        endpoints: {
          heading: "Endpoints",
          desc: "Empieza en la nube o despliega tu propia instancia.",
          copy: "Copiar Endpoint Cloud",
          copied: "Copiado",
          download_zip: "Descargar ZIP",
          docs: "Documentación"
        },
        how: {
          heading: "Cómo funciona",
          i1: "Escribe tu template React (TSX) y conviértelo a base64.",
          i2: "Envía un POST con JSON: { template, data } al endpoint.",
          i3: "Recibe data.pdf en base64 y decodifica al archivo.",
          i4: "Guarda o entrega el PDF según tu caso de uso."
        },
        fonts: {
          heading: "Fuentes Personalizadas",
          desc:
            "Para asegurar el correcto renderizado en el servidor, las fuentes deben cargarse desde URLs remotas absolutas (https://...). No utilices rutas locales."
        }
      },
      roadmap: {
        heading: "Hoja de Ruta",
        subheading: "Todas las características principales han sido implementadas.",
        items: {
          core: {
            title: "Componentes Core",
            desc:
              "Layout, Header, texto (H1–H6, P, Strong, Em), listas, QR y columnas (Container, Row, Col1–Col12)"
          },
          flex: {
            title: "Diseño Flexbox",
            desc: "Soporte completo de flexbox para diseños complejos"
          },
          fonts: {
            title: "Fuentes Personalizadas",
            desc: "Registro y uso de familias de fuentes con distintos pesos"
          },
          tables: {
            title: "Tablas",
            desc: "Thead, Tbody, Tr, Th y Td con paginación automática"
          },
          charts: {
            title: "Gráficos y Diagramas",
            desc: "Componentes para visualización de datos integrados"
          },
          forms: {
            title: "Campos de Formulario",
            desc: "Inputs PDF interactivos y elementos de formulario"
          }
        }
      },
      support: {
        community_badge: "Comunidad",
        heading: "Apoya el Proyecto",
        subheading:
          "Tu apoyo ayuda a mantener y mejorar esta herramienta gratuita para la comunidad",
        support_card: {
          title: "Soporte y Contacto",
          desc:
            "¿Tienes preguntas, sugerencias o necesitas ayuda? Contáctame a través de cualquiera de estos canales. Estoy aquí para apoyarte.",
          email: "Correo Electrónico",
          whatsapp: "WhatsApp",
          discord: "Servidor Discord",
          join: "Únete a la comunidad"
        },
        donations_card: {
          title: "Donaciones",
          desc:
            "Si encuentras útil esta herramienta y quieres apoyar su desarrollo continuo, considera hacer una donación.",
          helps: "Tu donación ayuda a:",
          lines: [
            "Mantener el proyecto gratuito",
            "Agregar nuevas características",
            "Mejorar la documentación",
            "Brindar soporte a la comunidad"
          ],
          patreon: "Apoyar en Patreon",
          paypal: "Donar vía PayPal",
          thanks: "Cada contribución hace la diferencia ✨"
        },
        thanks_banner: "¡Gracias por ser parte de la comunidad! 🙏"
      },
      faq: {
        heading: "Preguntas Frecuentes",
        subheading: "Todo lo que necesitas saber sobre react-pdf-levelup.",
        items: [
          {
            q: "¿react-pdf-levelup es gratuito?",
            a:
              "¡Sí! react-pdf-levelup es completamente gratuito y de código abierto bajo la licencia MIT. Puedes usarlo en proyectos personales y comerciales sin ninguna restricción."
          },
          {
            q: "¿Funciona con Next.js App Router?",
            a:
              "Absolutamente. react-pdf-levelup es totalmente compatible con Next.js App Router, incluidos los server components y las server actions. Puedes generar PDFs tanto en el servidor como en el cliente."
          },
          {
            q: "¿Puedo usar fuentes personalizadas?",
            a:
              "Sí, puedes registrar y usar cualquier archivo de fuente TTF u OTF. Soportamos familias tipográficas con múltiples pesos y estilos para un control tipográfico completo."
          },
          {
            q: "¿Qué tal el rendimiento con documentos grandes?",
            a:
              "react-pdf-levelup utiliza renderizado perezoso (lazy rendering) y una gestión eficiente de memoria. Los documentos con cientos de páginas se renderizan de forma fluida sin bloquear el hilo principal."
          },
          {
            q: "¿Es compatible con React Native?",
            a:
              "Actualmente, react-pdf-levelup está diseñado para entornos web (navegadores y Node.js). El soporte para React Native está en nuestra hoja de ruta para futuras versiones."
          },
          {
            q: "¿Cómo manejo datos dinámicos?",
            a:
              "¡Igual que cualquier componente de React! Pasa props a tus componentes de PDF y se volverán a renderizar con los nuevos datos. Puedes usar hooks, context y todos los patrones de React que ya conoces."
          }
        ]
      },
      nav: {
        home: "Inicio",
        why: "Por qué",
        templates: "Plantillas",
        how: "Cómo funciona",
        api: "API",
        roadmap: "Roadmap",
        usecases: "Casos de uso",
        support: "Soporte",
        faq: "FAQ",
        docs: "Documentación"
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
      },
      value: {
        heading: "Why react-pdf-levelup?",
        subheading: "Everything you need to build professional PDF documents with React.",
        features: {
          react: {
            title: "React Native Approach",
            desc:
              "Write PDFs using the patterns you already know: components, props and JSX—no strange new syntax."
          },
          typescript: {
            title: "Full TypeScript",
            desc:
              "Robust type definitions for every component. Catch errors while you code, not in production."
          },
          performance: {
            title: "Optimized Performance",
            desc:
              "Engineered for speed with efficient rendering and a minimal bundle size. Generate documents instantly."
          },
          styling: {
            title: "Flexible Styling",
            desc:
              "Style your PDFs with a CSS-like API. Flexbox, custom fonts, and layouts tailored to your needs."
          }
        }
      },
      templates: {
        badge: "Professional Templates",
        title: "Ready-to-Use Templates",
        desc: "Start with professional templates and customize them to your needs. Optimized layout and modern design.",
        cta_line: "Can't find what you need?",
        cta_link: "Explore more templates"
      },
      how: {
        heading: "How It Works",
        subheading: "From zero to PDF in under 5 minutes",
        steps: {
          s1: {
            title: "Install the library",
            desc: "Add react-pdf-levelup to your project with npm."
          },
          s2: {
            title: "Build your template in the Playground",
            desc:
              "Open /playground and define a React component for your PDF using react-pdf-levelup components (Layout, text, tables, QR, etc.)."
          },
          s3: {
            title: "Generate your PDF (frontend or backend)",
            desc:
              "Use the library where you need it. In the browser you can preview and download; on the server you save the file."
          }
        }
      },
      dev: {
        heading: "Built for Developers",
        subheading:
          "We obsess over the small details so you can focus on coding. Every decision is made for developer experience.",
        features: {
          ts: {
            title: "Full TypeScript support",
            desc:
              "IntelliSense, autocomplete and compile-time safety for all components and props."
          },
          frameworks: {
            title: "Works with Modern Frameworks",
            desc:
              "Seamless integration with Vite, Next.js, Remix and Create React App."
          },
          composable: {
            title: "Composable Components",
            desc:
              "Build complex layouts by combining simple, reusable building blocks."
          },
          plugins: {
            title: "Powerful, Extensible Plugins",
            desc:
              "Add QR codes, charts and more with official plugins like @react-pdf-levelup/qr and @react-pdf-levelup/chart."
          },
          theming: {
            title: "Easy Theming and Customization",
            desc:
              "Override colors, fonts and spacing with a simple theme object or CSS-like syntax."
          },
          scale: {
            title: "Designed to Scale",
            desc:
              "Generate thousands of PDFs efficiently with optimized rendering and caching."
          }
        }
      },
      use: {
        heading: "Designed for every use case",
        subheading:
          "From startups to enterprises, react-pdf-levelup powers PDF generation across industries.",
        cases: {
          business: {
            title: "Business",
            desc:
              "Generate reports, contracts and documentation at scale with consistent branding.",
            examples: ["Financial reports", "Legal documents", "HR contracts"]
          },
          education: {
            title: "Education",
            desc:
              "Create certificates, grades and educational materials programmatically.",
            examples: ["Certificates", "Report cards", "Course materials"]
          },
          ecommerce: {
            title: "E-commerce",
            desc:
              "Automate invoices, shipping labels and order confirmations.",
            examples: ["Invoices", "Receipts", "Shipping labels"]
          },
          saas: {
            title: "SaaS Applications",
            desc:
              "Add PDF export to your web app with minimal effort.",
            examples: ["Data export", "User reports", "Analytics dashboards"]
          }
        }
      },
      api: {
        badge: "Multi-language • HTTP • Self-hosting",
        heading: "REST API that brings React PDF Level Up to any language",
        subheading:
          "Integrate PDF generation with React templates from Node, Python, PHP, C#, Java and more. Send your TSX template in base64 along with JSON data and receive the PDF in base64 ready to save or send.",
        features: {
          anylang: {
            title: "Works with any language",
            desc: "Simple HTTP: use your current stack without major changes."
          },
          instant: {
            title: "Instant integration",
            desc: "POST JSON, base64 response: no extra SDKs."
          },
          hosting: {
            title: "Cloud or Self-hosting",
            desc: "Use the managed endpoint or deploy your own instance."
          },
          secure: {
            title: "Secure and scalable",
            desc: "Deterministic contracts, easy to scale horizontally."
          }
        },
        endpoints: {
          heading: "Endpoints",
          desc: "Start in the cloud or deploy your own instance.",
          copy: "Copy Cloud Endpoint",
          copied: "Copied",
          download_zip: "Download ZIP",
          docs: "Documentation"
        },
        how: {
          heading: "How it works",
          i1: "Write your React (TSX) template and convert it to base64.",
          i2: "Send a POST with JSON: { template, data } to the endpoint.",
          i3: "Receive data.pdf in base64 and decode it to a file.",
          i4: "Save or deliver the PDF according to your use case."
        },
        fonts: {
          heading: "Custom Fonts",
          desc:
            "To ensure correct server-side rendering, fonts must load from absolute remote URLs (https://...). Do not use local paths."
        }
      },
      roadmap: {
        heading: "Roadmap",
        subheading: "All the main features have been implemented.",
        items: {
          core: {
            title: "Core Components",
            desc:
              "Layout, Header, text (H1–H6, P, Strong, Em), lists, QR and columns (Container, Row, Col1–Col12)"
          },
          flex: {
            title: "Flexbox Layout",
            desc: "Full flexbox support for complex layouts"
          },
          fonts: {
            title: "Custom Fonts",
            desc: "Register and use font families with different weights"
          },
          tables: {
            title: "Tables",
            desc: "Thead, Tbody, Tr, Th and Td with automatic pagination"
          },
          charts: {
            title: "Charts and Diagrams",
            desc: "Built-in components for data visualization"
          },
          forms: {
            title: "Form Fields",
            desc: "Interactive PDF inputs and form elements"
          }
        }
      },
      support: {
        community_badge: "Community",
        heading: "Support the Project",
        subheading:
          "Your support helps maintain and improve this free tool for the community",
        support_card: {
          title: "Support & Contact",
          desc:
            "Questions, suggestions or need help? Reach out through any of these channels. I'm here to help.",
          email: "Email",
          whatsapp: "WhatsApp",
          discord: "Discord Server",
          join: "Join the community"
        },
        donations_card: {
          title: "Donations",
          desc:
            "If you find this tool useful and want to support ongoing development, consider donating.",
          helps: "Your donation helps to:",
          lines: [
            "Keep the project free",
            "Add new features",
            "Improve documentation",
            "Provide community support"
          ],
          patreon: "Support on Patreon",
          paypal: "Donate via PayPal",
          thanks: "Every contribution makes a difference ✨"
        },
        thanks_banner: "Thanks for being part of the community! 🙏"
      },
      faq: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know about react-pdf-levelup.",
        items: [
          {
            q: "Is react-pdf-levelup free?",
            a:
              "Yes! react-pdf-levelup is completely free and open source under the MIT license. You can use it in personal and commercial projects without restrictions."
          },
          {
            q: "Does it work with Next.js App Router?",
            a:
              "Absolutely. react-pdf-levelup fully supports Next.js App Router, including server components and server actions. You can generate PDFs on the server and the client."
          },
          {
            q: "Can I use custom fonts?",
            a:
              "Yes, you can register and use any TTF or OTF font file. We support font families with multiple weights and styles for full typographic control."
          },
          {
            q: "How about performance with large documents?",
            a:
              "react-pdf-levelup uses lazy rendering and efficient memory management. Documents with hundreds of pages render smoothly without blocking the main thread."
          },
          {
            q: "Is it compatible with React Native?",
            a:
              "Currently, react-pdf-levelup is designed for web environments (browsers and Node.js). React Native support is on our roadmap for future releases."
          },
          {
            q: "How do I handle dynamic data?",
            a:
              "Just like any React component! Pass props to your PDF components and they will re-render with new data. You can use hooks, context and all the React patterns you already know."
          }
        ]
      },
      nav: {
        home: "Home",
        why: "Why",
        templates: "Templates",
        how: "How it works",
        api: "API",
        roadmap: "Roadmap",
        usecases: "Use cases",
        support: "Support",
        faq: "FAQ",
        docs: "Documentation"
      }
    }
}
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
  resources,
  fallbackLng: "es",
  supportedLngs: ["es", "en"],
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
  detection: {
    // Primero respeta elección previa del usuario; luego navegador; luego html lang
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng",
  },
})

export default i18n

