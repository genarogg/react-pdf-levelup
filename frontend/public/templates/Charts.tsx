const Component = () => {

  const COLORS = {
  ink: "#1a1a2e",
  slate: "#5c6079",
  muted: "#94a0b8",
  border: "#e6e8f0",
  cardBg: "#ffffff",
  pageBg: "#f5f6fa",
  accentPrimary: "#4338ca",
}

const CHART_PALETTE = ["#4338ca", "#3794ff", "#22c1a6", "#f59e0b"]

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: COLORS.pageBg,
  },
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
    marginBottom: 16,
  },
  headerRule: {
    height: 2,
    backgroundColor: COLORS.ink,
    borderRadius: 2,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: 20,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    color: COLORS.ink,
  },
  cardMeta: {
    fontSize: 8,
    color: COLORS.muted,
  },
  chartWrap: {
    display: "flex",
    alignItems: "center",
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTop: `1px solid ${COLORS.border}`,
  },
})


  const data = {
    type: "bar",
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril"],
      datasets: [
        {
          label: "Ventas",
          data: [50, 75, 40, 90],
          backgroundColor: CHART_PALETTE,
          borderRadius: 4,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: COLORS.slate,
            font: { size: 11 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: COLORS.slate },
          grid: { display: false },
        },
        y: {
          ticks: { color: COLORS.slate },
          grid: { color: COLORS.border },
        },
      },
    },
  }

  return (
    <Layout size="A4" backgroundColor={COLORS.pageBg} padding={36}>
      <Small style={styles.eyebrow}>REPORTE DE DESEMPEÑO</Small>
      <H1>Charts con ChartJS</H1>
      <P style={styles.subtitle}>
        Comparativo de ventas mensuales del primer cuatrimestre
      </P>
      <Div style={styles.headerRule} />

      <Div style={styles.card}>
        <Div style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            <Strong>Ventas por mes</Strong>
          </Text>
          <Small style={styles.cardMeta}>Ene – Abr 2026</Small>
        </Div>

        <Div style={styles.chartWrap}>
          <ChartJS
            data={data}
            width={500}
            height={300}
            backgroundColor={COLORS.cardBg}
            devicePixelRatio={2}
          />
        </Div>

        <Div style={styles.footerRow}>
          <Small>Fuente: sistema interno de ventas</Small>
          <Small>Generado con react-pdf-levelup</Small>
        </Div>
      </Div>
    </Layout>
  )
}

export default Component