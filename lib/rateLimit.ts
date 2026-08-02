import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Clean up expired rate limit entries every 5 minutes.
 */
setInterval(() => {
  const now = Date.now();
  for (const ip in store) {
    if (store[ip].resetTime < now) {
      delete store[ip];
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit?: number; // Max requests allowed
  windowMs?: number; // Window size in milliseconds (default 60s)
}

/**
 * Sliding window rate limiter for API routes.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): { isAllowed: boolean; response?: NextResponse; remaining: number } {
  const limit = options.limit || 60;
  const windowMs = options.windowMs || 60 * 1000;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();

  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { isAllowed: true, remaining: limit - 1 };
  }

  store[ip].count += 1;

  if (store[ip].count > limit) {
    const response = NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfterMs: store[ip].resetTime - now,
      },
      { status: 429 }
    );
    response.headers.set(
      "Retry-After",
      Math.ceil((store[ip].resetTime - now) / 1000).toString()
    );
    return { isAllowed: false, response, remaining: 0 };
  }

  return { isAllowed: true, remaining: limit - store[ip].count };
}
