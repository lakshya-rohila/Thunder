"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Thunder removed about 40 hours of boilerplate setup from our agency's workflow. We generate the complex data-tables, style them automatically, and focus entirely on backend logic.",
    author: "Sarah V.",
    role: "Frontend Lead",
  },
  {
    quote:
      "The deep research module alone is worth it. It creates the PRD, and the generator builds the prototype in under 2 minutes. Unbelievable.",
    author: "James T.",
    role: "Product Manager",
  },
  {
    quote:
      "We needed a brutalist component library. Most AI tools output generic rounded garbage. Thunder's styling engine is precise, obedient, and actually understands good design.",
    author: "Elena R.",
    role: "Design Engineer",
  },
];

export default function TestimonialsSection() {
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
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1] as any,
      },
    },
  };

  return (
    <section className="py-20 md:py-32 border-y-2 border-white/10 bg-[#0A0A0A] relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[400px] pointer-events-none opacity-5">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0 50 Q 25 25, 50 50 T 100 50"
            fill="none"
            stroke="#DFFF00"
            strokeWidth="0.5"
          />
          <path
            d="M0 50 Q 25 75, 50 50 T 100 50"
            fill="none"
            stroke="#DFFF00"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as any }}
        >
          <div className="inline-block border-2 border-[#DFFF00] text-[#DFFF00] px-3 py-1 text-[10px] font-bold font-mono tracking-widest uppercase mb-6 shadow-[2px_2px_0_rgba(223,255,0,0.5)]">
            Verified Quality
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase text-[#FAFAFA] tracking-tighter">
            Developers <br />
            <span
              className="text-transparent border-text-white"
              style={{ WebkitTextStroke: "1px #FAFAFA" }}
            >
              Are Talking
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border-2 border-white/10 bg-[#050505] p-8 flex flex-col justify-between group hover:border-white/30 transition-colors"
            >
              <div className="mb-8">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DFFF00"
                  strokeWidth="2"
                  strokeLinecap="square"
                  className="mb-4"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
                <p className="text-[#FAFAFA] font-mono text-sm leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t-2 border-white/10 pt-4 mt-auto flex items-center justify-between">
                <div>
                  <div className="text-[#DFFF00] font-black uppercase text-xs tracking-widest">
                    {t.author}
                  </div>
                  <div className="text-[#A1A1AA] font-mono text-[10px] uppercase tracking-widest">
                    {t.role}
                  </div>
                </div>
                <div className="w-2 h-2 bg-[#FF4500]"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
