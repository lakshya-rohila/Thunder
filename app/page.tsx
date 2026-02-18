"use client";

import React, { useState } from "react";
import PromptBar from "@/components/PromptBar";
import CodeTabs from "@/components/CodeTabs";
import PreviewPanel from "@/components/PreviewPanel";
import Loader from "@/components/Loader";
import ErrorToast from "@/components/ErrorToast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentData, setComponentData] = useState<{
    name: string;
    html: string;
    css: string;
    js: string;
  } | null>(null);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setError(null);

    // If we have existing component data, use it as context for refinement
    const context = componentData
      ? {
          html: componentData.html,
          css: componentData.css,
          js: componentData.js,
        }
      : undefined;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate component");
      }

      setComponentData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeUpdate = (type: "html" | "css" | "js", value: string) => {
    if (componentData) {
      setComponentData({
        ...componentData,
        [type]: value,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-teal-400">
            AI HTML Component Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate pure HTML/CSS/JS components instantly. No frameworks.
          </p>
        </header>

        <PromptBar onGenerate={handleGenerate} isLoading={loading} />

        {componentData && (
          <p className="text-center text-sm text-gray-500 mb-4 -mt-2">
            💡 Tip: Enter a new prompt to <strong>refine</strong> the current
            component.
          </p>
        )}

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {/* Left Panel: Code */}
          <div className="flex-1 lg:w-1/2 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <Loader />
              </div>
            ) : componentData ? (
              <CodeTabs
                html={componentData.html}
                css={componentData.css}
                js={componentData.js}
                onUpdate={handleCodeUpdate}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
                Enter a prompt to generate code
              </div>
            )}
          </div>

          {/* Right Panel: Preview */}
          <div className="flex-1 lg:w-1/2 flex flex-col">
            {componentData ? (
              <PreviewPanel
                html={componentData.html}
                css={componentData.css}
                js={componentData.js}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400">
                Preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      <ErrorToast message={error} onClose={() => setError(null)} />
    </main>
  );
}
