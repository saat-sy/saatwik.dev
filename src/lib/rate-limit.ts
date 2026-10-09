// A fixed-window limiter, keyed by client. Counts live in the memory of one server
// instance, so the limit is best-effort: each instance counts on its own.

export const RATE_LIMIT = { limit: 60, windowSeconds: 60 } as const;

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  reset: number;
};

type Window = { count: number; resetAt: number };

const PRUNE_ABOVE = 1000;

export function createRateLimiter({ limit, windowSeconds }: { limit: number; windowSeconds: number }, now: () => number = Date.now) {
  const windows = new Map<string, Window>();

  return {
    check(key: string): RateLimitResult {
      const time = now();
      if (windows.size > PRUNE_ABOVE) {
        for (const [k, w] of windows) if (w.resetAt <= time) windows.delete(k);
      }
      let window = windows.get(key);
      if (!window || window.resetAt <= time) {
        window = { count: 0, resetAt: time + windowSeconds * 1000 };
        windows.set(key, window);
      }
      window.count += 1;
      return {
        allowed: window.count <= limit,
        limit,
        remaining: Math.max(0, limit - window.count),
        reset: Math.max(1, Math.ceil((window.resetAt - time) / 1000)),
      };
    },
  };
}

export const apiRateLimiter = createRateLimiter(RATE_LIMIT);

/** The RateLimit header fields of draft-ietf-httpapi-ratelimit-headers-07, and Retry-After once blocked. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.reset),
    "RateLimit-Policy": `${RATE_LIMIT.limit};w=${RATE_LIMIT.windowSeconds}`,
    ...(result.allowed ? {} : { "Retry-After": String(result.reset) }),
  };
}
