import { prisma, log } from "@fn"

const dbConection = async () => {
    try {
        await prisma.$connect();
        return "db conectada!";
    } catch (error: any) {
        log.error(`Error al conectar a la db: ${error.message}`);
    }

    process.on('SIGINT', async () => {
        await prisma.$disconnect();

        return "db desconectada!";
    });
}

export default dbConection;