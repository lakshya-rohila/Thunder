"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function CTASection({
  isLoggedIn,
  isLoading,
}: {
  isLoggedIn: boolean;
  isLoading: boolean;
}) {
  const tCTA = useTranslations("CTA");
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
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as any },
    },
  };

  return (
    <section className="py-24 md:py-40 px-6 bg-[#DFFF00] text-[#050505] border-t border-[#050505] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#050505 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 font-mono border-2 border-[#050505] text-[#050505] text-xs font-bold uppercase tracking-widest mb-10"
        >
          {tCTA("badge")}
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none display-font uppercase"
        >
          {tCTA("titleLine1")}
          <br />
          <span className="italic opacity-80">{tCTA("titleLine2")}</span>
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-[#050505]/70 font-mono text-lg mb-14 max-w-xl mx-auto"
        >
          {tCTA("desc")}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <button className="bg-[#050505] text-[#DFFF00] px-10 py-5 text-xl font-bold font-mono tracking-widest uppercase hover:bg-black hover:-translate-y-1 transition-transform border-[3px] border-[#050505] shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                    {tCTA("openDashboard")}
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-[#050505] text-[#DFFF00] px-10 py-5 text-xl font-bold font-mono tracking-widest uppercase hover:bg-black hover:-translate-y-1 transition-transform border-[3px] border-[#050505] shadow-[8px_8px_0_rgba(0,0,0,0.4)]">
                    {tCTA("startBuildingFree")}
                  </button>
                </Link>
              )}
              {!isLoggedIn && (
                <Link href="/login">
                  <button className="border-[3px] border-[#050505] text-[#050505] px-10 py-5 text-xl font-bold font-mono tracking-widest uppercase hover:bg-[#050505] hover:text-[#DFFF00] transition-colors">
                    {tCTA("signIn")}
                  </button>
                </Link>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
