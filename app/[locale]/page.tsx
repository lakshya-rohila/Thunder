"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/modules/Auth/AuthActions";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const tHero = useTranslations("Hero");
  const tFeatures = useTranslations("Features");
  const tProcess = useTranslations("Process");
  const tPhilosophy = useTranslations("Philosophy");
  const tCTA = useTranslations("CTA");
  const tFooter = useTranslations("Footer");

  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────────── */}
      <LandingNavbar />

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative pt-36 pb-32 px-6 overflow-hidden bg-black">
        {/* X-style top glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
          }}
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/8 text-[#00F5FF] text-xs font-semibold mb-8 uppercase tracking-widest animate-fade-in-up backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
            {tHero("badge")}
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05] animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {tHero("titleLine1")}
            <br />
            <span className="gradient-text-blue">{tHero("titleLine2")}</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-[#8B9AB5] mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {tHero("description")}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <button className="btn-neon w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold relative overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.25)]">
                      <span>{tHero("openDashboard")}</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/register" className="w-full sm:w-auto">
                    <button className="btn-neon w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold relative overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.25)]">
                      <span>{tHero("startBuildingFree")}</span>
                    </button>
                  </Link>
                )}
                <Link
                  href={isLoggedIn ? "/community" : "/login"}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-white/10 bg-white/5 text-[#8B9AB5] hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                    {isLoggedIn ? tHero("exploreFeed") : tHero("viewDemo")}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hero Preview Card */}
          <div
            className="mt-20 animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF]/20 via-[#8A2BE2]/20 to-[#00F5FF]/20 rounded-2xl blur-xl opacity-60" />
              <div className="relative rounded-2xl border border-white/8 bg-[#0D1117] overflow-hidden shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0B0F19]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4 h-5 rounded bg-white/5 flex items-center px-3">
                    <span className="text-[10px] text-[#4A5568]">
                      thunder.app/dashboard
                    </span>
                  </div>
                </div>
                {/* Mock editor layout */}
                <div className="grid grid-cols-12 h-64">
                  {/* Left: Chat panel */}
                  <div className="col-span-4 border-r border-white/5 p-4 space-y-3">
                    <div className="h-6 w-20 bg-[#00F5FF]/10 rounded-md border border-[#00F5FF]/20" />
                    <div className="space-y-2">
                      <div className="h-8 w-full bg-white/5 rounded-lg" />
                      <div className="h-8 w-4/5 bg-[#00F5FF]/8 rounded-lg border border-[#00F5FF]/15" />
                      <div className="h-8 w-full bg-white/5 rounded-lg" />
                    </div>
                    <div className="mt-4 h-9 w-full bg-gradient-to-r from-[#00F5FF]/20 to-[#8A2BE2]/20 rounded-lg border border-[#00F5FF]/20 flex items-center px-3 gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
                      <div className="h-2 w-24 bg-white/20 rounded" />
                    </div>
                  </div>
                  {/* Right: Preview */}
                  <div className="col-span-8 p-6 flex flex-col gap-3">
                    <div className="flex gap-2">
                      {["HTML", "CSS", "JS"].map((tab, i) => (
                        <div
                          key={tab}
                          className={`px-3 py-1 rounded text-xs font-mono font-bold ${i === 0 ? "bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/30" : "text-[#4A5568]"}`}
                        >
                          {tab}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 bg-[#0B0F19] rounded-lg border border-white/5 p-4 space-y-2">
                      <div className="h-2 w-3/4 bg-[#8A2BE2]/30 rounded" />
                      <div className="h-2 w-1/2 bg-[#00F5FF]/20 rounded" />
                      <div className="h-2 w-5/6 bg-white/10 rounded" />
                      <div className="h-2 w-2/3 bg-[#00F5FF]/15 rounded" />
                      <div className="h-2 w-4/5 bg-white/8 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Section (Redesigned) ───────────────────────────── */}
      <section
        id="features"
        className="py-24 px-6 bg-[#0D1117] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Instant UI Generation */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF]/20 to-[#8A2BE2]/20 rounded-2xl blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#161B22]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="ml-4 flex-1 h-5 bg-[#0B0F19] rounded text-[10px] text-gray-500 flex items-center px-2 font-mono">
                    prompt.txt
                  </div>
                </div>
                <div className="p-6 font-mono text-sm text-gray-300 space-y-2">
                  <p className="text-[#00F5FF]">User:</p>
                  <p className="bg-white/5 p-3 rounded-lg border-l-2 border-[#00F5FF]">
                    "Create a modern pricing card with a gradient border, 3
                    distinct tiers, and a toggle for monthly/yearly billing."
                  </p>
                  <p className="text-[#8A2BE2] mt-4">Thunder AI:</p>
                  <div className="space-y-1 text-gray-400">
                    <p>
                      Generating HTML structure...{" "}
                      <span className="text-green-400">Done</span>
                    </p>
                    <p>
                      Applying Tailwind classes...{" "}
                      <span className="text-green-400">Done</span>
                    </p>
                    <p>
                      Adding interactive JS...{" "}
                      <span className="text-green-400">Done</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF] text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
                {tFeatures("instantGen_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("instantGen_title").split(" ")[0]}{" "}
                <span className="text-[#00F5FF]">
                  {tFeatures("instantGen_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("instantGen_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("instantGen_point1"),
                  tFeatures("instantGen_point2"),
                  tFeatures("instantGen_point3"),
                  tFeatures("instantGen_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-[#00F5FF]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Screenshot to Code */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                {tFeatures("screenshot_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("screenshot_title").split(" ")[0]}{" "}
                <span className="text-pink-400">
                  {tFeatures("screenshot_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("screenshot_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("screenshot_point1"),
                  tFeatures("screenshot_point2"),
                  tFeatures("screenshot_point3"),
                  tFeatures("screenshot_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-pink-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shadow-2xl p-8 flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-pink-500/30">
                <div className="w-20 h-20 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 animate-float">
                  <svg
                    className="w-10 h-10 text-pink-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="space-y-2 text-center">
                  <h4 className="text-lg font-bold text-white">
                    Upload Design
                  </h4>
                  <p className="text-sm text-gray-500">
                    Drag & drop or paste an image
                  </p>
                </div>

                {/* Processing Visual */}
                <div className="mt-8 w-full max-w-xs bg-[#161B22] rounded-lg p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-pink-500/20 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
                  <div className="text-xs text-pink-400 font-bold">
                    Processing...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Research */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shadow-2xl p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-10 w-full bg-[#161B22] rounded-lg border border-white/5 flex items-center px-4 text-sm text-gray-400">
                      Research: "UX trends for fintech dashboards 2026"
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-lg bg-[#161B22]/50 border border-white/5 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="w-1 h-full bg-purple-500/50 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2.5 w-1/3 bg-white/10 rounded" />
                        <div className="h-2 w-full bg-white/5 rounded" />
                        <div className="h-2 w-5/6 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                {tFeatures("research_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("research_title").split(" ")[0]}{" "}
                <span className="text-purple-400">
                  {tFeatures("research_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("research_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("research_point1"),
                  tFeatures("research_point2"),
                  tFeatures("research_point3"),
                  tFeatures("research_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Assistant */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {tFeatures("assistant_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("assistant_title").split(" ")[0]}{" "}
                <span className="text-cyan-400">
                  {tFeatures("assistant_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("assistant_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("assistant_point1"),
                  tFeatures("assistant_point2"),
                  tFeatures("assistant_point3"),
                  tFeatures("assistant_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-l from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shadow-2xl">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-white/5">
                  <span className="text-xs text-cyan-400 font-mono">
                    helper.ts
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>
                {/* Code Area */}
                <div className="p-5 font-mono text-xs md:text-sm leading-relaxed text-gray-300">
                  <div className="text-gray-500 mb-2">
                    // Generate a debounce function
                  </div>
                  <div>
                    <span className="text-purple-400">export</span>{" "}
                    <span className="text-purple-400">function</span>{" "}
                    <span className="text-blue-400">debounce</span>
                    <span className="text-yellow-400">&lt;T&gt;</span>(
                  </div>
                  <div className="pl-4">
                    func: <span className="text-yellow-400">T</span>,
                  </div>
                  <div className="pl-4">
                    wait: <span className="text-yellow-400">number</span>
                  </div>
                  <div>
                    ): <span className="text-yellow-400">T</span> {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">let</span> timeout:{" "}
                    <span className="text-yellow-400">NodeJS.Timeout</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">return</span> ((...args:{" "}
                    <span className="text-yellow-400">any</span>[]) =&gt; {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-400">clearTimeout</span>
                    (timeout);
                  </div>
                  <div className="pl-8">
                    timeout = <span className="text-blue-400">setTimeout</span>
                    (() =&gt; func(...args), wait);
                  </div>
                  <div className="pl-4">
                    {"}"}) <span className="text-purple-400">as</span>{" "}
                    <span className="text-purple-400">any</span>;
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Image Studio */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-[#0B0F19] border border-white/10 overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7f1c33850486?q=80&w=2836&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-300 truncate">
                      "Abstract 3D geometric shapes, neon lighting, dark
                      background, 4k"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {tFeatures("assets_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("assets_title").split(" ")[0]}{" "}
                <span className="text-orange-400">
                  {tFeatures("assets_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("assets_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("assets_point1"),
                  tFeatures("assets_point2"),
                  tFeatures("assets_point3"),
                  tFeatures("assets_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Community Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {tFeatures("community_badge")}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 text-white">
                {tFeatures("community_title").split(" ")[0]}{" "}
                <span className="text-green-400">
                  {tFeatures("community_title").split(" ").slice(1).join(" ")}
                </span>
              </h3>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-8">
                {tFeatures("community_desc")}
              </p>
              <ul className="space-y-3">
                {[
                  tFeatures("community_point1"),
                  tFeatures("community_point2"),
                  tFeatures("community_point3"),
                  tFeatures("community_point4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#F0F6FF]"
                  >
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-l from-green-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-50" />
              <div className="grid grid-cols-2 gap-4 relative">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`rounded-xl bg-[#161B22] border border-white/5 overflow-hidden p-3 hover:-translate-y-1 transition-transform duration-300 ${i === 2 ? "mt-8" : i === 1 ? "mt-8" : ""}`}
                  >
                    <div className="aspect-[4/3] bg-[#0B0F19] rounded-lg mb-3 border border-white/5" />
                    <div className="h-2 w-2/3 bg-white/10 rounded mb-2" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                        <div className="h-1.5 w-8 bg-white/5 rounded" />
                      </div>
                      <div className="h-1.5 w-4 bg-green-500/30 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-32 px-6 bg-[#0B0F19] border-t border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00F5FF]/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/8 text-[#00F5FF] text-xs font-semibold mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]" />
              {tProcess("badge")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight">
              {tProcess("titleLine1").split(" ")[0]}{" "}
              <span className="gradient-text-blue">
                {tProcess("titleLine1").split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="text-[#8B9AB5] max-w-xl mx-auto text-lg">
              {tProcess("description")}
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: tProcess("step1_title"),
                  desc: tProcess("step1_desc"),
                  icon: steps[0].icon,
                },
                {
                  title: tProcess("step2_title"),
                  desc: tProcess("step2_desc"),
                  icon: steps[1].icon,
                },
                {
                  title: tProcess("step3_title"),
                  desc: tProcess("step3_desc"),
                  icon: steps[2].icon,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl glass-card border border-[#00F5FF]/20 flex items-center justify-center group-hover:border-[#00F5FF]/50 group-hover:shadow-[0_0_30px_rgba(0,245,255,0.15)] transition-all duration-300">
                      <span className="text-[#00F5FF] font-black text-2xl">
                        {i + 1}
                      </span>
                    </div>
                    <div className="absolute -inset-1 bg-[#00F5FF]/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                  <div className="mb-3 text-[#00F5FF]">{step.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#8B9AB5] text-sm leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy Section ─────────────────────────── */}
      <section
        id="philosophy"
        className="py-32 px-6 bg-[#0D1117] border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/8 text-[#8A2BE2] text-xs font-semibold mb-8 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2]" />
                {tPhilosophy("badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                {tPhilosophy("titleLine1")} <br />
                <span className="gradient-text-blue">
                  {tPhilosophy("titleLine2")}
                </span>
              </h2>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-6">
                {tPhilosophy("desc1")}
              </p>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-10">
                {tPhilosophy("desc2")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                {philosophyStats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl font-black gradient-text-blue">
                      {stat.value}
                    </span>
                    <span className="text-[#8B9AB5] text-sm mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Abstract visual */}
            <div className="relative flex items-center justify-center h-[500px] w-full max-w-[500px] mx-auto md:mx-0">
              {/* 1. Outer Glow/Shockwave */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/20 to-[#8A2BE2]/20 rounded-full blur-3xl animate-pulse opacity-20" />

              {/* 2. Outer Orbit Track (Dashed) */}
              <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-white/5 animate-[spin_60s_linear_infinite]" />

              {/* 3. Middle Orbit Track (Solid thin) - Reverse */}
              <div className="absolute w-[350px] h-[350px] rounded-full border border-white/10 animate-[spin_40s_linear_infinite_reverse]" />

              {/* 4. Inner Orbit Track (Glowing) */}
              <div className="absolute w-[250px] h-[250px] rounded-full border border-[#00F5FF]/20 shadow-[0_0_15px_rgba(0,245,255,0.1)] animate-[spin_20s_linear_infinite]" />

              {/* 5. Central Logo (Pulse + Float) */}
              <div className="relative z-10 w-32 h-32 rounded-3xl bg-[#0B0F19] border border-[#00F5FF]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.15)] animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-[#8A2BE2]/10 rounded-3xl animate-pulse" />
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                >
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00F5FF" />
                      <stop offset="100%" stopColor="#8A2BE2" />
                    </linearGradient>
                  </defs>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  />
                </svg>
              </div>

              {/* 6. Orbiting Elements */}

              {/* Outer Orbit Items Container (Matches Track 3: 40s reverse) */}
              <div className="absolute w-[350px] h-[350px] animate-[spin_40s_linear_infinite_reverse]">
                {/* Item 1: Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-[#8A2BE2] animate-[spin_40s_linear_infinite] shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                    AI-Powered
                  </div>
                </div>
                {/* Item 2: Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-[#8A2BE2] animate-[spin_40s_linear_infinite] shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                    Dependency-Free
                  </div>
                </div>
              </div>

              {/* Inner Orbit Items Container (Matches Track 4: 20s normal) */}
              <div className="absolute w-[250px] h-[250px] animate-[spin_20s_linear_infinite]">
                {/* Item 1: Right */}
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                  <div className="glass-card px-3 py-1.5 rounded-full text-xs font-mono text-[#00F5FF] animate-[spin_20s_linear_infinite_reverse] shadow-[0_0_10px_rgba(0,245,255,0.3)]">
                    &lt;html&gt;
                  </div>
                </div>
                {/* Item 2: Left */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="glass-card px-3 py-1.5 rounded-full text-xs font-mono text-[#00F5FF] animate-[spin_20s_linear_infinite_reverse] shadow-[0_0_10px_rgba(0,245,255,0.3)]">
                    .css
                  </div>
                </div>
                {/* Item 3: Top (Offset) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="glass-card px-3 py-1.5 rounded-full text-xs font-mono text-yellow-400 animate-[spin_20s_linear_infinite_reverse] shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                    JS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ──────────────────────────── */}
      <section className="py-32 px-6 bg-[#0B0F19] border-t border-white/5 relative overflow-hidden">
        {/* Lightning texture */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00F5FF]/8 via-[#8A2BE2]/8 to-[#00F5FF]/8 rounded-full blur-[100px] animate-lightning-glow pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/8 text-[#00F5FF] text-xs font-semibold mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
            {tCTA("badge")}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            {tCTA("titleLine1")}
            <br />
            <span className="gradient-text-blue">{tCTA("titleLine2")}</span>
          </h2>
          <p className="text-[#8B9AB5] text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            {tCTA("desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <button className="btn-neon px-10 py-4 rounded-xl text-lg font-bold relative overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] animate-electric-pulse">
                      <span>{tCTA("openDashboard")}</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className="btn-neon px-10 py-4 rounded-xl text-lg font-bold relative overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] animate-electric-pulse">
                      <span>{tCTA("startBuildingFree")}</span>
                    </button>
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link href="/login">
                    <button className="px-10 py-4 rounded-xl text-lg font-semibold border border-white/10 bg-white/5 text-[#8B9AB5] hover:text-white hover:border-white/20 transition-all duration-300">
                      {tCTA("signIn")}
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/5 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00F5FF] to-[#8A2BE2] flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B0F19"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-bold text-white">Thunder</span>
          </div>
          <div className="text-[#4A5568] text-sm">{tFooter("copyright")}</div>
          <div className="flex gap-6 text-sm text-[#4A5568]">
            {["privacy", "terms", "twitter", "github"].map((linkKey) => (
              <a
                key={linkKey}
                href="#"
                className="hover:text-[#00F5FF] transition-colors duration-200"
              >
                {tFooter(linkKey as any)}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────── */

// const features = [...]; // Removed feature cards data as it's no longer used

const steps = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    title: "Describe Your Vision",
    description:
      "Type a natural language prompt describing the component you need. Be as specific or as vague as you like.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Thunder Generates",
    description:
      "Our AI instantly produces clean, semantic HTML, CSS, and JavaScript tailored to your exact description.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
    title: "Copy & Ship",
    description:
      "Preview your component live, refine with follow-up prompts, then copy the code and ship it anywhere.",
  },
];

const philosophyStats = [
  { value: "< 3s", label: "Average generation time" },
  { value: "0", label: "Dependencies required" },
  { value: "100%", label: "Code ownership" },
];

const floatingChips = [
  { label: "<html>", style: { top: "10%", left: "5%" } },
  { label: "CSS", style: { top: "15%", right: "8%" } },
  { label: "JS", style: { bottom: "20%", left: "8%" } },
  { label: "AI", style: { bottom: "15%", right: "5%" } },
];

/* ── Feature Card Component (Deprecated) ────────────────────────────── */
// function FeatureCard({
//   icon,
//   iconColor,
//   iconBg,
//   title,
//   description,
//   delay = 0,
// }: {
//   icon: React.ReactNode;
//   iconColor: string;
//   iconBg: string;
//   title: string;
//   description: string;
//   delay?: number;
// }) {
//   return (
//     <div
//       className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col gap-5"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div
//         className={`w-12 h-12 rounded-xl border flex items-center justify-center ${iconBg} ${iconColor}`}
//       >
//         {icon}
//       </div>
//       <div>
//         <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
//         <p className="text-[#8B9AB5] text-sm leading-relaxed">{description}</p>
//       </div>
//     </div>
//   );
// }
