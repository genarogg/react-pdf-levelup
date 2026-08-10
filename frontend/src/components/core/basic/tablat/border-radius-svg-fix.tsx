import React from "react";
import { View, Svg, Path } from "@react-pdf/renderer";
import {
  flattenStyle,
  extractBorderWidth,
  extractBorderColor,
  extractCornerRadii,
  innerRadiiOf,
  omitKeys,
  BORDER_SHORTHAND_KEYS,
  type CornerRadii,
} from "./style-utils";
import type { GridMode } from "./types";
import type { BorderRadiusFixResult } from "./border-radius-fix";

/* =====================================================================
 * Método "svg" del bug #395 (ver `border-radius-fix.ts` para el detalle
 * completo del bug). La diferencia con el método "view":
 *
 *   - "view" simula el borde con backgroundColor + padding en un View
 *     exterior. Funciona, pero ese backgroundColor SIEMPRE cubre toda
 *     la tabla — no hay forma de dejar el interior sin ningún fondo.
 *   - "svg" dibuja el contorno redondeado aparte, superpuesto al
 *     contenido real, sin fill. El interior de la tabla queda
 *     exactamente como el usuario lo dejó — "hueco" si no puso
 *     `backgroundColor`, o con el color que haya puesto.
 *
 * ESTE ARCHIVO NO USA UN ÚNICO <Rect> GIGANTE por lo que dice el bloque
 * de comentarios de `BorderRadiusSvgOverlay` más abajo — en resumen,
 * `<Rect>` no soporta width/height en porcentaje en esta versión de
 * @react-pdf/renderer, y un `<Svg>` absoluto estirado por los 4 bordes
 * (sin width/height explícito) tampoco calcula bien su propio tamaño.
 * Verificado a mano, renderizando y midiendo píxeles, antes de asumir
 * que "debería" funcionar por como está documentado.
 *
 * Este archivo NO importa nada de `border-radius-fix.ts` salvo el TIPO
 * `BorderRadiusFixResult` (se borra en compilación, no genera
 * dependencia real) — lo que necesita compartir con el método "view"
 * (`BORDER_SHORTHAND_KEYS`) vive en `style-utils.ts`, para que
 * `border-radius-fix.ts` pueda importar el método "svg" desde acá sin
 * armar una dependencia circular entre los dos archivos.
 * ===================================================================== */

export function resolveBorderRadiusFixSvg(
  style: any,
  grid: GridMode,
  borderColor: string
): BorderRadiusFixResult {
  const flatStyle = flattenStyle(style);
  const outerRadius = extractCornerRadii(flatStyle);
  const styleBorderWidth = extractBorderWidth(flatStyle);

  const gridBorderWidth = grid === "grid" ? 1 : 0;
  const hasExplicitBorderWidth =
    flatStyle.borderWidth !== undefined || typeof flatStyle.border === "string";
  const outerBorderWidth = hasExplicitBorderWidth ? styleBorderWidth : gridBorderWidth;
  const outerBorderColor = extractBorderColor(flatStyle) ?? borderColor;

  // Igual que en "view": el fix se dispara si CUALQUIER esquina tiene
  // radio explícito, no solo cuando las 4 lo tienen.
  const useFix = Object.values(outerRadius).some((r) => r > 0);
  // Mismo valor que ya consumen Thead/Cell desde TableContext para
  // redondear sus propias esquinas (issue #640: el overflow no las
  // recorta, así que se redondean a mano). Clave que "svg" calcule esto
  // IGUAL que "view" — el contorno de `BorderRadiusSvgOverlay` está
  // armado para terminar su borde interior justo en este radio.
  const innerRadius = innerRadiiOf(outerRadius, outerBorderWidth);

  // A diferencia de "view", acá no se arma ningún sándwich de Views ni
  // se reserva el `backgroundColor` del usuario para una capa aparte —
  // el borde se dibuja superpuesto (ver `BorderRadiusSvgOverlay`). Por
  // eso `restStyle` solo saca las keys de borde/radius reales (para no
  // volver a combinar borderWidth+borderRadius en el View exterior —
  // bug #395) y `overflow` (no cumple ninguna función real, issue #640),
  // pero deja pasar `backgroundColor` tal cual — eso permite que la
  // tabla quede "hueca" cuando el usuario no puso ninguno.
  const restStyle = useFix
    ? omitKeys(flatStyle, [...BORDER_SHORTHAND_KEYS, "overflow"])
    : style;

  return {
    useFix,
    method: "svg",
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    // Sin uso real acá (ver el comentario de este campo en
    // `BorderRadiusFixResult`) — se deja por completitud de la interfaz.
    backgroundColor: flatStyle.backgroundColor,
    restStyle,
  };
}

