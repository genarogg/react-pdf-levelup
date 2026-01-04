import { prisma } from "@fn";
import { AccionesBitacora } from "@prisma/my-client";

interface CrearBitacoraArgs {
  usuarioId: number;
  accion: string;
  mensaje?: string;
  type: AccionesBitacora;
  ip?: string;
}

const crearBitacora = async ({
  usuarioId,
  accion,
  mensaje = "N/A",
  type,
  ip = "N/A",
}: CrearBitacoraArgs) => {
  try {
    const accionLimpia = accion.trim().toLowerCase();
    const literarIP = ip || "N/A";

    const bitacora = await prisma.bitacora.create({
      data: {
        usuarioId,
        accion: accionLimpia,
        ip: literarIP,
        mensaje,
        type,
      },
    });

    return bitacora;
  } catch (error) {
    console.error("Error al crear la bitácora:", error);
    throw new Error("No se pudo crear la bitácora");
  }
};

export default crearBitacora;