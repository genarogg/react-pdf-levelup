import mailer from "./mailer";
import compileEJSTemplate from "./compileEJSTemplate";
import sendEmail from "./sendEmail";

/* sendEmail({
  email: "genarrogg@gmail.com",
  subject: "subject",
  templateName: "resetPassWord",
  templateData: { name: "Genaro" },
}); */

export { mailer, compileEJSTemplate, sendEmail };
