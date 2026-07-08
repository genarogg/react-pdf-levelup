# El código del usuario se ejecuta sin sandbox — informe detallado

> Documento centrado exclusivamente en el hallazgo #10 del análisis de refactor de `playground/`: la ejecución del código del editor corre en el hilo principal, en el mismo origen que el resto de la aplicación, sin ningún tipo de aislamiento real.

---

## 1. Resumen ejecutivo

| | |
|---|---|
| **Archivos afectados** | `PDFPreview.tsx` (líneas 82-143), `CodeEditor.tsx` (comentario líneas 80-82) |
| **Qué es** | El código que el usuario escribe en Monaco se transpila con Babel y se ejecuta con `new Function(...)` directamente en el contexto de la página, no en un Web Worker ni en un `<iframe sandbox>`. |
| **Consecuencia garantizada** | Un error de tipeo (bucle infinito, recursión sin corte) congela la pestaña completa, con riesgo de perder el trabajo no guardado. |
| **Consecuencia condicionada** | Si en el futuro esta misma app tiene sesión/autenticación, el mismo mecanismo es la puerta de entrada clásica de un ataque estilo self-XSS contra el backend. |
| **Estado hoy (verificado en el código)** | No hay sesión, cookies ni tokens en este frontend — el radio de impacto actual es sobre todo de fiabilidad, no de robo de datos. Ver sección 4. |
| **Fix recomendado** | Mover la compilación/ejecución a un `<iframe sandbox="allow-scripts">` (sin `allow-same-origin`), comunicado por `postMessage`. Opcionalmente reforzar con un Web Worker adentro. |
| **Esfuerzo** | 🔴 Alto (cambio de arquitectura, no un one-liner) |
| **Impacto** | 🔴 Alto |

---

## 2. Diagnóstico técnico: por qué `new Function` no es un sandbox

En `PDFPreview.tsx`, el pipeline de compilación termina así:

```ts
const evalFn = new Function(moduleCode)
CustomComponent = evalFn(React, CoreComponents)
```

`new Function(...)` compila y ejecuta el string resultante **en el scope global de la página actual**. No es un entorno aislado: es el mismo `window`, el mismo `document`, el mismo origen, el mismo hilo que el resto de la aplicación. La única "protección" que existe hoy es un `try/catch` alrededor de esta llamada — que:

- Sí atrapa errores de sintaxis o excepciones lanzadas de forma síncrona durante la creación/invocación de la función.
- **No atrapa un bucle infinito** (no es una excepción, es un hilo que nunca vuelve).
- **No cubre el render de React del componente del usuario.** Cuando `<PDFViewer><Component /></PDFViewer>` ejecuta el cuerpo de la función que escribió el usuario, eso pasa *después*, durante el ciclo de render de React — fuera del `try/catch` de `compileCode` y fuera de lo que el `ErrorBoundary` puede atrapar (un colgado no es un `throw`, así que `componentDidCatch` nunca se dispara).

Esto es relevante porque el escenario de congelamiento más probable no es un error de sintaxis raro, sino algo tan simple como:

```tsx
const MyDocument = () => {
  while (true) {} // el usuario lo escribió por error, o a propósito
  return <Document>...</Document>
}
export default MyDocument
```

y ese código corre exactamente en el mismo hilo que dibuja el resto de la pestaña.

---

## 3. Dos problemas distintos, cada uno con su propio disparador

### 3.1 Fiabilidad (no requiere mala intención)

Cualquier usuario normal, sin ninguna intención maliciosa, puede escribir sin querer:
- Un `while(true){}` o un `for` sin condición de corte.
- Un componente que se renderiza a sí mismo (recursión infinita de JSX).
- Un cálculo pesado dentro del cuerpo del componente que corre en cada tecla.

El resultado es que **toda la pestaña** se congela, no solo el panel de preview — incluyendo el editor, donde puede estar el código que el usuario no llegó a guardar (si el freeze ocurre antes de que el debounce de `localStorage` alcance a ejecutarse).

### 3.2 Seguridad (requiere intención maliciosa, y depende del contexto)

