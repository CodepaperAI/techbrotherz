/**
 * The contact email, composed and sent through Brevo's transactional API.
 *
 * Brevo replaced Resend 2026-08: the client's domain DNS lives on Wix, which
 * cannot host the MX record Resend requires on its send subdomain, while
 * Brevo authenticates with TXT records only, which Wix can host. The call is
 * a plain fetch against the documented endpoint (POST /v3/smtp/email, api-key
 * header), checked against developers.brevo.com on 2026-08-21, with no SMTP
 * dependency.
 *
 * The addresses are deliberately split: CONTACT_TO_EMAIL is the store's
 * Gmail, where enquiries land and which needs no verification.
 * BREVO_FROM_EMAIL is an address on the authenticated domain
 * (noreply@techbrotherz.com), because Brevo cannot authenticate gmail.com and
 * third-party mail "from" a Gmail address fails alignment and lands in spam.
 * The reply-to carries the conversation: the store hits reply in Gmail and
 * reaches the customer directly.
 *
 * This module has no Next.js imports, so the behavioural check in
 * scripts/test-contact-email.ts can exercise every path without a request
 * context and without a key.
 */

export interface ContactEmailInput {
  name: string;
  contact: string;
  device: string;
  message: string;
  /** The page the form was submitted from. */
  page: string;
}

export interface ComposedEmail {
  subject: string;
  text: string;
  html: string;
  /** The customer's address, when they gave an email rather than a phone. */
  replyTo?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function composeContactEmail(input: ContactEmailInput): ComposedEmail {
  const submittedAt = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Edmonton",
  }).format(new Date());

  /* Scannable at the counter: device first when given. */
  const subject = input.device
    ? `Website enquiry: ${input.device}, from ${input.name}`
    : `Website enquiry from ${input.name}`;

  const rows: [string, string][] = [
    ["Name", input.name],
    ["Contact", input.contact],
    ["Device", input.device || "Not given"],
    ["Message", input.message],
    ["Submitted", `${submittedAt} (Calgary time)`],
    ["Page", input.page],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <h2 style="font-size:17px;margin:0 0 12px">Website enquiry</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 16px 4px 0;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`,
      )
      .join("\n    ")}
  </table>
  <p style="color:#666;font-size:13px;margin-top:16px">Reply to this email to answer the customer directly.</p>
</div>`;

  return {
    subject,
    text,
    html,
    replyTo: input.contact.includes("@") ? input.contact : undefined,
  };
}

export type SendOutcome =
  | { outcome: "sent" }
  | { outcome: "unconfigured" }
  | { outcome: "failed"; detail: string };

export async function sendContactEmail(input: ContactEmailInput): Promise<SendOutcome> {
  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME ?? "TechBrotherz";

  if (!apiKey || !to || !fromEmail) {
    return { outcome: "unconfigured" };
  }

  const email = composeContactEmail(input);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: to }],
        ...(email.replyTo ? { replyTo: { email: email.replyTo, name: input.name } } : {}),
        subject: email.subject,
        textContent: email.text,
        htmlContent: email.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return { outcome: "failed", detail: `${response.status} ${detail.slice(0, 500)}` };
    }

    return { outcome: "sent" };
  } catch (error) {
    return { outcome: "failed", detail: String(error) };
  }
}
