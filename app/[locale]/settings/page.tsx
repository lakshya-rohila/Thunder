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
      <main className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col">
        <DashboardNavbar onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans flex flex-col">
      <DashboardNavbar onLogout={handleLogout} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-[#A1A1AA] font-mono text-sm max-w-2xl mt-2">
            {t("desc")}
          </p>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-[#000000] border-2 border-white/10 p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#71717A] ml-1"
              >
                {t("fullName")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("fullNamePh")}
                className="w-full bg-[#050505] border-2 border-white/10 px-5 py-4 focus:outline-none focus:border-[#DFFF00] transition-all text-white font-mono"
                required
              />
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#71717A] ml-1 flex items-center justify-between"
              >
                <span>{t("username")}</span>
                {username && (
                  <span className="text-[#DFFF00]">
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
                className="w-full bg-[#050505] border-2 border-white/10 px-5 py-4 focus:outline-none focus:border-[#DFFF00] transition-all text-white font-mono text-sm"
              />
              <p className="text-[10px] text-[#A1A1AA] font-mono ml-1">
                {t("usernameHint")}
              </p>
            </div>

            {/* Email Field (Disabled) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#71717A] ml-1">
                {t("email")}
              </label>
              <div className="w-full bg-[#0A0A0A] border-2 border-white/5 px-5 py-4 text-[#71717A] font-mono flex items-center justify-between">
                <span>{user?.email}</span>
                <span className="text-[10px] bg-[#050505] border border-white/10 px-2 py-1 uppercase tracking-widest font-mono text-[#FAFAFA]">
                  {t("locked")}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-[#FF4500]/10 border-2 border-[#FF4500] p-4 text-[#FF4500] text-xs font-mono tracking-widest uppercase font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#DFFF00]/10 border-2 border-[#DFFF00] p-4 text-[#DFFF00] text-xs font-mono tracking-widest uppercase font-bold">
              {t("successMsg")}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#DFFF00] text-[#050505] font-black uppercase tracking-widest px-10 py-4 shadow-[6px_6px_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all border-2 border-transparent disabled:opacity-50"
            >
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </form>

        <div className="mt-16 pt-10 border-t border-dashed border-white/20">
          <h2 className="text-lg font-black tracking-widest uppercase text-[#FF4500] mb-6">
            {t("dangerZone")}
          </h2>
          <div className="bg-[#050505] border-2 border-[#FF4500]/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-black uppercase tracking-widest text-[#FF4500] mb-2">
                {t("deleteAccount")}
              </h3>
              <p className="text-sm font-mono text-[#A1A1AA]">
                {t("deleteWarning")}
              </p>
            </div>
            <button className="px-6 py-3 border-2 border-[#FF4500] text-[#FF4500] font-black uppercase tracking-widest hover:bg-[#FF4500] hover:text-[#050505] transition-all whitespace-nowrap">
              {t("deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
