import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { ROUTES, routeStats, routesByTier, type RouteTier } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Route registry",
  description: "Internal view of every planned URL and whether it has shipped.",
  path: "/styleguide/routes",
  noIndex: true,
});

const TIER_ORDER: RouteTier[] = [
  "core",
  "service-hub",
  "repair-type",
  "brand",
  "local",
  "neighbourhood",
  "guide",
  "utility",
  "internal",
];

export default function RoutesPage() {
  const stats = routeStats();
  const totalBuilt = stats.reduce((sum, tier) => sum + tier.built, 0);
  const total = ROUTES.length;
  const percent = Math.round((totalBuilt / total) * 100);

  return (
    <>
      <Section className="pt-10 md:pt-14">
        <Breadcrumbs
          items={[{ label: "Design system", href: "/styleguide" }, { label: "Route registry" }]}
          className="mb-8"
        />

        <Heading
          level={1}
          eyebrow="Internal"
          lead="Every URL in the site plan, and whether its page has shipped. This registry is what stops the header and footer linking to pages that do not exist yet, and it is what the Phase 8 link audit will check against."
        >
          Route registry
        </Heading>

        <Card className="mt-10">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="type-h2 text-tb-text tabular">
              {totalBuilt} of {total}
            </p>
            <p className="type-lead text-tb-muted">routes built, {percent} percent</p>
          </div>

          <div
            className="bg-tb-green-soft mt-6 h-3 w-full overflow-hidden rounded-full"
            role="img"
            aria-label={`${percent} percent of planned routes are built`}
          >
            <div className="bg-tb-green h-full rounded-full" style={{ width: `${percent}%` }} />
          </div>

          <table className="mt-8 w-full text-left">
            <caption className="sr-only-caption">Built and pending routes by tier</caption>
            <thead>
              <tr className="bg-tb-green-soft">
                <th scope="col" className="type-eyebrow text-tb-green-deep px-4 py-3">
                  Tier
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-4 py-3 text-right">
                  Built
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-4 py-3 text-right">
                  Pending
                </th>
                <th scope="col" className="type-eyebrow text-tb-green-deep px-4 py-3 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="tabular">
              {stats.map((tier) => (
                <tr key={tier.tier} className="border-tb-border border-t">
                  <th scope="row" className="text-tb-text px-4 py-3 text-left font-normal">
                    {tier.label}
                  </th>
                  <td className="text-tb-text px-4 py-3 text-right font-medium">{tier.built}</td>
                  <td className="text-tb-muted px-4 py-3 text-right">{tier.pending}</td>
                  <td className="text-tb-muted px-4 py-3 text-right">{tier.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {TIER_ORDER.map((tier) => {
        const entries = routesByTier(tier);
        if (entries.length === 0) return null;
        const label = stats.find((entry) => entry.tier === tier)?.label ?? tier;

        return (
          <Section
            key={tier}
            variant={TIER_ORDER.indexOf(tier) % 2 === 0 ? "light" : "tint"}
            className="pt-0 md:pt-0 lg:pt-0"
            aria-labelledby={`tier-${tier}`}
          >
            <h2 id={`tier-${tier}`} className="type-h3 text-tb-text">
              {label}
            </h2>

            <ul className="mt-5 grid gap-2 md:grid-cols-2">
              {entries.map((entry) => (
                <li
                  key={entry.path}
                  className="border-tb-border bg-tb-white rounded-card flex items-center justify-between gap-3 border px-4 py-3"
                >
                  <span className="min-w-0">
                    {entry.status === "built" ? (
                      <Link
                        href={entry.path}
                        className="text-tb-green-deep font-mono text-[0.8125rem] hover:underline"
                      >
                        {entry.path}
                      </Link>
                    ) : (
                      <span className="text-tb-muted font-mono text-[0.8125rem]">{entry.path}</span>
                    )}
                    <span className="type-caption text-tb-muted mt-0.5 block truncate">
                      {entry.label}
                    </span>
                  </span>

                  <Chip variant={entry.status === "built" ? "soft" : "dark"}>
                    {entry.status === "built" ? "built" : "pending"}
                  </Chip>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
    </>
  );
}
