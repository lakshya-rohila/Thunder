"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import UploadZone from "@/components/DocumentAI/UploadZone";
import ResultViewer from "@/components/DocumentAI/ResultViewer";
import { TOOLS } from "@/lib/tools-config";

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.tool as string;
  const tool = TOOLS.find((t) => t.id === toolId);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  // If tool not found, redirect to list
  useEffect(() => {
    if (!tool && toolId) {
      router.push("/ai-tools");
    }
  }, [tool, toolId, router]);

  if (!tool) return null;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("processing");
    setError(undefined);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`/api/ai/${toolId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process document");
      }

      setResult(data.data);
      setStatus("completed");
    } catch (err: any) {
      console.error("Processing Error:", err);
      setError(err.message || "An unexpected error occurred");
      setStatus("failed");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("pending");
    setError(undefined);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Sidebar: Upload & Controls */}
        <div className="w-full lg:w-1/3 border-r border-white/5 bg-[#0D1117] p-6 flex flex-col overflow-y-auto">
          <Link href="/ai-tools" className="inline-flex items-center text-xs text-[#6B7A99] hover:text-white mb-6 transition-colors">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.bgColor} ${tool.color} border ${tool.borderColor}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{tool.name}</h1>
              <p className="text-xs text-[#8B9AB5]">{tool.useCase}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-[#161B22] border border-white/5 rounded-xl p-4 text-xs text-[#8B9AB5] leading-relaxed">
              <h3 className="font-bold text-white mb-2 uppercase tracking-wider text-[10px]">About this tool</h3>
              {tool.details || tool.description}
            </div>

            {!file || status === "failed" ? (
              <UploadZone
                onFileSelect={handleFileSelect}
                accept={tool.accept}
                isProcessing={status === "processing"}
              />
            ) : (
              <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#8B9AB5] uppercase tracking-wider">Selected File</span>
                  <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-[#4A5568]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="text-center py-8">
                <div className="inline-block relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 border-2 border-[#00F5FF]/30 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-[#00F5FF] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm text-white font-medium">Processing Document...</p>
                <p className="text-xs text-[#6B7A99] mt-1">This may take up to 30 seconds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Results */}
        <div className="flex-1 bg-[#0B0F19] p-6 h-full overflow-hidden">
          <ResultViewer
            data={result}
            status={status}
            error={error}
            toolName={tool.name}
          />
        </div>
      </div>
    </div>
  );
}
