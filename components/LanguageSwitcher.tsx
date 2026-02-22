"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "sa", name: "संस्कृतम्", flag: "🕉️" },
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
        className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 text-[#8B9AB5] hover:text-white text-[13px] font-medium py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer transition-all duration-200"
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-[#0B0F19] text-white"
          >
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none opacity-50">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
