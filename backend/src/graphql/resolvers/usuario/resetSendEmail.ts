import { generarToken, prisma, errorResponse, successResponse, sendEmail } from "@fn";

const resetPassword = async (_: unknown, { email }: { email: string }) => {
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return errorResponse({ message: 'Usuario no encontrado' });
        }

        const token = generarToken(usuario);

        const link = `${process.env.CORS_URL}?token=${token}`;

        await sendEmail({
            email,
            subject: "Reestablecer contraseña",
            templateName: "resetPassWord",
            templateData: { link },
        });

        return successResponse({ message: 'Se envió un correo para restablecer la contraseña' });

    } catch (error) {
        console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
        return errorResponse({ message: 'No se pudo enviar el correo de restablecimiento de contraseña' });

    }
};

export default resetPassword;