import React from "react";
import {
  A,
  BR,
  Badge,
  Blockquote,
  Button,
  Center,
  Checkbox,
  Col6,
  Container,
  Div,
  Divider,
  Em,
  Font,
  Form,
  Gradiant,
  Graph,
  H1,
  H2,
  H3,
  H4,
  H5,
  HR,
  Img,
  Input,
  LI,
  Layout,
  Left,
  Mark,
  NextPage,
  OL,
  P,
  Right,
  Row,
  Small,
  Span,
  Strong,
  Table,
  Tbody,
  Td,
  Text,
  TextArea,
  Th,
  Thead,
  Tr,
  U,
  UL,
  View
} from "@react-pdf-levelup/core";
import {
  QR,
  QRstyle
} from "@react-pdf-levelup/qr";
import {
  ChartJS
} from "@react-pdf-levelup/chart";
import {
  Icon
} from "@react-pdf-levelup/icons";
import {
  CodeBar
} from "@react-pdf-levelup/codebar";




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
}

const DefaultTemplate = ({ data }: any) => {
  getFuentes();

  const Texto = () => {
    return (
      <>
        <H5>Lorem Ipsum</H5>
        <H4>Lorem Ipsum</H4>
        <H3>Lorem Ipsum</H3>
        <H2>Lorem Ipsum</H2>
        <H1>Lorem Ipsum </H1>

        <Div>
          <H3>Div</H3>
        </Div>

        <P style={{ textDecoration: "lineThrough" }}>
          Lorem Ipsum is simply dummy <Mark color="#f3f">Lorem Ipsum</Mark>text
          of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since 1966, when designers at
          Letraset and James Mosley, the librarian at St Bride Printing Library

        </P>

        <Strong>Lorem Ipsum</Strong>
        <Mark color="#f3f">Lorem Ipsum</Mark>
        <U>Lorem Ipsum</U>
        <BR />

        <A href="https://example.com">example link</A>
        <Small>Lorem Ipsum</Small>
        <Span>Lorem Ipsum</Span>
        <Em>Lorem Ipsum</Em>

        <BR />
        <Blockquote color="red">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since 1966, when designers at Letraset and James Mosley, the librarian
          at St Bride Printing Library in London, took a 1914 Cicero translation

        </Blockquote>
        <BR />
        <HR style={{ borderTop: "2px solid rgba(44, 100, 253, 1)" }} />
      </>
    );
  };

  const Tabla = () => {
    return (
      <Table>
        <Thead textColor="#282828">
          <Tr>
            <Th style={{ backgroundColor: "#14b8a6", width: "100%" }}>
              DOCUMENTO
            </Th>
            <Th style={{ backgroundColor: "#14b8a6", width: 150 }}>TIPO</Th>
            <Th style={{ backgroundColor: "#14b8a6", width: 120 }}>CANTIDAD</Th>
            <Th style={{ backgroundColor: "#14b8a6", width: 120 }}>COSTO</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td style={{ width: "100%" }}>Java</Td>
            <Td style={{ width: 150 }}>Simple</Td>
            <Td style={{ width: 120 }}>5</Td>
            <Td style={{ width: 120 }}>100</Td>
          </Tr>
          <Tr>
            <Td style={{ width: "100%" }}>JavaScript</Td>
            <Td style={{ width: 150 }}>Seguridad</Td>
            <Td style={{ width: 120 }}>6</Td>
            <Td style={{ width: 120 }}>100</Td>
          </Tr>
          <Tr>
            <Td style={{ width: "100%" }}>Python</Td>
            <Td style={{ width: 150 }}>Simple</Td>
            <Td style={{ width: 120 }}>7</Td>
            <Td style={{ width: 120 }}>100</Td>
          </Tr>
          <Tr>
            <Td style={{ width: "100%" }}>
              <Strong>Total</Strong>
            </Td>
            <Td style={{ width: 150 }}></Td>
            <Td style={{ width: 120, backgroundColor: "#14b8a6" }}>
              <Strong>300</Strong>
            </Td>
            <Td style={{ width: 120, backgroundColor: "#14b8a6" }}>
              <Strong>400</Strong>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    );
  };
  const Formulario = () => {
    return (
      <>
        <Form borderColor="#ffa9a9ff" borderRadius={10}>
          <Input
            label="Nombre Completo"
            placeholder="Introduce tu nombre"
            required
            width="50%"
          />
          <TextArea label="Comentarios" height={100} />

          <Checkbox label="Acepto los términos y condiciones" />
        </Form>
      </>
    );
  };

  const Positions = () => {
    return (
      <>
        <Div>
          <Left>
            <P>Left</P>
          </Left>
          <Center>
            <P>Center</P>
          </Center>
          <Right>
            <P>Right</P>
          </Right>
        </Div>

        <Container>
          <Row>
            <Col6 style={{ backgroundColor: "#3b82f6" }}>
              <Div style={{ height: 20 }}></Div>
            </Col6>
            <Col6 style={{ backgroundColor: "#ec4899" }}>
              <Div style={{ height: 20 }}></Div>
            </Col6>
          </Row>
        </Container>
        <BR />
      </>
    );
  };

  const Grafico = () => {
    return (
      <Graph
        variant="bar"
        width={500}
        height={300}
        title="Ventas por región (2026)"
        subtitle="En miles de pesos"
        showValues
        yTickCount={4}
        series={[
          {
            name: "Primer semestre",
            data: [
              { label: "Norte", value: 120 },
              { label: "Centro", value: 85 },
              { label: "Sur", value: 150 },
              { label: "Este", value: 95 },
            ],
          },
          {
            name: "Segundo semestre",
            color: "#16a34a",
            data: [
              { label: "Norte", value: 140 },
              { label: "Centro", value: 110 },
              { label: "Sur", value: 165 },
              { label: "Este", value: 120, color: "#dc2626" },
            ],
          },
        ]}
      />
    );
  };

  const Lista = () => {
    return (
      <>
        <UL>
          <LI>lista</LI>
          <LI>lista</LI>
        </UL>

        <OL>
          <LI>Item</LI>
          <LI>Item</LI>
        </OL>
      </>
    );
  };

  const Badges = () => {
    return (
      <>
        <Div style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="active">Activo</Badge>
          <Badge variant="pending">Pendiente</Badge>
          <Badge variant="cancelled">Cancelado</Badge>
          <Badge variant="success">Éxito</Badge>
          <Badge variant="warning">Advertencia</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Div>
        <BR />
      </>
    );
  };

  const Gradiante = () => {
    return (
      <Gradiant colors={["#FF6B6B", "#4ECDC4"]} height={100}>
        <Text style={{ color: "white" }}>Hola Mundo</Text>
      </Gradiant>
    )
  }

  const Pluguins = () => {

    const QRS = () => {
      return (
        <Container>
          <Row>
            <Col6>
              <QR
                url="https://react-pdf-levelup.com"
                size={100}
                colorDark="#1a202c"
                colorLight="#f7fafc"
              />
            </Col6>
            <Col6>
              <QRstyle
                url="https://example.com"
                size={100}
                dotsOptions={{ color: "#579cfcff", type: "rounded" }}
                backgroundOptions={{ color: "#ffffff" }}

              />
            </Col6>
          </Row>
        </Container>
      )
    }

    const chartConfig: any = {
      type: "bar",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Ingresos",
            data: [4200, 5100, 4800, 6300, 7100, 6900, 8200],
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: { legend: { display: true } },
      },
    }

    return (
      <>

        <QRS />
        <BR />
        <ChartJS data={chartConfig} width={500} height={300} />
        <BR />
        <Text>Ejemplo CodeBar (CODE128):</Text>
        <CodeBar value="1234567890128" format="CODE128" width={250} height={100} />
        <BR />
        <Text>Demo Iconos:</Text>
        <BR />


        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon ico="Home" />
          <Icon ico="Send" />
          <Icon ico="Flame" />
          <Icon ico="Moon" />
          <Icon ico="Landmark" />
        </View>
      </>
    )
  }

  return (
    <Layout style={{ fontFamily: "Nunito" }}>

      <Img src="https://react-pdf-levelup.nimbux.cloud/iconos/favicon-192x192.png" width={70} />
      <Texto />
      <Lista />
      <Tabla />
      <NextPage />
      <Positions />
      <Formulario />
      <Grafico />

      <NextPage />

      <Button variant="success" width={200}>
        Guardar Cambios
      </Button>
      <BR />
      <Badges />
      <Button
        variant="primary"
        style={{ marginTop: 10, marginBottom: 10, borderRadius: 12 }}
        width={300}
      >
        Con margen y borderRadius
      </Button>
      <Gradiante />
      <Divider label="Línea continua" variant="line" />
      <Divider label="Discontinua" variant="dashed" color="#6366f1" />
      <Divider label="Punteada" variant="dotted" color="#f59e0b" />


      <NextPage />
      {/**   */}
      <Pluguins />

    </Layout>
  );
};

export default DefaultTemplate;
