"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorToast from "@/components/ErrorToast";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic username validation
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      setError(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto login or redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-gray-100 p-4">
      <div className="w-full max-w-md bg-[#1e212b] rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          Create Account
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Join the builder community
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/ /g, "-"))
              }
              className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="johndoe"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Letters, numbers, hyphens, and underscores only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
      <ErrorToast message={error} onClose={() => setError(null)} />
    </div>
  );
}