Si el código del usuario corre en el mismo origen que el resto de la app, tiene acceso — hoy, en teoría, ya que en la práctica esta app no tiene nada que robar, ver sección 4 — a:
- `document` / `window` completos.
- `localStorage` / cookies no-`httpOnly` de ese origen.
- La posibilidad de hacer `fetch` contra cualquier endpoint alcanzable desde el navegador, incluidos los `/api` propios de la app.

Es el mismo vector que un "self-XSS": pegar un snippet sugerido por un tercero (disfrazado de "plantilla" o "componente que desbloquea tal diseño") que en realidad exfiltra algo o dispara acciones no deseadas.

### 3.3 Corrección importante: el timeout NO alcanza como mitigación

En una primera pasada sugerí, como mitigación rápida, envolver la ejecución en un `Promise.race` con un `setTimeout`. **Esto no funciona** para el caso que más importa, y vale la pena documentarlo explícitamente para no repetir el error:

- JavaScript es de un solo hilo. Si el código del usuario tiene un bucle **síncrono** sin cortes, ese mismo bucle bloquea el *event loop*.
- El `setTimeout` de un `Promise.race` necesita que el *event loop* esté libre para dispararse — y justamente no lo está, porque el bucle lo tiene ocupado.
- Peor: como se explicó en la sección 2, el bucle más probable ocurre durante el **render de React**, no durante el `new Function` inicial — así que ni siquiera envolviendo ese `new Function` en un timeout se cubre el escenario típico.

**Conclusión:** no hay mitigación "barata" real para el problema de fiabilidad. La única forma de resolverlo de fondo es sacar la ejecución del hilo principal de la pestaña (sección 5).

---

## 4. Radio de impacto real, verificado en el código: ¿frontend o también backend?

Antes de asumir nada, se revisó el repo completo buscando cualquier mecanismo de sesión:

```bash
grep -rniE "credentials|cookie|authorization|bearer|jwt|session" src/
```

**Resultado: no hay nada.** El único uso de almacenamiento persistente en todo `src/` es:

```ts
localStorage.setItem(STORAGE_KEY, code) // playground/index.tsx — guarda el borrador del editor, no una sesión
```

Además, `vite.config.ts` define dos proxies **de desarrollo**:

```ts
'/api':  { target: 'http://localhost:4000', ... }
'/docs': { target: 'http://localhost:4500', ... }
```

Y `api-section.tsx` (sección de marketing de la home) muestra un `fetch` de ejemplo hacia `https://react-pdf-levelup.nimbux.cloud/api` — pero ese código es **texto dentro de un `<CodeBlock>`** pensado para copiarse a un backend Node externo; nunca se ejecuta en el navegador.

### 4.1 Conclusión sobre el radio de impacto hoy

Este frontend, tal como está en este repo, **no tiene login, sesión, cookies ni tokens**. Es una landing + playground + visor de PDF, pública y anónima. Por lo tanto, si alguien pega código malicioso en el playground hoy, lo peor que puede lograr es:

1. Congelar la pestaña de ese mismo visitante (sección 3.1 — garantizado, no depende de nada más).
2. Hacer `fetch`/XHR hacia cualquier URL alcanzable desde el navegador — incluido tu `/api` — pero **con los mismos privilegios que un visitante anónimo escribiendo `fetch(...)` a mano en la consola**. No hay sesión ni token que secuestrar.
3. Leer/escribir su propio `localStorage` de este origen (que hoy solo contiene el borrador del código, sin datos sensibles).

**Es decir: hoy es, sobre todo, un problema de frontend** (fiabilidad + abuso anónimo de infraestructura), no un compromiso de cuentas ni de datos de otros usuarios — porque ese concepto no existe todavía en este código.

### 4.2 Por qué esto no es excusa para no arreglarlo

Ese análisis es válido solo mientras el proyecto se mantenga exactamente así. Se rompe en cuanto ocurra cualquiera de estas tres cosas — las tres, evoluciones típicas y esperables de un producto como este:

