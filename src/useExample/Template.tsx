import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { QRAVANZADO, QR } from "src/components/core";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
});

const Demo = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                {/* <QR
                    value="https://example.co"
                    size={150} 
                    logo="https://genarogg.github.io/media/genarogg/favicon.png"
                   
                   
                /> */}
                <QRAVANZADO
                    url="https://example.co"
                    size={150} colorData="#3794ff"
                    logo="https://genarogg.github.io/media/genarogg/favicon.png"
                    dotType="extra-rounded"
                    cornerSquareType="extra-rounded"
                    cornerDotType="dot"
                    cornerSquareColor="#3794ff"
                    cornerDotColor="#e13e83"
                />
                <Text>Hola, {data.nombre || "Usuario"}</Text>
            </View>
        </Page>
    </Document>
);

export default Demo;