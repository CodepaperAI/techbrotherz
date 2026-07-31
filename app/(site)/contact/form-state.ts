import { z } from "zod";

/**
 * Shared shapes for the contact form.
 *
 * These live outside actions.ts because a "use server" file may only export
 * async functions. Exporting the initial-state object from there compiles
 * cleanly and then throws at request time with "A use server file can only
 * export async functions, found object", which is exactly the kind of failure
 * that passes a build and breaks in production.
 */

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is longer than the form accepts."),
  contact: z
    .string()
    .trim()
    .min(5, "Please enter a phone number or an email address so we can reply.")
    .max(120, "That is longer than the form accepts."),
  device: z.string().trim().max(120, "That is longer than the form accepts.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please describe the fault in a sentence or two.")
    .max(2000, "Please keep the message under 2000 characters."),
  // The honeypot. Hidden from people, irresistible to bots.
  website: z.string().max(0).optional(),
});

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export const CONTACT_INITIAL_STATE: ContactState = { status: "idle" };
