const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    borderBottom: "1px solid #adadadff",
    paddingBottom: 5,
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-between",
  },
  qrItem: {
    width: "30%",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  qrLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    color: "#555",
  },
})

const Component = () => {
  return (
    <Layout size="A4" showPageNumbers={true} style={{
      paddingBottom:0,
      paddingTop:0,
      backgroundColor:"#34296a",
        color: "#ffffffff",
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>QR Code Showcase</Text>
        
        <Text style={styles.sectionTitle}>Standard QR (QR Component)</Text>
        <View style={styles.grid}>
           <View style={styles.qrItem}>
             <QR 
               value="https://example.com" 
               size={120} 
             /> 
             <Text style={styles.qrLabel}>Basic QR</Text> 
           </View>
           <View style={styles.qrItem}>
             <QR 
               value="https://example.com" 
               size={120} 
               colorDark="#3794ff"
             /> 
             <Text style={styles.qrLabel}>Colored QR</Text> 
           </View>
        </View>

        <Text style={styles.sectionTitle}>Styled QR (QRstyle Component)</Text>
        <View style={styles.grid}>
           <View style={styles.qrItem}>
             <QRstyle 
               value="https://vercel.com" 
               size={120} 
               dotsOptions={{
                 type: "rounded",
                 color: "#000000"
               }}
               backgroundOptions={{
                 color: "#ffffff"
               }}
               cornersSquareOptions={{
                 type: "extra-rounded",
                 color: "#000000"
               }}
             /> 
             <Text style={styles.qrLabel}>Rounded Dots</Text> 
           </View>

           <View style={styles.qrItem}>
             <QRstyle 
               value="https://instagram.com" 
               size={120} 
               dotsOptions={{
                 type: "dots",
                 color: "#C13584"
               }}
               cornersSquareOptions={{
                 type: "dot",
                 color: "#E1306C"
               }}
               cornersDotOptions={{
                 type: "dot",
                 color: "#F77737"
               }}
             /> 
             <Text style={styles.qrLabel}>Instagram Style</Text> 
           </View>
           
           <View style={styles.qrItem}>
             <QRstyle 
               value="https://facebook.com" 
               size={120} 
               image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
               imageOptions={{
                 imageSize: 0.4,
                 margin: 2
               }}
               dotsOptions={{
                 type: "classy",
                 color: "#1877f2"
               }}
               cornersSquareOptions={{
                 type: "extra-rounded",
                 color: "#1877f2"
               }}
             /> 
             <Text style={styles.qrLabel}>With Logo</Text> 
           </View>

           <View style={styles.qrItem}>
             <QRstyle 
               value="https://example.com/eco" 
               size={120} 
               dotsOptions={{
                 type: "classy-rounded",
                 color: "#16a34a"
               }}
               cornersSquareOptions={{
                 type: "extra-rounded",
                 color: "#15803d"
               }}
             /> 
             <Text style={styles.qrLabel}>Eco Friendly</Text> 
           </View>
        </View>
      </View>
    </Layout>
  )
}