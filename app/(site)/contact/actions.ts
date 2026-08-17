"use server";

import { headers } from "next/headers";

import { ContactSchema, type ContactState } from "@/app/(site)/contact/form-state";
import { pruneRateLimit, rateLimit } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";

/**
 * Contact form handling.
 *
 * Four defences, in order of cost: a honeypot field that a human never fills,
 * a per-address rate limit, zod validation, and only then the send. The form
 * degrades gracefully when RESEND_API_KEY is absent: the submission is
 * accepted and logged, and the visitor is told to call, rather than being
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

  /* 3. Validation. */
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

  /* 4. Send, or degrade gracefully. */
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    // Not the visitor's problem, so do not show them an error. The submission
    // is logged so nothing is silently lost, and they are given the phone
    // number, which is the faster route to a repair store anyway.
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set, so this message was not emailed.",
      { name, contact, device, message },
    );

    return {
      status: "success",
      message: `Thank you. Email delivery is not switched on for this site yet, so the quickest way to reach TechBrotherz right now is to call ${SITE.phone}.`,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: `${SITE.brandName} website <onboarding@resend.dev>`,
      to: [to],
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `Website enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Contact: ${contact}`,
        device ? `Device: ${device}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (result.error) {
      console.error("[contact] Resend rejected the message.", result.error);
      return {
        status: "error",
        message: `The message could not be sent. Please call ${SITE.phone} and we will pick up.`,
      };
    }

    return {
      status: "success",
      message: `Thank you, your message has been sent. TechBrotherz will reply as soon as the store is free. If it is urgent, call ${SITE.phone}.`,
    };
  } catch (error) {
    console.error("[contact] Sending failed.", error);
    return {
      status: "error",
      message: `The message could not be sent. Please call ${SITE.phone} and we will pick up.`,
    };
  }
}
