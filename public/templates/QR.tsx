
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  qrItem: {
    width: "30%",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  qrLabel: {
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
})

// Componente principal sin datos de reporte
const Component = () => {
  return (
    <LayoutPDF size="A4" padding={10} showPageNumbers={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Catálogo de Códigos QR</Text>
        <View style={styles.grid}>
          {/* Primera fila */}
          <View style={styles.qrItem}>
            <QR
              url="https://example.com"
              size={150} colorData="#3794ff"
              logo="https://genarogg.github.io/media/genarogg/favicon.png"
              dotType="extra-rounded" 
              cornerSquareType="extra-rounded"
              cornerDotType="dot"
              cornerSquareColor="#3794ff"
              cornerDotColor="#e13e83"
            />
            <P>example logo</P>
          </View>
          <View style={styles.qrItem}>
            <QR
              url="https://vercel.com"
              size={150}
              colorData="#000000"
              colorDataBG="#ffffff"
              dotType="square"
              cornerSquareType="square"
              cornerDotType="square"
              logo="https://assets.vercel.com/image/upload/v1607554385/repositories/vercel/logo.png"
            />
            <Text style={styles.qrLabel}>Vercel con Logo</Text>
          </View>
            <View style={styles.qrItem}>
            <QR
              url="https://vercel.com"
              size={150}
              colorData="#000000"
              colorDataBG="#ffffff"
              dotType="classy"
              cornerSquareType="square"
              cornerDotType="square"

              textColor="#000000"
              textBackgroundColor="#ffffff"
              fontSize={24}
              textBold={true}
            />
            <Text style={styles.qrLabel}>simple QR</Text>
          </View>
         {/* Segunda fila */}
          <View style={styles.qrItem}>
            <QR
              url="https://example.com"
              size={150} 
              colorData="#28a745"
              fontSize={14}
              moveText={-25}
              logoText="GENAROGG"
              colortText="#fff"
              dotType="extra-rounded" 
              cornerSquareType="extra-rounded"
              cornerDotType="dot"
              cornerSquareColor="#28a745"
              cornerDotColor="#e13e83"
            />
            <P>example logo (texto)</P>
          </View>
  
          

          <View style={styles.qrItem}>
            <QR
              url="https://instagram.com"
              size={150}
           
              colorDataBG="#ffffff"
              dotType="dots"
              cornerSquareType="dot"
              cornerSquareColor="#E1306C"
              cornerDotType="dot"
              cornerDotColor="#F77737"
              logo="/logo-instagram.png"
              logoBG="transparent"
            />
            <Text style={styles.qrLabel}>Instagram con Logo</Text>
          </View>

        
 
          <View style={styles.qrItem}>
            <QR
              url="https://facebook.com"
              size={150}
              colorData="#1877f2"
              colorDataBG="#ffffff"
              dotType="rounded"
              cornerSquareType="extra-rounded"
              cornerDotType="dot"
              logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
            />
            <Text style={styles.qrLabel}>Facebook con Logo</Text>
          </View>

          <View style={styles.qrItem}>
            <QR
              url="https://facebook.com"
              size={150}
              colorData="#1877F2"
              colorDataBG="#ffffff"
              dotType="rounded"
              cornerSquareType="extra-rounded"
              cornerDotType="dot"
              logoText="FB"
              textColor="#ffffff"
              textBackgroundColor="#1877F2"
              fontSize={24}
              textBold={true}
            />
            <Text style={styles.qrLabel}>Facebook con Texto</Text>
          </View>

          <View style={styles.qrItem}>
            <QR
              url="https://instagram.com"
              size={150}
              colorData="#C13584"
              colorDataBG="#ffffff"
              dotType="dots"
              cornerSquareType="dot"
              cornerSquareColor="#E1306C"
              cornerDotType="dot"
              cornerDotColor="#F77737"
              logoText="IG"
              textColor="#ffffff"
              textBackgroundColor="#C13584"
              fontSize={24}
              textBold={true}
            />
            <Text style={styles.qrLabel}>Instagram con Texto</Text>
          </View>

          {/* Tercera fila */}
          <View style={styles.qrItem}>
            <QR
              url="https://example.com/wave-pattern"
              size={150}
              colorData="#4a5568"
              colorDataBG="#ffffff"
              dotType="dots"
              cornerSquareType="square"
              cornerSquareColor="#0d9488"
              cornerDotType="dot"
              cornerDotColor="#0d9488"
            />
            <Text style={styles.qrLabel}>Patrón de Ondas</Text>
          </View>

          <View style={styles.qrItem}>
            <QR
              url="https://example.com/eco"
              size={150}
              colorData="#16a34a"
              colorDataBG="#f0fdf4"
              dotType="classy-rounded"
              cornerSquareType="extra-rounded"
              cornerSquareColor="#15803d"
              logoText="ECO"
              textColor="#ffffff"
              textBackgroundColor="#16a34a"
              fontSize={18}
              textBold={true}
            />
            <Text style={styles.qrLabel}>Eco</Text>
          </View>

          <View style={styles.qrItem}>
            <QR
              url="https://example.com/corporate"
              size={150}
              colorData="#1e3a8a"
              colorDataBG="#ffffff"
              dotType="square"
              cornerSquareType="square"
              cornerDotType="square"
              logoText="CORP"
              textColor="#1e3a8a"
              textBackgroundColor="#ffffff"
              fontSize={16}
              textBold={true}
            />
            <Text style={styles.qrLabel}>Corporativo</Text>
          </View>
               <View style={styles.qrItem}>
            <QR
              url="https://example.com/corporate"
              size={150}
              colorData="#1e3a8a"
              colorDataBG="#ffffff"
              dotType="square"
              cornerSquareType="square"
              cornerDotType="square"
              logoText="CORP"
              textColor="#1e3a8a"
              textBackgroundColor="#ffffff"
              fontSize={16}
              textBold={true}
            />
            <Text style={styles.qrLabel}>Corporativo</Text>
          </View>
        </View>
      </View>
    </LayoutPDF>
  )
}

