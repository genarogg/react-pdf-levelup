export const api = {
  es: {
    translation: {
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
      }
    }
  },
  en: {
    translation: {
      api: {
        badge: "Multi-language • HTTP • Self-hosting",
        heading: "REST API that brings React PDF Level Up to any language",
        subheading:
          "Integrate PDF generation with React templates from Node, Python, PHP, C#, Java, and more. Send your TSX template in base64 along with JSON data and receive the PDF in base64 ready to save or send.",
        features: {
          anylang: {
            title: "Works with any language",
            desc: "Simple HTTP: use your current stack without major changes."
          },
          instant: {
            title: "Immediate integration",
            desc: "POST JSON, base64 response: no additional SDKs."
          },
          hosting: {
            title: "Cloud or Self-hosting",
            desc: "Use the managed endpoint or deploy your own instance."
          },
          secure: {
            title: "Secure and scalable",
            desc: "Deterministic contracts, easy to horizontalize."
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
          i1: "Write your React template (TSX) and convert it to base64.",
          i2: "Send a POST with JSON: { template, data } to the endpoint.",
          i3: "Receive data.pdf in base64 and decode it to the file.",
          i4: "Save or deliver the PDF according to your use case."
        },
        fonts: {
          heading: "Custom Fonts",
          desc:
            "To ensure correct rendering on the server, fonts must be loaded from absolute remote URLs (https://...). Do not use local paths."
        }
      }
    }
  }
}