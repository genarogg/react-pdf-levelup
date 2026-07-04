/**
 * Configuración de react-pdf-levelup Studio.
 *
 * Este archivo debe ubicarse en la raíz de tu proyecto,
 * junto a la carpeta node_modules.
 *
 * Nota: para que el CLI pueda leer este archivo .ts directamente,
 * ejecútalo con un loader de TypeScript, por ejemplo:
 *   npx tsx node_modules/.bin/react-pdf-levelup estudio
 * Si no usas un loader de TS, crea en su lugar
 * `react-pdf-levelup.config.js` (ver ejemplo incluido).
 *
 * @typedef {Object} ReactPdfLevelupConfig
 * @property {string} [templatesDir] Ruta al directorio de plantillas del Studio.
 * @property {number} [port] Puerto en el que se levanta el servidor del Studio.
 */

/** @type {ReactPdfLevelupConfig} */
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