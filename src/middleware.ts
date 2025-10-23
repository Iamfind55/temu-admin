import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Protected paths for which authentication is required
const protectedPaths = ["/admin"];
const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const userCookie = req.cookies.get("auth_token");
  const localeCookie = req.cookies.get("NEXT_LOCALE");
  const { pathname } = req.nextUrl;

  // Determine locale (fallback to "en" if not set)
  const locale = localeCookie?.value || "en";

  // Skip middleware for certain paths
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const normalizedPathname = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "")
    : pathname;

  // Protect paths
  if (protectedPaths.some((path) => normalizedPathname.startsWith(path))) {
    if (!userCookie) {
      return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
    }
  }

  // Use `next-intl` middleware for locale handling
  // const intlResponse = await intlMiddleware(req); // Await async middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/:locale(en|la)?/:path*", "/admin/:path*"],
};
