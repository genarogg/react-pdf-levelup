const getDate = () => {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Enero es 0
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
};


const getNextYear = (): string => {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const añoActual = fecha.getFullYear();
    const proximoAño = añoActual + 1;
    return `${dia}/${mes}/${proximoAño}`;
};

/**
 * Convierte cualquier fecha válida a formato:
 * "15 de enero de 2024"
 */
const dateToString = (fechaEntrada: string | Date): string => {
    let fecha: Date;

    // Si ya es un objeto Date
    if (fechaEntrada instanceof Date) {
        fecha = fechaEntrada;
    } else {
        // Si viene en formato DD/MM/YYYY lo convertimos manualmente
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaEntrada)) {
            const [dia, mes, anio] = fechaEntrada.split("/").map(Number);
            fecha = new Date(anio, mes - 1, dia);
        } else {
            // Para formatos estándar: "2024-01-15", "2024/01/15", ISO, etc.
            fecha = new Date(fechaEntrada);
        }
    }

    if (isNaN(fecha.getTime())) {
        return "Fecha inválida"; // Manejo básico
    }

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
};

export { getNextYear, getDate, dateToString };