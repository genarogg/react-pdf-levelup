import React from "react";
import {
    Center,
    Col6,
    Container,
    Div,
    Divider,
    Font,
    Gradiant,
    H3,
    H6,
    Layout,
    Left,
    P,
    Row,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@react-pdf-levelup/core";

const getFuentes = () => {
    Font.register({
        family: "Megrim",
        fonts: [
            {
                src: "https://raw.githubusercontent.com/google/fonts/main/ofl/megrim/Megrim.ttf",
                fontWeight: "normal",
            },
        ],
    });

    Font.register({
        family: "Poppins",
        fonts: [
            {
                src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
                fontWeight: "normal",
            },
            {
                src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
                fontWeight: "bold",
            },
            {
                src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Italic.ttf",
                fontStyle: "italic",
                fontWeight: "normal",
            },
        ],
    });
};

const GradiantComponents = () => {
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const SIZE_CIRCLE = 320

    return (
        <Div style={{ position: 'absolute', top: 0, left: 0 }}>
            <Gradiant
                type="linear"
                angle={0}
                colors={['#000000', '#104860']}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                style={{}}
            />
            <Gradiant
                type="radial"
                shape="circle"
                colors={[
                    { color: '#104860', offset: '0%' },
                    { color: '#104860', offset: '99%%' },
                    { color: '#ffffff', offset: '100%' },
                ]}
                width={SIZE_CIRCLE}
                height={SIZE_CIRCLE}
                style={{
                    position: 'absolute',
                    top: (PAGE_HEIGHT / 2 - (SIZE_CIRCLE / 2)) + 60,
                    left: PAGE_WIDTH / 2 - (SIZE_CIRCLE / 2),
                    opacity: 0.2
                }}
            />
        </Div>
    )
}


const TableComponents = () => {

    const items = [
        { description: 'Meeting', price: '$59.50', total: '$59.50' },
        { description: 'Research', price: '$225.50', total: '$225.50' },
        { description: 'Lunch', price: '$42.00', total: '$42.00' },
        { description: 'Office Supplies', price: '$18.99', total: '$18.99' },
    ];

    return (
        <Center style={{ marginTop: 80 }}>
            <Div style={{ maxWidth: 300 }}>
                <Table
                    cellHeight={30}
                    grid="not-grid"
                    borderColor="rgba(255, 255, 255, 1)"
                    textColor="#ffffff"
                    headerBackground="transparent"
                    zebraColor="transparent"
                >
                    <Thead style={{ borderBottom: "1px solid #fff" }}>
                        <Tr style={{ border: "0" }}>
                            <Th style={{ fontWeight: 'bold', fontSize: 12 }}>DESCRIPTION</Th>
                            <Th textAlign="right" style={{ fontWeight: 'bold', fontSize: 12 }}>PRICE</Th>
                            <Th textAlign="right" style={{ fontWeight: 'bold', fontSize: 12 }}>TOTAL</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {items.map((item) => (
                            <Tr key={item.description}>
                                <Td style={{ fontSize: 11 }}>{item.description}</Td>
                                <Td textAlign="right" style={{ fontWeight: 'bold', fontSize: 10 }}>{item.price}</Td>
                                <Td textAlign="right" style={{ fontWeight: 'bold', fontSize: 10 }}>{item.total}</Td>
                            </Tr>
                        ))}
                        <Tr style={{ borderTop: "1px solid #fff" }}>
                            <Td style={{ borderTopWidth: 0 }}><></></Td>
                            <Td textAlign="right" style={{ fontWeight: 'bold', fontSize: 11 }}>TOTAL</Td>
                            <Td textAlign="right" style={{ fontWeight: 'bold', fontSize: 11 }}>$345.99</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Div>
        </Center>
    )
}

const InvoiceBackground = () => {
    getFuentes()

    return (
        <Layout
            size="A4"
            margin="normal"
            padding={0}
            style={{ padding: 0, fontFamily: "Poppins", color: "#fff" }}
            meta={{ title: 'Invoice Background', language: 'es-ES' }}
            pagination={false}
        >
            <GradiantComponents />

            <Div style={{ padding: "50", position: "relative" }}>
                <Center>
                    <H3 style={{ fontFamily: "Megrim", fontSize: 128, marginBottom: 0 }}>
                        INVOICE
                    </H3>
                    <P style={{ bottom: 10 }}>no. invoice: 012345</P>

                    <Container style={{ marginTop: 40, padding: "0 34", fontSize: 8 }} >
                        <Row>
                            <Col6>
                                <Left>
                                    <H6>Billed To:</H6>
                                    <P>Aaron Loeb  |  +123-456-7890  |  123 Any City</P>
                                </Left>
                            </Col6>
                            <Col6>
                                <Left>
                                    <H6>Billed To:</H6>
                                    <P>Aaron Loeb  |  +123-456-7890  |  123 Any City</P>
                                </Left>
                            </Col6>
                        </Row>
                        <TableComponents />
                    </Container>
                    <H3 style={{ marginTop: 60, fontFamily: "Megrim", fontSize: 53.6 }}>thank you</H3>
                    <Center>

                        <Divider label="react-pdf-leveup.com" width={300} fontSize={10} style={{ top: -20 }} />
                    </Center>
                </Center>
            </Div>
        </Layout>
    )
};

export default InvoiceBackground;