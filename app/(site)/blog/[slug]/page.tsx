import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleImage } from "@/components/blocks/ArticleImage";
import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { buildMetadata } from "@/lib/seo/metadata";
import { article, faqPage, localBusiness, organization, webPage, website } from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getReviewSummary, getSiteSettings } from "@/lib/data";
import { getArticle, listArticles, relatedArticles } from "@/lib/uplift/client";
import { formatArticleDate } from "@/lib/uplift/format";

/** Matches the revalidate window in lib/uplift/client.ts. */
export const revalidate = 300;

/**
 * On, deliberately. An article published in Uplift after the last build renders
 * on first request instead of 404ing until somebody redeploys, which is the
 * whole reason the blog is on a CMS and the rest of the site is not.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listArticles()).map((entry) => ({ slug: entry.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticle(slug);

  if (!post) {
    return buildMetadata({
      title: "Article not found",
      description: "That article is not on the TechBrotherz blog.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    ogImage: post.featuredImage ?? undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getArticle(slug);

  if (!post) notFound();

  const [settings, reviews, related] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    relatedArticles(post.slug),
  ]);

  const path = `/blog/${post.slug}`;

  const schema = [
    organization(settings ?? {}),
    website(settings ?? {}),
    localBusiness(settings ?? {}, reviews),
    webPage({
      type: "WebPage",
      name: post.title,
      description: post.seoDescription,
      path,
      speakableSelectors: ['[data-speakable="answer"]'],
      dateModified: post.dateModified,
    }),
    article({
      headline: post.title,
      description: post.seoDescription,
      path,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      authorName: post.authorName,
      imageUrl: post.featuredImage,
      about: post.keywords,
    }),
    /*
     * The FAQ scoping rule, CLAUDE.md Section 8.8. These questions are already
     * visible in the article's own FAQ section, so this is the structured copy
     * of what the page shows rather than a second set. The client caps them at
     * six and drops any question another article has already claimed, so the
     * same pair never appears in structured data on two URLs.
     */
    faqPage(
      post.faqs.map((faq) => ({ question: faq.question, plainAnswer: faq.answer })),
      path,
    ),
  ];

  return (
    <PageShell
      path={path}
      eyebrow="Blog"
      title={post.title}
      crumbLabel={post.title}
      lead={post.excerpt}
      answerBox={{
        answer: post.answer,
        keyFacts: [
          { label: "Published", value: formatArticleDate(post.datePublished) },
          { label: "Last updated", value: formatArticleDate(post.dateModified) },
          ...(post.readingTime ? [{ label: "Reading time", value: post.readingTime }] : []),
          { label: "Questions about your own device", value: `Call ${SITE.phone}` },
        ],
        lastUpdated: post.dateModified,
      }}
      schema={schema}
    >
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="article-heading">
        <h2 id="article-heading" className="sr-only">
          {post.title}
        </h2>

        <ArticleImage
          src={post.featuredImage}
          alt={post.title}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="mb-10"
        />

        <Card className="measure mb-12">
          <p className="type-body text-tb-text">
            Published by <strong>{post.authorName ?? SITE.brandName}</strong> at TechBrotherz, the
            walk-in repair Store at {SITE.street} in {SITE.city}.{" "}
            {formatArticleDate(post.datePublished)}
            {post.dateModified.slice(0, 10) !== post.datePublished.slice(0, 10)
              ? `, updated ${formatArticleDate(post.dateModified)}`
              : ""}
            .
          </p>
          <p className="type-caption text-tb-muted mt-2">
            No article on this site is paid for or sponsored. For a quote on your own device, call{" "}
            <a href={TEL_HREF} className="text-tb-green-deep hover:underline">
              {SITE.phone}
            </a>
            .
          </p>
        </Card>

        <ArticleBody html={post.html} />
      </Section>

      <Section variant="tint" aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks
            title="The services this guide points to"
            links={[
              { label: "Cell phone repair", href: "/services/phone-repair" },
              { label: "Laptop repair", href: "/services/laptop-repair" },
              { label: "IPad repair", href: "/services/ipad-repair" },
              { label: "Directions, parking and opening hours", href: "/contact" },
            ]}
          />
          <RelatedLinks
            title="More from the blog"
            links={[
              ...related.map((entry) => ({
                label: entry.title,
                href: `/blog/${entry.slug}`,
              })),
              { label: "All repair guides and answers", href: "/blog" },
            ]}
          />
        </div>
      </Section>

      <Section variant="dark" contained={false}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="type-h2 text-tb-white">Rather just ask a person?</h2>
              <p className="type-lead measure text-tb-muted-dark mt-4">
                Call {SITE.phone} and describe the problem, or walk in to {SITE.street} in{" "}
                {SITE.city}. Every repair is quoted free before any work starts.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PillButton href={TEL_HREF} withArrow={false}>
                Call {SITE.phone}
              </PillButton>
              <PillButton href="/contact" variant="ghostOnDark">
                Get a quote
              </PillButton>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
