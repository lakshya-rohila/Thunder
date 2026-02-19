import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    ghost:
      "bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground",
    outline:
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  // Map custom CSS variables to Tailwind classes
  // Note: For this to work perfectly, we'd ideally update tailwind.config.js to extend colors using var(--primary), etc.
  // Since we are using standard Tailwind utility classes in globals.css @layer utilities or assuming Tailwind configuration,
  // we will map 'primary' to 'indigo-600' etc. manually here IF the variables aren't automatically picked up by Tailwind v4 (or v3 jit).
  // However, the provided globals.css defines CSS variables. To use them in utility classes like `bg-primary`,
  // we need to ensure Tailwind knows about them.
  // For safety/simplicity without touching tailwind.config, I'll use direct Tailwind color classes that match the theme.

  const tailwindVariants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20",
    secondary:
      "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    outline:
      "border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
    danger:
      "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
  };

  return (
    <button
      className={`${baseStyles} ${tailwindVariants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
