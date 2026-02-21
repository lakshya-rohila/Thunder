import React from "react";
import { IMAGE_MODELS } from "@/lib/image-gen";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setPrompt,
  setSelectedModel,
  setError,
} from "./ImageGenerationSlice";
import { generateImage } from "./ImageGenerationActions";

export default function ImageGenerationPanel() {
  const dispatch = useAppDispatch();
  const { prompt, selectedModel, isGenerating, generatedImage, error } = useAppSelector(
    (state) => state.imageGeneration
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

    dispatch(generateImage({ prompt, modelId: selectedModel }));
  };

  const handleDownload = () => {
    if (generatedImage) {
      const a = document.createElement("a");
      a.href = generatedImage;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] overflow-hidden text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 shrink-0 bg-[#0D1117]">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-pink-400">🎨</span>
          AI Image Studio
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Select Model
              </label>
              <div className="space-y-2">
                {IMAGE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => dispatch(setSelectedModel(model.id))}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedModel === model.id
                        ? "bg-pink-500/10 border-pink-500/50 text-pink-300"
                        : "bg-[#161B22] border-white/5 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="text-sm font-semibold">{model.name}</div>
                    <div className="text-[10px] opacity-70 mt-1">
                      {model.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <span>Prompt</span>
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
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => dispatch(setPrompt(e.target.value))}
                  placeholder="Describe your image (e.g., 'cyberpunk city at night, neon lights')..."
                  className="w-full h-32 bg-[#161B22] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-pink-500/50 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !prompt}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Image"
                )}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-[#161B22] rounded-2xl border border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[400px]">
            {generatedImage ? (
              <div className="relative group w-full h-full flex items-center justify-center">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-w-full max-h-[600px] rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <button
                    onClick={handleDownload}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Download HD
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                </div>
                <p className="text-gray-400 animate-pulse">
                  Creating your masterpiece...
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500 max-w-sm">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Ready to Create
                </h3>
                <p>
                  Select a model and enter a prompt to generate stunning AI art in
                  seconds.
                </p>
              </div>
            )}

            {error && (
              <div className="absolute bottom-6 left-6 right-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
