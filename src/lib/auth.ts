// Minimal session auth for the single-admin settings area. No external
// auth library: just an HMAC-signed cookie, verified against SESSION_SECRET.
// Password itself is never stored in plaintext — only its scrypt hash
// (ADMIN_PASSWORD_HASH, "salt:hash" hex) is kept as an env var.

import { createHmac, timingSafeEqual, scryptSync } from "crypto";

// The __Host- prefix is enforced by browsers: such a cookie is rejected
// outright unless it also has Secure, Path=/, and no Domain attribute —
// which rules out it ever being sent to a sibling subdomain or over
// plain HTTP, even if a future config change tried to relax those.
const COOKIE_NAME = "__Host-tubewire_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours — short-lived on purpose

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set.");
  return s;
}

export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return false; // not configured yet — no login possible
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hashHex, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function createSessionCookieValue(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, sig] = parts;
  const payload = `${role}.${expiresStr}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const sigBuf = Buffer.from(sig, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  return role === "admin" && Date.now() < Number(expiresStr);
}

/** Defense-in-depth against CSRF beyond SameSite=Strict: reject any
 *  state-changing request whose Origin header doesn't match the host
 *  actually being served. A cross-site form or fetch() can't forge this
 *  header. */
export function isTrustedOrigin(req: { headers: Headers; url: string }): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false; // same-origin browser requests always send Origin on POST
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
