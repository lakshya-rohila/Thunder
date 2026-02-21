import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
  questions?: {
    id: string;
    text: string;
    options: string[];
  }[];
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (
    message: string,
    mode: "standard" | "reverse",
    projectType?: "component" | "app" | "game" | "auto",
  ) => void;
  mode: "standard" | "reverse";
  onModeChange: (mode: "standard" | "reverse") => void;
  projectType: "component" | "app" | "game" | "auto";
  onProjectTypeChange: (type: "component" | "app" | "game" | "auto") => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  mode,
  onModeChange,
  projectType,
  onProjectTypeChange,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [clarificationAnswers, setClarificationAnswers] = useState<
    Record<string, string>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), mode, projectType);
      setInput("");
    }
  };

  const handleSelectOption = (questionId: string, answer: string) => {
    setClarificationAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitClarificationAnswers = (
    questions: { id: string; text: string }[],
  ) => {
    const formattedAnswers = questions
      .map((q) => {
        const answer = clarificationAnswers[q.id];
        return `- ${q.text} ${answer}`;
      })
      .join("\n");

    const consolidatedPrompt = `Clarification Answers Provided. GENERATE COMPONENT CODE IMMEDIATELY based on these details:\n${formattedAnswers}`;
    onSendMessage(consolidatedPrompt, mode, projectType);
    setClarificationAnswers({}); // Reset after sending
  };

  return (
    <div className="flex flex-col h-full w-[380px] bg-[#0D1117] border-r border-white/5 shrink-0 relative z-20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${mode === "reverse" ? "bg-purple-500" : "bg-[#00F5FF]"}`}
            />
            <h2 className="text-sm font-semibold text-white tracking-wide">
              {mode === "reverse" ? "Reverse Engineer" : "Prompt"}
            </h2>
          </div>
        </div>

        {/* Project Type Selector */}
        <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
          {[
            { id: "auto", label: "Auto" },
            { id: "component", label: "Component" },
            { id: "app", label: "App" },
            { id: "game", label: "Game" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onProjectTypeChange(type.id as any)}
              className={`flex-1 px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded transition-all ${
                projectType === type.id
                  ? "bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                  : "text-[#6B7A99] hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div
              className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 animate-float ${
                mode === "reverse"
                  ? "bg-gradient-to-br from-purple-500/15 to-pink-500/15 border-purple-500/15"
                  : "bg-gradient-to-br from-[#00F5FF]/15 to-[#8A2BE2]/15 border-[#00F5FF]/15"
              }`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={mode === "reverse" ? "#A855F7" : "#00F5FF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mode === "reverse" ? (
                  <>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </>
                ) : (
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-sm">
              {mode === "reverse"
                ? "Reverse Engineering Mode"
                : "Ready to build"}
            </h3>
            <p className="text-[#4A5568] text-xs leading-relaxed max-w-[200px]">
              {mode === "reverse"
                ? "Paste HTML or structure to analyze, refactor, and modernize."
                : "Describe the component you want to create or refine."}
            </p>
            {/* Suggestion chips */}
            <div className="mt-6 flex flex-col gap-2 w-full">
              {(mode === "reverse"
                ? [
                    "Analyze this navbar HTML...",
                    "Refactor this old pricing table...",
                    "Modernize this form structure...",
                  ]
                : [
                    "A dark hero section with gradient",
                    "A pricing card with hover effect",
                    "A glassmorphism login form",
                  ]
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion, mode)}
                  className={`text-left text-xs px-3 py-2 rounded-lg border border-white/5 bg-white/3 transition-all duration-200 ${
                    mode === "reverse"
                      ? "text-[#8B9AB5] hover:border-purple-500/20 hover:text-purple-400 hover:bg-purple-500/5"
                      : "text-[#8B9AB5] hover:border-[#00F5FF]/20 hover:text-[#00F5FF] hover:bg-[#00F5FF]/5"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-[#4A5568] mb-1.5 px-1 font-medium">
              {msg.role === "user" ? "You" : "Thunder AI"}
            </span>
            <div
              className={`max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? mode === "reverse"
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-medium rounded-br-sm shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    : "bg-gradient-to-br from-[#00F5FF] to-[#0080FF] text-[#0B0F19] font-medium rounded-br-sm shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                  : "glass-card text-[#C8D8F0] rounded-bl-sm border border-white/6 w-full"
              }`}
            >
              <div className="prose prose-invert prose-xs max-w-none">
                {msg.role === "ai" ? (
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  msg.content
                )}

                {msg.questions && (
                  <div className="mt-4 space-y-4 font-sans border-t border-white/10 pt-4">
                    {msg.questions.map((q, qIdx) => {
                      const selected = clarificationAnswers[q.id];
                      return (
                        <div key={qIdx} className="space-y-2">
                          <p className="text-xs uppercase tracking-wider font-bold text-[#6B7A99]">
                            {q.text}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selected === opt;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectOption(q.id, opt)}
                                  className={`px-3 py-1.5 rounded-md text-xs transition-all text-left ${
                                    isSelected
                                      ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/50 shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                                      : "bg-white/5 border border-white/10 text-[#A0AEC0] hover:bg-[#00F5FF]/10 hover:text-[#00F5FF] hover:border-[#00F5FF]/30"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        onClick={() =>
                          msg.questions &&
                          submitClarificationAnswers(msg.questions)
                        }
                        disabled={
                          !msg.questions ||
                          msg.questions.some((q) => !clarificationAnswers[q.id])
                        }
                        className="w-full py-2 rounded-lg bg-[#00F5FF] text-[#0B0F19] font-bold text-xs uppercase tracking-wider hover:bg-[#00F5FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                      >
                        Generate with Answers
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div
              className={`glass-card border text-[#8B9AB5] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3 ${
                mode === "reverse"
                  ? "border-purple-500/15"
                  : "border-[#00F5FF]/15"
              }`}
            >
              <div className="flex space-x-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full loading-dot ${mode === "reverse" ? "bg-purple-500" : "bg-[#00F5FF]"}`}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full loading-dot ${mode === "reverse" ? "bg-purple-500" : "bg-[#00F5FF]"}`}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full loading-dot ${mode === "reverse" ? "bg-purple-500" : "bg-[#00F5FF]"}`}
                />
              </div>
              <span
                className={`text-xs font-medium ${mode === "reverse" ? "text-purple-400" : "text-[#00F5FF]"}`}
              >
                {mode === "reverse"
                  ? "Analyzing Structure..."
                  : "Generating..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-[#0B0F19]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              mode === "reverse"
                ? "Paste HTML to analyze..."
                : "Describe your component..."
            }
            className={`w-full bg-[#0D1117] text-[#C8D8F0] rounded-xl p-3.5 pr-12 resize-none h-[56px] focus:h-[110px] transition-all duration-300 focus:outline-none border border-white/6 text-sm placeholder-[#4A5568] ${
              mode === "reverse"
                ? "focus:border-purple-500/40 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                : "focus:border-[#00F5FF]/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)]"
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ${
              mode === "reverse"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white"
                : "bg-gradient-to-br from-[#00F5FF] to-[#0080FF] hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] text-[#0B0F19]"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-[#4A5568] mt-2">
          Press <kbd className="font-mono bg-white/5 px-1 rounded">Enter</kbd>{" "}
          to send
        </p>
      </div>
    </div>
  );
}
