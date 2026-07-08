# react-pdf-levelup

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para facturas, reportes, certificados y más.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/genarogg/react-pdf-levelup)

## 📦 Instalación

```bash
npm install @react-pdf-levelup/core
```

## 🌐 Playground y Studio local

### Playground en vivo:
[https://react-pdf-levelup.nimbux.cloud/playground](https://react-pdf-levelup.nimbux.cloud/playground)

### Studio local:
Para usar un Studio local en tu proyecto, instala el paquete:
```bash
npm install --save-dev @react-pdf-levelup/studio
```
Y ejecútalo:
```bash
npx react-pdf-levelup studio
```

## ✨ Características

- 🧱 Componentes React para construir PDFs
  - Layout 
  - Text 
  - Table
  - Grid
  - Lists 
  - Form
  - QR 
  - ChartJS
- Playground
  - 🖼 Vista previa en tiempo real
  - 🎨 Editor en vivo con Monaco
  - 📥 Descarga automática de PDFs
- 🧩 Sistema de plugins modular
- 🔄 Generación asíncrona de PDFs en base64


## 🔌 Plugins

`react-pdf-levelup` cuenta con un sistema de plugins que permite agregar nuevas capacidades sin sobrecargar el núcleo de la librería, manteniendo el core ligero y modular.

| Plugin | Instalación | Documentación |
|--------|-------------|---------------|
| **@react-pdf-levelup/qr** | `npm install @react-pdf-levelup/qr` | [Docs QR](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#qr) |
| **@react-pdf-levelup/chart** | `npm install @react-pdf-levelup/chart` | [Docs Chart](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#chart) || **@react-pdf-levelup/chart** | `npm install @react-pdf-levelup/chart` | [Docs Chart](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#chart) |
| **@react-pdf-levelup/client** | `npm install @react-pdf-levelup/client` | [Docs Client](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#chart) |
| **@react-pdf-levelup/icons** | `npm install @react-pdf-levelup/icons` | [Docs Icons](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#chart) |
| **@react-pdf-levelup/studio** | `npm install --save-dev @react-pdf-levelup/studio` | Studio local para crear y probar plantillas |

## 📚 Documentación

- **Guías y API:** [https://react-pdf-levelup.nimbux.cloud/docs](https://react-pdf-levelup.nimbux.cloud/docs)
- **API REST Guide:** [https://react-pdf-levelup.nimbux.cloud/docs/guides/api-rest](https://react-pdf-levelup.nimbux.cloud/docs/guides/api-rest)

## 🌐 API REST para generar PDFs

Genera PDFs vía HTTP desde cualquier lenguaje usando un template TSX en base64 y un objeto de datos.  
Devuelve un JSON con `data.pdf` que es el PDF en base64.

### Endpoints

- Cloud:  
https://react-pdf-levelup.nimbux.cloud/api

- Auto-hospedado ZIP:  
https://genarogg.github.io/react-pdf-levelup/public/api.zip

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.


## 📄 Licencia

MIT License