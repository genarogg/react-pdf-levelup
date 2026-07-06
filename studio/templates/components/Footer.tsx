import { Div, Small, A } from "@react-pdf-levelup/core"

const COLORS = {
  muted: "#94a0b8",
  accentPrimary: "#4338ca",
}

const footerRow = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const styles = {
  text: { fontSize: 8.5, color: COLORS.muted },
  link: { fontSize: 8.5, color: COLORS.accentPrimary },
}

const Footer = () => {
  return (
    <Div style={footerRow}>
      <Small style={styles.text}>React PDF LevelUp · Proyecto de código abierto</Small>
      <A href="https://react-pdf-levelup.nimbux.cloud" style={styles.link}>
        react-pdf-levelup.nimbux.cloud
      </A>
    </Div>
  )
}

export default Footer
