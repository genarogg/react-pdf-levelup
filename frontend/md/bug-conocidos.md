### 🟡 Importantes
- **PLAYGROUND** — Doble debounce (1000ms + 300ms) = ~1.3s de latencia hasta ver el preview actualizado.

- **P10** — Lógica de sanitización de código duplicada entre "al escribir" y "al pegar".

### 🟣 COSAS QUE NO SON BUG
- **P8** — `ColorPicker` no está conectado al editor: solo sirve para copiar el color al portapapeles, no para insertarlo en el código.

**El bug  — `QRstyle` probablemente nunca renderiza el QR real.** Le pasa directamente una `Promise` (sin resolver, sin `await`, sin envolver en función) al `src` de `<Image>`. El componente hermano `QR.tsx` sí resuelve su promesa con `useState`+`useEffect` antes de pasarla — `QRstyle.tsx` no tiene ningún hook, solo asigna la promesa "pelada".

si se utiliza un useEffect el qr nunca cargara ya que no esta disponible en el backend