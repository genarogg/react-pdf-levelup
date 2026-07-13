# Example Report PDF

This folder contains a sample PDF template built with the **react-pdf-levelup** skill, showcasing:

- Bar chart (`<ChartJS>`)  
- Data table (`<Table>`)  
- Stylized text sections (`<H1>`, `<H2>`, `<P>`)  

## How to generate the PDF

1. **Install dependencies** (if not already present):
   ```bash
   npm i @react-pdf-levelup/core @react-pdf/renderer
   ```

2. **Create a small runner script** (e.g., `generateReport.js`):
   ```js
   import { generatePDF } from '@react-pdf-levelup/core';
   import { ReportTemplate } from './template.jsx';

   const data = [
     { month: 'Jan', product: 'A', sales: 12000, qty: 200 },
     { month: 'Feb', product: 'B', sales: 9000,  qty: 150 },
     { month: 'Mar', product: 'A', sales: 15000, qty: 180 },
     { month: 'Apr', product: 'B', sales: 11000, qty: 160 },
     { month: 'May', product: 'A', sales: 19000, qty: 190 },
   ];

   // Adjust data shape to match component's prop
   generatePDF({
     template: ReportTemplate,
     data: { title: 'Monthly Sales Report', author: 'Finance Team', data: data },
   })
     .then((base64) => {
       // Use decodeBase64Pdf from the same package to download/open
       const { decodeBase64Pdf } = require('@react-pdf-levelup/core');
       decodeBase64Pdf(base64, 'sales-report.pdf');
     })
     .catch(console.error);
   ```

3. **Run the script**:
   ```bash
   node generateReport.js
   ```

4. The file `sales-report.pdf` will appear in the same folder.

> **Note**: The template uses Inter font. Ensure the Font.register URLs are reachable; they point to Google Fonts on GitHub (CORS‑safe). If you prefer local fonts, replace the `src` values with absolute `https://` URLs to your own hosted .ttf files.

## Folder layout
```
example-report/
├─ template.jsx   ← React component defining the PDF layout
├─ generateReport.js (optional) ← script to produce the PDF
└─ README.md      ← this file
```