# Bugs y limitaciones — `Tablet.tsx`

Relevamiento de problemas encontrados en el componente de tabla para
`@react-pdf/renderer`. Se dividen en tres grupos:

- **A. Bugs de lógica propios del archivo** (fugas de props, cálculos
  incorrectos, edge cases del tipado).
- **B. Limitaciones estructurales** (funcionalidad que el componente no
  contempla, como `rowSpan`).
- **C. Riesgos heredados de `@react-pdf/renderer`** (paginación), no
  causados por este archivo pero tampoco mitigados por él.

Cada punto incluye: descripción, cómo reproducirlo, y una solución posible.

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

---

<a id="1"></a>
## 1. `isFirst`/`isOdd` se filtran hacia la `View` en `Th`

**Descripción.** `Tr` clona cada celda con `isFirst`, `isLast`, `isLastRow`,
`isOdd`. `Td` destructura las cuatro; `Th` solo destructura `isLast` e
`isLastRow`. `isFirst` e `isOdd` caen en `...rest` de `Th` y se pasan como
atributos sueltos a la `View` final, sin haber sido consumidos.

**Cómo replicarlo.**
```tsx
<Thead>
  <Tr>
    <Th>Col A</Th> {/* recibe isFirst=true, isOdd=false igual */}
    <Th>Col B</Th>
  </Tr>
</Thead>
```
Con `debug` en la `View` de `@react-pdf/renderer`, o inspeccionando el árbol
de props en devtools/logs, vas a ver `isFirst`/`isOdd` llegando a `Th` sin
uso, cosa que no pasa en `Td`.

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
<Table grid="grid" style={{ borderRadius: 16 }}>
  <Thead><Tr><Th>A</Th><Th>B</Th><Th>C</Th></Tr></Thead>
  <Tbody>
    <Tr><Td>1</Td><Td>2</Td><Td>3</Td></Tr>
    <Tr><Td>4</Td><Td>5</Td><Td>6</Td></Tr> {/* última fila */}
  </Tbody>
</Table>
```
Mirá de cerca la esquina inferior-izquierda de la tabla renderizada: si la
curva sale distorsionada (no es un arco limpio), el bug se reprodujo.

**Solución posible.** En la celda que combina ambas cosas, no dibujar el
borde como stroke normal: simular esa línea puntual con un `View` fino
adicional (mismo truco que ya usa `Table`), o quitar el borde interno justo
en el lado que coincide con la esquina redondeada de esa celda.

---

<a id="3"></a>
## 3. `Tbody` esparce `...rest` sobre todos los `Tr`

**Descripción.** A diferencia de `Table`/`Thead`, que aplican `{...rest}`
a su propio nodo, `Tbody` no tiene `View` propia — así que cualquier prop
extra pasada a `<Tbody>` se replica en **cada** `<Tr>`, y de ahí, si `Tr`
tampoco la consume, sigue cayendo hasta la `View` de cada fila.

**Cómo replicarlo.**
```tsx
<Tbody id="totales" debug> {/* pensado para Tbody, se repite en cada Tr */}
  <Tr><Td>1</Td></Tr>
  <Tr><Td>2</Td></Tr>
</Tbody>
```
Con `debug` vas a ver el recuadro de depuración dibujado en **cada fila**,
no una sola vez a nivel "cuerpo de tabla".

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
<Table grid="grid" style={{ borderRadius: 10, borderTopColor: "blue" }}>
  {/* ... */}
</Table>
```

**Solución posible.** Extender `extractBorderColor`/`extractBorderWidth`
para revisar también las variantes por lado como fallback, o documentar
que el "radius fix" solo soporta bordes uniformes.

---

<a id="5"></a>
## 5. Anchos mixtos fijo + porcentual → la fila supera el 100%

**Descripción.** `totalUnits` cuenta toda celda (incluida una con `width`
fijo) como "una unidad más" para el reparto porcentual de las demás,
en vez de restar primero el espacio que la celda fija va a ocupar.

**Cómo replicarlo.**
```tsx
<Tr>
  <Td width="80px">ID</Td>  {/* fija */}
  <Td>Nombre</Td>           {/* automática: 33.33% */}
  <Td>Email</Td>            {/* automática: 33.33% */}
</Tr>
```
80px + 66.66% del contenedor supera el 100% disponible → overflow visible
o superposición con el borde/página.

**Solución posible.** Antes de repartir el % entre las celdas automáticas,
restar el ancho de las celdas con `width` fijo del total disponible (esto
requiere conocer el ancho absoluto del contenedor, no solo porcentajes), o
documentar que no se debe mezclar `width` fijo con automático en una misma
fila.

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
<Table grid="grid" style={{ borderWidth: 0, borderRadius: 16 }}>
  {/* debería verse SIN ningún trazo alrededor; aparece un marco negro */}
</Table>
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
<Table grid="not-grid" style={{ borderWidth: 2, borderColor: "red" }}>
  {/* debería verse un marco rojo de 2pt; no aparece ninguno */}
</Table>
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
<Tr>
  <Td rowSpan={2}>Categoría A</Td>
  <Td>Producto 1</Td>
</Tr>
<Tr>
  <Td>Producto 2</Td> {/* fila queda con 1 columna menos que el header */}