- **Se agrega login** (dashboard, "guardar mis plantillas", panel de admin) en la misma app React. Ese día, cualquier cookie o token de sesión queda al alcance de este mismo código sin sandbox, y el bug se convierte en un XSS clásico capaz de actuar en nombre del usuario logueado contra el backend.
- **El `/api` de producción confía en el origen** (CORS restringido al dominio propio, o un proxy/reverse-proxy que acepta tráfico solo "desde el sitio oficial"). Ahí, código corriendo en este dominio alcanza endpoints que un atacante externo random no podría tocar directamente — sin necesidad de cookies de por medio.
- **Alguien mete una API key en una variable `VITE_*`.** Cualquier `import.meta.env.VITE_ALGO` queda embebido en el bundle público — legible por cualquier script que corra en la página, tenga sandbox o no.

### 4.3 Un riesgo que sí existe hoy, sin necesidad de auth

Si el `/api` (generación de PDF) cuesta cómputo o dinero por request, un "template" público con un snippet que dispare requests en loop podría convertir a cada visitante del playground en un nodo de abuso distribuido contra esa infraestructura — más difícil de frenar por IP porque son visitantes reales, no un único atacante.

### 4.4 Lo que falta por verificar

Este análisis cubre únicamente lo que hay en `frontend.zip`. No se tuvo visibilidad de:
- El backend real detrás de `localhost:4000` / `localhost:4500` en producción.
- La configuración de CORS/reverse-proxy real que expone `/api` en el entorno productivo.
- Si `react-pdf-levelup.nimbux.cloud/api` comparte alguna confianza de origen con este frontend.

Si se comparte ese código, vale la pena repetir este mismo chequeo (`credentials`, `cookie`, `CORS`, API keys) sobre él.

---

## 5. La solución recomendada: iframe con sandbox real + postMessage

Es la misma técnica que usan CodeSandbox, StackBlitz y JSFiddle para sus previews en vivo.

### 5.1 El mecanismo del navegador

Al agregar el atributo `sandbox` a un `<iframe>` **sin** el token `allow-same-origin`, el navegador trata ese iframe como si viniera de un **origen opaco** — único e irrepetible — sin importar que el contenido se sirva desde el propio dominio. Esto implica, automáticamente:

- El iframe no puede leer `document.cookie` de la página padre (ni tiene cookies propias utilizables).
- `localStorage` / `sessionStorage` / `indexedDB` dentro del iframe están bloqueados (tirar de ellos lanza `SecurityError`).
- Padre e iframe no pueden leerse el DOM mutuamente — misma restricción que aplica entre dos sitios distintos.
- La única forma de comunicación que queda es `postMessage`.

Con `sandbox="allow-scripts"` (y solo eso) el iframe puede seguir ejecutando JavaScript — necesario porque Babel y el `eval`/`new Function` tienen que seguir corriendo en algún lado — pero ya sin privilegios sobre la sesión del padre.

> ⚠️ **Nunca combinar `allow-scripts` con `allow-same-origin`** en el mismo iframe si el contenido no es confiable: juntos anulan el aislamiento (el script podría manipular su propio contexto para recuperar privilegios de mismo origen). Se usa uno de los dos, nunca ambos, cuando el contenido es no confiable.

### 5.2 Arquitectura, antes y después

```
Hoy:
┌─────────────────────────────────────────────┐
│ Pestaña del navegador (un solo origen)       │
│  App React + código del usuario + cookies +  │
│  localStorage — todo comparte el mismo       │
│  contexto y el mismo hilo                    │
└─────────────────────────────────────────────┘

Propuesta:
┌───────────────────────┐  postMessage  ┌──────────────────────────┐
│ App React (padre)     │ ◄───────────► │ iframe sandbox           │
│ Cookies y localStorage │                │ (origen opaco)           │
│                        │                │ Sin acceso a cookies/DOM │
└───────────────────────┘                └──────────────────────────┘
```

### 5.3 Plan de implementación con Vite

Vite sirve cualquier `.html` que esté en la raíz del proyecto como una ruta propia, tanto en desarrollo como en build — no hace falta configuración adicional para tener una segunda "página":

```
frontend/
├── index.html
├── sandbox.html                # 🆕 nueva página de entrada
└── src/
    ├── main.tsx
    └── sandbox-entry.tsx        # 🆕 lógica que hoy vive en PDFPreview.tsx
```

