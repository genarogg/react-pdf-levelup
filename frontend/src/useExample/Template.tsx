import React from 'react'
import { P, Layout, HR, Strong, H4, Em, QR } from 'react-pdf-levelup'

const Component = () => {
  return (
    <Layout>
      <H4>Documento de Presentación</H4>
      <P>
        Bienvenido a <Strong style={{ color: "#3d65fd" }}>react-pdf-levelup</Strong>.
        Con esta librería puedes construir PDFs usando componentes de
        React de forma <Em>rápida</Em> y <Em>tipada</Em>.
      </P>
      <HR />
      <P>
        Gracias por usar <Strong>react-pdf-levelup</Strong>.
        Explora el Playground y crea tu propio template.
      </P>
      <QR value="https://react-pdf-levelup.nimbux.cloud" size={120} />
    </Layout>
  )
}

export default Component
