import React, { useState } from "react";

interface DeployButtonProps {
  componentData: {
    name?: string;
    html: string;
    css: string;
    js: string;
  };
}

export default function DeployButton({ componentData }: DeployButtonProps) {
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    setDeployUrl(null);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: componentData.name || "thunder-project",
          html: componentData.html,
          css: componentData.css,
          js: componentData.js,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Deployment failed");
      }

      setDeployUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeploying(false);
    }
  };

  if (deployUrl) {
    return (
      <a
        href={deployUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all"
      >
        <span>Live URL</span>
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
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleDeploy}
        disabled={deploying}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          deploying
            ? "bg-white/5 text-[#6B7A99] cursor-wait"
            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
        }`}
      >
        {deploying ? (
          <>
            <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span>Deploying...</span>
          </>
        ) : (
          <>
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
              <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21" />
              <path d="M16 16l-4-4-4 4" />
            </svg>
            <span>Deploy</span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-red-500/10 border border-red-500/20 text-red-200 text-[10px] p-2 rounded-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
}
