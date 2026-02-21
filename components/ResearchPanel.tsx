import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ResearchResult } from "@/lib/research";

export default function ResearchPanel() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // If we have a HF token in env (checked by server), we can try to use DeepSeek
      // Or we can let the server decide fallback.
      // Let's explicitly ask for DeepSeek to match the user's intent if possible
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, useDeepSeek: true }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0 bg-[#0D1117]">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-purple-400">⚡</span>
          Deep Research Module
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {/* Search Input */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            What do you want to learn?
          </h1>
          <form onSubmit={handleResearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. 'Quantum Computing', 'History of Rome')..."
              className="w-full bg-[#161B22] border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={isLoading || !topic}
              className="absolute right-3 top-3 bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Searching..." : "Research"}
            </button>
          </form>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-white/5 rounded-2xl"></div>
            <div className="h-20 bg-white/5 rounded-2xl"></div>
            <div className="h-60 bg-white/5 rounded-2xl"></div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Executive Summary */}
            <section className="bg-[#161B22] border border-white/5 p-6 rounded-2xl shadow-lg">
              <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                Executive Summary
              </h3>
              <p className="text-lg leading-relaxed text-gray-200">
                {result.summary}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Insights */}
              <section className="md:col-span-2 bg-[#161B22] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Key Insights
                </h3>
                <ul className="space-y-3">
                  {result.keyInsights?.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <span className="text-emerald-500/50 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Related Concepts */}
              <section className="bg-[#161B22] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.relatedConcepts?.map((concept, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Deep Dive */}
            <section className="bg-[#161B22] border border-white/5 p-8 rounded-2xl">
              <h3 className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Deep Analysis
              </h3>
              <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 mt-8 border-b border-white/10 pb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-purple-300 mb-3 mt-6" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-blue-300 mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                  }}
                >
                  {result.detailedExplanation}
                </ReactMarkdown>
              </div>
            </section>

            {/* Timeline */}
            {result.timeline?.length > 0 && (
              <section className="bg-[#161B22] border border-white/5 p-8 rounded-2xl">
                <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Timeline
                </h3>
                <div className="space-y-6 border-l-2 border-white/10 ml-3 pl-8 relative">
                  {result.timeline.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#0B0F19] border-2 border-amber-500/50" />
                      <span className="text-amber-400 font-mono text-sm font-bold block mb-1">
                        {item.year}
                      </span>
                      <p className="text-gray-300">{item.event}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sources */}
            <section className="pt-8 border-t border-white/10">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Verified Sources
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {result.sources?.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-purple-500/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-purple-300 mb-1 truncate group-hover:text-purple-200 transition-colors">
                          {source.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate mb-2 font-mono">
                          {source.url}
                        </div>
                        {source.snippet && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {source.snippet}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Provider Footer */}
            <div className="text-center pt-8 pb-4 text-white/20 text-xs">
              Research synthesized by {result.provider || "AI Research Engine"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
