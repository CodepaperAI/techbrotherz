import { Clock, DoorOpen, ShieldCheck, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * The honest replacement for the reference template's fake rating badge and
 * "trusted by" logo cloud.
 *
 * NEVER add a star rating, an avatar stack, a customer count or an award to
 * this component. Every item must be a fact the store can stand behind.
 * If the client supplies verified Google review data, a real rating may be
 * added as a fifth item and only then.
 * CLAUDE.md Section 3, DESIGN.md Section 6.15.
 */
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: `${SITE.warrantyDays}-day warranty`, detail: "On every repair" },
  { icon: DoorOpen, label: "No appointment needed", detail: "Walk in any day we are open" },
  {
    icon: Clock,
    label: `About ${SITE.typicalWaitMinutes} minutes`,
    detail: "Typical wait on most repairs",
  },
  { icon: Wrench, label: "Parts and labour included", detail: "The price you are quoted" },
] as const;

export interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-0",
        "md:divide-tb-border md:on-dark:divide-tb-border-dark md:divide-x",
        className,
      )}
    >
      {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
        <li key={label} className="md:px-6 md:first:pl-0 md:last:pr-0">
          <Icon
            aria-hidden="true"
            size={24}
            strokeWidth={1.5}
            className="text-tb-green-deep on-dark:text-tb-green"
          />
          <p className="text-tb-text on-dark:text-tb-white mt-3 font-medium">{label}</p>
          <p className="type-caption text-tb-muted on-dark:text-tb-muted-dark mt-1">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
