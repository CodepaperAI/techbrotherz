import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { BLOG_POSTS } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE } from "@/lib/site";
import { getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;

const PATH = "/blog";

export const metadata: Metadata = buildMetadata({
  title: "Repair Guides and Answers | TechBrotherz Blog",
  description:
    "Straight answers on phone, laptop and computer problems from the TechBrotherz Store in Calgary: unlocking, water damage, laptop faults and when repair beats replacement.",
  path: PATH,
});

/** en-CA long date from an ISO string, rendered server-side so it never shifts. */
function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const [settings, reviews] = await Promise.all([getSiteSettings(), getReviewSummary()]);

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: "Repair guides and answers from TechBrotherz",
      description:
        "Guides on phone, laptop and computer problems, written by the TechBrotherz repair Store in Calgary.",
      path: PATH,
    }),
  ];

  return (
    <PageShell
      path={PATH}
      eyebrow="Blog"
      title="Repair guides and answers"
      crumbLabel="Blog"
      lead={
        <>
          Straight answers from the Store at TechBrotherz, a walk-in cell phone and computer
          repair store at {SITE.street} in {SITE.city}, {SITE.region}: what actually fixes a
          problem, what does not, and when a repair is not worth your money.
        </>
      }
      answerBox={{
        answer:
          "The TechBrotherz blog answers the questions customers actually ask at the Calgary Store: how to unlock a phone in Canada, which laptop symptoms mean repair, and what to do first with a wet phone. Every article is written by the store itself, under the same no-invented-facts rule as the rest of this site.",
        keyFacts: [
          { label: "Written by", value: "The TechBrotherz Store, not generated filler" },
          { label: "Articles", value: `${BLOG_POSTS.length} published, more from the planned list follow` },
          { label: "Sponsored content", value: "None, ever" },
          { label: "A question the blog does not answer", value: `Call ${SITE.phone}` },
        ],
      }}
      schema={schema}
    >
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="articles-heading">
        <Heading level={2} id="articles-heading" eyebrow="Articles">
          What would you like to know?
        </Heading>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Card key={post.slug} className="flex flex-col">
              <p className="type-caption text-tb-muted">{formatDate(post.datePublished)}</p>
              <h3 className="type-h3 text-tb-text mt-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-tb-green-deep">
                  {post.title}
                </Link>
              </h3>
              <p className="type-body text-tb-muted mt-3">{post.summary}</p>
              <div className="mt-auto pt-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group text-tb-green-deep inline-flex items-center gap-1.5 font-medium hover:underline"
                >
                  Read {post.title}
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <p className="type-body measure text-tb-muted mt-10">
          More guides from the planned list follow. Every article is written by the store rather
          than generated filler, which is why the list grows a few at a time.
        </p>
      </Section>

      <Section variant="tint" aria-labelledby="blog-related-heading">
        <h2 id="blog-related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="The services these guides point to"
            links={[
              { label: "Phone unlocking and FRP removal", href: "/services/phone-unlocking" },
              { label: "Cell phone repair", href: "/services/phone-repair" },
              { label: "Laptop repair", href: "/services/laptop-repair" },
              { label: "All repair services", href: "/services" },
            ]}
          />
          <RelatedLinks
            title="Practical details"
            links={[
              { label: "Frequently asked questions", href: "/faq" },
              { label: "Directions, parking and opening hours", href: "/contact" },
            ]}
          />
        </div>
      </Section>
    </PageShell>
  );
}
