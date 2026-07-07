import { Layout, Div, Font } from "@react-pdf-levelup/core"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"
import getFuentes from "./getFuentes"

const Index = () => {

  getFuentes()

  const COLORS = {
    pageBg: "#f5f6fa",
  }

  const page = {
    backgroundColor: COLORS.pageBg,
    padding: 36,
    fontFamily: "Nunito",
  }

  return (
    <Layout style={page} footer={<Footer />} pagination={false}>
      <Div>
        <Header />
        <Main />
        <P>hola</P>
      </Div>
    </Layout>
  )
}

export default Index
