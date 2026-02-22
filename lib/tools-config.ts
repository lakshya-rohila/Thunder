import React from "react";

export const TOOLS = [
  {
    id: "invoice-extractor",
    name: "Invoice Data Extractor",
    description: "Extract structured data from invoices instantly.",
    icon: "invoice", // Simplified for shared config
    useCase: "Extract vendor, date, total amount, and items.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    accept: ".png,.jpg,.jpeg", // LayoutLMv3 expects images
    details: "This tool uses AI to identify key fields in invoice documents (PDF/Image). It extracts the Vendor Name, Invoice Number, Date, and Total Amount, converting unstructured layouts into structured JSON data you can use in your accounting software.",
  },
  {
    id: "form-parser",
    name: "Form Parser",
    description: "Convert handwritten or digital forms into JSON.",
    icon: "form",
    useCase: "Digitize applications, surveys, and receipts.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    accept: ".png,.jpg,.jpeg", // Donut expects images
    details: "This tool is designed to digitize handwritten or printed forms. It reads checkboxes, text fields, and tables, converting them into digital key-value pairs.",
  },
  {
    id: "table-extractor",
    name: "Table Extractor",
    description: "Detect and extract tables from PDFs or images.",
    icon: "table",
    useCase: "Convert PDF tables to CSV/JSON.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20",
    accept: ".png,.jpg,.jpeg", // Table Transformer expects images
    details: "This tool specifically identifies tables within documents. It preserves the row and column structure, allowing you to export data directly to CSV or Excel formats.",
  },
  {
    id: "document-reader",
    name: "Full Document Reader",
    description: "Convert scanned documents into readable text.",
    icon: "doc",
    useCase: "Process scientific papers and legal docs.",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    accept: ".pdf,.md,.txt", // Nougat is best with PDFs, but we can support others via direct read
    details: "This tool converts documents (PDF, Markdown, Text) into clean, machine-readable text. It preserves headings, lists, and formatting, making it ideal for converting legacy PDFs into editable Markdown.",
  },
  {
    id: "screenshot",
    name: "Screenshot to Code",
    description: "Convert UI screenshots into clean HTML/Tailwind.",
    icon: "image",
    useCase: "Recreate existing websites or mockups.",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20",
    accept: ".png,.jpg,.jpeg",
    details: "This tool analyzes UI screenshots and generates the corresponding HTML and Tailwind CSS code, speeding up the frontend development process.",
  },
  {
    id: "image-generation",
    name: "AI Image Generator",
    description: "Create stunning visuals from text prompts.",
    icon: "art",
    useCase: "Generate assets for your projects.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    accept: "",
    details: "This tool uses text-to-image diffusion models to generate high-quality visual assets from your text descriptions.",
  },
];
