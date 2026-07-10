# Análisis técnico — Playground (React PDF LevelUp)

Revisión de los 19 archivos del módulo `playground/` (index, editor, preview, toolbar, hooks y utils). Se analizaron bugs, seguridad, oportunidades de refactor/segmentación y código muerto.

## Cómo leer este documento

Cada hallazgo tiene:

* **Archivo(s) afectado(s)**
* **Problema**: qué está mal y por qué importa
* **Refactor sugerido**: el cambio concreto
* **Esfuerzo**: 🟢 bajo (minutos) · 🟡 medio (1-2h) · 🔴 alto (medio día+)
* **Impacto**: qué tan visible es el beneficio para el usuario final o para quien mantiene el código

Están ordenados por prioridad dentro de cada fase.

## Resumen ejecutivo

| Fase | Hallazgos | Lo más urgente |
|---|---|---|
| 1. Bugs funcionales | 9 | Pegar código lo duplica (#1); nombrar tu propio componente "Header" o "Row" rompe la preview (#2) |
| 2. Seguridad | 2 | El código del usuario se ejecuta sin sandbox, con acceso total a la sesión (#10) |
| 3. Refactor / segmentación | 5 | `compileCode` hace 5 trabajos distintos en una sola función intestable (#12) |
| 4. Código muerto | 5 | Rama muerta en QuickHelp; prop `onColorSelect` que nunca se conecta |
| 5. Mejoras generales | 3 | `any` / `as any` en puntos clave del editor |

---
### 🟡 Importantes

- **PLAYGROUND** — Doble debounce (1000ms + 300ms) = ~1.3s de latencia hasta ver el preview actualizado.

- **P10** — Lógica de sanitización de código duplicada entre "al escribir" y "al pegar".

### 🟣 COSAS QUE NO SON BUG

- **P8** — `ColorPicker` no está conectado al editor: solo sirve para copiar el color al portapapeles, no para insertarlo en el código.

**El bug — `QRstyle` probablemente nunca renderiza el QR real.** Le pasa directamente una `Promise` (sin resolver, sin `await`, sin envolver en función) al `src` de `<Image>`. El componente hermano `QR.tsx` sí resuelve su promesa con `useState`+`useEffect` antes de pasarla — `QRstyle.tsx` no tiene ningún hook, solo asigna la promesa "pelada".

si se utiliza un useEffect el qr nunca cargara ya que no esta disponible en el backend

- **1.4** — El shorthand `style={{padding: 40}}` desactiva silenciosamente la reserva de espacio del footer (pero `paddingTop` solo, no) → posible solapamiento visual contenido/footer.
