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
 
     // Detectar si se está usando Font.register 
     if (/\bFont\.register\b/.test(templateCode)) { 
         usedComponents.add("Font"); 
     }

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
    let fullTemplateContent = importsSection + templateCode;

    const hasDefaultExport = /\bexport\s+default\b/.test(templateCode);
    if (!hasDefaultExport) {
        const preferredNames = [
            "Component",
            "InvoiceTemplate",
            "ReporteFinanciero",
            "CertificadoTemplate",
            "MyDocument",
            "PDFDocument"
        ];
        const declPatterns = (name: string) => [
            new RegExp(`\\b(?:const|let|var)\\s+${name}\\s*=`),
            new RegExp(`\\bfunction\\s+${name}\\s*\\(`),
            new RegExp(`\\bclass\\s+${name}\\b`)
        ];
        let componentName: string | null = null;
        for (const n of preferredNames) {
            if (declPatterns(n).some(r => r.test(templateCode))) {
                componentName = n;
                break;
            }
        }
        if (!componentName) {
            const genericConst = templateCode.match(/\bconst\s+([A-Z][A-Za-z0-9_]*)\s*=/);
            const genericFunc = templateCode.match(/\bfunction\s+([A-Z][A-Za-z0-9_]*)\s*\(/);
            const genericClass = templateCode.match(/\bclass\s+([A-Z][A-Za-z0-9_]*)\b/);
            componentName = genericConst?.[1] || genericFunc?.[1] || genericClass?.[1] || null;
        }
        if (componentName) {
            fullTemplateContent = `${fullTemplateContent}\n\nexport default ${componentName};\n`;
        }
    }

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
