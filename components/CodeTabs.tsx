import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onUpdate: (type: "html" | "css" | "js", value: string) => void;
}

// Simple File Explorer Component (Mock for now, to be expanded)
function FileExplorer({
  activeTab,
  onSelect,
}: {
  activeTab: string;
  onSelect: (tab: "html" | "css" | "js") => void;
}) {
  return (
    <div className="w-48 bg-[#050505] border-r border-white/10 flex flex-col">
      <div className="px-4 py-3 text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest font-mono border-b border-white/10">
        Explorer
      </div>
      <div className="flex flex-col px-2 py-2 gap-1">
        <button
          onClick={() => onSelect("html")}
          className={`flex items-center gap-2 px-3 py-2 text-[10px] font-bold font-mono tracking-wider transition-colors border ${
            activeTab === "html"
              ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
              : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20"
          }`}
        >
          <span className="text-[#FF4500]">{"</>"}</span>
          index.html
        </button>

        <button
          onClick={() => onSelect("css")}
          className={`flex items-center gap-2 px-3 py-2 text-[10px] font-bold font-mono tracking-wider transition-colors border ${
            activeTab === "css"
              ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
              : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20"
          }`}
        >
          <span className="text-[#00F5FF]">#</span>
          style.css
        </button>

        <button
          onClick={() => onSelect("js")}
          className={`flex items-center gap-2 px-3 py-2 text-[10px] font-bold font-mono tracking-wider transition-colors border ${
            activeTab === "js"
              ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
              : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20"
          }`}
        >
          <span className="text-yellow-400">JS</span>
          script.js
        </button>
      </div>
    </div>
  );
}

export default function CodeTabs({ html, css, js, onUpdate }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [showExplorer, setShowExplorer] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentValue =
    activeTab === "html" ? html : activeTab === "css" ? css : js;

  const language =
    activeTab === "html" ? "html" : activeTab === "css" ? "css" : "javascript";

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
        { token: "keyword", foreground: "FF4500", fontStyle: "bold" },
        { token: "string", foreground: "DFFF00" },
        { token: "number", foreground: "00F5FF" },
        { token: "tag", foreground: "FAFAFA", fontStyle: "bold" },
        { token: "attribute.name", foreground: "A1A1AA" },
        { token: "attribute.value", foreground: "DFFF00" },
        { token: "type", foreground: "FAFAFA", fontStyle: "bold" },
      ],
      colors: {
        "editor.background": "#050505", // Thunder bg geometric
        "editor.foreground": "#FAFAFA",
        "editor.lineHighlightBackground": "#111111",
        "editorCursor.foreground": "#DFFF00",
        "editor.selectionBackground": "#DFFF0033",
        "editorIndentGuide.background": "#1A1A1A",
        "editorIndentGuide.activeBackground": "#DFFF00",
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
    <div className="flex h-full bg-[#050505] overflow-hidden">
      {/* Sidebar Explorer */}
      {showExplorer && (
        <FileExplorer activeTab={activeTab} onSelect={setActiveTab} />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-[#050505] border-b border-white/10 h-10 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <rect x="3" y="3" width="18" height="18" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            <span className="text-[10px] text-[#A1A1AA] font-mono font-bold tracking-widest uppercase">
              {activeTab === "html"
                ? "index.html"
                : activeTab === "css"
                  ? "style.css"
                  : "script.js"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFormat}
              className="p-1 px-2 border-2 border-transparent text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-white/20 transition-colors"
              title="Format Code"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M21 10H3" />
                <path d="M21 6H3" />
                <path d="M21 14H3" />
                <path d="M21 18H3" />
              </svg>
            </button>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors font-mono border-2 ${
                copied
                  ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
                  : "bg-transparent text-[#A1A1AA] border-white/20 hover:text-[#FAFAFA] hover:border-[#FAFAFA]"
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
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  COPIED
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
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <rect x="9" y="9" width="13" height="13" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  COPY
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={
              activeTab === "js"
                ? "javascript"
                : activeTab === "html"
                  ? "html"
                  : "css"
            }
            theme="thunder-v2"
            value={currentValue}
            onChange={(value) => onUpdate(activeTab, value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily:
                "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
              lineHeight: 20,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
