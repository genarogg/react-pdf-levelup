## `zIndex` — soportado pero poco confiable, evitar

`@react-pdf/renderer` lista `zIndex` en su tabla oficial de propiedades de estilo
soportadas (`display`, `position`, `top`/`right`/`bottom`/`left`, `overflow`,
`zIndex`, `aspectRatio`), así que **técnicamente existe y no lanza error**. El
problema no es de disponibilidad, es de comportamiento.

### El problema

Hay un bug conocido y documentado en el repo de `react-pdf`
(issue [#1721](https://github.com/diegomura/react-pdf/issues/1721)):

- **Sin `zIndex` especificado** (o ausente): los elementos se apilan según el
  **orden en que aparecen en el JSX** — el que se declara después queda encima.
  Esto funciona de forma predecible.
- **Con `zIndex` especificado** (incluso `zIndex: 0`): el comportamiento se
  invierte de forma inconsistente — el elemento puede terminar **detrás** de
  los demás sin importar qué valor de `zIndex` tenga ni su posición en el flujo
  del documento.

En la práctica, esto significa que introducir `zIndex` para forzar un stacking
específico puede producir el resultado contrario al esperado, y el bug lleva
abierto desde 2022 sin fix oficial.

### La corrección: usar orden de renderizado, no `zIndex`

Para superponer capas (fondos, círculos decorativos, badges sobre imágenes,
overlays, etc.), controlar el stacking **exclusivamente por el orden en que
los componentes aparecen en el JSX**, combinado con `position: 'absolute'`
para sacar el elemento del flujo normal sin tocar `zIndex`:

```jsx
{/* Capa de fondo: se declara primero -> queda abajo */}
<Gradiant
  type="linear"
  colors={['#0a1a24', '#12414f']}
  width={PAGE_WIDTH}
  height={PAGE_HEIGHT}
  style={{ position: 'absolute', top: 0, left: 0 }}
/>

{/* Capa superior: se declara después -> queda encima */}
<Gradiant
  type="radial"
  shape="circle"
  colors={['#2f6b7a', '#0f2530']}
  width={320}
  height={320}
  style={{
    position: 'absolute',
    top: PAGE_HEIGHT / 2 - 160,
    left: PAGE_WIDTH / 2 - 160,
  }}
/>
```

Ningún elemento de este ejemplo usa `zIndex` — el círculo queda visualmente
encima del gradiente lineal únicamente porque se declaró después en el árbol.

### Regla para la skill

- **No usar `zIndex` en ningún template**, ni siquiera para casos simples de
  dos capas — el bug puede aparecer igual.
- Para superponer N capas, ordenarlas en el JSX de abajo hacia arriba (fondo
  primero, elementos decorativos después, contenido interactivo/texto al
  final) y usar `position: 'absolute'` con `top`/`left` para el posicionamiento.
- Si una capa necesita estar dentro de un contenedor para posicionarse en
  `absolute` respecto a él (y no respecto a toda la página), envolver el grupo
  en un `Div` con `position: 'relative'` — igual que en el patrón usado para
  el fondo del invoice (`Div` relativo del tamaño de la página + dos
  `Gradiant` en `absolute` dentro).
- Si en algún momento se necesita invertir el stacking de dos elementos ya
  construidos, **reordenar el JSX**, no agregar `zIndex` a uno de los dos.
