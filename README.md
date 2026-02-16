# react-pdf-levelup

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para facturas, reportes, certificados y más.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

## 📦 Instalación

```bash
npm install @react-pdf-levelup/core
```

## 🌐 Playground en vivo:

[https://react-pdf-levelup.nimbux.cloud/playground](https://react-pdf-levelup.nimbux.cloud/playground)

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


## 🌐 API REST para generar PDFs

Genera PDFs vía HTTP desde cualquier lenguaje usando un template TSX en base64 y un objeto de datos.  
Devuelve un JSON con `data.pdf` que es el PDF en base64.

### Endpoints

- Cloud:  
https://react-pdf-levelup.nimbux.cloud/api

- Auto-hospedado ZIP:  
https://genarogg.github.io/react-pdf-levelup/public/api.zip