"use client"

import  React from "react"
import { useState } from "react"

const QuickHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleHelp = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="quick-help-container">
      <button className="help-button" onClick={toggleHelp}>
        {isOpen ? "Cerrar Ayuda" : "Ayuda Rápida"}
      </button>

      {isOpen && (
        <div className="help-panel">
          <h3>Atajos de Teclado</h3>
          <table className="shortcuts-table">
            <tbody>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Space</kbd>
                </td>
                <td>Mostrar sugerencias</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>
                </td>
                <td>Insertar Layout PDF</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>
                </td>
                <td>Insertar Tabla</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>
                </td>
                <td>Insertar Grid</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>F</kbd>
                </td>
                <td>Buscar</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>H</kbd>
                </td>
                <td>Reemplazar</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Z</kbd>
                </td>
                <td>Deshacer</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl</kbd>+<kbd>Y</kbd>
                </td>
                <td>Rehacer</td>
              </tr>
            </tbody>
          </table>

          <h3>Componentes Populares</h3>
          <div className="component-list">
            <button
              className="component-button"
              onClick={() => navigator.clipboard.writeText('<LayoutPDF size="A4" padding={30}>\n  \n</LayoutPDF>')}
            >
              LayoutPDF
            </button>
            <button
              className="component-button"
              onClick={() =>
                navigator.clipboard.writeText(
                  "<Table>\n  <Thead>\n    <Tr>\n      <Th>Encabezado</Th>\n    </Tr>\n  </Thead>\n  <Tbody>\n    <Tr>\n      <Td>Dato</Td>\n    </Tr>\n  </Tbody>\n</Table>",
                )
              }
            >
              Table
            </button>
            <button
              className="component-button"
              onClick={() =>
                navigator.clipboard.writeText(
                  "<Container>\n  <Row>\n    <Col6></Col6>\n    <Col6></Col6>\n  </Row>\n</Container>",
                )
              }
            >
              Grid
            </button>
            <button
              className="component-button"
              onClick={() => navigator.clipboard.writeText('<QR value="https://example.com" size={150} />')}
            >
              QR
            </button>
            <button
              className="component-button"
              onClick={() => navigator.clipboard.writeText("<UL>\n  <LI>Elemento 1</LI>\n  <LI>Elemento 2</LI>\n</UL>")}
            >
              Lista
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickHelp

