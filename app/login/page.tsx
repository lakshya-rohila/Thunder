"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorToast from "@/components/ErrorToast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative z-10 bg-[var(--bg-primary)]">
        {/* Mobile structural background effect */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[var(--neon-purple-dim)] to-transparent pointer-events-none -z-10"></div>

        <div className="w-full max-w-md">
          {/* Mobile Header (Shown only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
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

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
            <p className="text-[var(--text-secondary)] text-base">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
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
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm text-[var(--electric-blue)] hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
              <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
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

          <p className="mt-10 text-center text-[var(--text-secondary)] text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-white font-medium hover:text-[var(--electric-blue)] transition-colors inline-flex items-center"
            >
              Sign up
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
      <ErrorToast message={error} onClose={() => setError(null)} />
    </div>
  );
}
