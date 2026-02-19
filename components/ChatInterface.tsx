import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
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
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full w-[380px] bg-[#0D1117] border-r border-white/5 shrink-0 relative z-20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Prompt
          </h2>
        </div>
        <span className="text-[10px] bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-0.5 rounded-full border border-[#00F5FF]/20 font-semibold uppercase tracking-wider">
          AI
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5FF]/15 to-[#8A2BE2]/15 border border-[#00F5FF]/15 flex items-center justify-center mb-4 animate-float">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00F5FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2 text-sm">
              Ready to build
            </h3>
            <p className="text-[#4A5568] text-xs leading-relaxed max-w-[180px]">
              Describe the component you want to create or refine.
            </p>
            {/* Suggestion chips */}
            <div className="mt-6 flex flex-col gap-2 w-full">
              {[
                "A dark hero section with gradient",
                "A pricing card with hover effect",
                "A glassmorphism login form",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-left text-xs text-[#8B9AB5] px-3 py-2 rounded-lg border border-white/5 bg-white/3 hover:border-[#00F5FF]/20 hover:text-[#00F5FF] hover:bg-[#00F5FF]/5 transition-all duration-200"
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
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-[#00F5FF] to-[#0080FF] text-[#0B0F19] font-medium rounded-br-sm shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                  : "glass-card text-[#C8D8F0] rounded-bl-sm border border-white/6"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="glass-card border border-[#00F5FF]/15 text-[#8B9AB5] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full loading-dot" />
                <div className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full loading-dot" />
                <div className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full loading-dot" />
              </div>
              <span className="text-xs font-medium text-[#00F5FF]">
                Generating...
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
            placeholder="Describe your component..."
            className="w-full bg-[#0D1117] text-[#C8D8F0] rounded-xl p-3.5 pr-12 resize-none h-[56px] focus:h-[110px] transition-all duration-300 focus:outline-none border border-white/6 focus:border-[#00F5FF]/40 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] text-sm placeholder-[#4A5568]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5FF] to-[#0080FF] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0B0F19"
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
