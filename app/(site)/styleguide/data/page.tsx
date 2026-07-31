import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";

import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { LocalInfoCard } from "@/components/blocks/LocalInfoCard";
import { ModelGrid } from "@/components/blocks/ModelGrid";
import { PriceTable, type PriceRow } from "@/components/blocks/PriceTable";
import { RichText } from "@/components/blocks/RichText";
import { Card } from "@/components/primitives/Card";
import { Chip } from "@/components/primitives/Chip";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import {
  itemListOfOffers,
  localBusiness,
  offerFromPriceEntry,
  organization,
  website,
} from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { to12Hour } from "@/lib/site";
import {
  getBrands,
  getFlatServices,
  getGlobalFaqs,
  getLocationBySlug,
  getModelBySlug,
  getModelsByBrand,
  getReviewSummary,
  getSiteSettings,
  getUnlocking,
} from "@/sanity/queries";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Data layer proof",
  description: "Internal route rendering live Sanity content through the real components.",
  path: "/styleguide/data",
  noIndex: true,
});

/** A model with real prices, and one that is quote-only, so both paths show. */
const PRICED_MODEL = "iphone-8-plus";
const QUOTE_ONLY_MODEL = "iphone-13";

type SanityPrices = NonNullable<Awaited<ReturnType<typeof getModelBySlug>>>["prices"];

/** Maps Sanity price rows onto the PriceTable component's row shape. */
function toPriceRows(prices: SanityPrices, brandSlug: string | null | undefined): PriceRow[] {
  return (prices ?? []).map((entry) => ({
    repair: entry.repair?.name ?? "Repair",
    price: entry.price ?? null,
    quoteOnly: entry.quoteOnly ?? false,
    turnaroundMinutes: entry.turnaroundMinutes ?? entry.repair?.estimatedMinutes ?? null,
    warrantyDays: entry.warrantyDays ?? null,
    note: entry.note ?? undefined,
    href: brandSlug && entry.repair?.slug ? undefined : undefined,
  }));
}