**`sandbox.html`**
```html
<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/sandbox-entry.tsx"></script>
  </body>
</html>
```

**`sandbox-entry.tsx`** — prácticamente el contenido actual de `PDFPreview.tsx`, pero recibiendo el código por `postMessage` en vez de por props:

```tsx
import { createRoot } from "react-dom/client"
import { PDFViewer } from "@react-pdf/renderer"
import * as Babel from "@babel/standalone"
import * as CoreComponents from "@/components/core"
// ... el mismo compileCode, ErrorDocument, DefaultDocument, ErrorBoundary de hoy

let latestCode = ""

window.addEventListener("message", (event) => {
  // El origen es opaco ("null"): no se puede validar por origen real,
  // así que al menos se valida la forma del mensaje.
  if (event.data?.type !== "code-update") return
  latestCode = event.data.code
  compileCode(latestCode)
})

// Avisar al padre que ya se puede recibir código
window.parent.postMessage({ type: "sandbox-ready" }, "*")

createRoot(document.getElementById("root")!).render(<App />)
```

**Del lado del padre**, `PDFPreview.tsx` deja de compilar directamente y pasa a ser un mensajero:

```tsx
function SandboxedPreview({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const readyRef = useRef(false)
  const pendingCodeRef = useRef(code)

  useEffect(() => {
    pendingCodeRef.current = code
    if (readyRef.current) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "code-update", code }, "*"
      )
    }
  }, [code])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "sandbox-ready") {
        readyRef.current = true
        iframeRef.current?.contentWindow?.postMessage(
          { type: "code-update", code: pendingCodeRef.current }, "*"
        )
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="/sandbox.html"
      sandbox="allow-scripts"
      title="Vista previa del PDF"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  )
}
```

El debounce de 300ms que ya existe en `index.tsx`/`PDFPreview.tsx` se mantiene igual — lo único que cambia es que en vez de compilar localmente, se hace `postMessage`.

### 5.4 ¿Esto también resuelve el freeze?

Parcialmente, y depende del navegador: Chrome/Firefox suelen aislar un iframe de origen opaco en su **propio proceso del sistema operativo** (Site Isolation), lo que en la práctica evita que un colgado adentro tumbe el resto de la pestaña. Es la razón por la que CodeSandbox/JSFiddle sobreviven a que alguien escriba un bucle infinito en el editor. Pero no es una garantía 100% especificada por el estándar — es un comportamiento de implementación.

### 5.5 Refuerzo opcional, con garantía dura: Web Worker

Si se necesita una garantía que no dependa de heurísticas del navegador, el siguiente paso es mover la compilación **a un Web Worker** dentro del iframe: un Worker corre en un hilo del sistema operativo separado, sin excepciones.

Esto es viable acá porque `@react-pdf/renderer` expone:

```ts
pdf(<Componente />).toBlob()
```

que genera el PDF final como un `Blob` **sin necesitar DOM** — ideal para correr dentro de un Worker. El Worker devuelve el `Blob` (o su `ArrayBuffer`) al hilo principal del iframe por `postMessage`, y ahí simplemente se muestra con:

```tsx
<iframe src={URL.createObjectURL(blob)} />
```

el visor nativo de PDF del navegador — sin necesitar siquiera `<PDFViewer>` de React del lado del cliente.

---

## 6. Orden de ejecución recomendado

1. **Iframe con `sandbox="allow-scripts"` primero.** Resuelve la parte más grave (aislamiento de cookies/localStorage/DOM) y, en la práctica, probablemente también el freeze (sección 5.4).
2. **Verificar en el navegador real** si el freeze sigue ocurriendo con el iframe solo, antes de invertir en la solución de Worker.
3. **Web Worker** solo si en producción se siguen viendo colgados — es la garantía dura, pero es más esfuerzo de implementar (hay que separar generación de blob de renderizado).
4. **No usar el timeout con `Promise.race`** como mitigación — sección 3.3 explica por qué no sirve para el caso real.
5. Antes de escalar la prioridad de este punto, **preguntar por el backend real** (sección 4.4) — si ya hay planes de agregar login o si el `/api` de producción confía en el origen, este punto sube de prioridad de inmediato.
