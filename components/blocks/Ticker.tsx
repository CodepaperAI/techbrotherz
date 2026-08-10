import { SITE } from "@/lib/site";

/**
 * A thin black band scrolling the shop's verified claims.
 *
 * Every entry has to be a fact from CLAUDE.md Section 2. There is no "trusted
 * by hundreds", no rating and no award, because none of those exist. What is
 * here is the warranty, the walk-in policy, the free quote and the typical
 * wait, which are the strongest things the shop can actually say and which no
 * competitor in the reference set commits to in writing.
 *
 * Two identical tracks make the loop seamless: the animation translates one
 * full track width, at which point the second is exactly where the first
 * started. The duplicate is aria-hidden so a screen reader hears the list once.
 *
 * Under prefers-reduced-motion the animation stops and the band renders as a
 * static row. It is not hidden, because the claims are content.
 */
const CLAIMS = [
  `${SITE.warrantyDays}-day warranty`,
  "No appointment needed",
  "Walk-ins welcome",
  "Free quote before any work",
  `About ${SITE.typicalWaitMinutes} minutes on most repairs`,
];

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
      // The track must not wrap or the loop geometry breaks.
      style={{ whiteSpace: "nowrap" }}
    >
      {CLAIMS.map((claim) => (
        <li key={claim} className="flex items-center gap-10">
          <span className="type-eyebrow text-tb-on-black">{claim}</span>
          <span aria-hidden="true" className="bg-tb-green size-1.5 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

export function Ticker() {
  return (
    <div
      data-surface="dark"
      className="bg-tb-black border-tb-rule-dark overflow-hidden border-y py-3.5"
    >
      <div className="tb-ticker flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
