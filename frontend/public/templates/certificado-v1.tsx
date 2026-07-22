import React from "react";
import {
  Center,
  Circle,
  Div,
  ImgBg,
  Layout,
  P,
  Path,
  Svg
} from "@react-pdf-levelup/core";

const COLORS = {
  wine: "#8e1f4f",
  wineDark: "#6e1740",
  ink: "#3a1024",
  muted: "#9a5c78",
  pageBg: "#ffffff",
  lineGray: "#cfc3ca",
};

const LogoMark = ({ type }) => {
  const stroke = COLORS.wine;
  const common = { stroke, strokeWidth: 2.4, fill: "none" };
  return (
    <Svg viewBox="0 0 40 40" style={{ width: 34, height: 34 }}>
      <Circle cx="20" cy="20" r="18" stroke={stroke} strokeWidth="1.4" fill="none" />
      {type === "weave" && (
        <>
          <Path d="M10 14 Q20 14 20 20 Q20 26 10 26" {...common} />
          <Path d="M30 14 Q20 14 20 20 Q20 26 30 26" {...common} />
          <Path d="M10 14 Q10 20 16 20 Q10 20 10 26" {...common} />
          <Path d="M30 14 Q30 20 24 20 Q30 20 30 26" {...common} />
        </>
      )}
      {type === "spiral" && (
        <Path
          d="M20 10 C26 10 30 14 30 19 C30 24 26 27 22 27 C19 27 16 25 16 22 C16 19.5 18 18 20 18 C21.5 18 22.5 19 22.5 20.3"
          {...common}
        />
      )}
      {type === "cross" && (
        <>
          <Path d="M20 10 L30 20 L20 30 L10 20 Z" {...common} />
          <Path d="M14 14 L26 26 M26 14 L14 26" {...common} />
        </>
      )}
      {type === "half" && (
        <>
          <Path d="M20 8 A12 12 0 0 1 20 32 Z" fill={stroke} />
          <Path d="M8 20 L32 20 M20 8 L20 32" stroke={stroke} strokeWidth="1.2" />
        </>
      )}
    </Svg>
  );
};

const orgLine = { height: 1, width: 190, backgroundColor: COLORS.lineGray };

const Logos = ({ data }: any) => {
  return (

    <Center>
      <Div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 46,
          marginBottom: 42,
        }}
      >
        {data.organizaciones.map((org, i) => (
          <Div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LogoMark type={org.tipo} />
            <Div>
              {org.nombre.split("\n").map((line, j) => (
                <P
                  key={j}
                  style={{
                    fontSize: 9.5,
                    fontFamily: "Helvetica-Bold",
                    color: COLORS.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {line}
                </P>
              ))}
            </Div>
          </Div>
        ))}
      </Div>

    </Center>
  )
}

const Title = ({ data }: any) => {
  return (
    <Center style={{ marginTop: 20 }}>
      <P
        style={{
          fontSize: 11,
          letterSpacing: 1.5,
          color: COLORS.wine,
          fontFamily: "Helvetica-Bold",
          marginBottom: 6,
        }}
      >
        OTORGAN LA PRESENTE
      </P>
      <P
        style={{
          fontSize: 46,
          letterSpacing: 8,
          color: COLORS.wineDark,
          fontFamily: "Times-Roman",
          marginBottom: 26,
        }}
      >
        CONSTANCIA
      </P>
    </Center>
  )
}

const Recipient = ({ data }: any) => {
  return (
    <Center>
      <Div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <P
          style={{
            fontSize: 24,
            color: COLORS.wineDark,
            fontFamily: "Times-Bold",
          }}
        >
          {data.destinatario}
        </P>
      </Div>

      <P
        style={{
          fontSize: 11.5,
          color: COLORS.wine,
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        Por haber concluido satisfactoriamente el:
      </P>
      <P
        style={{
          fontSize: 14,
          color: COLORS.wineDark,
          fontFamily: "Helvetica-Bold",
          textAlign: "center",
          marginBottom: 46,
        }}
      >
        {data.curso}
      </P>
    </Center>
  )
}

const Signatures = ({ data }: any) => {
  return (
    <>
      <Div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 90,
          marginBottom: 22,
          marginTop: 80
        }}
      >
        {data.firmantes.map((f, i) => (
          <Div
            key={i}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Div style={orgLine} />
            <P
              style={{
                fontSize: 10,
                color: COLORS.wineDark,
                fontFamily: "Helvetica-Bold",
                marginTop: 6,
                textAlign: "center",
              }}
            >
              {f.nombre}
            </P>
            <P
              style={{
                fontSize: 9,
                color: COLORS.wine,
                fontFamily: "Helvetica-Bold",
                textAlign: "center",
              }}
            >
              {f.cargo}
            </P>
          </Div>
        ))}
      </Div>

      <Center>
        <P style={{ fontSize: 10, color: COLORS.wine, fontFamily: "Helvetica-Bold" }}>
          {data.fecha}
        </P>
      </Center>
    </>
  )
}

const mockup = {
  organizaciones: [
    { nombre: "Academia\nBorcelle", tipo: "weave" },
    { nombre: "Capacitación\nEnsigna", tipo: "spiral" },
    { nombre: "Gobierno\nAlta Pinta", tipo: "cross" },
    { nombre: "Instituto\nDel Tano", tipo: "half" },
  ],
  destinatario: "Adelaida Montenegro",
  curso: "Taller de Redes Sociales para emprendedores.",
  firmantes: [
    { nombre: "HORACIO OLIVO", cargo: "Instructor" },
    { nombre: "SALMA DUBOIS", cargo: "Jefa de Capacitación" },
  ],
  fecha: "JULIO 2024",
};

const Certificado = ({ data = mockup }: any) => {
  return (
    <Layout orientation="h" pagination={false} style={{ margin: 0, padding: 0 }}>
      <ImgBg
        src="/asset/certificado-borcelle.png"
        objectPosition="center"
        objectFit="cover"
        opacity={1}
        style={{ height: 595, margin: 0, padding: 0 }}>
        <Div style={{ position: "relative", paddingTop: 34, paddingLeft: 60, paddingRight: 60 }}>
          <Logos data={data} />
          <Title data={data} />
          <Recipient data={data} />
          <Signatures data={data} />
        </Div>
      </ImgBg>
    </Layout>
  );
};

export default Certificado