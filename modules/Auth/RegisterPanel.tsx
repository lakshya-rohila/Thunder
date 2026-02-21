"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "./AuthActions";
import { setError } from "./AuthSlice";
import ErrorToast from "@/components/ErrorToast";

export default function RegisterPanel() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useAppDispatch();
  const { isLoading: loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setError(null));

    // Basic username validation
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      dispatch(setError(
        "Username can only contain letters, numbers, underscores, and hyphens",
      ));
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({ name, username, email, password }));
      
      if (registerUser.fulfilled.match(resultAction)) {
        // Registration successful
        router.push("/login");
      }
      // If rejected, error is handled in slice and displayed via selector
    } catch (err: any) {
      // Should not be reached if handled by thunk, but just in case
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Panel: Branding / Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-secondary)] flex-col justify-between p-12 lg:p-20 items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 shimmer opacity-20"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--electric-blue)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-lightning-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 grid-bg opacity-30"></div>
        </div>

        {/* Floating Card Content */}
        <div
          className="relative z-10 w-full max-w-lg glass-card rounded-2xl p-10 animate-float border-[var(--border-subtle)]"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--electric-blue)] to-[var(--neon-purple)] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Thunder
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Design, code, and ship <br />
            <span className="gradient-text-blue">without limits.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
            Create an account to join the builder community. Access premier
            tools, connect with other developers, and scale your applications
            effortlessly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <svg
                className="w-5 h-5 text-[var(--electric-blue)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited projects and workspaces
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <svg
                className="w-5 h-5 text-[var(--electric-blue)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Premium community access
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <svg
                className="w-5 h-5 text-[var(--electric-blue)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Advanced analytics and reporting
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative z-10 bg-[var(--bg-primary)]">
        {/* Mobile structural background effect */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[var(--electric-blue-dim)] to-transparent pointer-events-none -z-10"></div>

        <div className="w-full max-w-md">
          {/* Mobile Header (Shown only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--electric-blue)] to-[var(--neon-purple)] flex items-center justify-center shadow-[0_0_10px_rgba(0,245,255,0.3)]">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Thunder
            </span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create an account
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              Start building your next big idea today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/ /g, "-"))
                  }
                  className="w-full bg-[var(--color-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all placeholder-gray-500"
                  placeholder="johndoe"
                />
                <p className="text-[10px] text-[var(--text-muted)] absolute mt-0.5">
                  Letters, numbers, hyphens, and underscores only.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all placeholder-gray-500"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--electric-blue)] focus:ring-1 focus:ring-[var(--electric-blue)] transition-all placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 group"
            >
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && (
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[var(--text-secondary)] text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-medium hover:text-[var(--electric-blue)] transition-colors inline-flex items-center"
            >
              Sign in
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </p>
        </div>
      </div>
      <ErrorToast
        message={error}
        onClose={() => dispatch(setError(null))}
      />
    </div>
  );
}
