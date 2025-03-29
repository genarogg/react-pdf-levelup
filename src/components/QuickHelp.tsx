

import  React from "react"
import { useState } from "react"

const QuickHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("layout")

  const toggleHelp = () => {
    setIsOpen(!isOpen)
  }

  const componentDocs = {
    layout: [
      {
        name: "LayoutPDF",
        description: "Componente principal para configurar el documento PDF",
        props: [
          { name: "size", type: "string", default: "A4", description: "Tamaño de la página (A4, Letter, Legal, etc.)" },
          {
            name: "orientation",
            type: "string",
            default: "portrait",
            description: "Orientación de la página (portrait, landscape)",
          },
          { name: "padding", type: "number", default: "30", description: "Padding interno de la página en píxeles" },
          { name: "backgroundColor", type: "string", default: "white", description: "Color de fondo de la página" },
          { name: "showPageNumbers", type: "boolean", default: "true", description: "Mostrar números de página" },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales para la página" },
        ],
      },
      {
        name: "Container",
        description: "Contenedor principal con padding horizontal",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales para el contenedor" },
        ],
      },
      {
        name: "Row",
        description: "Fila para el sistema de grid",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la fila" }],
      },
      {
        name: "Col1-Col12",
        description: "Columnas para el sistema de grid (de 1 a 12 unidades)",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la columna" }],
      },
    ],
    text: [
      {
        name: "P, H1-H6",
        description: "Componentes de texto (párrafo, encabezados)",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para el texto" }],
      },
      {
        name: "Strong, Em, U, Small",
        description: "Componentes de formato de texto",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Blockquote",
        description: "Bloque de cita",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Mark",
        description: "Texto resaltado",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Span",
        description: "Contenedor de texto inline",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "BR",
        description: "Salto de línea",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "A",
        description: "Enlace",
        props: [
          { name: "href", type: "string", default: "", description: "URL del enlace" },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        ],
      },
    ],
    table: [
      {
        name: "Table",
        description: "Tabla completa",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la tabla" }],
      },
      {
        name: "Thead",
        description: "Encabezado de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Tbody",
        description: "Cuerpo de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Tr",
        description: "Fila de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Th",
        description: "Celda de encabezado",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          { name: "width", type: "string|number", default: "", description: "Ancho de la celda" },
          { name: "height", type: "string|number", default: "", description: "Alto de la celda" },
          {
            name: "cellSize",
            type: "string",
            default: "medium",
            description: "Tamaño predefinido (small, medium, large)",
          },
          { name: "colSpan", type: "number", default: "", description: "Número de columnas que ocupa" },
        ],
      },
      {
        name: "Td",
        description: "Celda de datos",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          { name: "width", type: "string|number", default: "", description: "Ancho de la celda" },
          { name: "height", type: "string|number", default: "", description: "Alto de la celda" },
          {
            name: "cellSize",
            type: "string",
            default: "medium",
            description: "Tamaño predefinido (small, medium, large)",
          },
          { name: "colSpan", type: "number", default: "", description: "Número de columnas que ocupa" },
        ],
      },
    ],
    position: [
      {
        name: "Left",
        description: "Alinea el contenido a la izquierda",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Right",
        description: "Alinea el contenido a la derecha",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
      {
        name: "Center",
        description: "Centra el contenido",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      },
    ],
    lists: [
      {
        name: "UL",
        description: "Lista desordenada",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          { name: "type", type: "string", default: "disc", description: "Tipo de viñeta (disc, circle, square)" },
        ],
      },
      {
        name: "OL",
        description: "Lista ordenada",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          {
            name: "type",
            type: "string",
            default: "decimal",
            description: "Tipo de numeración (decimal, lower-alpha, upper-alpha, lower-roman, upper-roman)",
          },
          { name: "start", type: "number", default: "1", description: "Número inicial de la lista" },
        ],
      },
      {
        name: "LI",
        description: "Elemento de lista",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          {
            name: "value",
            type: "number|string",
            default: "",
            description: "Valor específico para este elemento (solo para OL)",
          },
        ],
      },
    ],
    media: [
      {
        name: "Img",
        description: "Imagen",
        props: [
          { name: "src", type: "string", default: "", description: "URL de la imagen" },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        ],
      },
      {
        name: "QR",
        description: "Código QR",
        props: [
          { name: "value", type: "string", default: "", description: "Texto o URL para el código QR" },
          { name: "size", type: "number", default: "150", description: "Tamaño en píxeles" },
          { name: "colorDark", type: "string", default: "#000000", description: "Color de los puntos" },
          { name: "colorLight", type: "string", default: "#ffffff", description: "Color de fondo" },
          { name: "margin", type: "number", default: "0", description: "Margen alrededor del QR" },
          {
            name: "errorCorrectionLevel",
            type: "string",
            default: "M",
            description: "Nivel de corrección (L, M, Q, H)",
          },
          { name: "logo", type: "string", default: "", description: "URL de la imagen del logo" },
          { name: "logoWidth", type: "number", default: "30", description: "Ancho del logo en píxeles" },
          { name: "logoHeight", type: "number", default: "30", description: "Alto del logo en píxeles" },
        ],
      },
    ],
    page: [
      {
        name: "Header",
        description: "Encabezado de página",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        ],
      },
      {
        name: "Footer",
        description: "Pie de página",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
          { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        ],
      },
    ],
  }

  return (
    <div className="quick-help-container">
      <button className="help-button" onClick={toggleHelp}>
        {isOpen ? "Cerrar Ayuda" : "Ayuda Rápida"}
      </button>

      {isOpen && (
        <div className="help-panel">
          <h3>Documentación de Componentes</h3>

          <div className="component-tabs">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === "layout" ? "active" : ""}`}
                onClick={() => setActiveTab("layout")}
              >
                Layout
              </button>
              <button
                className={`tab-button ${activeTab === "text" ? "active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                Texto
              </button>
              <button
                className={`tab-button ${activeTab === "table" ? "active" : ""}`}
                onClick={() => setActiveTab("table")}
              >
                Tablas
              </button>
              <button
                className={`tab-button ${activeTab === "position" ? "active" : ""}`}
                onClick={() => setActiveTab("position")}
              >
                Posición
              </button>
              <button
                className={`tab-button ${activeTab === "lists" ? "active" : ""}`}
                onClick={() => setActiveTab("lists")}
              >
                Listas
              </button>
              <button
                className={`tab-button ${activeTab === "media" ? "active" : ""}`}
                onClick={() => setActiveTab("media")}
              >
                Media
              </button>
              <button
                className={`tab-button ${activeTab === "page" ? "active" : ""}`}
                onClick={() => setActiveTab("page")}
              >
                Página
              </button>
            </div>

            <div className="tab-content">
              {componentDocs[activeTab].map((component, index) => (
                <div key={index} className="component-doc">
                  <h4>{component.name}</h4>
                  <p className="component-description">{component.description}</p>

                  <table className="props-table">
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Tipo</th>
                        <th>Default</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {component.props.map((prop, propIndex) => (
                        <tr key={propIndex}>
                          <td>
                            <code>{prop.name}</code>
                          </td>
                          <td>
                            <code>{prop.type}</code>
                          </td>
                          <td>
                            <code>{prop.default}</code>
                          </td>
                          <td>{prop.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickHelp

