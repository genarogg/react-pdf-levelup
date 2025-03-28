const Instructions = () => {
  return (
    <div className="instructions">
      <h2>Instrucciones</h2>
      <p>
        Este editor te permite crear documentos PDF utilizando React PDF y componentes personalizados. Puedes editar el
        código en el panel izquierdo y ver el resultado en tiempo real en el panel derecho.
      </p>

      <h3>Componentes básicos disponibles:</h3>
      <ul>
        <li>
          <code>Document</code> - Componente raíz para el PDF
        </li>
        <li>
          <code>Page</code> - Define una página del PDF
        </li>
        <li>
          <code>Text</code> - Para mostrar texto
        </li>
        <li>
          <code>View</code> - Contenedor similar a un div
        </li>
        <li>
          <code>StyleSheet</code> - Para crear estilos
        </li>
        <li>
          <code>Image</code> - Para mostrar imágenes
        </li>
        <li>
          <code>Link</code> - Para enlaces
        </li>
      </ul>

      <h3>Componentes personalizados:</h3>
      <ul>
        <li>
          <code>LayoutPDF</code> - Componente principal para configurar el documento
        </li>
        <li>
          <code>H1-H6, P, Strong, Em, etc.</code> - Componentes de texto
        </li>
        <li>
          <code>Table, Thead, Tbody, Tr, Th, Td</code> - Componentes de tabla
        </li>
        <li>
          <code>Container, Row, Col1-Col12</code> - Sistema de grid
        </li>
        <li>
          <code>Header, Footer</code> - Encabezado y pie de página
        </li>
        <li>
          <code>QR</code> - Componente para generar códigos QR personalizables
        </li>
      </ul>

      <h3>Opciones del componente QR:</h3>
      <ul>
        <li>
          <code>value</code> - Texto o URL para el código QR (requerido)
        </li>
        <li>
          <code>size</code> - Tamaño en píxeles (por defecto: 150)
        </li>
        <li>
          <code>colorDark</code> - Color de los puntos (por defecto: "#000000")
        </li>
        <li>
          <code>colorLight</code> - Color de fondo (por defecto: "#ffffff")
        </li>
        <li>
          <code>margin</code> - Margen alrededor del QR (por defecto: 0)
        </li>
        <li>
          <code>errorCorrectionLevel</code> - Nivel de corrección ("L", "M", "Q", "H")
        </li>
        <li>
          <code>logo</code> - URL de la imagen del logo
        </li>
        <li>
          <code>logoWidth</code> - Ancho del logo en píxeles
        </li>
        <li>
          <code>logoHeight</code> - Alto del logo en píxeles
        </li>
      </ul>

      <h3>Notas importantes:</h3>
      <ul>
        <li>
          No uses declaraciones <code>import</code> en tu código
        </li>
        <li>
          Asigna tu componente a la variable <code>result</code> al final del código
        </li>
        <li>
          No uses <code>return</code> fuera de una función
        </li>
        <li>
          Usa <code>StyleSheet.create()</code> para definir estilos
        </li>
        <li>Al usar un logo en el QR, usa el nivel de corrección "H" para mejor lectura</li>
      </ul>
    </div>
  )
}

export default Instructions

