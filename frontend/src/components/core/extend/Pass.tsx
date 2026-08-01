import React from 'react';

/**
 * Placeholder nulo, equivalente a `pass` en Python.
 *
 * Se usa cuando un componente padre requiere `children` (por contrato
 * de TS o porque renderiza los hijos y espera al menos uno) pero por
 * el momento no querés pasarle contenido real — `Pass` no renderiza
 * nada (devuelve un Fragment vacío) y NO acepta `children`.
 *
 * Funciona como un stub temporal: cuando más tarde querás meter
 * contenido real, simplemente eliminás `<Pass />` y ponés los hijos
 * directamente en su lugar.
 *
 * También sirve como marcador visual de "aquí va contenido más tarde"
 * en plantillas de trabajo.
 */
interface PassProps {}

const Pass: React.FC<PassProps> = () => {
    return <></>;
};

export default Pass;