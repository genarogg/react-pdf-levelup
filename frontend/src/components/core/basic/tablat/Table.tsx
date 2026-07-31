import React from "react";
import { View } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import { resolveBorderRadiusFix } from "./border-radius-fix";
import { BorderRadiusSvgOverlay } from "./border-radius-svg-fix";
import { Thead } from "./Thead";
import { Tbody } from "./Tbody";
import type { TableProps, RowsPerPageEntry } from "./types";

/**
 * Todo lo que antes era `Table` a secas. Renderiza UNA tabla — el
 * sándwich de border-radius (método "view" o "svg"), el
 * `TableContext.Provider`, todo igual que siempre. Se separó de `Table`
 * (ver más abajo) para que `rowsPerPage` pueda renderizar N de estas,
 * una por página, sin duplicar la lógica del fix de border-radius.
 *
 * No se exporta: `Table` es la única entrada pública, igual que antes.
 */
const SingleTable: React.FC<TableProps> = ({
  children,
  style,
  cellHeight = 22,
  borderColor = "#000",
  textColor = "#000",
  headerBackground = "#ccc",
  zebraColor = "#eeeeee",
  zebra = true,
  grid = "grid",
  borderRadiusMethod = "view",
  ...rest
}) => {
  const {
    useFix,
    method,
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    backgroundColor,
    restStyle,
  } = resolveBorderRadiusFix(style, grid, borderColor, borderRadiusMethod);

  const isViewFix = useFix && method === "view";
  const isSvgFix = useFix && method === "svg";

  // Capa de fondo del cuerpo: obligatoria SOLO en el método "view". Sin
  // ella, las celdas sin backgroundColor propio (filas no-zebra) dejarían
  // ver el outerBorderColor que llena toda la View exterior. También le
  // damos su propio borderRadius (innerRadius) para que sus esquinas no
  // asomen cuadradas por debajo de la curva del borde exterior. El color
  // sale del `backgroundColor` que el usuario haya puesto en `style`; si
  // no puso ninguno, queda `undefined` — el default nativo de la
  // librería, sin forzar blanco.
  //
  // El método "svg" no arma esta capa: no hay ningún fondo que simular
  // (el borde se dibuja aparte, ver `BorderRadiusSvgOverlay` más abajo),
  // así que `children` se renderiza directo — el interior queda "hueco"
  // salvo que el usuario haya puesto su propio backgroundColor en
  // `style` (que sí se respeta: `resolveBorderRadiusFixSvg` no lo saca
  // de `restStyle`).
  const content = isViewFix ? (
    <View style={{ backgroundColor, borderRadius: innerRadius }}>{children}</View>
  ) : (
    children
  );

  return (
    <TableContext.Provider
      value={{
        cellHeight,
        textAlign: "left",
        borderColor,
        textColor,
        headerBackground,
        zebraColor,
        zebra,
        grid,
        outerRadius,
        outerBorderWidth,
        innerRadius,
        borderRadiusMethod: method,
      }}
    >
      <View
        style={[
          styles.table,
          // Si useFix ya está activo (cualquiera de los dos métodos), el
          // borde fino de grid="grid" queda absorbido por esa simulación
          // (backgroundColor+padding en "view", padding+Svg en "svg"), así
          // que no lo agregamos aparte: hacerlo reintroduciría el mismo
          // combo borderWidth+borderRadius que causa el bug #395.
          grid === "grid" && !useFix && {
            borderWidth: 1,
            borderColor,
          },
          isViewFix
            ? {
                backgroundColor: outerBorderColor,
                borderRadius: outerRadius,
                padding: outerBorderWidth,
              }
            : null,
          // "svg" SÍ necesita `borderRadius: outerRadius` acá, aunque el
          // trazo real lo dibuje `BorderRadiusSvgOverlay` aparte: sin
          // esto, el `backgroundColor` que el usuario haya puesto en
          // `style` (que `restStyle` deja pasar tal cual, ver
          // `resolveBorderRadiusFixSvg`) se pintaría CUADRADO en esta
          // View, asomando por detrás de la curva del trazo en las 4
          // esquinas. Agregar `borderRadius` acá es seguro — no dispara
          // el bug #395 — porque esta View NO tiene `borderWidth` real
          // (lo saca `restStyle`): el bug es específicamente
          // borderWidth+borderRadius juntos, no backgroundColor+
          // borderRadius. `position: relative` sirve de referencia para
          // el overlay absoluto, y el mismo `padding: outerBorderWidth`
          // que "view" usa evita que el contenido quede pegado contra
          // el trazo.
          isSvgFix
            ? {
                position: "relative",
                padding: outerBorderWidth,
                borderRadius: outerRadius,
              }
            : null,
          restStyle,
        ]}
        {...rest}
      >
        {content}
        {isSvgFix && (
          <BorderRadiusSvgOverlay
            outerRadius={outerRadius}
            outerBorderWidth={outerBorderWidth}
            outerBorderColor={outerBorderColor}
          />
        )}
      </View>
    </TableContext.Provider>
  );
};

/**
 * Una tanda ya resuelta: sus filas y si esa tanda fuerza salto de
 * página. Es el resultado de `chunkRowsByPage` — separado de
 * `RowsPerPageEntry` porque acá `rows` ya son elementos reales, no una
 * cantidad.
 */
