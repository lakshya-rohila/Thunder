"use client";

import React, { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ImageUploadPanel from "@/components/ImageUploadPanel";
import Workspace from "@/components/Workspace";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ErrorToast from "@/components/ErrorToast";
import PostToCommunityPanel from "@/components/PostToCommunityPanel";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMessages,
  addMessage,
  setComponentData,
  setActiveChatId,
  setSavedChatId,
  setIsPublic,
  setLoading,
  setMode,
  setError,
  setSidebarCollapsed,
  resetChat,
} from "@/store/slices/chatSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    messages,
    componentData,
    activeChatId,
    savedChatId,
    isPublic,
    loading,
    error,
    mode,
    sidebarCollapsed,
  } = useAppSelector((state) => state.chat);

  const [sidebarKey, setSidebarKey] = useState(0);

  /** Save a completed generation to the DB — returns the chatId */
  const saveChat = async (
    prompt: string,
    data: { name: string; html: string; css: string; js: string },
  ): Promise<string | null> => {
    try {
      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          title: data.name || prompt.slice(0, 80),
          generatedHTML: data.html,
          generatedCSS: data.css,
          generatedJS: data.js,
        }),
      });
      const json = await res.json();
      setSidebarKey((k) => k + 1);
      return json?.chat?.id ?? json?.chat?._id ?? json?._id ?? null;
    } catch {
      return null;
    }
  };

  const handleSendMessage = async (prompt: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(addMessage({ role: "user", content: prompt }));

    const context = componentData
      ? {
          html: componentData.html,
          css: componentData.css,
          js: componentData.js,
        }
      : undefined;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to generate component");

      dispatch(setComponentData(data));
      dispatch(setIsPublic(false));
      dispatch(
        addMessage({
          role: "ai",
          content: context
            ? "Component updated successfully!"
            : "Component generated successfully!",
        }),
      );

      if (!context) {
        const chatId = await saveChat(prompt, data);
        dispatch(setSavedChatId(chatId));
      }
    } catch (err: any) {
      const errMsg = err.message || "An unexpected error occurred";
      dispatch(setError(errMsg));
      dispatch(
        addMessage({
          role: "ai",
          content: `Error: ${errMsg}`,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleImageResult = async (data: {
    name: string;
    html: string;
    css: string;
    js: string;
  }) => {
    dispatch(setComponentData(data));
    dispatch(setIsPublic(false));
    const chatId = await saveChat(`[Screenshot] ${data.name}`, data);
    dispatch(setSavedChatId(chatId));
  };

  const handleCodeUpdate = (type: "html" | "css" | "js", value: string) => {
    if (componentData) {
      dispatch(setComponentData({ ...componentData, [type]: value }));
    }
  };

  const handleSelectChat = (chat: any) => {
    dispatch(setActiveChatId(chat._id));
    dispatch(setIsPublic(chat.isPublic ?? false));
    dispatch(
      setComponentData({
        name: chat.title,
        html: chat.generatedHTML || "",
        css: chat.generatedCSS || "",
        js: chat.generatedJS || "",
      }),
    );
    dispatch(
      setMessages([
        { role: "user", content: chat.prompt },
        { role: "ai", content: "Loaded from history." },
      ]),
    );
    dispatch(setMode("prompt"));
  };

  const handleNewChat = () => {
    dispatch(resetChat());
    dispatch(setMode("prompt"));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="flex flex-col h-screen w-full bg-[#0B0F19] text-[#F0F6FF] font-sans overflow-hidden">
      <DashboardNavbar
        onLogout={handleLogout}
        showModeToggle={true}
        mode={mode}
        onModeChange={(m) => dispatch(setMode(m))}
      />

      <div className="flex-1 flex overflow-hidden">
        <ChatHistorySidebar
          key={sidebarKey}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() =>
            dispatch(setSidebarCollapsed(!sidebarCollapsed))
          }
        />

        {mode === "prompt" ? (
          <ChatInterface
            messages={messages}
            isLoading={loading}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <ImageUploadPanel
            onResult={handleImageResult}
            onError={(msg) => dispatch(setError(msg))}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Workspace
            componentData={componentData}
            onCodeUpdate={handleCodeUpdate}
            chatId={savedChatId}
            isPublic={isPublic}
            onPublished={(pub) => dispatch(setIsPublic(pub))}
          />
        </div>
      </div>

      <ErrorToast message={error} onClose={() => dispatch(setError(null))} />
    </main>
  );
}
