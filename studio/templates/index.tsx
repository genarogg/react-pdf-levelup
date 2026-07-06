import { Layout, Img } from "@react-pdf-levelup/core"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

import img from "./img.jpg"


const Index = () => {
  return (
    <Layout>
      <Img src={img} />
      <Header />
      <Main />
      <Footer />
    </Layout>
  )
}

export default Index