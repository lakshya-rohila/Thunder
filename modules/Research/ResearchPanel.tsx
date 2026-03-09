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
    <div className="h-full flex flex-col bg-[#050505] overflow-hidden text-[#FAFAFA]">
      {/* Header */}
      <div className="h-10 border-b-2 border-white/10 flex items-center px-6 shrink-0 bg-[#000000]">
        <h2 className="font-bold text-[10px] uppercase font-mono tracking-widest flex items-center gap-2">
          <span className="text-[#FF4500]">⚡</span>
          Deep Research Module
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {/* Search Input */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-tight text-[#FAFAFA]">
            What do you want to learn?
          </h1>
          <form
            onSubmit={handleResearch}
            className="relative max-w-2xl mx-auto flex"
          >
            <div className="relative w-full flex">
              <input
                type="text"
                value={topic}
                onChange={(e) => dispatch(setTopic(e.target.value))}
                placeholder="Enter a topic (e.g. 'Quantum Computing')..."
                className="w-full bg-[#0A0A0A] border-2 border-white/10 px-6 py-4 pr-32 font-mono text-sm focus:outline-none focus:border-[#DFFF00] transition-colors text-white"
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 transition-colors border-2 ${
                    isListening
                      ? "border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500] animate-pulse"
                      : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-white/20"
                  }`}
                  title="Voice Input"
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
                  className="bg-[#DFFF00] text-[#050505] border-2 border-[#DFFF00] px-4 py-1 font-bold font-mono text-[10px] tracking-widest uppercase transition-all hover:bg-transparent hover:text-[#DFFF00] disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0_rgba(223,255,0,0.3)] hover:shadow-none hover:translate-y-0.5"
                >
                  {isLoading ? "Wait..." : "Research"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="space-y-6">
            <div className="h-32 border-2 border-dashed border-[#DFFF00]/50 bg-[#050505] flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-[#DFFF00] uppercase animate-pulse">
                Running Deep Research...
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-40 border-2 border-dashed border-white/10" />
              <div className="h-40 border-2 border-dashed border-white/10" />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Executive Summary */}
            <section className="bg-[#050505] border-2 border-white/10 p-6">
              <h3 className="text-[#FF4500] text-[10px] font-bold font-mono uppercase tracking-widest mb-3">
                Executive Summary
              </h3>
              <p className="text-sm font-mono leading-relaxed text-[#FAFAFA]">
                {result.summary}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Insights */}
              <section className="md:col-span-2 bg-[#050505] border-2 border-white/10 p-6">
                <h3 className="text-[#DFFF00] text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
                  Key Insights
                </h3>
                <ul className="space-y-3 font-mono text-sm leading-relaxed">
                  {result.keyInsights?.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-[#A1A1AA]">
                      <span className="text-[#DFFF00] flex-shrink-0">►</span>
                      <span className="text-[#FAFAFA]">{insight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Statistics */}
              <section className="md:col-span-1 bg-[#050505] border-2 border-white/10 p-6">
                <h3 className="text-blue-400 text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
                  Key Statistics
                </h3>
                <div className="space-y-4">
                  {result.statistics?.map((stat, i) => (
                    <div
                      key={i}
                      className="border-b-2 border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="text-2xl font-black text-[#FAFAFA] mb-1">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-[#A1A1AA] font-mono uppercase tracking-widest">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Detailed Analysis */}
            <section className="bg-[#050505] border-2 border-white/10 p-6">
              <h3 className="text-pink-400 text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
                Detailed Analysis
              </h3>
              <div className="prose prose-invert max-w-none prose-p:text-[#A1A1AA] prose-p:font-mono prose-p:text-sm prose-headings:text-[#FAFAFA] prose-headings:font-black prose-headings:uppercase prose-a:text-[#DFFF00] prose-a:underline prose-li:font-mono prose-li:text-[#A1A1AA] prose-li:text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.detailedAnalysis}
                </ReactMarkdown>
              </div>
            </section>

            {/* Sources */}
            <section className="border-t-2 border-white/10 pt-6">
              <h3 className="text-[#A1A1AA] text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
                Sources & References
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.sources?.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border-2 border-white/10 bg-[#0A0A0A] hover:bg-[#FAFAFA] hover:text-[#050505] transition-colors group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-[10px] font-mono font-bold text-[#A1A1AA] group-hover:text-[#050505] border border-white/20 group-hover:border-[#050505]/20">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold font-mono uppercase tracking-wider truncate mb-1">
                        {source.title}
                      </div>
                      <div className="text-[10px] font-mono opacity-60 truncate">
                        {new URL(source.url).hostname}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
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
