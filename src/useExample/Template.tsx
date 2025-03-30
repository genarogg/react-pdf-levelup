import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
                <Text>Hola, {data.nombre || "Usuario"}</Text>
            </View>
        </Page>
    </Document>
);

export default Demo;