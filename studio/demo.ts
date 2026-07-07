import React from "react";
import { generatePDF } from "@react-pdf-levelup/core";
import Index from "./templates/Index";

const runDemo = async () => {
  try {
    const filePath = "./output.pdf"; 
    await generatePDF({ template: Index });
    console.log(`PDF generated successfully at ${filePath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

runDemo();
