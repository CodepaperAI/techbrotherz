/**
 * The Uplift content pipeline, checked against the live payload.
 *
 * The blog body is the only HTML on this site that goes through
 * dangerouslySetInnerHTML, and the only content nobody in this repository
 * wrote. Two things have to hold on every article, and neither is visible by
 * reading a page:
 *
 * 1. **Nothing executable survives.** No script, style, iframe, object, embed
 *    or form; no javascript: or data: URL outside the image allowlist; no
 *    event handler attribute.
 * 2. **Nothing structural is broken by it.** Exactly one H1 per page means the
 *    body carries none, and every table keeps real <th scope> markup, which is
 *    what CLAUDE.md Sections 8.1 and 8.3 require.
 *
 * A short list of hand-written attack strings runs first, so the check still
 * fails loudly on a bad day when the API is unreachable and there is no live
 * content to test against.
 *
 *   pnpm test:uplift
 */

import { listArticles } from "../lib/uplift/client";
import { imageUrlsIn } from "../lib/uplift/images";
import { toHtml } from "../lib/uplift/render";

let failures = 0;

function check(label: string, condition: boolean, detail = ""): void {
  if (condition) return;
  failures += 1;
  console.log(`  FAIL  ${label}${detail ? `: ${detail}` : ""}`);
}

/* ------------------------------------------------------- the fixed fixtures */

/**
 * Every fixture opens with a <p> so it takes the HTML branch, which is the one
 * real article content takes. A fragment with no block tag is treated as
 * Markdown and escaped wholesale, which is also safe but is not the path under
 * test here.
 *
 * The assertions look for the live form, not the escaped one. Escaped text is
 * inert by definition: `&lt;script&gt;` renders as characters on the page.
 */
