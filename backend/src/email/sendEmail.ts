import { mailer, compileEJSTemplate } from "./index";

interface sendEmailArgs {
  email: string;
  subject: string;
  templateName: string;
  templateData: object;
}

/**
 * Envía un correo electrónico utilizando una plantilla EJS.
 *
 * @param {sendEmailArgs} args - Los argumentos necesarios para enviar el correo electrónico.
 * @param {string} args.email - La dirección de correo electrónico del destinatario.
 * @param {string} args.subject - El asunto del correo electrónico.
 * @param {string} args.templateName - El nombre de la plantilla a utilizar.
 * @param {object} args.templateData - Los datos para rellenar en la plantilla.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el correo electrónico ha sido enviado.
 *
 * Como usarlo:
 *
 * sendEmail({
 *     email: "example@example.com"
 *     subject: "subject",
 *     templateName: "templateName",
 *     templateData: { *data* }
 * })
 */

const sendEmail = async ({
  email,
  subject,
  templateName,
  templateData,
}: sendEmailArgs): Promise<void> => {
  try {
    // Genera el HTML utilizando compileEJSTemplate
    const html = await compileEJSTemplate(templateName, templateData);

    // Envía el email con el HTML generado
    await mailer({
      email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error al enviar el email:", error);
  }
};

export default sendEmail;
