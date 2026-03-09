"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const tFooter = useTranslations("Footer");

  return (
    <footer className="py-12 border-t shrink-0 border-white/10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FAFAFA] flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#050505"
              strokeWidth="3"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-black text-xl text-white tracking-widest uppercase display-font">
            Thunder
          </span>
        </div>
        <div className="text-[#52525B] font-mono text-xs tracking-wider">
          {tFooter("copyright")}
        </div>
        <div className="flex gap-8 font-mono text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
          {["privacy", "terms", "twitter", "github"].map((linkKey) => (
            <a
              key={linkKey}
              href="#"
              className="hover:text-[#DFFF00] transition-colors duration-200"
            >
              {tFooter(linkKey as any)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
