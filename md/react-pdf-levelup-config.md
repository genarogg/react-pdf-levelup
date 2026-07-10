# Descripción y Importancia de `react-pdf-levelup.config.ts`

El archivo `react-pdf-levelup.config.ts` es el archivo de configuración central para `react-pdf-levelup Studio`.

## Cómo funciona:

- Se espera que este archivo se encuentre en la raíz de tu proyecto, al mismo nivel que la carpeta `node_modules`.
- Define parámetros esenciales para la operación del Studio.
- Puede ser un archivo `.ts` o `.js`. Si es `.ts`, se recomienda ejecutarlo con un cargador de TypeScript (como `npx tsx node_modules/.bin/react-pdf-levelup estudio`) para que la interfaz de línea de comandos (CLI) pueda interpretarlo directamente.

## Contenido del archivo `react-pdf-levelup.config.ts`:

El archivo contiene una configuración por defecto como esta:

```typescript
const config = {
  /**
   * Ruta al directorio de plantillas del Studio.
   * Puede ser relativa a la raíz del proyecto (donde está este archivo)
   * o una ruta absoluta.
   */
  templatesDir: "./pdf",

  /**
   * Puerto en el que se levanta el servidor del Studio.
   */
  port: 7000,
};

export default config;
```

-   `templatesDir`: Esta propiedad especifica la ubicación de las plantillas PDF que utiliza el Studio. Por defecto, busca un directorio llamado `pdf` en la raíz del proyecto. Puedes usar rutas relativas o absolutas.
-   `port`: Define el número de puerto en el que se iniciará el servidor del Studio. El valor predeterminado es `7000`.

## Importancia:

La importancia de este archivo radica en varios puntos clave:

-   **Personalización del entorno de desarrollo**: Permite a los desarrolladores adaptar `react-pdf-levelup Studio` a las necesidades específicas de su proyecto. Esto incluye dónde se guardan las plantillas de PDF y en qué puerto se ejecuta el entorno de vista previa.
-   **Flexibilidad**: Ofrece la opción de usar rutas relativas o absolutas para el directorio de plantillas, lo que facilita la integración en diversas estructuras de proyecto.
-   **Configuración centralizada**: Sirve como un punto único para gestionar la configuración del Studio, lo que mejora la mantenibilidad y asegura la coherencia en el desarrollo de plantillas PDF.
-   **Compatibilidad**: Al aceptar archivos `.ts` o `.js`, se asegura de que el archivo de configuración se ajuste a las preferencias de lenguaje del proyecto.

En resumen, `react-pdf-levelup.config.ts` es fundamental para configurar y personalizar el entorno de trabajo de `react-pdf-levelup Studio`, lo que permite una gestión eficiente de las plantillas PDF y del servidor de vista previa.
