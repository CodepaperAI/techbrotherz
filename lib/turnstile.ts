import "server-only";

/**
 * Cloudflare Turnstile verification.
 *
 * The third defence on the contact form, sitting between the rate limit and
 * zod. It is an additional layer, not a replacement: the honeypot, the rate
 * limit and the schema all still run.
 *
 * Deliberately dependency free. Turnstile's server side is one form-encoded
 * POST, and a wrapper package would be more code to audit than the twenty
 * lines it saves.
 */

const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteVerifyResponse {
  success?: boolean;
  "error-codes"?: string[];
}

/**
 * Returns true only when Cloudflare confirms the token.
 *
 * A missing token, a non-200 response, a malformed body, a network failure and
 * an explicit `success: false` all return false. The caller never sees the
 * reason, and neither does the visitor: Cloudflare's error codes go to the
 * server log, because "invalid-input-response" on a page is an invitation to
 * probe.
 *
 * The unconfigured case is the one exception, and it throws rather than
 * returning. A production deployment that has lost TURNSTILE_SECRET_KEY would
 * otherwise silently wave every bot through, which is worse than a loud
 * failure. In development it warns and passes, so a local checkout with no
 * keys still has a working form.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "TURNSTILE_SECRET_KEY is not set. Refusing to accept form submissions unverified.",
      );
    }

    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY is not set, so submissions are accepted unverified. This is allowed in development only.",
    );
    return true;
  }

  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });

  // Cloudflare rejects a malformed remoteip outright, so only a real one is sent.
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[turnstile] siteverify returned ${response.status}.`);
      return false;
    }

    const result = (await response.json()) as SiteVerifyResponse;

    if (result.success !== true) {
      console.warn("[turnstile] Verification refused.", result["error-codes"] ?? []);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[turnstile] siteverify could not be reached.", error);
    return false;
  }
}