/**
 * Arma el `d` de un arco de 90° para una esquina del contorno.
 *
 * `R` es `outerRadius` (el radio real de la tabla — también el tamaño,
 * en puntos, de la cajita cuadrada `R×R` que ocupa esta esquina) y `r`
 * es el radio de la LÍNEA CENTRAL del trazo (`R - strokeWidth/2` — ver
 * la explicación completa en `BorderRadiusSvgOverlay`). Las cuatro
 * fórmulas salen de ubicar el centro del arco en la esquina de la
 * cajita `R×R` que corresponde a cada lado de la tabla (ej.: para la
 * esquina superior-izquierda de la TABLA, el centro del arco cae en la
 * esquina inferior-derecha de SU PROPIA cajita `R×R`) y trazar un cuarto
 * de círculo de radio `r` alrededor de ese centro.
 */
function cornerArcPath(corner: "tl" | "tr" | "br" | "bl", R: number, r: number): string {
  switch (corner) {
    case "tl":
      return `M ${R - r},${R} A ${r},${r} 0 0 1 ${R},${R - r}`;
    case "tr":
      return `M 0,${R - r} A ${r},${r} 0 0 1 ${r},${R}`;
    case "br":
      return `M ${r},0 A ${r},${r} 0 0 1 0,${r}`;
    case "bl":
      return `M ${R},${r} A ${r},${r} 0 0 1 ${R - r},0`;
  }
}

export interface BorderRadiusSvgOverlayProps {
  outerRadius: CornerRadii;
  outerBorderWidth: number;
  outerBorderColor: string;
}

