import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser, logout as logoutAction } from "@/store/slices/authSlice";

interface DashboardNavbarProps {
  onLogout?: () => void;
  showModeToggle?: boolean;
  mode?: "prompt" | "screenshot";
  onModeChange?: (mode: "prompt" | "screenshot") => void;
}

export default function DashboardNavbar({
  onLogout,
  showModeToggle = false,
  mode,
  onModeChange,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        dispatch(logoutAction());
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="h-14 border-b border-white/5 bg-[#0B0F19]/95 backdrop-blur-xl flex items-center justify-between px-5 shrink-0 z-50">
      {/* Left: Logo + Home Link */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#00F5FF] to-[#8A2BE2] flex items-center justify-center shadow-lg shadow-[#00F5FF]/20 group-hover:shadow-[#00F5FF]/40 transition-all duration-200">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0B0F19"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-white group-hover:text-[#00F5FF] transition-colors duration-200">
            Thunder
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", href: "/dashboard", auth: true },
            { label: "Community", href: "/community", auth: false },
            { label: "Sessions", href: "/sessions", auth: true },
            {
              label: "Profile",
              href: user?.username ? `/profile/${user.username}` : "/settings",
              auth: true,
            },
          ].map(({ label, href, auth }) => {
            if (auth && !isLoggedIn && !isLoading) return null;
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-[#6B7A99] hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Center: Mode Toggle (Optional) */}
      {showModeToggle && onModeChange && (
        <div className="flex bg-[#0D1117] p-1 rounded-xl border border-white/5 gap-1">
          <button
            onClick={() => onModeChange("prompt")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "prompt"
                ? "bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/25 shadow-[0_0_10px_rgba(0,245,255,0.1)]"
                : "text-[#4A5568] hover:text-[#8B9AB5]"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Prompt
          </button>
          <button
            onClick={() => onModeChange("screenshot")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "screenshot"
                ? "bg-[#8A2BE2]/15 text-[#8A2BE2] border border-[#8A2BE2]/25 shadow-[0_0_10px_rgba(138,43,226,0.1)]"
                : "text-[#4A5568] hover:text-[#8B9AB5]"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            Screenshot
          </button>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {!isLoading && (
          <>
            {isLoggedIn ? (
              <>
                <Link
                  href="/settings"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    pathname === "/settings"
                      ? "text-white bg-white/10"
                      : "text-[#6B7A99] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </Link>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00F5FF]/15 bg-[#00F5FF]/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-[#8B9AB5] font-medium">
                    Online
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm text-[#8B9AB5] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white/10 text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-white/20 transition-all"
              >
                Log In
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
