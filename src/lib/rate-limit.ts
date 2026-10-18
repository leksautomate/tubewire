// Brute-force protection for /api/admin/login, backed by the same Upstash
// Redis instance as settings.ts. Fails OPEN only in the sense of "don't
// crash the app" — but until Redis is connected there is NO rate limiting
// at all, which is a real gap; isRateLimitActive() lets the login route
// warn about that explicitly rather than silently being unprotected.

const WINDOW_SECONDS = 15 * 60; // 15 minutes
const MAX_ATTEMPTS = 5;

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis pipeline failed: ${res.status}`);
  return res.json();
}

export function isRateLimitActive(): boolean {
  return redisConfigured();
}

/** Call on every login attempt BEFORE checking the password. */
export async function checkLoginRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  if (!redisConfigured()) return { allowed: true }; // see module note above

  const key = `ratelimit:login:${ip}`;
  try {
    const incrResult = (await redisPipeline([["INCR", key]])) as { result: number }[];
    const attempts = incrResult[0]?.result ?? 0;
    if (attempts === 1) {
      await redisPipeline([["EXPIRE", key, WINDOW_SECONDS]]);
    }
    if (attempts > MAX_ATTEMPTS) {
      const ttlResult = (await redisPipeline([["TTL", key]])) as { result: number }[];
      const ttl = ttlResult[0]?.result ?? WINDOW_SECONDS;
      return { allowed: false, retryAfterSeconds: Math.max(ttl, 1) };
    }
    return { allowed: true };
  } catch {
    // If Redis hiccups, don't lock the admin out entirely — but this is a
    // narrow failure mode (Redis reachable enough to be "configured" but
    // erroring on this call), not the common unconfigured case above.
    return { allowed: true };
  }
}

/** Call after a SUCCESSFUL login to clear the counter for that IP. */
export async function clearLoginRateLimit(ip: string): Promise<void> {
  if (!redisConfigured()) return;
  try {
    await redisPipeline([["DEL", `ratelimit:login:${ip}`]]);
  } catch {
    // non-fatal
  }
}
