import { cn } from "@/lib/utils";

/**
 * Line illustrations in the design system's own language.
 *
 * Built in Phase 6.5b so that a slot without a photograph renders something
 * deliberate rather than an empty frame with placeholder text. The
 * client-supplied placeholder stays in the code as the fallback of last
 * resort, but nothing in a demo build should reach it.
 *
 * Drawn to match the existing icon set: 1.5 stroke, round caps and joins,
 * brand green on the soft green tint, at the card radius. These are not
 * device renderings. They are diagrams of a repair, which is what a category
 * marker should be, and they carry no manufacturer resemblance at all.
 */

export type RepairSubject =
  "screen" | "battery" | "port" | "camera" | "keyboard" | "board" | "lock" | "sim" | "diagnostic";

export interface RepairIllustrationProps {
  subject: RepairSubject;
  /** 4:3 matches the step cards, 3:2 the wider header slots. */
  ratio?: "4:3" | "3:2";
  className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Each drawing sits on a 96 by 72 canvas so every subject shares a baseline. */
function Drawing({ subject }: { subject: RepairSubject }) {
  switch (subject) {
    case "screen":
      // A phone with the display lifting away, the way a screen comes off.
      return (
        <>
          <rect x="28" y="12" width="26" height="48" rx="3" {...STROKE} />
          <path d="M58 16l10 4v40l-10 4" {...STROKE} />
          <path d="M54 20l4-2M54 52l4 2" {...STROKE} />
          <line x1="35" y1="17" x2="47" y2="17" {...STROKE} />
        </>
      );
    case "battery":
      return (
        <>
          <rect x="24" y="22" width="44" height="28" rx="3" {...STROKE} />
          <path d="M68 32h4v8h-4" {...STROKE} />
          <path d="M44 27l-6 11h8l-6 11" {...STROKE} />
        </>
      );
    case "port":
      return (
        <>
          <rect x="26" y="26" width="30" height="20" rx="3" {...STROKE} />
          <path d="M56 32h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-8" {...STROKE} />
          <line x1="33" y1="36" x2="49" y2="36" {...STROKE} />
        </>
      );
    case "camera":
      return (
        <>
          <rect x="24" y="20" width="48" height="32" rx="4" {...STROKE} />
          <circle cx="48" cy="36" r="9" {...STROKE} />
          <circle cx="48" cy="36" r="3.5" {...STROKE} />
          <line x1="62" y1="27" x2="65" y2="27" {...STROKE} />
        </>
      );
    case "keyboard":
      return (
        <>
          <rect x="18" y="24" width="60" height="26" rx="3" {...STROKE} />
          <line x1="25" y1="31" x2="29" y2="31" {...STROKE} />
          <line x1="34" y1="31" x2="38" y2="31" {...STROKE} />
          <line x1="43" y1="31" x2="47" y2="31" {...STROKE} />
          <line x1="52" y1="31" x2="56" y2="31" {...STROKE} />
          <line x1="61" y1="31" x2="65" y2="31" {...STROKE} />
          <line x1="25" y1="39" x2="38" y2="39" {...STROKE} />
          <line x1="43" y1="39" x2="65" y2="39" {...STROKE} />
          <line x1="34" y1="45" x2="56" y2="45" {...STROKE} />
        </>
      );
    case "board":
      return (
        <>
          <rect x="20" y="18" width="56" height="38" rx="3" {...STROKE} />
          <rect x="30" y="27" width="14" height="12" rx="1.5" {...STROKE} />
          <rect x="52" y="27" width="16" height="8" rx="1.5" {...STROKE} />
          <path d="M30 46h10v-4h12" {...STROKE} />
          <path d="M52 46h16" {...STROKE} />
          <circle cx="46" cy="46" r="1.5" {...STROKE} />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="34" y="34" width="28" height="22" rx="3" {...STROKE} />
          <path d="M40 34v-6a8 8 0 0 1 16 0v6" {...STROKE} />
          <circle cx="48" cy="44" r="2.5" {...STROKE} />
          <line x1="48" y1="46.5" x2="48" y2="50" {...STROKE} />
        </>
      );
    case "sim":
      // A SIM tray lifted out of a device, with the ejector pin beside it.
      // Drawn rather than photographed: the one candidate photograph of a
      // removed tray is a second crop of the frame the tablet card already
      // uses, and two crops of one photograph in one grid read as a mistake.
      return (
        <>
          <rect x="18" y="28" width="44" height="18" rx="3" {...STROKE} />
          <path d="M27 33h10v9H24v-6z" {...STROKE} />
          <line x1="46" y1="37" x2="56" y2="37" {...STROKE} />
          <circle cx="76" cy="23" r="4.5" {...STROKE} />
          <line x1="76" y1="27.5" x2="76" y2="49" {...STROKE} />
        </>
      );
    case "diagnostic":
      return (
        <>
          <rect x="20" y="18" width="56" height="34" rx="3" {...STROKE} />
          <path d="M40 58h16" {...STROKE} />
          <line x1="48" y1="52" x2="48" y2="58" {...STROKE} />
          <path d="M27 38l7-8 6 10 5-14 6 18 5-9h13" {...STROKE} />
        </>
      );
  }
}

const LABEL: Record<RepairSubject, string> = {
  screen: "Screen replacement",
  battery: "Battery replacement",
  port: "Charging port repair",
  camera: "Camera repair",
  keyboard: "Keyboard replacement",
  board: "Board-level work",
  lock: "Password and unlocking",
  sim: "Carrier unlocking",
  diagnostic: "Diagnostics",
};

export function RepairIllustration({ subject, ratio = "4:3", className }: RepairIllustrationProps) {
  return (
    <div
      className={cn(
        "rounded-image bg-tb-paper-2 text-tb-green-deep flex items-center justify-center overflow-hidden",
        ratio === "4:3" ? "aspect-4/3" : "aspect-3/2",
        className,
      )}
    >
      {/*
       * Decorative: the surrounding card always carries the same information
       * as text, so announcing the drawing twice would only add noise.
       * A title is kept for anyone inspecting the markup.
       */}
      <svg viewBox="0 0 96 72" role="img" aria-hidden="true" className="h-3/5 w-3/5">
        <title>{LABEL[subject]}</title>
        <Drawing subject={subject} />
      </svg>
    </div>
  );
}
