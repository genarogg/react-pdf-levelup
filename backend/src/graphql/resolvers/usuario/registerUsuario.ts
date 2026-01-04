import {
    encriptarContrasena,
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    generarToken,
    validarCapchat
} from "@fn";
import { AccionesBitacora, Rol } from "@prisma/my-client";

interface RegisterUsuarioArgs {
    name: string;
    email: string;
    password: string;
    rol?: Rol;
    captchaToken?: string;
    ip?: string;
}

const registerUsuario = async (_: unknown, args: RegisterUsuarioArgs) => {
    const { name, email, password, rol, captchaToken, ip } = args;

    if (!name || !email || !password) {
        return errorResponse({ message: "Todos los campos son obligatorios" });
    }

    if (captchaToken) {
        const captchaValido = await validarCapchat(captchaToken);

        if (!captchaValido) {
            return errorResponse({ message: "Captcha inválido" });
        }
    }

    try {
        const existe = await prisma.usuario.findUnique({ where: { email } });

        if (existe) {
            return errorResponse({ message: "El correo ya está registrado" });
        }

        const hashedPassword = await encriptarContrasena({ password });

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                name,
                email,
                password: hashedPassword,
                rol: Rol.CLIENTE,
            },
        });

        await crearBitacora({
            usuarioId: nuevoUsuario.id,
            accion: `registro de usuario`,
            type: AccionesBitacora.CREATE_USER,
            ip
        });

        // Generar token para el nuevo usuario
        const tokenGenerado = generarToken({ id: nuevoUsuario.id });

        return successResponse({
            message: "Usuario registrado",
            data: {
                ...nuevoUsuario,
                token: tokenGenerado,
            },
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        return errorResponse({ message: "Error al registrar usuario" });
    }
};

export default registerUsuario;