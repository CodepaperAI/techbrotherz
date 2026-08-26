"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { submitContact } from "@/app/(site)/contact/actions";
import { CONTACT_INITIAL_STATE, type ContactState } from "@/app/(site)/contact/form-state";
import { TURNSTILE_SITE_KEY, TurnstileWidget } from "@/components/turnstile-widget";
import { cn } from "@/lib/utils";

/**
 * `aria-disabled` rather than `disabled` while the verification is
 * outstanding, deliberately. A truly disabled button is removed from the tab
 * order, which would leave a keyboard or screen-reader user with a button they
 * cannot reach and no way to hear why it will not work. This one stays
 * focusable and announces its reason through contact-verify-note; the form's
 * onSubmit is what actually stops the send. `disabled` still applies while a
 * submit is in flight, which is the existing behaviour and needs no
 * explanation to anyone.
 */
function SubmitButton({ awaitingVerification }: { awaitingVerification: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={awaitingVerification || undefined}
      aria-describedby={awaitingVerification ? "contact-verify-note" : undefined}
      className="rounded-chip bg-tb-green text-tb-ink hover:bg-tb-green-press aria-disabled:hover:bg-tb-green inline-flex h-12 items-center justify-center px-7 font-medium transition-colors duration-[180ms] ease-out disabled:pointer-events-none disabled:opacity-60 aria-disabled:opacity-60 md:h-13"
    >
      {pending ? "Sending..." : "Send the message"}
    </button>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: "text" | "textarea";
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

function Field({
  id,
  name,
  label,
  hint,
  type = "text",
  required,
  autoComplete,
  error,
}: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  const shared = cn(
    "border-tb-border rounded-input text-tb-text placeholder:text-tb-muted w-full border bg-transparent px-4 outline-none",
    "focus-visible:border-tb-green-deep",
    error && "border-tb-green-deep",
  );

  return (
    <div>
      <label htmlFor={id} className="type-eyebrow text-tb-text block">
        {label}
        {required ? (
          <span className="text-tb-green-deep ml-1" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-tb-muted ml-1 font-normal">optional</span>
        )}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="type-caption text-tb-muted mt-1">
          {hint}
        </p>
      ) : null}

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(shared, "mt-2 py-3")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          required={required}
          autoComplete={autoComplete}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(shared, "mt-2 h-12")}
        />
      )}

      {error ? (
        <p id={`${id}-error`} className="type-caption text-tb-green-deep mt-2 font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The contact form.
 *
 * Submits through a server action. Validation, the honeypot, the rate limit
 * and the Turnstile check all live on the server in
 * app/(site)/contact/actions.ts, because a check that only runs in the browser
 * is not a check.
 *
 * Turnstile needs JavaScript, so the form no longer submits before hydration.
 * Every failure path here and on the server ends with the phone number, which
 * is the store's primary contact route anyway.
 */
export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContact,
    CONTACT_INITIAL_STATE,
  );

  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  /* No site key means Turnstile is not configured for this build, so the form
     behaves exactly as it did before. The server makes the matching decision
     on the secret, and refuses to be lenient in production. */
  const turnstileRequired = Boolean(TURNSTILE_SITE_KEY);
  const awaitingVerification = turnstileRequired && token === "";

  /* Tokens are single use. After every submit, successful or not, the spent
     token is dropped and the widget is reset so a second message can be sent
     without reloading the page. */
  useEffect(() => {
    if (state.status === "idle") return;
    setToken("");
    setResetSignal((count) => count + 1);
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (awaitingVerification) event.preventDefault();
  }

  const fieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6" noValidate>
      {state.status !== "idle" ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-card flex items-start gap-3 border p-4",
            state.status === "success"
              ? "border-tb-green bg-tb-paper-2"
              : "border-tb-border bg-tb-white",
          )}
        >
          {state.status === "success" ? (
            <CheckCircle2
              aria-hidden="true"
              size={20}
              strokeWidth={1.5}
              className="text-tb-green-deep mt-0.5 shrink-0"
            />
          ) : (
            <AlertCircle
              aria-hidden="true"
              size={20}
              strokeWidth={1.5}
              className="text-tb-text mt-0.5 shrink-0"
            />
          )}
          <p className="type-body text-tb-text">{state.message}</p>
        </div>
      ) : null}

      <Field
        id="contact-name"
        name="name"
        label="Your name"
        required
        autoComplete="name"
        error={fieldErrors.name}
      />

      <Field
        id="contact-contact"
        name="contact"
        label="Phone or email"
        hint="Whichever is easier for us to reply on."
        required
        autoComplete="tel"
        error={fieldErrors.contact}
      />

      <Field
        id="contact-device"
        name="device"
        label="Device"
        hint="For example Iphone 12, Galaxy S21, or a Dell laptop."
        error={fieldErrors.device}
      />

      <Field
        id="contact-message"
        name="message"
        label="What is wrong with it?"
        hint="A sentence or two is plenty. What happened, and what is it doing now?"
        type="textarea"
        required
        error={fieldErrors.message}
      />

      {/* Honeypot. Hidden from people and from screen readers, visible to bots. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* The token travels with the rest of the form data, so the server action
          reads it the same way it reads every other field. */}
      <input type="hidden" name="turnstileToken" value={token} />

      {turnstileRequired ? (
        <div>
          <TurnstileWidget
            onVerify={setToken}
            onExpire={() => setToken("")}
            onError={() => setToken("")}
            resetSignal={resetSignal}
            action="contact"
          />
          <p id="contact-verify-note" aria-live="polite" className="type-caption text-tb-muted mt-2">
            {awaitingVerification
              ? "Please complete the verification check above before sending."
              : "Verification complete."}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton awaitingVerification={awaitingVerification} />
        <p className="type-caption text-tb-muted">Fields marked with a star are required.</p>
      </div>
    </form>
  );
}
