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

## For the shop owner: how to edit the words on a page

Prices, questions, device details and location content are all edited in the Studio at **techbrotherz.com/studio**, and the website picks the changes up within seconds.

| What you want to change | Where in the Studio |
|---|---|
| A repair price | Catalogue, then Prices |
| Your address, phone, hours or warranty length | Site, then Site settings |
| A question and its answer | Content, then Questions |
| The description of a device model | Catalogue, then Device models |
| A brand introduction, shown above its price tables | Catalogue, then Brands |
| Directions and drive times for an area | Locations |

Anything in Site settings appears in many places at once. Change the phone number there and it updates in the header, the footer, every price table, the contact page and the data Google reads, all together. That is deliberate: a phone number that is right in one place and wrong in another is worse than either.

Headings, introductions and the fixed wording of pages such as the warranty page live in the code rather than the Studio, so ask a developer to change those.

---

## For the shop owner: how to add a new phone and its prices

Everything on the website is edited at **techbrotherz.com/studio**. You never need to touch code.

### Adding a phone model

1. Open the Studio and click **Catalogue**, then **Device models**, then **All models, A to Z**.
2. Click the **+** button at the top of the list to create a new model.
3. Fill in the **Content** tab:
   - **Model name**, exactly as customers say it, for example "iPhone 17 Pro".
   - **Brand**, picked from the list.
   - **Kind of device**: phone, tablet, laptop or desktop.
   - **Year released**.
   - **Other names customers use**: nicknames and model numbers such as "iphone17pro" or "A1234". These help people find the page, so add as many as you know.
   - **Common problems with this model**: three or more real faults you see on it.
   - **Introduction**: two short paragraphs, at least 60 words.
4. Open the **Settings** tab and check the **Web address** looks right, for example `iphone-17-pro`.
5. Click **Publish** at the bottom.

### Why the Publish button sometimes refuses

Every published model gets its own page on the website. That page has to be worth visiting on its own, so the Studio will not let you publish a model until it has four things:

| What | Why |
|---|---|
| **A release year** | The page uses it to work out how old the device is, which feeds the "is it worth repairing" answer. |
| **Three or more common problems** | Real faults you see on that model. This is what makes the page useful rather than a price list. |
| **An introduction of at least 60 words** | About that specific handset. What it is, what breaks on it, what is different about repairing it. |
| **A verdict of at least 40 words** | An honest answer on whether it is still worth fixing. If the answer is no, say no. |

Prices alone are not enough, and that is deliberate. If three models carry the same prices and the same words with only the name changed, Google treats all three as low quality and it can hold back the rest of the site with them. **One good page beats three near-identical ones.**

The most important field is the introduction, and the one rule is: write about *that* device. Copying another model's introduction and changing the name is worse than leaving it empty. If you genuinely cannot think of anything true to say about a model that is not also true of the one beside it, leave it unpublished and tell your developer. That is the right answer, not a failure.

A check runs on every release that compares all the model pages against each other and fails if any two are too alike, so this rule is enforced rather than hoped for.

### Adding all the prices at once

1. With the model open, click the **arrow next to the Publish button** at the bottom of the screen.
2. Choose **Add standard repairs**.

That creates a price row for every repair that applies to this kind of device, so a phone gets all thirteen in one click. Each row starts as **Call for quote**.

### Setting a price

1. Go to **Catalogue**, then **Prices**, then **Quote only, no price set**.
2. Click a row.
3. Type the price into **Price in CAD**, including the part and the labour, and turn **Quote in person** off.
4. Click **Publish**.

A price row must have either a price or "Quote in person" turned on. It can never be left blank, because the page would have nothing to show. A row without a price shows "Call for quote" with your phone number, never an empty cell.

### Changing a price

Go to **Catalogue**, then **Prices**, then **By brand**, and pick the brand. Click the row, change the number, click **Publish**. The website updates within a few seconds. No one needs to redeploy anything.

### Prices that need checking

**Catalogue**, then **Prices**, then **Needs verification** lists every price carried over from the printed list that has not been confirmed yet. Work through it when you have a moment. Confirming a price is just turning the **Needs checking** switch off.

### Models waiting for prices

**Catalogue**, then **Device models**, then **Modern models awaiting prices** lists every recent phone and tablet whose pages are built but not yet live, because they have no prices. Add the prices, then publish the model, and the page goes live.

### Ratings

The site shows no star rating anywhere. It will not show one until real Google review numbers are entered under **Site**, then **Review summary**, and the switch is turned on. That is deliberate: an invented rating is a legal and reputational risk, and Google penalises it.

---

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
