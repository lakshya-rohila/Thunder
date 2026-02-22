import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
  useSandpackConsole,
} from "@codesandbox/sandpack-react";

interface SandpackPreviewProps {
  code: string;
  css?: string;
}

// Custom component to capture console logs
function ConsoleTracker({
  onLog,
}: {
  onLog: (logs: { method: string; data: string[] }[]) => void;
}) {
  const { logs } = useSandpackConsole({ resetOnPreviewRestart: true });

  useEffect(() => {
    onLog(
      logs.map((l) => ({
        method: l.method,
        data: (l.data || []).map((item) =>
          typeof item === "object" ? JSON.stringify(item) : String(item),
        ),
      })),
    );
  }, [logs, onLog]);

  return null;
}

export default function SandpackPreviewComponent({
  code,
  css = "",
}: SandpackPreviewProps) {
  const [logs, setLogs] = useState<string[]>([]);

  // Prepare files for Sandpack (Realistic Project Structure like Bolt/Lovable)
  const files = {
    "/package.json": {
      code: JSON.stringify(
        {
          name: "thunder-generated-app",
          version: "1.0.0",
          main: "src/index.js",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.292.0",
            "framer-motion": "^10.16.4",
            clsx: "^2.0.0",
            "tailwind-merge": "^2.0.0",
          },
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject",
          },
          devDependencies: {
            "react-scripts": "^5.0.1",
          },
        },
        null,
        2,
      ),
    },
    "/src/index.js": {
      code: `import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    },
    "/src/App.jsx": {
      code: code,
      active: true,
    },
    "/src/index.css": {
      code: css,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thunder Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
  };

  return (
    <div className="h-full w-full bg-[#0B0F19] overflow-hidden">
      <SandpackProvider
        template="react"
        theme="dark"
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          classes: {
            "sp-wrapper": "h-full",
            "sp-layout": "h-full",
            "sp-preview": "h-full",
          },
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "latest",
            "framer-motion": "latest",
            clsx: "latest",
            "tailwind-merge": "latest",
          },
        }}
      >
        <SandpackLayout className="h-full border-none! rounded-none!">
          <SandpackPreview
            showNavigator={false}
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            className="h-full"
          />
        </SandpackLayout>
        <div className="hidden">
          <ConsoleTracker
            onLog={(newLogs) => {
              const formattedLogs = newLogs.map(
                (l) =>
                  `[${(l.method || "info").toUpperCase()}] ${l.data.join(" ")}`,
              );
              // Send logs to parent window if needed, or just store local
              // window.parent.postMessage({ type: 'console', ... })
            }}
          />
        </div>
      </SandpackProvider>
    </div>
  );
}
