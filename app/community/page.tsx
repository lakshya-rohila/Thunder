"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";

interface ChatCard {
  _id: string;
  title: string;
  description: string;
  generatedHTML: string;
  generatedCSS: string;
  generatedJS: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: { name: string; username?: string };
}

function ComponentPreview({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const srcDoc = `<!DOCTYPE html><html><head><style>*{box-sizing:border-box;margin:0;padding:0}body{margin:0;padding:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="w-full h-full border-0 pointer-events-none"
      title="Component preview"
    />
  );
}

function CopyButton({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const combined = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    await navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200"
      style={{
        background: copied ? "rgba(0,245,255,0.12)" : "rgba(255,255,255,0.05)",
        color: copied ? "#00F5FF" : "#6B7A99",
        border: `1px solid ${copied ? "rgba(0,245,255,0.25)" : "rgba(255,255,255,0.06)"}`,
      }}
      title="Copy component code"
    >
      {copied ? (
        <>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            width="10"
            height="10"
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
          Copy
        </>
      )}
    </button>
  );
}

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCommunityFeed,
  setSort,
  setPage,
} from "@/store/slices/communitySlice";

export default function CommunityPage() {
  const dispatch = useAppDispatch();
  const { chats, sort, page, totalPages, loading } = useAppSelector(
    (state) => state.community,
  );

  useEffect(() => {
    dispatch(fetchCommunityFeed({ page, sort }));
  }, [dispatch, page, sort]);

  const handleSortChange = (newSort: "latest" | "likes") => {
    dispatch(setSort(newSort));
  };

  return (
    <div className="min-h-screen bg-black text-[#F0F6FF] font-sans flex flex-col relative overflow-hidden">
      <DashboardNavbar />

      {/* Violet Storm Background with Top Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Header */}
      <div
        className="border-b border-white/5 shrink-0 relative z-10"
        style={{
          background: "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
                <span className="text-xs text-[#00F5FF] font-medium tracking-wide">
                  Community
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Explore Components
              </h1>
              <p className="text-[#6B7A99] mt-2 text-sm">
                Built by the Thunder community. Copy, remix, and ship.
              </p>
            </div>
            {/* Sort toggle */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {(["latest", "likes"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSortChange(s)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize"
                  style={{
                    background:
                      sort === s ? "rgba(0,245,255,0.1)" : "transparent",
                    color: sort === s ? "#00F5FF" : "#6B7A99",
                    border:
                      sort === s
                        ? "1px solid rgba(0,245,255,0.2)"
                        : "1px solid transparent",
                  }}
                >
                  {s === "likes" ? "Most Liked" : "Latest"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 overflow-hidden animate-pulse"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="h-48 bg-white/3" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded-full w-2/3" />
                  <div className="h-2 bg-white/3 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center mb-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4A5568"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-[#4A5568] text-sm">
              No components yet. Be the first to share!
            </p>
            <Link
              href="/dashboard"
              className="mt-4 text-xs text-[#00F5FF] hover:underline"
            >
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {chats.map((chat) => (
              <Link
                key={chat._id}
                href={`/community/${chat._id}`}
                className="group block"
              >
                <div
                  className="rounded-2xl border border-white/6 overflow-hidden transition-all duration-300 group-hover:border-white/12 group-hover:shadow-xl group-hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Preview */}
                  <div className="h-48 bg-[#0D1117] relative overflow-hidden">
                    <ComponentPreview
                      html={chat.generatedHTML}
                      css={chat.generatedCSS}
                      js={chat.generatedJS}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        View →
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-white truncate leading-snug">
                        {chat.title}
                      </h3>
                      <CopyButton
                        html={chat.generatedHTML}
                        css={chat.generatedCSS}
                        js={chat.generatedJS}
                      />
                    </div>
                    {chat.description && (
                      <p className="text-[11px] text-[#4A5568] mb-3 line-clamp-2 leading-relaxed">
                        {chat.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#4A5568]">
                        by{" "}
                        {chat.author?.username ? (
                          <Link
                            href={`/profile/${chat.author.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#8B9AB5] hover:text-white transition-colors"
                          >
                            {chat.author.name}
                          </Link>
                        ) : (
                          <span className="text-[#8B9AB5]">
                            {chat.author?.name ?? "Anonymous"}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-[#4A5568]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {chat.likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#4A5568]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {chat.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B7A99] border border-white/6 hover:border-white/12 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              ← Prev
            </button>
            <span className="text-xs text-[#4A5568] px-3">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B7A99] border border-white/6 hover:border-white/12 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
