# CLAUDE.md — TechBrotherz.com Project Brain

> ## LAUNCH BLOCKER — do not launch until this is cleared
>
> **The remaining 7a-ii-a price machinery is unfinished.** Every authored content
> file is clean, but the rendered site still shows prices, because they come from
> code rather than copy:
>
> - the model and service page components interpolating `fromPrice` into
>   AnswerBoxes and key facts
> - `lib/faq/generated.ts` in `brandFaqs`, still on the brand hubs
> - the generated model meta descriptions
> - `lib/content/hydrate-prices.ts`, `lib/seo/schema.ts` Offer and ItemList
>   nodes, and the price archive to `content/archive/prices-2026-08.ts`
> - `/repair-prices` still exists and `/get-a-quote` has not been built
>
> `pnpm verify` is red and stays red until this is done. The site looking
> finished is exactly why this is recorded at the top of the file: the client
> asked for no prices anywhere, and the visual rebuild makes it easy to forget
> that the rendered output still has them. **Guard: `pnpm exec tsx
> scripts/test-no-prose-prices.ts` currently reports 76 prose and 55 meta
> failures. It must report zero.**
>
> **2026-08-10 status:** the guard reports **zero failures across 143 pages**
> on the current build, and the schema audit shows no price-less Offers, so
> the machinery items above are done or moot on this tree. Still outstanding
> from the list: `/get-a-quote` has not been built (`/repair-prices` 301s to
> `/contact` instead). Verify the remaining items before declaring this
> cleared and removing the block.
>
> ## Named follow-up — brand tier similarity
>
> The brand tier moved 36.9% to 38.0% when `brandFaqs` was re-grounded off price
> in Phase 8. Diagnosis: the same failure that Option 1 hit on model pages. The
> generated brand answers now lean on model counts, release-year spans and
> repair-name lists, which read alike across nine hubs in a way a price range did
> not. The fix that worked on model pages is the same one-line change: cut the
> generated block and let scoping drop the global teasers with it. Model pages
> went from 45 pairs above 50% to 2 that way. Not done, not this session.

> **Read this before every task.**
> Before adding any page or component, re-read [DESIGN.md](DESIGN.md) and the SEO checklist in Section 8 of this file.
> After every working session, append an entry to [CONVERSATION.md](CONVERSATION.md).

---

## 1. Project summary

TechBrotherz is a walk-in cell phone, tablet and computer repair shop in Calgary, Alberta. This repository is a production marketing website built to do four jobs, in priority order:

1. Rank first for local repair searches in Calgary, Chestermere and Airdrie (classic local SEO).
2. Get quoted by AI answer engines: ChatGPT, Perplexity, Google AI Overviews, Copilot, Gemini (AEO / GEO).
3. Let the shop owner have every brand, model, repair type and price live in one readable file per type, changed in a pull request.
4. Convert walk-in intent fast: phone, directions, hours and "no appointment needed" always one tap away.

---

## 2. Business facts (single source of truth)

These live in `content/data/site-settings.ts`. Code reads them from there. The typed fallback lives in `lib/site.ts` and must stay identical. **Never hardcode NAP anywhere else.**

| Field                        | Value                                                             |
| ---------------------------- | ----------------------------------------------------------------- |
| Legal / brand name           | TechBrotherz                                                      |
| Descriptor                   | Cell Phone / Computer Repair                                      |
| Domain                       | techbrotherz.com                                                  |
| Street                       | 3317 17 Ave SE                                                    |
| City / Region                | Calgary, Alberta                                                  |
| Country                      | Canada                                                            |
| Postal code                  | TODO(client)                                                      |
| Phone (display)              | (403) 273-8324                                                    |
| Phone (raw, tel: and schema) | +14032738324                                                      |
| Locale                       | en-CA                                                             |
| Currency                     | CAD                                                               |
| Hours Mon to Fri             | 10:00 AM to 7:00 PM                                               |
| Hours Saturday               | 10:00 AM to 7:00 PM                                               |
| Hours Sunday                 | 11:00 AM to 5:00 PM                                               |
| Warranty                     | 60 days on all repairs                                            |
| Appointments                 | Not required, walk-ins welcome                                    |
| Typical wait                 | Approximately 30 minutes on most repairs                          |
| Pricing note                 | All prices include part and labour                                |
| Service area                 | Calgary, Chestermere, Airdrie and surrounding Alberta communities |

**NAP consistency is absolute.** Every mention of name, address and phone must match this table character for character: on the site, in JSON-LD, in `llms.txt`, and in the off-site directory listings in Section 12.

### 2.1 Services actually offered

Do not add any others. Do not imply any others.

Cell phone repair, iPhone repair, Samsung Galaxy repair, Google Pixel repair, iPad repair, tablet repair, computer and laptop repair, virus removal, Windows installation with Office and security, desktop clean-up and tune-up, program installation, hardware installation, diagnostics, password reset, laptop screen replacement, DC / charging port replacement, laptop keyboard replacement, carrier unlocking, smartphone sales.

**Removed 2026-08 on the client's instruction:** LG, Motorola, HTC and Google Nexus repair. The four brand hubs and fifteen model pages 301 to `/services/phone-repair`. Open question for the client: refused outright, or still taken at the counter without promotion? If the latter, one line on `/services/phone-repair` can say so.

---

## 3. Non-negotiable ground rules

1. **Never invent a price, certification, review, star rating, customer count or award.** Unknown price means the value is `Call for quote` and the CTA is the phone number.
2. **Never ship fake social proof.** No fake avatar stacks, no invented "4.9 out of 5" badges, no fake "trusted by" logo clouds. Real trust signals only: 60-day warranty, no appointment required, approximately 30-minute typical wait, all Canadian carriers unlocked, parts and labour included in every price.
3. **`AggregateRating` schema is only emitted if real Google review data is supplied by the client and written into `content/data/testimonials.ts` and the review summary.** Until then the code path stays dormant. See `aggregateRating()` in `lib/seo/schema.ts`, which returns `null` unless the `reviewSummary` singleton is enabled and complete.
4. **Currency is CAD. Locale is `en-CA`.** Canadian English spelling, kept natural.
5. **No em dashes anywhere in user-facing copy.** Use commas, colons or full stops.
6. **No lorem ipsum in committed code.** Write real copy, or leave a clearly marked `TODO(client)` note against the field.
7. **Accessibility floor:** WCAG 2.1 AA contrast, visible keyboard focus, semantic landmarks, `prefers-reduced-motion` respected.
8. **Every page must be reachable.** No orphans. See Section 9.

---

## 4. Tech stack

| Concern    | Choice                                                        | Version                       |
| ---------- | ------------------------------------------------------------- | ----------------------------- |
| Framework  | Next.js, App Router                                           | 15.x                          |
| Language   | TypeScript, `strict: true`                                    | 5.x                           |
| Runtime    | React                                                         | 19.x                          |
| Styling    | Tailwind CSS v4, tokens in `@theme`                           | 4.x                           |
| Content    | TypeScript constants in `content/data/` and `lib/content/`    | n/a                           |
| Images     | `next/image`, local files under `public/`                     | built in                      |
| Icons      | `lucide-react`, stroke width 1.5, no other icon set           | latest                        |
| Fonts      | `next/font`, `display: swap`, self-hosted, subset `latin`     | built in                      |
| Validation | `zod`                                                         | 3.x                           |
| Email      | Resend, env driven, degrades gracefully if key missing        | latest                        |
| Analytics  | GA4 + Google Search Console via env vars, `@vercel/analytics` | latest                        |
| Deploy     | Vercel                                                        | n/a                           |

**Rendering rules**

- Every page is prerendered at build time. There is no data source to revalidate against, so `revalidate` and the webhook are gone.
- Motion is CSS transitions plus `IntersectionObserver` reveals. **Do not add Framer Motion** unless a section genuinely cannot be done in CSS, and record the reason in CONVERSATION.md.
- Forms are server actions with `zod` validation, a honeypot field and a rate limit.

---

## 5. Directory structure

```
techbrotherz/
├── app/
│   ├── (site)/                  Public marketing pages. Shares Nav + Footer + StickyCallBar.
│   │   ├── layout.tsx           Site chrome wrapper.
│   │   └── page.tsx             Home.
│   ├── layout.tsx               Root html/body, fonts, analytics, global JSON-LD.
│   ├── globals.css              Tailwind v4 import + @theme design tokens. Single token source.
│   ├── not-found.tsx            404 that suggests nearest model, service and location page.
│   ├── robots.ts                Dynamic robots.txt.
│   └── sitemap.ts               Dynamic sitemap.xml from the content constants.
├── components/
│   ├── primitives/              Container, Section, Eyebrow, Heading, PillButton, Card, Chip.
│   ├── blocks/                  PageShell, AnswerBox, PriceTable, PriceFilter, ModelGrid,
│   │                            FaqAccordion, IconCard, StepCard, SplitBlock, TrustStrip,
│   │                            RelatedLinks, LocalInfoCard, MapReveal, OpenNowBadge,
│   │                            Breadcrumbs, RichText, ContactForm, NotFoundSuggestions.
│   ├── layout/                  Nav, Footer, StickyCallBar, Logo.
│   ├── seo/                     JsonLd, one script tag holding one @graph.
│   └── motion/                  Reveal (IntersectionObserver wrapper).
├── lib/
│   ├── data/                    The accessor layer. The only thing pages import content from.
│   ├── site.ts                  Typed business constants. Mirrors content/data/site-settings.ts.
│   ├── routes.ts                The route registry. Source of truth for built vs pending.
│   ├── nav.ts                   Header and footer matrices, derived from the registry.
│   ├── seo/metadata.ts          buildMetadata(), the only place page metadata is assembled.
│   ├── seo/schema.ts            Every JSON-LD builder, plus compact() and buildGraph().
│   ├── site-url.ts              The canonical origin, as a constant. No env var required.
│   ├── rate-limit.ts            Fixed-window limiter for the contact form.
│   └── utils.ts                 cn(), formatPrice(), formatMinutes(), isOpenNow(), slugify().
├── content/
│   ├── data/                    The content. One file per type, plus hand-written types.ts.
│   ├── models/                  Per-model prose, one file per slug.
│   ├── locations/               Tier 6 place copy.
│   ├── local-inventory.md       Every local fact, with its source. Gates local pages.
│   └── image-manifest.md        Slot, source, photographer, ratio and alt for each image.
├── scripts/
│   ├── audit-pages.ts           Status, headings, JSON-LD hygiene, canonicals, page weight.
│   ├── audit-browser.ts         Hydration, axe, the contact form paths, Lighthouse.
│   ├── audit-lighthouse.ts      Lighthouse, median of N runs.
│   ├── measure-dom.ts           DOM node counts and transfer sizes.
│   ├── test-keyboard.ts         Keyboard-only pass through every interactive control.
│   ├── test-timezone.ts         Open-now correctness across five system time zones.
│   └── link-audit.ts            Crawls the build, fails CI on orphans and internal 404s (Phase 8).
├── public/                      Static assets, logo, fonts if self-hosted locally.
├── CLAUDE.md                    This file.
├── DESIGN.md                    Design system spec.
├── CONVERSATION.md              Running session log, newest first.
└── README.md                    Client handover documentation.
```

