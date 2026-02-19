"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/store/slices/authSlice";

export default function LandingNavbar() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <nav className="fixed top-5 left-0 right-0 z-50 flex justify-center px-6">
      <div
        className="w-full max-w-4xl flex items-center justify-between px-5 h-14 rounded-2xl border border-white/8"
        style={{
          background: "rgba(10, 12, 20, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200"
            style={{
              background: "linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)",
              boxShadow: "0 0 16px rgba(0,245,255,0.25)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-white">
            Thunder
          </span>
          <span
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider"
            style={{
              background: "rgba(0,245,255,0.08)",
              border: "1px solid rgba(0,245,255,0.2)",
              color: "#00F5FF",
            }}
          >
            BETA
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Features", href: "#features", auth: false },
            { label: "How It Works", href: "#how-it-works", auth: false },
            { label: "Philosophy", href: "#philosophy", auth: false },
            { label: "Community", href: "/community", auth: false },
            {
              label: "Profile",
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
                className="group relative px-3.5 py-2 text-[13px] font-medium text-[#6B7A99] hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/4"
              >
                {label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F5FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Component>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <button
                    className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-[13px] font-bold text-black transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, #00F5FF 0%, #00C8FF 100%)",
                      boxShadow:
                        "0 0 20px rgba(0,245,255,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    Go to Dashboard
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[#6B7A99] hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Log in
                  </Link>
                  <Link href="/register">
                    <button
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold text-black transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                      style={{
                        background:
                          "linear-gradient(135deg, #00F5FF 0%, #00C8FF 100%)",
                        boxShadow:
                          "0 0 20px rgba(0,245,255,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      Get Started
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
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
