# react-pdf-levelup

Dynamic PDF generator built with React. This tool allows you to create PDF templates using custom JSX components and preview them in real time within a web application. Ideal for invoices, reports, certificates, and more.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/genarogg/react-pdf-levelup)

## 📦 Installation

```bash
npm install @react-pdf-levelup/core
```

## 🌐 Live Playground & Local Studio

### Live Playground
https://react-pdf-levelup.nimbux.cloud/playground

### Local Studio
To use a local Studio in your project, install the package:
```bash
npm install --save-dev @react-pdf-levelup/studio
```
Then run it:
```bash
npx react-pdf-levelup studio
```

## ✨ Features

- 🧱 React components to build PDFs
  - Layout  
  - Text  
  - Table  
  - Grid  
  - Lists  
  - Form  
  - QR  
  - ChartJS  
- Playground
  - 🖼 Real-time preview  
  - 🎨 Live editor powered by Monaco  
  - 📥 Automatic PDF download  
- 🧩 Modular plugin system  
- 🔄 Asynchronous PDF generation in base64  

## 🔌 Plugins

`react-pdf-levelup` includes a plugin system that allows you to extend functionality without overloading the core library, keeping it lightweight and modular.

| Plugin | Installation | Documentation |
|--------|-------------|---------------|
| **@react-pdf-levelup/qr** | `npm install @react-pdf-levelup/qr` | [QR Docs](https://react-pdf-levelup.nimbux.cloud/docs/en/plugin/qr/qr/) |
| **@react-pdf-levelup/chart** | `npm install @react-pdf-levelup/chart` | [Chart Docs](https://react-pdf-levelup.nimbux.cloud/docs/en/components/position/) |
| **@react-pdf-levelup/client** | `npm install @react-pdf-levelup/client` | [Client Docs](https://react-pdf-levelup.nimbux.cloud/docs/en/plugin/client/) |
| **@react-pdf-levelup/icons** | `npm install @react-pdf-levelup/icons` | [Icons Docs](https://react-pdf-levelup.nimbux.cloud/docs/en/plugin/icon/) |
| **@react-pdf-levelup/studio** | `npm install --save-dev @react-pdf-levelup/studio` | Local Studio to create and test templates |

## 📚 Documentation

- **Guides & API:**  
  https://react-pdf-levelup.nimbux.cloud/docs/en/get-started/

- **REST API Guide:**  
  https://react-pdf-levelup.nimbux.cloud/docs/en/guides/api-rest/

## 🌐 REST API for PDF Generation

Generate PDFs via HTTP from any language using a TSX template encoded in base64 and a data object.  
Returns a JSON response with `data.pdf`, which contains the generated PDF in base64 format.

### Endpoints

- Cloud:  
  https://react-pdf-levelup.nimbux.cloud/api

- Self-hosted ZIP:  
  https://genarogg.github.io/react-pdf-levelup/public/api.zip

---

## 🤝 Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## 📄 License

MIT License