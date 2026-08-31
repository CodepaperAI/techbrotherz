/**
 * Dropping blog images that no longer resolve.
 *
 * The CMS hands us image URLs on a CDN we do not control, and on 2026-08-30
 * one of Uplift's two Cloudinary accounts went dead: every URL under
 * `res.cloudinary.com/jse5fsui/` answers `401 cloud_name jse5fsui is disabled`.
 * Eight images across five articles, while the other sixty-six were fine. The
 * page rendered them anyway, so four cards on /blog showed a broken frame with
 * the alt text sprawled across it.
 *
 * That is the same failure DemoImage already solved for local files by checking
 * the disk at render: **an image that is not there is not rendered.** A remote
 * file cannot be stat'd, so it is asked for instead, once per distinct URL at
 * build time.
 *
 * **Only a definite refusal drops an image.** A 401, 403, 404 or 410 means the
 * file is genuinely gone. A timeout, a DNS failure or a 5xx means the CDN is
 * having a moment, and stripping every picture off the blog because a build ran
 * during a Cloudflare wobble would be a worse bug than the one this fixes.
 */

/**
 * Sequential batches, so a build does not open 74 sockets at once.
 *
 * Low on purpose. A Next build renders pages across several worker processes
 * and each one runs this check, so the real concurrency against the CDN is this
 * number times the worker count. At 8 the first attempt timed out often enough
 * that three articles kept a dead image while a fourth lost it, which is the
 * worst possible outcome: a check that half works looks like a check that works.
 */
const CONCURRENCY = 4;

/** Generous. A build that waits a second longer is cheaper than a wrong answer. */
const TIMEOUT_MS = 15000;

/** One retry, because the whole point is to tell "gone" from "slow". */
const ATTEMPTS = 2;

/** The CDN said this file is gone, rather than failing to answer. */
const GONE = new Set([401, 403, 404, 410]);

/**
 * Whether the CDN still serves this file.
 *
 * Uses `node:https` rather than `fetch`, which is the whole trick. Next patches
 * the global fetch, and inside a static-generation worker every call here threw
 * before the request left the machine: `cache: "no-store"` during a prerender is
 * refused, and `next: { revalidate }` does not round-trip a HEAD. The symptom
 * was three articles keeping a dead image while a fourth lost it, because only
 * the one process that rendered the index got real answers. A raw request is
 * not instrumented, so every worker sees the same 401.
 *
 * Returns true unless the answer is a definite refusal, so every ambiguous
 * outcome keeps the image. A slow first attempt is retried, because "gone" and
 * "slow" are exactly the two things this has to tell apart.
 */
async function statusOf(url: string): Promise<number> {
  const { request } = await import("node:https");

  return new Promise<number>((resolve) => {
    const call = request(url, { method: "HEAD", timeout: TIMEOUT_MS }, (response) => {
      response.resume(); // A HEAD has no body, but the socket still needs draining.
      resolve(response.statusCode ?? 0);
    });

    call.on("timeout", () => {
      call.destroy();
      resolve(0);
    });
    call.on("error", () => resolve(0));
    call.end();
  });
}

async function resolves(url: string): Promise<boolean> {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    const status = await statusOf(url);

    if (process.env.UPLIFT_DEBUG_IMAGES) {
      console.warn(`[probe] pid=${process.pid} attempt=${attempt} status=${status} ${url.slice(-40)}`);
    }

    if (GONE.has(status)) return false;
    if (status >= 200 && status < 400) return true;
    // 0 is a timeout or a network error, 5xx is the CDN having a moment.
    // Try once more, then keep the image.
  }

  return true;
}

/**
 * Probe results, cached per process and keyed by URL.
 *
 * Separate from the article memo in lib/uplift/client.ts, and much longer
 * lived, because the two answer different questions. Whether a file is on the
 * CDN barely changes; whether a new article exists changes all the time. Kept
 * apart, the article list can be re-read every minute without re-probing
 * eighty images every time.
 */
const seen = new Map<string, { alive: boolean; at: number }>();

const PROBE_TTL_MS = 30 * 60 * 1000;

/**
 * Checks every URL once and returns the set that is definitely gone.
 *
 * Deduplicated first: the same file is often both an article's featured image
 * and the hero inside its body, and a build should ask about it once.
 */
export async function deadImages(urls: string[]): Promise<Set<string>> {
  const distinct = [...new Set(urls.filter((url) => /^https?:/i.test(url)))];
  const dead = new Set<string>();

  const now = Date.now();
  const unknown: string[] = [];

  for (const url of distinct) {
    const cached = seen.get(url);
    if (cached && now - cached.at < PROBE_TTL_MS) {
      if (!cached.alive) dead.add(url);
      continue;
    }
    unknown.push(url);
  }

  for (let i = 0; i < unknown.length; i += CONCURRENCY) {
    const batch = unknown.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((url) => resolves(url)));

    batch.forEach((url, index) => {
      const alive = results[index] ?? true;
      seen.set(url, { alive, at: now });
      if (!alive) dead.add(url);
    });
  }

  if (dead.size > 0 && unknown.length > 0) {
    console.warn(
      `[uplift] ${dead.size} of ${distinct.length} blog images no longer resolve and are not rendered. First: ${[...dead][0]}`,
    );
  }

  return dead;
}

/** Every image URL in a sanitised article body. */
export function imageUrlsIn(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url));
}

/**
 * Removes the `<img>` elements whose files are gone, and the `<figure>` around
 * one where that leaves the figure empty. A caption under nothing is worse than
 * no figure at all.
 */
export function stripDeadImages(html: string, dead: Set<string>): string {
  if (dead.size === 0) return html;

  const withoutImages = html.replace(/<img\b[^>]*\ssrc="([^"]+)"[^>]*\/?>/gi, (whole, src: string) =>
    dead.has(src) ? "" : whole,
  );

  return withoutImages.replace(/<figure>([\s\S]*?)<\/figure>/gi, (whole, inner: string) =>
    /<img\b/i.test(inner) ? whole : "",
  );
}
