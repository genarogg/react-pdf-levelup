export const faq = {
  es: {
    translation: {
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
      }
    }
  },
  en: {
    translation: {
      faq: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know about react-pdf-levelup.",
        items: [
          {
            q: "Is react-pdf-levelup free?",
            a:
              "Yes! react-pdf-levelup is completely free and open source under the MIT license. You can use it in personal and commercial projects without any restrictions."
          },
          {
            q: "Does it work with Next.js App Router?",
            a:
              "Absolutely. react-pdf-levelup is fully compatible with the Next.js App Router, including server components and server actions. You can generate PDFs on both the server and the client."
          },
          {
            q: "Can I use custom fonts?",
            a:
              "Yes, you can register and use any TTF or OTF font file. We support font families with multiple weights and styles for complete typographic control."
          },
          {
            q: "What about performance with large documents?",
            a:
              "react-pdf-levelup uses lazy rendering and efficient memory management. Documents with hundreds of pages render smoothly without blocking the main thread."
          },
          {
            q: "Is it compatible with React Native?",
            a:
              "Currently, react-pdf-levelup is designed for web environments (browsers and Node.js). Support for React Native is on our roadmap for future versions."
          },
          {
            q: "How do I handle dynamic data?",
            a:
              "Just like any React component! Pass props to your PDF components and they will re-render with the new data. You can use hooks, context, and all the React patterns you already know."
          }
        ]
      }
    }
  }
}