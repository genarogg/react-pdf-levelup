import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { QR, QRV2 } from "src/components/core";

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

        <QR
          value="https://example.co"
          size={150}
          logo="https://genarogg.github.io/media/genarogg/favicon.png"


        />

        <QRV2
          value="https://www.facebook.com/"
          size={300}
          dotsOptions={{
            color: "#4267b2",
            type: "rounded"
          }}
          backgroundOptions={{
            color: "#e9ebee"
          }}
          
        />
        <Text>Hola, {data.nombre || "Usuario"}</Text>
      </View>
    </Page>
  </Document>
);

export default Demo;