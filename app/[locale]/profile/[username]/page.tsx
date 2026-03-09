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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-4 h-4 bg-[#DFFF00] animate-pulse shadow-[2px_2px_0_rgba(223,255,0,0.5)]"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "User not found"}
        </p>
        <Link
          href="/community"
          className="text-xs text-[#DFFF00] hover:underline uppercase tracking-widest font-bold"
        >
          ← Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans flex flex-col">
      <DashboardNavbar />

      {/* Profile Header */}
      <div
        className="border-b-2 border-white/10 shrink-0"
        style={{
          background: "#000000",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-20 h-20 flex items-center justify-center text-3xl font-black text-[#050505] shrink-0 border-2 border-white/20 bg-[#FAFAFA] shadow-[6px_6px_0_rgba(255,255,255,0.2)]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                  {user.name}
                </h1>
                {isOwner && (
                  <Link
                    href="/settings"
                    className="px-4 py-2 border-2 border-white/20 bg-[#0A0A0A] text-[#FAFAFA] font-bold font-mono text-[10px] uppercase tracking-widest hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
              <p className="text-sm text-[#DFFF00] font-mono mt-1 font-bold">
                @{user.username}
              </p>
              <p className="text-xs text-[#A1A1AA] font-mono mt-2">
                Joined {formatDate(user.createdAt)}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-5 flex-wrap">
                {[
                  { label: "Components", value: stats.totalComponents },
                  { label: "Total Likes", value: stats.totalLikes },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      {value.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest mt-1 font-bold">
                      {label}
                    </span>
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
          <h2 className="text-[10px] font-bold text-[#A1A1AA] font-mono uppercase tracking-widest flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <rect width="7" height="7" x="3" y="3" rx="0" />
              <rect width="7" height="7" x="14" y="3" rx="0" />
              <rect width="7" height="7" x="14" y="14" rx="0" />
              <rect width="7" height="7" x="3" y="14" rx="0" />
            </svg>
            {isOwner ? "My Components" : "Public Components"}
          </h2>
          {isOwner && (
            <Link href="/dashboard">
              <button className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#DFFF00] border-2 border-transparent hover:border-[#DFFF00] px-3 py-1 transition-all">
                + Create New
              </button>
            </Link>
          )}
        </div>

        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/10 bg-[#0A0A0A]">
            <div className="w-16 h-16 bg-[#050505] border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.1)] flex items-center justify-center mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FAFAFA"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-[#A1A1AA] font-mono text-sm mb-6">
              {isOwner
                ? "You haven't created any components yet."
                : "No public components yet."}
            </p>
            {isOwner && (
              <Link href="/dashboard">
                <button className="px-6 py-3 border-2 border-transparent bg-[#DFFF00] text-[#050505] font-black uppercase tracking-widest text-[10px] shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
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
                  <div className="border-2 border-white/10 bg-[#050505] overflow-hidden transition-all duration-300 hover:border-[#DFFF00] hover:shadow-[8px_8px_0_rgba(223,255,0,0.2)] hover:-translate-y-1 hover:-translate-x-1">
                    {/* Preview */}
                    <div className="h-48 bg-[#0D1117] relative overflow-hidden group/prev border-b-2 border-white/10">
                      <ComponentPreview
                        html={comp.generatedHTML}
                        css={comp.generatedCSS}
                        js={comp.generatedJS}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none" />

                      {/* Labels */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {!comp.isPublic && isOwner && (
                          <span className="px-2 py-1 bg-[#050505] border border-white/20 text-[#FAFAFA] text-[9px] font-bold font-mono tracking-widest uppercase">
                            Private
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5 relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#FAFAFA] truncate mb-2 pr-6 group-hover:text-[#DFFF00] transition-colors">
                            {comp.title}
                          </h3>
                          {comp.description && (
                            <p className="text-[10px] font-mono text-[#A1A1AA] line-clamp-2 leading-relaxed">
                              {comp.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-[#71717A]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {comp.likesCount}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-[#71717A]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            {comp.commentsCount}
                          </span>
                        </div>
                        <span className="ml-auto text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
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
                    className="absolute top-3 right-3 w-8 h-8 border-2 border-white/20 bg-[#050505] flex items-center justify-center text-[#71717A] hover:text-[#FF4500] hover:border-[#FF4500] transition-all opacity-0 group-hover:opacity-100 shadow-[2px_2px_0_rgba(255,255,255,0.1)]"
                    title="Delete component"
                  >
                    {deletingId === comp._id ? (
                      <span className="w-2 h-2 bg-[#FF4500] animate-ping" />
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="px-4 py-2 border-2 border-white/20 bg-[#0A0A0A] text-[#FAFAFA] font-bold font-mono text-[10px] uppercase tracking-widest hover:border-[#DFFF00] hover:text-[#DFFF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] px-3">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === totalPages}
              className="px-4 py-2 border-2 border-white/20 bg-[#0A0A0A] text-[#FAFAFA] font-bold font-mono text-[10px] uppercase tracking-widest hover:border-[#DFFF00] hover:text-[#DFFF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
