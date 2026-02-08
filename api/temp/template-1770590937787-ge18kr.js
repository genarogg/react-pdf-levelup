import React from "react";
import { A, BR, Center, Col6, Container, Div, Em, Font, H1, H4, Img, Layout, P, Right, Row, Strong, Table, Tbody, Td, Th, Thead, Tr } from "@react-pdf-levelup/core";
const Component = ({
  data
}) => {
  getFuentes();
  return /*#__PURE__*/React.createElement(FathonLayout, null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(Title, null), /*#__PURE__*/React.createElement(Menu, null), /*#__PURE__*/React.createElement(BR, null), /*#__PURE__*/React.createElement(FathonTablet, null), /*#__PURE__*/React.createElement(FathonFooter, null));
};
const FathonLayout = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(Layout, {
    pagination: false,
    padding: 60,
    backgroundImage: "https://genarogg.github.io/media/react-pdf-levelup/fathon/factura-bg.jpg",
    style: {
      border: "1px",
      fontFamily: "Nunito",
      color: "#fff"
    }
  }, children);
};
const Header = () => {
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col6, null, /*#__PURE__*/React.createElement(Img, {
    src: "https://genarogg.github.io/media/react-pdf-levelup/fathon/logo.png",
    style: {
      width: "120px"
    }
  })), /*#__PURE__*/React.createElement(Col6, null, /*#__PURE__*/React.createElement(Right, null, /*#__PURE__*/React.createElement(Div, {
    style: {
      border: "2px solid #8075ff",
      borderRadius: "20px",
      padding: "8px",
      width: "200px"
    }
  }, /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(A, {
    href: "https://example.app",
    style: {
      color: "white"
    }
  }, /*#__PURE__*/React.createElement(Em, null, "example.app"))))))));
};
const Title = () => {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(H1, {
    style: {
      fontFamily: "Audiowide",
      fontSize: "84px"
    }
  }, "Invoice"));
};
const Menu = () => {
  return /*#__PURE__*/React.createElement(Container, {
    style: {
      marginBottom: "30px"
    }
  }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col6, null, /*#__PURE__*/React.createElement(Strong, null, "BILLED TO:"), /*#__PURE__*/React.createElement(Strong, null, "Oscar Herron"), /*#__PURE__*/React.createElement(Strong, null, "965 Farm Road"), /*#__PURE__*/React.createElement(Strong, null, "404-218-5023")), /*#__PURE__*/React.createElement(Col6, null, /*#__PURE__*/React.createElement(Right, null, /*#__PURE__*/React.createElement(Strong, null, "Invoice No. 24"), /*#__PURE__*/React.createElement(Strong, null, "21/07/2024")))));
};
const FathonTablet = () => {
  const tableData = [{
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }, {
    description: "Lorem ipsum",
    price: "10$",
    tax: "10$",
    total: "20$"
  }];
  const summaryRow = {
    price: "80$",
    tax: "80$",
    total: "160$"
  };
  return /*#__PURE__*/React.createElement(Center, {
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement(Table, {
    borderColor: "#8075ff",
    textColor: "#fff",
    zebraColor: "#200d53",
    style: {
      backgroundColor: "#1b0b47",
      color: "#fff",
      fontFamily: "Nunito"
    }
  }, /*#__PURE__*/React.createElement(Thead, {
    textAlign: "center",
    style: {
      backgroundColor: "#200d53"
    }
  }, /*#__PURE__*/React.createElement(Tr, null, /*#__PURE__*/React.createElement(Th, {
    style: {
      width: "100%"
    }
  }, "DESCRIPTION"), /*#__PURE__*/React.createElement(Th, {
    style: {
      width: "100px"
    }
  }, "PRICE"), /*#__PURE__*/React.createElement(Th, {
    style: {
      width: "100px"
    }
  }, "TAX"), /*#__PURE__*/React.createElement(Th, {
    style: {
      width: "100px"
    }
  }, "TOTAL"))), /*#__PURE__*/React.createElement(Tbody, null, tableData.map((row, index) => /*#__PURE__*/React.createElement(Tr, {
    key: index
  }, /*#__PURE__*/React.createElement(Td, {
    style: {
      width: "100%"
    }
  }, row.description), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px"
    }
  }, row.price), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px"
    }
  }, row.tax), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px"
    }
  }, row.total))), /*#__PURE__*/React.createElement(Tr, null, /*#__PURE__*/React.createElement(Td, {
    style: {
      width: "100%",
      fontWeight: "bold"
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px",
      fontWeight: "bold"
    }
  }, summaryRow.price), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px",
      fontWeight: "bold"
    }
  }, summaryRow.tax), /*#__PURE__*/React.createElement(Td, {
    textAlign: "right",
    style: {
      width: "100px",
      fontWeight: "bold"
    }
  }, summaryRow.total)))));
};
const FathonFooter = () => {
  return /*#__PURE__*/React.createElement(Center, {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(H4, null, "TERMS & CONDITIONS"), /*#__PURE__*/React.createElement(P, {
    style: {
      maxWidth: 300
    }
  }, "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh Lorem ipsum dolor sit amet"));
};
const getFuentes = () => {
  Font.register({
    family: "Nunito",
    fonts: [{
      src: "https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKof4Mg.ttf",
      fontWeight: "normal"
    }, {
      src: "https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofAjsOkZg.ttf",
      fontWeight: "bold"
    }, {
      src: "https://fonts.gstatic.com/s/nunito/v12/XRXX3I6Li01BKofIMOaE.ttf",
      fontStyle: "italic",
      fontWeight: "normal"
    }, {
      src: "https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofAnsSkZg.ttf",
      fontWeight: "300"
    }]
  });
  Font.register({
    family: "Audiowide",
    fonts: [{
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/audiowide/Audiowide-Regular.ttf",
      fontWeight: "normal"
    }]
  });
};
Component;
export default Component;