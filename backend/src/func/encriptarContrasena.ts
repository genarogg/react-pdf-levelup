import argon2 from "argon2";

interface EncriptarContrasenaParams {
    password: string;
}

interface CompararContrasenaParams {
    password: string;
    hashedPassword: string;
}

// Configuración personalizada para Argon2
const ARGON2_OPTIONS = {
    type: argon2.argon2id, 
    memoryCost: 2 ** 10, 
    timeCost: 3,        
    parallelism: 1       
};

const encriptarContrasena = async ({ password }: EncriptarContrasenaParams): Promise<string> => {
    if (!password) {
        throw new Error("La contraseña no puede estar vacía");
    }

    try {
        return await argon2.hash(password, ARGON2_OPTIONS);
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        throw new Error("Ocurrió un error al encriptar la contraseña. Inténtalo de nuevo.");
    }
};

const compararContrasena = async ({ password, hashedPassword }: CompararContrasenaParams): Promise<boolean> => {
    if (!password) {
        throw new Error("La contraseña no puede estar vacía");
    }

    if (!hashedPassword) {
        throw new Error("La contraseña encriptada no puede estar vacía");
    }

    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error("Error al comparar la contraseña:", error);
        throw new Error("Ocurrió un error al verificar la contraseña. Inténtalo de nuevo.");
    }
};

export { encriptarContrasena, compararContrasena };
