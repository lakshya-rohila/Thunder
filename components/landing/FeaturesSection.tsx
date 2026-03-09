"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function FeaturesSection() {
  const tFeatures = useTranslations("Features");
  const reduceMotion = useReducedMotion();

  const elementVariants = {
    hidden: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.95,
      y: reduceMotion ? 0 : 20,
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as any },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section
      id="features"
      className="py-20 md:py-32 px-6 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DFFF00]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF4500]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-40 relative z-10">
        {/* Instant UI Generation */}
        <motion.div
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={elementVariants}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute -inset-1 bg-[#DFFF00]/10 blur-xl opacity-60" />
            <div className="relative tech-card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#DFFF00]/20 bg-[#050505]">
                <div className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">
                  prompt_engine.sh
                </div>
              </div>
              <div className="p-6 font-mono text-sm space-y-4 bg-[#0A0A0A]">
                <div className="flex gap-2 text-[#52525B]">
                  <span>&gt;</span>{" "}
                  <span className="text-[#A1A1AA]">
                    Initializing sequence...
                  </span>
                </div>
                <div className="flex gap-2 text-[#52525B]">
                  <span>&gt;</span>{" "}
                  <span className="text-white">
                    "Create a bold geometric pricing card with 3 tiers."
                  </span>
                </div>
                <div className="border-l border-[#DFFF00] pl-4 py-2 my-4 space-y-2">
                  <div className="text-[#DFFF00]">
                    Generating layout_nodes{" "}
                    <span className="animate-pulse">...</span> OK
                  </div>
                  <div className="text-white">
                    Injecting high-contrast typography{" "}
                    <span className="animate-pulse">...</span> OK
                  </div>
                  <div className="text-[#FF4500]">
                    Applying spatial interactions{" "}
                    <span className="animate-pulse">...</span> OK
                  </div>
                </div>
                <div className="text-[#52525B] mt-4">
                  Sequence complete in 2.4s
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={elementVariants} className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono bg-[#DFFF00] text-[#050505] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 bg-[#050505] animate-pulse" />
              {tFeatures("instantGen_badge")}
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight display-font uppercase">
              {tFeatures("instantGen_title").split(" ")[0]}{" "}
              <span className="text-[#DFFF00] italic">
                {tFeatures("instantGen_title").split(" ").slice(1).join(" ")}
              </span>
            </h3>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
              {tFeatures("instantGen_desc")}
            </p>
            <ul className="space-y-4 font-mono text-sm text-[#FAFAFA]">
              {[
                tFeatures("instantGen_point1"),
                tFeatures("instantGen_point2"),
                tFeatures("instantGen_point3"),
                tFeatures("instantGen_point4"),
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="text-[#DFFF00] shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Screenshot to Code */}
        <motion.div
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={elementVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono bg-[#FF4500] text-white text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 bg-white animate-pulse" />
              {tFeatures("screenshot_badge")}
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight display-font uppercase">
              {tFeatures("screenshot_title").split(" ")[0]}{" "}
              <span className="text-[#FF4500] italic">
                {tFeatures("screenshot_title").split(" ").slice(1).join(" ")}
              </span>
            </h3>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
              {tFeatures("screenshot_desc")}
            </p>
            <ul className="space-y-4 font-mono text-sm text-[#FAFAFA]">
              {[
                tFeatures("screenshot_point1"),
                tFeatures("screenshot_point2"),
                tFeatures("screenshot_point3"),
                tFeatures("screenshot_point4"),
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="text-[#FF4500] shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={elementVariants} className="relative">
            <div className="absolute -inset-1 bg-[#FF4500]/10 blur-xl opacity-60" />
            <div className="relative tech-card p-10 flex flex-col items-center justify-center min-h-[350px] border-dashed border-2 border-[#FF4500]/30 hover:border-[#FF4500] transition-colors">
              <div className="w-16 h-16 bg-[#FF4500] text-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,69,0,0.5)] animate-float">
                <svg
                  className="w-8 h-8"
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
              <h4 className="text-xl font-bold text-white mb-2 display-font tracking-wide uppercase">
                VISION INGESTION
              </h4>
              <p className="text-sm font-mono text-[#A1A1AA] uppercase tracking-widest">
                Drop.Image.Here
              </p>

              <div className="mt-8 w-full max-w-xs border border-white/10 p-3 flex items-center gap-4 bg-[#050505]">
                <div className="w-8 h-8 bg-[#FF4500]/20 border border-[#FF4500]/50 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-1.5 w-full bg-white/20" />
                  <div className="h-1.5 w-1/2 bg-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