---

## 6. Content model

**There is no CMS and no database.** Every fact the site renders is a TypeScript constant compiled into the build. That is the end of the road Phase 6.9 started down: it collapsed 17 Sanity document types to six under the rule "if the shop owner will not edit it, it does not belong in Sanity", and the remaining six went the same way when the decision was made that nothing is edited through a CMS at all.

### Where the content lives

| File                              | Holds                                                            | Rows |
| --------------------------------- | ---------------------------------------------------------------- | ---- |
| `content/data/site-settings.ts`   | The business facts. NAP, hours, warranty, wait time, disclaimer  | 1    |
| `content/data/models.ts`          | Every device model, with its offered repairs and prices inline   | 141  |
| `content/data/faqs.ts`            | The question bank                                                | 20   |
| `content/data/flat-services.ts`   | Fixed-price computer services                                    | 10   |
| `content/data/unlocking.ts`       | Carrier unlocking                                                | 1    |
| `content/data/locations.ts`       | The eleven places the site describes                             | 11   |
| `content/data/testimonials.ts`    | Real reviews only. **Empty, and stays empty until supplied**     | 0    |
| `content/data/types.ts`           | The types for all of the above, hand written                     | n/a  |
| `content/models/<slug>.ts`        | Per-model prose: introduction, issues, verdict, repair notes     | 156  |
| `lib/content/brands.ts`           | The five brands (nine until the 2026-08 removals)                | 5    |
| `lib/content/repair-types.ts`     | The sixteen repair types and the price groups                    | 16   |
| `lib/content/services.ts`, `repairs.ts`, `places.ts`, `core-faqs.ts` | Tier 2, 3, 5 and 6 page copy               | n/a  |

### The accessor layer, `lib/data/`

Pages never import a constant directly. They call an accessor, exactly as they did when the data came from GROQ, and the accessors return the same shapes with the same names and signatures. That is deliberate: the move off Sanity changed no page file, because a refactor that changes every consumer is a rewrite in disguise.

| File                     | Replaces                                                       |
| ------------------------ | -------------------------------------------------------------- |
| `lib/data/catalogue.ts`  | Every model, brand and price query                              |
| `lib/data/content.ts`    | FAQs, flat services, unlocking, testimonials                    |
| `lib/data/locations.ts`  | The three location queries                                      |
| `lib/data/site.ts`       | Site settings, navigation, review summary, redirects            |
| `lib/data/index.ts`      | The barrel. The only thing pages import                         |

Each function names the GROQ query it replaces, so the two can be compared.

**The orderings are ported, not reinvented.** `order(releaseYear desc, name asc)` is `byYearThenName`, and its string half compares by code point because that is what GROQ does and `localeCompare` quietly disagrees on punctuation. This is not a theoretical concern: the Phase 6.9 pass dropped a tie-break in the brand statistics and a `published` filter in the locations accessor, and both reached rendered pages. Neither was a type error. **The page diff is what catches this class of bug, so run it.**

### What went away with the dataset

- **Cache tags, ISR and the revalidation webhook.** A constant cannot go stale.
- **Draft mode.** Every query carried a `$draft` parameter that relaxed its `published == true` filter for the Studio preview pane. `published` is now simply read at build time.
- **The read token, and its failure mode.** A missing `SANITY_API_READ_TOKEN` made every query return zero rows and still produced a complete, empty site. A build now either has the content or does not compile.
- **The build determinism check.** It existed because Next persisted fetch results in `.next/cache` between builds, so a rebuild after a content change could silently serve the old content. There is no fetch cache to go stale.
- **The write guard.** There is nothing to write to.
- **`sanity typegen`.** Types are hand written in `content/data/types.ts`, next to the data.

### Editing content

Change the file, commit, deploy. A price edit is one number in `content/data/models.ts`.

`published: true` is what puts a model on the site; `false` holds it back, which is how 72 seeded models stay unpublished until someone writes them copy. The build fails and names the slug if a model has neither prices nor copy. See the lean-page fallback in Section 8.10.

**The conventions that survived the move, both on purpose.** `slug` is still an object with a `current` string, because that is how every consumer already reads it. And an absent field still means the fact is not known, never blank: there is no postal code, no geo, no founding year and no payment methods in `site-settings.ts`, `compact()` drops absent fields from the structured data, and no page invents them.

## 7. URL map

Status legend: `built` / `pending`. Update this table as pages ship.

### Tier 1 — Core

**The route registry in `lib/routes.ts` is the source of truth for build status.** This table mirrors it. Flip a route to `built` there and the header, footer and breadcrumbs pick it up automatically.

| URL               | Status                                           |
| ----------------- | ------------------------------------------------ |
| `/`               | built                                            |
| `/services`       | built                                            |
| `/repair-prices`  | built                                            |
| `/locations`      | built                                            |
| `/faq`            | built                                            |
| `/about`          | built                                            |
| `/contact`        | built                                            |
| `/warranty`       | built                                            |
| `/privacy-policy` | built, **needs a lawyer's review before launch** |
| `/terms`          | built, **needs a lawyer's review before launch** |
| `/guides`         | pending, ships in Phase 7 with its articles      |
| `/sitemap` (HTML) | pending, Phase 8                                 |

### The four templates and what each one answers

Phase 5 revised this map. The original plan had four page types competing for iPhone repair intent: the Tier 4 brand hub, a Tier 2 `/services/iphone-repair` hub, a Tier 3 repair page under it, and a Tier 5 local page. The brand hub shipped in Phase 4 and already owns the device-catalogue intent, so the brand-specific Tier 2 hubs were removed rather than built to compete with it.

| Template                  | Answers                                         | Example query                    |
| ------------------------- | ----------------------------------------------- | -------------------------------- |
| `/services/[service]`     | What this service covers and how it works       | "phone repair"                   |
| `/repairs/[repair]`       | One repair, every model we do it on, all prices | "iphone screen replacement cost" |
| `/repair/[brand]`         | Which device do you have                        | "iphone repair prices"           |
| `/repair/[brand]/[model]` | This exact handset                              | "iphone 8 plus repair cost"      |
| Tier 5, Phase 6           | Where we are, and getting here                  | "iphone screen repair calgary"   |

Nothing was ever live at the old Tier 2 and Tier 3 URLs, so **no redirects are needed and those URLs return 404**. `pnpm audit:pages` asserts that.

### Tier 2 — Service hubs, `/services/[service]`, built

Device categories and non-device services only. No brand-specific hubs.

`/services/phone-repair` · `/services/tablet-repair` · `/services/laptop-repair` · `/services/computer-repair` · `/services/phone-unlocking` · `/services/password-reset` · `/services/virus-removal`

`/services/data-backup` stays unbuilt until open question 9 is answered.

### Tier 3 — Repair-type pages, `/repairs/[repair]`, built

A flat namespace, deliberately separate from `/repair/` so a repair slug can never collide with a brand or model slug. Each page is one repair across every model we do it on, sorted by price, which is the cut of the price data no other template presents.

`/repairs/{iphone-screen-replacement, iphone-battery-replacement, iphone-charging-port-repair, iphone-camera-repair, iphone-back-glass-replacement}` · `/repairs/{samsung-screen-replacement, samsung-battery-replacement, samsung-back-glass-replacement, samsung-charging-port-repair}` · `/repairs/ipad-screen-replacement` · `/repairs/{laptop-screen-replacement, laptop-keyboard-replacement, laptop-charging-port-repair}` · `/repairs/{windows-installation, computer-tune-up, computer-diagnostics}`

Copy for both tiers lives in `lib/content/services.ts` and `lib/content/repairs.ts`, typed, with every price read from `content/data/models.ts` through `buildPriceContext()` rather than written into the prose. A price change in the Studio moves every sentence that quotes it.

### Tier 4 — Programmatic (from `content/data/models.ts`), built

5 brand hubs at `/repair/[brand]`, and 69 model pages at `/repair/[brand]/[model]`, all prerendered. 72 further models are seeded but unpublished, held back until someone writes them content of their own. Every published model carries an introduction, three or more model-specific issues and a verdict. (9 hubs and 84 model pages until the 2026-08 removal of LG, Motorola, HTC and Google Nexus; those 19 URLs 301 to `/services/phone-repair`.)

### Tier 5 — Service and place, `/[locality]`, built

Ten pages, differentiating on **service**, which is the axis the Phase 5 repair tier proved works.

`/phone-repair-calgary` · `/iphone-screen-repair-calgary` · `/samsung-repair-calgary` · `/ipad-repair-calgary` · `/tablet-repair-calgary` · `/laptop-repair-calgary` · `/computer-repair-calgary` · `/phone-unlocking-calgary` · `/walk-in-phone-repair-calgary` · `/cell-phone-repair-chestermere`

Cut in Phase 6: `/same-day-phone-repair-calgary` merged into the walk-in page (they differed by modifier, not service), `/laptop-repair-chestermere` (a second page leaning on the same single road fact), and both Airdrie pages (see below).

### Tier 6 — Place, `/locations/[...place]`, built

Three pages. `/locations/calgary` · `/locations/calgary/forest-lawn` · `/locations/chestermere`

The seven other Calgary neighbourhoods are **anchored sections on `/locations/calgary`**, not URLs, along with an honest Airdrie section. Eleven pages about one shop is a differentiation problem no template solves.

### The local-fact rule

**A page with fewer than four genuinely distinct, verifiable facts does not ship.** "Distinct" means true of that page and not of its siblings, so the address, hours, warranty, prices and walk-in policy count for none of them.

The inventory that applies this rule lives at `content/local-inventory.md` and is built **before** any local page. It is the source for future local pages and it records what each URL can honestly claim.

**What it cut in Phase 6:** all three Airdrie pages. Airdrie reached three verified facts, two of which were reasons not to make the trip, with no shared road, no landmark, no direct transit and a drive-time range too wide to state. `areaServed` still lists Airdrie on every `LocalBusiness` node, because not publishing a page about a town is not the same as not serving it.

**What it corrected:** the shop is **not in Forest Lawn**. 17 Avenue SE runs through Inglewood, Albert Park/Radisson Heights, Southview and then Forest Lawn, which begins around 36 Street. At 3317, the shop is at 33 Street, with Albert Park/Radisson Heights north and Southview south. It is on International Avenue, which is what causes the confusion, and the Forest Lawn page says "a few blocks west" rather than claiming otherwise.

