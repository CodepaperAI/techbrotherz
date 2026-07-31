import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/** Leaves preview and returns to the published site. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("redirect") ?? "/";

  const draft = await draftMode();
  draft.disable();

  redirect(target.startsWith("/") && !target.startsWith("//") ? target : "/");
}
