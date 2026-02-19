"use client";

import React, { useState } from "react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  isPublic: boolean;
  onPublished: (isPublic: boolean) => void;
}

export default function PublishModal({
  isOpen,
  onClose,
  chatId,
  isPublic,
  onPublished,
}: PublishModalProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          isPublic: true,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");

      onPublished(true);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          isPublic: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove");

      onPublished(false);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              width="20"
              height="20"
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
            {isPublic ? "Manage Publication" : "Publish to Community"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-[#4A5568] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!isPublic ? (
            <>
              <p className="text-sm text-[#8B9AB5] leading-relaxed">
                Share your creation with the community. Add a compelling
                description so others can understand what makes this component
                special.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#4A5568] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your component... (how to use it, features, etc.)"
                  rows={4}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00F5FF]/50 transition-all resize-none"
                />
                <div className="flex justify-between items-center px-1">
                  <span
                    className={`text-[10px] ${description.length < 10 ? "text-red-400" : "text-[#4A5568]"}`}
                  >
                    {description.length < 10
                      ? `Min 10 chars required (${description.length}/10)`
                      : `${description.length} characters`}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/10 rounded-xl p-4 text-center">
              <p className="text-sm text-[#00F5FF] mb-2 font-medium">
                ✓ This component is currently live!
              </p>
              <p className="text-xs text-[#8B9AB5]">
                You can remove it from the community feed if you wish to make it
                private again.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#8B9AB5] hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>

          {!isPublic ? (
            <button
              onClick={handlePublish}
              disabled={loading || description.trim().length < 10}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
              style={{
                background: "linear-gradient(135deg, #00F5FF, #00C8FF)",
                boxShadow: "0 4px 20px rgba(0, 245, 255, 0.25)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Publishing...
                </>
              ) : (
                "Publish Component"
              )}
            </button>
          ) : (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 hover:text-red-300 transition-all disabled:opacity-50"
            >
              {loading ? "Removing..." : "Remove from Community"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
