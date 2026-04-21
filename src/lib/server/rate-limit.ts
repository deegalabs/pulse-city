type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

let ops = 0;

function maybeCleanup(now: number) {
  ops += 1;
  if (ops % 200 !== 0) return;

  for (const [key, value] of buckets.entries()) {
    if (value.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  maybeCleanup(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      ok: true,
      limit: config.max,
      remaining: Math.max(config.max - 1, 0),
      retryAfterSec: 0,
      resetAt,
    };
  }

  existing.count += 1;
  const remaining = Math.max(config.max - existing.count, 0);
  const retryAfterSec = Math.max(Math.ceil((existing.resetAt - now) / 1000), 1);

  if (existing.count > config.max) {
    return {
      ok: false,
      limit: config.max,
      remaining: 0,
      retryAfterSec,
      resetAt: existing.resetAt,
    };
  }

  return {
    ok: true,
    limit: config.max,
    remaining,
    retryAfterSec: 0,
    resetAt: existing.resetAt,
  };
}
