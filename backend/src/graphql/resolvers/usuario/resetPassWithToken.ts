
import { prisma, verificarToken, successResponse, errorResponse, crearBitacora, encriptarContrasena, generarToken } from '@fn';

import { AccionesBitacora } from "@prisma/my-client";

interface resetPassWithTokenArgs {
    token: string;
    nuevaContrasena: string;
    ip?: string;
}

const resetPassWithToken = async (_: unknown, { token, nuevaContrasena, ip }: resetPassWithTokenArgs) => {
    try {

        const { usuario } = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        const usuarioId = usuario.id;
        // Buscar usuario por ID
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id: Number(usuarioId) },
        });

        if (!usuarioExistente) {
            return errorResponse({ message: 'Usuario no encontrado' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await encriptarContrasena({
            password: nuevaContrasena
        })

        // Actualizar la contraseña del usuario
        const usuarioActualizado = await prisma.usuario.update({
            where: { id: Number(usuarioId) },
            data: { password: hashedPassword }
        });


        // Crear una entrada en la bitácora
        crearBitacora({
            usuarioId: usuarioId,
            accion: `Cambio de contraseña`,
            mensaje: `El usuario ${usuarioActualizado.email} cambió su contraseña`,
            type: AccionesBitacora.CREATE_USER,
            ip,
        });

        const tokenInit = generarToken({ id: Number(usuarioId) });

        return successResponse({
            message: 'Contraseña actualizada exitosamente',
            data: {
                ...usuarioActualizado,
                token: tokenInit
            }
        });
    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default resetPassWithToken;