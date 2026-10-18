import { NextRequest, NextResponse } from "next/server";
import { isValidSession, COOKIE_NAME } from "@/lib/auth";

// auth.ts uses Node's `crypto` (scryptSync etc.), which the default Edge
// middleware runtime doesn't support — run this on the Node runtime instead.
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const session = req.cookies.get(COOKIE_NAME)?.value;
  if (!isValidSession(session)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
