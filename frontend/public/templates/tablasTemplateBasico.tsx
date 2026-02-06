
const Component = ({ data }) => {
    return (
        <Layout size="A4" padding={20} showPageNumbers={false}>
            <H5>Tabla Simple</H5>
            <Table>
                <Thead textAlign="center">
                    <Tr>
                        <Th>thead 1</Th>
                        <Th>thead 2</Th>
                        <Th>thead 3</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>uno</Td>
                        <Td>dos</Td>
                        <Td>tres</Td>
                    </Tr>
                    <Tr>
                        <Td>cuatro</Td>
                        <Td>cinco</Td>
                        <Td>seis</Td>
                    </Tr>
                    <Tr>
                        <Td>siete</Td>
                        <Td>ocho</Td>
                        <Td>nueve</Td>
                    </Tr>
                </Tbody>
            </Table>
            <H5>Tabla Con color</H5>
            <Table>
                <Thead>
                    <Tr style={{ backgroundColor: "#28a745" }}>
                        <Th>thead 1</Th>
                        <Th style={{ backgroundColor: "#ec4899" }}>thead 2</Th>
                        <Th>thead 3</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td style={{ backgroundColor: "#eab308" }}>uno</Td>
                        <Td style={{ backgroundColor: "#3b82f6" }}>dos</Td>
                        <Td style={{ backgroundColor: "#ef4444" }}>tres</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ backgroundColor: "#eab308" }}>cuatro</Td>
                        <Td style={{ backgroundColor: "#3b82f6" }}>cinco</Td>
                        <Td style={{ backgroundColor: "#ef4444" }}>seis</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ backgroundColor: "#eab308" }}>siete</Td>
                        <Td style={{ backgroundColor: "#3b82f6" }}>ocho</Td>
                        <Td style={{ backgroundColor: "#ef4444" }}>nueve</Td>
                    </Tr>
                </Tbody>
            </Table>
            <H5>Tabla con 2 headers</H5>
            <Table>
                <Thead>
                    <Tr>
                        <Th>thead 1</Th>
                        <Th>thead 2</Th>
                    </Tr>
                    <Tr>
                        <Th>thead 1.1</Th>
                        <Th>thead 1.2</Th>
                        <Th>thead 2.1</Th>
                        <Th>thead 2.2</Th>
                    </Tr>

                </Thead>
                <Tbody>
                    <Tr>
                        <Td>uno</Td>
                        <Td>dos</Td>
                        <Td>cuatro</Td>
                        <Td>cinco</Td>
                    </Tr>
                    <Tr>
                        <Td>uno</Td>
                        <Td>dos</Td>
                        <Td>cuatro</Td>
                        <Td>cinco</Td>
                    </Tr>
                    <Tr>
                        <Td>uno</Td>
                        <Td>dos</Td>
                        <Td>cuatro</Td>
                        <Td>cinco</Td>
                    </Tr>
                </Tbody>
            </Table>
            <H5>Tabla con tamaños ajustados</H5>
            <Table>
                <Thead>
                    <Tr>
                        <Th style={{ backgroundColor: "#14b8a6", width: "100%" }}>DOCUMENTO</Th>
                        <Th style={{ backgroundColor: "#14b8a6", width: 150 }}>TIPO</Th>
                        <Th style={{ backgroundColor: "#14b8a6", width: 120 }}>CANTIDAD</Th>
                        <Th style={{ backgroundColor: "#14b8a6", width: 120 }}>COSTO</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td style={{ width: "100%" }}>Java</Td>
                        <Td style={{ width: 150 }}>Simple</Td>
                        <Td style={{ width: 120 }}>5</Td>
                        <Td style={{ width: 120 }}>100</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ width: "100%" }}>JavaScript</Td>
                        <Td style={{ width: 150 }}>Seguridad</Td>
                        <Td style={{ width: 120 }}>6</Td>
                        <Td style={{ width: 120 }}>100</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ width: "100%" }}>Python</Td>
                        <Td style={{ width: 150 }}>Simple</Td>
                        <Td style={{ width: 120 }}>7</Td>
                        <Td style={{ width: 120 }}>100</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ width: "100%" }}>
                            <Strong>
                                Total
                            </Strong>
                        </Td>
                        <Td style={{ width: 150 }}></Td>
                        <Td style={{ width: 120, backgroundColor: "#14b8a6" }}>
                            <Strong>
                                300
                            </Strong>
                        </Td>
                        <Td style={{ width: 120, backgroundColor: "#14b8a6" }}>
                            <Strong>
                                400
                            </Strong>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
            <H5>Tabla Coloreada</H5>
            <Table style={{ width: "100%", borderRadius: "10px", overflow: "hidden" }}>
                <Thead>
                    <Tr style={{ backgroundColor: "#8E44AD", color: "white", textAlign: "left" }}>
                        <Th>Empleado</Th>
                        <Th>Días Asistidos</Th>
                        <Th>Faltas</Th>
                        <Th>Porcentaje de Asistencia</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr style={{ backgroundColor: "#F3E5F5" }}>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>Pedro Ramírez</Td>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>24</Td>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>2</Td>
                        <Td style={{ fontWeight: "bold", color: "#27AE60" }}>92%</Td>
                    </Tr>
                    <Tr>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>Laura Fernández</Td>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>20</Td>
                        <Td style={{ borderBottom: "1px solid #8E44AD" }}>6</Td>
                        <Td style={{ fontWeight: "bold", color: "#C0392B" }}>77%</Td>
                    </Tr>
                    <Tr style={{ backgroundColor: "#F3E5F5" }}>
                        <Td>José García</Td>
                        <Td>23</Td>
                        <Td>3</Td>
                        <Td style={{ fontWeight: "bold", color: "#27AE60" }}>88%</Td>
                    </Tr>
                </Tbody>
            </Table>
        </Layout>
    );
};