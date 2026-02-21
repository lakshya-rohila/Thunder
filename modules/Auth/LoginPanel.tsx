"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorToast from "@/components/ErrorToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "./AuthActions";
import { setError } from "./AuthSlice";

export default function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setError(null));

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Panel: Branding / Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-secondary)] flex-col justify-between p-12 lg:p-20 items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--electric-blue)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-lightning-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 grid-bg opacity-30"></div>
        </div>

        {/* Floating Card Content */}
        <div className="relative z-10 w-full max-w-lg glass-card rounded-2xl p-10 animate-float border-[var(--border-subtle)]">
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
            The power to build <br />
            <span className="gradient-text-blue">faster than ever.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
            Join thousands of developers building the next generation of
            applications with our cutting-edge infrastructure.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-[var(--bg-secondary)] bg-gray-800 flex items-center justify-center overflow-hidden z-[${5 - i}]`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm var(--text-muted) font-medium">
              Over 10,000+ builders
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[var(--text-muted)] text-sm">
          © 2024 Thunder Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-[var(--border-subtle)] placeholder-gray-500 text-white rounded-xl bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-[var(--border-subtle)] placeholder-gray-500 text-white rounded-xl bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--electric-blue)] focus:ring-[var(--electric-blue)] border-gray-600 rounded bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[var(--text-secondary)]"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[var(--electric-blue)] hover:text-[var(--neon-purple)] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-purple)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--electric-blue)] focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--electric-blue)] hover:text-[var(--neon-purple)] transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ErrorToast
        message={error}
        onClose={() => dispatch(setError(null))}
      />
    </div>
  );
}
