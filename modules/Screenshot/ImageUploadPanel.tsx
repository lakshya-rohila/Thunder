import React, { useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFile,
  setPreview,
  clearScreenshot,
  setError,
} from "./ScreenshotSlice";
import { analyzeScreenshot } from "./ScreenshotActions";

interface ImageUploadPanelProps {
  onResult: (data: {
    name: string;
    html: string;
    css: string;
    js: string;
  }) => void;
  onError: (message: string) => void;
}

export default function ImageUploadPanel({
  onResult,
  onError,
}: ImageUploadPanelProps) {
  const dispatch = useAppDispatch();
  const { file, preview, isAnalyzing, analyzed, error } = useAppSelector(
    (state) => state.screenshot
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      dispatch(setError("Please upload an image file (JPEG, PNG, WebP, or GIF)."));
      onError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    dispatch(setFile(f));
    const reader = new FileReader();
    reader.onload = (e) => dispatch(setPreview(e.target?.result as string));
    reader.readAsDataURL(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      if (!dropped.type.startsWith("image/")) {
        dispatch(setError("Please upload an image file (JPEG, PNG, WebP, or GIF)."));
        onError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
        return;
      }
      dispatch(setFile(dropped));
      const reader = new FileReader();
      reader.onload = (ev) => dispatch(setPreview(ev.target?.result as string));
      reader.readAsDataURL(dropped);
    }
  }, [dispatch, onError]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    dispatch(setError(null));
    onError("");

    const resultAction = await dispatch(analyzeScreenshot(file));
    if (analyzeScreenshot.fulfilled.match(resultAction)) {
      onResult(resultAction.payload);
    } else {
      const errMsg = resultAction.payload as string;
      dispatch(setError(errMsg));
      onError(errMsg);
    }
  };

  const handleClear = () => {
    dispatch(clearScreenshot());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full w-[380px] bg-[#0D1117] border-r border-white/5 shrink-0 relative z-20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8A2BE2] animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Screenshot
          </h2>
        </div>
        <span className="text-[10px] bg-[#8A2BE2]/10 text-[#8A2BE2] px-2 py-0.5 rounded-full border border-[#8A2BE2]/20 font-semibold uppercase tracking-wider">
          Vision
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Drop Zone */}
        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[280px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-[#8A2BE2] bg-[#8A2BE2]/8 shadow-[0_0_30px_rgba(138,43,226,0.15)]"
                : "border-white/10 hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/4"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                isDragging
                  ? "bg-[#8A2BE2]/20 border border-[#8A2BE2]/40"
                  : "bg-white/5 border border-white/8"
              }`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDragging ? "#8A2BE2" : "#4A5568"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              {isDragging ? "Drop it here" : "Upload a screenshot"}
            </p>
            <p className="text-xs text-[#4A5568] text-center px-6">
              Drag & drop or click to browse
              <br />
              <span className="text-[#4A5568]/70">
                JPEG, PNG, WebP, GIF · Max 10MB
              </span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Preview */}
            <div className="relative rounded-xl overflow-hidden border border-white/8 bg-[#0B0F19]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded screenshot"
                className="w-full object-contain max-h-52"
              />
              {/* Overlay on success */}
              {analyzed && (
                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-full px-3 py-1.5 flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-emerald-400 text-xs font-semibold">
                      Generated!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* File info */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B9AB5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="text-xs text-[#8B9AB5] truncate max-w-[180px]">
                  {file?.name}
                </span>
              </div>
              <button
                onClick={handleClear}
                className="text-xs text-[#4A5568] hover:text-red-400 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!preview && (
          <div className="space-y-2">
            <p className="text-[10px] text-[#4A5568] uppercase tracking-wider font-semibold px-1">
              How it works
            </p>
            {[
              { icon: "📸", text: "Upload any UI screenshot" },
              { icon: "⚡", text: "Gemini Vision analyzes the design" },
              { icon: "✨", text: "Get matching HTML/CSS/JS instantly" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/2 border border-white/4"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs text-[#8B9AB5]">{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div className="p-4 border-t border-white/5 bg-[#0B0F19]">
        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            !file || isAnalyzing
              ? "bg-white/5 text-[#4A5568] cursor-not-allowed border border-white/5"
              : "bg-gradient-to-r from-[#8A2BE2] to-[#00F5FF] text-[#0B0F19] shadow-[0_0_25px_rgba(138,43,226,0.3)] hover:shadow-[0_0_35px_rgba(138,43,226,0.5)] hover:-translate-y-0.5"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#8A2BE2] rounded-full loading-dot" />
                <div className="w-1.5 h-1.5 bg-[#8A2BE2] rounded-full loading-dot" />
                <div className="w-1.5 h-1.5 bg-[#8A2BE2] rounded-full loading-dot" />
              </div>
              <span className="text-[#8B9AB5]">Analyzing...</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze & Generate
            </>
          )}
        </button>
        {file && !isAnalyzing && (
          <p className="text-center text-[10px] text-[#4A5568] mt-2">
            Powered by Gemini Vision AI
          </p>
        )}
      </div>
    </div>
  );
}
