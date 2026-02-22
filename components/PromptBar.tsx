import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptBar({ onGenerate, isLoading }: PromptBarProps) {
  const t = useTranslations("PromptBar");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t("generating") : t("generate")}
        </button>
      </div>
    </form>
  );
}
