import { NextResponse, type NextRequest } from "next/server";

import { siteUrl } from "@/lib/site-url";

/**
 * Keeps non-canonical hosts out of the index.
 *
 * Phase 5 set NEXT_PUBLIC_SITE_URL to the production domain on the Vercel
 * deployment, which was right for canonical correctness and had a side effect:
 * the staging host became a fully crawlable copy of the site whose canonicals
 * all point at a domain currently serving the client's old Wix site. If Google
 * reached the staging host before launch, it would be resolving two versions
 * of the same business at the worst possible moment.
 *
 * So any host that is not the canonical production host gets
 * `X-Robots-Tag: noindex, nofollow` on every response, and a robots.txt that
 * disallows everything. The canonical host is untouched, so nothing has to be
 * remembered or reverted at launch.
 *
 * The comparison is derived from the canonical origin rather than naming any
 * deployment host, so this keeps working for preview URLs, branch URLs, custom
 * staging domains and anything else that appears later.
 *
 * That origin is now a constant rather than an environment variable, which
 * closes the one hole this file had: with the variable unset the protection
 * silently did nothing, on exactly the deployments most likely to be missing
 * it. See lib/site-url.ts.
 */

/** The one host allowed to be indexed, taken from the canonical origin. */
function canonicalHost(): string | null {
  try {
    return new URL(siteUrl()).host.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * localhost is not the canonical host, and it is also not a host Google can
 * reach. Treating it as non-canonical would put noindex on every local page
 * and make `pnpm audit:pages` disagree with production for no reason.
 */
function isLocal(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]");
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const canonical = canonicalHost();

  // With no canonical origin configured we cannot tell staging from production,
  // and guessing in either direction is worse than doing nothing.
  if (!canonical || !host || isLocal(host) || host === canonical) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("x-robots-tag", "noindex, nofollow");
  return response;
}

export const config = {
  /*
   * Everything except Next's own build output and the static files that cannot
   * carry a meaningful robots directive anyway. robots.txt is deliberately
   * included, because replacing it is half the point.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)$).*)",
  ],
};
