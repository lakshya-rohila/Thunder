import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onUpdate: (type: "html" | "css" | "js", value: string) => void;
}

export default function CodeTabs({ html, css, js, onUpdate }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");

  const copyToClipboard = () => {
    let content = "";
    if (activeTab === "html") content = html;
    if (activeTab === "css") content = css;
    if (activeTab === "js") content = js;
    navigator.clipboard.writeText(content);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onUpdate(activeTab, value);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          {(["html", "css", "js"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-t border-x border-gray-200 dark:border-gray-700"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors"
        >
          Copy
        </button>
      </div>

      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          language={activeTab === "js" ? "javascript" : activeTab}
          theme="vs-dark"
          value={activeTab === "html" ? html : activeTab === "css" ? css : js}
          onChange={handleEditorChange}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
}
