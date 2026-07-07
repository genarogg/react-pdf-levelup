import { Div, P, H3, Small, Strong, Row, Col4, Col6 } from "@react-pdf-levelup/core"

const COLORS = {
  ink: "#1a1a2e",
  slate: "#5c6079",
  muted: "#94a0b8",
  border: "#e6e8f0",
  cardBg: "#ffffff",
  accentPrimary: "#4338ca",
}

const card = {
  backgroundColor: COLORS.cardBg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: 16,
}

const colWrap = { paddingLeft: 7, paddingRight: 7, marginBottom: 14 }

const sectionRule = {
  height: 3,
  width: 32,
  backgroundColor: COLORS.accentPrimary,
  borderRadius: 3,
  marginBottom: 12,
}

const codeBlock = {
  backgroundColor: "#1a1a2e",
  borderRadius: 8,
  padding: 12,
  marginBottom: 24,
}

const styles = {
  intro: {
    fontSize: 11,
    color: COLORS.slate,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  sectionHeader: { marginBottom: 4 },
  cardTitle: { fontSize: 11.5, color: COLORS.ink, marginBottom: 4 },
  cardBody: { fontSize: 9.5, color: COLORS.slate, lineHeight: 1.5 },
  stepNumber: {
    fontSize: 9,
    color: COLORS.accentPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  code: {
    fontSize: 9,
    color: "#e6e8f0",
  },
}

const Main = () => {
  return (
    <Div>
      <P style={styles.intro}>
        <Strong>React PDF LevelUp</Strong> es una librería de código abierto para generar
        documentos PDF usando componentes de React. Ideal para facturas, certificados,
        reportes y etiquetas: escribes tu documento como escribirías cualquier interfaz,
        y obtienes un PDF listo para producción con preview en vivo mientras lo desarrollas.
      </P>

      <Div style={codeBlock}>
        <Small style={styles.code}>npm install @react-pdf-levelup/core</Small>
      </Div>

      {/* Sección: por qué usarlo */}
      <Div style={styles.sectionHeader}>
        <H3>Por qué usarlo</H3>
        <Div style={sectionRule} />
      </Div>

      <Row>
        <Col4>
          <Div style={colWrap}>
            <Div style={card}>
              <Small style={styles.stepNumber}>DECLARATIVO</Small>
              <P style={styles.cardTitle}><Strong>Componentes, no dibujo manual</Strong></P>
              <Small style={styles.cardBody}>
                Construye documentos con Layout, Div, Row/Col y un sistema de tipografía
                familiar para cualquier developer de React.
              </Small>
            </Div>
          </Div>
        </Col4>

        <Col4>
          <Div style={colWrap}>
            <Div style={card}>
              <Small style={styles.stepNumber}>REUTILIZABLE</Small>
              <P style={styles.cardTitle}><Strong>Piezas que se comparten</Strong></P>
              <Small style={styles.cardBody}>
                Header, Main y Footer son componentes normales: se importan, se
                componen y se reutilizan entre proyectos.
              </Small>
            </Div>
          </Div>
        </Col4>

        <Col4>
          <Div style={colWrap}>
            <Div style={card}>
              <Small style={styles.stepNumber}>LIVE PREVIEW</Small>
              <P style={styles.cardTitle}><Strong>Ves lo que generas</Strong></P>
              <Small style={styles.cardBody}>
                Itera sobre el diseño del PDF con retroalimentación inmediata, sin
                exportar en cada cambio.
              </Small>
            </Div>
          </Div>
        </Col4>
      </Row>

      {/* Sección: casos de uso */}
      <Div style={{ ...styles.sectionHeader, marginTop: 10 }}>
        <H3>Casos de uso</H3>
        <Div style={sectionRule} />
      </Div>

      <Row>
        <Col6>
          <Div style={colWrap}>
            <Div style={card}>
              <P style={styles.cardTitle}><Strong>Facturas y reportes</Strong></P>
              <Small style={styles.cardBody}>
                Genera documentos de negocio con datos dinámicos, tablas y totales
                calculados directamente desde tus componentes.
              </Small>
            </Div>
          </Div>
        </Col6>

        <Col6>
          <Div style={colWrap}>
            <Div style={card}>
              <P style={styles.cardTitle}><Strong>Certificados y etiquetas</Strong></P>
              <Small style={styles.cardBody}>
                Diseña plantillas visuales con QR, firmas y variantes que se adaptan
                a cada destinatario.
              </Small>
            </Div>
          </Div>
        </Col6>
      </Row>
    </Div>
  )
}

export default Main
