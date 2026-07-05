
### 🟢 Mejoras
- **P10** — Lógica de sanitización de código duplicada entre "al escribir" y "al pegar".

- **P12** — Ejemplos de QR usan una URL personal externa como logo — riesgo de imagen rota si desaparece.
- **P13** — `"use client"` (directiva de Next.js) presente en un proyecto Vite — no hace nada, es código residual.
- **P14** — Ternario redundante en `QuickHelp.tsx` (ambas ramas devuelven el mismo string).
- **P15** — El mismo patrón riesgoso de "tomar el primer `const Nombre =`" para adivinar el componente principal se repite también en `dowloadTemplate.ts`, no solo en `PDFPreview.tsx`.

---
