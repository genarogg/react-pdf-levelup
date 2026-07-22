# Bugs y limitaciones — `Tablet.tsx`

Relevamiento de problemas encontrados en el componente de tabla para
`@react-pdf/renderer`. Cada punto incluye: descripción, un componente de
ejemplo completo (copiar/pegar, con `export default`) para reproducirlo,
y una solución posible.

> Los ejemplos asumen que `Tablet.tsx` está en el mismo directorio
> (`./Tablet`) y exporta `Table, Thead, Tbody, Tr, Th, Td`.

---

## Índice

1. [`isFirst`/`isOdd` se filtran hacia la `View` en `Th`](#1)
2. [Posible reaparición del bug de borde+radio (#395) en la última fila](#2)
3. [`Tbody` esparce `...rest` sobre todos los `Tr`](#3)
4. [`extractBorderColor`/`extractBorderWidth` no soportan bordes por lado](#4)
5. [Anchos mixtos fijo + porcentual → la fila supera el 100%](#5)
6. [Bug de "cero falsy" en `outerBorderWidth`](#6)
7. [`not-grid` ignora cualquier `borderWidth` de `style`](#7)
8. [No hay soporte de `rowSpan`](#8)
9. [Filas envueltas en un componente propio rompen `isOdd`/`isLastRow`](#9)
10. [Props de tabla se filtran sin efecto (`textAlign`, `cellHeight`, ...)](#10)
11. [`background` de `Table` sin efecto fuera de `useRadiusFix`](#11)
12. [`colSpan` se calcula por fila, no por tabla → desalineación](#12)
13. [`grid` mal tipeado cae en silencio en modo "modern"](#13)
14. [`toNumber` interpreta `%` como número plano](#14)
15. [`toFixed(2)` deja desfase de subpíxel en anchos por `colSpan`](#15)
16. [Una fila puede partirse a la mitad entre dos páginas](#16)
17. [El header no se repite en tablas de varias páginas](#17)
18. [`wrap={false}` como arreglo manual tiene sus propios bugs](#18)
19. [Resumen de prioridad sugerida](#resumen)

---

<a id="1"></a>
## 1. `isFirst`/`isOdd` se filtran hacia la `View` en `Th`

**Descripción.** `Tr` clona cada celda con `isFirst`, `isLast`, `isLastRow`,
`isOdd`. `Td` destructura las cuatro; `Th` solo destructura `isLast` e
`isLastRow`. `isFirst` e `isOdd` caen en `...rest` de `Th` y se pasan como
atributos sueltos a la `View` final, sin haber sido consumidos.

**Cómo replicarlo.**

```tsx
// Bug01_ThPropLeak.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: Th no destructura isFirst/isOdd, así que llegan como
// atributos sueltos a la View final sin usarse. No es visible a simple
// vista en el PDF; hay que inspeccionar el árbol de props (debug o logs).
export default function Bug01_ThPropLeak() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Destructurar `isFirst` e `isOdd` en `Th` igual que en
`Td`, aunque no se usen, para que no lleguen a `...rest`:

```tsx
const Th: React.FC<CellProps> = ({
  children, style, width, height,
  isFirst = false,
  isLast = false,
  isLastRow = false,
  isOdd = false,
  textAlign: propTextAlign,
  text = true,
  ...rest
}) => { /* ... */ };
```

---

<a id="2"></a>
## 2. Posible reaparición del bug de borde+radio (#395) en la última fila

**Descripción.** El `useRadiusFix` evita combinar `borderWidth` +
`borderRadius` en la `Table`, pero en modo `grid` con radio activo, la
celda inferior-izquierda (o derecha) de la última fila termina con
`borderRightWidth`/`borderBottomWidth` (stroke, por grid) **y**
`borderBottomLeftRadius`/`borderBottomRightRadius` (radio) en la misma
`View` — exactamente la combinación que el fix de `Table` quiso evitar,
pero a nivel celda.

**Cómo replicarlo.**

```tsx
// Bug02_RadiusBorderCorner.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: mirá de cerca la esquina inferior-izquierda de la
// tabla. Si la curva sale distorsionada (no es un arco limpio), es el
// bug de borde+radio (#395) reapareciendo a nivel celda de última fila.
export default function Bug02_RadiusBorderCorner() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" style={{ borderRadius: 16 }}>
          <Thead>
            <Tr>
              <Th>A</Th>
              <Th>B</Th>
              <Th>C</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
              <Td>3</Td>
            </Tr>
            <Tr>
              <Td>4</Td>
              <Td>5</Td>
              <Td>6</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** En la celda que combina ambas cosas, no dibujar el
borde como stroke normal: simular esa línea puntual con un `View` fino
adicional (mismo truco que ya usa `Table`), o quitar el borde interno
justo en el lado que coincide con la esquina redondeada de esa celda.

---

<a id="3"></a>
## 3. `Tbody` esparce `...rest` sobre todos los `Tr`

**Descripción.** A diferencia de `Table`/`Thead`, que aplican `{...rest}`
a su propio nodo, `Tbody` no tiene `View` propia — así que cualquier prop
extra pasada a `<Tbody>` se replica en **cada** `<Tr>`, y de ahí, si `Tr`
tampoco la consume, sigue cayendo hasta la `View` de cada fila.

**Cómo replicarlo.**

```tsx
// Bug03_TbodyRestLeak.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: el prop "debug" fue pensado para Tbody (una sola caja
// de depuración a nivel "cuerpo de tabla"), pero Tbody lo reparte a cada
// Tr. Vas a ver el recuadro punteado de debug repetido en CADA fila, no
// una sola vez.
export default function Bug03_TbodyRestLeak() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          {/* @ts-expect-error: debug/id no están tipados en TableProps pero
              [key:string]:any los deja pasar igual */}
          <Tbody id="totales" debug>
            <Tr>
              <Td>Fila 1</Td>
              <Td>A</Td>
            </Tr>
            <Tr>
              <Td>Fila 2</Td>
              <Td>B</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Documentar explícitamente esta asimetría, o definir
un `TbodyProps` propio (sin `[key:string]: any` heredado de `TableProps`)
que no permita pasar props ambiguas por error de tipado.

---

<a id="4"></a>
## 4. `extractBorderColor`/`extractBorderWidth` no soportan bordes por lado

**Descripción.** Solo leen `border`/`borderWidth`/`borderColor` uniformes.
Si el usuario define solo `borderTopColor` (sin `borderColor` general), el
color "detectado" para el borde simulado cae al default (`borderColor`
prop, `#000`) en vez de respetar la intención.

**Cómo replicarlo.**

```tsx
// Bug04_BorderColorPerSide.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: solo definimos borderTopColor (azul), sin borderColor
// general. extractBorderColor no lo detecta, así que el "radius fix" cae
// al default (borderColor prop, negro) en vez de usar azul.
export default function Bug04_BorderColorPerSide() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table
          grid="grid"
          style={{ borderRadius: 10, borderTopColor: "blue" } as any}
        >
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Fila 1</Td>
              <Td>A</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Extender `extractBorderColor`/`extractBorderWidth`
para revisar también las variantes por lado como fallback, o documentar
que el "radius fix" solo soporta bordes uniformes.

---

<a id="5"></a>
## 5. Anchos mixtos fijo + porcentual → la fila supera el 100%

**Descripción.** `totalUnits` cuenta toda celda (incluida una con `width`
fijo) como "una unidad más" para el reparto porcentual de las demás, en
vez de restar primero el espacio que la celda fija va a ocupar.

**Cómo replicarlo.**

```tsx
// Bug05_MixedWidthOverflow.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: la fila del body debería medir el mismo ancho total
// que el header (100%). Como "ID" tiene width fijo (80px) y las otras dos
// celdas se calculan como si esos 80px fueran "una unidad proporcional
// más", la fila termina ocupando 80px + 66.66% del contenedor: se
// desborda hacia la derecha o se corta contra el borde de la página.
export default function Bug05_MixedWidthOverflow() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th width="80px">ID</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td width="80px">001</Td>
              <Td>Juan Pérez</Td>
              <Td>juan.perez.ejemplo@correo.com</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Antes de repartir el % entre las celdas automáticas,
restar el ancho de las celdas con `width` fijo del total disponible (esto
requiere conocer el ancho absoluto del contenedor, no solo porcentajes), o
documentar que no se debe mezclar `width` fijo con automático en una
misma fila.

---

<a id="6"></a>
## 6. Bug de "cero falsy" en `outerBorderWidth`

**Descripción.**

```ts
const outerBorderWidth = grid === "not-grid" ? 0 : styleBorderWidth || gridBorderWidth;
```

`0 || 1` da `1` en JS. Un `borderWidth: 0` explícito en `grid="grid"` con
radio activa igual el "radius fix" y termina dibujando un marco de 1pt
no pedido.

**Cómo replicarlo.**

```tsx
// Bug06_FalsyZeroBorder.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 40 } });

// FALLA ESPERADA: pedimos borderWidth:0 explícito, así que NO debería
// verse ningún trazo/marco alrededor de la tabla (solo el rectángulo
// redondeado). Si el bug está presente, aparece igual un marco negro de
// ~1pt, porque `styleBorderWidth || gridBorderWidth` trata el 0 explícito
// como "no especificado".
export default function Bug06_FalsyZeroBorder() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" style={{ borderWidth: 0, borderRadius: 16 }}>
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Distinguir "no especificado" de "cero explícito"
antes de aplicar el fallback:

```ts
const hasExplicitBorderWidth =
  flatStyle.borderWidth !== undefined || typeof flatStyle.border === "string";
const outerBorderWidth =
  grid === "not-grid"
    ? 0
    : hasExplicitBorderWidth
      ? styleBorderWidth
      : gridBorderWidth;
```

---

<a id="7"></a>
## 7. `not-grid` ignora cualquier `borderWidth` de `style`

**Descripción.**

```ts
const outerBorderWidth = grid === "not-grid" ? 0 : ...
```

Fuerza `0` sin condición, así que no hay forma de tener "sin líneas
internas, pero con marco exterior" usando `grid="not-grid"`.

**Cómo replicarlo.**

```tsx
// Bug07_NotGridIgnoresBorderWidth.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 40 } });

// FALLA ESPERADA: queremos SIN líneas internas (por eso not-grid) pero
// CON un marco de 2pt rojo alrededor de toda la tabla. Si el bug está
// presente, no aparece ningún marco: outerBorderWidth se fuerza a 0 sin
// importar lo que pongas en style.
export default function Bug07_NotGridIgnoresBorderWidth() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table
          grid="not-grid"
          style={{ borderWidth: 2, borderColor: "red" }}
        >
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Solo forzar `0` cuando el usuario no puso nada
explícito, igual que en el punto 6:

```ts
const outerBorderWidth =
  grid === "not-grid"
    ? (hasExplicitBorderWidth ? styleBorderWidth : 0)
    : hasExplicitBorderWidth ? styleBorderWidth : gridBorderWidth;
```

---

<a id="8"></a>
## 8. No hay soporte de `rowSpan`

**Descripción.** Solo existe `colSpan`. `rowSpan` pasado a un `Td` no
rompe nada, pero tampoco fusiona la celda verticalmente: cae en `...rest`
sin efecto.

**Cómo replicarlo.**

```tsx
// Bug08_NoRowSpan.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: "Categoría A" debería aparecer UNA sola vez, fusionada
// verticalmente ocupando 2 filas. Como rowSpan no está implementado, la
// segunda fila queda con una columna de menos (desalineada respecto del
// header) si no se repite manualmente la celda.
export default function Bug08_NoRowSpan() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>Categoría</Th>
              <Th>Producto</Th>
              <Th>Precio</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {/* @ts-expect-error: rowSpan no tiene ningún efecto real */}
              <Td rowSpan={2}>Categoría A</Td>
              <Td>Producto 1</Td>
              <Td>$100</Td>
            </Tr>
            <Tr>
              {/* sin repetir "Categoría A": esta fila queda con 2
                  columnas en vez de 3 */}
              <Td>Producto 2</Td>
              <Td>$150</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Implementar tracking real de grid: `Tbody` necesita
saber, para cada fila, qué columnas ya están "ocupadas" por un `rowSpan`
de una fila anterior, y saltarlas al calcular `totalUnits`/posiciones. Es
un cambio no trivial (deja de ser un cálculo por-fila aislado).

---

<a id="9"></a>
## 9. Filas envueltas en un componente propio rompen `isOdd`/`isLastRow`

**Descripción.** `Tbody` usa `cloneElement` sobre sus hijos directos. Si
un `<Tr>` está renderizado por dentro de un componente propio,
`cloneElement` le inyecta las props al *wrapper*, no al `<Tr>` interno.

**Cómo replicarlo.**

```tsx
// Bug09_WrapperBreaksRowProps.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// Componente "wrapper" típico: alguien envuelve <Tr> en su propio
// componente para reusar lógica de fila.
function CustomRow({ label, value }: { label: string; value: string }) {
  return (
    <Tr>
      <Td>{label}</Td>
      <Td>{value}</Td>
    </Tr>
  );
}

// FALLA ESPERADA: con zebra=true, las filas de índice impar (2 y 4)
// deberían tener fondo gris. Como Tbody le inyecta isOdd/isLastRow a
// <CustomRow> (no al <Tr> interno), NINGUNA fila queda con zebra.
export default function Bug09_WrapperBreaksRowProps() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" zebra style={{ borderRadius: 10 }}>
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            <CustomRow label="Fila 1" value="A" />
            <CustomRow label="Fila 2" value="B" />
            <CustomRow label="Fila 3" value="C" />
            <CustomRow label="Fila 4" value="D" />
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Documentar que `Tbody` solo soporta `Tr` como hijo
directo (o array/fragmento de `Tr`), o rediseñar el cálculo de índice
para que cada `Tr` lo obtenga de un contador en `TableContext` en vez de
depender de `cloneElement` desde `Tbody`.

---

<a id="10"></a>
## 10. Props de tabla se filtran sin efecto (`textAlign`, `cellHeight`, ...)

**Descripción.** `Table` nunca lee `textAlign` de sus props — su contexto
trae `textAlign: "left"` hard-codeado. Y props como `cellHeight` pasadas
a `Tbody` no se usan: se reparten a cada `Tr`, que tampoco las consume, y
terminan como atributos sueltos en la `View` de la fila.

**Cómo replicarlo.**

```tsx
// Bug10_PropLeakageTextAlignCellHeight.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: si textAlign="center" tuviera efecto en Table, el
// texto del body debería quedar centrado. Y si cellHeight=40 en Tbody
// tuviera efecto, las celdas medirían 40 de alto. Ninguno de los dos
// hace nada: el texto sigue a la izquierda y las celdas en 22 (default).
export default function Bug10_PropLeakageTextAlignCellHeight() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* @ts-expect-error: TS "permite" textAlign por el índice de TableProps */}
        <Table grid="grid" textAlign="center">
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          {/* @ts-expect-error: TS "permite" cellHeight en Tbody igual */}
          <Tbody cellHeight={40}>
            <Tr>
              <Td>Fila 1</Td>
              <Td>A</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Agregar un `textAlign` real al contexto por defecto
de `Table` (leído de props), y acotar los tipos de `Tbody`/`Tr` para que
no hereden `TableProps` completo — así TypeScript deja de "aprobar" props
que en realidad no tienen ningún efecto.

---

<a id="11"></a>
## 11. `background` de `Table` sin efecto fuera de `useRadiusFix`

**Descripción.** `background` solo se aplica dentro del branch de
`useRadiusFix` (borde + radio combinados). Sin esa combinación, el prop
no hace nada pese a que su nombre sugiere un fondo general de tabla.

**Cómo replicarlo.**

```tsx
// Bug11_BackgroundNoop.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: uno esperaría que "background" pinte el fondo del
// cuerpo de la tabla en celeste. Como NO hay borderRadius en style (no
// se activa useRadiusFix), background nunca se aplica: el fondo de las
// celdas sin zebra sigue blanco/transparente.
export default function Bug11_BackgroundNoop() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" background="#cce5ff">
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Fila 1</Td>
              <Td>A</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Aplicar `background` como `backgroundColor` base
del contenedor de contenido siempre, no solo dentro de `useRadiusFix`:

```tsx
const content = (
  <View style={{ backgroundColor: background, borderRadius: innerRadius }}>
    {children}
  </View>
);
```

(quitando la condición `useRadiusFix ? ... : children`).

---

<a id="12"></a>
## 12. `colSpan` se calcula por fila, no por tabla → desalineación

**Descripción.** Cada `Tr` calcula su propio `totalUnits` en base a sus
propios hijos. No hay un concepto de "esta tabla tiene N columnas", así
que una fila con una celda de menos (por error) desalinea sus columnas
respecto de las demás filas.

**Cómo replicarlo.**

```tsx
// Bug12_ColSpanMisalignment.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: las 3 columnas del header (33.33% cada una) deberían
// alinearse en X con las columnas de TODAS las filas. A la fila 2 le
// falta una celda a propósito (totalUnits=2 en vez de 3): sus dos celdas
// terminan en 50%/50%, desalineadas respecto del header y de la fila 1.
export default function Bug12_ColSpanMisalignment() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
              <Th>Col C</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
              <Td>3</Td>
            </Tr>
            <Tr>
              {/* falta la 3ra celda a propósito */}
              <Td>4</Td>
              <Td>5</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Calcular `totalUnits` una sola vez a nivel `Table`
(a partir del `Thead`, o de un prop explícito `columns={3}`) y pasarlo
por `TableContext`, en vez de recalcularlo de forma aislada en cada `Tr`.

---

<a id="13"></a>
## 13. `grid` mal tipeado cae en silencio en modo "modern"

**Descripción.** Un valor de `grid` no reconocido (typo, valor dinámico
inválido) no lanza error: como ninguna de las comparaciones (`"grid"`,
`"not-grid"`) da `true`, el comportamiento resultante equivale al de
`"modern"` sin que quede explícito en ningún lado.

**Cómo replicarlo.**

```tsx
// Bug13_InvalidGridTypo.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: "Grid" (mal tipeado, con mayúscula) no coincide con
// ningún caso de grid==="grid"/"not-grid", así que cae en silencio en un
// comportamiento equivalente a "modern" (sin marco exterior, sin líneas
// internas verticales), sin ningún warning.
export default function Bug13_InvalidGridTypo() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* @ts-expect-error: "Grid" no es un GridMode válido */}
        <Table grid="Grid">
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Agregar un `console.warn` en desarrollo cuando
`grid` no coincide con ninguno de los tres valores válidos.

---

<a id="14"></a>
## 14. `toNumber` interpreta `%` como número plano

**Descripción.**

```ts
function toNumber(value: any): number {
  if (typeof value === "string") {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }
  // ...
}
```

`parseFloat("50%")` da `50`, tratado luego como 50 unidades de punto, no
como 50% relativo.

**Cómo replicarlo.**

```tsx
// Bug14_PercentRadiusParsedAsNumber.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: toNumber usa parseFloat, así que "50%" se interpreta
// como el número 50 (puntos), no como 50% relativo. El radio termina
// siendo mucho más grande de lo esperado para una tabla chica.
export default function Bug14_PercentRadiusParsedAsNumber() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid" style={{ borderRadius: "50%" as any }}>
          <Thead>
            <Tr>
              <Th>Col A</Th>
              <Th>Col B</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Detectar el sufijo `%` explícitamente y tratarlo
distinto (rechazar con warning, o resolverlo contra las dimensiones
reales si `@react-pdf/renderer` llega a soportarlo para `borderRadius`).

---

<a id="15"></a>
## 15. `toFixed(2)` deja desfase de subpíxel en anchos por `colSpan`

**Descripción.** Con números de columnas que no dividen 100 exactamente
(ej. 3 columnas), `((100/3).toFixed(2))` × 3 no da exactamente 100.

**Cómo replicarlo.**

```tsx
// Bug15_SubpixelRoundingGap.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

// FALLA ESPERADA: con 3 columnas automáticas, cada una recibe
// (100/3).toFixed(2) = 33.33%. Sumadas dan 99.99%, no 100%. En modo
// not-grid (sin líneas que disimulen el hueco) y con un borde exterior
// muy visible, se puede notar un desfase de subpíxel en el margen
// derecho.
export default function Bug15_SubpixelRoundingGap() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table
          grid="not-grid"
          style={{ borderWidth: 2, borderColor: "red" } as any}
        >
          <Thead>
            <Tr>
              <Th>A</Th>
              <Th>B</Th>
              <Th>C</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>2</Td>
              <Td>3</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** No redondear con `toFixed(2)` para todas las
columnas: calcular la última columna como el resto exacto hasta 100%
(`100 - sum(anteriores)`), o usar más decimales de precisión.

---

<a id="16"></a>
## 16. Una fila puede partirse a la mitad entre dos páginas

**Descripción.** `Tr` es una `View` sin `wrap={false}`. Por defecto,
`View`/`Text`/`Link` son "breakables" en `@react-pdf/renderer`: si el
límite de página cae en medio de una fila, el contenido de una celda
puede continuar en la página siguiente mientras el resto de esa fila
queda en la anterior.

**Cómo replicarlo.**

```tsx
// Bug16_RowSplitAcrossPage.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

const filas = Array.from({ length: 45 }, (_, i) => i + 1);

// FALLA ESPERADA: con 45 filas de alto default (22) más el header, la
// tabla supera el alto de una A4. Como Tr no tiene wrap={false}, alguna
// fila puede quedar cortada justo en el límite de la página en vez de
// pasar entera a la página siguiente.
export default function Bug16_RowSplitAcrossPage() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Descripción</Th>
              <Th>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filas.map((n) => (
              <Tr key={n}>
                <Td>{n}</Td>
                <Td>Ítem de ejemplo número {n}</Td>
                <Td>${(n * 12.5).toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Agregar `wrap={false}` a `Tr` (ver también el
punto 18 por las contras de esto), o exponer un prop `preventRowSplit`
en `Table` que lo aplique.

---

<a id="17"></a>
## 17. El header no se repite en tablas de varias páginas

**Descripción.** `Thead` se renderiza una sola vez. `@react-pdf/renderer`
no tiene una función nativa de "repetir encabezado de tabla en cada
página" — es un pedido abierto en el repo de la librería, no algo
resuelto de fábrica.

**Cómo replicarlo.**

```tsx
// Bug17_HeaderNotRepeated.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

const filas = Array.from({ length: 45 }, (_, i) => i + 1);

// FALLA ESPERADA: la tabla ocupa 2+ páginas (mismo dataset que Bug16).
// El Thead se pinta una sola vez al principio: en la página 2 en
// adelante, las filas del body aparecen SIN ningún encabezado arriba.
export default function Bug17_HeaderNotRepeated() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Descripción</Th>
              <Th>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filas.map((n) => (
              <Tr key={n}>
                <Td>{n}</Td>
                <Td>Ítem de ejemplo número {n}</Td>
                <Td>${(n * 12.5).toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Pre-paginar los datos manualmente antes de
renderizar (calcular cuántas filas entran por página según `cellHeight`
y alto disponible) y volver a insertar un `<Thead>` al principio de cada
bloque de filas, en vez de un único `Tbody` continuo.

---

<a id="18"></a>
## 18. `wrap={false}` como arreglo manual tiene sus propios bugs

**Descripción.** Si se soluciona el punto 16 agregando `wrap={false}` a
`Tr`, hay reportes en el repo de `@react-pdf/renderer` de que una `View`
no-partible más alta que una página entera puede colgar el render en un
bucle infinito, o renderizarse en la página incorrecta con el contenido
excediendo el límite de la hoja.

**Cómo replicarlo.**

```tsx
// Bug18_WrapFalseTooTallRow.tsx
import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Table, Thead, Tbody, Tr, Th, Td } from "./Tablet";

const styles = StyleSheet.create({ page: { padding: 30 } });

const textoLargo = Array.from(
  { length: 250 },
  (_, i) => `línea de contenido repetida número ${i + 1}`
).join(". ");

// FALLA ESPERADA: esta fila usa wrap={false} (el "arreglo" del punto 16)
// pero su contenido es tan largo que la fila termina siendo más alta que
// una página A4 completa. Según reportes de la librería, esto puede
// colgar el render (loop infinito) o renderizarse en la página
// incorrecta con contenido excediendo el límite de la hoja, en vez de
// simplemente continuar de forma prolija en la página siguiente.
export default function Bug18_WrapFalseTooTallRow() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Table grid="grid">
          <Thead>
            <Tr>
              <Th>Campo</Th>
              <Th>Contenido</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* @ts-expect-error: wrap no está en CellProps/TableProps pero
                se reenvía igual vía [key:string]:any -> ...rest */}
            <Tr wrap={false}>
              <Td>Nota larga</Td>
              <Td>{textoLargo}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Page>
    </Document>
  );
}
```

**Solución posible.** Tratar `wrap={false}` como mitigación parcial, no
como solución garantizada: limitar el largo de texto por celda, o
validar en desarrollo que ninguna fila individual pueda superar la
altura máxima de página antes de habilitar `wrap={false}` de forma
global.

---

<a id="resumen"></a>
## Resumen de prioridad sugerida

| # | Problema | Se nota sin datos reales | Impacto típico |
|---|----------|---------------------------|-----------------|
| 5 | Anchos mixtos fijo+% | Sí | Alto — overflow visual inmediato |
| 6 | Cero falsy en borde | Sí | Alto — borde no deseado, difícil de debuggear |
| 12 | colSpan desalineado | Solo con error humano | Medio — desalineación silenciosa |
| 16–18 | Paginación | Solo con muchas filas | Alto en producción con datos reales |
| 8 | Sin `rowSpan` | Sí (al intentarlo) | Medio — feature faltante, no bug silencioso |
| 7 | `not-grid` ignora borde | Sí | Bajo/Medio — caso de uso de nicho |
| resto | Fugas de tipos/props | Depende del uso | Bajo — mayormente cosmético/confuso |