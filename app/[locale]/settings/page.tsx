"use client";

import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Loader from "@/components/Loader";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser, logoutUser } from "@/modules/Auth/AuthActions";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user) {
      setName(user.name);
      setUsername(user.username || "");
      setLocalLoading(false);
    }
  }, [user, isLoggedIn, isLoading, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      // Refresh Redux user state
      dispatch(fetchUser());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || localLoading) {
    return (
      <main className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] flex flex-col">
        <DashboardNavbar onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F0F6FF] font-sans flex flex-col">
      <DashboardNavbar onLogout={handleLogout} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-5 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold bg-linear-to-r from-white to-[#8B9AB5] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-[#6B7A99] mt-2">{t("desc")}</p>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-[#8B9AB5] ml-1"
              >
                {t("fullName")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("fullNamePh")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#00F5FF]/50 focus:ring-1 focus:ring-[#00F5FF]/50 transition-all text-white"
                required
              />
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-[#8B9AB5] ml-1 flex items-center justify-between"
              >
                <span>{t("username")}</span>
                {username && (
                  <span className="text-[10px] text-[#00F5FF]/50 font-normal">
                    thunder.app/profile/{username}
                  </span>
                )}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/ /g, "-"))
                }
                placeholder="Ex. johndoe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#00F5FF]/50 focus:ring-1 focus:ring-[#00F5FF]/50 transition-all text-white font-mono text-sm"
              />
              <p className="text-[10px] text-[#4A5568] ml-1">
                {t("usernameHint")}
              </p>
            </div>

            {/* Email Field (Disabled) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#8B9AB5] ml-1">
                {t("email")}
              </label>
              <div className="w-full bg-white/2 border border-white/5 rounded-2xl px-5 py-4 text-[#4A5568] flex items-center justify-between">
                <span>{user?.email}</span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {t("locked")}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 text-sm">
              {t("successMsg")}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-[#00F5FF] to-[#8A2BE2] text-[#0B0F19] font-bold px-10 py-4 rounded-2xl shadow-xl shadow-[#00F5FF]/20 hover:shadow-[#00F5FF]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
            >
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </form>

        <div className="mt-16 pt-10 border-t border-white/5">
          <h2 className="text-lg font-bold text-red-400/80 mb-4">
            {t("dangerZone")}
          </h2>
          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-white mb-1">
                {t("deleteAccount")}
              </h3>
              <p className="text-sm text-[#8B9AB5]">{t("deleteWarning")}</p>
            </div>
            <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition-all duration-300 whitespace-nowrap">
              {t("deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
