"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/modules/Auth/AuthActions";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";

export default function LandingNavbar() {
  const tNav = useTranslations("Navigation");
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505] border-b border-white/10 px-6 h-20 flex items-center justify-between">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 bg-[#FAFAFA] flex items-center justify-center transition-transform group-hover:-rotate-6 shadow-[4px_4px_0_rgba(223,255,0,0.5)]">
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
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500] text-[10px] font-bold font-mono tracking-widest uppercase ml-1">
            BETA
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: tNav("features"), href: "#features", auth: false },
            { label: tNav("howItWorks"), href: "#how-it-works", auth: false },
            { label: tNav("philosophy"), href: "#philosophy", auth: false },
            { label: tNav("community"), href: "/community", auth: false },
            {
              label: tNav("profile"),
              href: user?.username ? `/profile/${user.username}` : "/settings",
              auth: true,
            },
          ].map(({ label, href, auth }) => {
            if (auth && !isLoggedIn) return null;
            const isAnchor = href.startsWith("#");
            const Component = isAnchor ? "a" : Link;
            return (
              <Component
                key={label}
                href={href}
                className="font-mono text-xs font-bold text-[#A1A1AA] uppercase tracking-wider hover:text-[#DFFF00] transition-colors"
              >
                {label}
              </Component>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <LanguageSwitcher />
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <button className="bg-[#DFFF00] text-[#050505] px-5 py-2.5 text-xs font-bold font-mono tracking-widest uppercase hover:bg-white hover:-translate-y-0.5 transition-transform border-2 border-[#050505] shadow-[6px_6px_0_rgba(255,255,255,0.15)]">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block font-mono text-xs font-bold text-white uppercase tracking-wider hover:text-[#DFFF00] transition-colors"
                  >
                    {tNav("login")}
                  </Link>
                  <Link href="/register">
                    <button className="bg-[#FAFAFA] text-[#050505] px-5 py-2.5 text-xs font-bold font-mono tracking-widest uppercase hover:bg-[#DFFF00] hover:-translate-y-0.5 transition-transform border-2 border-[#050505] shadow-[6px_6px_0_rgba(223,255,0,0.4)]">
                      {tNav("getStarted")}
                    </button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
