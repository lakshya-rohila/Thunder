import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onUpdate: (type: "html" | "css" | "js", value: string) => void;
}

const tabConfig = {
  html: {
    label: "index.html",
    icon: (
      <span className="text-orange-400 font-mono font-bold text-xs">
        &lt;/&gt;
      </span>
    ),
    color: "text-orange-400",
    activeBorder: "border-orange-400",
  },
  css: {
    label: "style.css",
    icon: <span className="text-[#00F5FF] font-mono font-bold text-xs">#</span>,
    color: "text-[#00F5FF]",
    activeBorder: "border-[#00F5FF]",
  },
  js: {
    label: "script.js",
    icon: (
      <span className="text-yellow-400 font-mono font-bold text-xs">JS</span>
    ),
    color: "text-yellow-400",
    activeBorder: "border-yellow-400",
  },
};

export default function CodeTabs({ html, css, js, onUpdate }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [copied, setCopied] = useState(false);

  const currentValue =
    activeTab === "html" ? html : activeTab === "css" ? css : js;

  const editorRef = React.useRef<any>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("thunder-v2", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7A99", fontStyle: "italic" },
        { token: "keyword", foreground: "FF79C6", fontStyle: "bold" },
        { token: "string", foreground: "F1FA8C" },
        { token: "number", foreground: "BD93F9" },
        { token: "tag", foreground: "8BE9FD" },
        { token: "attribute.name", foreground: "50FA7B" },
        { token: "attribute.value", foreground: "F1FA8C" },
        { token: "type", foreground: "8BE9FD" },
      ],
      colors: {
        "editor.background": "#0B0F19", // Thunder bg
        "editor.foreground": "#E2E8F0",
        "editor.lineHighlightBackground": "#1A202C",
        "editorCursor.foreground": "#00F5FF",
        "editor.selectionBackground": "#00F5FF33",
        "editorIndentGuide.background": "#1E293B",
        "editorIndentGuide.activeBackground": "#00F5FF",
      },
    });
    monaco.editor.setTheme("thunder-v2");
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onUpdate(activeTab, value);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-[#0D1117] border-b border-white/5">
        <div className="flex">
          {(["html", "css", "js"] as const).map((tab) => {
            const cfg = tabConfig[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative group px-5 py-3 text-xs font-medium flex items-center gap-2 transition-all duration-200 border-r border-white/5 min-w-[110px] ${
                  isActive
                    ? `bg-[#111827] ${cfg.color}`
                    : "bg-[#0D1117] text-[#4A5568] hover:text-[#8B9AB5] hover:bg-[#111827]/50"
                }`}
              >
                {/* Active top border */}
                {isActive && (
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F5FF] to-[#8A2BE2]`}
                  />
                )}
                {cfg.icon}
                <span className="font-mono">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <div className="px-3">
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              copied
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-[#4A5568] hover:text-[#00F5FF] hover:bg-[#00F5FF]/8 border border-transparent hover:border-[#00F5FF]/20"
            }`}
          >
            {copied ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
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
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Format Button */}
        <div className="px-3 border-l border-white/5">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A5568] hover:text-[#00F5FF] hover:bg-[#00F5FF]/8 border border-transparent hover:border-[#00F5FF]/20 transition-all duration-200"
          >
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
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Format
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={activeTab === "js" ? "javascript" : activeTab}
          theme="thunder-v2"
          value={currentValue}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            scrollBeyondLastLine: false,
            padding: { top: 20, bottom: 20 },
            renderLineHighlight: "gutter",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
