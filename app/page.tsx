"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/store/slices/authSlice";

export default function LandingPage() {
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
            AI-Powered Frontend Development
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.05] animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Build stunning UI
            <br />
            <span className="gradient-text-blue">in seconds, not hours.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-[#8B9AB5] mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Describe your component. Thunder generates production-ready HTML,
            CSS, and JS instantly. No frameworks. No bloat. Just pure, clean
            code.
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
                      <span>Open Dashboard →</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/register" className="w-full sm:w-auto">
                    <button className="btn-neon w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold relative overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.25)]">
                      <span>Start Building Free →</span>
                    </button>
                  </Link>
                )}
                <Link
                  href={isLoggedIn ? "/community" : "/login"}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-white/10 bg-white/5 text-[#8B9AB5] hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                    {isLoggedIn ? "Explore Feed" : "View Demo"}
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

      {/* ── Features Section ───────────────────────────── */}
      <section
        id="features"
        className="py-32 px-6 bg-[#0D1117] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/8 text-[#8A2BE2] text-xs font-semibold mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2]" />
              Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text-blue">ship faster</span>
            </h2>
            <p className="text-[#8B9AB5] max-w-2xl mx-auto text-lg">
              From prompt to production-ready code in seconds. Built for
              developers who value speed and quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
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
              Process
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight">
              How <span className="gradient-text-blue">Thunder</span> works
            </h2>
            <p className="text-[#8B9AB5] max-w-xl mx-auto text-lg">
              Three steps from idea to working component.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
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
                    {step.description}
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
                Our Philosophy
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                Code should be{" "}
                <span className="gradient-text-blue">fast, clean,</span>
                <br />
                and yours.
              </h2>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-6">
                We built Thunder because we believe AI should accelerate your
                workflow, not replace your craft. Every component Thunder
                generates is readable, maintainable, and dependency-free.
              </p>
              <p className="text-[#8B9AB5] text-lg leading-relaxed mb-10">
                No black boxes. No vendor lock-in. Just pure, portable code that
                you own completely.
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
            <div className="relative flex items-center justify-center h-80 md:h-auto">
              {/* Outer ring */}
              <div className="absolute w-72 h-72 rounded-full border border-[#00F5FF]/10 animate-spin-slow" />
              <div
                className="absolute w-56 h-56 rounded-full border border-[#8A2BE2]/15"
                style={{ animation: "spin-slow 14s linear infinite reverse" }}
              />
              {/* Center glow */}
              <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#8A2BE2]/20 blur-2xl animate-lightning-glow" />
              {/* Center icon */}
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00F5FF] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_60px_rgba(0,245,255,0.3)] animate-float">
                <svg
                  width="40"
                  height="40"
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
              {/* Floating chips */}
              {floatingChips.map((chip, i) => (
                <div
                  key={i}
                  className="absolute glass-card border border-white/8 px-3 py-1.5 rounded-full text-xs font-mono text-[#00F5FF] animate-float"
                  style={{ ...chip.style, animationDelay: `${i * 0.8}s` }}
                >
                  {chip.label}
                </div>
              ))}
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
            Ready to build?
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Stop designing.
            <br />
            <span className="gradient-text-blue">Start shipping.</span>
          </h2>
          <p className="text-[#8B9AB5] text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers who build faster with Thunder. Free to
            start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <button className="btn-neon px-10 py-4 rounded-xl text-lg font-bold relative overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] animate-electric-pulse">
                      <span>Open Dashboard</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className="btn-neon px-10 py-4 rounded-xl text-lg font-bold relative overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.3)] animate-electric-pulse">
                      <span>Start Building Free</span>
                    </button>
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link href="/login">
                    <button className="px-10 py-4 rounded-xl text-lg font-semibold border border-white/10 bg-white/5 text-[#8B9AB5] hover:text-white hover:border-white/20 transition-all duration-300">
                      Sign In
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
          <div className="text-[#4A5568] text-sm">
            © 2026 Thunder AI. Built for builders.
          </div>
          <div className="flex gap-6 text-sm text-[#4A5568]">
            {["Privacy", "Terms", "Twitter", "GitHub"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-[#00F5FF] transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────── */

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
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
    iconColor: "text-[#00F5FF]",
    iconBg: "bg-[#00F5FF]/10 border-[#00F5FF]/20",
    title: "Instant Generation",
    description:
      "Describe your component in plain English. Our AI understands context and generates clean, semantic code in under 3 seconds.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    iconColor: "text-[#8A2BE2]",
    iconBg: "bg-[#8A2BE2]/10 border-[#8A2BE2]/20",
    title: "Live Preview",
    description:
      "See your changes rendered in real-time in an isolated sandbox. Pixel-perfect accuracy for every component you build.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Clean Export",
    description:
      "Zero dependencies. Copy-paste pure HTML/CSS/JS that works anywhere. No vendor lock-in, no framework requirements.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-400/10 border-yellow-400/20",
    title: "AI Refinement",
    description:
      "Iterate with natural language. Say 'make it darker' or 'add a hover animation' and Thunder refines your component instantly.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
    iconColor: "text-[#00F5FF]",
    iconBg: "bg-[#00F5FF]/10 border-[#00F5FF]/20",
    title: "Multi-Language",
    description:
      "Full control over HTML structure, CSS styling, and JavaScript behavior. Edit each layer independently in the built-in editor.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    iconColor: "text-[#8A2BE2]",
    iconBg: "bg-[#8A2BE2]/10 border-[#8A2BE2]/20",
    title: "Secure & Private",
    description:
      "Your prompts and code are never stored or used for training. What you build stays yours, always.",
  },
];

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

/* ── Feature Card Component ────────────────────────────── */
function FeatureCard({
  icon,
  iconColor,
  iconBg,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <div
      className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col gap-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`w-12 h-12 rounded-xl border flex items-center justify-center ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-[#8B9AB5] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