const ATTACKS: [string, RegExp][] = [
  ["<p>ok</p><script>alert(1)</script>", /<script|alert\(1\)/i],
  ['<p onclick="alert(1)">ok</p>', /onclick/i],
  ['<p><a href="javascript:alert(1)">x</a></p>', /href="javascript/i],
  ['<p><a href=" javascript:alert(1)">x</a></p>', /href="[^"]*javascript/i],
  ['<p><img src="x.png" onerror="alert(1)" /></p>', /onerror/i],
  ['<p>ok</p><iframe src="https://evil.test"></iframe>', /<iframe|evil\.test/i],
  ["<p>ok</p><style>body{display:none}</style>", /<style|display:none/i],
  ['<p>ok</p><form action="https://evil.test"><input /></form>', /<form|<input|evil\.test/i],
  ["<p>ok</p><svg/onload=alert(1)>", /<svg|onload/i],
  ['<p>ok<script src="https://evil.test/x.js"></script></p>', /<script|evil\.test/i],
  ['<p><a href="data:text/html;base64,PHNjcmlwdD4=">x</a></p>', /href="data:/i],
  ['<p><img src="data:text/html;base64,PHNjcmlwdD4=" alt="" /></p>', /src="data:text/i],
  ['<p><a href="https://evil.test">out</a></p>', /^(?!.*rel="noopener nofollow").*$/s],
];

console.log("Fixed fixtures");
for (const [input, forbidden] of ATTACKS) {
  const output = toHtml(input);
  check(`sanitises ${input.slice(0, 44)}`, !forbidden.test(output), output.slice(0, 90));
}

check("keeps the safe content", toHtml("<p>ok</p><script>x</script>").includes("<p>ok</p>"));
check(
  "demotes an H1 in the body",
  toHtml("<h1>Title</h1><p>body</p>") === '<h2>Title</h2><p>body</p>',
  toHtml("<h1>Title</h1><p>body</p>"),
);
check(
  "scopes bare table headers",
  toHtml("<p>x</p><table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>").includes(
    '<th scope="col">A</th>',
  ),
);

console.log("Markdown fallback");
const markdown = toHtml("# Title\n\nSome **bold** text.\n\n- one\n- two\n\n| a | b |\n| - | - |\n| 1 | 2 |");
check("demotes a markdown H1", !/<h1/i.test(markdown), markdown.slice(0, 60));
check("renders a heading", /<h2>Title<\/h2>/.test(markdown), markdown.slice(0, 80));
check("renders a list", /<ul><li>one<\/li><li>two<\/li><\/ul>/.test(markdown));
check("renders a scoped table", /<th scope="col">a<\/th>/.test(markdown));
check("wraps the table for scroll", /<div class="table-scroll"><table>/.test(markdown));

/* ---------------------------------------------------------- the live payload */

async function main(): Promise<void> {
  const articles = await listArticles();

  console.log(`\nLive payload: ${articles.length} published articles`);

  if (articles.length === 0) {
    console.log(
      "  No articles returned. Set UPLIFT_API_TOKEN to check the live content; the fixture checks above still ran.",
    );
  }

  const seenFaqs = new Map<string, string>();
  const images = new Set<string>();

  for (const post of articles) {
    const label = `/blog/${post.slug}`;
    const html = post.html;

    check(`${label} has a body`, html.length > 500, `${html.length} chars`);
    check(`${label} has no H1`, !/<h1/i.test(html));
    check(`${label} has no script`, !/<script/i.test(html));
    check(`${label} has no style block`, !/<style/i.test(html));
    check(`${label} has no iframe`, !/<iframe/i.test(html));
    check(`${label} has no event handler`, !/\son[a-z]+\s*=/i.test(html));
    check(`${label} has no javascript: URL`, !/javascript:/i.test(html));
    check(`${label} has an answer`, post.answer.length > 40, `${post.answer.length} chars`);
    check(`${label} has a description`, post.seoDescription.length > 40);
    check(`${label} has a valid published date`, !Number.isNaN(Date.parse(post.datePublished)));

    // Every table keeps real markup rather than being flattened to text.
    const tables = html.match(/<table\b/gi)?.length ?? 0;
    if (tables > 0) {
      check(
        `${label} wraps all ${tables} tables for scroll`,
        (html.match(/<div class="table-scroll">/g)?.length ?? 0) === tables,
      );
      check(`${label} keeps scoped headers`, /<th[^>]*scope="/i.test(html));
    }

    // CLAUDE.md Section 8.8: never the same question in schema on two URLs.
    for (const faq of post.faqs) {
      const key = faq.question.trim().toLowerCase();
      const owner = seenFaqs.get(key);
      check(`${label} FAQ is unique`, owner === undefined, `also on ${owner}`);
      seenFaqs.set(key, label);
    }

    check(`${label} caps FAQs at six`, post.faqs.length <= 6, `${post.faqs.length}`);

    /*
     * Every image the page will render has to actually load. Uplift serves
     * from a CDN we do not control, and on 2026-08-30 one of its two
     * Cloudinary accounts was disabled, which put a broken frame on four
     * cards. lib/uplift/images.ts drops those; this is what proves it.
     */
    for (const src of [post.featuredImage, ...imageUrlsIn(html)].filter(
      (url): url is string => Boolean(url) && /^https?:/i.test(String(url)),
    )) {
      images.add(src);
    }
  }

  const statuses = await Promise.all(
    [...images].map(async (src) => {
      try {
        const response = await fetch(src, { method: "HEAD", signal: AbortSignal.timeout(8000) });
        return { src, status: response.status };
      } catch {
        return { src, status: 0 };
      }
    }),
  );

  for (const { src, status } of statuses) {
    check(
      `image resolves ${src.slice(-46)}`,
      status !== 401 && status !== 403 && status !== 404 && status !== 410,
      `HTTP ${status}`,
    );
  }

  console.log(
    failures === 0
      ? `\nPASS: ${articles.length} articles, ${seenFaqs.size} unique FAQ questions, ${images.size} live images, no unsafe markup.`
      : `\nFAIL: ${failures} problems.`,
  );

  process.exit(failures === 0 ? 0 : 1);
}

void main();
