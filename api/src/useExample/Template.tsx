import React from "react";
import { LayoutPDF, P } from "react-pdf-levelup";

// Define una interfaz para los datos
interface ComponentProps {
  data?: {
    nombre?: string;
  };
}

const Component = ({ data }: ComponentProps) => (
  <LayoutPDF>
    <P>Hola, {data?.nombre || "Usuario"}</P>
  </LayoutPDF>
);

export default Component;