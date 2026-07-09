// Importar todos los exports de react-pdf-levelup
import * as ReactPdfLevelup from "@react-pdf-levelup/core";
// Fuente de Icon.tsx como texto crudo (Vite ?raw), para poder descargarla
// junto al template cuando el usuario lo usa (ver nota más abajo).



// Tipos para mejorar la legibilidad y mantenibilidad
interface LibraryComponents {
  core: string[];
  qr: string[];
  chart: string[];
  icon: string[];
}

interface UsedComponents {
  core: Set<string>;
  qr: Set<string>;
  chart: Set<string>;
  icon: Set<string>;
}

// Función pura para detectar componentes utilizados
const detectUsedComponents = (code: string, libraryComponents: LibraryComponents): UsedComponents => {
  const localDeclarationRegex = /(?:const|function|let|var)\s+([A-Z]\w*)\s*=/g;
  const localComponents = new Set<string>();
  let match;

  while ((match = localDeclarationRegex.exec(code)) !== null) {
    localComponents.add(match[1]);
  }

  const usedComponents: UsedComponents = {
    core: new Set<string>(),
    qr: new Set<string>(),
    chart: new Set<string>(),
    icon: new Set<string>()
  };

  const isComponentUsed = (component: string, componentCode: string): boolean => {
    if (localComponents.has(component)) {
      return false;
    }
    const patterns = [
      new RegExp(`<${component}[\\s/>]`),
      new RegExp(`<${component}>`)
    ];
    return patterns.some(pattern => pattern.test(componentCode));
  };

  libraryComponents.qr.forEach(component => {
    if (isComponentUsed(component, code)) {
      usedComponents.qr.add(component);
    }
  });

  libraryComponents.chart.forEach(component => {
    if (isComponentUsed(component, code)) {
      usedComponents.chart.add(component);
    }
  });

  libraryComponents.icon.forEach(component => {
    if (isComponentUsed(component, code)) {
      usedComponents.icon.add(component);
    }
  });

  const qrChartAndIconComponents = [...libraryComponents.qr, ...libraryComponents.chart, ...libraryComponents.icon];
  libraryComponents.core.forEach(component => {
    if (!qrChartAndIconComponents.includes(component)) {
      if (isComponentUsed(component, code)) {
        usedComponents.core.add(component);
      }
    }
  });

  if (/\bFont\.register\b/.test(code)) {
    usedComponents.core.add("Font");
  }

  // StyleSheet, igual que Font, nunca se usa como etiqueta JSX (`<StyleSheet>`)
  // sino como llamada de método (`StyleSheet.create({...})`), así que el
  // patrón `<Componente>` de isComponentUsed nunca lo detecta. Sin este caso
  // especial, StyleSheet queda afuera del import aunque el código lo use.
  if (/\bStyleSheet\.\w+\s*\(/.test(code)) {
    usedComponents.core.add("StyleSheet");
  }

  return usedComponents;
};

// Función pura para construir la sección de imports
const buildImportsSection = (usedComponents: UsedComponents): string => {
  let importsSection = 'import React from "react";\n';

  if (usedComponents.core.size > 0) {
    const sortedComponents = Array.from(usedComponents.core).sort();
    importsSection += `import { \n`;
    importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
    importsSection += `    } from "@react-pdf-levelup/core";\n`;
  }

  if (usedComponents.qr.size > 0) {
    const sortedComponents = Array.from(usedComponents.qr).sort();
    importsSection += `import { \n`;
    importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
    importsSection += `    } from "@react-pdf-levelup/qr";\n`;
  }

  if (usedComponents.chart.size > 0) {
    const sortedComponents = Array.from(usedComponents.chart).sort();
    importsSection += `import { \n`;
    importsSection += `      ${sortedComponents.join(',\n      ')}\n`;
    importsSection += `    } from "@react-pdf-levelup/chart";\n`;
  }

  // Icon todavía no tiene paquete npm propio: se descarga junto al template
  // como archivo aparte (./Icon.tsx) e importa con ruta relativa, en vez de
  // un specifier de paquete que no existiría al abrir el proyecto del
  // usuario.
  if (usedComponents.icon.size > 0) {
    importsSection += `import Icon from "./Icon";\n`;
  }

  return importsSection + '\n\n';
};

// Función de efecto para descargar un archivo de texto
const downloadTextFile = (filename: string, content: string, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadTemplate = (templateCode: string) => {
    const libraryComponents = {
        core: Object.keys(ReactPdfLevelup).filter(key => /^[A-Z]/.test(key)),
        qr: ['QR', 'QRstyle'],
        chart: ['ChartJS'],
        icon: ['Icon']
    };

    const usedComponents = detectUsedComponents(templateCode, libraryComponents);
    const importsSection = buildImportsSection(usedComponents);

    let fullTemplateContent = importsSection + templateCode;

    const hasDefaultExport = /\bexport\s+default\b/.test(templateCode);
    if (!hasDefaultExport) {
        fullTemplateContent += `\n// ERROR: No se encontró un componente exportado por defecto. Agrega 'export default MiComponente;' al final de tu código.`;
    }

    downloadTextFile("template.tsx", fullTemplateContent);
};


export default downloadTemplate;
