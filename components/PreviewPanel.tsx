import React, { useMemo } from "react";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        console.error('Preview Script Error:', e);
      }
    </script>
  </body>
</html>`;
  }, [html, css, js]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F19]">
      {/* Browser Chrome Bar */}
      <div className="h-10 bg-[#0D1117] border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        </div>

        {/* URL bar */}
        <div className="flex-1 max-w-lg mx-auto">
          <div className="w-full h-6 bg-[#0B0F19] rounded-md border border-white/6 flex items-center px-3 gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shrink-0" />
            <span className="text-[10px] text-[#4A5568] font-mono truncate select-none">
              thunder-preview.local
            </span>
          </div>
        </div>

        {/* Reload icon */}
        <div className="text-[#4A5568]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </div>
      </div>

      {/* Full iframe — fills all remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          title="Component Preview"
          srcDoc={srcDoc}
          className="absolute inset-0 w-full h-full border-none bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
