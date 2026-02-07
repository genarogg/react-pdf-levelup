import React from "react";
import { Layout, P } from "@react-pdf-levelup/core";

// Define una interfaz para los datos
interface ComponentProps {
  data?: {
    nombre?: string;
  };
}

const Component = ({ data }: ComponentProps) => (
  <Layout>
    <P>Hola, {data?.nombre || "Usuario"}</P>
  </Layout>
);

export default Component;