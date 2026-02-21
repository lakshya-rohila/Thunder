import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { postToCommunity } from "./CommunityActions";
import { clearPostError } from "./CommunitySlice";

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
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { posting: loading, postError } = useAppSelector((state) => state.community);

  const error = validationError || postError;

  // Auto-expand when a new component is saved
  useEffect(() => {
    if (chatId && !isPublic) {
      setExpanded(true);
      setDescription("");
      setValidationError(null);
      dispatch(clearPostError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  if (!chatId) return null;

  const handleToggle = async (publish: boolean) => {
    setValidationError(null);
    dispatch(clearPostError());
    
    if (publish && description.trim().length < 10) {
      setValidationError("Description must be at least 10 characters.");
      return;
    }

    try {
      const resultAction = await dispatch(postToCommunity({
        chatId,
        isPublic: publish,
        description: description.trim()
      }));

      if (postToCommunity.fulfilled.match(resultAction)) {
        setSuccess(true);
        onPublished(publish);
        setTimeout(() => setSuccess(false), 3000);
        if (!publish) setExpanded(false);
      }
    } catch (e: any) {
      // Error handled by redux
      console.error("Post error:", e);
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
              LIVE
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/5 transition-all ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B9AB5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in-down">
          {!isPublic ? (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] text-[#6B7A99]">
                Share your creation with the community. It will be visible to
                everyone in the feed.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this component does (min 10 chars)..."
                className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F5FF]/30 placeholder:text-[#4A5568] resize-none h-20 transition-all"
              />
              {error && (
                <div className="text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                  {error}
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setExpanded(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#8B9AB5] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleToggle(true)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-md bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] text-xs font-bold uppercase tracking-wider hover:bg-[#00F5FF]/20 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(0,245,255,0.1)]"
                >
                  {loading ? (
                    <div className="w-3 h-3 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/10 rounded-lg p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00F5FF]/10 flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00F5FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    Published Successfully!
                  </h4>
                  <p className="text-[10px] text-[#8B9AB5] leading-relaxed">
                    This component is now live on the community feed. Other users
                    can view, like, and comment on it.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleToggle(false)} // Unpublish
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors underline decoration-red-400/30 underline-offset-2"
                >
                  Unpublish / Make Private
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
