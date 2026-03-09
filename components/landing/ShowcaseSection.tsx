"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ShowcaseSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16 md:mb-24 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as any }}
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase text-[#FAFAFA] tracking-tighter mb-6">
            The Difference <br /> Is{" "}
            <span className="text-[#FF4500]">Visible.</span>
          </h2>
          <p className="text-[#A1A1AA] font-mono uppercase tracking-widest max-w-2xl text-sm leading-relaxed">
            Stop generating the same boring, rounded, low-contrast components.
            Get code that looks like it belongs in the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Average Output */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: reduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] as any }}
          >
            <div className="mb-4 flex items-center justify-between border-b-2 border-white/10 pb-4">
              <span className="text-[#A1A1AA] font-mono text-xs uppercase tracking-widest">
                Typical AI Output
              </span>
              <span className="text-red-500 font-black text-xl leading-none">
                ×
              </span>
            </div>
            <div className="bg-gray-100 rounded-3xl p-8 h-full flex flex-col justify-center items-center shadow-lg">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="h-32 bg-indigo-50 rounded-xl mb-4 w-full"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Login to Continue
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Please enter your details below.
                </p>
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm mb-3 outline-none"
                  disabled
                />
                <button
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold text-sm shadow-md"
                  disabled
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>

          {/* Thunder Output */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] as any }}
          >
            <div className="mb-4 flex items-center justify-between border-b-2 border-white/10 pb-4">
              <span className="text-[#DFFF00] font-mono text-xs uppercase tracking-widest font-bold">
                Thunder Output
              </span>
              <span className="text-[#DFFF00] font-black text-xl leading-none">
                ✓
              </span>
            </div>
            <div
              className="border-2 border-white/20 bg-[#0A0A0A] p-8 h-full flex flex-col justify-center items-center"
              style={{
                backgroundImage:
                  "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "center center",
              }}
            >
              <div className="bg-[#050505] border-2 border-white/20 p-8 w-full max-w-sm shadow-[6px_6px_0_rgba(255,69,0,0.8)] relative group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>

                <div className="h-1 w-12 bg-[#FF4500] mb-6"></div>
                <h3 className="text-2xl font-black text-[#FAFAFA] uppercase tracking-tight mb-2">
                  System Auth
                </h3>
                <p className="text-[#A1A1AA] font-mono text-[10px] uppercase tracking-widest mb-8">
                  Access restricted sector
                </p>

                <input
                  type="text"
                  placeholder="ID / EMAIL"
                  className="w-full bg-transparent border-2 border-white/10 p-3 text-[#FAFAFA] font-mono text-xs uppercase tracking-widest placeholder:text-white/20 mb-4 focus:border-[#DFFF00] outline-none transition-colors"
                  disabled
                />

                <button
                  className="w-full bg-[#DFFF00] text-[#050505] border-2 border-transparent py-3 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                  disabled
                >
                  Execute Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
