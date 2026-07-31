import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";

import { tags } from "@/sanity/lib/fetch";

/**
 * On-demand revalidation from Sanity.
 *
 * Configure the webhook in sanity.io/manage with:
 *   URL      https://techbrotherz.com/api/revalidate
 *   Trigger  create, update, delete
 *   Filter   _type in ["siteSettings","navigation","reviewSummary","brand",
 *                      "deviceModel","repairType","priceEntry","priceGroup",
 *                      "flatService","unlockingService","location","faq",
 *                      "guide","author","servicePage","testimonial","redirect"]
 *   Projection {
 *     _type,
 *     _id,
 *     "slug": slug.current,
 *     "brandSlug": brand->slug.current,
 *     "modelSlug": model->slug.current
 *   }
 *   Secret   the value of SANITY_REVALIDATE_SECRET
 *
 * The projection is what makes targeted revalidation possible: editing one
 * model refreshes that model page, its brand hub and the price list, rather
 * than dropping the cache for the whole site.
 */

interface WebhookBody {
  _type?: string;
  _id?: string;
  slug?: string;
  brandSlug?: string;
  modelSlug?: string;
}

/** Everything that must refresh when a document of this type changes. */
function tagsToRevalidate(body: WebhookBody): string[] {
  const documentType = body._type;
  if (!documentType) return [];

  const result = new Set<string>([tags.type(documentType), tags.sitemap]);

  if (body.slug) result.add(tags.doc(documentType, body.slug));

  switch (documentType) {
    case "siteSettings":
    case "navigation":
    case "reviewSummary":
      // Chrome and business facts appear on every page.
      result.add(tags.global);
      break;

    case "brand":
      if (body.slug) result.add(tags.brand(body.slug));
      result.add(tags.prices);
      break;

    case "deviceModel":
      // The brand hub lists this model, and the price list includes it.
      if (body.brandSlug) result.add(tags.brand(body.brandSlug));
      result.add(tags.prices);
      break;

    case "priceEntry":
      // The model page reads prices through type:priceEntry, so it refreshes
      // from the tag added above. These cover the pages that aggregate prices.
      result.add(tags.prices);
      if (body.modelSlug) result.add(tags.doc("deviceModel", body.modelSlug));
      if (body.brandSlug) result.add(tags.brand(body.brandSlug));
      break;

    case "priceGroup":
    case "flatService":
    case "unlockingService":
      result.add(tags.prices);
      break;

    case "repairType":
      // Repair types appear in every price table.
      result.add(tags.prices);
      break;

    default:
      break;
  }

  return [...result];
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not set, so the webhook cannot be verified." },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return NextResponse.json({ message: "Missing signature header." }, { status: 401 });
  }

  // The raw text is what the signature was computed over, so read it before
  // parsing.
  const raw = await request.text();

  if (!(await isValidSignature(raw, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return NextResponse.json({ message: "Body was not valid JSON." }, { status: 400 });
  }

  const toRevalidate = tagsToRevalidate(body);

  if (toRevalidate.length === 0) {
    return NextResponse.json(
      { message: "No _type in the payload, so nothing was revalidated." },
      { status: 400 },
    );
  }

  for (const tag of toRevalidate) revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    documentType: body._type,
    documentId: body._id,
    tags: toRevalidate,
  });
}

/** A GET is a health check, so the webhook URL can be verified in a browser. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.SANITY_REVALIDATE_SECRET),
    message: "POST a signed Sanity webhook payload here to revalidate.",
  });
}
