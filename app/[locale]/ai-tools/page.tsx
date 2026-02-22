import React from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import { TOOLS } from "@/lib/tools-config";

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/8 text-[#00F5FF] text-xs font-semibold mb-6 uppercase tracking-widest animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
            Document Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Automate your <span className="gradient-text-blue">paperwork.</span>
          </h1>
          <p className="text-[#8B9AB5] text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Upload documents and extract structured data instantly using state-of-the-art AI models.
            No manual data entry required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={`/ai-tools/${tool.id}`} className="group block">
              <div className={`h-full p-8 rounded-2xl border border-white/5 bg-[#0D1117] hover:border-white/10 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 shadow-lg hover:shadow-2xl`}>
                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none`} />
                
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bgColor} ${tool.color} border ${tool.borderColor}`}>
                    {/* Simplified Icon Logic or Import Icons */}
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#6B7A99] uppercase tracking-wider">
                    AI Model
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F5FF] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-[#8B9AB5] mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <span className="text-xs text-[#4A5568] font-mono">
                    Use Case: {tool.useCase}
                  </span>
                  <span className={`text-sm font-semibold ${tool.color} flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
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
