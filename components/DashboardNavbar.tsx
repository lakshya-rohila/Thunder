import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser, logoutUser } from "@/modules/Auth/AuthActions";

interface DashboardNavbarProps {
  onLogout?: () => void;
  showModeToggle?: boolean;
  mode?: "prompt" | "screenshot" | "research" | "image" | "code";
  onModeChange?: (mode: "prompt" | "screenshot" | "research" | "image" | "code") => void;
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
  const [showLowCreditWarning, setShowLowCreditWarning] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Check for low credits
  useEffect(() => {
    if (user?.dailyCredits !== undefined && user.dailyCredits < 20 && user.dailyCredits > 0) {
      // Only show if we haven't shown it this session (or simple state for now)
      // For now, let's show it if it's low, but maybe we can use a dismiss state
      const hasDismissed = localStorage.getItem(`low-credit-dismissed-${new Date().toDateString()}`);
      if (!hasDismissed) {
        setShowLowCreditWarning(true);
      }
    }
  }, [user?.dailyCredits]);

  const dismissWarning = () => {
    setShowLowCreditWarning(false);
    localStorage.setItem(`low-credit-dismissed-${new Date().toDateString()}`, "true");
  };

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await dispatch(logoutUser());
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

        {/* Credits Display */}
        {isLoggedIn && user?.dailyCredits !== undefined && (
             <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border ml-4 mr-4 transition-all duration-300 ${
               user.dailyCredits < 20 
                 ? "bg-red-500/10 border-red-500/30 animate-pulse" 
                 : "bg-white/5 border-white/10"
             }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  user.dailyCredits < 20 ? "bg-red-500" : "bg-emerald-400"
                }`} />
                <span className={`text-xs font-medium ${
                  user.dailyCredits < 20 ? "text-red-400" : "text-emerald-400"
                }`}>
                  {user.dailyCredits} Credits
                </span>
             </div>
        )}
      </div>

      {/* Low Credit Warning Toast/Popup */}
      {showLowCreditWarning && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
          <div className="bg-[#0D1117] border border-red-500/30 rounded-xl shadow-2xl p-4 w-80 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 text-red-400">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="12" r="10"></circle>
                   <line x1="12" y1="8" x2="12" y2="12"></line>
                   <line x1="12" y1="16" x2="12.01" y2="16"></line>
                 </svg>
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-bold text-white mb-1">Low Credits Warning</h4>
                 <p className="text-xs text-gray-400 mb-3">
                   You have <span className="text-red-400 font-bold">{user?.dailyCredits}</span> credits remaining for today. Please use them precisely!
                 </p>
                 <button 
                   onClick={dismissWarning}
                   className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium"
                 >
                   I understand
                 </button>
               </div>
               <button onClick={dismissWarning} className="text-gray-500 hover:text-white">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="18" y1="6" x2="6" y2="18"></line>
                   <line x1="6" y1="6" x2="18" y2="18"></line>
                 </svg>
               </button>
             </div>
          </div>
        </div>
      )}

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
          <button
            onClick={() => onModeChange("research")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "research"
                ? "bg-amber-500/15 text-amber-500 border border-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Research
          </button>
          <button
            onClick={() => onModeChange("image")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "image"
                ? "bg-pink-500/15 text-pink-500 border border-pink-500/25 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
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
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
            Image
          </button>
          <button
            onClick={() => onModeChange("code")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "code"
                ? "bg-cyan-500/15 text-cyan-500 border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
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
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Code
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
