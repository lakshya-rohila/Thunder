"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export default function PhilosophySection() {
  const tPhilosophy = useTranslations("Philosophy");

  const philosophyStats = [
    { value: "< 3s", label: "AVERAGE TTI" },
    { value: "0", label: "DEPENDENCIES" },
    { value: "100%", label: "OWNERSHIP" },
  ];

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
    <section
      id="philosophy"
      className="py-32 px-6 bg-[#0A0A0A] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 font-mono border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8"
            >
              {tPhilosophy("badge")}
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight display-font uppercase"
            >
              {tPhilosophy("titleLine1")} <br />
              <span className="text-[#A1A1AA] italic">
                {tPhilosophy("titleLine2")}
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[#FAFAFA] text-lg leading-relaxed mb-6 border-l-[3px] border-[#FF4500] pl-6"
            >
              {tPhilosophy("desc1")}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-[#A1A1AA] text-lg leading-relaxed mb-12 pl-6 pt-2"
            >
              {tPhilosophy("desc2")}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono"
            >
              {philosophyStats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-3xl font-black text-[#DFFF00]">
                    {stat.value}
                  </span>
                  <span className="text-[#52525B] text-xs font-bold tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative flex items-center justify-center h-[500px] w-full max-w-[500px] mx-auto md:mx-0">
            {/* Geometric abstract structural visualization */}
            <div className="absolute w-[400px] h-[400px] border border-white/10 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[300px] h-[300px] border-2 border-[#DFFF00]/30 rotate-45" />
            <div className="absolute w-[200px] h-[200px] border border-[#FF4500]/50 animate-[spin_40s_linear_infinite_reverse]">
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF4500]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF4500]" />
            </div>

            <div className="relative z-10 w-32 h-32 bg-[#050505] border-2 border-white flex items-center justify-center shadow-[15px_15px_0_rgba(223,255,0,1)] animate-float">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                />
              </svg>
            </div>

            <motion.div
              className="absolute top-10 right-10 bg-[#0A0A0A] border border-white/20 p-2 font-mono text-xs text-[#DFFF00]"
              initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              [SYS_OPT: OK]
            </motion.div>
            <motion.div
              className="absolute bottom-10 left-10 bg-[#0A0A0A] border border-white/20 p-2 font-mono text-xs text-[#FF4500]"
              initial={{ opacity: 0, x: reduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              [RENDER: OK]
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
