const Component = ({ data }) => {
  return (
    <LayoutPDF>
      <H1>Tabla Minimal</H1>
      <Table cellHeight={24}>
        <Thead>
          <Tr>
            <Th width="40%">Producto</Th>
            <Th width="20%">Cant</Th>
            <Th width="20%">Precio</Th>
            <Th width="20%">Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td width="40%">Item A</Td>
            <Td width="20%">2</Td>
            <Td width="20%">$5.00</Td>
            <Td width="20%">$10.00</Td>
          </Tr>
          <Tr>
            <Td width="40%">Item B</Td>
            <Td width="20%">1</Td>
            <Td width="20%">$8.00</Td>
            <Td width="20%">$8.00</Td>
          </Tr>
        </Tbody>
      </Table>
    </LayoutPDF>
  )
}

result = Component
