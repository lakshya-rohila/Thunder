import React, { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const t = useTranslations("PreviewPanel");

  // Clear logs when code changes
  useEffect(() => {
    setLogs([]);
  }, [html, css, js]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        setLogs((prev) => [
          ...prev,
          `[${(event.data.level || "info").toUpperCase()}] ${event.data.message}`,
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const srcDoc = useMemo(() => {
    // ---------------------------------------------------------------------------
    // HTML / STANDARD MODE
    // ---------------------------------------------------------------------------
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* Reset & Base Styles */
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 20px;
        min-height: 100vh;
        background-color: #ffffff;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, sans-serif;
      }
      /* Custom CSS */
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      // Console Proxy
      (function() {
        const oldLog = console.log;
        const oldError = console.error;
        const oldWarn = console.warn;

        function send(level, args) {
          try {
            const message = args.map(arg => {
              if (arg instanceof Error) return arg.toString();
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            }).join(' ');
            window.parent.postMessage({ type: 'console', level, message }, '*');
          } catch(e) {}
        }
        console.log = function(...args) { oldLog.apply(console, args); send('log', args); };
        console.error = function(...args) { oldError.apply(console, args); send('error', args); };
        console.warn = function(...args) { oldWarn.apply(console, args); send('warn', args); };
        window.onerror = function(msg, url, line) { send('error', [msg + ' (Line ' + line + ')']); };
      })();
    </script>
    <script>
      try {
        ${js}
      } catch (e) {
        console.error(e);
      }
    </script>
  </body>
</html>`;
  }, [html, css, js]);

  return (
    <div className="w-full h-full bg-[#050505] relative">
      <iframe
        title="preview"
        srcDoc={srcDoc}
        className="w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      />

      {/* Console Overlay (Optional) */}
      {logs.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-[#050505]/90 text-[#FAFAFA] border-t-2 border-[#FF4500] p-4 overflow-auto text-xs font-mono z-50 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FF4500] font-black uppercase tracking-widest">
              Console Output
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[#A1A1AA] hover:text-[#FAFAFA] uppercase text-[9px] tracking-widest"
            >
              Clear
            </button>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="border-b border-white/10 py-1.5 flex gap-2">
              <span className="text-[#A1A1AA]">►</span>
              <span
                className={
                  log.includes("[ERROR]")
                    ? "text-[#FF4500]"
                    : log.includes("[WARN]")
                      ? "text-[#DFFF00]"
                      : "text-white"
                }
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
