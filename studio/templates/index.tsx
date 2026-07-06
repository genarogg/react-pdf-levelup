import { Layout, Div } from "@react-pdf-levelup/core"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

const COLORS = {
  pageBg: "#f5f6fa",
}

const page = {
  backgroundColor: COLORS.pageBg,
  padding: 36,
}

const Index = () => {
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
