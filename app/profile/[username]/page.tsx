"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import DashboardNavbar from "@/components/DashboardNavbar";

interface UserProfile {
  name: string;
  username: string;
  createdAt: string;
}

interface Stats {
  totalComponents: number;
  totalLikes: number;
}

interface ComponentCard {
  _id: string;
  title: string;
  description: string;
  generatedHTML: string;
  generatedCSS: string;
  generatedJS: string;
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  createdAt: string;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isOwner =
    currentUser?.username?.toLowerCase() === username?.toLowerCase();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalComponents: 0,
    totalLikes: 0,
  });
  const [components, setComponents] = useState<ComponentCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${username}?page=${page}&limit=12`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
      setComponents(data.components ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [username, page]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this component?")) return;

    setDeletingId(chatId);
    try {
      const res = await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete component");

      // Optimistic Update
      setComponents((prev) => prev.filter((c) => c._id !== chatId));
      setStats((prev) => ({
        ...prev,
        totalComponents: Math.max(0, prev.totalComponents - 1),
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error ?? "User not found"}</p>
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
    <div className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar />

      {/* Profile Header */}
      <div
        className="border-b border-white/5 shrink-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,180,255,0.12), transparent 70%), #0B0F19",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(138,43,226,0.2))",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 40px rgba(0,245,255,0.1)",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                {isOwner && (
                  <Link
                    href="/settings"
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-[#8B9AB5] hover:text-white hover:bg-white/10 transition-all"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
              <p className="text-sm text-[#4A5568] mt-0.5">@{user.username}</p>
              <p className="text-xs text-[#4A5568] mt-1">
                Joined {formatDate(user.createdAt)}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-5 flex-wrap">
                {[
                  { label: "Components", value: stats.totalComponents },
                  { label: "Total Likes", value: stats.totalLikes },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-xl font-bold text-white">
                      {value.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#4A5568]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-semibold text-[#6B7A99] uppercase tracking-widest flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            {isOwner ? "My Components" : "Public Components"}
          </h2>
          {isOwner && (
            <Link href="/dashboard">
              <button className="text-xs font-bold text-[#00F5FF] hover:underline">
                + Create New
              </button>
            </Link>
          )}
        </div>

        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-[#4A5568] text-sm mb-4">
              {isOwner
                ? "You haven't created any components yet."
                : "No public components yet."}
            </p>
            {isOwner && (
              <Link href="/dashboard">
                <button className="px-6 py-2 rounded-xl bg-[#00F5FF] text-black font-bold text-xs hover:scale-105 transition-all">
                  Generate Your First UI
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((comp) => (
              <div key={comp._id} className="group relative">
                <Link href={`/community/${comp._id}`} className="block">
                  <div
                    className="rounded-2xl border border-white/6 overflow-hidden transition-all duration-300 group-hover:border-[#00F5FF]/30 group-hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {/* Preview */}
                    <div className="h-48 bg-[#0D1117] relative overflow-hidden group/prev">
                      <ComponentPreview
                        html={comp.generatedHTML}
                        css={comp.generatedCSS}
                        js={comp.generatedJS}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none" />

                      {/* Labels */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {!comp.isPublic && isOwner && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                            Private
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate mb-1 pr-6 hover:text-[#00F5FF] transition-colors">
                            {comp.title}
                          </h3>
                          {comp.description && (
                            <p className="text-[11px] text-[#4A5568] line-clamp-1">
                              {comp.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[11px] text-[#4A5568]">
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
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {comp.likesCount}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] text-[#4A5568]">
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
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            {comp.commentsCount}
                          </span>
                        </div>
                        <span className="ml-auto text-[10px] text-[#4A5568]">
                          {new Date(comp.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Management Overlay (Owner Only) */}
                {isOwner && (
                  <button
                    onClick={(e) => handleDelete(e, comp._id)}
                    disabled={deletingId === comp._id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#4A5568] hover:text-red-400 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    title="Delete component"
                  >
                    {deletingId === comp._id ? (
                      <span className="w-3 h-3 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin" />
                    ) : (
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
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B7A99] border border-white/6 hover:border-white/12 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              ← Prev
            </button>
            <span className="text-xs text-[#4A5568] px-3 font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