export default async function DataProofPage() {
  const [
    settings,
    reviews,
    brands,
    flatServices,
    unlocking,
    faqs,
    pricedModel,
    quoteModel,
    location,
  ] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getBrands(),
    getFlatServices(),
    getUnlocking(),
    getGlobalFaqs(8),
    getModelBySlug(PRICED_MODEL),
    getModelBySlug(QUOTE_ONLY_MODEL),
    getLocationBySlug("forest-lawn"),
  ]);

  const firstBrand = brands[0];
  const brandModels = firstBrand?.slug ? await getModelsByBrand(firstBrand.slug) : [];

  const businessJsonLd = localBusiness(settings ?? {}, reviews);
  const orgJsonLd = organization(settings ?? {});
  const siteJsonLd = website(settings ?? {});

  const offersJsonLd = pricedModel
    ? itemListOfOffers({
        name: `${pricedModel.name} repair prices at TechBrotherz in Calgary`,
        path: `/repair/${pricedModel.brand?.slug}/${pricedModel.slug}`,
        offers: (pricedModel.prices ?? []).map((entry) =>
          offerFromPriceEntry(
            {
              repairName: entry.repair?.name ?? "Repair",
              modelName: pricedModel.name,
              price: entry.price,
              quoteOnly: entry.quoteOnly,
              warrantyDays: entry.warrantyDays,
              url: `/repair/${pricedModel.brand?.slug}/${pricedModel.slug}`,
            },
            {
              phoneRaw: settings?.phoneRaw,
              defaultWarrantyDays: settings?.warrantyDays ?? 60,
            },
          ),
        ),
      })
    : null;

  return (
    <>
      <Section className="pt-10 md:pt-14">
        <Breadcrumbs
          items={[{ label: "Design system", href: "/styleguide" }, { label: "Data layer" }]}
          className="mb-8"
        />
        <Heading
          level={1}
          eyebrow="Internal"
          lead="Every block below is rendered from live Sanity content through the same components the real pages use. This route is noindex and is here to prove the data layer before Phase 3 builds real pages."
        >
          Data layer proof
        </Heading>
      </Section>

      {/* ------------------------------------------------- site settings */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="settings">
        <Heading level={2} id="settings" eyebrow="siteSettings">
          Business facts
        </Heading>

        {settings ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="type-h3">{settings.brandName}</h3>
              <dl className="type-body text-tb-muted mt-4 space-y-2">
                <Row label="Address">
                  {[settings.street, settings.city, settings.regionCode, settings.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </Row>
                <Row label="Phone">{settings.phone}</Row>
                <Row label="Warranty">{settings.warrantyDays} days</Row>
                <Row label="Typical wait">About {settings.typicalWaitMinutes} minutes</Row>
                <Row label="Appointments">{settings.appointmentPolicy}</Row>
                <Row label="Postal code">
                  {settings.postalCode ?? "Not supplied, omitted from schema"}
                </Row>
                <Row label="Coordinates">
                  {settings.geo?.lat && settings.geo?.lng
                    ? `${settings.geo.lat}, ${settings.geo.lng}`
                    : "Not supplied, omitted from schema"}
                </Row>
                <Row label="Payment methods">
                  {settings.paymentAccepted?.length
                    ? settings.paymentAccepted.join(", ")
                    : "Not supplied, omitted from schema"}
                </Row>
                <Row label="Founded">
                  {settings.foundedYear ?? "Not supplied, omitted from the site"}
                </Row>
                <Row label="Ratings">
                  {reviews?.enabled ? "Enabled" : "Dormant, no rating shown or emitted"}
                </Row>
              </dl>
            </Card>

            <Card>
              <h3 className="type-h3">Opening hours</h3>
              <table className="mt-4 w-full text-left">
                <caption className="sr-only-caption">
                  TechBrotherz opening hours from Sanity
                </caption>
                <tbody>
                  {(settings.hours ?? []).map((entry) => (
                    <tr key={entry.day} className="border-tb-border border-b last:border-b-0">
                      <th scope="row" className="text-tb-muted py-2 pr-4 font-normal">
                        {entry.day}
                      </th>
                      <td className="text-tb-text py-2 text-right font-medium">
                        {entry.closed
                          ? "Closed"
                          : `${to12Hour(entry.open ?? "00:00")} to ${to12Hour(entry.close ?? "00:00")}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        ) : (
          <Missing what="siteSettings" />
        )}
      </Section>

      {/* -------------------------------------------------- brand + models */}
      <Section variant="tint" aria-labelledby="brand">
        <Heading level={2} id="brand" eyebrow="brand + deviceModel">
          Brand hub preview
        </Heading>

        {firstBrand ? (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <h3 className="type-h3">{firstBrand.name}</h3>
              <Chip>{firstBrand.modelCount} published models</Chip>
              <Chip variant="dark">/repair/{firstBrand.slug}</Chip>
            </div>

            <ModelGrid
              className="mt-8"
              items={brandModels.slice(0, 8).map((model) => ({
                name: model.name ?? "",
                href: `/repair/${model.brandSlug}/${model.slug}`,
                fromPrice: model.fromPrice,
              }))}
            />
          </>
        ) : (
          <Missing what="brand" />
        )}
      </Section>

      {/* ------------------------------------------------- model, priced */}
      <Section aria-labelledby="model-priced">
        <Heading
          level={2}
          id="model-priced"
          eyebrow="deviceModel with prices"
          lead="A model page's price table, rendered from priceEntry documents ordered by repair type. This is real table markup with a caption and scoped headers."
        >
          Model page preview, priced
        </Heading>

        {pricedModel ? (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <h3 className="type-h3">{pricedModel.name}</h3>
              <Chip variant="dark">
                /repair/{pricedModel.brand?.slug}/{pricedModel.slug}
              </Chip>
              <Chip>{pricedModel.prices?.length ?? 0} price rows</Chip>
            </div>

            <PriceTable
              className="mt-8"
              caption={`${pricedModel.name} repair prices at TechBrotherz in Calgary`}
              captionVisible
              rows={toPriceRows(pricedModel.prices, pricedModel.brand?.slug)}
            />
          </>
        ) : (
          <Missing what={`deviceModel "${PRICED_MODEL}"`} />
        )}
      </Section>

      {/* -------------------------------------------- model, quote only */}
      <Section variant="tint" aria-labelledby="model-quote">
        <Heading
          level={2}
          id="model-quote"
          eyebrow="deviceModel awaiting prices"
          lead="A modern model seeded quote-only. Every row shows Call for quote linked to the phone number, never a blank cell or a dash. This model is unpublished until the shop supplies prices."
        >
          Model page preview, quote only
        </Heading>

        {quoteModel ? (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <h3 className="type-h3">{quoteModel.name}</h3>
              <Chip variant="dark">
                /repair/{quoteModel.brand?.slug}/{quoteModel.slug}
              </Chip>
            </div>
            <PriceTable
              className="mt-8"
              caption={`${quoteModel.name} repair prices at TechBrotherz in Calgary`}
              captionVisible
              rows={toPriceRows(quoteModel.prices, quoteModel.brand?.slug)}
            />
            <RichText className="mt-8" value={quoteModel.intro as PortableTextBlock[]} />
          </>
        ) : (
          <Card className="mt-8">
            <h3 className="type-h3">Not returned, and that is correct</h3>
            <p className="type-body text-tb-muted mt-3">
              The model {QUOTE_ONLY_MODEL} is seeded with published set to off, because it has no
              real prices yet. Every query filters on published, so it is invisible to the live site
              until the shop supplies prices. It is listed in the Studio under Catalogue, Device
              models, Modern models awaiting prices.
            </p>
          </Card>
        )}
      </Section>

      {/* ------------------------------------------------- flat services */}
      <Section aria-labelledby="services">
        <Heading level={2} id="services" eyebrow="flatService + unlockingService">
          Shop services
        </Heading>

        <PriceTable
          className="mt-8"
          caption="Computer and laptop service prices at TechBrotherz in Calgary"
          captionVisible
          itemLabel="Service"
          showWarranty={false}
          rows={flatServices.map((service) => ({
            repair: service.name ?? "",
            price: service.price ?? null,
            quoteOnly: service.quoteOnly ?? false,
            from: service.priceFrom ?? false,
            priceTo: service.priceTo,
            turnaroundMinutes: service.turnaroundMinutes,
            note: service.description ?? undefined,
          }))}
        />

        <PriceTable
          className="mt-10"
          caption="Carrier unlocking prices at TechBrotherz in Calgary"
          captionVisible
          itemLabel="Unlocking"
          showWarranty={false}
          rows={unlocking.map((entry) => ({
            repair: entry.carrier ?? "",
            price: entry.price ?? null,
            note: entry.turnaround ?? undefined,
            turnaroundMinutes: null,
          }))}
        />
      </Section>

      {/* --------------------------------------------------------- faqs */}
      <Section variant="tint" aria-labelledby="faqs">
        <Heading
          level={2}
          id="faqs"
          eyebrow="faq"
          lead="Site-wide questions pulled from Sanity. Each carries a plain-text answer capped at 320 characters, which is the version that goes into FAQPage structured data."
        >
          Questions
        </Heading>

        <FaqAccordion
          className="mt-8"
          items={faqs.map((faq) => ({
            question: faq.question ?? "",
            answer: <RichText value={faq.answer as PortableTextBlock[]} />,
          }))}
        />
      </Section>

      {/* ----------------------------------------------------- location */}
      <Section aria-labelledby="location">
        <Heading level={2} id="location" eyebrow="location">
          Location
        </Heading>

        {location ? (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <h3 className="type-h3">{location.city}</h3>
              <Chip>{location.kind}</Chip>
              {location.driveTimeMinutes ? (
                <Chip variant="dark">{location.driveTimeMinutes} min drive</Chip>
              ) : null}
            </div>
            <p className="type-body measure text-tb-muted mt-4">{location.routeDescription}</p>
          </>
        ) : (
          <Missing what='location "forest-lawn"' />
        )}

        <LocalInfoCard className="mt-8" />
      </Section>

      {/* ----------------------------------------------------- json-ld */}
      <Section variant="dark" aria-labelledby="jsonld">
        <Heading
          level={2}
          id="jsonld"
          eyebrow="Structured data"
          lead="The exact payloads a model page emits, printed here so they can be checked before Phase 4 builds the real route. Fields the client has not supplied are absent rather than null."
        >
          JSON-LD
        </Heading>

        <div className="mt-10 space-y-6">
          <JsonBlock title="LocalBusiness" data={businessJsonLd} />
          <JsonBlock title="Organization" data={orgJsonLd} />
          <JsonBlock title="WebSite" data={siteJsonLd} />
          {offersJsonLd ? <JsonBlock title="ItemList of Offers" data={offersJsonLd} /> : null}
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------- fragments */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="text-tb-text font-medium">{label}:</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Missing({ what }: { what: string }) {
  return (
    <Card className="border-l-tb-green mt-8 border-l-4">
      <h3 className="type-h3">Nothing returned for {what}</h3>
      <p className="type-body text-tb-muted mt-3">
        Run pnpm seed to import the catalogue, then reload this page.
      </p>
    </Card>
  );
}

function JsonBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <details className="rounded-card border-tb-border-dark bg-tb-ink-2 border p-6" open>
      <summary className="type-h3 text-tb-white cursor-pointer">{title}</summary>
      <pre className="text-tb-silver mt-4 overflow-x-auto text-[0.8125rem] leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
