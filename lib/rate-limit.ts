import "server-only";

/**
 * A small fixed-window rate limiter held in memory.
 *
 * Deliberately simple, and worth being honest about its limits: the counter
 * lives in the process, so on a platform that runs several instances each one
 * keeps its own count, and a deploy resets it. For a contact form on a repair
 * shop's website that is the right trade: it stops a script hammering the form
 * from one address without adding a Redis dependency to the project.
 *
 * If the form ever needs stronger protection, replace the Map with a shared
 * store. The call signature does not need to change.
 */

interface Window {
  count: number;
  resetAt: number;
}

const WINDOWS = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  options: { limit: number; windowSeconds: number },
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const existing = WINDOWS.get(key);

  if (!existing || existing.resetAt <= now) {
    WINDOWS.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: options.limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Stops the Map growing without bound on a long-lived server. */
export function pruneRateLimit(now = Date.now()): void {
  for (const [key, window] of WINDOWS) {
    if (window.resetAt <= now) WINDOWS.delete(key);
  }
}
