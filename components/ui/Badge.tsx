import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "error";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    outline: "border border-slate-700 text-slate-400",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
