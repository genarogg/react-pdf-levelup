"use client"

import React from "react"
import { useState } from "react"
import { HelpCircle, X, Copy, Check } from "lucide-react"

interface QuickHelpProps {
  inline?: boolean
}

const QuickHelp: React.FC<QuickHelpProps> = ({ inline = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("layout")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const toggleHelp = () => {
    setIsOpen(!isOpen)
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand("copy")
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 1500)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  const componentDocs = {
    layout: [
      {
        name: "Layout",
        description: "Componente principal para configurar el documento PDF",
        props: [
          {
            name: "size",
            type: "string",
            default: "A4",
            description: "Tamaño de la página (A0-A9, Letter, Legal, Tabloid)",
          },
          {
            name: "orientation",
            type: "string",
            default: "vertical",
            description: "Orientación de la página (vertical, horizontal)",
          },
          { name: "backgroundColor", type: "string", default: "white", description: "Color de fondo de la página" },
          {
            name: "padding",
            type: "number",
            default: "30",
            description: "Padding interno de la página en puntos (solo si margen=normal)",
          },
          {
            name: "margen",
            type: "string",
            default: "normal",
            description: "Tipo de margen (apa, normal, estrecho, ancho)",
          },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales para la página" },
          { name: "footer", type: "ReactNode", default: "", description: "Contenido del pie de página" },
          { name: "lines", type: "number", default: "1", description: "Número de líneas para el pie de página (1-10)" },
          { name: "pagination", type: "boolean", default: "true", description: "Mostrar numeración de páginas" },
          {
            name: "rule",
            type: "boolean",
            default: "false",
            description: "Mostrar rejilla de referencia en la página",
          },
        ],
        example: `<Layout pagination rule footer={<P>Pie de página</P>} lines={2}>
  <H1>Título</H1>
  <P>Contenido de ejemplo</P>
</Layout>`,
      },
      {
        name: "Container",
        description: "Contenedor principal con padding horizontal",
        props: [
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales para el contenedor" },
        ],
        example: `<Container>
  <Row>
    <Col6><P>Columna 1</P></Col6>
    <Col6><P>Columna 2</P></Col6>
  </Row>
</Container>`,
      },
      {
        name: "Row",
        description: "Fila para el sistema de grid",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la fila" }],
        example: `<Row>
  <Col4><P>A</P></Col4>
  <Col4><P>B</P></Col4>
  <Col4><P>C</P></Col4>
</Row>`,
      },
      {
        name: "Col1-Col12",
        description: "Columnas para el sistema de grid (de 1 a 12 unidades)",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la columna" }],
        example: `<Col12><P>Contenido a ancho completo</P></Col12>`,
      },
      {
        name: "Div",
        description: "Contenedor genérico para agrupar elementos",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Div style={{ padding: 10 }}>
  <P>Bloque con padding</P>
</Div>`,
      },
    ],
    text: [
      {
        name: "P, H1-H6",
        description: "Componentes de texto (párrafo, encabezados)",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para el texto" }],
        example: `<H1>Título</H1>
<H3>Subtítulo</H3>
<P>Parrafo</P>`,
      },
      {
        name: "Strong, Em, U, Small",
        description: "Componentes de formato de texto",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<P><Strong>Negrita</Strong>, <Em>Cursiva</Em>, <U>Subrayado</U>, <Small>Pequeño</Small></P>`,
      },
      {
        name: "Blockquote",
        description: "Bloque de cita",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Blockquote>Una cita destacada</Blockquote>`,
      },
      {
        name: "Mark",
        description: "Texto resaltado",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Mark>Texto resaltado</Mark>`,
      },
      {
        name: "Span",
        description: "Contenedor de texto inline",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Span>Inline</Span>`,
      },
      {
        name: "BR",
        description: "Salto de línea",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<P>Linea 1</P>
<BR />
<P>Linea 2</P>`,
      },
      {
        name: "HR",
        description: "Línea horizontal divisoria",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<HR />`,
      },
      {
        name: "A",
        description: "Enlace",
        props: [
          { name: "href", type: "string", default: "", description: "URL del enlace" },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        ],
        example: `<A href="https://example.com">Ir al sitio</A>`,
      },
    ],
    table: [
      {
        name: "Table (Tablet)",
        description: "Tabla completa",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la tabla" }],
        example: `<Table>
  <Thead>
    <Tr>
      <Th>Col A</Th>
      <Th textAlign="right">Col B</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>1</Td>
      <Td>2</Td>
    </Tr>
    <Tr>
      <Td>3</Td>
      <Td>4</Td>
    </Tr>
  </Tbody>
</Table>`,
      },
      {
        name: "Thead",
        description: "Encabezado de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Thead><Tr><Th>Columna</Th></Tr></Thead>`,
      },
      {
        name: "Tbody",
        description: "Cuerpo de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Tbody><Tr><Td>Dato</Td></Tr></Tbody>`,
      },
      {
        name: "Tr",
        description: "Fila de tabla",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
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
          {
            name: "textAlign",
            type: "string",
            default: "left",
            description: "Alineación del texto (left, center, right)",
          },
        ],
        example: `<Th textAlign="center">Encabezado</Th>`,
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
          {
            name: "textAlign",
            type: "string",
            default: "left",
            description: "Alineación del texto (left, center, right)",
          },
        ],
        example: `<Td textAlign="right">Dato</Td>`,
      },
    ],
    position: [
      {
        name: "Left",
        description: "Alinea el contenido a la izquierda",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Left><P>Texto a la izquierda</P></Left>`,
      },
      {
        name: "Right",
        description: "Alinea el contenido a la derecha",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Right><P>Texto a la derecha</P></Right>`,
      },
      {
        name: "Center",
        description: "Centra el contenido",
        props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
        example: `<Center><P>Texto centrado</P></Center>`,
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
        example: `<UL type="square">
  <LI>Elemento</LI>
  <LI>Elemento</LI>
</UL>`,
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
        example: `<OL type="upper-roman" start={3}>
  <LI>Item</LI>
  <LI>Item</LI>
</OL>`,
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
        example: `<LI value={10}>Valor específico</LI>`,
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
        example: `<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />`,
      },
      {
        name: "ImgBg",
        description: "Imagen de fondo con contenido superpuesto",
        props: [
          { name: "src", type: "string", default: "", description: "URL de la imagen de fondo" },
          { name: "width", type: "number|string", default: "100%", description: "Ancho del fondo" },
          { name: "height", type: "number|string", default: "100%", description: "Alto del fondo" },
          { name: "opacity", type: "number", default: "0.2", description: "Opacidad del fondo (0-1)" },
          {
            name: "objectFit",
            type: "string",
            default: "cover",
            description: "Ajuste de la imagen (cover, contain, fill, none, scale-down)",
          },
          { name: "objectPosition", type: "string", default: "center", description: "Posición de la imagen" },
          { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        ],
        example: `<ImgBg src="https://picsum.photos/600/400" opacity={0.3}>
  <P>Texto sobre imagen de fondo</P>
</ImgBg>`,
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
        example: `<QR value="https://example.com" size={150} colorDark="#000" colorLight="#fff" logo="https://picsum.photos/80" logoWidth={30} logoHeight={30} />`,
      },
      {
        name: "QRV2",
        description: "Código QR estilizado (qr-code-styling) con soporte de imagen central",
        props: [
          { name: "value", type: "string", default: "", description: "Texto o URL para el código QR" },
          { name: "size", type: "number", default: "300", description: "Tamaño del QR" },
          { name: "image", type: "string", default: "", description: "URL del logo central" },
          { name: "dotsOptions", type: "object", default: "{}", description: "Opciones de puntos (color, tipo)" },
          {
            name: "backgroundOptions",
            type: "object",
            default: "{ color: #ffffff }",
            description: "Opciones de fondo",
          },
          {
            name: "imageOptions",
            type: "object",
            default: "{ margin: 0, imageSize: 0.4 }",
            description: "Opciones de imagen central",
          },
          {
            name: "cornersSquareOptions",
            type: "object",
            default: "{}",
            description: "Opciones de esquinas cuadradas",
          },
          { name: "cornersDotOptions", type: "object", default: "{}", description: "Opciones de esquinas en punto" },
          { name: "colorDark", type: "string", default: "", description: "Color de puntos (fallback)" },
          { name: "colorLight", type: "string", default: "", description: "Color de fondo (fallback)" },
          { name: "margin", type: "number", default: "0", description: "Margen (fallback)" },
          {
            name: "errorCorrectionLevel",
            type: "string",
            default: "M",
            description: "Corrección de errores (fallback L, M, Q, H)",
          },
          { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        ],
        example: `<QRV2
  value="https://example.com"
  size={300}
  image="https://picsum.photos/80"
  dotsOptions={{ color: "#1f2937", type: "rounded" }}
  backgroundOptions={{ color: "#ffffff" }}
  imageOptions={{ margin: 0, imageSize: 0.35 }}
  cornersSquareOptions={{ type: "extra-rounded", color: "#1f2937" }}
  cornersDotOptions={{ type: "dot", color: "#1f2937" }}
/>`,
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
        example: `<Header fixed>Encabezado</Header>`,
      },
      {
        name: "Pie de página (Layout.footer)",
        description: "Contenido del pie de página en Layout",
        props: [
          { name: "footer", type: "ReactNode", default: "", description: "Contenido del pie de página" },
          { name: "lines", type: "number", default: "1", description: "Número de líneas reservadas" },
        ],
        example: `<Layout footer={<P>Pie</P>} lines={2}>
  <P>Contenido</P>
</Layout>`,
      },
    ],
    fonts: [
      {
        name: "Fuentes por defecto",
        description: "Fuentes disponibles sin registro previo.",
        props: [],
        example: `// Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic`,
      },
      {
        name: "Font.register",
        description: "Registra fuentes personalizadas. IMPORTANTE: Deben ser URLs remotas (https://) para asegurar la generación correcta en todos los entornos.",
        props: [
          { name: "family", type: "string", default: "", description: "Nombre de la familia de la fuente" },
          { name: "fonts", type: "object[]", default: "[]", description: "Array de fuentes con src y propiedades" },
        ],
        example: `Font.register({
  family: "Lobster",
  fonts: [
    {
      src: "https://genarogg.github.io/react-pdf-levelup/public/font/Lobster-Regular.ttf",
      fontWeight: "normal",
    },
  ],
});`,
      },
    ],
  }

  // @ts-ignore
  const activeDocs = componentDocs[activeTab]

  return (
    <div className={inline ? "relative z-10" : "fixed bottom-6 left-1/2 -translate-x-1/2 z-50"}>
      {/* Botón de ayuda con estilo del header */}
      <button
        className="flex items-center gap-2 px-3.5 py-2 text-base font-medium text-gray-300 hover:text-white from-gray-800/80 to-gray-900/80 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        onClick={toggleHelp}
      >
        {isOpen ? <X size={16} /> : <HelpCircle size={16} />}
      
      </button>

      {/* Panel de ayuda */}
      {isOpen && (
        <div className={inline ? "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[900px] max-h-[650px] overflow-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm" : "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[900px] max-h-[650px] overflow-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm"}>
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 via-gray-700/10 to-gray-800/5 rounded-xl pointer-events-none" />

          <div className="relative p-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent mb-4">
              Component Documentation
            </h3>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-gray-800/50">
              {["layout", "text", "table", "position", "lists", "media", "page", "fonts"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Contenido de tabs */}
            <div className="space-y-4">
              {activeDocs.map((component: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-lg"
                >
                  <h4 className="text-base font-semibold text-gray-200 mb-1">{component.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{component.description}</p>

                  {/* Tabla de props */}
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Prop</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Type</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Default</th>
                          <th className="text-left py-1.5 px-2 text-gray-400 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {component.props.map((prop: any, propIndex: number) => (
                          <tr key={propIndex} className="border-b border-gray-800/30 last:border-0">
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-gray-300 rounded text-[12px]">
                                {prop.name}
                              </code>
                            </td>
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-emerald-400/80 rounded text-[12px]">
                                {prop.type}
                              </code>
                            </td>
                            <td className="py-1.5 px-2">
                              <code className="px-1.5 py-0.5 bg-gray-800/50 text-amber-400/80 rounded text-[12px]">
                                {prop.default || "-"}
                              </code>
                            </td>
                            <td className="py-1.5 px-2 text-gray-400">{prop.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Ejemplo de código */}
                  {component.example && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="text-sm font-medium text-gray-400">Ejemplo</h5>
                        <button
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 text-gray-200 transition-colors"
                          onClick={() => handleCopy(component.example, index)}
                        >
                          {copiedIndex === index ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedIndex === index ? "Copiado" : "Copiar"}</span>
                        </button>
                      </div>
                      <pre className="p-3 bg-black/50 border border-gray-800/50 rounded-md overflow-x-auto">
                        <code className="text-[12px] text-gray-300 font-mono leading-relaxed">{component.example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea de gradiente inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
      )}
    </div>
  )
}

export default QuickHelp
