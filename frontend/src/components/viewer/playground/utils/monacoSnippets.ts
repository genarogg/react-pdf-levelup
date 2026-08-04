import * as monaco from 'monaco-editor';

export const getMonacoSnippets = (kind: monaco.languages.CompletionItemKind, insertTextRules: monaco.languages.CompletionItemInsertTextRule) => {

  const etiqueta = (label: string) => {
    return {
      label,
      insertText: `<${label}>$1</${label}>`,
      kind,
      insertTextRules,
    }
  }

  const etiquetaAvanzada = (label: string, insertText: string) => {
    return {
      label,
      insertText,
      kind,
      insertTextRules,
    }
  }

  const etiquetaConAtributo = (label: string, atributo?: string) => {
    return {
      label,
      insertText: `<${label} ${atributo ? atributo : ""}>$1</${label}>`,
      kind,
      insertTextRules,
    }
  }

  const etiquetaConSalto = (label: string) => {
    return {
      label,
      insertText: `<${label}>\n$1\n</${label}>`,
      kind,
      insertTextRules,
    }
  }

  const etiquetaAutoConclusiva = (label: string, atributo?: string) => {
    return {
      label,
      insertText: `<${label} ${atributo ? atributo : ""}/>`,
      kind,
      insertTextRules,
    }
  }

  // Definir las etiquetas personalizadas para el autocompletado
  const customTags = [
    // Componentes de layout
    {
      label: "Layout",
      insertText: `const MyDocument = () => (\n  <Layout size="A4" orientation="v" pagination={true}>\n\n  </Layout>\n);\n\nexport default MyDocument;`,
      kind,
    },

    // Snippet de componente funcional vacío
    {
      label: "fx",
      insertText: `const \${1:NombreComponent} = () => {\n  return (\n    <>\n      $2\n    </>\n  )\n}\n\nexport default \${1:NombreComponent}`,
      kind,
      insertTextRules,
    },

    // Componentes de texto
    etiqueta("P"),
    etiqueta("H1"),
    etiqueta("H2"),
    etiqueta("H3"),
    etiqueta("H4"),
    etiqueta("H5"),
    etiqueta("H6"),
    etiqueta("Strong"),
    etiqueta("Em"),
    etiqueta("U"),
    etiqueta("Small"),
    etiquetaConAtributo("Mark", 'color="$1"'),
    etiqueta("Span"),
    etiqueta("Div"),


    //Form
    etiquetaConSalto("Form"),
    etiquetaAutoConclusiva("Input", 'label="$1"'),
    etiquetaAutoConclusiva("TextArea", 'label="$1"'),
    etiquetaAutoConclusiva("Checkbox", 'label="$1"'),

    // Componentes de columnas
    // etiquetaConSalto("Container"),
    etiquetaConSalto("Row"),
    etiquetaConSalto("Col1"),
    etiquetaConSalto("Col2"),
    etiquetaConSalto("Col3"),
    etiquetaConSalto("Col4"),
    etiquetaConSalto("Col5"),
    etiquetaConSalto("Col6"),
    etiquetaConSalto("Col7"),
    etiquetaConSalto("Col8"),
    etiquetaConSalto("Col9"),
    etiquetaConSalto("Col10"),
    etiquetaConSalto("Col11"),
    etiquetaConSalto("Col12"),

    // Componentes de posicionamiento
    etiquetaConSalto("Left"),
    etiquetaConSalto("Right"),
    etiquetaConSalto("Center"),

    //header y footer

    etiquetaConSalto("ImgBg"),

    etiquetaAutoConclusiva("NextPage"),
    etiquetaAutoConclusiva("Pass"),

    etiquetaAutoConclusiva("BR"),
    etiquetaAutoConclusiva("HR", "style={{ borderTop: '1px solid #000' }}"),
    etiquetaAutoConclusiva("Img", 'src="$1"'),
    etiquetaAutoConclusiva("Icon", 'ico="$1"'),

    etiquetaConAtributo("A", 'href="$1"'),

    // extens
    etiquetaConAtributo("Badge", 'variant="$1"'),
    etiquetaAutoConclusiva("Divider", 'label="$1" variant="dashed" color="#6366f1"'),
    etiquetaAutoConclusiva("Button", 'label="$1" variant="dashed" color="#6366f1"'),


    // Componentes de tabla
    etiquetaAvanzada("Table", "<Table>\n  <Thead>\n    <Tr>\n      <Th>$1</Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td></Td>\n    </Tr>\n  </Tbody>\n</Table>"),

    // container
    etiquetaAvanzada("Container", "<Container>\n <Row>\n <Col6>\n  $1\n</Col6>\n<Col6>\n  \n</Col6> \n</Row> \n</Container>"),

    etiquetaConSalto("Thead"),
    etiquetaConSalto("Tbody"),
    etiquetaConSalto("Tr"),
    etiquetaConSalto("Th"),
    etiquetaConSalto("Td"),

    // Componentes de lista
    etiquetaAvanzada("UL", "<UL>\n<LI>$1</LI>\n</UL>"),
    etiquetaAvanzada("OL", "<OL>\n<LI>$1</LI>\n</OL>"),

    etiquetaConSalto("LI"),
    // Otros componentes

    etiquetaConAtributo("Blockquote", 'color="$1"'),

    etiquetaAvanzada("QR", `\n        <QR \n          url="https://example.com" \n          size={150} \n          colorDark="#3794ff" \n          colorLight="#ffffff"\n           logoWidth={30}\n    logoHeight={30}\n          margin={0}\n          errorCorrectionLevel="H"\n        />`),

    etiquetaAvanzada("QRstyle", `\n        <QRstyle\n          url="https://example.com"\n          size={300}\n          colorDark="#3794ff"\n          colorLight="#ffffff"\n                    dotsOptions={{ color: "#3794ff", type: "rounded" }}\n          backgroundOptions={{ color: "#ffffff" }}\n          imageOptions={{ margin: 0, imageSize: 0.4 }}\n          cornersSquareOptions={{ type: "extra-rounded", color: "#3794ff" }}\n          cornersDotOptions={{ type: "dot", color: "#3794ff" }}\n          margin={0}\n          errorCorrectionLevel="H"\n        />`),
    
    etiquetaAvanzada("Graph", `\n        <Graph \n          variant="bar" \n          width={500} \n          height={300} \n          title="Ventas por región (2026)" \n          subtitle="En miles de pesos" \n          showValues \n          yTickCount={4} \n          series={[ \n            { \n              name: "Primer semestre", \n              data: [ \n                { label: "Norte", value: 120 }, \n                { label: "Centro", value: 85 }, \n                { label: "Sur", value: 150 }, \n                { label: "Este", value: 95 }, \n              ], \n            }, \n            { \n              name: "Segundo semestre", \n              color: "#16a34a", \n              data: [ \n                { label: "Norte", value: 140 }, \n                { label: "Centro", value: 110 }, \n                { label: "Sur", value: 165 }, \n                { label: "Este", value: 120, color: "#dc2626" }, \n              ], \n            }, \n          ]}\n        />`),
  ];

  return customTags;
};