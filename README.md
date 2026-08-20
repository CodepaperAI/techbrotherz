# TechBrotherz.com

The marketing website for **TechBrotherz**, a walk-in cell phone, tablet and computer repair shop at 3317 17 Ave SE in Calgary, Alberta.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Sanity CMS v3.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local     # fill in the values, see the table below
pnpm dev                       # http://localhost:3000
```

The design system preview lives at **http://localhost:3000/styleguide**. Every colour token, type style and component is rendered there.

From Phase 2, the content editor lives at **http://localhost:3000/studio**.

---

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start the development server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run `tsc --noEmit` |
| `pnpm format` | Format with Prettier |
| `pnpm typegen` | Regenerate `sanity/types.ts` from the schema and queries. Run after any schema change |
| `pnpm seed` | Import the seed catalogue into Sanity. Safe to re-run, it is idempotent |
| `pnpm seed:reset` | Delete every seeded document first, behind a confirmation prompt |
| `pnpm seed:verify` | Report document counts and a content hash |
| `pnpm sanity:validate` | Check every document in the dataset against the schema rules |
| `pnpm audit:pages` | Status codes, headings, JSON-LD hygiene, canonicals and page weight |
| `pnpm audit:browser` | Hydration warnings, axe, the contact form paths and Lighthouse |
| `pnpm audit:lighthouse` | Lighthouse, median of several runs |
| `pnpm audit:keyboard` | Keyboard-only pass through every interactive control |
| `pnpm test:timezone` | Open-now correctness across five system time zones |
| `pnpm test:contrast` | The design system contrast rules, as assertions |
| `pnpm audit:similarity` | Duplicate content across the model pages |
| `pnpm verify` | Every behavioural check in order. Run this before any release |
| `pnpm link-audit` | Crawl the build and fail on orphan pages or broken internal links *(from Phase 8)* |

> **`pnpm seed` overwrites Studio edits to seeded documents.** It is a setup tool, not a sync tool. Once the shop starts editing prices in the Studio, do not re-run it without checking first.

---

## Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, e.g. `https://techbrotherz.com` | Yes |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id | From Phase 2 |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` | From Phase 2 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Pinned API date, e.g. `2024-10-01` | From Phase 2 |
| `SANITY_API_READ_TOKEN` | Server-side read token. **Required.** This Sanity project rejects anonymous reads, so without it every page renders empty. Never reaches the browser | **Yes** |
| `SANITY_API_WRITE_TOKEN` | Used by `pnpm seed` only | Seed only |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the `/api/revalidate` webhook | Yes |
| `NEXT_PUBLIC_SANITY_PREVIEW_SECRET` | Secret for the Studio preview handshake | No |
| `RESEND_API_KEY` | Contact form email. The form degrades gracefully if this is missing | No |
| `CONTACT_TO_EMAIL` | Where contact form submissions are delivered | No |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement id. Analytics is skipped if unset | No |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification token | No |

---

## For developers: flipping a route from pending to built

Every URL in the site plan lives in [lib/routes.ts](lib/routes.ts), marked either `built` or `pending`. The header, the footer, the breadcrumbs and the structured data all read from that list.

A `pending` route is rendered only in development, with a small "soon" chip beside it, and is left out of the production build entirely. That is why the live site never links to a page that does not exist yet.

When you ship a page:

1. Create the route under `app/(site)/`.
2. Change that route's `status` from `"pending"` to `"built"` in `lib/routes.ts`.

That is the whole change. For the programmatic model pages, flip `MODEL_ROUTES_BUILT` in the same file once `/repair/[brand]/[model]` exists.

Check progress at **/styleguide/routes**, which lists built and pending counts per tier.

---

## For the shop owner: how the content works

There is no login and no admin panel. Every price, model, question and business fact is a file in this repository, and changing one is a small edit plus a deploy. That is a deliberate trade: you give up editing from a browser, and in exchange nothing can silently go stale, the site cannot break because a database was unreachable, and every change is reviewable before it goes live.

Ask your developer for any of these. Each is a few minutes of work.

### Changing a price

`content/data/models.ts` holds every phone, tablet and laptop, each with the repairs offered on it:

