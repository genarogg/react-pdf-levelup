import React from "react";
import {
  LayoutPDF,

  P,

} from "react-pdf-levelup";

const Component = ({ data }:any) => {
  const Footer = () => {
    return (
      <>
        <P>hola</P>
      </>
    );
  };

  return (
    <LayoutPDF footer={<Footer />} pagination={true}>
      <P>
        Lorem ipsum acts as a stand-in for actual text when the final content is
        not yet available. This allows designers to focus on layout and visual
        elements without being distracted by the meaning of the text. Origin:
        It's derived from a Latin text written by Cicero in 45 BC, but the words
        have been altered and rearranged to create the nonsensical text we know
        today. Usage: Lorem ipsum is widely used in various design programs and
        website templates. Benefits: It helps designers assess the overall look
        and feel of a design, ensuring the visual presentation is appealing
        before the real content is added. Not actual Latin: While it resembles
        Latin, the text is not meant to be meaningful and is often used as a
        clear indicator that the space is reserved for actual content.
      </P>
    </LayoutPDF>
  );
};

export default Component;