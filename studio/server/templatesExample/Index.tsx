import { Layout } from "@react-pdf-levelup/core"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

const Index = () => {
  return (
    <Layout>
      <Header />
      <Main />
      <Footer />
    </Layout>
  )
}

export default Index