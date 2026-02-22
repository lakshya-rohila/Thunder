import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";

const LoadingFallback = () => {
  const t = useTranslations("PreviewPanel");
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      {t("loading")}
    </div>
  );
};

// Dynamically import Sandpack to avoid SSR issues and reduce initial bundle size
const SandpackPreviewComponent = dynamic(
  () => import("@/components/SandpackPreview"),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  },
);

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
  jsx?: string;
}

export default function PreviewPanel({
  html,
  css,
  js,
  jsx,
}: PreviewPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);

  // Heuristic: If JSX is missing but JS looks like React, treat it as JSX
  const isJsActuallyJsx =
    !jsx &&
    js &&
    (js.includes("import React") ||
      js.includes("export default function") ||
      js.includes("className=") ||
      js.includes("<div") ||
      js.includes("return ("));

  const effectiveJsx = jsx || (isJsActuallyJsx ? js : undefined);

  // Clear logs when code changes
  useEffect(() => {
    setLogs([]);
  }, [html, css, js, jsx]);

  // Listen for messages from iframe (Standard Mode)
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

  // If we have React/JSX code, use Sandpack
  if (effectiveJsx) {
    return <SandpackPreviewComponent code={effectiveJsx} css={css} />;
  }

  // Otherwise, use the standard iframe
  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        title="preview"
        srcDoc={srcDoc}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      />

      {/* Console Overlay (Optional) */}
      {logs.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-black/90 text-white p-2 overflow-auto text-xs font-mono z-50 opacity-0 hover:opacity-100 transition-opacity">
          {logs.map((log, i) => (
            <div key={i} className="border-b border-white/10 py-1">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
