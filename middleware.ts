import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret",
);

/**
 * Edge-compatible middleware.
 * Verifies JWT signature/expiry (no DB access — Edge runtime has no Mongoose).
 * Full session DB validation happens inside each route handler via getAuthContext().
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Protect Dashboard routes (accounting for locale prefixes)
  const isProtectedPath =
    pathname.match(/^\/(?:en|hi|sa|ta|ja)\/dashboard/) ||
    pathname.startsWith("/dashboard");
  const isAuthPath =
    pathname.match(/^\/(?:en|hi|sa|ta|ja)\/(login|register)/) ||
    pathname.match(/^\/(login|register)/);

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login (middleware will subsequently add locale prefix)
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify JWT signature and expiry on the Edge
    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      // Invalid or expired token — clear cookie and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthPath) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Token invalid — let them through to login/register
      }
    }
  }

  // Apply next-intl routing
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
