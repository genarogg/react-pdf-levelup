import React from "react";
import { LayoutPDF, P } from "react-pdf-levelup";

const Component = ({ data }: { data: any }) => (
  <LayoutPDF>
    <P>Hola, {data?.nombre || "Usuario"}</P>
  </LayoutPDF>
);

export default Component;
