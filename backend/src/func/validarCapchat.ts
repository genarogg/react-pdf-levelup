import dotenv from "dotenv";
import { errorResponse } from "@fn";

dotenv.config();

const { SECRETCAPCHAT } = process.env;

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

const validarCapchat = async (captcha: string) => {
  try {
    if (!SECRETCAPCHAT) {
      console.error("SECRETCAPCHAT no está configurado");
      return { isValida: false };
    }

    if (!captcha) {
      console.error("Captcha no proporcionado");
      return { isValida: false };
    }

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRETCAPCHAT}&response=${captcha}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      console.error("Error en la respuesta de Google reCAPTCHA");
      return { isValida: false };
    }

    const data = await response.json() as RecaptchaResponse;

    if (!data.success) {
      console.error("Validación de captcha fallida:", data["error-codes"]);
      return { isValida: false };
    }

    return { isValida: true };
  } catch (err) {
    console.error("Error al validar el captcha:", err);
    return errorResponse({ message: "Error al validar el captcha" });
  }
};

export default validarCapchat;