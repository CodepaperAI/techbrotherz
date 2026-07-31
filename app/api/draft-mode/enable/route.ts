import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Turns on Next draft mode, then sends the browser to the page being previewed.
 * The Studio preview pane loads this URL inside its iframe.
 *
 * Security note, recorded deliberately. The secret is compared server side, but
 * the Studio bundle at /studio is what supplies it, so it is visible to anyone
 * who can load the Studio. That makes it a guard against casual access, not a
 * strong control. The exposure is limited to unpublished marketing copy. If the
 * client later wants real access control on drafts, the route to take is
 * Sanity's Presentation tool with token-based auth.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const target = searchParams.get("redirect") ?? "/";

  const expected = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET;

  if (!expected) {
    return new Response(
      "Preview is not configured. Set NEXT_PUBLIC_SANITY_PREVIEW_SECRET in the environment.",
      { status: 500 },
    );
  }

  if (secret !== expected) {
    return new Response("Invalid preview secret.", { status: 401 });
  }

  // Only same-site paths, so this cannot be used as an open redirect.
  if (!target.startsWith("/") || target.startsWith("//")) {
    return new Response("The redirect target must be a path on this site.", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(target);
}
