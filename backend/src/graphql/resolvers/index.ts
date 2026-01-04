import demoResolvers from "./demo";
import usuarioResolver from "./usuario";

const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...usuarioResolver.Query
    },

    Mutation: {
        ...usuarioResolver.Mutation,
    },
};

export default resolvers;