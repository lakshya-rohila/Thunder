"use client";

import React, { useState } from "react";
import ChatInterface from "@/modules/Chat/ChatInterface";
import ImageUploadPanel from "@/modules/Screenshot/ImageUploadPanel";
import Workspace from "@/components/Workspace";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ErrorToast from "@/components/ErrorToast";
import VoiceListeningOverlay from "@/components/VoiceListeningOverlay";
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
  setGenerationMode,
  setProjectType,
  setStyleMode,
  setIsListening,
  setTranscript,
  setError,
  setSidebarCollapsed,
  resetChat,
} from "@/modules/Chat/ChatSlice";
import { createChat, generateComponent } from "@/modules/Chat/ChatActions";
import { logoutUser, fetchUser } from "@/modules/Auth/AuthActions";

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
    generationMode,
    projectType,
    styleMode,
    isListening,
    transcript,
    sidebarCollapsed,
  } = useAppSelector((state) => state.chat);

  const [sidebarKey, setSidebarKey] = useState(0);

  /** Save a completed generation to the DB — returns the chatId */
  const saveChat = async (
    prompt: string,
    data: { name: string; html: string; css: string; js: string },
  ): Promise<string | null> => {
    try {
      const resultAction = await dispatch(createChat({
        prompt,
        data
      }));
      
      if (createChat.fulfilled.match(resultAction)) {
         setSidebarKey((k) => k + 1);
         return resultAction.payload as string;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSendMessage = async (
    prompt: string,
    chatMode?: "standard" | "reverse",
    projType?: "component" | "app" | "game" | "auto",
    sMode?: "vanilla" | "tailwind",
  ) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Update the message history locally
    dispatch(addMessage({ role: "user", content: prompt }));

    const currentMode = chatMode || mode;
    const currentProjectType = projType || projectType || "auto";
    const currentStyleMode = sMode || styleMode || "vanilla";

    // If there is existing componentData, we include it as context for refinement
    const context = componentData
      ? {
          html: componentData.html,
          css: componentData.css,
          js: componentData.js,
        }
      : undefined;

    try {
      const data = await dispatch(generateComponent({
        prompt,
        context,
        mode: currentMode,
        projectType: currentProjectType,
        styleMode: currentStyleMode,
      })).unwrap();

      if (data.type === "clarification") {
        // It's a structured question set
        dispatch(
          addMessage({
            role: "ai",
            content: "I need a few details to get this right:",
            questions: data.questions,
          }),
        );
      } else if (data.clarification) {
        // Fallback for plain text clarification (legacy)
        dispatch(
          addMessage({
            role: "ai",
            content: data.clarification,
          }),
        );
      } else {
        // It's a generated component (type: 'component' or default)
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

        // Refresh user credits
        dispatch(fetchUser());
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
    
    // Refresh user credits
    dispatch(fetchUser());
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
      await dispatch(logoutUser()).unwrap();
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

      <VoiceListeningOverlay
        isListening={isListening}
        transcript={transcript}
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

        {mode === "prompt" || mode === "research" ? (
          <ChatInterface
            messages={messages}
            isLoading={loading}
            onSendMessage={(msg, m, pType, sMode) =>
              handleSendMessage(msg, m, pType, sMode)
            }
            mode={mode === "research" ? "research" : generationMode}
            onModeChange={(m) => dispatch(setGenerationMode(m))}
            projectType={projectType || "auto"}
            onProjectTypeChange={(t) => dispatch(setProjectType(t))}
            styleMode={styleMode || "vanilla"}
            onStyleModeChange={(s) => dispatch(setStyleMode(s))}
            isListening={isListening}
            onListeningChange={(l) => dispatch(setIsListening(l))}
            onTranscriptChange={(t) => dispatch(setTranscript(t))}
          />
        ) : mode === "screenshot" ? (
          <ImageUploadPanel
            onResult={handleImageResult}
            onError={(msg) => dispatch(setError(msg))}
          />
        ) : null}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Workspace
            componentData={componentData}
            onCodeUpdate={handleCodeUpdate}
            chatId={savedChatId}
            isPublic={isPublic}
            onPublished={(pub) => dispatch(setIsPublic(pub))}
            mode={mode}
          />
        </div>
      </div>

      <ErrorToast message={error} onClose={() => dispatch(setError(null))} />
    </main>
  );
}
