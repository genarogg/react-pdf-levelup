import React from 'react'

const CertificadoTemplate = () => {
  // Datos de ejemplo
  const certificadoData = {
    titulo: "CERTIFICADO DE PARTICIPACIÓN",
    nombre: "Juan Carlos Pérez Rodríguez",
    evento: "Taller de Desarrollo Web con React",
    fecha: "15 de marzo de 2024",
    horas: "40",
    firma: {
      nombre: "Dra. María González",
      cargo: "Directora Ejecutiva"
    },
    codigo: "CERT-2024-0123"
  };

  return (
    <LayoutPDF size="A4" orientation="landscape" padding={30} showPageNumbers={true}>
      {/* Borde decorativo */}
      <View style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        right: 20, 
        bottom: 20, 
        borderWidth: 5, 
        borderColor: '#003366', 
        borderStyle: 'double',
        padding: 15
      }}>
        {/* Contenido del certificado */}
        <View style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20
        }}>
          {/* Encabezado */}
          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <Image src="/placeholder.svg" style={{ width: 120, marginBottom: 20 }} />
            <Text style={{ fontSize: 10, color: '#666', marginBottom: 5 }}>FUNDACIÓN PARA EL DESARROLLO</Text>
          </View>
          
          {/* Título */}
          <View style={{ marginBottom: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 10, textAlign: 'center' }}>
              {certificadoData.titulo}
            </Text>
            <View style={{ width: 100, height: 2, backgroundColor: '#003366', marginBottom: 10 }} />
          </View>
          
          {/* Cuerpo */}
          <View style={{ marginBottom: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, marginBottom: 20, textAlign: 'center' }}>
              Se otorga el presente certificado a:
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#003366' }}>
              {certificadoData.nombre}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 10, textAlign: 'center', maxWidth: 500 }}>
              Por su destacada participación en el evento <Strong>{certificadoData.evento}</Strong>, 
              realizado el {certificadoData.fecha}, con una duración de {certificadoData.horas} horas académicas.
            </Text>
          </View>
          
          {/* Firmas */}
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <View style={{ width: 200, borderTop: '1px solid #000', paddingTop: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                {certificadoData.firma.nombre}
              </Text>
              <Text style={{ fontSize: 10, textAlign: 'center' }}>
                {certificadoData.firma.cargo}
              </Text>
            </View>
          </View>
          
          {/* Pie */}
          <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={{ fontSize: 8, color: '#666' }}>
              Código de verificación: {certificadoData.codigo}
            </Text>
            <QR 
              value={`https://verificar.org/cert/${certificadoData.codigo}`} 
              size={60} 
              colorDark="#003366"
            />
          </View>
        </View>
      </View>
    </LayoutPDF>
  );
};

// Asignar el componente a result
result = CertificadoTemplate;

