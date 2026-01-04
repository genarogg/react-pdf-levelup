import jwt, { SignOptions } from "jsonwebtoken";

interface Usuario {
  id: number;
}

const generarToken = (usuario: Usuario): string => {
  const JWTSECRETO = process.env.JWTSECRETO || "jwt-secret";
  const JWTTIEMPO = process.env.JWTTIEMPO || "1d";

  const { id } = usuario;

  try {
    // Solución 1: Casting explícito del tipo expiresIn
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: JWTTIEMPO as any,
    };

    const token = jwt.sign({ id }, JWTSECRETO, options);

    return token;
  } catch (error: any) {
    throw new Error(`Error al generar el token: ${error.message}`);
  }
};

export default generarToken;