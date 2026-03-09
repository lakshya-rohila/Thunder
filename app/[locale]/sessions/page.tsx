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
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans flex flex-col">
      <DashboardNavbar onLogout={handleLogout} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-[#A1A1AA] font-mono text-sm max-w-2xl">
            {t("desc")}
          </p>
        </header>

        {chatsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : chatsError ? (
          <div className="bg-[#FF4500]/10 border-2 border-[#FF4500] p-6 text-[#FF4500] font-mono tracking-widest uppercase text-sm font-bold">
            {chatsError}
          </div>
        ) : chats.length === 0 ? (
          <div className="border-2 border-white/10 bg-[#050505] p-20 text-center">
            <div className="w-16 h-16 border-2 border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
              <svg
                width="32"
                height="32"
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
            <h2 className="text-xl font-black uppercase tracking-widest mb-2">
              {t("noSessions")}
            </h2>
            <p className="text-[#A1A1AA] font-mono mb-8">
              {t("noSessionsDesc")}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-4 bg-[#DFFF00] text-[#050505] font-black uppercase tracking-widest shadow-[6px_6px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all border-2 border-transparent"
            >
              {t("startGen")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="group bg-[#050505] border-2 border-white/10 hover:border-[#DFFF00] transition-all flex flex-col hover:shadow-[8px_8px_0_rgba(223,255,0,0.2)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-black text-lg text-white uppercase tracking-widest group-hover:text-[#DFFF00] transition-colors line-clamp-1">
                      {chat.title}
                    </h3>
                  </div>
                  <p className="text-sm font-mono text-[#A1A1AA] line-clamp-3 mb-6 bg-[#0A0A0A] p-4 border border-white/10">
                    {chat.prompt}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#71717A] font-bold font-mono uppercase tracking-widest">
                    <div className="flex items-center gap-2">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                    {chat.expiresAt && (
                      <div className="text-[#FF4500]">
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
                <div className="px-6 py-4 bg-[#0A0A0A] border-t border-white/10 flex items-center justify-between mt-auto">
                  <Link
                    href={`/dashboard?chatId=${chat._id}`}
                    className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#A1A1AA] group-hover:text-[#DFFF00] transition-colors flex items-center gap-2"
                  >
                    {t("openInDash")}
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
