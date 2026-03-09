"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface ChatItem {
  _id: string;
  title: string;
  prompt: string;
  updatedAt: string;
  expiresAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

interface ChatHistorySidebarProps {
  activeChatId: string | null;
  onSelectChat: (
    chat: ChatItem & {
      generatedHTML?: string;
      generatedCSS?: string;
      generatedJS?: string;
    },
  ) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function timeAgo(dateStr: string, t: any): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return `${mins}${t("mAgo")}`;
  if (hours < 24) return `${hours}${t("hAgo")}`;
  return `${days}${t("dAgo")}`;
}

export default function ChatHistorySidebar({
  activeChatId,
  onSelectChat,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
}: ChatHistorySidebarProps) {
  const t = useTranslations("ChatHistorySidebar");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await fetch(`/api/chat/list?page=${page}&limit=20`);
      if (!res.ok) throw new Error("Failed to load chats");
      const data = await res.json();
      setChats((prev) => (append ? [...prev, ...data.chats] : data.chats));
      setPagination(data.pagination);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchChats(1);
  }, [fetchChats]);

  const handleSelectChat = async (chatId: string) => {
    if (chatId === activeChatId) return;
    setLoadingChatId(chatId);
    try {
      const res = await fetch(`/api/chat/${chatId}`);
      if (!res.ok) throw new Error("Failed to load chat");
      const data = await res.json();
      onSelectChat(data.chat);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingChatId(null);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      setChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch {
      setError("Failed to delete chat");
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-[#050505] border-r border-white/10 flex flex-col items-center py-4 gap-4 shrink-0">
        <button
          onClick={onToggleCollapse}
          title="Expand sidebar"
          className="w-8 h-8 flex items-center justify-center text-[#A1A1AA] hover:text-[#DFFF00] hover:bg-white/5 transition-colors border border-transparent hover:border-[#DFFF00]/50"
        >
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          className="w-8 h-8 flex items-center justify-center text-[#A1A1AA] hover:text-[#DFFF00] hover:bg-white/5 transition-colors border border-transparent hover:border-[#DFFF00]/50"
        >
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <div className="w-6 h-px bg-white/10 my-2" />
        {chats.slice(0, 6).map((chat) => (
          <button
            key={chat._id}
            onClick={() => handleSelectChat(chat._id)}
            title={chat.title}
            className={`w-8 h-8 flex items-center justify-center text-xs font-bold font-mono uppercase transition-colors border ${
              activeChatId === chat._id
                ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00]"
                : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20"
            }`}
          >
            {chat.title.charAt(0)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-[#050505] border-r border-white/10 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FAFAFA"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-bold text-white tracking-widest font-mono uppercase">
            {t("title")}
          </span>
          {chats.length > 0 && (
            <span className="text-[10px] bg-[#DFFF00] text-[#050505] px-1.5 py-0.5 font-bold font-mono">
              {chats.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* New chat */}
          <button
            onClick={onNewChat}
            title="New chat"
            className="w-6 h-6 flex items-center justify-center text-[#A1A1AA] hover:text-[#DFFF00] transition-colors"
          >
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
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          {/* Collapse */}
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="w-6 h-6 flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {loading ? (
          <div className="flex flex-col gap-2 px-1 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-white/5 rounded-full w-3/4 mb-1.5" />
                <div className="h-2 bg-white/3 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-red-400/70">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchChats(1);
              }}
              className="mt-2 text-xs text-[#00F5FF] hover:underline"
            >
              {t("retry")}
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center mb-3">
              <svg
                width="16"
                height="16"
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
            <p className="text-xs text-[#4A5568] leading-relaxed">
              {t("noChats")}
              <br />
              {t("startPrompt")}
            </p>
          </div>
        ) : (
          <>
            {chats.map((chat) => {
              const isActive = activeChatId === chat._id;
              const isLoadingThis = loadingChatId === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`group relative flex flex-col gap-1 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 ${
                    isActive
                      ? "bg-[#111111] border-l-[3px] border-l-[#DFFF00]"
                      : "hover:bg-white/5 border-l-[3px] border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-[11px] font-bold leading-snug truncate flex-1 font-mono uppercase tracking-wider ${
                        isActive ? "text-[#FAFAFA]" : "text-[#A1A1AA]"
                      }`}
                    >
                      {isLoadingThis ? (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 bg-[#DFFF00] animate-pulse"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-[#DFFF00] animate-pulse"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-[#DFFF00] animate-pulse"
                            style={{ animationDelay: "300ms" }}
                          />
                        </span>
                      ) : (
                        chat.title
                      )}
                    </p>
                    {/* Delete button — shows on hover */}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-[#A1A1AA] hover:text-[#FF4500] hover:bg-[#FF4500]/10 transition-colors shrink-0"
                      title="Delete chat"
                    >
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
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-[#71717A] truncate flex-1 font-sans">
                      {chat.prompt.slice(0, 40)}
                      {chat.prompt.length > 40 ? "..." : ""}
                    </p>
                    <span className="text-[9px] text-[#A1A1AA] font-mono shrink-0 uppercase">
                      {timeAgo(chat.updatedAt, t)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Load more */}
            {pagination.hasNextPage && (
              <button
                onClick={() => fetchChats(pagination.page + 1, true)}
                disabled={loadingMore}
                className="w-full py-3 text-xs font-bold font-mono tracking-widest uppercase text-[#A1A1AA] hover:text-[#FAFAFA] border-t border-white/5 transition-colors flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-[#A1A1AA] animate-pulse" />
                    <span
                      className="w-1.5 h-1.5 bg-[#A1A1AA] animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-[#A1A1AA] animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    />
                  </>
                ) : (
                  t("loadMore")
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[9px] font-mono text-[#71717A] text-center uppercase tracking-widest">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}