**The accuracy anchor** is `/locations/calgary` and `/contact`. Those two must be exactly right, because they are what the Google Business Profile is reconciled against in Phase 9.

### Verification of local claims

Every local fact is sourced in `content/local-inventory.md`. Where a fact could not be verified it is **left out and added to the open questions**, never approximated. No drive times, no guessed transit routes, no unconfirmed landmarks. A wrong bus route on a local page is a credibility failure in front of exactly the audience the page exists to serve.

### Fact concentration

The best local facts are true of every local page at once: one shop, one street, one transit station. Repeating them turns the strongest asset on the site into boilerplate, which is the Phase 5 FAQ lesson applied to place.

So **each shared fact has exactly one page that carries it in full**, and every other page gets a single sentence written for that page plus a link. `lib/content/local-shared.ts` throws at render time on a violation. `pnpm audit:local-facts` reports which page carries what.

| Fact                                                   | In full on               | Mentioned on |
| ------------------------------------------------------ | ------------------------ | ------------ |
| 33 Street SE Station and the 17 Avenue Transitway      | `/locations/calgary`     | 10 pages     |
| International Avenue, and where the shop actually sits | `/locations/calgary`     | 1 page       |
| 17 Avenue SE continuing east as Chestermere Boulevard  | `/locations/chestermere` | 1 page       |

### Tier 7 — Guides

14 guides listed in the brief, all pending. See Section 13 phase 7.

### Utility

`/sitemap.xml` · `/robots.txt` · `/llms.txt` · `/llms-full.txt` · `/opensearch.xml` (optional).

### Internal

| URL                                     | Status | Notes                                                                                                        |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `/styleguide`                           | built  | Renders every token and component. `noindex`, and excluded from the sitemap and the HTML sitemap.            |
| `/styleguide/data`                      | built  | Renders live Sanity content through the real components, plus the raw JSON-LD a model page emits. `noindex`. |

### 7.1 Cannibalisation guard

Tier 2 pages are about **the repair**. Tier 5 pages are about **the place**. They must never share a primary keyword, an H1 or an AnswerBox. Tier 5 carries NAP, map, directions, drive times, parking, transit and walk-in policy. Tier 2 carries process, parts, symptoms, what is included and device coverage. They link to each other reciprocally.

---

## 8. SEO / AEO / GEO checklist

**Run this whole checklist on every new page. No exceptions.**

### 8.1 Technical

- [ ] `generateMetadata` present. Title ≤ 60 chars, unique. Description ≤ 155 chars, unique.
- [ ] `alternates.canonical` set. `alternates.languages: { 'en-CA': <url> }`.
- [ ] OG and Twitter cards set. Per-page OG image via `opengraph-image.tsx`.
- [ ] Exactly one `<h1>`. H2/H3 nest logically, no skipped levels.
- [ ] Registered in `app/sitemap.ts` with `lastModified` from `_updatedAt`, correct `changeFrequency` and `priority` (home 1.0, local landing 0.9, service hub 0.8, model 0.7, guide 0.6).
- [ ] All images `next/image`, explicit width and height, AVIF/WebP, descriptive alt naming the device and repair, `priority` on hero only, lazy below the fold.
- [ ] No layout shift from fonts. `size-adjust` fallback metrics configured.
- [ ] URL lowercase, hyphenated, no trailing slash, no query strings for content.
- [ ] Page appears in the HTML sitemap at `/sitemap`.
- [ ] Core Web Vitals: LCP < 2.0s, CLS < 0.05, INP < 200ms. Zero unused JS on static pages.

### 8.2 Structured data (via the typed `<JsonLd>` component)

- [ ] Every page: `Organization` + `WebSite` with `SearchAction`, plus `BreadcrumbList`.
- [ ] Home, `/contact`, all local pages: `LocalBusiness`, `additionalType: ["MobilePhoneStore","ComputerStore"]`, `@id: https://techbrotherz.com/#business`, full `address`, `geo`, `telephone`, `openingHoursSpecification`, `areaServed` (Calgary, Chestermere, Airdrie), `priceRange: "$$"`, `hasMap`, `paymentAccepted`, `currenciesAccepted: "CAD"`.
- [ ] Service hubs and repair-type pages: `Service` with `provider: {"@id": "...#business"}`, `serviceType`, `areaServed`, `hasOfferCatalog`.
- [ ] Model pages: `ItemList` of `Offer`, each `priceCurrency: "CAD"`, `price`, `availability`, `warranty: { durationOfWarranty: "P60D" }`. `quoteOnly` entries emit the Offer with no `price`, `availability: InStock`, plus a `potentialAction` of type `ContactAction`.
- [ ] Every FAQ block: `FAQPage` built from `plainAnswer`. **Never duplicate the same question in two FAQPage blocks on one page.**
- [ ] Guides: `Article` or `HowTo` with `author`, `datePublished`, `dateModified`, `about`, `mentions`.
- [ ] Where a single clear answer exists: `speakable` with CSS selectors pointing at the AnswerBox.
- [ ] Validated against Google Rich Results Test before the phase is marked done.

### 8.3 AEO (getting quoted)

- [ ] **AnswerBox directly under the H1.** Bolded 40 to 60 word direct answer that stands alone and names the entity ("TechBrotherz in Calgary charges ..."), then 3 to 5 "Key facts" bullets (price or range, time, warranty, appointment policy, location), then "Last updated" bound to Sanity `_updatedAt`.
- [ ] **H2s phrased as real questions.** "How much does an iPhone 8 screen replacement cost in Calgary?" not "Pricing".
- [ ] **Self-contained paragraphs.** Each paragraph makes sense lifted out alone. No "as mentioned above". No pronoun referring across paragraphs. Restate the subject.
- [ ] **Real `<table>` markup with `<th scope>` wherever prices, times or comparisons appear.** Never a div grid.
- [ ] **Numbers, not adjectives.** "60-day warranty", "about 30 minutes", "$89.99 including part and labour". Not "fast", "affordable", "great".
- [ ] **6 to 10 FAQs** pulled from `content/data/faqs.ts`, filtered to this page's service, model or location.
- [ ] **"People also ask" strip** linking to the guides that answer those questions.
- [ ] Definition patterns where relevant: "A digitizer is the touch-sensitive glass layer above the LCD."
- [ ] Content reflected into `llms.txt` / `llms-full.txt` if the page is a core service or price page.

### 8.4 GEO (being the preferred source)

- [ ] **Entity string repeated in the first paragraph:** "TechBrotherz, a walk-in cell phone and computer repair shop at 3317 17 Ave SE in Calgary, Alberta".
- [ ] **Unique quotable data surfaced as standalone facts,** not buried in prose: our actual prices, the 60-day warranty, the approximately 30-minute typical wait, the no-appointment policy, the $35 carrier unlock.
- [ ] **External authority cited** where a general claim is made (Apple official repair pricing, CRTC unlocking rules, Statistics Canada). Name the source in text, link with `rel="noopener"`.
- [ ] **Author and expertise signals.** Every guide has a named author with role and years of experience from the `author` schema. Only state what is true.
- [ ] **Freshness.** `dateModified` shown on guides and price pages, driven by the `_updatedAt` on the content record.
- [ ] **Comparison tables** where a comparison exists: repair vs replace, third-party vs manufacturer, screen vs LCD, model vs model.

### 8.5 Keyword to URL map

One primary keyword per URL. No overlaps. Add a row before building any new page.

| URL                                                | Primary keyword                          | Supporting                                    |
| -------------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| `/`                                                | cell phone repair calgary                | phone repair calgary, computer repair calgary |
| `/repair-prices`                                   | phone repair prices calgary              | cell phone repair cost calgary                |
| `/warranty`                                        | phone repair warranty                    | 60 day repair warranty                        |
| `/services/phone-repair`                           | cell phone repair                        | phone repair service, mobile phone repair     |
| `/services/tablet-repair`                          | tablet repair                            | ipad repair, android tablet repair            |
| `/services/laptop-repair`                          | laptop repair                            | notebook repair                               |
| `/services/computer-repair`                        | computer repair                          | desktop pc repair                             |
| `/services/phone-unlocking`                        | how to unlock a cell phone               | unlock phone canada, carrier unlock cost      |
| `/services/password-reset`                         | computer password reset                  | windows password reset service                |
| `/services/virus-removal`                          | virus removal service                    | computer malware removal                      |
| `/repairs/iphone-screen-replacement`               | iphone screen replacement                | iphone screen repair cost                     |
| `/repairs/iphone-battery-replacement`              | iphone battery replacement               | iphone battery repair                         |
| `/repairs/iphone-charging-port-repair`             | iphone charging port repair              | iphone will not charge                        |
| `/repairs/iphone-camera-repair`                    | iphone camera repair                     | iphone camera replacement cost                |
| `/repairs/iphone-back-glass-replacement`           | iphone back glass replacement            | cracked iphone back                           |
| `/repairs/samsung-screen-replacement`              | samsung screen replacement               | galaxy screen repair cost                     |
| `/repairs/samsung-battery-replacement`             | samsung battery replacement              | galaxy battery repair                         |
| `/repairs/samsung-back-glass-replacement`          | samsung back glass replacement           | galaxy back glass repair                      |
| `/repairs/samsung-charging-port-repair`            | samsung charging port repair             | galaxy will not charge                        |
| `/repairs/ipad-screen-replacement`                 | ipad screen replacement                  | ipad glass replacement cost                   |
| `/repairs/laptop-screen-replacement`               | laptop screen replacement                | laptop screen repair cost                     |
| `/repairs/laptop-keyboard-replacement`             | laptop keyboard replacement              | laptop keyboard repair cost                   |
| `/repairs/laptop-charging-port-repair`             | laptop charging port repair              | laptop dc jack repair                         |
| `/repairs/windows-installation`                    | windows installation                     | windows install service                       |
| `/repairs/computer-tune-up`                        | computer tune up                         | computer clean up service                     |
| `/repairs/computer-diagnostics`                    | computer diagnostics                     | pc diagnostic service                         |
| `/repair/apple-iphone`                             | iphone repair prices                     | apple iphone repair cost                      |
| `/repair/apple-iphone/iphone-8-plus`               | iphone 8 plus screen replacement         | iphone 8 plus repair cost                     |
| `/phone-repair-calgary`                            | phone repair calgary                     | cell phone repair calgary shop                |
| `/iphone-screen-repair-calgary`                    | iphone screen repair calgary             | cracked iphone screen calgary                 |
| `/samsung-repair-calgary`                          | samsung repair calgary                   | samsung screen repair calgary                 |
| `/ipad-repair-calgary`                             | ipad repair calgary                      | ipad screen repair calgary                    |
| `/tablet-repair-calgary`                           | tablet repair calgary                    | android tablet repair calgary                 |
| `/laptop-repair-calgary`                           | laptop repair calgary                    | laptop screen repair calgary                  |
| `/computer-repair-calgary`                         | computer repair calgary                  | pc repair calgary                             |
| `/phone-unlocking-calgary`                         | phone unlocking calgary                  | unlock phone calgary                          |
| `/walk-in-phone-repair-calgary`                    | walk in phone repair no appointment      | same day phone repair calgary                 |
| `/cell-phone-repair-chestermere`                   | cell phone repair chestermere            | phone repair chestermere                      |
| `/locations/calgary`                               | repair shop 17 ave se calgary            | international avenue repair shop              |
| `/locations/calgary/forest-lawn`                   | phone repair forest lawn                 | repair shop international avenue calgary      |
| `/locations/chestermere`                           | repair shop near chestermere             | chestermere phone repair drive                |
| `/guides/how-to-unlock-a-cell-phone-in-canada`     | how to unlock a cell phone               | unlock phone canada legally                   |
| `/guides/ipad-repair-vs-replacement-cost`          | ipad repair vs replacement cost          | is it worth repairing an ipad                 |
| `/guides/signs-your-laptop-needs-repair`           | signs your laptop needs repair           | laptop problems, when to repair a laptop      |
| `/guides/iphone-screen-repair-cost-calgary`        | iphone screen repair cost calgary        | how much to fix iphone screen calgary         |
| `/guides/how-long-does-a-phone-screen-repair-take` | how long does a phone screen repair take | phone screen repair time                      |
| `/guides/phone-water-damage-what-to-do-first`      | phone water damage what to do            | wet phone first steps                         |
| `/guides/cracked-screen-vs-broken-lcd-difference`  | cracked screen vs broken lcd             | digitizer vs lcd difference                   |

