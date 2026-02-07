// Importar todos los exports de react-pdf-levelup
import * as ReactPdfLevelup from "../../core";

const downloadTemplate = (templateCode: string) => {
    // Configurar componentes por librería
    const libraryComponents = {
        core: Object.keys(ReactPdfLevelup).filter(key => /^[A-Z]/.test(key)),
        qr: ['QR', 'QRStyle'],
        chart: ['ChartJS']
    };

    // Detectar componentes declarados localmente (const/function/let/var)
    const localDeclarationRegex = /(?:const|function|let|var)\s+([A-Z]\w*)\s*=/g;
    const localComponents = new Set<string>();
    let match;

    while ((match = localDeclarationRegex.exec(templateCode)) !== null) {
        localComponents.add(match[1]);
    }

    // Detectar qué componentes se están usando en el código, organizados por librería
    const usedComponents = {
        core: new Set<string>(),
        qr: new Set<string>(),
        chart: new Set<string>()
    };

    // Función para verificar si un componente se usa en el código
    const isComponentUsed = (component: string, code: string): boolean => {
        if (localComponents.has(component)) {
            return false;
        }

        const patterns = [
            new RegExp(`<${component}[\\s/>]`),
            new RegExp(`<${component}>`)
        ];

        return patterns.some(pattern => pattern.test(code));
    };

    // Detectar componentes de QR
    libraryComponents.qr.forEach(component => {
        if (isComponentUsed(component, templateCode)) {
            usedComponents.qr.add(component);
        }
    });

    // Detectar componentes de Chart
    libraryComponents.chart.forEach(component => {
        if (isComponentUsed(component, templateCode)) {
            usedComponents.chart.add(component);
        }
    });

    // Detectar componentes de Core (excluyendo los de QR y Chart)
    const qrAndChartComponents = [...libraryComponents.qr, ...libraryComponents.chart];
    libraryComponents.core.forEach(component => {
        // Solo agregar a core si no pertenece a qr o chart
        if (!qrAndChartComponents.includes(component)) {
            if (isComponentUsed(component, templateCode)) {
                usedComponents.core.add(component);
            }
        }
    });

    // Detectar si se está usando Font.register
    if (/\bFont\.register\b/.test(templateCode)) {
        usedComponents.core.add("Font");
    }

    // Construir los imports organizados por librería
    let importsSection = 'import React from "react";\n';

    // Import de @react-pdf-levelup/core
    if (usedComponents.core.size > 0) {
        const sortedComponents = Array.from(usedComponents.core).sort();
        importsSection += `import { \n`;
        importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
        importsSection += `    } from "@react-pdf-levelup/core";\n`;
    }

    // Import de @react-pdf-levelup/qr
    if (usedComponents.qr.size > 0) {
        const sortedComponents = Array.from(usedComponents.qr).sort();
        importsSection += `import { \n`;
        importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
        importsSection += `    } from "@react-pdf-levelup/qr";\n`;
    }

    // Import de @react-pdf-levelup/chart
    if (usedComponents.chart.size > 0) {
        const sortedComponents = Array.from(usedComponents.chart).sort();
        importsSection += `import { \n`;
        importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
        importsSection += `    } from "@react-pdf-levelup/chart";\n`;
    }

    importsSection += '\n\n';

    // Crear el contenido completo del template con imports
    let fullTemplateContent = importsSection + templateCode;

    // Detectar y agregar export default si no existe
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