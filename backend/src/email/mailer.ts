import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

interface Account {
  user: string;
  pass: string;
}

/**
 * Crea dinámicamente el pool de cuentas desde las variables de entorno
 * Ejemplo esperado en .env:
 * EMAIL_USER_1, EMAIL_PASSWORD_1
 * EMAIL_USER_2, EMAIL_PASSWORD_2
 * ...
 */
function loadAccounts(): Account[] {
  const accounts: Account[] = [];
  let index = 1;

  while (process.env[`EMAIL_USER_${index}`] && process.env[`EMAIL_PASSWORD_${index}`]) {
    accounts.push({
      user: process.env[`EMAIL_USER_${index}`]!,
      pass: process.env[`EMAIL_PASSWORD_${index}`]!,
    });
    index++;
  }

  return accounts;
}

const accounts = loadAccounts();

const EMAIL_HOST = process.env.EMAIL_HOST!;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);

let currentIndex = 0;

function getNextAccount(): Account {
  const account = accounts[currentIndex];
  currentIndex = (currentIndex + 1) % accounts.length;
  return account;
}

const mailer = async ({ email, subject, html }: EmailOptions): Promise<void> => {
  try {
    if (accounts.length === 0) {
      throw new Error("⚠️ No hay cuentas configuradas en el .env");
    }

    const { user, pass } = getNextAccount();

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      secure: true,
      port: EMAIL_PORT,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,
      to: email,
      subject,
      html,
    });

    console.log(`✅ Email enviado con la cuenta: ${user}`);
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
  }
};

export default mailer;
