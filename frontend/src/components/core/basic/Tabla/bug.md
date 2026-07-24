Bugs sin solución limpia — Table

A diferencia del relevamiento general de bugs y limitaciones (que incluye
una "solución posible" concreta para cada punto), este archivo reúne
específicamente los problemas para los que **no existe, hoy, un arreglo
limpio implementado** — solo mitigaciones parciales o el conocimiento de
que hay que evitar cierta combinación de props. Cada punto explica por
qué el arreglo "obvio" no alcanza o no está hecho todavía.

Índice
1. Combinación borde+radio en la celda de esquina de la última fila
2. Desalineación del fix exterior de Table con radios grandes (>~12)


1. Combinación borde+radio en la celda de esquina de la última fila

Descripción. `Table.tsx` evita combinar `borderWidth` (stroke real) +
`borderRadius` en la misma `View` — ese es justamente el propósito del
`useRadiusFix` (simular el borde con `backgroundColor` + `padding` en
vez de un stroke real). Pero ese workaround vive únicamente en
`Table.tsx`. `Cell.tsx` no lo conoce ni lo comparte.

En modo `grid="grid"`, toda celda que no sea la última columna recibe
`borderRightWidth: 1` (stroke real) sin condición. Y la celda de la
esquina inferior-izquierda de la última fila (primera columna, más de
una columna en la tabla) además recibe `borderBottomLeftRadius:
innerRadius` cuando el `Table` tiene `borderRadius` activo. Esas dos
props — un stroke real en el lado derecho y un radio real en la esquina
inferior-izquierda — conviven en la misma `View`. Es la misma
combinación que `Table.tsx` evita a nivel tabla, reapareciendo a nivel
celda porque `Cell.tsx` no pasó por el mismo fix.

Importante: esto **no depende de un umbral de tamaño de radio** — la
colisión existe en el código para cualquier `borderRadius > 0` en modo
`grid`. Con un radio chico (2, 4) la distorsión visual puede ser casi
imperceptible; con un radio grande (16+) se nota mucho más — pero la
causa es estructural, no de magnitud.

Cómo replicarlo.

```tsx
import React from "react";
import { Document, Page, StyleSheet, renderToFile } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./index";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: mirá de cerca la esquina inferior-izquierda de la
// tabla. Ahí conviven borderRightWidth:1 (stroke real, por grid="grid")
// y borderBottomLeftRadius (radio real, por la última fila) en la misma
// celda — la combinación que #395 distorsiona.
function CellCornerBorderRadiusBug() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" style={{ borderRadius: 16 }}>
          <Thead>
            <Tr><Th>A</Th><Th>B</Th><Th>C</Th></Tr>
          </Thead>
          <Tbody>
            <Tr><Td>1</Td><Td>2</Td><Td>3</Td></Tr>
            <Tr><Td>4</Td><Td>5</Td><Td>6</Td></Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}

await renderToFile(<CellCornerBorderRadiusBug />, "./out.pdf");
```

Por qué no tiene un arreglo limpio todavía. La solución de fondo
requeriría que `Cell.tsx` simule el borde de la misma forma que
`Table.tsx` (sin combinar stroke+radio en una `View`), pero solo para
las celdas de esquina de la última fila — el resto de las celdas sí
puede seguir usando stroke real sin problema. Eso significa que
`Cell.tsx` necesitaría conocer `outerBorderWidth`/si el fix de radio
está activo (hoy esa información vive en `TableContext` pero `Cell` no
la usa para esto), y bifurcar su lógica de estilo solo para 2 de las N
celdas de la tabla — la celda inferior-izquierda y la
inferior-derecha. Es una dependencia cruzada entre `Cell` y la lógica
de `border-radius-fix.ts` que hoy no existe, y hacerla bien exige
replicar el truco de "borde simulado" a nivel celda sin romper el
`borderRightWidth`/`borderBottomWidth` real que el resto de la fila sí
necesita. Mitigación parcial disponible mientras tanto: evitar
combinar `grid="grid"` con un `borderRadius` grande, o usar
`grid="modern"`/`"not-grid"` (que no dejan stroke real en esa celda)
cuando el radio importa visualmente.


2. Desalineación del fix exterior de Table con radios grandes (>~12)

Descripción. Este es un problema distinto al punto 1 — vive en
`Table.tsx`/`border-radius-fix.ts`, no en `Cell.tsx`. El workaround de
`Table` arma un "sándwich" de dos contenedores: el exterior con
`backgroundColor: outerBorderColor` + `borderRadius: outerRadius` +
`padding: outerBorderWidth`, y el interior con `borderRadius:
innerRadius` (= `outerRadius - outerBorderWidth`). El "borde" que se ve
es el anillo de `padding` sin cubrir por el contenedor interior.

Ese cálculo asume que la proporción entre `outerRadius`, `innerRadius`
y `padding` se mantiene visualmente coherente sea cual sea el tamaño
del radio. En la práctica, a partir de `borderRadius` ~12 esa relación
deja de calzar: la curvatura exterior y la interior dejan de seguir un
arco concéntrico limpio, y las esquinas se ven desalineadas o
distorsionadas — aun cuando la celda de la última fila (punto 1) no
esté involucrada en absoluto (pasa incluso con una sola fila, o con
`grid="not-grid"` sin ningún stroke real de por medio).

Cómo replicarlo.

```tsx
import React from "react";
import { Document, Page, StyleSheet, renderToFile } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./index";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: con radio 24 (por encima del límite práctico de ~12),
// la esquina EXTERIOR de la tabla (el sándwich de Table, no la celda de
// la última fila) empieza a verse desalineada entre la curva del
// contenedor exterior y la del interior.
function TableOuterRadiusLimitBug() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="not-grid" style={{ borderRadius: 24 }}>
          <Thead>
            <Tr><Th>A</Th><Th>B</Th></Tr>
          </Thead>
          <Tbody>
            <Tr><Td>1</Td><Td>2</Td></Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}

await renderToFile(<TableOuterRadiusLimitBug />, "./out.pdf");
```

Por qué no tiene un arreglo limpio todavía. Resolverlo de raíz
implicaría recalcular la geometría del sándwich (radio exterior, radio
interior, grosor de padding) con una fórmula que se mantenga
proporcional para cualquier tamaño de radio — hoy `innerRadiusOf()`
simplemente resta (`outerRadius - outerBorderWidth`), una aproximación
lineal que alcanza para radios chicos/medianos pero no fue pensada
para escalar a radios grandes. No hay, por ahora, esa fórmula corregida
implementada. Mitigación: mantener `borderRadius <= 12` en el `style`
de `Table` (ver también la nota equivalente en
`references/table-technical-notes.md` del skill).