import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const useCases = [
  {
    title: "SaaS Dashboards",
    description:
      "Generate complex data tables, charts, and metrics cards with zero friction. Export as complete React components.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <rect x="3" y="3" width="18" height="18" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    color: "#DFFF00",
  },
  {
    title: "Landing Pages",
    description:
      "Build high-converting marketing pages complete with hero sections, pricing tables, and responsive forms.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: "#FF4500",
  },
  {
    title: "Internal Tools",
    description:
      "Connect APIs to generated admin panels instantly. Skip the boilerplate and focus on business logic.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    color: "#FAFAFA",
  },
  {
    title: "Portfolios",
    description:
      "Design unique, brutalist or minimalist personal sites that stand out to recruiters and clients without writing CSS from scratch.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#DFFF00",
  },
];

export default function UseCasesSection() {
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
    <section className="py-16 md:py-24 bg-[#0A0A0A] border-y-2 border-white/10 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10 translate-x-1/3 -translate-y-1/4 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          stroke="#DFFF00"
          strokeWidth="0.5"
        >
          {[...Array(10)].map((_, i) => (
            <circle key={i} cx="50" cy="50" r={i * 5 + 5} />
          ))}
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as any }}
        >
          <div className="inline-block border-2 border-[#FF4500] text-[#FF4500] px-3 py-1 text-[10px] font-bold font-mono tracking-widest uppercase mb-6 shadow-[2px_2px_0_rgba(255,69,0,0.5)]">
            Built For Everything
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#FAFAFA] tracking-tighter max-w-3xl">
            From Prototypes <br />
            <span
              className="text-transparent border-text-white"
              style={{ WebkitTextStroke: "1px #FAFAFA" }}
            >
              to Production
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {useCases.map((useCase, idx) => (
            <motion.div
              variants={itemVariants}
              key={idx}
              className="border-2 border-white/10 bg-[#050505] p-8 group hover:-translate-y-2 transition-transform duration-300 relative"
            >
              {/* Brutalist Shadow Effect */}
              <div
                className="absolute inset-0 border-2 translate-x-3 translate-y-3 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"
                style={{ borderColor: useCase.color }}
              />

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center border-2 bg-black"
                  style={{ borderColor: useCase.color, color: useCase.color }}
                >
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#FAFAFA]">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
