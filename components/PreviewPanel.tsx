import React, { useMemo } from "react";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  // Memoize the srcDoc to prevent unnecessary re-renders
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #f3f4f6;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (e) {
              console.error('Component Script Error:', e);
            }
          </script>
        </body>
      </html>
    `;
  }, [html, css, js]);

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Live Preview
        </span>
      </div>
      <iframe
        title="Component Preview"
        className="w-full h-[calc(100%-40px)] border-0"
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        // IMPORTANT: No allow-same-origin. This prevents accessing local storage, cookies, etc.
      />
    </div>
  );
}