</Tr>
```

**Solución posible.** Implementar tracking real de grid: `Tbody` necesita
saber, para cada fila, qué columnas ya están "ocupadas" por un `rowSpan`
de una fila anterior, y saltarlas al calcular `totalUnits`/posiciones. Es
un cambio no trivial (deja de ser un cálculo por-fila aislado).

---

<a id="9"></a>
## 9. Filas envueltas en un componente propio rompen `isOdd`/`isLastRow`

**Descripción.** `Tbody` usa `cloneElement` sobre sus hijos directos. Si
un `<Tr>` está renderizado por dentro de un componente propio, `cloneElement`
le inyecta las props al *wrapper*, no al `<Tr>` interno.

**Cómo replicarlo.**
```tsx
const CustomRow = ({ label, value }: any) => (
  <Tr><Td>{label}</Td><Td>{value}</Td></Tr>
);

<Tbody zebra>
  <CustomRow label="Fila 1" value="A" />
  <CustomRow label="Fila 2" value="B" /> {/* debería tener fondo zebra */}
</Tbody>
```
Ninguna fila queda con fondo zebra pese a `zebra` activo.

**Solución posible.** Documentar que `Tbody` solo soporta `Tr` como hijo
directo (o array/fragmento de `Tr`), o rediseñar el cálculo de índice para
que cada `Tr` lo obtenga de un contador en `TableContext` en vez de
depender de `cloneElement` desde `Tbody`.

---

<a id="10"></a>
## 10. Props de tabla se filtran sin efecto (`textAlign`, `cellHeight`, ...)

**Descripción.** `Table` nunca lee `textAlign` de sus props — su contexto
trae `textAlign: "left"` hard-codeado. Y props como `cellHeight` pasadas a
`Tbody` no se usan: se reparten a cada `Tr`, que tampoco las consume, y
terminan como atributos sueltos en la `View` de la fila.

**Cómo replicarlo.**
```tsx
{/* @ts-expect-error */}
<Table textAlign="center">  {/* no hace nada, sigue alineado a la izquierda */}
  {/* ... */}
  {/* @ts-expect-error */}
  <Tbody cellHeight={40}>   {/* no hace nada, las celdas siguen en 22 */}
    {/* ... */}
  </Tbody>
</Table>
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
<Table grid="grid" background="#cce5ff">
  {/* sin borderRadius en style: el fondo celeste nunca se pinta */}
</Table>
```

**Solución posible.** Aplicar `background` como `backgroundColor` base del
contenedor de contenido siempre, no solo dentro de `useRadiusFix`:
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
<Thead><Tr><Th>A</Th><Th>B</Th><Th>C</Th></Tr></Thead>
<Tbody>
  <Tr><Td>1</Td><Td>2</Td><Td>3</Td></Tr>
  <Tr><Td>4</Td><Td>5</Td></Tr> {/* falta la 3ra celda */}
</Tbody>
```
Las líneas verticales de grid de la segunda fila no coinciden en X con
las del header.

**Solución posible.** Calcular `totalUnits` una sola vez a nivel `Table`
(a partir del `Thead`, o de un prop explícito `columns={3}`) y pasarlo por
`TableContext`, en vez de recalcularlo de forma aislada en cada `Tr`.

---

<a id="13"></a>
## 13. `grid` mal tipeado cae en silencio en modo "modern"

**Descripción.** Un valor de `grid` no reconocido (typo, valor dinámico
inválido) no lanza error: como ninguna de las comparaciones (`"grid"`,
`"not-grid"`) da `true`, el comportamiento resultante equivale al de
`"modern"` sin que quede explícito en ningún lado.

**Cómo replicarlo.**
```tsx
{/* @ts-expect-error */}
<Table grid="Grid">  {/* typo: mayúscula */}
  {/* se comporta como "modern", sin aviso */}
</Table>
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
<Table style={{ borderRadius: "50%" as any }}>
  {/* outerRadius termina siendo 50, no un porcentaje relativo */}
</Table>
```

**Solución posible.** Detectar el sufijo `%` explícitamente y tratarlo
distinto (rechazar con warning, o resolverlo contra las dimensiones reales
si `@react-pdf/renderer` llega a soportarlo para `borderRadius`).

---

<a id="15"></a>
## 15. `toFixed(2)` deja desfase de subpíxel en anchos por `colSpan`

**Descripción.** Con números de columnas que no dividen 100 exactamente
(ej. 3 columnas), `((100/3).toFixed(2))` × 3 no da exactamente 100.

**Cómo replicarlo.**
```tsx
<Tr><Td>1</Td><Td>2</Td><Td>3</Td></Tr>
{/* 33.33% × 3 = 99.99%, no 100% */}
```
Con `grid="not-grid"` (sin líneas que disimulen el hueco), un borde de
tabla muy visible puede dejar ver el desfase en el margen derecho.

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

**Cómo replicarlo.** Generar una tabla con suficientes filas (o texto
largo en una celda) para que el corte de página caiga justo en medio de
una fila — por ejemplo, 40+ filas en una página A4 con `cellHeight`
default, o una celda con un párrafo largo cerca del pie de página.

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

**Cómo replicarlo.** Igual que el punto 16: forzar que la tabla ocupe 2+
páginas. La página 2 en adelante no va a tener `Thead`.

**Solución posible.** Pre-paginar los datos manualmente antes de
renderizar (calcular cuántas filas entran por página según `cellHeight` y
alto disponible) y volver a insertar un `<Thead>` al principio de cada
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
<Tr wrap={false}>
  <Td>{/* texto muy largo, multilínea, que supera el alto de una página */}</Td>
</Tr>
```

**Solución posible.** Tratar `wrap={false}` como mitigación parcial, no
como solución garantizada: limitar el largo de texto por celda, o validar
en desarrollo que ninguna fila individual pueda superar la altura máxima
de página antes de habilitar `wrap={false}` de forma global.

---

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