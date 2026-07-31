"use client";

import { useEffect, useState } from "react";

import { Chip } from "@/components/primitives/Chip";
import { isOpenNow } from "@/lib/utils";
import type { DayName } from "@/lib/site";

/**
 * "Open now" or "Closed now", evaluated in the shop's own time zone rather than
 * the visitor's.
 *
 * Renders nothing until after mount. Computing this on the server would bake
 * the build-time answer into static HTML and cause a hydration mismatch.
 */
export function OpenNowBadge({ day }: { day?: DayName }) {
  const [state, setState] = useState<{ open: boolean; day: DayName } | null>(null);

  useEffect(() => {
    setState(isOpenNow());
    // Re-check every minute so the badge does not go stale on an open tab.
    const timer = window.setInterval(() => setState(isOpenNow()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!state) return null;
  // When a specific day is named, only badge that day's row.
  if (day && day !== state.day) return null;

  return (
    <Chip variant={state.open ? "soft" : "dark"}>{state.open ? "Open now" : "Closed now"}</Chip>
  );
}
