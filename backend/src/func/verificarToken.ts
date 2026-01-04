import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@fn";
import { Usuario } from "@prisma/my-client"

interface AuthResponse {
    isAuthenticated: boolean;
    usuario: Usuario | null;
}

const verificarToken = async (token: string): Promise<AuthResponse> => {
    const JWTSECRETO = process.env.JWTSECRETO || "jwt-secret";
    const payloadFail = {
        isAuthenticated: false,
        usuario: null,
    };

    try {
        const payload = jwt.verify(token, JWTSECRETO) as JwtPayload;

        if (!payload?.id) {
            console.error("Token inválido o sin ID");
            return payloadFail;
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: payload.id },
        });

        if (!usuario) {
            console.error("Usuario no encontrado");
            return payloadFail
        }

        return {
            isAuthenticated: true,
            usuario,
        };

    } catch (err) {
        console.error("Error al verificar el token:", err);
        return payloadFail
    }
};

export default verificarToken;
