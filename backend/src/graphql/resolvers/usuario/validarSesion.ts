import { verificarToken, successResponse, errorResponse } from '@fn';

interface validarSesionArgs {
    token: string;
}

const validarSesion = async (_: unknown, { token }: validarSesionArgs) => {
    try {
        const { usuario } = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        return successResponse({
            message: 'Token verificado exitosamente',
            data: usuario
        });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default validarSesion;