import {
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    generarToken,
    compararContrasena,
    validarCapchat
} from "@fn";

import { AccionesBitacora } from "@prisma/my-client";

interface LoginUsuarioArgs {
    email: string;
    password: string;
    captchaToken?: string;
    ip?: string;
}

const loginUsuario = async (_: unknown, args: LoginUsuarioArgs) => {
    const { email, password, captchaToken, ip } = args;

    if (!email || !password) {
        return errorResponse({ message: "Email y contraseña son obligatorios" });
    }

    if (captchaToken) {
        const captchaValido = await validarCapchat(captchaToken);

        if (!captchaValido) {
            return errorResponse({ message: "Captcha inválido" });
        }
    }
    
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return errorResponse({ message: "Credenciales incorrectas" });
        }

        const passwordValida = await compararContrasena({
            password,
            hashedPassword: usuario.password
        });

        if (!passwordValida) {
            return errorResponse({ message: "Credenciales incorrectas" });
        }

        const token = generarToken({ id: usuario.id });

        await crearBitacora({
            usuarioId: usuario.id,
            accion: "inicio de sesión",
            ip: ip || "N/A",
            type: AccionesBitacora.LOGIN
        });

        const data = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            rol: usuario.rol,
            token
        }

        return successResponse({
            message: "Inicio de sesión exitoso",
            data
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return errorResponse({ message: "Error al iniciar sesión" });
    }
};

export default loginUsuario;
