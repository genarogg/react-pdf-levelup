# @react-pdf-levelup/server

Utilidad de servidor para renderizar componentes de React a PDF utilizando un pool de workers para no bloquear el hilo principal de Node.js. Este paquete es parte del ecosistema de `@react-pdf-levelup`.

## Instalación

```bash
npm install @react-pdf-levelup/server
```

## Uso

Este paquete expone la función `generatePDFonWorker` que renderiza un componente de React a un PDF en un hilo de trabajo separado.

### `generatePDFonWorker(options)`

Renderiza un template de React a PDF. A diferencia de un entorno de frontend, en el backend se debe proveer la ruta absoluta al componente que se quiere renderizar.

**Parámetros:**

*   `options` (objeto):
    *   `templatePath` (string, **requerido**): Ruta absoluta al archivo del componente de React que se usará como plantilla. El componente debe tener un `export default`.
    *   `data` (any, opcional): Datos que se pasarán como `props` al componente de la plantilla.
    *   `output` ("base64" | "buffer", opcional): Formato de salida. Por defecto es `"base64"`.

**Retorna:** `Promise<string | Buffer>` - Una promesa que se resuelve con el PDF generado en el formato de salida especificado.

**Ejemplo:**

```javascript
import { generatePDFonWorker, closePDFPool } from "@react-pdf-levelup/server";
import path from "path";

async function crearFactura() {
  const datosFactura = {
    numero: "001",
    cliente: "Juan Perez",
    items: [
      { descripcion: "Producto A", cantidad: 2, precio: 10 },
      { descripcion: "Producto B", cantidad: 1, precio: 20 },
    ],
  };

  const templatePath = path.resolve("./ruta/a/mi/plantilla/Factura.js");

  try {
    const pdfBase64 = await generatePDFonWorker({
      templatePath: templatePath,
      data: datosFactura,
    });

    console.log("PDF generado en base64:", pdfBase64);

    // Si se necesita el buffer:
    const pdfBuffer = await generatePDFonWorker({
      templatePath: templatePath,
      data: datosFactura,
      output: "buffer",
    });

    console.log("PDF generado como Buffer:", pdfBuffer);

  } catch (error) {
    console.error("Error generando el PDF:", error);
  } finally {
    // Es importante cerrar el pool de workers cuando la aplicación se apaga.
    await closePDFPool();
  }
}

crearFactura();
```

### `closePDFPool()`

Cierra el pool de workers de manera ordenada. Es importante llamar a esta función cuando la aplicación se va a detener para liberar recursos.

## Cómo funciona

Este paquete utiliza la librería [`piscina`](https://github.com/piscinajs/piscina) para gestionar un pool de workers. La función `generatePDFonWorker` delega la tarea de renderizar el PDF a uno de estos workers.

Dentro del worker, se utiliza `@react-pdf/renderer` para convertir el componente de React en un stream de PDF, que luego se retorna como un Buffer al hilo principal. Este enfoque evita bloquear el event loop de Node.js con una tarea intensiva en CPU como es la generación de un PDF, mejorando el rendimiento y la escalabilidad de la aplicación.