```ts
{
  "name": "Iphone 8 Plus",
  "slug": { "current": "Iphone-8-plus" },
  "brandSlug": "apple-Iphone",
  "published": true,
  "repairs": [
    { "repair": "screen-replacement", "price": 89.99 },
    { "repair": "battery-replacement", "price": 59.99 },
    { "repair": "back-glass-replacement" }
  ]
}
```

Change `89.99` and the new figure appears everywhere that price is quoted: the model page, the full price list, the Iphone hub, the screen-replacement page and the structured data search engines read.

**A repair with no `price` renders "Call for quote".** That is why the third entry above has no number. Never invent one to fill the gap.

### Adding a phone

Add an entry with the same shape. Set `published: true` when you want it live.

The build refuses a model that has neither prices nor written copy, and tells you which one. A model with prices but no copy still gets a real page: prices, what is included, warranty, turnaround and a call to action. Short and honest rather than padded. The full page follows when the copy is written.

### The business facts

`content/data/site-settings.ts` holds the address, phone number, hours, warranty and typical wait. **Change these in one place only.** The address and phone appear in dozens of places including the structured data, and they must match your Google Business Profile character for character. Getting that wrong is the single easiest way to hurt local ranking.

### Questions

`content/data/faqs.ts`. Each needs a `plainAnswer` of 320 characters or fewer, because that is the version search engines quote.

### Prices that need checking

Some entries carry `"needsVerification": true`. Those were read off the printed price list and never confirmed. They render normally. Confirming them is a one-word deletion.

### Ratings and reviews

`content/data/testimonials.ts` is empty and will stay empty until you supply real Google reviews with links. **No star rating, review count or testimonial will ever be put on this site unless it is real and verifiable.** This is not a technical limit, it is a decision, and it is the right one.

## Project documentation

| File | What it is |
|---|---|
| [CLAUDE.md](CLAUDE.md) | The project brain. Business facts, URL map, SEO / AEO / GEO checklist, linking rules, conventions and the open questions list. **Read before changing anything.** |
| [DESIGN.md](DESIGN.md) | The design system spec. Tokens, type scale, component anatomy, contrast rules, accessibility floor. |
| [CONVERSATION.md](CONVERSATION.md) | Running session log, newest first. |

---

## Ground rules for anyone working on this site

1. **Never invent a price, a review, a rating, a certification or an award.** An unknown price is "Call for quote" with the phone number as the CTA.
2. **NAP consistency is absolute.** The business name, address and phone must match `CLAUDE.md` Section 2 character for character everywhere: on the page, in JSON-LD and in `llms.txt`.
3. **No fake social proof.** No star ratings without verified Google review data, no avatar stacks, no "trusted by" logo clouds.
4. **Prices are CAD and include the part and labour.** Every repair carries a 60-day warranty.
5. **No em dashes in customer-facing copy.**
6. **Price and comparison data is always a real HTML table,** never a grid of divs. Answer engines read tables.
7. **Accessibility floor is WCAG 2.1 AA.** Visible focus, semantic landmarks, reduced motion respected.

---

## Deployment

Target is Vercel.

1. Import the repository into Vercel.
2. Add every environment variable from the table above to the Vercel project.
3. Set the production domain to `techbrotherz.com`, with `www.techbrotherz.com` redirecting to the apex.
4. From Phase 2, add a Sanity webhook pointing at `https://techbrotherz.com/api/revalidate` with the `SANITY_REVALIDATE_SECRET` value, so a price change goes live immediately instead of waiting for the hourly revalidation.

---

## Build status

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundations: scaffold, tokens, fonts, primitives, Nav / Footer / StickyCallBar, `/styleguide` | Complete |
| 2 | Sanity schemas, desk structure, queries, seed data, Studio | Complete |
| 3 | Core pages plus shared SEO infrastructure | Complete |
| 4 | Programmatic brand and model pages | Complete |
| 5 | Service hubs and repair-type pages | Pending |
| 6 | Local and neighbourhood pages | Pending |
| 7 | Guides | Pending |
| 8 | SEO finishing and audits | Pending |
| 9 | Client handover documentation | Pending |

Full client documentation, covering how to add a device model, change a price and publish a guide, is written in Phase 9.
