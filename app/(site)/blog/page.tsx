import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { ArticleImage } from "@/components/blocks/ArticleImage";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Card } from "@/components/primitives/Card";
import { Heading } from "@/components/primitives/Heading";
import { Section } from "@/components/primitives/Section";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getReviewSummary, getSiteSettings } from "@/lib/data";
import { listArticles } from "@/lib/uplift/client";
import { formatArticleDate } from "@/lib/uplift/format";

/**
 * Matches the revalidate window in lib/uplift/client.ts. An article published
 * in Uplift appears here within the hour, with no redeploy.
 */
export const revalidate = 3600;

const PATH = "/blog";

export const metadata: Metadata = buildMetadata({
  title: "Repair Guides and Answers | TechBrotherz Blog",
  description:
    "Straight answers on phone, laptop and computer problems from the TechBrotherz Store in Calgary: repairs, unlocking, water damage, tablets and when a repair is worth it.",
  path: PATH,
});

export default async function BlogIndexPage() {
  const [settings, reviews, articles] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    listArticles(),
  ]);

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "CollectionPage",
      name: "Repair guides and answers from TechBrotherz",
      description:
        "Guides on phone, laptop and computer problems, published by the TechBrotherz repair Store in Calgary.",
      path: PATH,
    }),
  ];

  const [newest] = articles;

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
          "The TechBrotherz blog answers the questions customers actually ask at the Calgary Store: what a repair involves, which symptoms mean a device is worth fixing, how unlocking works in Canada, and what to do first with a wet phone. Every article is published by the store itself under the same no-invented-facts rule as the rest of this site.",
        keyFacts: [
          { label: "Published by", value: "The TechBrotherz Store" },
          {
            label: "Articles",
            value: articles.length > 0 ? `${articles.length} published` : "Publishing shortly",
          },
          { label: "Sponsored content", value: "None, ever" },
          { label: "A question the blog does not answer", value: `Call ${SITE.phone}` },
        ],
        lastUpdated: newest?.dateModified ?? null,
      }}
      schema={schema}
    >
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="articles-heading">
        <Heading level={2} id="articles-heading" eyebrow="Articles">
          What would you like to know?
        </Heading>

        {articles.length === 0 ? (
          /*
           * The honest empty state. The blog is the one part of this site whose
           * content lives outside the repository, so it is the one part that
           * can be temporarily unavailable. Saying so beats an empty grid.
           */
          <p className="type-body measure text-tb-muted mt-10">
            The guides are not loading at the moment. Everything they cover is answered at the
            counter: call{" "}
            <a href={TEL_HREF} className="text-tb-green-deep hover:underline">
              {SITE.phone}
            </a>{" "}
            or walk in to {SITE.street} in {SITE.city}, or read the{" "}
            <Link href="/faq" className="text-tb-green-deep hover:underline">
              frequently asked questions
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card key={article.slug} className="flex flex-col">
                <ArticleImage
                  src={article.featuredImage}
                  alt={article.title}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
                  priority={index === 0}
                  className="mb-5"
                />
                <p className="type-caption text-tb-muted">
                  {formatArticleDate(article.datePublished)}
                  {article.readingTime ? ` · ${article.readingTime}` : ""}
                </p>
                <h3 className="type-h3 text-tb-text mt-3">
                  <Link href={`/blog/${article.slug}`} className="hover:text-tb-green-deep">
                    {article.title}
                  </Link>
                </h3>
                <p className="type-body text-tb-muted mt-3">{article.excerpt}</p>
                <div className="mt-auto pt-6">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group text-tb-green-deep inline-flex items-center gap-1.5 font-medium hover:underline"
                  >
                    Read {article.title}
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
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
