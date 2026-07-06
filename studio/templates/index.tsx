import { Layout, Div, Font } from "@react-pdf-levelup/core"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

import CourierPrimeBold from "./asset/fonts/CourierPrime-Bold.ttf"
import CourierPrimeRegular from "./asset/fonts/CourierPrime-Regular.ttf"

const Index = () => {

  Font.register({
    family: "Courier Prime",
    fonts: [
      {
        src: CourierPrimeRegular,
        fontWeight: "normal",
      },
      {
        src: CourierPrimeBold,
        fontWeight: "bold",
      },
    ],
  });

  const COLORS = {
    pageBg: "#f5f6fa",
  }

  const page = {
    backgroundColor: COLORS.pageBg,
    padding: 36,
  }

  return (
    <Layout style={page} footer={<Footer />} pagination={false}>
      <Div>
        <Header />
        <Main />
      </Div>
    </Layout>
  )
}

export default Index
