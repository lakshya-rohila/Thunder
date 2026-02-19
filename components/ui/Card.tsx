import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className = "",
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-[#1e212b]/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden
        ${hoverEffect ? "hover:border-white/10 hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 ease-out" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
