import accounting from 'accounting'
import writtenNumber from 'written-number';

/**
 * Formatea un número como moneda usando puntos tanto para miles como para decimales.
 *
 * @param value - El valor numérico a formatear (puede ser número o cadena).
 * @returns La cadena formateada, por ejemplo "19.134.18".
 */
const money = (value: number | string): string => {
    return accounting.formatMoney(value, {
        symbol: '',
        precision: 2,
        thousand: '.',
        decimal: '.',
    })
}

/**
 * Convierte un monto numérico a su representación en texto
 * @param monto - El monto a convertir (puede ser number o string)
 * @param moneda - Configuración de la moneda (opcional)
 * @returns El monto en texto
 */
const moneyToString = (
    monto: number | string,
    moneda?: {
        plural?: string;
        singular?: string;
        centPlural?: string;
        centSingular?: string;
    }
): string => {
    const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : monto;

    const configuracionMoneda = {
        plural: moneda?.plural || 'Bolívares',
        singular: moneda?.singular || 'Bolívar',
        centPlural: moneda?.centPlural || 'céntimos',
        centSingular: moneda?.centSingular || 'céntimo'
    };

    try {
        // Separar parte entera y decimales
        const entero = Math.floor(montoNumerico);
        const decimales = Math.round((montoNumerico % 1) * 100);

        // Convertir parte entera a texto
        let textoEntero = writtenNumber(entero, { lang: 'es' });
        
        // Capitalizar primera letra
        textoEntero = textoEntero.charAt(0).toUpperCase() + textoEntero.slice(1);

        // Convertir decimales a texto
        let textoDecimales = writtenNumber(decimales, { lang: 'es' });

        // Determinar si es singular o plural para la moneda
        const textoMoneda = entero === 1 ? configuracionMoneda.singular : configuracionMoneda.plural;
        
        // Determinar si es singular o plural para los centavos
        const textoCentimos = decimales === 1 ? configuracionMoneda.centSingular : configuracionMoneda.centPlural;

        // Construir el texto completo
        const texto = `${textoEntero} ${textoMoneda} con ${textoDecimales} ${textoCentimos}`;

        return texto;
    } catch (error) {
        console.error('Error al convertir monto a texto:', error);
        return `${montoNumerico} ${configuracionMoneda.plural}`;
    }
}

export { money, moneyToString };