_(Rows for the remaining Tier 3, 5, 6 and 7 URLs are added as those pages are built. A page does not ship without a row here.)_

---

## 8.6 Shared infrastructure every page uses

### The route registry, `lib/routes.ts`

One typed list of every URL in the site plan, each marked `built` or `pending`, with its tier, label and parent. It is the source of truth for the header, the footer matrix, breadcrumbs, the Phase 8 HTML sitemap and the Phase 8 link audit.

- **`shouldRenderLink(path)`** decides whether a link is rendered at all. A `pending` route renders only in development, flagged with a "soon" chip, and is omitted entirely from a production build. That is why the live site never emits an internal 404 while later tiers are still being built.
- **`breadcrumbsFor(path)`** walks the `parent` chain, so the visible trail and the `BreadcrumbList` schema come from one array and cannot drift.
- **`isBuilt` and `MODEL_ROUTES_BUILT`** gate the programmatic `/repair/[brand]/[model]` links, which are dynamic and cannot be listed individually. Flip `MODEL_ROUTES_BUILT` to `true` when Phase 4 lands.
- **`/styleguide/routes`** shows built and pending counts per tier.

**To ship a page:** create the route, then change its `status` to `"built"` in the registry. That is the whole change.

### The metadata factory, `lib/seo/metadata.ts`

```ts
buildMetadata({ title, description, path, ogImage?, noIndex?, type?, publishedTime?, modifiedTime? })
```

Produces the complete Next `Metadata` object: title, description, absolute canonical, `alternates.languages['en-CA']`, robots directives, Open Graph with `locale: 'en_CA'` and an explicit social image, and a Twitter summary_large_image card. **Every page calls it. No page hand-rolls a `Metadata` export.** It warns in development when a title exceeds 60 characters, a description exceeds 155, or either contains a long dash.

The social image is referenced explicitly rather than left to Next's file-convention merge, because a page that sets `openGraph` itself does not reliably inherit the root `opengraph-image`, and a missing card is invisible until someone shares a link.

### The schema builders, `lib/seo/schema.ts`

`organization()` · `website()` · `localBusiness()` · `breadcrumbs()` · `service()` · `offerFromPriceEntry()` · `itemListOfOffers()` · `faqPage()` · `webPage()` · `article()` · `howTo()` · `aggregateRating()` · `buildGraph()`

Rules the builders enforce, so a page cannot break them:

- **`compact()` strips recursively** before output: no `null`, no `undefined`, no empty string, no empty array, no empty object ever reaches the page. A field the client has not supplied is absent, not blank.
- **The business is defined once**, under the stable `@id` of `${SITE_URL}/#business`. Every other node references that `@id` rather than repeating the entity.
- **`aggregateRating()` returns `null`** unless `reviewSummary.enabled === true` and the rating, the count and the source URL are all present.
- **`faqPage()` drops duplicate questions**, so a question appearing in two categories is never emitted twice.
- **One `<script type="application/ld+json">` per page**, containing a single `@graph`. `buildGraph()` filters out null nodes, so a page can pass `faqPage(...)` straight in without a guard.

### `PageShell`

Composes breadcrumbs, the single H1, the AnswerBox directly beneath it, and the JSON-LD graph. Adding the `BreadcrumbList` node is automatic. Using it is what makes it impossible to ship a page with an H1 but no AnswerBox, or a visible trail whose schema says something different. `layout="hero"` gives the home page's dark hero panel with the AnswerBox below it.

### Lighthouse needs a quiet machine

Phase 6.5b took three median-of-five samples against one deployment and got 84, 95 and 87 on the same page, with a page carrying no images swinging from 96 to 72. The measuring machine had been running Chrome for hours. Individual runs inside one batch spanned 71 to 97.

**Close the browser, stop other work, then measure.** CLS, accessibility and best practices held steady across all thirty runs and can be trusted from a busy machine. Performance and Total Blocking Time cannot.

### Staging must never be indexable

Phase 5 set `NEXT_PUBLIC_SITE_URL` to the production domain on the deployment, which was right for canonical correctness and left the staging host serving a fully crawlable copy of the site whose canonicals name a domain currently hosting the client's old Wix site.

`middleware.ts` closes it. Any host that is not the canonical host, derived from `lib/site-url.ts` rather than named in this file, gets `X-Robots-Tag: noindex, nofollow` on every response and a `robots.txt` that disallows everything. localhost is exempt, because it is neither canonical nor reachable by Google, and marking it noindex would make every local audit disagree with production.

`pnpm test:noindex` asserts **both** directions. A rule that also fired on the real domain would be worse than no rule.

### Build determinism (retired)

> **Retired with the dataset.** There is no fetch cache to go stale, because there is no fetch. A build either has the content compiled in or does not compile. Kept because the failure it describes, a silently stale build making every other green check meaningless, is the worst thing that happened in this project and is worth not repeating.

**A build must reflect current content.** Phase 4 shipped one that did not: Next persists fetch results in `.next/cache/fetch-cache` between builds, and a rebuild after reseeding Sanity served the old content while reporting success. Every other check was then reading a site that did not match the database, including the similarity scores, which came back byte-identical after a content rewrite.

That is the worst failure mode in this project so far, because a silently stale build makes every other green check meaningless. Two things close it:

- **`pnpm build:clean`** clears the fetch cache first. Use it for any build whose output you intend to measure.
- **`pnpm test:determinism`** mutates a known `siteSettings` field, rebuilds, asserts the rendered output changed, and restores the field whatever happens. It needs a write token and skips loudly without one rather than passing quietly.

### The two correctness traps, and how they are closed

**Timezone.** `isOpenNow()` in `lib/utils.ts` computes against `America/Edmonton` explicitly using `Intl.DateTimeFormat`, never the server's zone and never the visitor's. The hours table renders on the server so crawlers read it, and only the open or closed badge is computed on the client after mount, so there is no hydration mismatch and no wrong answer for a visitor in another timezone. `pnpm test:timezone` proves identical answers under five system time zones on both sides of the daylight saving change.

**Map embed.** `MapReveal` shows a styled placeholder with the address in real text, and loads the Google Maps iframe only when the visitor clicks. A third-party iframe on every page load costs several hundred kilobytes and commonly wrecks LCP, and the map carries no SEO value: the address text and the `LocalBusiness` structured data are what search engines read.

### Environment assertion

> **Retired. There is nothing left to assert.** The Sanity credential check went with the dataset, and `NEXT_PUBLIC_SITE_URL` is no longer required: the canonical origin is a constant in `lib/site-url.ts`.
>
> The guard existed because the fallback was `http://localhost:3000`, so a production build without the variable emitted localhost as the canonical of every page and the `@id` of every JSON-LD node, rendering perfectly and being quietly uncrawlable. That shipped once, on the first Vercel deploy in Phase 5.
>
> **The protection is kept and strengthened rather than dropped.** The fallback is now the real domain, so the failure the guard was written to catch cannot happen at all, and the `middleware.ts` staging noindex no longer has a hole where an unset variable silently disabled it. What went away is the failure mode the guard itself introduced: a build that dies on any hosting project that has not been told a value the repo already knows. That cost one failed deploy on 2026-08-06.
>
> `NEXT_PUBLIC_SITE_URL` still overrides when set, which is how the local audits point the whole site at `http://localhost:3100`. **A build needs no environment variables at all.**

---

## 8.6.1 The programmatic tier, added in Phase 4

Two templates, two different search intents. Keeping them apart is what stops them competing.

|               | `/repair/[brand]`                                                                           | `/repair/[brand]/[model]`                                                         |
| ------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Intent        | Browsing. "iphone repair calgary"                                                           | Deciding. "iphone 8 plus screen repair calgary"                                   |
| Answers       | Which models do you fix, and roughly what does it cost?                                     | What does _my_ device cost, and is it worth fixing?                               |
| Carries       | Model grid newest first, brand price summary, repair types, process, models awaiting prices | Full price table, symptoms, what is included, the verdict, repair notes, siblings |
| Never carries | A per-repair price table for one model                                                      | A grid of other models as its main content                                        |

**The verdict section is the point of the model page.** It answers whether the device is still worth repairing, grounded in its age, the published repair price and whether it still receives OS updates. For an iPhone 4S the honest answer is no, and the page says no. A page that tells someone not to spend money is the page they trust and quote.

### Revised offer rules

The master prompt said to emit a price-less `Offer` for quote-only repairs. **That was wrong and is now reversed.** An `Offer` without a `price` is invalid and generates warnings, and inventing a price to satisfy the shape would break the first ground rule.

- **Priced repairs** become `Offer` nodes inside an `ItemList`, each with `priceCurrency: "CAD"`, `price`, `availability`, a `P60D` warranty and `seller` pointing at `#business`.
- **Quote-only repairs** are excluded from the `ItemList` entirely. They are described by a single `Service` node with a `ContactAction` carrying the phone number. See `serviceWithContactAction()`.
- **A model with no priced repair emits no `ItemList` at all**, only the `Service`.
- `offerFromPriceEntry()` returns `null` rather than an incomplete Offer, and `itemListOfOffers()` returns `null` when every offer was filtered out. `buildGraph()` drops nulls, so a page needs no guard.

