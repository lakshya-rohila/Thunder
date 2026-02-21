import React from "react";

interface VoiceListeningOverlayProps {
  isListening: boolean;
  transcript?: string;
}

export default function VoiceListeningOverlay({
  isListening,
  transcript,
}: VoiceListeningOverlayProps) {
  if (!isListening) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-6 max-w-lg px-4">
        {/* Animated Waveform */}
        <div className="flex items-center gap-1.5 h-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-red-500 to-pink-500 rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: "100%",
              }}
            />
          ))}
        </div>

        <div className="text-center w-full">
          <h3 className="text-xl font-bold text-white mb-3">Listening...</h3>
          <p className="text-white/80 text-lg font-medium min-h-[1.5em] animate-pulse">
            {transcript || "Speak your command..."}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            height: 12px;
            opacity: 0.5;
          }
          50% {
            height: 48px;
            opacity: 1;
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
