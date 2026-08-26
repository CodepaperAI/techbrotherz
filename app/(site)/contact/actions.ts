"use server";

import { headers } from "next/headers";

import { ContactSchema, type ContactState } from "@/app/(site)/contact/form-state";
import { sendContactEmail } from "@/lib/email/contact";
import { pruneRateLimit, rateLimit } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Contact form handling.
 *
 * Five defences, in order of cost: a honeypot field that a human never fills,
 * a per-address rate limit, a Cloudflare Turnstile check, zod validation, and
 * only then the send. Turnstile sits behind the two free checks on purpose: it
 * is an outbound request to Cloudflare, so letting a script trigger it before
 * the rate limit would turn our form into a way to hammer someone else. The send
 * itself lives in lib/email/contact.ts (Brevo, plain fetch) so the
 * behavioural check can exercise it without a request context. The form
 * degrades gracefully when the Brevo configuration is absent: the submission
 * is accepted and logged, and the visitor is told to call, rather than being
 * shown an error for a configuration problem that is not their fault.
 */

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    contact: String(formData.get("contact") ?? ""),
    device: String(formData.get("device") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  /* 1. Honeypot. Answer as though it succeeded so a bot learns nothing. */
  if (raw.website.length > 0) {
    return {
      status: "success",
      message: "Thank you, your message has been received.",
    };
  }

  /* 2. Rate limit, keyed on the forwarded address. */
  pruneRateLimit();

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";

  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowSeconds: 600 });

  if (!limit.allowed) {
    return {
      status: "error",
      message: `That is several messages in a short time. Please wait about ${Math.ceil(
        limit.retryAfterSeconds / 60,
      )} minutes, or call ${SITE.phone} and we will pick up.`,
    };
  }

  /* 3. Turnstile. Before validation and before the send, so a bot never
     reaches the mailer and never learns which field it got wrong. */
  const turnstileToken = String(formData.get("turnstileToken") ?? "");

  let verified: boolean;

  try {
    verified = await verifyTurnstile(turnstileToken, ip);
  } catch (error) {
    /* The secret is missing on a production deployment. That is our problem,
       not the visitor's, so it is logged loudly and they are given the phone
       number rather than an error they can do nothing about. */
    console.error("[contact] Turnstile is not configured.", error);
    return {
      status: "error",
      message: `Sorry, the message could not be sent just now. Please call ${SITE.phone} and we will pick up.`,
    };
  }

  if (!verified) {
    return {
      status: "error",
      message: `Verification failed. Please try again, or call ${SITE.phone} and we will pick up.`,
    };
  }

  /* 4. Validation. */
  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }

    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const { name, contact, device, message } = parsed.data;

  /* 5. Send through Brevo, or degrade gracefully. The customer is never
     shown a stack trace or a configuration problem: every failure path
     confirms receipt of the message and offers the phone number, and the
     detail goes to the server log. */
  const page = headerList.get("referer")?.replace(/^https?:\/\/[^/]+/, "") || "/contact";

  const result = await sendContactEmail({ name, contact, device: device ?? "", message, page });

  if (result.outcome === "unconfigured") {
    console.warn(
      "[contact] BREVO_API_KEY, CONTACT_TO_EMAIL or BREVO_FROM_EMAIL is not set, so this message was not emailed.",
      { name, contact, device, message },
    );
    return {
      status: "success",
      message: `Thank you. Email delivery is not switched on for this site yet, so the quickest way to reach TechBrotherz right now is to call ${SITE.phone}.`,
    };
  }

  if (result.outcome === "failed") {
    console.error("[contact] Brevo rejected the message.", result.detail, {
      name,
      contact,
      device,
    });
    return {
      status: "success",
      message: `Thank you, your message has been received. If you do not hear back, the surest way to reach TechBrotherz is to call ${SITE.phone}.`,
    };
  }

  return {
    status: "success",
    message: `Thank you, your message has been sent. TechBrotherz will reply as soon as the store is free. If it is urgent, call ${SITE.phone}.`,
  };
}
