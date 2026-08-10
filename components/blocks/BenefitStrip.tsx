import { Clock, ShieldCheck, DoorOpen, Lock } from "lucide-react";

import { Container } from "@/components/primitives/Container";
import { SITE } from "@/lib/site";

/**
 * Four benefits across a dark band.
 *
 * The four are fixed and each traces to a verified fact in CLAUDE.md Section 2:
 * the typical wait, the warranty length, the appointment policy, and what the
 * shop will and will not do with your data.
 *
 * The fourth is deliberately labelled "Your data" rather than a promise. Only
 * two claims about data are backed today, so the strip states the position and
 * the section on the page carries the detail. Nothing here says anything about
 * passcodes, unattended storage, access or retention, all of which are still
 * unanswered client questions.
 */
const ITEMS = [
  {
    icon: Clock,
    title: "Fast turnaround",
    body: `Most repairs take about ${SITE.typicalWaitMinutes} minutes at the counter.`,
  },
  {
    icon: ShieldCheck,
    title: `${SITE.warrantyDays}-day warranty`,
    body: "Every repair is covered on the part and the workmanship.",
  },
  {
    icon: DoorOpen,
    title: "No appointment",
    body: "Walk in during opening hours. There is no booking system.",
  },
  {
    icon: Lock,
    title: "Your data",
    body: "Virus removal targets the malware, not your documents and photos.",
  },
] as const;

export function BenefitStrip() {
  return (
    <div data-surface="dark" className="bg-tb-black">
      <Container>
        <ul className="grid gap-8 py-12 sm:grid-cols-2 md:py-14 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <Icon
                aria-hidden="true"
                size={26}
                strokeWidth={1.5}
                className="text-tb-green mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="type-h3 text-tb-on-black">{title}</h3>
                <p className="type-caption text-tb-on-black-2 mt-1.5 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
