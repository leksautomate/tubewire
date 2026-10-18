import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionCookieValue,
  COOKIE_NAME,
  isTrustedOrigin,
} from "@/lib/auth";
import { checkLoginRateLimit, clearLoginRateLimit, isRateLimitActive } from "@/lib/rate-limit";

function clientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for; fall back to a constant bucket if absent
  // (e.g. local dev) rather than letting rate limiting be bypassed by
  // omitting the header — better to over-group than not limit at all.
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: "Rejected: cross-origin request" }, { status: 403 });
  }

  const ip = clientIp(req);
  const limit = await checkLoginRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds ?? 900) } }
    );
  }

  const { password } = (await req.json()) as { password?: string };
  if (!password || !verifyPassword(password)) {
    return NextResponse.json(
      {
        error: "Wrong password",
        ...(isRateLimitActive() ? {} : { warning: "Rate limiting is off until a settings database is connected — see /admin." }),
      },
      { status: 401 }
    );
  }

  await clearLoginRateLimit(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12, // matches SESSION_TTL_MS in auth.ts
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function DELETE(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: "Rejected: cross-origin request" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
