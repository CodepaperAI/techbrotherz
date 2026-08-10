import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { NotFoundSuggestions } from "@/components/blocks/NotFoundSuggestions";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { MODEL_ROUTES_BUILT } from "@/lib/routes";
import { SITE, TEL_HREF } from "@/lib/site";
import { getModelSearchIndex } from "@/lib/data";

/**
 * The 404.
 *
 * Rather than a dead end, it matches the attempted address against every model
 * name, slug and alias in the catalogue and offers the three closest. That is
 * what the aliases seeded in Phase 2 are for: someone who lands on
 * /iphone8plus-screen or an old Wix address still gets to a price.
 *
 * Lives outside the (site) route group, so it renders its own chrome.
 */
export default async function NotFound() {
  const models = await getModelSearchIndex();

  return (
    <>
      <Nav />

      <main id="main" className="pb-24 lg:pb-0">
        <Section className="pt-10 md:pt-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Heading
                level={1}
                eyebrow="Page not found"
                lead="That address does not exist on the TechBrotherz site. The repair you were after is almost certainly still here, so try one of the links below or call the shop."
              >
                We could not find that page
              </Heading>

              <div className="mt-9 flex flex-wrap gap-3">
                <PillButton href="/contact">How quoting works</PillButton>
                <PillButton href={TEL_HREF} variant="ghost" withArrow={false}>
                  Call {SITE.phone}
                </PillButton>
              </div>

              <NotFoundSuggestions models={models} modelRoutesBuilt={MODEL_ROUTES_BUILT} />
            </div>

            <div className="lg:col-span-5">
              <Card>
                <h2 className="type-h3 text-tb-text">Where to go instead</h2>
                <ul className="type-body divide-tb-border mt-4 divide-y">
                  {[
                    { href: "/contact", label: "How quoting works and what to bring" },
                    { href: "/services", label: "All repair services we offer" },
                    { href: "/faq", label: "Frequently asked questions" },
                    { href: "/warranty", label: "Our 60-day warranty" },
                    { href: "/contact", label: "Contact and directions" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-tb-text hover:text-tb-green-deep block py-3 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="type-caption text-tb-muted mt-5">
                  TechBrotherz is a walk-in shop at {SITE.street} in {SITE.city}. No appointment is
                  needed, and most repairs take about {SITE.typicalWaitMinutes} minutes.
                </p>
              </Card>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
