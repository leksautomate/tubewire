// Runtime settings (API keys you paste into /admin) backed by Upstash
// Redis's REST API — a small, narrowly-scoped store (just this one
// database), not an account-wide credential. Falls back to a plain
// process.env value where one exists, so local dev with .env.local
// keeps working without Redis configured at all.
//
// Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to be set
// for settings saved via /admin to actually persist. Until then,
// getSetting() just returns the env var fallback and setSetting() throws
// a clear, catchable error the admin UI surfaces to you.

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

/** Reads a setting from Redis if configured, else falls back to process.env. */
export async function getSetting(key: string): Promise<string | undefined> {
  if (redisConfigured()) {
    try {
      const data = (await redisFetch(`get/settings:${key}`)) as { result: string | null };
      if (data.result) return data.result;
    } catch {
      // fall through to env var fallback below
    }
  }
  return process.env[key];
}

/** Writes a setting to Redis. Throws if Redis isn't configured yet. */
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
    body: value,
  });
}

export function isSettingsStoreConfigured(): boolean {
  return redisConfigured();
}
