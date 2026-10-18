import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting, isSettingsStoreConfigured } from "@/lib/settings";
import { isTrustedOrigin } from "@/lib/auth";

const MANAGED_KEYS = ["YOUTUBE_API_KEY", "ANTHROPIC_API_KEY"] as const;

function mask(value: string | undefined): { configured: boolean; preview: string | null } {
  if (!value) return { configured: false, preview: null };
  return { configured: true, preview: `${value.slice(0, 4)}…${value.slice(-4)}` };
}

export async function GET() {
  const entries = await Promise.all(
    MANAGED_KEYS.map(async (key) => [key, mask(await getSetting(key))] as const)
  );
  const res = NextResponse.json({
    storeConfigured: isSettingsStoreConfigured(),
    keys: Object.fromEntries(entries),
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: "Rejected: cross-origin request" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, string>;
  const updates = Object.entries(body).filter(([key, value]) =>
    (MANAGED_KEYS as readonly string[]).includes(key) && typeof value === "string" && value.trim()
  );
  if (updates.length === 0) {
    return NextResponse.json({ error: "Nothing to save" }, { status: 400 });
  }

  try {
    for (const [key, value] of updates) {
      await setSetting(key, value.trim());
    }
    const res = NextResponse.json({ ok: true, saved: updates.map(([k]) => k) });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
