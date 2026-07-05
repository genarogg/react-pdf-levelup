import React from "react";
import { 
      Defs,
      Document,
      LinearGradient,
      Page,
      Rect,
      Stop,
      StyleSheet,
      Svg
    } from "@react-pdf-levelup/core";



const styles = StyleSheet.create({
  page: {
    position: 'relative',
    fontFamily: 'Helvetica',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
  },
});

const GradientPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
 
      <Svg style={styles.gradientBackground} viewBox="0 0 595 842">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6366f1" stopOpacity={1} />
            <Stop offset="0.5" stopColor="#8b5cf6" stopOpacity={1} />
            <Stop offset="1" stopColor="#ec4899" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="595" height="842" fill="url(#grad)" />
      </Svg>

    
    </Page>
  </Document>
);

export default GradientPDF;