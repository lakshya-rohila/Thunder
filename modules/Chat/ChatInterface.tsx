import React, { useState, useRef, useEffect } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTranslations } from "next-intl";
import { ChatState } from "@/modules/Chat/ChatSlice";

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
    styleMode?: "vanilla" | "tailwind",
  ) => void;
  mode: "standard" | "reverse" | "research";
  onModeChange: (mode: "standard" | "reverse") => void;
  projectType: "component" | "app" | "game" | "auto";
  onProjectTypeChange: (type: "component" | "app" | "game" | "auto") => void;
  styleMode: "vanilla" | "tailwind";
  onStyleModeChange: (mode: "vanilla" | "tailwind") => void;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  mode,
  onModeChange,
  projectType,
  onProjectTypeChange,
  styleMode,
  onStyleModeChange,
  isListening,
  onListeningChange,
  onTranscriptChange,
}: ChatInterfaceProps) {
  const t = useTranslations("ChatInterface");
  const [input, setInput] = useState("");
  const [clarificationAnswers, setClarificationAnswers] = useState<
    Record<string, string>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening: localIsListening, toggleListening } = useVoiceInput({
    onTranscript: (transcript) => {
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    },
    onInterim: (interim) => {
      // Pass interim results up for the overlay (but don't commit to input yet)
      if (onTranscriptChange) {
        onTranscriptChange(interim);
      }
    },
    onError: (err) => {
      console.error("Voice Error:", err);
      // Optional: Show toast error
    },
  });

  // Sync local listening state with parent
  useEffect(() => {
    if (onListeningChange) {
      onListeningChange(localIsListening);
    }
  }, [localIsListening, onListeningChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      // In research mode, we might just use standard mode for sending, or adapt the API
      // The parent component handles the logic based on mode
      onSendMessage(
        input.trim(),
        mode === "research" ? "standard" : mode,
        projectType,
        styleMode,
      );
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
    onSendMessage(
      consolidatedPrompt,
      mode === "research" ? "standard" : mode,
      projectType,
      styleMode,
    );
    setClarificationAnswers({}); // Reset after sending
  };

  return (
    <div className="flex flex-col h-full w-[380px] bg-[#050505] border-r-2 border-white/10 shrink-0 relative z-20">
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-white/10 flex flex-col gap-3 bg-[#0A0A0A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 border border-[#050505] animate-pulse ${mode === "reverse" ? "bg-[#FF4500] shadow-[2px_2px_0_rgba(255,69,0,0.5)]" : mode === "research" ? "bg-amber-500" : "bg-[#DFFF00] shadow-[2px_2px_0_rgba(223,255,0,0.5)]"}`}
            />
            <h2 className="text-[10px] font-black text-[#FAFAFA] uppercase tracking-widest font-mono">
              {mode === "reverse"
                ? t("titleReverse")
                : mode === "research"
                  ? t("titleResearch")
                  : t("titlePrompt")}
            </h2>
          </div>
        </div>

        {/* Project Type Selector - Hide in Research Mode */}
        {mode !== "research" && (
          <div className="flex flex-col gap-2">
            {/* Type */}
            <div className="flex gap-1 bg-[#050505] p-1 border-2 border-white/10">
              {[
                { id: "auto", label: t("typeAuto") },
                { id: "component", label: t("typeComponent") },
                { id: "app", label: t("typeApp") },
                { id: "game", label: t("typeGame") },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => onProjectTypeChange(type.id as any)}
                  className={`flex-1 px-2 py-1.5 text-[9px] uppercase font-black font-mono tracking-widest transition-colors border-2 ${
                    projectType === type.id
                      ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
                      : "text-[#A1A1AA] border-transparent hover:text-[#FAFAFA] hover:border-white/20"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Style Mode */}
            <div className="flex gap-1 bg-[#050505] p-1 border-2 border-white/10">
              {[
                { id: "vanilla", label: t("styleVanilla") },
                { id: "tailwind", label: t("styleTailwind") },
              ].map((sMode) => (
                <button
                  key={sMode.id}
                  onClick={() => onStyleModeChange(sMode.id as any)}
                  className={`flex-1 px-2 py-1.5 text-[9px] uppercase font-black font-mono tracking-widest transition-colors border-2 ${
                    styleMode === sMode.id
                      ? "bg-[#FF4500] text-[#050505] border-[#FF4500]"
                      : "text-[#A1A1AA] border-transparent hover:text-[#FAFAFA] hover:border-white/20"
                  }`}
                >
                  {sMode.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#050505]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 mt-8">
            <div
              className={`w-16 h-16 border-2 flex items-center justify-center mb-6 shadow-[4px_4px_0_rgba(255,255,255,0.1)] ${
                mode === "reverse"
                  ? "bg-[#FF4500]/10 border-[#FF4500]"
                  : "bg-[#DFFF00]/10 border-[#DFFF00]"
              }`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={mode === "reverse" ? "#FF4500" : "#DFFF00"}
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
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
            <h3 className="text-[#FAFAFA] font-black font-mono tracking-widest uppercase mb-3 text-sm">
              {mode === "reverse" ? t("stateReverse") : t("stateReady")}
            </h3>
            <p className="text-[#A1A1AA] text-[10px] font-mono uppercase tracking-widest leading-relaxed max-w-[240px]">
              {mode === "reverse" ? t("descReverse") : t("descReady")}
            </p>
            {/* Suggestion chips */}
            <div className="mt-8 flex flex-col gap-2 w-full">
              {(mode === "reverse"
                ? [t("sugRev1"), t("sugRev2"), t("sugRev3")]
                : [t("sugReady1"), t("sugReady2"), t("sugReady3")]
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() =>
                    onSendMessage(
                      suggestion,
                      mode === "research" ? "standard" : mode,
                    )
                  }
                  className={`text-left text-[10px] font-mono uppercase tracking-widest px-4 py-3 border-2 transition-transform duration-200 ${
                    mode === "reverse"
                      ? "text-[#A1A1AA] border-white/10 bg-[#050505] hover:border-[#FF4500] hover:text-[#FAFAFA] hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(255,69,0,0.3)]"
                      : "text-[#A1A1AA] border-white/10 bg-[#050505] hover:border-[#DFFF00] hover:text-[#FAFAFA] hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(223,255,0,0.3)]"
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
            <span className="text-[9px] text-[#A1A1AA] mb-1.5 px-1 font-mono font-bold tracking-widest uppercase">
              {msg.role === "user" ? t("roleUser") : t("roleAI")}
            </span>
            <div
              className={`max-w-[95%] px-4 py-3 text-sm leading-relaxed border-2 ${
                msg.role === "user"
                  ? mode === "reverse"
                    ? "bg-[#FF4500] text-[#050505] border-[#FF4500] font-mono shadow-[4px_4px_0_rgba(255,69,0,0.3)]"
                    : "bg-[#DFFF00] text-[#050505] border-[#DFFF00] font-mono shadow-[4px_4px_0_rgba(223,255,0,0.3)]"
                  : "bg-[#0A0A0A] text-[#FAFAFA] border-white/10 shadow-[4px_4px_0_rgba(255,255,255,0.05)] w-full relative"
              }`}
            >
              {msg.role === "ai" && (
                <div className="absolute -left-[5px] top-4 w-2 h-2 bg-[#DFFF00] border border-[#050505]" />
              )}
              <div
                className={`prose prose-invert prose-sm max-w-none ${msg.role === "user" ? "text-[#050505] font-black" : "text-[#FAFAFA]"}`}
              >
                {msg.role === "ai" ? (
                  <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  msg.content
                )}

                {msg.questions && (
                  <div className="mt-6 space-y-5 font-mono border-t-2 border-white/10 pt-5">
                    {msg.questions.map((q, qIdx) => {
                      const selected = clarificationAnswers[q.id];
                      return (
                        <div key={qIdx} className="space-y-3">
                          <p className="text-[10px] uppercase tracking-widest font-black text-[#DFFF00]">
                            ► {q.text}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selected === opt;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectOption(q.id, opt)}
                                  className={`px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all border-2 text-left ${
                                    isSelected
                                      ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00] shadow-[2px_2px_0_rgba(223,255,0,0.5)]"
                                      : "bg-[#050505] border-white/20 text-[#A1A1AA] hover:bg-white/5 hover:text-[#FAFAFA] hover:border-white/40"
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
                    <div className="pt-4">
                      <button
                        onClick={() =>
                          msg.questions &&
                          submitClarificationAnswers(msg.questions)
                        }
                        disabled={
                          !msg.questions ||
                          msg.questions.some((q) => !clarificationAnswers[q.id])
                        }
                        className="w-full py-3 bg-[#FAFAFA] text-[#050505] font-black font-mono text-[10px] uppercase tracking-widest border-2 border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#DFFF00] shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                      >
                        {t("btnGenerateAnswers")}
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
              className={`bg-[#0A0A0A] border-2 text-[#FAFAFA] font-mono px-4 py-3 flex items-center gap-3 shadow-[4px_4px_0_rgba(255,255,255,0.05)] relative ${
                mode === "reverse" ? "border-[#FF4500]" : "border-[#DFFF00]"
              }`}
            >
              <div
                className={`absolute -left-[5px] top-4 w-2 h-2 border border-[#050505] ${mode === "reverse" ? "bg-[#FF4500]" : "bg-[#DFFF00]"}`}
              />
              <div className="flex space-x-1.5">
                <div
                  className={`w-2 h-2 loading-dot border border-[#050505] ${mode === "reverse" ? "bg-[#FF4500]" : "bg-[#DFFF00]"}`}
                />
                <div
                  className={`w-2 h-2 loading-dot delay-75 border border-[#050505] ${mode === "reverse" ? "bg-[#FF4500]" : "bg-[#DFFF00]"}`}
                />
                <div
                  className={`w-2 h-2 loading-dot delay-150 border border-[#050505] ${mode === "reverse" ? "bg-[#FF4500]" : "bg-[#DFFF00]"}`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${mode === "reverse" ? "text-[#FF4500]" : "text-[#DFFF00]"}`}
              >
                {mode === "reverse"
                  ? t("statusAnalyzing")
                  : t("statusGenerating")}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-white/10 bg-[#0A0A0A]">
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
              isListening
                ? t("phListening")
                : mode === "reverse"
                  ? t("phReverse")
                  : t("phReady")
            }
            className={`w-full bg-[#050505] border-2 px-4 py-3 pr-24 text-sm font-mono text-[#FAFAFA] focus:outline-none transition-all resize-none h-[52px] scrollbar-hide placeholder:text-[#A1A1AA] ${
              mode === "reverse"
                ? "border-[#FF4500]/50 focus:border-[#FF4500]"
                : isListening
                  ? "border-red-500 bg-red-500/5 animate-pulse"
                  : "border-white/20 focus:border-[#DFFF00]"
            }`}
          />

          <div className="absolute right-2 top-2 flex items-center gap-2">
            {/* Voice Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-1.5 transition-colors border-2 ${
                isListening
                  ? "border-red-500 text-red-500 bg-red-500/10 animate-pulse"
                  : "border-transparent text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-white/20"
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? (
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
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
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
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-1.5 transition-all outline-none border-2 border-transparent ${
                input.trim() && !isLoading
                  ? mode === "reverse"
                    ? "bg-[#FF4500] text-[#050505] shadow-[2px_2px_0_rgba(255,69,0,0.5)] hover:shadow-none hover:translate-y-px hover:translate-x-px"
                    : "bg-[#DFFF00] text-[#050505] shadow-[2px_2px_0_rgba(223,255,0,0.5)] hover:shadow-none hover:translate-y-px hover:translate-x-px"
                  : "bg-white/5 text-[#A1A1AA] cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-[#DFFF00] rounded-none animate-spin" />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[#A1A1AA]">
            {t("hintPress")}
            <span className="text-[#FAFAFA] font-black mx-1">
              {t("hintEnter")}
            </span>
            {t("hintToSend")}
            <span className="text-[#FAFAFA] font-black mx-1">
              {t("hintShiftEnter")}
            </span>
            {t("hintNewline")}
          </p>
        </div>
      </div>
    </div>
  );
}
