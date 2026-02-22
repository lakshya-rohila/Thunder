import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "hi", "sa", "ta", "ja"],
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