`pnpm audit:pages` walks every emitted graph and fails on any `Offer` without a price.

### The 90-day watchlist

Phase 4's similarity report put every one of its ten most-similar pairs in the iPad range, clustered at 63 to 69 percent against a site median of 12.8 percent. They pass, and they are the least differentiated content on the site. **Review these 90 days after launch against real search data**, and cut or merge any that have not earned their place:

| Page                              | Why it is on the list                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/repair/apple-ipad/ipad-9th-gen` | Four modern iPads whose genuine differences (laminated or not, Touch ID placement, M1 or A14) are thin to write 200 words about |
| `/repair/apple-ipad/ipad-mini-6`  | as above                                                                                                                        |
| `/repair/apple-ipad/ipad-air-4`   | as above                                                                                                                        |
| `/repair/apple-ipad/ipad-air-5`   | as above                                                                                                                        |
| `/repair/apple-ipad/ipad-2`       | Three models sharing one printed price, differing only by Retina, connector and thickness                                       |
| `/repair/apple-ipad/ipad-3`       | as above                                                                                                                        |
| `/repair/apple-ipad/ipad-4`       | as above                                                                                                                        |

Phase 5 improved all of them, because the model-page FAQ block stopped being four shared answers and became four generated from each model's own record. The model tier's worst pair fell from 68.9 to 57.9 percent. The watchlist stands anyway: a page that passes a duplicate check can still fail to earn a click.

**Phase 6 added two more groups to the same 90-day review.**

| Group                                                                                                                                                                                                               | Why it is on the list                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The 9 brand hubs                                                                                                                                                                                                    | **The least differentiated tier on the site**, 36.2% median and 63.1% worst pair, despite having manufacturers, model ranges and price spreads to work with. Every one of the ten most-similar pairs site-wide is a brand hub or a Pro/Pro Max model pair. |
| `/repairs/laptop-screen-replacement`, `/repairs/laptop-keyboard-replacement`, `/repairs/laptop-charging-port-repair`, `/repairs/windows-installation`, `/repairs/computer-tune-up`, `/repairs/computer-diagnostics` | The six flat-priced repair pages. They carry a comparison table instead of the cross-model price table that justifies the template, so they are good pages that are not doing the thing the tier exists for.                                               |
| `/locations/chestermere` and `/cell-phone-repair-chestermere`                                                                                                                                                       | Chestermere cleared the four-fact rule at exactly four, and those four are one strong fact stated four ways. If these underperform, that is why.                                                                                                           |

### Duplicate content

`scripts/content-similarity.ts` fetches every model page, extracts the visible text inside `<main>`, and compares all pairs using 5-word shingles and Jaccard similarity. **Any pair above 70 percent fails the check.**

**The threshold is not to be tuned.** If pages fail, the content is too similar and the content is what changes. Runs as part of `pnpm verify`.

### Routing rules for the programmatic tier

- `generateStaticParams` covers published models only. `dynamicParams` stays on, so a model published in the Studio afterwards renders on first request with no redeploy.
- An unpublished or unknown model slug calls `notFound()`.
- A brand and model mismatch, such as `/repair/samsung-galaxy/iphone-8-plus`, is a **404, not a redirect**. Two URLs resolving to one page is the duplicate we are trying to avoid.

---

## 8.8 The FAQ scoping rule

Phase 4 found that eight shared FAQ answers made up roughly half the body text of every model page, and that cutting to four moved the median similarity between model pages from 52.9% to 12.8%. The lesson generalises: **any block repeated across many pages is a duplication engine**, and the structured-data version is worse, because it asks Google to pick a canonical answer from ninety identical candidates.

The rule, site-wide:

1. **A page's FAQ block is at most 6 questions**, and at least half must be unique to that page.
2. **Global questions live on `/faq`.** A page may reuse at most 2, and shows the question with a one-line answer and a link, never a second copy of the full text.
3. **`FAQPage` JSON-LD covers the page-specific questions only.** The same question and answer pair never appears in structured data on two URLs.

**Enforced, not documented.** `lib/faq/scoping.ts` throws on a violation, which fails the build, because a rule that only lives in a document is a rule the next page breaks. `composeFaqs()` returns the render model and the JSON-LD together, so a page cannot show one set and emit another.

**Where the page-specific questions come from.** For the 93 programmatic pages, `lib/faq/generated.ts` builds them from the page's own record: that model's repair list, that model's prices, that model's age and software support. The answers differ per URL because the data does. For the Tier 1 and Tier 2 pages they are authored in `lib/content/core-faqs.ts` and the content modules, with the numbers read from Sanity.

`pnpm test:faq` crawls every page, parses every `FAQPage` node out of the graph, and fails if any question and answer pair appears on more than one URL. `/faq` is exempt from the six-question cap, because it is the canonical home of the global set; the duplication check is what proves the set has not been copied elsewhere.

## 8.7 Copy checklist

Run this on every page before it ships.

- [ ] **No em dashes.** Use a comma, a colon or a full stop.
- [ ] **None of these words:** "we pride ourselves", "cutting-edge", "one-stop shop", "nestled", "seamless", "elevate", "unlock the power of".
- [ ] **Numbers instead of adjectives.** "About 30 minutes" beats "fast". "$89.99 including part and labour" beats "affordable".
- [ ] **Every paragraph survives being lifted out alone.** Restate the subject rather than using "it" or "as mentioned above".
- [ ] **The full entity string in the first paragraph:** "TechBrotherz, a walk-in cell phone and computer repair shop at 3317 17 Ave SE in Calgary, Alberta".
- [ ] **AnswerBox is 40 to 60 words**, answers the page's core question completely on its own, and names the price, the time and the warranty wherever they apply.
- [ ] **H2s are real questions.**
- [ ] **Real `<table>` markup** wherever there is tabular data, with `<caption>` and `<th scope>`.
- [ ] **Minimum four contextual in-body links** with descriptive anchor text.
- [ ] **No `TODO(client)` in body prose.** That marker is for factual fields only.
- [ ] **Prices, times and warranties come from `content/data/`**, not typed into the copy, so they cannot go stale.

### The voice split

A walk-in shop that talks about itself in the third person throughout sounds like a press release. But the units an answer engine lifts out alone have to name the entity. So the rule is split, and both halves matter.

| Third person, subject-restating, no pronouns | Normal first person, "we" and "you" |
| -------------------------------------------- | ----------------------------------- |
| AnswerBox copy                               | Connective prose between sections   |
| FAQ answers and `plainAnswer`                | Process steps                       |
| Table captions                               | The warranty page body              |
| The first sentence of every section          | About and Contact                   |
| Anything inside JSON-LD                      | Every call to action                |

The test is simple: if a sentence could be quoted on its own by ChatGPT and still make sense, it names TechBrotherz. If it only makes sense in the flow of the page, it says "we".

---

## 8.9 Trademark position, and the imagery rules

### The trademark rule, revised in Phase 6.5b

The Phase 6.5 rule was "no visible manufacturer logos or recognisable device models in frame". It was applied correctly and it was **wrong**: it is stricter than the actual concern, and it emptied most of the site's image slots. Photographs of devices being repaired are the entire subject matter of a repair shop, and incidental marks inside them are ordinary and expected.

The real risk is narrow: **using a manufacturer's logo as a brand mark**, in a position where it identifies or endorses the business, because that implies authorised service provider status TechBrotherz does not have.

**Not allowed**

- A manufacturer logo used _as a logo_: in a brand card, a nav item, a badge, an icon slot, a favicon, or anywhere it reads as identification or endorsement
- A manufacturer logo as the dominant element of an image, or isolated on a plain background
- Any image or copy implying authorised, certified or official status

**Allowed**

- Photographs of real devices being repaired, including where a mark is incidentally visible on a component, a case or a screen
- Device shapes a viewer might recognise as a particular handset
- Cropping or a light blur to reduce a mark that sits too prominently, rather than rejecting the photograph

One candidate was still rejected under the revised rule: a shot of memory cards where the Samsung logo _was_ the subject, isolated on a plain background. That is the case the rule is actually about.

So the site ships:

- **Brand cards with a wordmark set in our own type**, Plus Jakarta Sans, plus a generic device silhouette drawn as an SVG. Not a manufacturer logo, because a logo in a card slot is a logo used as a mark. See `components/blocks/BrandCard.tsx`.
- **The brand logo slot stays empty and functional.**
- **The independence notice** in the footer site-wide, and again on `/repair-prices` and every brand hub.

> All product names, logos and brands are the property of their respective owners. TechBrotherz is an independent repair shop and is not affiliated with, authorised by, or endorsed by Apple, Samsung, Google or any other manufacturer.

**This is a recommendation, not legal advice.** If the client wants manufacturer logos after understanding the position, that is their call and their liability, and it becomes a one-field upload per brand in the Studio with no code change.

### Brand card anatomy

A name and a count made nine cards look identical, so the card carries five things in order:

1. **Silhouette panel**, soft green tint, brand green stroke, deepening on hover
2. **Wordmark** in Plus Jakarta Sans
3. **Model range**, e.g. "iPhone 4 to iPhone 16", from the oldest and newest published models
4. **Model count**
5. **Starting price**, the cheapest priced entry for that brand

The range and the price are what differentiate the cards, and both are real catalogue data read from `content/data/models.ts`. Silhouettes map: every phone brand to `phone`, Apple iPad to `tablet`, laptops and desktops to `laptop`.

### The illustration fallback

`components/blocks/RepairIllustration.tsx` provides eight line drawings in the design system's own language: screen, battery, port, camera, keyboard, board, lock, diagnostic. 1.5 stroke, brand green on soft green tint, at the image radius.

A step card without a photograph renders an illustration, **not an empty frame**. `/placeholder-photo.svg` stays in the code as the fallback of last resort, because the demo imagery must never be load-bearing, but `pnpm test:placeholders` asserts that no rendered page reaches it.

Illustrations are used where a photograph would be the same stock image repeated across dozens of cards: the 35 service process cards, and the 16 repair pages' step cards by category. That is a better answer than five photographs repeated seven times.

### Stock photography may show the work, never the business

This build has refused invented social proof since Phase 1, and photography is the easiest place to break that rule by accident.

- Stock **may** depict generic repair work: hands, tools, a board under a loupe, a disassembled laptop.
- Stock **must never** be presented as TechBrotherz, its premises, its technicians or its customers. No stock storefront on a location page. No stock person on `/about` as a team member. No stock interior captioned as the shop.
- **Alt text describes what the photograph shows, never who it is.** "A technician replacing a phone screen" is fine. "Our technician at the TechBrotherz counter" is not.
- **Location pages, `/about` and `/contact` carry no photography.** A map and an address are the honest content for a place, and a stock street that is not 17 Avenue SE is exactly the failure this rule exists to prevent.

Every image in `public/demo/` is a placeholder. `content/image-manifest.md` records the slot, source, photographer, ratio and alt text for each, so replacing the set with the client's own photographs is a mechanical job.

### Sourcing

**`source.unsplash.com` was deprecated in 2021 and shut down in 2024**, so any code or tutorial using it fails. Originals are downloaded by hand from unsplash.com and committed under `public/demo/_source/`. The running site never touches an Unsplash URL, which keeps the demo independent of an external CDN and keeps LCP under our control.

`pnpm images:process` crops to ratio, caps the long edge at 1600px, encodes JPEG at quality 74 and emits a 16px base64 LQIP per image so every picture has a blur placeholder. `pnpm images:manifest` regenerates the manifest from `lib/content/images.ts`.

**The demo set is not load-bearing.** `components/blocks/DemoImage.tsx` checks the file on disk at render, so deleting `public/demo/` leaves a site that still builds and still reads correctly, just without pictures. That is asserted rather than assumed: the Phase 6.5 pass rebuilt with the folder removed and confirmed 151 of 151 pages, zero leaked references and the home hero falling back to its placeholder.

**The constraint that bound hardest** was "no visible manufacturer logos or recognisable device models in frame". Of eleven candidates reviewed by eye, six were rejected for a readable Apple logo on a battery, a Samsung wordmark on a drive, or Lenovo and LG marks on a laptop. Six of the seven repair categories are inherently photographs of a specific handset, so they carry no image. `/styleguide/images` lists every empty slot and why.

## 8.10 The two backend rules, Phase 6.9

**Rule 1. If the shop owner will not edit it, it does not belong in Sanity.** SEO body copy is written by us, in a pull request, with the similarity detector and the word-count check running over it. Behind a CMS it is 84 pages of prose the owner will never touch and a way to break what six phases went into getting right.

**Rule 2. Absence is not a document.** "Call for quote" is what we render when there is no price. It is not a row somebody has to create and maintain. 531 of 685 price documents existed only to record that a price did not exist.

**This applies forward: the Phase 7 guides are authored as files in the repo, not as Sanity documents.**

### The six types Sanity keeps

`siteSettings` · `deviceModel` · `shopService` · `unlocking` · `faq` · `testimonial`

Everything else moves to code. `deviceModel` carries its prices inline as a `repairs` array, and an entry only exists where a price exists.

### Where the moved types live

| Left Sanity                                  | Now in                                                 |
| -------------------------------------------- | ------------------------------------------------------ |
| `brand`                                      | `lib/content/brands.ts`                                |
| `repairType`, `priceGroup`                   | `lib/content/repair-types.ts`                          |
| `priceEntry`                                 | inline `repairs[]` on `deviceModel`                    |
| model intro, issues, verdict                 | `content/models/<slug>.ts`                             |
| `location`                                   | `content/locations/*`                                  |
| `navigation`                                 | `lib/routes.ts`, which already was the source of truth |
| `reviewSummary`                              | fields on `siteSettings`                               |
| `servicePage`, `author`, `redirect`, `guide` | schema deleted; **these had zero documents**           |

### The lean-page fallback

The Phase 4 thin-content guard was a Sanity validation rule. It is now a build-time check in `lib/content/model-content.ts`, with three outcomes:

| Tier     | Condition                           | Renders                                                                                                          |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **full** | a `content/models/<slug>.ts` exists | the whole template                                                                                               |
| **lean** | prices but no copy                  | price table, what is included, warranty, turnaround, CTA. A real page, just short, and honest rather than padded |
| **fail** | neither prices nor copy             | **the build stops** and names the slug                                                                           |

This is what makes the owner's workflow work: they add a Pixel 9 with prices, the page exists that day, and we write the copy in the next pull request. The build prints full, lean, and which models are waiting on copy.

### Corrected counts, recorded in Phase 6.9

Several numbers in this document were wrong for several phases. The census is the authority.

|                       | Was claimed | Actual                                                  |
| --------------------- | ----------- | ------------------------------------------------------- |
| Documents             | 917         | **929**, of which 917 are content and 12 are `system.*` |
| Quote-only price rows | 510         | **531**                                                 |
| Pages                 | 151         | **143 content pages**                                   |

**151 was the build count**, which includes `/studio`, `/styleguide/*`, `robots`, `sitemap` and the OG image route. **Every page-count claim from Phase 4 onward was inflated by 8.** The diff and the link audit are measured against **143**.

### The derivation finding, and the one deviation from the Phase 6.9 brief

The brief said to create no array entry for a repair with no price, and to derive the "Call for quote" rows from the repair types that apply to the device kind.

`scripts/verify-derivation.ts` tested that against production. **It is lossless for zero of 156 models.** Every model carries a curated three to five repairs; thirteen apply to a phone. Deriving would add eight or more quote-only rows to every phone page, which is a large content change and reintroduces exactly the thin-content problem the build has fought since Phase 2.

The brief's overriding requirement is that the rendered output is identical, so **every offered repair becomes an array entry and `price` is simply absent where there is no price**. Rule 2 still holds where it matters: 685 documents become 0, and the owner never creates or maintains a row to record an absence. An optional field on an array entry is not a document.

### Likely future requests, and what each would cost

Do not pre-build these. Recorded so the answer is one session of work when the request actually arrives.

| Request                             | Answer                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| "I want to edit the brand copy"     | Add a `brandCopy` singleton with nine fields, read it with `lib/content/brands.ts` as the fallback. One session. |
| "I want to edit the location pages" | Same shape, against `content/locations/*`.                                                                       |
| "Can I add a price group?"          | Code change. Rare enough not to warrant a type.                                                                  |

### When simplification and output conflict, output wins

Phase 6.9 asked for a simplification that would have changed 156 pages. Testing it before rendering anything, rather than after, is what caught it.

**The rule: when a structural simplification and the rendered output conflict, the output wins, and the conflict is reported rather than resolved silently.** A refactor that quietly changes what visitors see is not a refactor.

The concrete case: quote-only rows could not be derived from the device kind. Every offered repair therefore stays an array entry with `price` absent where there is none.

### The inline price shape

`deviceModel.repairs[]` holds one entry per repair the shop offers on that model:

| Field                                                                         | Meaning                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `repair`                                                                      | a slug from `lib/content/repair-types.ts`, typed as `RepairSlug`         |
| `price`                                                                       | **optional. Absent means quoted, and the page renders "Call for quote"** |
| `note`, `needsVerification`, `partGrade`, `turnaroundMinutes`, `warrantyDays` | as before, all optional                                                  |

`lib/content/hydrate-prices.ts` rebuilds the shape pages already consume, joining the repair's name, description, minutes and sort order from the constant. The sort moved out of GROQ because the field it sorted on no longer lives on a document.

**The `/repairs/*` cost, accepted deliberately.** Cross-model price questions can no longer be answered by GROQ alone. Those pages project the array and filter nulls in TypeScript. This is the accepted price of the refactor. **Do not try to push it back into GROQ**: ordering and filtering there would mean reintroducing the repair type as a document, which is the thing that made the Catalogue unusable.

### The write-client guard (retired)

> **Retired with the dataset.** There is nothing to write to. Kept because the lesson generalises: the guard was first put on the migration script, a throwaway probe wrote to production anyway because the probe was not the migration script, and the fix was to move the guard down a level to the only place a client could be built. Catching a mistake is not a control.

Part 2 put a guard on the migration script. It worked, and then a throwaway permission probe wrote a document into production anyway, because the probe was not the migration script. It was caught by a census that happened to look one too high.

So the guard moved down a level. **`sanity/lib/write-client.ts` is the only way any script may obtain a client that can write.** It refuses a protected dataset unless passed `PRODUCTION_WRITE_UNLOCK`, and no script in the repo passes one. Granting it at cutover is a reviewed one-line change in exactly one place.

`pnpm test:write-guard` scans every script and fails if any builds a client with a write token another way. It found ten bypasses when first run, including `seed.ts` and the determinism test. All ten now go through the factory. It runs as part of `pnpm verify`.

`pnpm census` checks production by type against the recorded baseline, so "production is clean" is a measurement rather than an impression.

## 9. Internal linking rules

The site must behave as one tightly connected graph.

1. **Breadcrumbs on every page except home,** rendered visibly and as `BreadcrumbList` schema.
2. **Hub and spoke.** `/services` → service hub → repair-type page → model page. Every child links back to its parent with descriptive anchor text.
3. **Minimum 4 and maximum 10 contextual in-body links per page.** Descriptive anchor text only. Never "click here" or "read more".
4. **Every model page** links to: its brand hub, every relevant repair-type page, `/repair-prices`, the matching local page, `/warranty`, and 3 sibling models via `RelatedLinks`.
5. **Every guide** links to at least 2 service pages, 1 model or price page, 1 location page, and 2 sibling guides.
6. **Every local page** links to: `/locations`, the 3 nearest neighbourhood pages, the top 4 services, `/repair-prices` and `/contact`.
7. **Every service hub** links to its top 6 `popular` models, its repair-type children, 2 relevant guides, and the matching Calgary landing page.
8. **Footer link matrix** gives every important page a site-wide link. See DESIGN.md Section on Footer.
9. **HTML sitemap at `/sitemap`** lists every URL grouped by tier. This is the orphan insurance policy.
10. **`scripts/link-audit.ts`** crawls the built site and fails CI if any page has fewer than 2 inbound internal links or any internal link 404s.
11. **Reciprocal cross-linking between competing intents.** Example: `/guides/ipad-repair-vs-replacement-cost` links to `/services/ipad-repair` and `/ipad-repair-calgary`, and both link back.

---

## 10. Design tokens

The single source of truth for tokens is `app/globals.css` inside the Tailwind v4 `@theme` block. The human-readable spec, including the type scale, spacing, radius, shadow and full component anatomy, is [DESIGN.md](DESIGN.md).

**The two contrast rules that get broken most often:**

- `--tb-green` (#21B24B) on cream is about 2.6:1. **Never** use it for body or small text. Green text on light backgrounds is `--tb-green-deep` (#0F7A30).
- Button label on a green fill is `--tb-ink` (#0A0D0C), **not white**.

---

## 11. Commands

```bash
pnpm dev               # Next dev server on :3000, Studio at /studio
pnpm build             # Production build
pnpm build:clean       # Clears .next/cache/fetch-cache first. Use for any build you intend to measure.
pnpm start             # Serve the production build
pnpm lint              # ESLint
pnpm typecheck         # tsc --noEmit
pnpm format            # Prettier write

pnpm link-audit        # Crawl the build, fail on orphans and internal 404s (Phase 8)

# Verification. Start a production server first: pnpm build && pnpm start
pnpm audit:pages       # Status, headings, JSON-LD hygiene, canonicals, price list weight
pnpm audit:browser     # Hydration warnings, axe, the contact form paths, Lighthouse
pnpm audit:lighthouse  # Lighthouse, median of N runs, because a single run is noisy
pnpm audit:keyboard    # Keyboard-only pass through nav, accordion, filter and form
pnpm audit:dom         # DOM node counts and transfer sizes
pnpm test:timezone     # Open-now correctness across five system time zones
pnpm test:contrast     # The DESIGN.md contrast rules, as assertions
pnpm audit:similarity  # Duplicate content across every tier, with a per-tier breakdown
pnpm audit:words       # Prose word counts for Tier 2 and Tier 3, floor of 900
pnpm test:faq          # No question and answer pair in structured data on two URLs
pnpm test:noindex      # Only the canonical host is indexable; staging is not
pnpm audit:schema      # One graph per page, no holes, no price-less Offer
pnpm audit:local-facts # Each shared local fact has one home page, no repeated sentences
pnpm images:process    # Crop, resize and encode the demo set, plus blur placeholders
pnpm images:manifest   # Regenerate content/image-manifest.md from lib/content/images.ts
pnpm audit:weight      # Transfer weight per page, with a before-and-after comparison
pnpm test:placeholders # No rendered page reaches the placeholder image
pnpm verify            # Every behavioural check above, in order
```

Every audit script takes the base URL as its first argument, defaulting to `http://localhost:3100`.

**There is no typegen step.** The content types are hand written in `content/data/types.ts`, next to the data they describe.

### Environment variables

Never commit real values. `.env.example` is committed, `.env.local` is git-ignored.

| Variable                       | Purpose                                                                                                                                                            | Required |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `NEXT_PUBLIC_SITE_URL`         | **Override only.** The canonical origin is the constant `CANONICAL_ORIGIN` in `lib/site-url.ts`, because the site has exactly one and always did. Set this to point a build at another origin, which is what the local audits do with `http://localhost:3100`. Leave it unset in production and on the hosting project. | no       |
| `RESEND_API_KEY`               | Contact form email. **The form degrades gracefully if missing.**                                                                                                    | no       |
| `CONTACT_TO_EMAIL`             | Where contact submissions are delivered.                                                                                                                            | no       |
| `NEXT_PUBLIC_GA_ID`            | GA4 measurement id. Analytics is skipped if unset.                                                                                                                  | no       |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console meta verification token.                                                                                                                      | no       |

**A build needs no credentials.** That is the point of the static content model: there is no token to forget, and therefore no way to produce a complete site with nothing on it.

---

## 12. Open questions for the client

**Blocking before Phase 3.** Until answered, use the "site value" column and mark the field `TODO(client)` where it lives.

| #      | Question                                                                                                                                                                                                                                      | Site value in use until confirmed                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **19** | **Parking, the top question.** Is there dedicated parking at 3317 17 Ave SE, is it free, how many spaces, and is there street parking on 17 Avenue or on 33 Street? One line answers it.                                                      | **Nothing published.** The local pages say plainly that we could not verify it and tell people to phone. Blocking nothing, improving several pages. |
| 20     | **Drive time from Chestermere.** Aggregators give roughly 22 km and 22 minutes city centre to city centre, which is not Chestermere to 33 Street SE.                                                                                          | Route stated, minutes not. `/locations/chestermere` explains why.                                                                                   |
| 21     | **Nearest cross street and what the shop is next to.** What do people say when giving directions to it?                                                                                                                                       | Omitted. We know the block, not what is on it.                                                                                                      |
| 22     | **Which MAX Purple stop customers actually use**, and how long the walk is from 33 Street SE Station.                                                                                                                                         | Station named, walk not described.                                                                                                                  |
| 23     | **Does the shop actually get Airdrie customers, and what brings them?** If the answer is substantial we revisit the cut with real material.                                                                                                   | No Airdrie page. Honest section on `/locations` and `/locations/calgary`.                                                                           |
| 24     | **Accessibility.** Step-free entry, door width, accessible washroom?                                                                                                                                                                          | Omitted. Worth stating on the location pages if true.                                                                                               |
| 25     | **Dover and Ogden.** We could not verify a route or landmark for either, so their sections say so. What should they say?                                                                                                                      | Sections published with an honest note and a phone number.                                                                                          |
| 1      | Password reset is **$39.99** in the business brief but **$49.99** on the live site. Which is correct?                                                                                                                                         | **$49.99**                                                                                                                                          |
| 2      | Samsung **S8 screen is $299.99 but S8 Plus is $289.99**. The Plus is normally the more expensive part, so this looks like a transposition. Confirm both.                                                                                      | As supplied, flagged in Sanity with a note                                                                                                          |
| 3      | The Samsung heading "Note 5 / 4 / 3 / 2" contains Note 8, 9, 10 and 10+ prices. We are reorganising into individual models in Sanity. Confirm each price maps to the model we assigned.                                                       | Reorganised, each price attached to its own model                                                                                                   |
| 4      | The brief's "Language and Location" field says **India**. The business is in Calgary. Confirming we build for `en-CA` / Canada.                                                                                                               | `en-CA`, Canada, CAD                                                                                                                                |
| 5      | The price catalogue tops out at iPhone 8, Galaxy Note 10 and LG G6. Modern models carry the highest search volume. We are seeding iPhone 11 to 16, Galaxy S20 to S25, recent iPad and Pixel with `Call for quote`. Please supply real prices. | `quoteOnly: true` on all modern models                                                                                                              |
| 6      | **Founding year.** What year did TechBrotherz open? Needed for E-E-A-T on `/about` and guide author boxes.                                                                                                                                    | Omitted entirely until supplied                                                                                                                     |
| 7      | **Technician credentials.** Any certifications, manufacturer training, years of experience per technician? Needed for the `author` schema and GEO expertise signals.                                                                          | Omitted entirely until supplied                                                                                                                     |
| 8      | **Real Google review count and star rating,** plus the Google Business Profile URL. `AggregateRating` schema stays off until this is supplied.                                                                                                | No rating shown, no rating schema emitted                                                                                                           |
| 9      | **Is data recovery offered?** If no, `/services/data-backup` is not built.                                                                                                                                                                    | Page not built                                                                                                                                      |
| 10     | **Postal code** for the 3317 17 Ave SE address. Required for complete `PostalAddress` schema and directory listings.                                                                                                                          | Field left empty rather than guessed                                                                                                                |
| 11     | **Online booking?** Walk-in is the positioning, but do you want an optional booking form alongside it?                                                                                                                                        | Walk-in only, contact form only                                                                                                                     |
| 12     | **Exact geo coordinates** for the storefront, or confirm we can read them from the Google Business Profile.                                                                                                                                   | `geo` omitted until supplied                                                                                                                        |
| 13     | **Part grades.** Which repairs use OEM vs Premium vs Standard aftermarket parts? Needed for honest `partGrade` values.                                                                                                                        | `partGrade` left unset                                                                                                                              |
| 14     | **Payment methods accepted** (cash, debit, Visa, Mastercard, Amex, e-transfer)? Needed for `paymentAccepted` schema.                                                                                                                          | Omitted until supplied                                                                                                                              |
| 15     | **Smartphone sales:** what is actually sold, new or refurbished? Affects whether we build a sales page at all.                                                                                                                                | No sales page                                                                                                                                       |
| 16     | **Font licence.** Satoshi (Fontshare) is the closest match to the reference. Confirm we may self-host it, otherwise we stay on Plus Jakarta Sans.                                                                                             | Plus Jakarta Sans, see DESIGN.md                                                                                                                    |
| 17     | **Legacy Wix URLs.** Please export the current site's URL list so we can map 301 redirects and keep existing rankings.                                                                                                                        | No redirects configured yet                                                                                                                         |
| 18     | **"Nexus 5S" on the printed price list.** No such phone was made. We have mapped the $120 screen price to the **Nexus 5X**. Confirm, or tell us if you meant the Nexus 5.                                                                     | Mapped to Nexus 5X, flagged `needsVerification`                                                                                                     |

### 12.1 Verification still outstanding

**Google Rich Results and trustworthy Lighthouse numbers both need a deployed URL.** Google's tool cannot reach localhost, and Lighthouse on `next start` measures a server with no CDN, no HTTP/2 and no brotli, which is not what visitors get. Both were deferred at the end of Phase 4 by decision, and are still open after Phase 5.

Phase 5 added direct evidence that the localhost figures are not measurement of the site at all. Running Lighthouse over five pages back to back produced Total Blocking Times of 4,850 to 9,140 ms on pages that ship almost no JavaScript, and dropped `/repair-prices` to an SEO score of 92. Re-running the SEO category alone on the same build returned **100 on every page**, and the markup checks that feed that score all pass: no uncrawlable anchors, no missing alt text, no missing meta description. The 92 and the four-figure blocking times were the measuring machine, not the site.

**A deployment now exists.** Phase 5 deployed the site to `https://techbrotherz.vercel.app`, on the client's own Vercel account, with no custom domain attached.

```bash
pnpm verify https://techbrotherz.vercel.app
pnpm audit:lighthouse https://techbrotherz.vercel.app 5
```

Two things to know about that deployment:

- **`NEXT_PUBLIC_SITE_URL` is set to `https://techbrotherz.com` there, not to the vercel.app host.** Every canonical and every JSON-LD `@id` therefore points at the real domain, which is what production will emit and what stops the staging copy being indexed as a duplicate. The first deploy had it set to `http://localhost:3100`, copied out of `.env.local`, and emitted localhost canonicals on every page.

**Measured on the deployment, median of 5 runs per page:**

| Page                                 | Perf | A11y | BP  | SEO | LCP   | CLS   | TBT   |
| ------------------------------------ | ---- | ---- | --- | --- | ----- | ----- | ----- |
| `/`                                  | 92   | 100  | 100 | 100 | 2.58s | 0.000 | 301ms |
| `/repair-prices`                     | 90   | 100  | 100 | 100 | 2.51s | 0.000 | 329ms |
| `/repair/apple-iphone`               | 92   | 100  | 100 | 100 | 2.57s | 0.000 | 258ms |
| `/repair/apple-iphone/iphone-8-plus` | 94   | 100  | 100 | 100 | 2.28s | 0.000 | 198ms |
| `/services/laptop-repair`            | 94   | 100  | 100 | 100 | 2.57s | 0.000 | 184ms |
| `/repairs/iphone-screen-replacement` | 92   | 100  | 100 | 100 | 2.57s | 0.000 | 252ms |

**Accessibility, best practices and SEO are 100 on every page, and CLS is 0.000 on every page.** Performance sits at 90 to 94 against a target of 95, and **LCP at 2.3 to 2.6s misses the 2.0s target in Section 8.1**. Those two are real and are Phase 8 work. Individual runs reached 95 to 97 repeatedly, so the medians are close to the line rather than structurally short.

For comparison, the same build on `next start` on localhost measured 40 to 72 for performance with Total Blocking Times of 4,850 to 9,140 ms. The localhost figures were not a pessimistic measurement of the site, they were not a measurement of the site at all.

**Phase 6, on the deployment, median of 5 runs:**

| Page                    | Perf   | A11y | BP  | SEO | LCP   | CLS   | TBT      |
| ----------------------- | ------ | ---- | --- | --- | ----- | ----- | -------- |
| `/phone-repair-calgary` | **96** | 100  | 100 | 66  | 2.58s | 0.000 | **86ms** |
| `/locations/calgary`    | 94     | 100  | 100 | 66  | 2.57s | 0.000 | 201ms    |
| `/repair-prices`        | 92     | 100  | 100 | 66  | 2.49s | 0.000 | 241ms    |

**Performance improved against the Phase 5 medians** on the regression check: `/repair-prices` 90 to 92, and the new Tier 5 page reaches 96 with a Total Blocking Time of 86ms. CLS stays 0.000 everywhere and accessibility and best practices stay 100.

**The SEO 66 is the staging protection working, not a regression.** The only failing audit on any of these pages is `is-crawlable: Page is blocked from indexing`, which is the `X-Robots-Tag: noindex` that `middleware.ts` puts on every non-canonical host. Every other SEO audit passes. `pnpm audit:lighthouse` now recognises a deliberately noindexed host and does not apply the SEO target to it. **On the canonical domain the SEO score will return to 100**, because middleware leaves that host alone. Do not "fix" this by removing the noindex.

**Phase 6.5, the imagery pass, median of 5 on the deployment:**

| Page                                                     | Perf   | Previous | A11y | BP  | LCP       | CLS       | TBT   |
| -------------------------------------------------------- | ------ | -------- | ---- | --- | --------- | --------- | ----- |
| `/` (hero image added)                                   | **94** | 92       | 100  | 100 | 2.57s     | **0.000** | 200ms |
| `/services/laptop-repair` (image added)                  | **95** | 94       | 100  | 100 | **2.42s** | **0.000** | 169ms |
| `/repairs/iphone-screen-replacement` (no image, control) | 92     | 92       | 100  | 100 | 2.57s     | **0.000** | 256ms |

**No page fell below its previous median and CLS stayed 0.000 everywhere**, which was the condition for keeping the pass. The image-bearing service hub posted the best LCP on the site at 2.42s, and the home hero at 2.57s stayed under the 2.6s ceiling set for this pass. Adding a 65 KB hero did not cost anything measurable, because it is the LCP element and it now arrives with an explicit aspect ratio and a blur placeholder rather than an empty panel.

- **Rich Results has no public API.** It has to be run by hand at `https://search.google.com/test/rich-results` against these four URLs, one per template:
  - `https://techbrotherz.vercel.app/repair/apple-iphone` (brand hub)
  - `https://techbrotherz.vercel.app/repair/apple-iphone/iphone-8-plus` (priced model, `ItemList` of `Offer`)
  - `https://techbrotherz.vercel.app/repair/apple-iphone/iphone-16` (quote-only model, `Service` with `ContactAction`, no `ItemList`)
  - `https://techbrotherz.vercel.app/repairs/iphone-screen-replacement` (Tier 3 cross-model price table)

### 12.2 Legal review, outstanding

**`/privacy-policy` and `/terms` must be read by a lawyer before launch.** Both pages describe accurately what TechBrotherz actually does and cite the correct legislation, PIPEDA federally and Alberta PIPA provincially, plus the Alberta Consumer Protection Act. They are not legal advice and have not been reviewed. Two clauses in particular need the owner's decision and then a lawyer's eye:

1. **Uncollected devices.** No period is currently defined after which an uncollected device is treated as abandoned. The terms page says so plainly rather than inventing one.
2. **Limitation of liability.** The current wording is written to be honest rather than maximally protective, and a lawyer should judge whether it is adequate.

The warranty page has one equivalent gap, stated openly on the page: whether a warranty repair restarts the 60-day clock or continues the original period.

**Where the unanswered fields actually bite.** Postal code and geo coordinates leave `PostalAddress` and `geo` out of the `LocalBusiness` schema, which weakens the local search signal but does not break the page. Payment methods leave out `paymentAccepted`. Founding year and technician credentials mean `/about` cannot make any experience claim, so **`/about` should not ship in Phase 3 until 6 and 7 are answered**. Google review data keeps `AggregateRating` dormant. Everything else in Phase 3 can ship without them.

### 12.1 Imagery and trademark, client to decide

1. **Photograph the shop, the bench, the storefront and the technicians.** Every image on the site today is a stock placeholder that deliberately shows generic repair work rather than this business. Google Business Profile needs those photographs anyway, so this is work that has to happen regardless of the website, and doing it once serves both.
2. **Decide on manufacturer logos.** We have deliberately not used the Apple or Samsung logos, for the reasons in Section 8.9. If you want them after reading that, it is your call and your liability, and it is a one-field upload per brand in the Studio with no code change.

### 12.1 Off-site GEO action list (client to complete)

Consistent off-site data is what makes the entity resolve in Google's and the answer engines' indexes. Using the exact NAP from Section 2:

1. Claim and fully complete the **Google Business Profile**. Primary category "Mobile phone repair shop", secondary "Computer repair service". Add the price list, hours, photos of the storefront and workbench, and the service area.
2. Post the price list as Google Business **Services**.
3. Mirror the identical NAP on **Yelp**, **YellowPages.ca**, **Apple Maps (Apple Business Connect)** and **Bing Places**.
4. Ask every satisfied walk-in for a Google review. Do not incentivise, do not script them.
5. Keep hours updated for holidays. Answer engines read the profile.

---

## 13. Build phases

| Phase | Scope                                                                                                                                     | Status   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1     | Foundations: scaffold, tokens, fonts, docs, primitives, Nav/Footer/StickyCallBar, `/styleguide`                                           | complete |
| 2     | Sanity: schemas, desk structure, GROQ, typed helpers, image builder, seed scripts, full price import, `/studio`                           | complete |
| 3     | Core pages plus the shared SEO infrastructure: route registry, metadata factory, schema builders, PageShell, OG image, alias-matching 404 | complete |
| 4     | Programmatic: `/repair/[brand]`, `/repair/[brand]/[model]`, the `/repair-prices` refactor, the duplicate-content detector                 | complete |
| 5     | Service hubs (Tier 2) and repair-type pages (Tier 3) with real long-form copy, the URL revision, and the FAQ scoping rule                 | complete |
| 6     | Local (Tier 5) and place (Tier 6) pages, the local-fact rule, fact concentration, and the staging noindex fix                             | complete |
| 6.95  | **Remove the backend.** Six Sanity types become TypeScript constants; the Studio, the webhook, draft mode and the CMS scripts are deleted | complete |
| 7     | Guides (Tier 7), minimum 1,200 words each                                                                                                 | pending  |
| 8     | SEO finishing: sitemap, robots, llms.txt, OG images, HTML sitemap, redirects, 404, link audit, Rich Results, Lighthouse 95+               | pending  |
| 9     | Handover documentation and the off-site GEO action list                                                                                   | pending  |

**Stop after each phase, summarise, update CONVERSATION.md, and wait for go-ahead.**

---

## 14. Conventions

### Server vs client components

- **Default to server components.** Every page, every data-fetching component.
- `"use client"` only for: `Nav` (scroll state and mobile sheet), `StickyCallBar` (scroll threshold), `FaqAccordion` (disclosure state), `Reveal` (IntersectionObserver), `PriceTable` filters on `/repair-prices`, and form components.
- Never put `"use client"` on a layout or a page.

### Sizing a change before starting it

**File count sizes a refactor. Error count sizes a decision job.**

A survey that says "10 page files" describes the work as mechanical. A trial
type strip plus `pnpm typecheck` says how many *decisions* those files contain,
and a decision is not a line to delete: a price column becomes a turnaround
column or the table loses a column and its header structure changes.

The two numbers diverge badly. Ten files sounded like one session; the same
change was 44 decisions across seven templates and was not.

The check costs two minutes: strip the field from the type, run typecheck, count,
revert. Do it before committing to a scope. It would have caught three
consecutive under-calls in Phase 7a-ii and Phase 8.

### Pages still needing composition work

Sixteen content templates. Three carry no dark section at all and read as one
continuous light field: `/contact`, `/privacy-policy`, `/terms`. Twelve carry
exactly one. Home carries four regions after Phase 8 step 3. So **15 templates**
need work to alternate surfaces hard, three of them from scratch. Its own phase.

### Naming

- Components: `PascalCase.tsx`, one component per file, named export plus a default where it is a page.
- Props interfaces: `ComponentNameProps`, declared above the component.
- Utilities and hooks: `camelCase.ts`.
- Content data files: `kebab-case.ts` under `content/data/`, one per type.
- GROQ queries: `SCREAMING_SNAKE_CASE` constants ending in `_QUERY`.
- CSS custom properties: `--tb-*` prefix, always.

### Component patterns

- Primitives take a `className` and merge it with `cn()`. Never hardcode layout margins inside a primitive, let the parent position it.
- `Section` owns vertical rhythm. Pages never set their own section padding.
- `Container` owns max width and gutters. Nothing else sets `max-w-*` on a page wrapper.
- Colours come from tokens only. **No raw hex values in components.**
- Icons are `lucide-react` at `strokeWidth={1.5}`. Set an explicit `size`.

### How to add a new page

1. Add a row to the keyword map in Section 8.5. If you cannot name a unique primary keyword, the page should not exist.
2. Add the URL to Section 7 with status `pending`.
3. Create the route under `app/(site)/`.
4. Implement `generateMetadata` using the helpers in `lib/seo.ts`.
5. Build the page from primitives. AnswerBox directly under the H1.
6. Add the JSON-LD required by Section 8.2.
7. Wire the internal links required by Section 9 for this page's tier.
8. Add it to `app/sitemap.ts` and the HTML sitemap.
9. Run `pnpm typecheck && pnpm lint && pnpm build && pnpm link-audit`.
10. Flip the status to `built` in Section 7 and append to CONVERSATION.md.

### Copy rules for anyone writing content

- No em dashes. No "click here". No adjectives where a number will do.
- Restate the subject in every paragraph. Never rely on "it" or "as mentioned above".
- Prices always as "$89.99, including the part and labour".
- Time always as "about 30 minutes" or "usually the same day", never "fast".
- Warranty always as "60-day warranty", never "great warranty".
