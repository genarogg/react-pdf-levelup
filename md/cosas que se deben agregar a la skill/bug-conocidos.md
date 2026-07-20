## Registro de fuentes (`Font.register`)

Toda fuente personalizada debe registrarse mediante una función dedicada, nunca con
llamadas sueltas a `Font.register` dispersas en el template. El patrón es siempre el mismo:

1. Una función (convención de nombre: `getFuentes`) que agrupa una llamada a
   `Font.register` por cada familia tipográfica.
2. Dentro de cada `Font.register`, un array `fonts` con una entrada por variante
   (`fontWeight` y/o `fontStyle`) disponible, cada una con su propio `src`.
3. `src` siempre debe ser una URL absoluta `https://` (nunca ruta local) — Google
   Fonts (`fonts.gstatic.com`) o el repo oficial `google/fonts` en GitHub
   (`raw.githubusercontent.com/google/fonts/...`) son las fuentes preferidas.
4. Si la fuente solo tiene un peso disponible (p. ej. muchas display fonts como
   Megrim, Audiowide), el array `fonts` lleva una única entrada con
   `fontWeight: "normal"` — no inventar variantes bold/italic que no existan.

### Plantilla

```typescript
import { Font } from '@react-pdf-levelup/core';

const getFuentes = () => {
  Font.register({
    family: "NombreFuente",
    fonts: [
      {
        src: "https://...",
        fontWeight: "normal",
      },
      {
        src: "https://...",
        fontWeight: "bold",
      },
      {
        src: "https://...",
        fontStyle: "italic",
        fontWeight: "normal",
      },
    ],
  });

  // Una llamada a Font.register por cada familia adicional que use el documento
  Font.register({
    family: "OtraFuente",
    fonts: [
      {
        src: "https://...",
        fontWeight: "normal",
      },
    ],
  });
};

export default getFuentes;
```

### Ejemplo de uso completo

```typescript
import { Layout, H1, Font } from '@react-pdf-levelup/core';

const getFuentes = () => {
  Font.register({
    family: "Megrim",
    fonts: [
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/megrim/Megrim.ttf",
        fontWeight: "normal",
      },
    ],
  });
};

const MiTemplate = () => {
  // 1. Invocar la función de registro ANTES de renderizar el Layout,
  //    una sola vez por render del documento.
  getFuentes();

  return (
    <Layout size="A4" meta={{ title: 'Invoice', language: 'es-ES' }}>
      {/* 2. Establecer fontFamily en el style del componente de texto,
             usando el mismo nombre pasado a `family` en Font.register */}
      <H1 style={{ fontFamily: "Megrim" }}>INVOICE</H1>
    </Layout>
  );
};

export default MiTemplate;
```

### Reglas clave

- **Nombre de función**: `getFuentes`, sin parámetros, sin retorno — solo efectos
  secundarios (`Font.register`).
- **Invocación**: se llama una vez, antes de renderizar el `Layout`/`LayoutMultiPage`
  del documento (al inicio del componente de template).
- **`fontFamily`**: se aplica en el `style` de cualquier componente de texto
  (`H1`–`H6`, `P`, `Span`, etc.) con el mismo string usado en `family` — es
  case-sensitive y debe coincidir exactamente.
- **Una función, todas las fuentes del documento**: si el template usa varias
  familias, todas se registran dentro de la misma `getFuentes`, con un bloque
  `Font.register` por familia.