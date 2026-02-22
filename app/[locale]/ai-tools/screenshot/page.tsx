"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import ImageUploadPanel from "@/modules/Screenshot/ImageUploadPanel";
import { useAppDispatch } from "@/store/hooks";
import { setComponentData, setSavedChatId, setIsPublic } from "@/modules/Chat/ChatSlice";
import { createChat } from "@/modules/Chat/ChatActions";
import { fetchUser } from "@/modules/Auth/AuthActions";

export default function ScreenshotToolPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleResult = async (data: {
    name: string;
    html: string;
    css: string;
    js: string;
  }) => {
    // 1. Update Redux State (so user sees it if they go to dashboard)
    dispatch(setComponentData(data));
    dispatch(setIsPublic(false));

    // 2. Save Chat
    const resultAction = await dispatch(
      createChat({
        prompt: `[Screenshot] ${data.name}`,
        data,
      })
    );

    if (createChat.fulfilled.match(resultAction)) {
      const chatId = resultAction.payload as string;
      dispatch(setSavedChatId(chatId));
    }
    
    // 3. Refresh Credits
    dispatch(fetchUser());

    // 4. Redirect to Dashboard to see the result in full Workspace
    // We pass a query param to tell dashboard to load the latest state or just rely on Redux
    router.push("/dashboard");
  };

  const handleError = (msg: string) => {
    // Basic alert for now, or could use a toast
    alert(msg);
  };

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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pink-400/10 text-pink-400 border border-pink-400/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Screenshot to Code</h1>
              <p className="text-xs text-[#8B9AB5]">Recreate existing websites or mockups.</p>
            </div>
          </div>

          <div className="flex-1 bg-[#161B22] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 animate-pulse">
              <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-2">Upload a Screenshot</h3>
            <p className="text-[#8B9AB5] text-sm mb-6">
              Our AI will analyze the layout, colors, and content to generate a pixel-perfect replica in HTML & Tailwind CSS.
            </p>
            <div className="text-xs text-[#4A5568]">
              Supports PNG, JPG, JPEG • Max 10MB
            </div>
          </div>
        </div>

        {/* Right Content: The Upload Panel (Reused) */}
        <div className="flex-1 bg-[#0B0F19] flex items-center justify-center p-6">
          <div className="w-full max-w-md h-full flex flex-col justify-center">
             {/* We wrap the existing panel to fit this layout */}
             <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[500px] w-full">
                <ImageUploadPanel 
                  onResult={handleResult} 
                  onError={handleError} 
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
