import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "@fn";
import { Prisma, Rol, AccionesBitacora } from "@prisma/my-client";

interface GetUsuariosArgs {
    token: string;
    filtro?: string;
    ip?: string;
}

const getUsuarios = async (_: unknown, args: GetUsuariosArgs) => {
    const { token, filtro, ip } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const { isAuthenticated, usuario } = await verificarToken(token);

        if (!isAuthenticated || !usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const whereClause: Prisma.UsuarioWhereInput = {};

        if (filtro) {
            const filtroCleaned = filtro.trim();
            whereClause.OR = [
                { email: { contains: filtroCleaned } },
                { name: { contains: filtroCleaned } },
            ];
        }

        switch (usuario.rol) {
            case Rol.ADMIN:
                whereClause.rol = { in: [Rol.ADMIN, Rol.ASISTENTE] };
                break;
            case Rol.ASISTENTE:
                whereClause.rol = Rol.ASISTENTE;
                break;
            default:
                return errorResponse({ message: "Rol no válido" });
        }

        const usuarios = await prisma.usuario.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                name: true,
                rol: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.usuario.count({ where: whereClause });

        await crearBitacora({
            type: AccionesBitacora.GET_USUARIOS,
            ip,
            usuarioId: usuario.id,
            accion: "obtención de usuarios",
        });

        return successResponse({
            message: "Usuarios obtenidos correctamente",
            data: usuarios,
            meta: { total },
        });

    } catch (error) {
        console.error(error);
        return errorResponse({ message: "Error al obtener usuarios" });
    }
};

export default getUsuarios;