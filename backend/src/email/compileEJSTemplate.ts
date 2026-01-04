import * as util from "util";
import * as ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderFileAsync: (
  path: string,
  data?: object,
  options?: ejs.Options
) => Promise<string> = util.promisify(ejs.renderFile);

/**
 * Compila un archivo EJS con los datos proporcionados y devuelve el HTML resultante.
 *
 * @param templateName Nombre del archivo EJS (sin la extensión .ejs).
 * @param data Objeto con los datos que se pasarán al template EJS.
 * @returns {Promise<string>} Una promesa que resuelve con el HTML resultante.
 */

const compileEJSTemplate = async (
  templateName: string,
  data: object
): Promise<string> => {
  const templatePath = path.join(__dirname, `/ejs/${templateName}.ejs`);

  try {
    const html = await renderFileAsync(templatePath, data);
    return html;
  } catch (err) {
    // Lanza el error para que pueda ser manejado por el llamador
    throw new Error(
      `Error al renderizar el template EJS (${templateName}): ${err}`
    );
  }
};

export default compileEJSTemplate;