"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChatDetail {
  _id: string;
  title: string;
  description: string;
  generatedHTML: string;
  generatedCSS: string;
  generatedJS: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface Author {
  name: string;
  username?: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
  author: { name: string; username?: string };
}

type CodeTab = "html" | "css" | "js";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        background: copied ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.05)",
        color: copied ? "#00F5FF" : "#6B7A99",
        border: `1px solid ${copied ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {copied ? (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
      {copied ? "Copied!" : label}
    </button>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeTab>("html");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/${id}`);
      if (!res.ok) throw new Error("Component not found");
      const data = await res.json();
      setChat(data.chat);
      setAuthor(data.author);
      setHasLiked(data.hasLiked);
      setLikesCount(data.chat.likesCount);
      setComments(data.comments ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id }),
      });
      if (res.status === 401) {
        setError("Sign in to like components");
        return;
      }
      const data = await res.json();
      setHasLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch {
      setError("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch("/api/community/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id, content: commentText.trim() }),
      });
      if (res.status === 401) {
        setError("Sign in to comment");
        return;
      }
      if (!res.ok) {
        const d = await res.json();
        setError(d.error);
        return;
      }
      const data = await res.json();
      setComments((prev) => [
        { ...data.comment, isOwner: true, author: { name: "You" } },
        ...prev,
      ]);
      setCommentText("");
    } catch {
      setError("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/community/comment/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      setError("Failed to delete comment");
    }
  };

  const codeContent = chat
    ? { html: chat.generatedHTML, css: chat.generatedCSS, js: chat.generatedJS }
    : { html: "", css: "", js: "" };

  const srcDoc = chat
    ? `<!DOCTYPE html><html><head><style>*{box-sizing:border-box;margin:0;padding:0}body{margin:0;padding:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}${chat.generatedCSS}</style></head><body>${chat.generatedHTML}<script>${chat.generatedJS}<\/script></body></html>`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#00F5FF] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && !chat) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <Link
          href="/community"
          className="text-xs text-[#00F5FF] hover:underline"
        >
          ← Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#F0F6FF] font-sans">
      {/* Nav bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/5 flex items-center px-6 gap-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
      >
        <Link
          href="/community"
          className="flex items-center gap-1.5 text-xs text-[#6B7A99] hover:text-white transition-colors"
        >
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          Community
        </Link>
        <span className="text-white/10">|</span>
        <span className="text-xs text-[#6B7A99] truncate max-w-xs">
          {chat?.title}
        </span>
      </div>

      <div className="pt-14 flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Left: Preview */}
        <div className="lg:flex-1 h-64 lg:h-full bg-[#0D1117] relative">
          {srcDoc && (
            <iframe
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title={chat?.title}
            />
          )}
        </div>

        {/* Right: Info panel */}
        <div
          className="w-full lg:w-[420px] flex flex-col border-l border-white/5 overflow-y-auto"
          style={{ background: "rgba(5,7,15,0.98)" }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <h1 className="text-lg font-bold text-white mb-1">{chat?.title}</h1>
            {chat?.description && (
              <p className="text-sm text-[#6B7A99] leading-relaxed">
                {chat.description}
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-2 mt-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F5FF]/30 to-[#8A2BE2]/30 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                {author?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div>
                {author?.username ? (
                  <Link
                    href={`/profile/${author.username}`}
                    className="text-xs font-medium text-[#8B9AB5] hover:text-white transition-colors"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-[#8B9AB5]">
                    {author?.name ?? "Anonymous"}
                  </span>
                )}
                <p className="text-[10px] text-[#4A5568]">
                  {chat?.createdAt ? timeAgo(chat.createdAt) : ""}
                </p>
              </div>
            </div>

            {/* Like + Copy */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: hasLiked
                    ? "rgba(255,80,100,0.12)"
                    : "rgba(255,255,255,0.05)",
                  color: hasLiked ? "#FF5064" : "#6B7A99",
                  border: `1px solid ${hasLiked ? "rgba(255,80,100,0.25)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={hasLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </button>
              <CopyButton
                text={`<!-- HTML -->\n${chat?.generatedHTML}\n\n/* CSS */\n${chat?.generatedCSS}\n\n// JS\n${chat?.generatedJS}`}
                label="Copy All"
              />
            </div>
          </div>

          {/* Code Tabs */}
          <div className="border-b border-white/5">
            <div className="flex px-4 pt-3 gap-1">
              {(["html", "css", "js"] as CodeTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1.5 rounded-t-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                  style={{
                    background:
                      activeTab === tab
                        ? "rgba(0,245,255,0.08)"
                        : "transparent",
                    color: activeTab === tab ? "#00F5FF" : "#4A5568",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #00F5FF"
                        : "2px solid transparent",
                  }}
                >
                  {tab}
                </button>
              ))}
              <div className="ml-auto pb-1.5">
                <CopyButton
                  text={codeContent[activeTab]}
                  label={`Copy ${activeTab.toUpperCase()}`}
                />
              </div>
            </div>
            <pre
              className="p-4 text-[11px] leading-relaxed overflow-x-auto max-h-48 text-[#8B9AB5] font-mono"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              {codeContent[activeTab] || `/* No ${activeTab} code */`}
            </pre>
          </div>

          {/* Comments */}
          <div className="flex-1 flex flex-col p-4 gap-4">
            <h3 className="text-xs font-semibold text-[#6B7A99] uppercase tracking-wider">
              Comments ({chat?.commentsCount ?? 0})
            </h3>

            {/* Comment input */}
            <form onSubmit={handleComment} className="flex flex-col gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-xs text-[#C8D8F0] placeholder-[#4A5568] resize-none outline-none transition-all duration-200 font-sans"
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
                  {commentText.length}/500
                </span>
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #00F5FF, #00C8FF)",
                  }}
                >
                  {submittingComment ? "Posting..." : "Post"}
                </button>
              </div>
            </form>

            {/* Comment list */}
            <div className="flex flex-col gap-3">
              {comments.length === 0 ? (
                <p className="text-xs text-[#4A5568] text-center py-4">
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2.5 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#8A2BE2]/20 flex items-center justify-center text-[10px] font-bold text-white border border-white/8 shrink-0 mt-0.5">
                      {comment.author?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-medium text-[#8B9AB5]">
                          {comment.author?.name ?? "Anonymous"}
                        </span>
                        <span className="text-[10px] text-[#4A5568]">
                          {timeAgo(comment.createdAt)}
                        </span>
                        {comment.isOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="ml-auto opacity-0 group-hover:opacity-100 text-[10px] text-[#4A5568] hover:text-red-400 transition-all duration-150"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[#C8D8F0] leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Error toast */}
          {error && (
            <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
              {error}
              <button
                onClick={() => setError(null)}
                className="text-red-400/60 hover:text-red-400 ml-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
