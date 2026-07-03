const Component = () => {

const COLORS = {
  ink: "#1a1a2e",
  slate: "#5c6079",
  muted: "#94a0b8",
  border: "#e6e8f0",
  cardBg: "#ffffff",
  accentPrimary: "#4338ca",
  accentBlue: "#3794ff",
  accentInsta: "#c13584",
  accentFacebook: "#1877f2",
  accentEco: "#16a34a",
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 9,
    color: COLORS.accentPrimary,
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.ink,
    marginTop: 24,
    marginBottom: 4,
  },
  colWrap: {
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 14,
  },
  qrCard: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: 16,
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
  },
  qrFrame: {
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 10,
  },
  qrCaption: {
    fontSize: 8,
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 3,
  },
  headerRule: {
    height: 2,
    backgroundColor: COLORS.ink,
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionRule: {
    height: 3,
    width: 32,
    backgroundColor: COLORS.accentPrimary,
    borderRadius: 3,
    marginBottom: 12,
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

const SectionHeader = ({ title, count }) => (
  <>
    <H3 style={styles.sectionTitle}>
      {title} <Small style={{ color: COLORS.muted }}>· {count} variantes</Small>
    </H3>
    <Div style={styles.sectionRule} />
  </>
)

const QrCard = ({ children, label, caption }) => (
  <Div style={styles.qrCard}>
    <Div style={styles.qrFrame}>{children}</Div>
    <P style={{ fontSize: 11, marginBottom: 0 }}>
      <Strong>{label}</Strong>
    </P>
    <Small style={styles.qrCaption}>{caption}</Small>
  </Div>
)

  return (
    <Layout
      size="A4"
      margin="normal"
      padding={36}
      backgroundColor="#f5f6fa"
      pagination={false}
      meta={{
        title: "QR Code Showcase",
        subject: "Catálogo de variantes de códigos QR",
        language: "es-ES",
      }}
      footer={
        <Div style={styles.footerRow}>
          <Small>Generado con react-pdf-levelup</Small>
        </Div>
      }
    >
      {/* Header */}
      <Small style={styles.eyebrow}>DOCUMENTACIÓN TÉCNICA</Small>
      <H1>QR Code Showcase</H1>
      <P style={styles.subtitle}>
        Catálogo de variantes de códigos QR disponibles en el sistema
      </P>
      <Div style={styles.headerRule} />

      {/* Standard QR */}
      <SectionHeader title="QR Estándar" count={2} />
      <Container>
        <Row>
          <Col6>
            <Div style={styles.colWrap}>
              <QrCard label="Básico" caption="Componente QR sin personalización">
                <QR url="https://example.com" size={120} />
              </QrCard>
            </Div>
          </Col6>
          <Col6>
            <Div style={styles.colWrap}>
              <QrCard label="Coloreado" caption="colorDark personalizado">
                <QR url="https://example.com" size={120} colorDark={COLORS.accentBlue} />
              </QrCard>
            </Div>
          </Col6>
        </Row>
      </Container>

      {/* Styled QR */}
      <SectionHeader title="QR con Estilo Avanzado" count={4} />
      <Container>
        <Row>
          <Col4>
            <Div style={styles.colWrap}>
              <QrCard label="Puntos Redondeados" caption="Estilo minimalista">
                <QRstyle
                  url="https://vercel.com"
                  size={100}
                  dotsOptions={{ type: "rounded", color: "#000000" }}
                  backgroundOptions={{ color: "#ffffff" }}
                  cornersSquareOptions={{ type: "extra-rounded", color: "#000000" }}
                />
              </QrCard>
            </Div>
          </Col4>
          <Col4>
            <Div style={styles.colWrap}>
              <QrCard label="Estilo Instagram" caption="Gradiente de marca">
                <QRstyle
                  url="https://instagram.com"
                  size={100}
                  dotsOptions={{ type: "dots", color: COLORS.accentInsta }}
                  cornersSquareOptions={{ type: "dot", color: "#e1306c" }}
                  cornersDotOptions={{ type: "dot", color: "#f77737" }}
                />
              </QrCard>
            </Div>
          </Col4>
          <Col4>
            <Div style={styles.colWrap}>
              <QrCard label="Con Logo" caption="imageOptions habilitado">
                <QRstyle
                  url="https://facebook.com"
                  size={100}
                  imageOptions={{ imageSize: 0.4, margin: 2 }}
                  dotsOptions={{ type: "classy", color: COLORS.accentFacebook }}
                  cornersSquareOptions={{ type: "extra-rounded", color: COLORS.accentFacebook }}
                />
              </QrCard>
            </Div>
          </Col4>
        </Row>
      </Container>
    </Layout>
  )
}
