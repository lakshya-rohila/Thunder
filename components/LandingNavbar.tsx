"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/modules/Auth/AuthActions";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";

import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const tNav = useTranslations("Navigation");
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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

        {/* CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
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
                    className="font-mono text-xs font-bold text-white uppercase tracking-wider hover:text-[#DFFF00] transition-colors"
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 border-2 border-white/20 bg-[#0A0A0A] flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-white transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-5 h-0.5 bg-[#DFFF00] transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 h-[calc(100vh-5rem)] bg-[#050505] z-40 border-t border-white/10 flex flex-col p-6 overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-6">
              <span className="font-mono text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">
                Region
              </span>
              <LanguageSwitcher />
            </div>

            <div className="flex flex-col gap-6 font-mono text-xl font-bold text-[#A1A1AA] uppercase tracking-wider mb-8">
              {[
                { label: tNav("features"), href: "#features", auth: false },
                {
                  label: tNav("howItWorks"),
                  href: "#how-it-works",
                  auth: false,
                },
                { label: tNav("philosophy"), href: "#philosophy", auth: false },
                { label: tNav("community"), href: "/community", auth: false },
                {
                  label: tNav("profile"),
                  href: user?.username
                    ? `/profile/${user.username}`
                    : "/settings",
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#DFFF00] transition-colors border-b border-white/5 pb-4"
                  >
                    <span className="text-[#DFFF00] mr-2">✦</span> {label}
                  </Component>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              {!isLoading && (
                <>
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button className="w-full bg-[#DFFF00] text-[#050505] px-5 py-4 text-base font-bold font-mono tracking-widest uppercase border-2 border-[#050505] shadow-[6px_6px_0_rgba(255,255,255,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                        Dashboard
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <button className="w-full bg-transparent text-white border-2 border-white/20 px-5 py-4 text-base font-bold font-mono tracking-widest uppercase hover:border-white transition-colors">
                          {tNav("login")}
                        </button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <button className="w-full bg-[#FAFAFA] text-[#050505] px-5 py-4 text-base font-bold font-mono tracking-widest uppercase border-2 border-[#050505] shadow-[6px_6px_0_rgba(223,255,0,0.4)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                          {tNav("getStarted")}
                        </button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
