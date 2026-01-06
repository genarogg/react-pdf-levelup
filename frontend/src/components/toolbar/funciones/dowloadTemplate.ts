// Importar todos los exports de react-pdf-levelup
import * as ReactPdfLevelup from "../../core";

const downloadTemplate = (templateCode: string) => {
    // Obtener automáticamente todos los componentes disponibles
    const availableComponents = Object.keys(ReactPdfLevelup).filter(key => {
        // Filtrar solo los que empiezan con mayúscula (componentes de React)
        return /^[A-Z]/.test(key);
    });

    // Detectar componentes declarados localmente (const/function/let/var)
    const localDeclarationRegex = /(?:const|function|let|var)\s+([A-Z]\w*)\s*=/g;
    const localComponents = new Set<string>();
    let match;

    while ((match = localDeclarationRegex.exec(templateCode)) !== null) {
        localComponents.add(match[1]);
    }

    // Detectar qué componentes se están usando en el código
    const usedComponents = new Set<string>();

    availableComponents.forEach(component => {
        // Verificar si el componente NO está declarado localmente
        if (!localComponents.has(component)) {
            // Buscar uso del componente como etiqueta JSX
            // Patrones: <Component>, <Component/>, <Component >, </Component>
            const patterns = [
                new RegExp(`<${component}[\\s/>]`),
                new RegExp(`<${component}>`)
            ];

            const isUsed = patterns.some(pattern => pattern.test(templateCode));

            if (isUsed) {
                usedComponents.add(component);
            }
        }
    });

    // Construir el import solo con los componentes utilizados
    let importsSection = 'import React from "react";\n';

    if (usedComponents.size > 0) {
        const sortedComponents = Array.from(usedComponents).sort();
        importsSection += `import { \n`;
        importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
        importsSection += `    } from "react-pdf-levelup";\n`;
    }

    importsSection += '\n\n';

    // Crear el contenido completo del template con imports
    const fullTemplateContent = importsSection + templateCode;

    // Crear un blob con el contenido
    const blob = new Blob([fullTemplateContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Crear un elemento link temporal para descargar
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.tsx";
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default downloadTemplate;