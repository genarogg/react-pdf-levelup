

const Component = ({ data }) => {

  const Footer = ()=>{
    return(
      <P>hola</P>
    )
  }

  return (
    <LayoutPDF footer={<Footer/>}>
    
    </LayoutPDF>
  );
};
