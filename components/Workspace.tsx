import React, { useState } from "react";
import PreviewPanel from "./PreviewPanel";
import CodeTabs from "./CodeTabs";
import PublishModal from "./PublishModal";

interface WorkspaceProps {
  componentData: {
    name?: string;
    html: string;
    css: string;
    js: string;
  } | null;
  onCodeUpdate: (type: "html" | "css" | "js", value: string) => void;
  chatId?: string | null;
  isPublic?: boolean;
  onPublished?: (isPublic: boolean) => void;
}

export default function Workspace({
  componentData,
  onCodeUpdate,
  chatId,
  isPublic = false,
  onPublished,
}: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [showPublishModal, setShowPublishModal] = useState(false);

  if (!componentData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dark Horizon Glow background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none z-0" />

        <div className="relative z-10 glass-card border border-white/6 p-12 rounded-3xl text-center max-w-sm shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00F5FF]/15 to-[#8A2BE2]/15 border border-[#00F5FF]/20 flex items-center justify-center mb-6 mx-auto animate-float">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00F5FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Workspace Ready</h3>
          <p className="text-[#4A5568] text-sm leading-relaxed">
            Your generated components will appear here. Use the prompt panel to
            start building.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
      {/* Workspace Header */}
      <div className="h-14 bg-[#0D1117] border-b border-white/5 flex items-center justify-between px-5 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="font-semibold text-sm text-white">
            {componentData.name || "Untitled Component"}
          </h2>
          <span className="text-[10px] bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-0.5 rounded-full border border-[#00F5FF]/20 font-semibold uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {chatId && (
            <button
              onClick={() => setShowPublishModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isPublic
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-gradient-to-r from-[#00F5FF]/10 to-[#8A2BE2]/10 text-[#00F5FF] border border-[#00F5FF]/20 hover:from-[#00F5FF]/20 hover:to-[#8A2BE2]/20"
              }`}
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {isPublic ? "Manage Post" : "Publish"}
            </button>
          )}

          {/* Tab toggle */}
          <div className="flex bg-[#0B0F19] p-1 rounded-xl border border-white/5 gap-1">
            {(["preview", "code"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#00F5FF]/20 to-[#8A2BE2]/20 text-[#00F5FF] border border-[#00F5FF]/25 shadow-[0_0_10px_rgba(0,245,255,0.1)]"
                    : "text-[#4A5568] hover:text-[#8B9AB5] hover:bg-white/3"
                }`}
              >
                {tab === "preview" ? (
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
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
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
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                )}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#0B0F19]">
        {activeTab === "preview" ? (
          <PreviewPanel
            html={componentData.html}
            css={componentData.css}
            js={componentData.js}
          />
        ) : (
          <CodeTabs
            html={componentData.html}
            css={componentData.css}
            js={componentData.js}
            onUpdate={onCodeUpdate}
          />
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