interface ResolvedPage {
  rows: React.ReactElement[];
  pageBreak: boolean;
}

/**
 * Divide las filas de `Tbody` en tandas según `rowsPerPage` — no
 * acumulado, cada entrada define la cantidad de filas Y el `break` de
 * ESA tanda. Si `rows` tiene más filas de las que cubren las entradas,
 * seguimos cortando repitiendo la ÚLTIMA entrada completa (mismo
 * `nRow` y mismo `break` — ver el comentario de `rowsPerPage` en
 * `types.ts`).
 *
 * Un `Tbody` vacío igual devuelve UNA tanda vacía sin `break` — para
 * que la tabla siga mostrando el `Thead` aunque no tenga filas — en
 * vez de `[]`, que haría que `Table` no renderice absolutamente nada.
 */
function chunkRowsByPage(
  rows: React.ReactElement[],
  rowsPerPage: RowsPerPageEntry[]
): ResolvedPage[] {
  if (rows.length === 0) return [{ rows: [], pageBreak: false }];

  const pages: ResolvedPage[] = [];
  let i = 0;
  let pageIdx = 0;
  while (i < rows.length) {
    const entry = rowsPerPage[Math.min(pageIdx, rowsPerPage.length - 1)];
    const size = entry?.nRow;
    // Un tamaño inválido (0, negativo, undefined) frenaría el loop para
    // siempre — en vez de eso, metemos todo lo que queda en una última
    // tanda (con el `break` de esa misma entrada, si vino) y cortamos ahí.
    if (!size || size <= 0) {
      pages.push({ rows: rows.slice(i), pageBreak: Boolean(entry?.break) });
      break;
    }
    pages.push({ rows: rows.slice(i, i + size), pageBreak: Boolean(entry.break) });
    i += size;
    pageIdx++;
  }
  return pages;
}

/**
 * Punto de entrada público. Sin `rowsPerPage`, es un pass-through directo
 * a `SingleTable` — cero cambio de comportamiento para quien no use la
 * funcionalidad nueva.
 *
 * Con `rowsPerPage`, en vez de UN `SingleTable` con todas las filas
 * (que @react-pdf partiría solo, en medio de una fila, sin cierre ni
 * apertura prolijos — ver la conversación que motivó esto), se renderizan
 * VARIOS `SingleTable` independientes — cada uno con su propio `Thead`
 * repetido y su propio borde/esquinas de punta a punta.
 *
 * En este modo `break` deja de ser una prop de nivel `Table`: si se
 * pasa `break` junto con `rowsPerPage` (y hay split real), se ignora
 * sin error. El salto de página de cada tanda se controla ÚNICAMENTE
 * con el `break` de su propia entrada en `rowsPerPage` (ver el
 * comentario de `RowsPerPageEntry`/`rowsPerPage` en `types.ts`) — si
 * una entrada no trae `break`, esa tanda no salta (default `false`).
 * `break` de nivel `Table` solo vuelve a ser respetado si `rowsPerPage`
 * no dispara ningún split (sin prop, vacío, o sin la estructura
 * Thead/Tbody esperada).
 */
const Table: React.FC<TableProps> = ({
  rowsPerPage,
  children,
  break: userBreak,
  ...rest
}) => {
  // Sin `rowsPerPage`: comportamiento normal, `break` sigue siendo 100%
  // controlable por quien use `Table` (pass-through directo a `SingleTable`).
  if (!rowsPerPage || rowsPerPage.length === 0) {
    return (
      <SingleTable break={userBreak} {...rest}>
        {children}
      </SingleTable>
    );
  }

  const childArray = React.Children.toArray(children) as React.ReactElement[];
  const theadElement = childArray.find((child) => child.type === Thead);
  const tbodyElement = childArray.find((child) => child.type === Tbody);

  // Si no encontramos la estructura esperada (un Thead y un Tbody entre
  // los hijos), no arriesgamos romper el render de quien esté usando
  // `Table` de otra forma: caemos al comportamiento normal, sin partir
  // nada — `rowsPerPage` simplemente no tiene efecto en ese caso. Acá sí
  // se respeta `userBreak`, porque en los hechos no se está usando
  // `rowsPerPage` (no hubo split).
  if (!theadElement || !tbodyElement) {
    return (
      <SingleTable break={userBreak} {...rest}>
        {children}
      </SingleTable>
    );
  }

  const rows = React.Children.toArray(
    (tbodyElement.props as { children?: React.ReactNode }).children
  ) as React.ReactElement[];

  const pages = chunkRowsByPage(rows, rowsPerPage);

  // Con `rowsPerPage` activo y split real, `userBreak` se descarta (ni
  // siquiera se lee): cada tanda usa el `break` que ya viene resuelto
  // en su propio `ResolvedPage.pageBreak`, calculado por
  // `chunkRowsByPage` a partir del `break` de su entrada en
  // `rowsPerPage` (default `false` si la entrada no lo especifica).
  return (
    <>
      {pages.map((page, idx) => (
        <SingleTable key={idx} {...rest} break={page.pageBreak}>
          {theadElement}
          <Tbody {...(tbodyElement.props as object)}>{page.rows}</Tbody>
        </SingleTable>
      ))}
    </>
  );
};

export { Table };