"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface PostToCommunityPanelProps {
  chatId: string | null;
  isPublic: boolean;
  onPublished: (isPublic: boolean) => void;
}

export default function PostToCommunityPanel({
  chatId,
  isPublic,
  onPublished,
}: PostToCommunityPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-expand when a new component is saved
  useEffect(() => {
    if (chatId && !isPublic) {
      setExpanded(true);
      setDescription("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  if (!chatId) return null;

  const handleToggle = async (publish: boolean) => {
    setError(null);
    if (publish && description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          isPublic: publish,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess(true);
      onPublished(publish);
      setTimeout(() => setSuccess(false), 3000);
      if (!publish) setExpanded(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border-t border-white/5 transition-all duration-300"
      style={{ background: "rgba(0,245,255,0.02)" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00F5FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xs font-semibold text-[#8B9AB5]">
            Post to Community
          </span>
          {isPublic && (
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
              style={{
                background: "rgba(0,245,255,0.1)",
                color: "#00F5FF",
                border: "1px solid rgba(0,245,255,0.2)",
              }}
            >
              <span className="w-1 h-1 rounded-full bg-[#00F5FF] animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isPublic && (
            <Link
              href={`/community/${chatId}`}
              target="_blank"
              className="text-[10px] text-[#00F5FF] hover:underline"
            >
              View →
            </Link>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-[11px] text-[#4A5568] hover:text-[#8B9AB5] transition-colors"
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {!isPublic ? (
            <>
              <p className="text-[11px] text-[#4A5568] leading-relaxed">
                Share this component with the Thunder community. Add a
                description so others understand what it does.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your component... (min 10 characters)"
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 rounded-xl text-xs text-[#C8D8F0] placeholder-[#4A5568] resize-none outline-none font-sans transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(0,245,255,0.2)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.06)")
                }
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#4A5568]">
                  {description.length}/500
                </span>
                <button
                  onClick={() => handleToggle(true)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #00F5FF, #00C8FF)",
                    boxShadow: "0 0 16px rgba(0,245,255,0.2)",
                  }}
                >
                  {loading ? "Publishing..." : "Publish →"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#4A5568]">
                This component is live in the community.
              </p>
              <button
                onClick={() => handleToggle(false)}
                disabled={loading}
                className="text-[11px] text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                {loading ? "Removing..." : "Remove from community"}
              </button>
            </div>
          )}

          {error && <p className="text-[11px] text-red-400">{error}</p>}
          {success && (
            <p className="text-[11px] text-[#00F5FF]">
              {isPublic
                ? "✓ Published to community!"
                : "✓ Removed from community."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
