"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroSection({
  isLoggedIn,
  isLoading,
}: {
  isLoggedIn: boolean;
  isLoading: boolean;
}) {
  const tHero = useTranslations("Hero");
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1] as any,
      },
    },
  };

  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden">
      {/* Background with geometric styling */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(223, 255, 0, 0.15), transparent 80%), #050505",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />

      <motion.div
        className="max-w-6xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#DFFF00]/30 bg-[#0A0A0A] text-[#DFFF00] text-xs font-mono font-bold mb-8 uppercase tracking-widest"
          variants={itemVariants}
        >
          <span className="w-2 h-2 bg-[#DFFF00] animate-pulse" />
          {tHero("badge")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] display-font uppercase"
          variants={itemVariants}
        >
          {tHero("titleLine1")}
          <br />
          <span className="gradient-text-accent italic">
            {tHero("titleLine2")}
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl text-[#A1A1AA] mb-12 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          {tHero("description")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="btn-primary w-full sm:w-auto px-8 py-4 text-base tracking-wide uppercase">
                    <span>{tHero("openDashboard")}</span>
                  </button>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <button className="btn-primary w-full sm:w-auto px-8 py-4 text-base tracking-wide uppercase">
                    <span>{tHero("startBuildingFree")}</span>
                  </button>
                </Link>
              )}
              <Link
                href={isLoggedIn ? "/community" : "/login"}
                className="w-full sm:w-auto"
              >
                <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-base uppercase tracking-wide">
                  {isLoggedIn ? tHero("exploreFeed") : tHero("viewDemo")}
                </button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Hero Preview Card */}
        <motion.div className="mt-24" variants={itemVariants}>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#DFFF00]/20 via-[#FF4500]/20 to-[#DFFF00]/20 blur-xl opacity-40 animate-pulse" />
            <div className="relative tech-card border border-[#DFFF00]/20 overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-[#DFFF00]/10 bg-[#0A0A0A]">
                <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest border border-white/10 px-2 py-0.5">
                  DEV_ENV
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white/20" />
                  <div className="w-2 h-2 bg-white/20" />
                  <div className="w-2 h-2 bg-[#DFFF00]/60" />
                </div>
              </div>
              {/* Mock editor layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 h-auto md:h-80 text-left">
                {/* Left: Chat panel */}
                <div className="col-span-4 border-r border-[#DFFF00]/10 p-5 flex flex-col gap-4 bg-[#050505]">
                  <div className="h-6 w-24 bg-[#DFFF00]/10 border border-[#DFFF00]/30" />
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-white/5" />
                    <div className="h-10 w-4/5 bg-[#DFFF00]/10 border-l-2 border-[#DFFF00]" />
                    <div className="h-10 w-full bg-white/5" />
                  </div>
                  <div className="mt-auto h-12 w-full bg-gradient-to-r from-[#DFFF00]/20 to-transparent border border-[#DFFF00]/30 flex items-center px-4 gap-3">
                    <div className="w-2 h-2 bg-[#DFFF00] animate-pulse" />
                    <div className="h-2 w-32 bg-white/30" />
                  </div>
                </div>
                {/* Right: Preview */}
                <div className="col-span-8 p-6 md:p-8 flex flex-col gap-4 bg-[#0A0A0A]">
                  <div className="flex gap-4 border-b border-white/10 pb-2">
                    {["app.tsx", "styles.css", "logic.js"].map((tab, i) => (
                      <div
                        key={tab}
                        className={`text-xs font-mono uppercase tracking-wider ${i === 0 ? "text-[#DFFF00] border-b-2 border-[#DFFF00] pb-2 -mb-[9px]" : "text-[#52525B]"}`}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 font-mono text-sm shadow-inner p-4 bg-[#050505] leading-relaxed border border-white/5 text-left">
                    <div className="text-[#DFFF00]">
                      export default function App() {"{"}
                    </div>
                    <div className="pl-4 text-[#FAFAFA]">return (</div>
                    <div className="pl-8 text-[#A1A1AA]">
                      &lt;div className="h-screen bg-black"&gt;
                    </div>
                    <div className="pl-12 text-[#FF4500]">
                      &lt;Hero title="Next Level" /&gt;
                    </div>
                    <div className="pl-8 text-[#A1A1AA]">&lt;/div&gt;</div>
                    <div className="pl-4 text-[#FAFAFA]">)</div>
                    <div className="text-[#DFFF00]">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
