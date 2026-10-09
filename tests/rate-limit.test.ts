import { describe, expect, it } from "vitest";
import { createRateLimiter, RATE_LIMIT, rateLimitHeaders } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  const setup = (limit = 3, windowSeconds = 10) => {
    let time = 1_000_000;
    return { limiter: createRateLimiter({ limit, windowSeconds }, () => time), advance: (ms: number) => (time += ms) };
  };

  it("counts down the remaining requests and blocks past the limit", () => {
    const { limiter } = setup();
    expect([1, 2, 3].map(() => limiter.check("a").remaining)).toEqual([2, 1, 0]);
    expect(limiter.check("a")).toMatchObject({ allowed: false, remaining: 0, limit: 3 });
  });

  it("reports the seconds until the window resets, rounded up", () => {
    const { limiter, advance } = setup();
    expect(limiter.check("a").reset).toBe(10);
    advance(2500);
    expect(limiter.check("a").reset).toBe(8);
  });

  it("starts a new window after the reset", () => {
    const { limiter, advance } = setup();
    for (let i = 0; i < 4; i++) limiter.check("a");
    advance(10_000);
    expect(limiter.check("a")).toMatchObject({ allowed: true, remaining: 2 });
  });

  it("counts clients separately", () => {
    const { limiter } = setup(1);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
    expect(limiter.check("b").allowed).toBe(true);
  });

  it("drops expired windows once many clients are tracked", () => {
    const { limiter, advance } = setup();
    for (let i = 0; i < 1100; i++) limiter.check(`client-${i}`);
    advance(11_000);
    expect(limiter.check("fresh")).toMatchObject({ allowed: true, remaining: 2 });
  });
});

describe("rateLimitHeaders", () => {
  it("reports the window on an allowed request", () => {
    expect(rateLimitHeaders({ allowed: true, limit: 60, remaining: 59, reset: 42 })).toEqual({
      "RateLimit-Limit": "60",
      "RateLimit-Remaining": "59",
      "RateLimit-Reset": "42",
      "RateLimit-Policy": `${RATE_LIMIT.limit};w=${RATE_LIMIT.windowSeconds}`,
    });
  });

  it("adds Retry-After once blocked", () => {
    expect(rateLimitHeaders({ allowed: false, limit: 60, remaining: 0, reset: 17 })["Retry-After"]).toBe("17");
  });
});