/**
 * Dibuja el contorno redondeado del método "svg" como una capa aparte,
 * superpuesta al contenido real de `Table` (ver la rama
 * `method === "svg"` en `Table.tsx`, que la renderiza como ÚLTIMO hijo
 * del View exterior, para que el trazo quede por encima de todo).
 *
 * POR QUÉ 8 PIEZAS (4 arcos + 4 rectas) Y NO UN ÚNICO <Rect>:
 *
 * La primera versión de este archivo intentaba un único
 * `<Svg style={{position:'absolute', top:inset, left:inset, right:inset,
 * bottom:inset}}><Rect width="100%" height="100%" .../></Svg>` — más
 * simple, pero NO renderizaba nada. Se probó a mano, renderizando PDFs
 * reales y midiendo píxeles (no asumiendo por la documentación), y se
 * encontraron dos problemas independientes en esta versión de
 * @react-pdf/renderer:
 *
 *   1. `<Rect>` no soporta `width`/`height` en porcentaje — solo números
 *      absolutos. `width="100%"` no dibuja nada.
 *   2. Un `<Svg>` posicionado `absolute` y "estirado" por los 4 lados
 *      (`top`+`left`+`right`+`bottom`, SIN `width`/`height` explícito)
 *      tampoco calcula bien su propio tamaño — a diferencia de un
 *      `View` normal con ese mismo patrón, que sí funciona perfecto.
 *
 * Como no podemos conocer de antemano el ancho real de la tabla (suele
 * ser `width: "100%"` de la página), no podemos pasarle a un único
 * `<Rect>` un `width` en puntos. La salida: separar el contorno en
 * partes cuyo tamaño SÍ conocemos de antemano sin importar el ancho de
 * la tabla:
 *
 *   - Los 4 ARCOS de las esquinas miden `outerRadius × outerRadius` —
 *     un tamaño FIJO, independiente del ancho de la tabla. Cada uno es
 *     un `<Svg>` con `width`/`height` explícitos (no en porcentaje) y
 *     posicionado con un simple anclaje de 2 lados (ej. `top:0,left:0`
 *     para la esquina superior-izquierda) — sin necesitar "estirarse".
 *   - Los 4 TRAMOS RECTOS (entre esquinas) sí dependen del ancho/alto
 *     real de la tabla, pero son `View`s lisos (`backgroundColor`, sin
 *     `borderWidth`+`borderRadius` combinados — por eso no reintroducen
 *     el bug #395) que SÍ se estiran bien con el patrón de 2 lados
 *     opuestos + la dimensión explícita restante (ej. `left` + `right`
 *     + `height` fijo para el tramo de arriba) — patrón confirmado que
 *     funciona para `View`, a diferencia de `Svg`/`Rect`.
 *
 * GEOMETRÍA (igual razonamiento que la versión anterior, aplicado ahora
 * a cada arco por separado): el `stroke` de SVG se dibuja centrado sobre
 * la línea del `<Path>`. El radio de esa línea central (`r`, ver
 * `cornerArcPath`) tiene que ser `outerRadius - outerBorderWidth / 2`
 * para que, al offsetear el trazo `outerBorderWidth / 2` hacia cada
 * lado, el borde exterior dé exactamente `outerRadius` (el radio real de
 * la tabla) y el borde interior dé `innerRadius` (`outerRadius -
 * outerBorderWidth`) — el mismo valor que usan Thead/Cell para redondear
 * sus propias esquinas. Es exacto, no una aproximación: offsetear un
 * arco circular una distancia constante da otro arco circular con el
 * radio sumado o restado esa misma distancia.
 *
 * `fill="none"`, no `"transparent"`: el parser de color de
 * @react-pdf/renderer no reconoce esa keyword CSS (ver la nota sobre
 * `grid="not-grid"` en `border-radius-fix.ts` — mismo motivo).
 *
 * RADIOS INDEPENDIENTES POR ESQUINA: cada una de las 4 esquinas tiene su
 * propio `R`/`r`/`edgeInset`, calculados con la misma fórmula de siempre
 * pero aplicada individualmente (antes había un único `R` compartido por
 * las 4). Si el `R` de una esquina es `0`, esa esquina no dibuja arco
 * (un arco de radio 0 es degenerado y no aporta nada) — queda cuadrada,
 * y el extremo de cada tramo recto que toca esa esquina usa inset `0`
 * ahí (sin solape, porque no hay arco con el que solapar). Los dos
 * extremos de un mismo tramo pueden así tener insets distintos entre sí
 * cuando sus dos esquinas vecinas tienen radios distintos.
 */
