"use client";

import React, { useState } from "react";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResultViewerProps {
  data: any;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
  toolName: string;
}

export default function ResultViewer({ data, status, error, toolName }: ResultViewerProps) {
  const [copied, setCopied] = useState(false);

  // Check if data contains markdown content (from Document Reader)
  const markdownContent = data?.markdown;

  const handleCopy = async () => {
    if (data) {
      const contentToCopy = markdownContent || JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    const content = markdownContent || JSON.stringify(data, null, 2);
    const type = markdownContent ? "text/markdown" : "application/json";
    const extension = markdownContent ? "md" : "json";
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName}-result-${new Date().getTime()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (status === "failed") {
    return (
      <div className="w-full h-full min-h-[400px] bg-[#0D1117] border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Processing Failed</h3>
        <p className="text-red-400 max-w-md">{error || "An unexpected error occurred. Please try again."}</p>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="w-full h-full min-h-[400px] bg-[#0D1117] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Loading Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        
        <div className="relative z-10">
          <div className="flex gap-2 mb-6 justify-center">
            <span className="w-3 h-3 rounded-full bg-[#00F5FF] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-3 h-3 rounded-full bg-[#8A2BE2] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-3 h-3 rounded-full bg-[#00F5FF] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Document...</h3>
          <p className="text-[#8B9AB5]">Our AI models are extracting structured data.</p>
        </div>
      </div>
    );
  }

  if (status === "pending" && !data) {
    return (
      <div className="w-full h-full min-h-[400px] bg-[#0D1117] border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-[#4A5568]">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Upload a document to see extracted results here.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-[#0B0F19] flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Extraction Complete
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/5 rounded-lg text-[#8B9AB5] hover:text-white transition-colors"
            title="Copy JSON"
          >
            {copied ? (
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/5 rounded-lg text-[#8B9AB5] hover:text-white transition-colors"
            title="Download JSON"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 overflow-auto bg-[#0B0F19] p-0 custom-scrollbar">
        {markdownContent ? (
          <div className="p-8 prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        ) : (
          <ReactSyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              background: "transparent",
              fontSize: "0.9rem",
              fontFamily: "monospace",
            }}
            showLineNumbers={true}
          >
            {JSON.stringify(data, null, 2)}
          </ReactSyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
