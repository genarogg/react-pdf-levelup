import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import Header from "./Header";
import Content from "./Content";

const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#ffffff" },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <Content />
    </Page>
  </Document>
);

export default MyDocument;