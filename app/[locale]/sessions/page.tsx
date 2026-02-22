"use client";

import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Loader from "@/components/Loader";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser, logoutUser } from "@/modules/Auth/AuthActions";

interface Chat {
  _id: string;
  title: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export default function SessionsPage() {
  const t = useTranslations("Sessions");
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsError, setChatsError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading: authLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chat/list?limit=50");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(t("noSessions"));
        }
        const data = await res.json();
        setChats(data.chats);
      } catch (err: any) {
        setChatsError(err.message);
      } finally {
        setChatsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchChats();
    }
  }, [isLoggedIn, authLoading, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar onLogout={handleLogout} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-5 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold bg-linear-to-r from-white to-[#8B9AB5] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-[#6B7A99] mt-2">{t("desc")}</p>
        </header>

        {chatsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : chatsError ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
            {chatsError}
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-20 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7A99"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("noSessions")}</h2>
            <p className="text-[#6B7A99] mb-8">{t("noSessionsDesc")}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[#00F5FF] text-[#0B0F19] font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300"
            >
              {t("startGen")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="group bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00F5FF]/30 transition-all duration-300 flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-white group-hover:text-[#00F5FF] transition-colors line-clamp-1">
                      {chat.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#8B9AB5] line-clamp-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                    {chat.prompt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#4A5568] font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                    {chat.expiresAt && (
                      <div className="text-amber-500/70">
                        {t("expires", {
                          days: Math.ceil(
                            (new Date(chat.expiresAt).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/dashboard?chatId=${chat._id}`}
                    className="text-xs font-bold text-[#00F5FF]/80 hover:text-[#00F5FF] transition-colors flex items-center gap-1"
                  >
                    {t("openInDash")}
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
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
