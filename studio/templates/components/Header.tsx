import { Div, Small, H1, P, Center, Img } from "@react-pdf-levelup/core"
import logo from "../asset/imgs/logo.png"

const COLORS = {
  ink: "#1a1a2e",
  slate: "#5c6079",
  accentPrimary: "#4338ca",
}

const styles = {
  wrap: { marginBottom: 24 },
  logoRow: { display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 14 },
  eyebrow: {
    fontSize: 9,
    color: COLORS.accentPrimary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { textAlign: "center", marginBottom: 6 },
  subtitle: {
    fontSize: 10.5,
    color: COLORS.slate,
    textAlign: "center",
  },
}

const Header = () => {
  return (
    <Div style={styles.wrap}>
      <Div style={styles.logoRow}>
        <Img src={logo} style={{ width: 72, height: 72 }} />
      </Div>

      <Center>
        <Small style={styles.eyebrow}>OPEN SOURCE · REACT PDF LEVELUP</Small>
      </Center>

      <H1 style={styles.title}>Crea PDFs con componentes de React</H1>

      <P style={styles.subtitle}>
        La forma moderna de generar documentos PDF: reutilizable, declarativa y con
        preview en vivo
      </P>
    </Div>
  )
}

export default Header
