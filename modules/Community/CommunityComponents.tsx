import React, { useState } from "react";

export function ComponentPreview({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const srcDoc = `<!DOCTYPE html><html><head><style>*{box-sizing:border-box;margin:0;padding:0}body{margin:0;padding:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="w-full h-full border-0 pointer-events-none"
      title="Component preview"
    />
  );
}

export function CopyButton({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const combined = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    await navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200"
      style={{
        background: copied ? "rgba(0,245,255,0.12)" : "rgba(255,255,255,0.05)",
        color: copied ? "#00F5FF" : "#6B7A99",
        border: `1px solid ${copied ? "rgba(0,245,255,0.25)" : "rgba(255,255,255,0.06)"}`,
      }}
      title="Copy component code"
    >
      {copied ? (
        <>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
