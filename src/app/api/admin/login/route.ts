import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionCookieValue, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
