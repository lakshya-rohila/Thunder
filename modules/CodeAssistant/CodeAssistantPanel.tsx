import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CODE_MODEL } from "@/lib/code-assistant";
import { fetchUser } from "@/modules/Auth/AuthActions";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPrompt, setLanguage, setError } from "./CodeAssistantSlice";
import { generateCode } from "./CodeAssistantActions";

export default function CodeAssistantPanel() {
  const dispatch = useAppDispatch();
  const { prompt, generatedCode, isLoading, error, language } = useAppSelector(
    (state) => state.codeAssistant,
  );

  const { isListening, toggleListening } = useVoiceInput({
    onTranscript: (transcript) => {
      dispatch(setPrompt(prompt + (prompt ? " " : "") + transcript));
    },
    onError: (err) => dispatch(setError(err)),
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    await dispatch(generateCode({ prompt, language }));
    dispatch(fetchUser());
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] overflow-hidden text-[#FAFAFA]">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center px-6 shrink-0 bg-[#050505]">
        <h2 className="font-black text-sm flex items-center gap-3 tracking-widest font-mono uppercase">
          <span className="text-[#DFFF00]">⚡</span>
          Code Assistant
          <span className="text-[10px] text-[#050505] bg-[#DFFF00] font-bold px-2 py-0.5 ml-2 shadow-[2px_2px_0_rgba(255,255,255,0.2)]">
            {CODE_MODEL.name}
          </span>
        </h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Panel */}
        <div className="w-full lg:w-1/3 border-r border-white/10 p-6 flex flex-col bg-[#050505]">
          <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest font-mono mb-6 flex items-center justify-between">
            <span>Describe Task</span>
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 text-[10px] px-3 py-1 font-bold uppercase tracking-wider transition-colors border-2 ${
                isListening
                  ? "bg-[#FF4500] text-white border-[#FF4500] shadow-[2px_2px_0_rgba(255,69,0,0.5)]"
                  : "bg-transparent text-[#A1A1AA] border-white/20 hover:text-white hover:border-white/40"
              }`}
            >
              {isListening ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Listening...
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
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
                  Voice Input
                </>
              )}
            </button>
          </h3>

          <form
            onSubmit={handleGenerate}
            className="flex-1 flex flex-col gap-5"
          >
            <div className="flex gap-2">
              <select
                value={language}
                onChange={(e) => dispatch(setLanguage(e.target.value))}
                className="bg-[#050505] border-2 border-white/20 px-3 py-2 text-sm text-[#FAFAFA] font-mono uppercase tracking-wider focus:outline-none focus:border-[#DFFF00] transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => dispatch(setPrompt(e.target.value))}
              placeholder="E.g., WRITE A FUNCTION TO VALIDATE EMAIL ADDRESSES USING REGEX"
              className="flex-1 w-full bg-[#0A0A0A] border-2 border-white/10 p-5 text-sm focus:outline-none focus:border-[#DFFF00] resize-none font-mono text-[#FAFAFA] transition-colors"
            />

            {error && (
              <div className="text-[#FF4500] text-[10px] font-bold font-mono tracking-widest uppercase bg-[#FF4500]/10 p-4 border-2 border-[#FF4500]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt}
              className="w-full bg-[#DFFF00] text-[#050505] font-black py-4 uppercase tracking-widest transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent shadow-[6px_6px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <span className="w-2 h-2 bg-[#050505] animate-ping" />
                  CODING...
                </>
              ) : (
                "GENERATE CODE"
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="flex-1 bg-[#0A0A0A] overflow-hidden flex flex-col relative border-l border-white/10">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={copyToClipboard}
              className="bg-[#050505] hover:bg-[#DFFF00] hover:text-[#050505] text-[#FAFAFA] px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors border-2 border-white/20 hover:border-[#DFFF00] shadow-[4px_4px_0_rgba(255,255,255,0.1)]"
            >
              Copy Code
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {generatedCode ? (
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  backgroundColor: "transparent",
                  minHeight: "100%",
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {generatedCode}
              </SyntaxHighlighter>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA] p-8 text-center shrink-0">
                <div className="w-20 h-20 border-2 border-white/10 flex items-center justify-center mb-6 shadow-[8px_8px_0_rgba(255,255,255,0.05)]">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
                  Code Assistant
                </h3>
                <p className="max-w-md font-mono text-sm leading-relaxed">
                  ENTER A DESCRIPTION OF THE CODE YOU NEED, AND STARCODER2 WILL
                  GENERATE A SOLUTION FOR YOU.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
