import registerUsuario from "./registerUsuario";
import loginUsuario from "./loginUsuario";
import resetPassword from "./resetSendEmail";
import resetPassWithToken from "./resetPassWithToken";

import validarSesion from "./validarSesion";
import getUsuarios from "./getUsuarios";

const resolvers = {
    Query: {
        validarSesion,
        getUsuarios
    },
    
    Mutation: {
        registerUsuario,
        loginUsuario,
        resetPassword,
        resetPassWithToken
    }
};

export default resolvers;