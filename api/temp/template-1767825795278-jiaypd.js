import React from "react";
import { LayoutPDF, P } from "react-pdf-levelup";

// Define una interfaz para los datos

const Component = ({
  data
}) => /*#__PURE__*/React.createElement(LayoutPDF, null, /*#__PURE__*/React.createElement(P, null, "Hola, ", data?.nombre || "Usuario"));
export default Component;