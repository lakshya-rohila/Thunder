import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CODE_MODEL } from "@/lib/code-assistant";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPrompt, setLanguage, setError } from "./CodeAssistantSlice";
import { generateCode } from "./CodeAssistantActions";

export default function CodeAssistantPanel() {
  const dispatch = useAppDispatch();
  const { prompt, generatedCode, isLoading, error, language } = useAppSelector(
    (state) => state.codeAssistant
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
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0 bg-[#0D1117]">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-cyan-400">⚡</span>
          Code Assistant
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded ml-2">
            {CODE_MODEL.name}
          </span>
        </h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Panel */}
        <div className="w-full lg:w-1/3 border-r border-white/5 p-6 flex flex-col bg-[#0B0F19]">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Describe Task</span>
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-all ${
                isListening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {isListening ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Listening...
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          
          <form onSubmit={handleGenerate} className="flex-1 flex flex-col gap-4">
            <div className="flex gap-2">
              <select
                value={language}
                onChange={(e) => dispatch(setLanguage(e.target.value))}
                className="bg-[#161B22] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
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
              placeholder="E.g., Write a function to validate email addresses using regex..."
              className="flex-1 w-full bg-[#161B22] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 resize-none font-mono"
            />
            
            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Coding...
                </>
              ) : (
                "Generate Code"
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="flex-1 bg-[#1E1E1E] overflow-hidden flex flex-col relative">
           <div className="absolute top-4 right-4 z-10">
             <button
               onClick={copyToClipboard}
               className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm border border-white/5"
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
               <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="16 18 22 12 16 6" />
                     <polyline points="8 6 2 12 8 18" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-medium text-gray-300 mb-2">Code Assistant</h3>
                 <p className="max-w-md">
                   Enter a description of the code you need, and StarCoder2 will generate a solution for you.
                 </p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
