"use client";

import React, { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is the generated code production-ready?",
    answer:
      "Yes. Thunder outputs highly semantic HTML, robust Vanilla CSS/Tailwind, and functional React components designed for production. We enforce strict styling rules so you don't inherit 'AI junk code'.",
  },
  {
    question: "Do I need to install any dependencies?",
    answer:
      "No. For HTML/CSS/JS, the code runs natively in any browser. For React and Tailwind, our preview engine uses Babel and standalone scripts, but you can copy/paste the output directly into your own Next.js or Vite projects without additional installs.",
  },
  {
    question: "Can I modify the generated code?",
    answer:
      "Absolutely. Thunder features an integrated code editor (Monaco). You can edit the code manually, or use the 'Fix It' chat to ask the AI to refactor specific parts of the component.",
  },
  {
    question: "Is there a dark mode?",
    answer:
      "Thunder features an opinionated Geometric Brutalism theme which is inherently 'Dark Mode' focused. You can instruct the AI generator to output light-themed components if your target project requires it.",
  },
  {
    question: "How does the Deep Research module work?",
    answer:
      "The Deep Research module scrapes the web in real-time, synthezises findings, and provides a structured executive summary, statistics, and detailed markdown analysis with cited sources.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as any },
    },
  };

  return (
    <section className="py-24 bg-[#050505] border-t-2 border-white/10 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as any }}
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase text-[#FAFAFA] tracking-tighter mb-4">
            Frequently Asked <span className="text-[#FF4500]">Questions</span>
          </h2>
          <p className="text-[#A1A1AA] font-mono uppercase tracking-widest text-sm">
            Everything you need to know about Thunder.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                variants={itemVariants}
                key={idx}
                className={`border-2 transition-all duration-300 ${
                  isOpen
                    ? "border-[#DFFF00] bg-[#DFFF00]/5 shadow-[6px_6px_0_rgba(223,255,0,0.3)]"
                    : "border-white/10 bg-[#0A0A0A] hover:border-white/30"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none"
                >
                  <span
                    className={`text-lg font-black uppercase tracking-tight ${isOpen ? "text-[#DFFF00]" : "text-[#FAFAFA]"}`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 flex items-center justify-center border-2 transition-transform duration-300 ${
                      isOpen
                        ? "border-[#DFFF00] text-[#DFFF00] rotate-180"
                        : "border-white/20 text-[#FAFAFA]"
                    }`}
                  >
                    {isOpen ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="px-6 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        paddingBottom: 24,
                        paddingTop: 8,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        paddingBottom: 0,
                        paddingTop: 0,
                      }}
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] as any }}
                    >
                      <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed border-l-2 border-[#DFFF00] pl-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
