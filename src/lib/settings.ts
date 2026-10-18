// Runtime settings (API keys you paste into /admin) backed by Upstash
// Redis's REST API — a small, narrowly-scoped store (just this one
// database), not an account-wide credential. Falls back to a plain
// process.env value where one exists, so local dev with .env.local
// keeps working without Redis configured at all.
//
// Values are encrypted at rest (AES-256-GCM, key derived from
// SESSION_SECRET) before they ever reach Redis, so a raw database dump —
// Upstash console access, a backup leak, a misconfigured ACL — never
// exposes a usable key, only ciphertext.
//
// Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to be set
// for settings saved via /admin to actually persist. Until then,
// getSetting() just returns the env var fallback and setSetting() throws
// a clear, catchable error the admin UI surfaces to you.

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisFetch(path: string, init?: RequestInit): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res = await fetch(`${url}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function encryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  // Derive a fixed 32-byte key from SESSION_SECRET rather than reusing it
  // directly as key material.
  return createHash("sha256").update(`tubewire-settings-encryption:${secret}`).digest();
}

function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((b) => b.toString("base64")).join(".");
}

function decrypt(stored: string): string {
  const [ivB64, tagB64, dataB64] = stored.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

/** Reads a setting from Redis if configured, else falls back to process.env. */
export async function getSetting(key: string): Promise<string | undefined> {
  if (redisConfigured()) {
    try {
      const data = (await redisFetch(`get/settings:${key}`)) as { result: string | null };
      if (data.result) return decrypt(data.result);
    } catch {
      // fall through to env var fallback below
    }
  }
  return process.env[key];
}

/** Writes a setting to Redis, encrypted at rest. Throws if Redis isn't configured yet. */
export async function setSetting(key: string, value: string): Promise<void> {
  if (!redisConfigured()) {
    throw new Error(
      "No settings database connected yet. Add UPSTASH_REDIS_REST_URL and " +
        "UPSTASH_REDIS_REST_TOKEN (see /admin for setup steps) before saving keys here."
    );
  }
  await redisFetch(`set/settings:${key}`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: encrypt(value),
  });
}

export function isSettingsStoreConfigured(): boolean {
  return redisConfigured();
}
