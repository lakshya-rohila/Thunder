import React, { useMemo, useState, useEffect, useRef } from "react";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);

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
          `[${event.data.level.toUpperCase()}] ${event.data.message}`,
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const srcDoc = useMemo(() => {
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
        padding: 0;
        min-height: 100vh;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            window.parent.postMessage({ type: 'console', level, message }, '*');
          } catch(e) {}
        }

        console.log = function(...args) {
          oldLog.apply(console, args);
          send('log', args);
        };
        console.error = function(...args) {
          oldError.apply(console, args);
          send('error', args);
        };
        console.warn = function(...args) {
          oldWarn.apply(console, args);
          send('warn', args);
        };
        
        // Catch unhandled errors
        window.onerror = function(msg, url, line) {
          send('error', [msg + ' (Line ' + line + ')']);
        };
      })();

      try {
        ${js}
      } catch (e) {
        console.error('Runtime Error:', e);
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
          sandbox="allow-scripts allow-modals"
        />

        {/* Console Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#0D1117]/95 backdrop-blur border-t border-white/10 transition-all duration-300 flex flex-col ${
            showConsole ? "h-48" : "h-8"
          }`}
        >
          {/* Console Header */}
          <div
            className="h-8 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5"
            onClick={() => setShowConsole(!showConsole)}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7A99]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 17l6-6-6-6M12 19h8" />
              </svg>
              <span>Console ({logs.length})</span>
            </div>
            <div className="text-[#6B7A99]">
              {showConsole ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              )}
            </div>
          </div>

          {/* Console Output */}
          <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] space-y-1">
            {logs.length === 0 ? (
              <div className="text-[#4A5568] italic px-2">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 border-b border-white/5 last:border-0 ${
                    log.includes("[ERROR]")
                      ? "text-red-400 bg-red-500/5"
                      : log.includes("[WARN]")
                        ? "text-amber-400 bg-amber-500/5"
                        : "text-[#8B9AB5]"
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
