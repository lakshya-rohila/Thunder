"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function HowItWorksSection() {
  const tProcess = useTranslations("Process");

  const steps = [
    {
      step: "01",
      title: tProcess("step1_title"),
      desc: tProcess("step1_desc"),
    },
    {
      step: "02",
      title: tProcess("step2_title"),
      desc: tProcess("step2_desc"),
    },
    {
      step: "03",
      title: tProcess("step3_title"),
      desc: tProcess("step3_desc"),
    },
  ];

  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section
      id="how-it-works"
      className="py-32 px-6 bg-[#050505] border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-px bg-white/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as any }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 font-mono bg-white text-black text-xs font-bold uppercase tracking-widest mb-6">
            {tProcess("badge")}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight display-font uppercase">
            {tProcess("titleLine1").split(" ")[0]}{" "}
            <span className="text-[#A1A1AA] italic">
              {tProcess("titleLine1").split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-lg">
            {tProcess("description")}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-12 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-[#DFFF00]/20" />

          {steps.map((step, i) => (
            <motion.div
              variants={itemVariants}
              key={i}
              className="flex flex-col items-center group relative mt-4 md:mt-0"
            >
              <div className="w-20 h-20 bg-[#0A0A0A] border-2 border-[#DFFF00] flex items-center justify-center font-mono text-2xl font-bold text-[#DFFF00] mb-8 relative group-hover:bg-[#DFFF00] group-hover:text-black transition-colors duration-300 z-10 shadow-[0_0_20px_rgba(223,255,0,0.15)]">
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 display-font tracking-wide uppercase text-center">
                {step.title}
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs text-center md:text-left md:border-l-2 md:border-[#52525B] md:pl-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
