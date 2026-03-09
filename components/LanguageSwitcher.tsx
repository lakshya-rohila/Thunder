"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";

const languages = [
  { code: "en", name: "ENG", flag: "🇺🇸" },
  { code: "ja", name: "JPN", flag: "🇯🇵" },
  { code: "hi", name: "HIN", flag: "🇮🇳" },
  { code: "ta", name: "TAM", flag: "🇮🇳" },
  { code: "sa", name: "SAN", flag: "🕉️" },
  { code: "fr", name: "FRA", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      // @ts-ignore - The router strictly expects pathnames to be verified against the routing table, but since we are preserving the pathname, we can bypass this check.
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className={`relative inline-flex items-center ${isPending ? "opacity-50" : ""}`}
    >
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="appearance-none bg-[#050505] border border-white/20 hover:border-[#DFFF00] text-white text-xs font-mono font-bold tracking-widest uppercase py-2 pl-3 pr-8 outline-none cursor-pointer transition-colors duration-200"
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-[#050505] text-white font-mono"
          >
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-white">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-3 h-3"
          strokeWidth="3"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
