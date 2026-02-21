import React, { useState } from "react";

interface FeedbackWidgetProps {
  generationId: string;
  onFeedbackSent?: () => void;
}

export default function FeedbackWidget({
  generationId,
  onFeedbackSent,
}: FeedbackWidgetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (value: number, useful: boolean) => {
    setRating(value);
    setSubmitted(true);

    try {
      await fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId,
          eventType: "rate",
          rating: value,
          useful,
        }),
      });
      if (onFeedbackSent) onFeedbackSent();
    } catch (e) {
      console.error("Failed to send feedback", e);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-fade-in-up">
        <span>Thanks for helping Thunder improve!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-[#0D1117] border border-white/5 px-3 py-1.5 rounded-full shadow-lg">
      <span className="text-[10px] text-[#6B7A99] uppercase font-bold tracking-wider">
        Result useful?
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => handleRate(5, true)}
          className="hover:bg-emerald-500/20 hover:text-emerald-400 p-1 rounded transition-colors text-[#4A5568]"
          title="Yes, good result"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </button>
        <button
          onClick={() => handleRate(1, false)}
          className="hover:bg-red-500/20 hover:text-red-400 p-1 rounded transition-colors text-[#4A5568]"
          title="No, bad result"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
