import React from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import { TOOLS } from "@/lib/tools-config";

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white/20 bg-[#050505] text-[#FAFAFA] text-[10px] font-bold mb-6 font-mono uppercase tracking-widest animate-fade-in-up">
            <span className="w-2 h-2 bg-[#DFFF00] animate-pulse shadow-[2px_2px_0_rgba(223,255,0,0.4)]" />
            Document Intelligence
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Automate your <span className="text-[#DFFF00]">paperwork.</span>
          </h1>
          <p
            className="text-[#A1A1AA] text-sm font-mono max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Upload documents and extract structured data instantly using
            state-of-the-art AI models. No manual data entry required.
          </p>
        </div>

        {/* Tools Grid */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/ai-tools/${tool.id}`}
              className="group block"
            >
              <div
                className={`h-full p-8 border-2 border-white/10 bg-[#050505] hover:border-[#DFFF00] transition-all flex flex-col relative overflow-hidden group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0_rgba(223,255,0,0.2)]`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={`w-14 h-14 border-2 border-white/20 flex items-center justify-center shadow-[4px_4px_0_rgba(255,255,255,0.05)] bg-[#0A0A0A] ${tool.color}`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-[#FAFAFA] text-[#050505] text-[10px] font-bold font-mono tracking-widest uppercase shadow-[2px_2px_0_rgba(255,255,255,0.3)]">
                    AI Model
                  </div>
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-[#DFFF00] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed mb-8 flex-1">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <span className="text-[10px] text-[#71717A] font-mono uppercase tracking-widest">
                    Use Case:{" "}
                    <span className="text-[#FAFAFA]">{tool.useCase}</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest text-[#FAFAFA] group-hover:text-[#050505] group-hover:bg-[#DFFF00] px-3 py-1 border-2 border-transparent group-hover:border-[#050505] transition-all`}
                  >
                    Open Tool →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
