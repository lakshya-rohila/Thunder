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

  // Collapsed state — just a thin icon strip
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-[#0D1117] border-r border-white/5 flex flex-col items-center py-3 gap-3 shrink-0">
        <button
          onClick={onToggleCollapse}
          title="Expand sidebar"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A5568] hover:text-[#00F5FF] hover:bg-[#00F5FF]/8 transition-all duration-200"
        >
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A5568] hover:text-[#00F5FF] hover:bg-[#00F5FF]/8 transition-all duration-200"
        >
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <div className="w-6 h-px bg-white/5 my-1" />
        {chats.slice(0, 6).map((chat) => (
          <button
            key={chat._id}
            onClick={() => handleSelectChat(chat._id)}
            title={chat.title}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
              activeChatId === chat._id
                ? "bg-[#00F5FF]/15 text-[#00F5FF]"
                : "text-[#4A5568] hover:text-[#8B9AB5] hover:bg-white/5"
            }`}
          >
            {chat.title.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-[#0D1117] border-r border-white/5 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/5 flex items-center justify-between gap-2">
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-semibold text-white tracking-wide">
            {t("title")}
          </span>
          {chats.length > 0 && (
            <span className="text-[10px] bg-white/5 text-[#4A5568] px-1.5 py-0.5 rounded-full font-medium">
              {chats.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* New chat */}
          <button
            onClick={onNewChat}
            title="New chat"
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#4A5568] hover:text-[#00F5FF] hover:bg-[#00F5FF]/8 transition-all duration-200"
          >
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
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          {/* Collapse */}
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#4A5568] hover:text-[#8B9AB5] hover:bg-white/5 transition-all duration-200"
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
                  className={`group relative flex flex-col gap-0.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#00F5FF]/8 border border-[#00F5FF]/15"
                      : "hover:bg-white/3 border border-transparent"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00F5FF] rounded-r-full" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-xs font-medium leading-snug truncate flex-1 ${
                        isActive ? "text-[#00F5FF]" : "text-[#C8D8F0]"
                      }`}
                    >
                      {isLoadingThis ? (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce"
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
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-[#4A5568] hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 shrink-0"
                      title="Delete chat"
                    >
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
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-[#4A5568] truncate flex-1">
                      {chat.prompt.slice(0, 45)}
                      {chat.prompt.length > 45 ? "…" : ""}
                    </p>
                    <span className="text-[10px] text-[#4A5568]/60 shrink-0">
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
                className="w-full py-2 text-xs text-[#4A5568] hover:text-[#8B9AB5] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <span className="w-1 h-1 bg-[#4A5568] rounded-full animate-bounce" />
                    <span
                      className="w-1 h-1 bg-[#4A5568] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1 h-1 bg-[#4A5568] rounded-full animate-bounce"
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
      <div className="px-3 py-2.5 border-t border-white/5">
        <p className="text-[10px] text-[#4A5568]/50 text-center">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}
