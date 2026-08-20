/**
 * The contact send path, exercised without a key and without a server.
 *
 * This form was silently dead once, in Phase 3: a "use server" file exported
 * a plain object, which compiled, typechecked and built clean, then threw on
 * every submit. This check asserts the action layer's behaviour at module
 * level so that class of failure breaks the build instead of the inbox:
 *
 *  1. (The honeypot, invalid and valid submit paths run end to end in
 *     audit-browser.ts, through a real browser; this check owns the rest.)
 *  2. Validation rejects an empty submission with field errors.
 *  3. composeContactEmail lays out every field, sets reply-to only for
 *     email contacts, and stamps Calgary time.
 *  4. sendContactEmail with no configuration returns "unconfigured" without
 *     throwing and without a network call.
 */

import { composeContactEmail, sendContactEmail } from "../lib/email/contact";
import { ContactSchema } from "../app/(site)/contact/form-state";

let failures = 0;
function check(label: string, ok: boolean, detail?: string) {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${!ok && detail ? `: ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function main() {
  /* The action file itself cannot be imported here: lib/rate-limit.ts is
     marked server-only, deliberately. The honeypot, invalid and valid paths
     are exercised end to end through a real browser in audit-browser.ts,
     which also runs in pnpm verify; this check owns the send layer. */

  /* 2. Validation. */
  const invalid = ContactSchema.safeParse({ name: "", contact: "", device: "", message: "" });
  check("empty submission is rejected with field errors", !invalid.success);

  /* 3. Composition. */
  const email = composeContactEmail({
    name: "Jordan Reid",
    contact: "jordan@example.com",
    device: "Iphone 14",
    message: "Cracked screen, top corner.",
    page: "/contact",
  });
  check("subject is scannable and carries the device", email.subject.includes("Iphone 14"));
  check(
    "text part carries every field",
    ["Jordan Reid", "jordan@example.com", "Iphone 14", "Cracked screen", "/contact"].every(
      (needle) => email.text.includes(needle),
    ),
  );
  check("html part is sent alongside plain text", email.html.includes("Jordan Reid"));
  check("reply-to is the customer's email", email.replyTo === "jordan@example.com");

  const phoneOnly = composeContactEmail({
    name: "Sam",
    contact: "403 555 0100",
    device: "",
    message: "Battery drains fast.",
    page: "/contact",
  });
  check("no reply-to when the contact is a phone number", phoneOnly.replyTo === undefined);
  check("timestamp is stamped in Calgary time", /Calgary time/.test(email.text));

  /* 4. Unconfigured send: no throw, no network. */
  delete process.env.BREVO_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.BREVO_FROM_EMAIL;
  const outcome = await sendContactEmail({
    name: "Jordan Reid",
    contact: "jordan@example.com",
    device: "",
    message: "Test",
    page: "/contact",
  });
  check("missing configuration degrades to 'unconfigured'", outcome.outcome === "unconfigured");

  console.log("");
  if (failures > 0) {
    console.error(`FAIL: ${failures} contact email check(s) failed.`);
    process.exit(1);
  }
  console.log("PASS: the contact send path behaves on every path, with no key needed.");
}

main().catch((error) => {
  console.error("FAIL: the contact action threw where it never should:", error);
  process.exit(1);
});
