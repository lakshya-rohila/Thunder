import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onUpdate: (type: "html" | "css" | "js", value: string) => void;
}

// Simple File Explorer Component (Mock for now, to be expanded)
function FileExplorer({ activeTab, onSelect }: { activeTab: string, onSelect: (tab: "html" | "css" | "js") => void }) {
  return (
    <div className="w-48 bg-[#0B0F19] border-r border-white/5 flex flex-col">
      <div className="px-4 py-3 text-xs font-bold text-[#6B7A99] uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex flex-col gap-0.5 px-2">
        <button
          onClick={() => onSelect("html")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
            activeTab === "html" ? "bg-[#00F5FF]/10 text-[#00F5FF]" : "text-[#8B9AB5] hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-orange-400">&lt;/&gt;</span>
          index.html
        </button>
        <button
          onClick={() => onSelect("css")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
            activeTab === "css" ? "bg-[#00F5FF]/10 text-[#00F5FF]" : "text-[#8B9AB5] hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-[#00F5FF]">#</span>
          style.css
        </button>
        <button
          onClick={() => onSelect("js")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
            activeTab === "js" ? "bg-[#00F5FF]/10 text-[#00F5FF]" : "text-[#8B9AB5] hover:text-white hover:bg-white/5"
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
    <div className="flex h-full bg-[#111827] overflow-hidden">
      {/* Sidebar Explorer */}
      {showExplorer && <FileExplorer activeTab={activeTab} onSelect={setActiveTab} />}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-[#0D1117] border-b border-white/5 h-10 px-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowExplorer(!showExplorer)}
              className="text-[#6B7A99] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
            <span className="text-xs text-[#6B7A99] font-mono">
              {activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="p-1.5 text-[#6B7A99] hover:text-white transition-colors"
              title="Format Code"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10H3" />
                <path d="M21 6H3" />
                <path d="M21 14H3" />
                <path d="M21 18H3" />
              </svg>
            </button>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/5 text-[#6B7A99] hover:text-white hover:bg-white/10"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied
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
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
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
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
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
