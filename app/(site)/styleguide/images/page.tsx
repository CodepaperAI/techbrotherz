import type { Metadata } from "next";

import { DemoImage } from "@/components/blocks/DemoImage";
import { TrademarkNotice } from "@/components/blocks/TrademarkNotice";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { IMAGES, ILLUSTRATED_SLOTS } from "@/lib/content/images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Image contact sheet",
  description: "Every demo image at its real crop, with its slot, ratio and alt text.",
  path: "/styleguide/images",
  noIndex: true,
});

/**
 * The contact sheet, for reviewing the demo set before a client meeting.
 *
 * Shows every image at the crop it actually renders at, beside its slot, ratio
 * and alt text, plus the slots that are deliberately empty. noindex, and
 * excluded from the sitemap like the rest of /styleguide.
 */
export default function ImageContactSheet() {
  const images = Object.values(IMAGES);

  return (
    <>
      <Section>
        <Container>
          <Heading
            level={1}
            eyebrow="Styleguide"
            lead="Every demo image at its real crop. These are placeholders for photography the client has not taken yet, and none of them is presented as the Store, its staff or its customers."
          >
            Image contact sheet
          </Heading>

          <dl className="type-body text-tb-muted mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-tb-text font-medium">Filled slots</dt>
              <dd>{images.length}</dd>
            </div>
            <div>
              <dt className="text-tb-text font-medium">Illustrated groups</dt>
              <dd>{ILLUSTRATED_SLOTS.length}</dd>
            </div>
            <div>
              <dt className="text-tb-text font-medium">Source cap</dt>
              <dd>1600px, quality 74</dd>
            </div>
            <div>
              <dt className="text-tb-text font-medium">Placeholder</dt>
              <dd>16px base64 LQIP</dd>
            </div>
          </dl>
        </Container>
      </Section>

      {/* ------------------------------------------------------ the sheet */}
      <Section variant="tint" aria-labelledby="sheet-heading">
        <Heading level={2} id="sheet-heading" eyebrow="Contact sheet">
          The demo set
        </Heading>

        <div className="mt-10 space-y-10">
          {images.map((image) => (
            <div key={image.slot} className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <DemoImage slot={image.slot} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>

              <dl className="type-body text-tb-muted lg:col-span-7">
                <dt className="type-h3 text-tb-text">{image.slot}</dt>
                <dd className="mt-2">
                  <span className="text-tb-text">Ratio</span> {image.ratio}, {image.width} by{" "}
                  {image.height}
                </dd>
                <dd className="mt-1">
                  <span className="text-tb-text">File</span> <code>{image.file}</code>
                </dd>
                <dd className="mt-1">
                  <span className="text-tb-text">Photographer</span> {image.photographer},{" "}
                  <a
                    href={image.sourceUrl}
                    rel="noopener"
                    className="text-tb-green-deep hover:underline"
                  >
                    Unsplash
                  </a>
                </dd>
                <dd className="measure mt-3">
                  <span className="text-tb-text">Alt</span> {image.alt}
                </dd>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------- what is missing */}
      <Section aria-labelledby="empty-heading">
        <Heading
          level={2}
          id="empty-heading"
          eyebrow="Illustrated"
          lead="Not failures. These are the repeating category and step markers, where a line drawing in the design system's own language beats a stock photograph repeated across thirty-five cards."
        >
          Slots that use an illustration
        </Heading>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ILLUSTRATED_SLOTS.map((slot) => (
            <Card key={slot.slot}>
              <h3 className="type-h3 text-tb-text">{slot.slot}</h3>
              <p className="type-body text-tb-muted mt-2">{slot.reason}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <TrademarkNotice />
        </div>
      </Section>
    </>
  );
}