export function BorderRadiusSvgOverlay({
  outerRadius,
  outerBorderWidth,
  outerBorderColor,
}: BorderRadiusSvgOverlayProps) {
  // Sin grosor de borde no hay ningún trazo que dibujar (pasa, por
  // ejemplo, con grid="not-grid" sin borderWidth explícito). El radio de
  // las esquinas en ese caso lo siguen dando Thead/Cell solos.
  if (outerBorderWidth <= 0) {
    return null;
  }

  // R/r por esquina: mismo cálculo que antes (R - strokeWidth/2 para que
  // el trazo centrado dé exactamente outerRadius por fuera e innerRadius
  // por dentro), aplicado a cada una de las 4 por separado.
  const R = {
    tl: outerRadius.topLeft,
    tr: outerRadius.topRight,
    br: outerRadius.bottomRight,
    bl: outerRadius.bottomLeft,
  };
  const r = {
    tl: Math.max(R.tl - outerBorderWidth / 2, 0),
    tr: Math.max(R.tr - outerBorderWidth / 2, 0),
    br: Math.max(R.br - outerBorderWidth / 2, 0),
    bl: Math.max(R.bl - outerBorderWidth / 2, 0),
  };

  // Las piezas se calculan para tocarse justo en el R de cada esquina,
  // sin superponerse ni dejar hueco — en teoría. En la práctica, R no
  // suele ser un número entero de píxeles en el DPI final del PDF, así
  // que cada pieza redondea SU PROPIO límite por separado al rasterizar
  // (la caja del arco redondea "para adentro", la recta redondea "para
  // afuera", o viceversa, según el caso) y puede quedar una columna/fila
  // de menos de 1pt sin cubrir en la costura — se ve como una rayita del
  // color de fondo cortando el borde justo donde el arco termina y
  // empieza la recta. Encontrado renderizando a 600dpi y muestreando
  // píxeles ahí mismo, no a simple vista.
  //
  // El arreglo: las piezas RECTAS (no los arcos) avanzan un toque hacia
  // adentro de cada esquina, solapándose con el arco en vez de terminar
  // justo en el límite teórico. Como ambas piezas pintan el mismo
  // `outerBorderColor`, el solape no se nota (es lo mismo que pintar dos
  // veces encima), pero el hueco de redondeo desaparece. No toco el
  // tamaño de los arcos (`width/height: R`) porque ahí SÍ importa la
  // coordenada exacta para que `cornerArcPath` dé el radio correcto.
  //
  // Con R=0 en una esquina no hay arco con el que solapar — esa esquina
  // es cuadrada de verdad — así que su edgeInset es 0 directamente (sin
  // restar SEAM_OVERLAP, que dejaría un inset negativo-clampeado a 0 de
  // todos modos, pero por las razones equivocadas).
  const SEAM_OVERLAP = 0.5;
  const edgeInset = {
    tl: R.tl > 0 ? Math.max(R.tl - SEAM_OVERLAP, 0) : 0,
    tr: R.tr > 0 ? Math.max(R.tr - SEAM_OVERLAP, 0) : 0,
    br: R.br > 0 ? Math.max(R.br - SEAM_OVERLAP, 0) : 0,
    bl: R.bl > 0 ? Math.max(R.bl - SEAM_OVERLAP, 0) : 0,
  };

  const corner = (name: "tl" | "tr" | "br" | "bl", pos: Record<string, number>) => {
    // Esquina sin radio: nada que dibujar acá, queda cuadrada limpia
    // (sin arco degenerado ni resto de solape — el tramo recto
    // correspondiente ya usa inset 0 en este extremo).
    if (R[name] <= 0) return null;
    return (
      <Svg key={name} style={{ position: "absolute", width: R[name], height: R[name], ...pos }}>
        <Path
          d={cornerArcPath(name, R[name], r[name])}
          stroke={outerBorderColor}
          strokeWidth={outerBorderWidth}
          fill="none"
        />
      </Svg>
    );
  };

  return (
    <>
      {corner("tl", { top: 0, left: 0 })}
      {corner("tr", { top: 0, right: 0 })}
      {corner("br", { bottom: 0, right: 0 })}
      {corner("bl", { bottom: 0, left: 0 })}

      {/* Tramo superior: el extremo izquierdo toca la esquina tl, el derecho toca tr. */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: edgeInset.tl,
          right: edgeInset.tr,
          height: outerBorderWidth,
          backgroundColor: outerBorderColor,
        }}
      />
      {/* Tramo inferior: izquierdo toca bl, derecho toca br. */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: edgeInset.bl,
          right: edgeInset.br,
          height: outerBorderWidth,
          backgroundColor: outerBorderColor,
        }}
      />
      {/* Tramo izquierdo: extremo superior toca tl, inferior toca bl. */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: edgeInset.tl,
          bottom: edgeInset.bl,
          width: outerBorderWidth,
          backgroundColor: outerBorderColor,
        }}
      />
      {/* Tramo derecho: extremo superior toca tr, inferior toca br. */}
      <View
        style={{
          position: "absolute",
          right: 0,
          top: edgeInset.tr,
          bottom: edgeInset.br,
          width: outerBorderWidth,
          backgroundColor: outerBorderColor,
        }}
      />
    </>
  );
}
