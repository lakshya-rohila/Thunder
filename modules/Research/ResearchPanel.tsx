import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTopic } from "./ResearchSlice";
import { performResearch } from "./ResearchActions";
import { fetchUser } from "@/modules/Auth/AuthActions";

export default function ResearchPanel() {
  const dispatch = useAppDispatch();
  const { topic, result, isLoading } = useAppSelector(
    (state) => state.research,
  );

  const { isListening, toggleListening } = useVoiceInput({
    onTranscript: (transcript) => {
      dispatch(setTopic(topic + (topic ? " " : "") + transcript));
    },
  });

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    await dispatch(performResearch({ topic, useDeepSeek: true }));
    dispatch(fetchUser());
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
          <form
            onSubmit={handleResearch}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={topic}
                onChange={(e) => dispatch(setTopic(e.target.value))}
                placeholder="Enter a topic (e.g. 'Quantum Computing', 'History of Rome')..."
                className="w-full bg-[#161B22] border border-white/10 rounded-xl px-6 py-4 pr-32 text-lg focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-xl"
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                  title="Voice Input"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isListening ? (
                      <>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </>
                    )}
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !topic}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Searching..." : "Research"}
                </button>
              </div>
            </div>
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
                      <span className="text-emerald-500 flex-shrink-0">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Statistics */}
              <section className="md:col-span-1 bg-[#161B22] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Key Statistics
                </h3>
                <div className="space-y-4">
                  {result.statistics?.map((stat, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Detailed Analysis */}
            <section className="bg-[#161B22] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-4">
                Detailed Analysis
              </h3>
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-pink-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.detailedAnalysis}
                </ReactMarkdown>
              </div>
            </section>

            {/* Sources */}
            <section className="border-t border-white/10 pt-6">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">
                Sources & References
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.sources?.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate group-hover:text-purple-400 transition-colors">
                        {source.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {new URL(source.url).hostname}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
