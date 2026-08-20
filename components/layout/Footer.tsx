import { titleCase } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/blocks/SocialLinks";
import { TrademarkNotice } from "@/components/blocks/TrademarkNotice";
import { Container } from "@/components/primitives/Container";
import { SERVICE_AREAS } from "@/lib/content/service-areas";
import { footerColumns, footerLegalLinks } from "@/lib/nav";
import { shouldRenderLink } from "@/lib/routes";
import { ADDRESS_LINE, SITE, TEL_HREF, groupedHours } from "@/lib/site";

/**
 * The footer link matrix is what gives every important page a site-wide inbound
 * link, so it is an internal-linking requirement rather than decoration.
 * CLAUDE.md Section 9, rule 8. DESIGN.md Section 6.21.
 */
export function Footer() {
  const hours = groupedHours();
  const year = new Date().getFullYear();
  const columns = footerColumns();
  const legalLinks = footerLegalLinks();

  return (
    <footer data-surface="dark" className="bg-tb-ink text-tb-white">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Logo onDark variant="full" />

            <p className="type-body text-tb-muted-dark mt-5 max-w-sm">
              Walk-in cell phone, tablet and computer repair in Calgary. Parts and labour included,
              and every repair is covered by a {SITE.warrantyDays}-day warranty.
            </p>

            <address className="mt-6 not-italic">
              <p className="text-tb-white flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                  className="text-tb-green mt-1 shrink-0"
                />
                <span>{ADDRESS_LINE}</span>
              </p>
              <p className="mt-2 flex items-start gap-2">
                <Phone
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                  className="text-tb-green mt-1 shrink-0"
                />
                <a href={TEL_HREF} className="text-tb-white hover:text-tb-green">
                  {SITE.phone}
                </a>
              </p>
            </address>

            {/* Social profile icons, from site settings; the same URLs feed
                sameAs on the LocalBusiness node. Icon buttons on the client's
                instruction 2026-08. */}
            <SocialLinks onDark className="mt-6" />

            <table className="mt-6 w-full max-w-xs text-left">
              <caption className="type-eyebrow text-tb-silver pb-2 text-left">
                Opening hours
              </caption>
              <tbody>
                {hours.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="text-tb-muted-dark py-1 pr-4 font-normal">
                      {row.label}
                    </th>
                    <td className="text-tb-white py-1 text-right">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <a
              href={SITE.googleMapsUrl}
              target="_blank"
              rel="noopener"
              className="text-tb-green mt-5 inline-block font-medium hover:underline"
            >
              Get directions to our Calgary store
            </a>
            <a
              href={SITE.googleReviewsUrl}
              target="_blank"
              rel="noopener"
              className="text-tb-green mt-2 block font-medium hover:underline"
            >
              Read our reviews on Google
            </a>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 xl:grid-cols-5">
            {/* The Google Business Profile service areas, every link real:
                a page or an anchored section. lib/content/service-areas.ts */}
            <nav aria-label="Areas we serve">
              <h2 className="type-eyebrow text-tb-silver">Areas we serve</h2>
              <ul className="mt-4 space-y-2.5">
                {[...SERVICE_AREAS, { name: "Airdrie", href: "/locations/calgary#airdrie" }].map(
                  (area) => (
                    <li key={area.name}>
                      <Link
                        href={area.href}
                        className="text-tb-muted-dark hover:text-tb-white inline-flex items-center gap-1.5 transition-colors duration-[180ms] ease-out"
                      >
                        {area.name}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            {columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="type-eyebrow text-tb-silver">{titleCase(column.heading)}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-tb-muted-dark hover:text-tb-white inline-flex items-center gap-1.5 transition-colors duration-[180ms] ease-out"
                      >
                        {titleCase(link.label)}
                        {link.pending ? (
                          <span
                            title="Ships in a later phase. Hidden in production."
                            className="type-caption rounded-chip border-tb-border-dark text-tb-silver border px-1.5 py-0.5 text-[0.6875rem] leading-none"
                          >
                            soon
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Independence notice. TechBrotherz is not an authorised service
            provider for any manufacturer, and this site names Iphone, Galaxy
            and Pixel throughout. See components/blocks/TrademarkNotice.tsx. */}
        <div className="border-tb-border-dark mt-16 border-t pt-8">
          <TrademarkNotice tone="footer" />
        </div>

        <div className="border-tb-border-dark mt-8 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="type-caption text-tb-muted-dark">
            &copy; {year} {SITE.legalName}. {SITE.street}, {SITE.city}, {SITE.region}.
          </p>

          <ul className="type-caption flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-tb-muted-dark hover:text-tb-white">
                  {titleCase(link.label)}
                </Link>
              </li>
            ))}
            {/* Machine-readable summaries for answer engines. CLAUDE.md 8.3.
                Both ship in Phase 8, so they are registry-gated like every
                other link rather than pointing at a 404. */}
            {["/llms.txt", "/llms-full.txt"]
              .filter((path) => shouldRenderLink(path))
              .map((path) => (
                <li key={path}>
                  <a
                    href={path}
                    rel="alternate"
                    type="text/plain"
                    className="text-tb-muted-dark hover:text-tb-white"
                  >
                    {path.replace("/", "")}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
