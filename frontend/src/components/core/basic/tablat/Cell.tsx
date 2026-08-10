import React, { useContext } from "react";
import { View, Text } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import type { CellProps, CellBaseProps } from "./types";

/* ================= CELL (base compartida por Th y Td) =================
 *
 * Th y Td compartían casi toda su implementación letra por letra. Lo
 * único que de verdad cambia entre uno y otro es:
 *
 *   1. El estilo base: `styles.th` (fontWeight bold) vs `styles.td`.
 *   2. El fondo zebra: SOLO Td lo tiene — Th nunca alterna color de fondo.
 *   3. Qué esquina redondea cada uno: Th redondea las de ARRIBA (solo
 *      en la primera/última columna), Td redondea las de ABAJO (solo en
 *      la última fila, primera/última columna). Ver el bloque de radios
 *      más abajo para el motivo exacto.
 *
 * `variant` decide esas tres diferencias; todo lo demás vive acá una
 * sola vez. `Th`/`Td` son wrappers finos con la misma firma pública de
 * siempre.
 *
 * --- Por qué colSpan/rowSpan no son primitivos reales acá ---
 * @react-pdf/renderer no tiene motor de tabla: usa Yoga (flexbox) sobre
 * Views. No existe merge de celdas a nivel de renderer, así que:
 *
 *   - `colSpan` SÍ se simula, y funciona bien: como es horizontal y
 *     ocurre dentro del mismo `Tr` (un View con flexDirection: row), Tr
 *     puede calcular, con toda la info a mano (sus propios children y el
 *     total de unidades de la fila), un `width` proporcional más grande
 *     para esa celda. Es simplemente flexbox estirando un elemento; no
 *     hay fusión real, solo una celda más ancha que las demás. Por eso
 *     `Cell` ya no hace nada con `colSpan` — se recibe acá únicamente
 *     para excluirlo de `rest` y que no se filtre al `View` nativo; el
 *     cálculo real vive en `Tr`.
 *
 *   - `rowSpan` NO se soporta, a propósito. Fusionar verticalmente
 *     requeriría que una celda de la fila N invada el espacio de las
 *     filas N+1, N+2, y que esas filas siguientes sepan que esa columna
 *     ya está "tomada" para no dibujar su propia celda ahí. Pero cada
 *     `Tr` es un View hermano independiente en el árbol de layout: no
 *     tiene visibilidad de lo que renderizó el `Tr` anterior. Resolverlo
 *     de verdad exigiría estado compartido en `Tbody` rastreando
 *     ocupación por columna entre filas, más posicionamiento fuera del
 *     flujo normal de flexbox (con los riesgos que eso trae en paginado
 *     de PDF). No es una limitación de cálculo (el alto en sí es trivial:
 *     `rowSpan * cellHeight`), es que ningún componente del árbol tiene
 *     el contexto para actuar sobre ese número. Por eso no existe como
 *     prop de `CellProps`: si se necesita el efecto visual, la solución
 *     es un `View` posicionado a mano por fuera del modelo de `Tr`, como
 *     caso especial — no una feature genérica de `Cell`.
 * ======================================================================= */

const Cell: React.FC<CellBaseProps> = ({
  children,
  style,
  width,
  height,
  isFirst = false,
  isLast = false,
  isLastRow = false,
  isOdd = false,
  textAlign: propTextAlign,
  text = true,
  variant,
  colSpan, // se consume acá solo para excluirlo de rest; ya fue resuelto en Tr
  ...rest
}) => {
  const { cellHeight, textAlign, borderColor, textColor, zebraColor, zebra, grid, innerRadius } =
    useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";
  const isHeader = variant === "th";

  return (
    <View
      style={[
        isHeader ? styles.th : styles.td,
        {
          width, // ya resuelto en Tr, colSpan incluido
          borderColor,
          minHeight: height ?? cellHeight,
          // Zebra es exclusivo de Td: Th nunca alterna color de fondo.
          backgroundColor: !isHeader && zebra && isOdd ? zebraColor : undefined,
        },
        grid === "grid" && {
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
        },
        // not-grid no dibuja borde (@react-pdf/renderer no soporta
        // colores "transparentes"), pero compensa con padding el mismo
        // pixel que ocuparía la línea de grid, para que el tamaño de
        // celda no cambie entre modos.
        grid === "not-grid" && {
          paddingRight: isLast ? 8 : 9,
          paddingBottom: isLastRow ? 0 : 1,
        },
        // Redondeo de esquina superior en el Th de la primera/última
        // columna: Thead SÍ redondea su propio View contenedor
        // (ver Thead.tsx), pero eso solo se nota si el fondo de la
        // cabecera vive en ESE View — con `context.headerBackground`, o
        // con `style` puesto directo en `Thead`. Si el usuario pone
        // `backgroundColor` en el `Th` (como suele hacerse para pintar
        // la cabecera con un color propio), cada `Th` es una View
        // cuadrada aparte que pinta por encima del contenedor
        // redondeado — el radio del contenedor deja de tener efecto
        // visual y asoma un "pico" cuadrado en la esquina. Por eso acá
        // TAMBIÉN se redondea el propio `Th`, igual que ya se hace con
        // el `Td` de la última fila más abajo. Poner el radio en ambos
        // niveles (contenedor de Thead y celda) es seguro y no dobla el
        // efecto: si el `Th` no trae `backgroundColor` propio, redondear
        // una View transparente no cambia nada visualmente.
        isHeader && isFirst && innerRadius.topLeft
          ? { borderTopLeftRadius: innerRadius.topLeft }
          : null,
        isHeader && isLast && innerRadius.topRight
          ? { borderTopRightRadius: innerRadius.topRight }
          : null,
        // Redondeo de esquina inferior en la última fila: solo Td, mismo
        // motivo que arriba pero para el borde de abajo — un `Td` con
        // `backgroundColor` propio en la última fila (ej. una fila de
        // "Total") tapa el radio que ya aplica `Table.tsx`/el contenedor
        // si no se redondea acá también. Cada condición chequea su
        // propio valor de esquina (bottomLeft/bottomRight), no el objeto
        // innerRadius genérico — así no se redondea una esquina cuyo
        // radio efectivo es 0 aunque otra esquina de la tabla sí tenga
        // radio.
        !isHeader && isLastRow && isFirst && innerRadius.bottomLeft
          ? { borderBottomLeftRadius: innerRadius.bottomLeft }
          : null,
        !isHeader && isLastRow && isLast && innerRadius.bottomRight
          ? { borderBottomRightRadius: innerRadius.bottomRight }
          : null,
        style,
      ]}
      {...rest}
    >
      {text
        ? children != null && (
            <Text style={{ textAlign: finalTextAlign, color: textColor }}>
              {children}
            </Text>
          )
        : children}
    </View>
  );
};

/* ================= TH ================= */

const Th: React.FC<CellProps> = (props) => {
  return <Cell {...props} variant="th" />;
};

/* ================= TD ================= */

const Td: React.FC<CellProps> = (props) => {
  return <Cell {...props} variant="td" />;
};

export { Th, Td };