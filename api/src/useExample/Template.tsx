import { LayoutPDF, P } from "react-pdf-levelup";

const Demo = ({ data }: { data: any }) => (
  <LayoutPDF>
    <P>Hola, {data?.nombre || "Usuario"}</P>
  </LayoutPDF>
);

export default Demo;
