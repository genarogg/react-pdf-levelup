Font.register({
  family: "BebasNeue",
  fonts: [
    {
      src: "https://genarogg.github.io/react-pdf-levelup/public/font/BebasNeue-Regular.ttf",
      fontWeight: "normal",
    },
 
  ],
});


Font.register({
  family: "Lobster",
  fonts: [
    {
      src: "https://genarogg.github.io/react-pdf-levelup/public/font/Lobster-Regular.ttf",
      fontWeight: "normal",
    },
 
  ],
});

const Component = () => {
  return (
    <LayoutPDF
      size="A4"
      orientation="h"
      pagination={false}
      padding={0}
      style={{ fontFamily: "BebasNeue" }}
    >
      <ImgBg
        src="/certificado.png"
        objectPosition="center"
        objectFit="cover"
        opacity={1}
        style={{
          position: "absolute",
          height: "600px"
        }}
      >
        <BR /><BR /><BR />
        <Div style={{ lineHeight: "2.2" }}>
          <H2 style={{
            width: "100%",
            textAlign: "center",
            fontSize: "62px",
            textTransform: "uppercase",
            color: "#383838"
          }}>
            CERTIFICATE
          </H2>
          <H2 style={{
            width: "100%",
            textAlign: "center",
            fontSize: "65px",
            textTransform: "uppercase",
            color: "#282828",

          }}>
            OF ACHIEVEMENT
          </H2>
        </Div>
        <BR /><BR /><BR /><BR /><BR /><BR /><BR /><BR /> <BR />
        <P style={{ textAlign: "center", fontSize: "16px", }}>This Certificate Presented to</P>
        <H2 style={{
          width: "100%",
          textAlign: "center",
          fontSize: "42px",
          textTransform: "uppercase",
          color: "#0b74f2",
          fontFamily:"Lobster"
        }}>
          Charles Torres
        </H2>
        <BR /><BR /><BR />
        <Div style={{ width: "100%", alignItems: "center" }}>
          <P style={{ width: 400, textAlign: "center" ,fontSize: "14px" }}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
          </P>
        </Div>
        <BR /><BR />
        <Div style={{ width: "100%", alignItems: "center" }}>
          <A href="www.yoursite.com" style={{ fontSize: "14px" }}>Contact Info: www.yoursite.com</A>
        </Div>
      </ImgBg>
    </LayoutPDF>
  );
};