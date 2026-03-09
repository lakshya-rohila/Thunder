import React, { useState } from "react";
import { useTranslations } from "next-intl";
import PreviewPanel from "./PreviewPanel";
import CodeTabs from "./CodeTabs";
import PublishModal from "./PublishModal";
import FeedbackWidget from "./FeedbackWidget";
import DeployButton from "./DeployButton";
import ResearchPanel from "@/modules/Research/ResearchPanel";
import ImageGenerationPanel from "@/modules/ImageGeneration/ImageGenerationPanel";
import CodeAssistantPanel from "@/modules/CodeAssistant/CodeAssistantPanel";

interface WorkspaceProps {
  componentData: {
    name?: string;
    html: string;
    css: string;
    js: string;
    jsx?: string;
  } | null;
  onCodeUpdate: (type: "html" | "css" | "js" | "jsx", value: string) => void;
  chatId?: string | null;
  isPublic?: boolean;
  onPublished?: (isPublic: boolean) => void;
  mode?: "prompt" | "screenshot" | "research" | "image" | "code";
}

export default function Workspace({
  componentData,
  onCodeUpdate,
  chatId,
  isPublic = false,
  onPublished,
  mode = "prompt",
}: WorkspaceProps) {
  const t = useTranslations("Workspace");
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "research">(
    "preview",
  );
  const [showPublishModal, setShowPublishModal] = useState(false);

  // If in research mode, always show ResearchPanel
  if (mode === "research") {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
        <ResearchPanel />
      </div>
    );
  }

  // If in image mode, always show ImageGenerationPanel
  if (mode === "image") {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
        <ImageGenerationPanel />
      </div>
    );
  }

  // If in code mode, always show CodeAssistantPanel
  if (mode === "code") {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
        <CodeAssistantPanel />
      </div>
    );
  }

  if (!componentData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />

        <div className="relative z-10 border-2 border-white/10 bg-[#050505] p-12 max-w-sm">
          <div className="w-16 h-16 bg-[#DFFF00] flex items-center justify-center mb-6 mx-auto shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#050505"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
            {t("readyTitle")}
          </h3>
          <p className="text-[#A1A1AA] text-sm font-mono">{t("readyDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden">
      {/* Workspace Header */}
      <div className="h-16 bg-[#050505] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-[#DFFF00] border border-[#050505] shadow-[2px_2px_0_rgba(223,255,0,0.5)] animate-pulse" />
          <h2 className="font-bold text-sm text-white font-mono tracking-widest uppercase">
            {componentData.name || t("untitled")}
          </h2>
          <span className="text-[10px] bg-[#FAFAFA] text-[#050505] px-2 py-0.5 font-bold uppercase tracking-widest shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
            {t("active")}
          </span>
          {chatId && <FeedbackWidget generationId={chatId} />}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* <DeployButton componentData={componentData} /> */}

          {chatId && (
            <button
              onClick={() => setShowPublishModal(true)}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-all border-2 border-transparent ${
                isPublic
                  ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00] shadow-[4px_4px_0_rgba(223,255,0,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                  : "bg-[#FAFAFA] text-[#050505] shadow-[4px_4px_0_rgba(255,255,255,0.3)] hover:bg-[#DFFF00] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {isPublic ? t("managePost") : t("publish")}
            </button>
          )}

          {/* Tab toggle */}
          <div className="flex bg-[#050505] p-1 border border-white/20 gap-1">
            {(["preview", "code", "research"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#DFFF00] text-[#050505]"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/5"
                }`}
              >
                {tab === "preview" ? (
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
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : tab === "code" ? (
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
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                )}
                {t(
                  tab === "preview"
                    ? "tabPreview"
                    : tab === "code"
                      ? "tabCode"
                      : "tabResearch",
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#050505]">
        {activeTab === "preview" ? (
          <PreviewPanel
            html={componentData.html}
            css={componentData.css}
            js={componentData.js}
            jsx={componentData.jsx}
          />
        ) : activeTab === "code" ? (
          <CodeTabs
            html={componentData.html}
            css={componentData.css}
            js={componentData.js}
            jsx={componentData.jsx}
            onUpdate={onCodeUpdate}
          />
        ) : (
          <ResearchPanel />
        )}
      </div>

      {chatId && (
        <React.Suspense fallback={null}>
          <PublishModal
            isOpen={showPublishModal}
            onClose={() => setShowPublishModal(false)}
            chatId={chatId}
            isPublic={isPublic}
            onPublished={onPublished || (() => {})}
          />
        </React.Suspense>
      )}
    </div>
  );
}
