
interface PaginacionParams {
    page?: number;
    pageSize?: number;
}

interface PaginacionResult {
    skip: number;
    take: number;
}

interface PaginacionMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Calcula los parámetros skip y take para Prisma basados en la página y el tamaño de página.
 */
const getPaginacionParams = ({ page = 1, pageSize = 10 }: PaginacionParams): PaginacionResult => {
    const p = Math.max(1, page);
    const ps = Math.max(1, pageSize);
    
    return {
        skip: (p - 1) * ps,
        take: ps,
    };
};

/**
 * Genera los metadatos de paginación para la respuesta.
 */
const getPaginacionMeta = (total: number, { page = 1, pageSize = 10 }: PaginacionParams): PaginacionMeta => {
    const p = Math.max(1, page);
    const ps = Math.max(1, pageSize);
    const totalPages = Math.ceil(total / ps);

    return {
        page: p,
        pageSize: ps,
        total,
        totalPages,
        hasNextPage: p < totalPages,
        hasPrevPage: p > 1,
    };
};

export { getPaginacionParams, getPaginacionMeta };
