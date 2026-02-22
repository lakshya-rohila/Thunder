"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import ImageGenerationPanel from "@/modules/ImageGeneration/ImageGenerationPanel";

export default function ImageGenToolPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar Info */}
        <div className="w-full lg:w-1/3 border-r border-white/5 bg-[#0D1117] p-6 flex flex-col">
          <Link href="/ai-tools" className="inline-flex items-center text-xs text-[#6B7A99] hover:text-white mb-6 transition-colors">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">AI Image Generator</h1>
              <p className="text-xs text-[#8B9AB5]">Create stunning visuals from text prompts.</p>
            </div>
          </div>

          <div className="flex-1 bg-[#161B22] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 animate-pulse">
              <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-2">Turn Text into Art</h3>
            <p className="text-[#8B9AB5] text-sm mb-6">
              Use advanced diffusion models to generate high-quality images for your projects, mockups, or inspiration.
            </p>
            <div className="text-xs text-[#4A5568]">
              Powered by Flux & Stability AI
            </div>
          </div>
        </div>

        {/* Right Content: The Image Generation Panel */}
        <div className="flex-1 bg-[#0B0F19] flex items-center justify-center p-0 overflow-hidden">
          <div className="w-full h-full">
             <ImageGenerationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
