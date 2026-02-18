import React from 'react'
import {
  A,
  BR,
  Center,
  Col6,
  Container,
  Div,
  Em,
  Font,
  H1,
  H4,
  Img,
  Layout,
  P,
  Right,
  Row,
  Strong,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@react-pdf-levelup/core";

const Component = ({ data }: any) => {
  console.log("data PDF: ", data)
  getFuentes()
  return (
    <FathonLayout>
      <Header />
      <Title />
      <Menu />
      <BR />
      <FathonTablet />
      <FathonFooter />
    </FathonLayout>
  )
}

const FathonLayout = ({ children }: any) => {
  return (
    <Layout
      pagination={false}
      padding={60}
      backgroundImage={"https://genarogg.github.io/media/react-pdf-levelup/fathon/factura-bg.jpg"}
      style={{
        border: "1px",
        fontFamily: "Nunito",
        color: "#fff"
      }}
    >


      {children}
    </Layout>
  )
}

const Header = () => {
  return (
    <Container>
      <Row>
        <Col6>
          <Img src="https://genarogg.github.io/media/react-pdf-levelup/fathon/logo.png" style={{ width: "120px" }} />
        </Col6>
        <Col6>
          <Right>
            <Div style={{
              border: "2px solid #8075ff",
              borderRadius: "20px",
              padding: "8px",
              width: "200px"
            }}>
              <Center>
                <A href="https://example.app" style={{ color: "white" }}>
                  <Em>example.app</Em>
                </A>
              </Center>
            </Div>
          </Right>
        </Col6>
      </Row>
    </Container>
  )
}

const Title = () => {
  return (
    <Center>
      <H1 style={{ fontFamily: "Audiowide", fontSize: "84px" }}>Invoice</H1>
    </Center>
  )
}

const Menu = () => {
  return (
    <Container style={{ marginBottom: "30px" }}>
      <Row>
        <Col6>
          <Strong>BILLED TO:</Strong>
          <Strong>Oscar Herron</Strong>
          <Strong>965 Farm Road</Strong>
          <Strong>404-218-5023</Strong>
        </Col6>
        <Col6>
          <Right>
            <Strong>Invoice No. 24</Strong>
            <Strong>21/07/2024</Strong>
          </Right>
        </Col6>
      </Row>
    </Container>
  )
}

const FathonTablet = () => {
  const tableData = [
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
    { description: "Lorem ipsum", price: "10$", tax: "10$", total: "20$" },
  ];

  const summaryRow = {
    price: "80$",
    tax: "80$",
    total: "160$",
  };

  return (
    <Center style={{ marginBottom: "20px" }}>
      <Table
        borderColor="#8075ff"
        textColor="#fff"
        zebraColor="#200d53"
        style={{
          backgroundColor: "#1b0b47",
          color: "#fff",
          fontFamily: "Nunito",
        }}
      >
        <Thead textAlign="center" style={{ backgroundColor: "#200d53" }}>
          <Tr>
            <Th style={{ width: "100%" }}>DESCRIPTION</Th>
            <Th style={{ width: "100px" }}>PRICE</Th>
            <Th style={{ width: "100px" }}>TAX</Th>
            <Th style={{ width: "100px" }}>TOTAL</Th>
          </Tr>
        </Thead>

        <Tbody>
          {tableData.map((row, index) => (
            <Tr key={index}>
              <Td style={{ width: "100%" }}>{row.description}</Td>
              <Td textAlign="right" style={{ width: "100px" }}>
                {row.price}
              </Td>
              <Td textAlign="right" style={{ width: "100px" }}>
                {row.tax}
              </Td>
              <Td textAlign="right" style={{ width: "100px" }}>
                {row.total}
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td style={{ width: "100%", fontWeight: "bold" }}>
              TOTAL
            </Td>
            <Td textAlign="right" style={{ width: "100px", fontWeight: "bold" }}>
              {summaryRow.price}
            </Td>
            <Td textAlign="right" style={{ width: "100px", fontWeight: "bold" }}>
              {summaryRow.tax}
            </Td>
            <Td textAlign="right" style={{ width: "100px", fontWeight: "bold" }}>
              {summaryRow.total}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Center>
  );
};

const FathonFooter = () => {
  return (
    <Center style={{ marginTop: 40 }}>
      <H4>TERMS & CONDITIONS</H4>
      <P style={{ maxWidth: 300 }}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh Lorem ipsum dolor sit amet
      </P>
    </Center>
  )
}

const getFuentes = () => {
  Font.register({
    family: "Nunito",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKof4Mg.ttf",
        fontWeight: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofAjsOkZg.ttf",
        fontWeight: "bold",
      },
      {
        src: "https://fonts.gstatic.com/s/nunito/v12/XRXX3I6Li01BKofIMOaE.ttf",
        fontStyle: "italic",
        fontWeight: "normal",
      }
    ],
  });

  Font.register({
    family: "Audiowide",
    fonts: [
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/audiowide/Audiowide-Regular.ttf",
        fontWeight: "normal"
      }
    ]
  });
}

export default Component;
