import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { PageShell } from "@/components/blocks/PageShell";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { ScopedFaqs } from "@/components/blocks/ScopedFaqs";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Heading } from "@/components/primitives/Heading";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";
import { BLOG_POSTS, blogPost } from "@/lib/content/blog";
import { composeFaqs, globalLinks } from "@/lib/faq/scoping";
import { route } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  article,
  howTo,
  localBusiness,
  organization,
  webPage,
  website,
} from "@/lib/seo/schema";
import { SITE, TEL_HREF } from "@/lib/site";
import { getAllFaqs, getReviewSummary, getSiteSettings } from "@/lib/data";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** en-CA long date from an ISO string, rendered server-side so it never shifts. */
function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPost(slug);

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
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPost(slug);

  if (!post) notFound();

  const [settings, reviews, allFaqs] = await Promise.all([
    getSiteSettings(),
    getReviewSummary(),
    getAllFaqs(),
  ]);

  const path = `/blog/${post.slug}`;

  // FAQ scoping rule, CLAUDE.md Section 8.8: page-specific questions only in
  // this page's structured data, plus at most two pointers to /faq.
  const faqs = composeFaqs({
    path,
    pageSpecific: post.faqs,
    globalLinks: globalLinks(allFaqs, ["walkin"], 2),
  });

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
      dateModified: post.datePublished,
    }),
    article({
      headline: post.title,
      description: post.seoDescription,
      path,
      datePublished: post.datePublished,
      about: post.about,
    }),
    post.howToSteps ? howTo({ name: post.title, path, steps: post.howToSteps }) : null,
    faqs.schema,
  ];

  return (
    <PageShell
      path={path}
      eyebrow="Blog"
      title={post.title}
      crumbLabel={route(path)?.label ?? post.title}
      lead={post.lead}
      answerBox={{
        answer: post.answer,
        keyFacts: post.keyFacts,
        lastUpdated: post.datePublished,
      }}
      schema={schema}
    >
      {/* --------------------------------------------------- author and date */}
      <Section className="pt-0 md:pt-0 lg:pt-0" aria-labelledby="article-meta-heading">
        <h2 id="article-meta-heading" className="sr-only">
          About this article
        </h2>
        <Card>
          <p className="type-body text-tb-text">
            Written by <strong>TechBrotherz</strong>, the walk-in repair counter at {SITE.street}{" "}
            in {SITE.city}. Published {formatDate(post.datePublished)}.
          </p>
          <p className="type-caption text-tb-muted mt-2">
            Everything here reflects how repairs are actually handled at the counter. No article on
            this site is paid for or sponsored.
          </p>
        </Card>
      </Section>

      {/* ------------------------------------------------------------ prose */}
      {post.sections.map((section, index) => (
        <Section
          key={section.heading}
          variant={index % 2 === 0 ? "tint" : "light"}
          aria-labelledby={`prose-${index}`}
        >
          <Heading level={2} id={`prose-${index}`}>
            {section.heading}
          </Heading>
          <div className="measure mt-6 space-y-5">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="type-body text-tb-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Section>
      ))}

      {/* ---------------------------------------------------------- sources */}
      {post.sources.length > 0 && (
        <Section aria-labelledby="sources-heading">
          <Heading level={2} id="sources-heading" eyebrow="Sources">
            Where these facts come from
          </Heading>
          <ul className="mt-8 space-y-5">
            {post.sources.map((source) => (
              <li key={source.href} className="measure">
                <a
                  href={source.href}
                  rel="noopener"
                  className="text-tb-green-deep inline-flex items-center gap-1.5 hover:underline"
                >
                  {source.label}
                  <ExternalLink aria-hidden="true" size={14} strokeWidth={1.5} />
                </a>
                <p className="type-body text-tb-muted mt-1">{source.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* --------------------------------------------------------- faqs */}
      <ScopedFaqs
        faqs={faqs}
        id="article-faq-heading"
        heading="Questions this article answers"
        variant={post.sources.length > 0 ? "tint" : "light"}
      />

      {/* ------------------------------------------------------ related */}
      <Section aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          Related pages
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RelatedLinks title="If this is your device" links={post.related} />
          <RelatedLinks
            title="More from the blog"
            links={[
              ...BLOG_POSTS.filter((entry) => entry.slug !== post.slug).map((entry) => ({
                label: entry.title,
                href: `/blog/${entry.slug}`,
              })),
              { label: "All repair guides and answers", href: "/blog" },
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------ cta band */}
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
