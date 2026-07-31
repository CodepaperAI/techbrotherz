# CONVERSATION.md — TechBrotherz Session Log

Newest entry at the top. Append after every working session and before every context compaction.

**Template**

```markdown
## Session YYYY-MM-DD — <short title>

**Asked:** what the user requested
**Done:** what was actually built or changed
**Files touched:** list
**Decisions:** choices made and the reasoning
**Blocked / open:** anything waiting on the client or unresolved
**Next:** the agreed next step
```

---

## Session 2026-08-01 — Phase 6.9 part 3, safety controls

**Asked:** Verify production is clean, move the write guard down a level, then rewrite 14 consumers, restructure the Studio, and diff 143 pages.

**Done: both safety items, in full.**

**Production census, clean.** Every type checked against the baseline, not just the FAQ count that caught the earlier stray write.

| type                                          | baseline | actual  |
| --------------------------------------------- | -------- | ------- |
| priceEntry                                    | 685      | 685     |
| deviceModel                                   | 156      | 156     |
| faq                                           | 20       | 20      |
| repairType                                    | 16       | 16      |
| location                                      | 11       | 11      |
| flatService                                   | 10       | 10      |
| brand                                         | 9        | 9       |
| priceGroup                                    | 7        | 7       |
| reviewSummary, siteSettings, unlockingService | 1 each   | 1 each  |
| **TOTAL**                                     | **917**  | **917** |

No drift, and no documents with probe-shaped ids. The single stray write in Part 2 was the only one.

**The write guard moved down a level.** `sanity/lib/write-client.ts` is now the only way a script can obtain a client that writes. It refuses production unless passed `PRODUCTION_WRITE_UNLOCK`, which nothing passes.

`scripts/test-write-guard.ts` found **ten scripts bypassing it**, including `seed.ts`, `prove-validation.ts` and the determinism test. All ten now go through the factory. Demonstrated: a production write client throws; a staging one is created. The check runs in `pnpm verify`.

**Not done: the consumer rewrite, and the reason is worth stating precisely.**

Migrating consumers cannot be done partially. Against staging, every query touching `brand->`, `repairType->` or `priceEntry` returns empty, so the site does not render until all of them move together. The scope measured honestly:

|                                         |     |
| --------------------------------------- | --- |
| GROQ files with removed-type references | 5   |
| Reference sites across them             | 40  |
| Generated `QUERYResult` types in use    | 68  |
| Accessors that break against staging    | 34  |

That is a single atomic change across the query layer plus a `sanity typegen` regeneration, and it needs a session with room to build, diff 143 pages and fix what the diff finds. Starting it here would have left the query layer half-migrated, which is the one state worse than not starting.

**Tree is green: typecheck, lint, build 151, write-guard passing. Production and the Vercel deployment untouched.**

---

## Session 2026-08-01 — Phase 6.9 part 2, staging migrated

**Asked:** Migrate staging, rewrite the queries, restructure the Studio, diff 143 pages.

**Done: the migration, verified, plus a finding that changed the plan.**

- **Staging populated.** `sanity dataset copy` and `dataset import` both call `datasets.list()` first, which needs a grant none of the three tokens has, so both fail before they start. `scripts/copy-dataset.ts` copies documents through the client API instead, which needs no such grant. Strong references mean creation order matters, so it writes by dependency: settings and leaf types, then brands and repair types, then models, then price groups, then price entries.
- **Token grants are not what their names suggest**, and this cost time. The read token reads production. The write token writes to both datasets. The admin token can neither read production documents nor create in staging. Using one token for both ends silently returns zero rows.
- **Hard guard added and demonstrated.** `FORBIDDEN_DATASETS` exits before touching anything when the target is production.
- **Migration run on staging: 917 content documents to 188.** 729 deleted. iPhone 8 Plus went from twelve `priceEntry` documents to one document with twelve array entries, one of which carries a price.
- **`lib/content/hydrate-prices.ts`**, the TypeScript join that rebuilds the exact `prices` shape every page already consumes, from the array plus the repair-type constant. The refactor is a move, and a move that changes every consumer is a rewrite in disguise.

**THE FINDING. Derivation is lossless for zero of 156 models.**

The brief said to derive the quote-only rows from the repair types that apply to the device kind. `scripts/verify-derivation.ts` tested that against production before anything rendered:

|                                                 |                                         |
| ----------------------------------------------- | --------------------------------------- |
| Models with rows                                | 156                                     |
| Where the offered set equals the applicable set | **0**                                   |
| Typical model                                   | had 3 to 5 repairs; 13 apply to a phone |

Following the brief literally would have added eight or more "Call for quote" rows to every phone page. The migration now preserves every offered repair as an array entry with `price` absent where there is none. The document reduction is unchanged.

**A mistake I made and fixed.** The token permission probe wrote a document into production as well as staging, and I only cleaned staging. Caught it in the type comparison, where production showed 21 FAQs against a census of 20. Deleted; production is back to 20 and otherwise untouched.

**Stopped at a green boundary.** The query rewrite touches 301 lines of GROQ and 14 consumer files, which is more than could be completed and verified in the remaining room. `sanity/queries/fragments.ts` now carries **both** shapes, document and inline, so the tree compiles, the build is 151, and the deployment still reads production unchanged. Same principle as keeping the old schemas until the diff is clean.

**Not done:** the consumer rewrite, the Studio restructure, the five empty schema deletions, the lean-tier fixture, the 143-page diff, the README.

**Production is untouched. The Vercel dataset is unchanged.**

---

## Session 2026-08-01 — Phase 6.9, backend simplification, part one

**Asked:** Collapse 17 document types and 917 documents down to six types the shop owner actually uses. Prices inline on the model, absence stops being a document, SEO copy moves to the repo.

**Stopped at a clean boundary, deliberately.** The site is untouched, the tree is green, 151 pages still build, and nothing has been deleted from Sanity. What is done is the whole non-destructive half.

**Done:**

- **Baseline snapshot**, 143 content pages captured to `snapshots/before/`, so the refactor can be diffed rather than trusted.
- **A full production export** to `snapshots/production-backup.tar.gz`, as the rollback.
- **`lib/content/brands.ts`** and **`lib/content/repair-types.ts`**, generated from the dataset rather than hand-copied, because this is a move and retyping nine intros by hand is how a move quietly becomes an edit. `RepairSlug` is now a union type, so a typo in a price row is a compile error rather than a dangling reference.
- **156 model content files** extracted to `content/models/`, plus a static import index so a missing file is a compile error rather than a blank page.
- **`lib/content/model-content.ts`**, the three-tier build check that replaces the Phase 4 Sanity validation rule.
- **`scripts/migrate-to-inline-prices.ts`**, dry-run verified against live, read-only. Dry run by default; `--apply` refuses to run without an explicit `--dataset`, so the live dataset cannot be hit by muscle memory.

**The real numbers, which differ from the brief:**

|                       | Brief | Actual                                                                                                                |
| --------------------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| Documents             | 917   | **929**                                                                                                               |
| Quote-only price rows | 510   | **531**                                                                                                               |
| Pages                 | 151   | **143 content pages** (151 is the build count including `/studio`, `/styleguide/*`, robots, sitemap, opengraph-image) |

**`servicePage`, `author`, `navigation`, `redirect`, `testimonial` and `guide` have zero documents.** The schemas exist; nothing was ever created in them. Moving those is deleting schema files, not migrating data. Only `brand` (9), `repairType` (16), `priceGroup` (7), `location` (11), `reviewSummary` (1) and `priceEntry` (685) hold anything.

Dry run: **154 priced rows go inline, 531 quote-only rows delete, 729 documents removed in total.**

**Blocked:** `sanity dataset copy production staging` fails with `User is missing required grant sanity.project.datasets/create`. The write token cannot create a dataset, so the staging copy the brief asks for does not exist yet. A local export stands in as the backup, but a restore is a worse rollback than a switch.

**Finding worth carrying forward: all 156 models already have copy**, so the lean tier currently has no users. The fallback is built and correct and nothing exercises it today. It starts mattering the first time the owner adds a model.

**Not done:** the migration itself, the query and page rewrite onto the inline shape, the Studio restructure, the 143-page diff, and the README rewrite.

**Next:** a token with `datasets/create`, or a decision to migrate production behind the export.

---

## Session 2026-07-31 — Phase 6.5b, finishing the imagery pass

**Asked:** The Phase 6.5 constraint was over-broad and it emptied most of the image slots. Replace it with the narrower rule that reflects the actual concern, fill every slot, build the brand cards properly, and leave no visible placeholder in the demo.

**The rule that changed.** "No visible manufacturer logos or recognisable device models in frame" was applied correctly in Phase 6.5 and rejected six of eleven candidates. It is stricter than the real concern, which is narrow: a manufacturer logo used **as a mark**, in a slot where it identifies or endorses the business. Incidental marks inside a workshop photograph are ordinary and expected, and photographs of devices being repaired are the entire subject matter of a repair shop.

Under the revised rule, five of those six rejections became usable. **One rejection still stands**: a photograph of memory cards where the Samsung logo was the subject, isolated on a plain background. That is precisely the case the rule is about, and it is a useful demonstration that the revised rule still has teeth.

**Done:**

- **13 photographs across every header and hero slot**, up from 5. Home hero, three process steps, both split blocks, and all seven service hub headers.
- **Eight line illustrations** in the design system's own language: screen, battery, port, camera, keyboard, board, lock, diagnostic. These fill the 35 service process cards and the 16 repair pages' step cards, where a photograph would be one stock image repeated across dozens of slots.
- **Brand cards built properly.** They were plain text links with a model count. They now carry a silhouette panel, the wordmark, the model range, the model count and the starting price. The range and the price are what stop nine cards looking identical, and both are real catalogue data: the brands query gained `oldestModel`, `newestModel` and `fromPrice`.
- **`pnpm test:placeholders`**, which crawls 47 pages and fails if the placeholder image reaches any of them. The fallback stays in the code, because the demo imagery must never be load-bearing; what changed is that nothing reaches it.

**Measured:**

| Page                          | Before imagery | After 6.5b | Change      |
| ----------------------------- | -------------- | ---------- | ----------- |
| `/`                           | 193 KB         | 550 KB     | +357 KB     |
| `/services/phone-repair`      | 191 KB         | 252 KB     | +61 KB      |
| `/services/laptop-repair`     | 174 KB         | 243 KB     | +69 KB      |
| `/services/computer-repair`   | 174 KB         | 252 KB     | +78 KB      |
| Pages with illustrations only | —              | —          | +7 to +9 KB |
| Pages with neither            | —              | —          | +2 to +3 KB |

Placeholder check: **47 pages crawled, zero placeholders, 115 illustration instances.**

**The measurement tool was wrong twice more, in opposite directions.** Phase 6.5 corrected summing every srcset candidate, which overstated tenfold. That correction, taking the largest candidate, still overstated badly: a 380px step card was being credited with the 1920w file when it actually fetches an **8 KB AVIF**. The script now parses the `sizes` attribute, works out the widest declared slot at a 1440px viewport, and fetches the candidate that covers it. Both wrong versions are documented in the script header, because each one would have led to a different and wrong decision about whether to keep the pass.

**The first 6.5b deploy failed the performance guardrail, and that is the most useful thing in this entry.** Six images where there had been one took the home page from 94 to **84**, LCP from 2.57s to **2.65s** past the 2.6s ceiling, and TBT from 200ms to **467ms**.

The cause was oversized sources, not too many images. Nothing on this site renders an image wider than about 720 CSS pixels: the hero is 40vw, the splits 50vw, the step cards a declared 380px. Shipping 1600px files was paying for detail no visitor sees. Capping at 1200px, and the hero at 1000px, took the home page to **95** with TBT at **128ms**.

| Page                                 | Phase 6.5 | 6.5b, 1600px | 6.5b, capped |
| ------------------------------------ | --------- | ------------ | ------------ |
| `/`                                  | 94        | **84**       | **95**       |
| `/services/laptop-repair`            | 95        | 96           | 93           |
| `/repairs/iphone-screen-replacement` | 92        | 89           | **96**       |

**The performance comparison from this session is not trustworthy, and the reason is worth recording.** Three median-of-five samples were taken against the same deployment. On the third, `/repairs/iphone-screen-replacement`, a page carrying **no images at all**, scored 72 with a Total Blocking Time of 1,477 ms, having scored 96 with a TBT of 158 ms twenty minutes earlier. Nothing in the build can do that.

The measuring machine had been running Chrome continuously for hours. Individual runs inside a single batch spanned 71 to 97 on one page.

| `/` sample            | Median | Runs                      |
| --------------------- | ------ | ------------------------- |
| 1600px sources        | 84     | 85, 84, 93, 84, 84        |
| 1200px sources        | 95     | not captured individually |
| 1000px hero, sample 1 | 87     | 84, 86, 93, 94, 87        |
| 1000px hero, sample 2 | 93     | 93, 80, 93, 97, 86        |

What survives the noise, because it held in **every run of all three samples across all three pages**:

- **CLS 0.000**, thirty runs, no exceptions
- **Accessibility 100 and best practices 100**, thirty runs

What is directional but not provable from here: the 1600px to 1200px cap coincided with TBT dropping from 467 ms to 128 ms, which is a large enough move to be real, and the source sizes genuinely fell by roughly 40 percent. **The scores should be re-measured on a quiet machine before anyone relies on them.**

**Problems found:**

1. **The brands GROQ query broke on a block comment.** GROQ has no `/* */`, so the explanatory note had to move outside the template literal.
2. **`BrandCard` was built in Phase 6.5 and never wired.** The component existed, the home page still rendered plain text links. Found only because this phase went looking at the rendered output rather than the component.

**Decisions:**

- **Illustrations, not photographs, for repeating markers.** Thirty-five step cards cannot each have a distinct photograph, and five photographs repeated seven times would read as filler. A diagram of the step is what a process marker should be, and it stays in the design system's own language.
- **`/repair-prices` and the 16 repair pages still carry no header photography**, which was the Phase 6.5 call and still stands. Their step cards get category illustrations; the pages themselves stay bare.
- **Location pages, `/about` and `/contact` still carry no stock photography.**

**Next:** Phase 7, the guides tier.

---

## Session 2026-07-31 — Phase 6.5, the imagery pass

**Asked:** A visual pass ahead of a client presentation. Build the brand-card slot without using anyone's logos, source stock that shows the work but never the business, self-host it, and do not lose the performance or the 0.000 CLS record doing it.

**Done:**

- **Brand cards with no manufacturer marks.** A wordmark in Plus Jakarta Sans, the palette's green dot, and a generic device silhouette drawn as an SVG at stroke width 1.5. Three silhouettes: phone, tablet, laptop. Deliberately generic outlines, because a recognisable iPhone shape implies the same authorised-service-provider relationship a logo does. `brand.logo` in Sanity stays empty and functional.
- **The independence notice**, in the footer site-wide and again on `/repair-prices` and every brand hub, which are the pages where manufacturer names appear most densely.
- **A verified demo image set of six placements from five photographs**, self-hosted under `public/demo/`, sourced by hand from Unsplash and processed to ratio at 1600px, quality 74, each with a 16px base64 blur placeholder.
- **`content/image-manifest.md`**, generated from `lib/content/images.ts` rather than hand-maintained, recording slot, file, ratio, size, photographer, source URL and alt text, plus every slot deliberately left empty and why.
- **`/styleguide/images`**, a noindex contact sheet showing every image at its real crop beside its metadata, and the empty slots with their reasons. This is the page to review before the client meeting.
- **`pnpm audit:weight`**, a before-and-after transfer-weight report, and the correction that a browser fetches one srcset candidate rather than all ten.

**The constraint that actually bound.** "No visible manufacturer logos or recognisable device models in frame" is far harder to satisfy for device-repair photography than it sounds. Eleven candidates were downloaded and reviewed by eye. **Six were rejected**: two for a readable Apple logo and "Authorized Service Provider Only" text on an iPhone battery, two for a Samsung wordmark on an SSD, one for Lenovo and LG marks on a laptop battery, and one for being general hand tools rather than device repair. Five passed and are in the set.

That is why six of the seven repair categories, both home split images, all three process steps, and the tablet, unlocking and password-reset service pages carry no photograph. Those subjects are inherently pictures of a specific handset or a branded operating system.

**Measured:**

| Page                        | Before    | After     | Change      |
| --------------------------- | --------- | --------- | ----------- |
| `/`                         | 193 KB    | 263 KB    | +70 KB      |
| `/services/phone-repair`    | 191 KB    | 252 KB    | +61 KB      |
| `/services/laptop-repair`   | 174 KB    | 301 KB    | +127 KB     |
| `/services/computer-repair` | 174 KB    | 316 KB    | +142 KB     |
| Every other page            | unchanged | unchanged | +1 to +3 KB |
| Site, 14 sampled pages      | 2,461 KB  | 2,877 KB  | **+415 KB** |

The +1 to +3 KB on pages with no image is the footer notice.

**Lighthouse, median of 5 on the deployment:**

| Page                                                     | Perf   | Previous | LCP       | CLS       | TBT   |
| -------------------------------------------------------- | ------ | -------- | --------- | --------- | ----- |
| `/` (hero added)                                         | **94** | 92       | 2.57s     | **0.000** | 200ms |
| `/services/laptop-repair` (image added)                  | **95** | 94       | **2.42s** | **0.000** | 169ms |
| `/repairs/iphone-screen-replacement` (control, no image) | 92     | 92       | 2.57s     | **0.000** | 256ms |

No page fell below its previous median, and CLS stayed 0.000 everywhere. Accessibility and best practices stayed 100. The image-bearing service hub posted the best LCP on the site.

**Similarity moved, slightly, in the wrong direction on the worst tier.** The independence notice is shared text on all nine brand hubs, which took that tier from 63.1% to 64.2%. Still well under the 70% threshold, and worth knowing: the brand hubs are the one tier where adding any site-wide block has a measurable cost.

**The demo set is not load-bearing, and that is asserted rather than assumed.** `DemoImage` checks the file on disk at render time. Rebuilding with `public/demo/` moved away produced **151 of 151 pages, zero leaked `/demo/` references, and the home hero falling back to its placeholder**. The folder was then restored and the site rebuilt.

**Problems found:**

1. **The first weight measurement overstated by roughly an order of magnitude**, because it summed every srcset candidate. A browser downloads one. Corrected to count the largest variant per source image, which is the worst case a real visitor can hit. The uncorrected figure said +2,002 KB; the real figure is +415 KB.
2. **The first degradation test silently did not run.** `Rename-Item public\demo public\_demo_hidden` failed with a path error, the build proceeded with the images still present, and the check reported a pass that meant nothing. Re-run with `Move-Item` to a path outside the project, which is when it actually proved anything.

**Decisions:**

- **No manufacturer logos, and the recommendation written into `CLAUDE.md` Section 8.9** so it survives a context reset. If the client wants them after understanding the position, it is their call and a one-field upload per brand.
- **No photography on location pages, `/about` or `/contact`.** A map and an address are the honest content for a place, and a stock street that is not 17 Avenue SE is precisely the failure the rule exists to prevent.
- **Alt text describes the photograph, never the business.**

**Blocked / open:**

- **Real photography is now the top imagery action for the client**, added to `CLAUDE.md` Section 12.1. Google Business Profile needs those photographs anyway, so it is work that has to happen regardless of the website.

**Next:** Phase 7, the guides tier.

---

## Session 2026-07-31 — Phase 6, the local tiers

**Asked:** Build the Tier 5 service-and-place pages and the Tier 6 place pages, but build a verified local content inventory first and cut anything that cannot clear four genuinely distinct facts. Fix the staging host so it is not indexable. Concentrate the shared local facts rather than repeating them.

**The inventory did the work it was there for.** Two findings changed the brief's premises before a single page was written.

1. **The shop is not in Forest Lawn.** 17 Avenue SE runs through Inglewood, then Albert Park/Radisson Heights, then Southview, then Forest Lawn, which begins around 36 Street SE. At 3317 the shop is at 33 Street, with Albert Park/Radisson Heights north and Southview south. It is on International Avenue, which is what causes the confusion, and a page telling people who live in Forest Lawn that the shop is in Forest Lawn would have been caught immediately by exactly that audience.
2. **There is a MAX Purple station at the door.** 33 Street SE Station sits on the 17 Avenue Transitway, a dedicated bus-only median corridor. Route 307 opened on 19 November 2018 and runs from downtown to the eastern city limits. Calgary Transit describes 33 Street SE Station as the central access point for Southview, so it serves both sides of the avenue.

**Done:**

- **17 planned pages became 13, then 13 built.** The inventory cut all three Airdrie pages on the four-fact rule, and the brief then cut `/laptop-repair-chestermere` for leaning on the same single road fact as its sibling. Final: 10 Tier 5, 3 Tier 6.
- **37,835 words of prose across the site's authored tiers**, median 1,005 per page, lowest 904, none padded.
- **The staging noindex fix.** `middleware.ts` derives the canonical host from `NEXT_PUBLIC_SITE_URL` and never names a deployment hostname. Non-canonical hosts get `X-Robots-Tag: noindex, nofollow` and a disallow-all `robots.txt`; localhost is exempt so local audits do not disagree with production. `pnpm test:noindex` asserts both directions.
- **Fact concentration, enforced in code.** Each shared local fact has exactly one page carrying it in full and a page-specific sentence everywhere else. `lib/content/local-shared.ts` throws at render time on a violation, including on a reused sentence.
- **Similarity, link graph, word counts, schema validation and FAQ scoping all extended to the two new tiers** and measured from the first build.
- **Tier 3 and Tier 4 retrofitted** so every repair page and brand hub links to its Tier 5 page.

**Measured:**

| Check                  | Result                                                      |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm build:clean`     | **150 pages, 123s**                                         |
| typecheck, lint        | clean                                                       |
| Word counts            | 36 of 36 above 900. Median 1,005, lowest 904                |
| Similarity, local tier | **9.4% median, 12.7% worst**                                |
| Similarity, place tier | **10.7% median, 11.0% worst**                               |
| Similarity, site-wide  | highest 63.1%, all brand hubs and Pro/Pro Max pairs         |
| FAQ scoping            | 542 pairs, 542 distinct, **0 on more than one URL**         |
| Schema                 | **13 templates pass**, one `LocalBusiness` @id everywhere   |
| Fact concentration     | 3 facts, 3 home pages, 12 mentions, no repeated sentence    |
| New pages              | 13 of 13 return 200                                         |
| Cut URLs               | **12 of 12 return 404**                                     |
| Links                  | **0 orphans in any of 7 tiers.** Local tier 2 to 19 inbound |
| Keyboard               | all controls reachable and operable                         |
| Map reveal             | address in the HTML, **zero iframes loaded**                |
| Staging noindex        | passes on localhost and on the deployment                   |

**Problems found and fixed:**

1. **The link graph reported the home page as an orphan** (carried over from Phase 5 and fixed there): trailing-slash normalisation turned `"/"` into `""`, which was then filtered out.
2. **Three Tier 5 pages had a single inbound link** after the first build, because Tiers 3 and 4 were still registry-gated against them. Retrofitted; the local tier now runs 2 to 19 inbound.
3. **The schema validator failed on localhost `@id` values**, which are correct locally because that is what `NEXT_PUBLIC_SITE_URL` is set to for development. The check is now host-aware, and it also asserts one `LocalBusiness` @id across every template.
4. **Twelve pages came in under the 900-word floor** on the first pass. Not a scope problem: the material existed and had not been written. A fifth genuine section went onto each of the ten Tier 5 pages, two onto `/locations/chestermere` and two onto `/locations/calgary/forest-lawn`. Nothing was padded.

**Decisions:**

- **All three Airdrie pages cut.** Three verified facts against a threshold of four, and two of them explain why the trip is awkward. `areaServed` still lists Airdrie on every `LocalBusiness` node, and `/locations` and `/locations/calgary` carry an honest Airdrie section saying plainly that no page exists because we could not verify enough to write one worth reading.
- **Seven Calgary neighbourhoods became anchored sections** on `/locations/calgary`. Dover and Ogden say openly that no route or landmark is published because none could be verified, and point to the phone number.
- **No drive times anywhere.** Chestermere gets a section explaining why the page gives a route and not minutes.

**Blocked / open:**

- **Parking is now the top open question**, number 19. Nothing verifiable was found, it is among the highest-value facts a local page can carry, and the pages say so plainly rather than guessing.
- Open questions 20 to 25 are new: Chestermere drive time, the nearest cross street, the walk from the station, whether Airdrie customers actually exist, accessibility, and what Dover and Ogden should say.
- **Rich Results** still has no public API and needs a human. Four URLs in `CLAUDE.md` Section 12.1.

**Next:** Phase 7, the guides tier, after a decision on its shape.

---

## Session 2026-07-31 — Phase 5, service hubs and repair pages

**Asked:** Build the Tier 2 service hubs and Tier 3 repair pages, revise the URL architecture so four page types stop competing for the same intent, formalise the FAQ finding from Phase 4 into a site-wide rule and retrofit it, add a build determinism check, extend the similarity detector to every tier, and deploy a Vercel preview.

**Done:**

- **URL architecture revised.** The original map had four page types competing for iPhone repair intent. The brand-specific Tier 2 hubs were removed rather than built: `/repair/apple-iphone` already owns "which iPhone do you have", and nothing distinguished a second page on the same intent. Tier 2 is now 7 device-category and non-device services at `/services/[service]`. Tier 3 is 16 pages at `/repairs/[repair]`, a flat namespace kept separate from `/repair/` so a repair slug can never collide with a model slug. Nothing was ever live at the old URLs, so they 404 rather than redirect, and `pnpm audit:pages` asserts that on five of them.
- **23 new pages, 25,364 words of authored prose.** Median 1,029 words per page, lowest 955, all above the 900-word floor. `pnpm audit:words` counts the authored copy in the content modules rather than guessing from rendered HTML, and excludes tables and FAQ answers so a low count cannot be fixed by padding them.
- **The `/repairs/*` cross-model price table.** One repair, every model, sorted cheapest first, each model name linking to its own page. Quote-only models are listed separately and covered by a `ContactAction`, never a price-less Offer. Four of the sixteen have no per-model data (laptop and computer work is flat-priced), so those carry a comparison table instead.
- **Real external citations.** The CRTC Wireless Code decision (Telecom Regulatory Policy CRTC 2017-200) on `/services/phone-unlocking`, which is the page that tells visitors they can probably get this free from their own carrier. Microsoft's Windows 10 end-of-support date on the laptop and computer pages.
- **The FAQ scoping rule, enforced in code.** At most 6 questions per page, at least half unique to it, at most 2 global questions and those shown as a one-line teaser plus a link, and `FAQPage` JSON-LD covering the page-specific questions only. `lib/faq/scoping.ts` throws on a violation, which fails the build.
- **Retrofitted to every page built so far.** 84 model pages and 9 brand hubs now generate their FAQs from their own records (`lib/faq/generated.ts`), so the answers differ per URL because the data does. The 8 core pages answer questions only they can answer (`lib/content/core-faqs.ts`), with counts and prices read from Sanity.
- **`pnpm test:faq`** parses every `FAQPage` node out of every page's graph and fails if any question and answer pair appears on two URLs. Result: **503 pairs across 124 pages, 503 distinct, zero duplicated.**
- **Build determinism.** `pnpm build:clean` clears `.next/cache/fetch-cache` first. `pnpm test:determinism` mutates a real Sanity field, rebuilds, asserts the rendered output changed, and restores the field in a `finally` block.
- **Similarity extended to every tier**, with a per-tier breakdown, and the link graph extended to all five tiers with per-tier inbound distribution.

**Files touched:** `lib/faq/scoping.ts`, `lib/faq/generated.ts`, `lib/content/{services,repairs,prices,core-faqs,core-context}.ts`, `app/(site)/services/[service]/page.tsx`, `app/(site)/repairs/[repair]/page.tsx`, `components/blocks/ScopedFaqs.tsx`, `components/blocks/FaqAccordion.tsx`, `lib/routes.ts`, `app/(site)/services/page.tsx`, `app/(site)/page.tsx`, `app/(site)/{repair-prices,locations,about,contact,warranty,faq}/page.tsx`, `app/(site)/repair/[brand]/page.tsx`, `app/(site)/repair/[brand]/[model]/page.tsx`, `scripts/{test-faq-scoping,test-build-determinism,word-counts,content-similarity,link-graph,audit-pages,audit-browser,verify}.ts`, `package.json`, `CLAUDE.md`, `CONVERSATION.md`.

**Measured:**

| Check                         | Result                                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm build:clean`            | **137 pages, 81s**                                                                                             |
| typecheck, lint               | clean                                                                                                          |
| Word counts                   | 23 of 23 above 900. Median 1,029, lowest 955                                                                   |
| FAQ scoping                   | **503 pairs, 503 distinct, 0 on more than one URL**                                                            |
| Similarity                    | **highest 63.0%, median 6.4%**, none above 70%                                                                 |
| Similarity by tier            | core 2.6% / service 7.0% / repair 6.4% / model 21.8% / brand 36.5% median                                      |
| New pages                     | 23 of 23 return 200                                                                                            |
| Old Tier 2/3 URLs             | 7 of 7 return 404                                                                                              |
| audit-pages                   | 23 pages pass, 9 classes of 404 correct, zero price-less Offers                                                |
| Links                         | **0 orphans in any tier.** Model pages 6 to 14 outbound, 2 to 15 inbound                                       |
| axe                           | 0 violations, including both new templates                                                                     |
| Keyboard                      | all controls reachable, contact form operable                                                                  |
| Determinism                   | **pass**, a Sanity change reached the rendered output                                                          |
| Schema, on the deployment     | **8 templates pass**, no holes, no price-less Offers                                                           |
| Lighthouse, on the deployment | **a11y, best practices and SEO 100 on all 6 pages. CLS 0.000 on all 6.** Performance 90 to 94, LCP 2.3 to 2.6s |
| Transfer size, real CDN       | `/repair-prices` 271 KB raw, **25 KB over the wire**                                                           |

**Four problems found, all now fixed:**

1. **`siteSettings.priceDisclaimer` was never read from Sanity.** Every page rendered it from the `lib/site.ts` constant, so editing it in the Studio changed nothing. Found because the determinism probe picked that field first and correctly reported no change. Pages with settings now prefer the Sanity value.
2. **The link graph reported the home page as an orphan.** Trailing-slash normalisation turned the href `"/"` into `""`, which was then filtered out, so every header logo link was invisible to the inbound counter. A real bug in the check, which would have masked a real orphan.
3. **`deviceModel.intro` is `richText`, not a string.** The second determinism probe wrote a string into it and produced a stringified array. Both this and the disclaimer are recorded in the script's own comments, because both are easy to repeat.
4. **Localhost Lighthouse is not measuring the site.** Five sequential runs produced Total Blocking Times of 4,850 to 9,140 ms on pages that ship almost no JavaScript, and dropped `/repair-prices` to SEO 92. Re-running the SEO category alone returned **100 on every page**, and every markup input to that score passes.

**Decisions:**

- **Brand-specific Tier 2 hubs removed rather than built.** They would have competed with the Tier 4 brand hubs on identical intent.
- **`/faq` is exempt from the six-question cap.** It is the canonical home of the global set. The zero-duplicates check is what proves the set has not been copied elsewhere.
- **Model and brand FAQs are generated, not authored.** Hand-writing four questions for 93 pages would produce the same questions with answers that drift from the prices.
- **"Top models by search demand" is newest-first.** We have no query volume data, and ranking by a signal we do not have would be inventing one.

**The deployment, finally.** Live at `https://techbrotherz.vercel.app`, on the client's own Vercel account, no custom domain attached. Two things had to be sorted out to get there:

- **Vercel Deployment Protection returns 302 to every request** on the per-deployment URLs (`techbrotherz-<hash>-...vercel.app`), which would have blocked Google's Rich Results Test. The project's clean production alias, `techbrotherz.vercel.app`, is not behind it and serves the same build.
- **The first deploy emitted `http://localhost:3100` canonicals on every page.** `.env.local` correctly holds that value for local development, and it was copied straight to Vercel. `NEXT_PUBLIC_SITE_URL` on Vercel is now `https://techbrotherz.com`, so canonicals and every JSON-LD `@id` point at the real domain, which is both what production will emit and what stops the staging copy being indexed as a duplicate.
- `SANITY_API_WRITE_TOKEN` was pushed to Vercel by an over-broad first pass and has been removed. The build does not need it.

**Blocked / open:**

- **Rich Results has no public API** and has to be run by hand at `search.google.com/test/rich-results`. The four URLs, one per template, are listed in `CLAUDE.md` Section 12.1.
- Open questions 1 to 18 in `CLAUDE.md` Section 12 are unchanged.
- The iPad watchlist opened in `CLAUDE.md` Section 8.6.1, for review 90 days after launch.

**Next:** Phase 6, the local and neighbourhood tiers, after a decision on the eleven-page neighbourhood count.

---

## Session 2026-07-30 — Phase 4, the programmatic tier

**Asked:** Build 9 brand hubs and a model page for every published model, refactor `/repair-prices` to one summary row per model, add a duplicate-content detector, revise the offer rules so no price-less Offer is ever emitted, add a `pnpm verify` behavioural suite, apply the voice split, and deploy a Vercel preview for real Rich Results and Lighthouse numbers.

**Done:**

- **Per-model content for all 84 published models.** An introduction, three or more model-specific issues, an honest verdict, repair notes where they differ, and OS support status. Written in three seed files, roughly 19,000 words. The thin-content guard was raised: a price is no longer enough to publish a model, because every published model now generates its own indexable page.
- **Brand hub template**, 9 pages: model grid newest first grouped by generation band, brand price summary table, applicable repair types, process, and an honest list of the models we repair but have not priced.
- **Model page template**, 84 pages: full price table, model-specific symptoms, what is included, the worth-repairing verdict with its inputs shown, repair notes, filtered FAQs, and related links.
- **`/repair-prices` refactored** to one summary row per model with the jump-nav retained, still fully server-rendered and still filtered with CSS only.
- **Revised offer rules.** `offerFromPriceEntry()` returns null rather than an Offer without a price; quote-only repairs are described by a `Service` node with a `ContactAction`; a model with no priced repair emits no `ItemList` at all.
- **`scripts/content-similarity.ts`**, 5-word shingles and Jaccard over the visible body text of every model page, failing above 70 percent.
- **`pnpm verify`**, eight behavioural checks in order, plus three new ones: a contrast test, an internal link graph, and a 404 suggester test.
- **Voice split applied** across the Phase 3 pages.

**Acceptance criteria:**

1. typecheck, lint and build clean. **114 pages statically generated, 91 second build.**
2. `pnpm verify` runs eight checks. Six pass outright; the two failures are both Lighthouse performance on localhost, discussed below.
3. **Similarity: highest pair 68.9 percent, median 12.8 percent, no pair over the threshold.** Full report in the summary.
4. Every published model page returns 200. **Four classes of 404 verified**: unknown path, unpublished model, right model under the wrong brand, unknown brand.
5. and 6. Rich Results and Lighthouse against a Vercel preview: **blocked, the CLI is not authenticated.** See below.
6. **Zero holes in any emitted JSON-LD, and zero price-less Offers**, checked by walking every node of every graph across 14 sampled pages including both a priced and a quote-only model.
7. One `h1` per page and no skipped heading levels across the new templates.
8. **No orphans. Every model page has 6 to 10 outbound in-body links and 2 to 10 inbound.** Distribution reported in the summary.
9. Publishing in the Studio makes a page live without a redeploy: `dynamicParams` stays on while `generateStaticParams` covers published models only.
10. axe: zero violations. Keyboard: 18 of 18.
11. **404 suggester: 5 of 5**, including a raw `A1864` and `SM-G935W8` resolving to the right model.

**Problems found while verifying, continuing the pattern:**

- **Next's persisted fetch cache served stale Sanity content across builds.** I changed the seed content, reseeded, rebuilt, and the similarity scores came back byte-identical. `.next/cache/fetch-cache` had reused the previous Sanity responses, so the build produced a site from old data while reporting success. This is the same class as the previous three: everything green, output wrong. Clearing the fetch cache fixed it. Worth knowing that a rebuild alone does not guarantee fresh content.
- **`generateStaticParams` runs outside a request scope**, where `draftMode()` throws. The build failed collecting page data for the model route. `sanityFetch` now treats that failure as "not draft mode", which is correct: prerendering must always use published content.
- **The keyboard test passed a stale assertion.** It required more than 300 filterable rows, true when the price page listed 344 repairs and false once it listed 84 models. The test was wrong, not the site, but a test that asserts yesterday's shape is worse than no test.
- **A brand with one published model fell below the outbound link minimum.** Google Pixel has a single published model, so that page had no siblings to link to and carried only 4 outbound links. The related-links block now has a fixed spine beneath the siblings.

**Decisions:**

- **Model-page FAQs cut from eight to four.** The site-wide FAQ answers are identical on every model page in a category, and at eight per page they were roughly half the body text, which pushed 25 pairs over the similarity threshold. This was a template problem, not a threshold problem: four keeps the useful answers without letting shared text dominate a page whose value is its model-specific content. The full set stays on `/faq`.
- **iPad Air 4 and Air 5 rewritten rather than unpublished.** They were the one pair still failing at 70.7 percent, and they are genuinely near-identical hardware. Rewriting both to lead with what actually differs, the A14 against the M1 and the Centre Stage camera, brought the pair to 67.2 percent.
- **A brand and model mismatch is a 404, not a redirect.** Two URLs resolving to one page is exactly the duplicate this phase exists to avoid.
- **The similarity threshold was never touched.** The failing content was fixed.

**Blocked / open:**

- **The Vercel preview was deferred by decision, not by oversight.** The CLI is installed but not logged in and `vercel login` is interactive. Asked how to proceed, the answer was to close Phase 4 without it. **Criteria 5 and 6 are therefore open and carry into Phase 5**, and the localhost Lighthouse numbers should not be treated as trustworthy until they are re-run against a deployed URL. Everything needed is ready: `pnpm verify <url>` and `pnpm audit:lighthouse <url> 5` both take a base URL.
- Lighthouse performance on localhost: 85 on `/`, 93 on `/repair-prices`, 89 on `/contact`. Accessibility, best practices and SEO remain 100 and CLS 0. `/repair-prices` improved on every measure after the refactor.
- Open questions 1 to 18 in `CLAUDE.md` Section 12 are unchanged.

**Next:** Phase 5, service hubs and repair-type pages. Waiting on go-ahead.

---

## Session 2026-07-30 — Phase 3, core pages and SEO infrastructure

**Asked:** Build the ten Tier 1 pages plus the 404, on top of shared SEO infrastructure that later phases inherit: a route registry, a metadata factory, typed JSON-LD builders emitting one `@graph`, a `PageShell`, an OG image, and an alias-matching not-found page. Close the timezone and map-embed traps. Trim the modern models to 30 published with hand-written intros. Twelve acceptance criteria with output.

**Done:**

- **Route registry** (`lib/routes.ts`): 100 URLs across nine tiers, each `built` or `pending` with a parent. Header, footer, breadcrumbs and the `BreadcrumbList` schema all derive from it. Pending routes render only in development with a "soon" chip and are absent from production output. `/styleguide/routes` shows progress per tier.
- **Metadata factory** (`lib/seo/metadata.ts`) and **schema builders** (`lib/seo/schema.ts`): twelve typed builders, `compact()` stripping holes recursively, a single `@id` for the business, `aggregateRating()` returning null unless enabled and complete, and `faqPage()` dropping duplicate questions. One script tag per page.
- **`PageShell`** composing breadcrumbs, the H1, the AnswerBox and the graph, with a `hero` layout for the home page.
- **Pages:** `/`, `/services`, `/repair-prices`, `/locations`, `/faq`, `/about`, `/contact`, `/warranty`, `/privacy-policy`, `/terms`, and an alias-matching 404. All copy written in full, no placeholders in prose.
- **Contact form:** server action, zod, honeypot, per-address rate limit, and graceful degradation when `RESEND_API_KEY` is absent.
- **Traps closed:** `isOpenNow()` computes against `America/Edmonton` explicitly with the badge client-side after mount; `MapReveal` loads the Google iframe only on click.
- **Modern models trimmed:** 30 published, each with a hand-written intro carrying a fact true of that specific handset. The other 72 stay unpublished. The seed refuses to publish a modern model that has no hand-written intro, and the Studio field note explains why.
- **Build assertion:** a missing `SANITY_API_READ_TOKEN` now fails the build with a clear message.
- **Six verification scripts**, all wired into `package.json`.

**Acceptance criteria, with output:**

1. typecheck, lint and build clean. **Zero hydration warnings and zero console errors** on `/`, `/repair-prices` and `/contact`.
2. All ten routes return 200. Unknown paths and not-yet-built model paths return 404. **Zero pending-route markers in the production build.**
3. Structural validation of every emitted graph against required properties per type, plus a duplicate-question check: no errors. **The live Rich Results Test needs a publicly reachable URL, so it cannot run against localhost.** It is the one criterion not fully closed, and it should be run against the Vercel preview before launch.
4. **No null, undefined, empty string, empty array or empty object** anywhere in any emitted JSON-LD, checked by walking every node of every graph.
5. **Exactly one h1 per page and no skipped heading levels**, verified by script across all ten pages.
6. `/repair-prices` renders **344 price rows in 87 tables with no JavaScript executed**. Weight reported below.
7. Lighthouse median of five runs: **accessibility, best practices and SEO all 100** on all three pages, **CLS 0.000** everywhere. Performance 90, 82 and 94. Below target, discussed below.
8. **axe: zero violations** on all three pages. Keyboard-only pass: 18 of 18 checks pass, including the mobile menu focus trap and Escape returning focus to the trigger.
9. `OpenNowBadge` returns **identical answers under UTC, Asia/Kolkata, America/Toronto, Australia/Sydney and America/Edmonton**, across five fixed instants including both sides of the daylight saving change.
10. Canonicals absolute and correct, `en-CA` alternate present, `og:locale` `en_CA`, and the OG image route returns a 45 KB PNG.
11. Contact form: invalid submit surfaces three field errors, the honeypot returns a silent success, and a valid submit without a Resend key confirms receipt and directs to the phone number.
12. Removing `SANITY_API_READ_TOKEN` **fails the build** with the intended message.

**Problems found while verifying, in the spirit of Phase 2:**

- **The logo failed the design system's own contrast rule.** axe flagged `--tb-green` on cream at 2.55:1 in the wordmark. DESIGN.md Section 2.1 says in plain words that green text on light must be `--tb-green-deep`, and the very first component written broke it. It is real text in the DOM, not an image of a logo, so the rule applies. Fixed, and accessibility went from 93 to 100.
- **The contact form was dead in production and the build did not care.** `actions.ts` exported `CONTACT_INITIAL_STATE`, and a `"use server"` file may only export async functions. It compiled, typechecked and built cleanly, then threw at request time on every submit. Moved to `form-state.ts`. This is the same class of bug as the dead validation in Phase 2: green build, broken behaviour.
- **Vercel Analytics 404d on every page load** off-platform, logging a console error each time. Now rendered only where it can work.
- **`opengraph-image` was not being picked up.** A page that sets `openGraph` in its metadata does not reliably inherit the root file-convention image, so every page shipped with no social card while looking correct in every other respect. Now referenced explicitly.
- **No favicon**, so every page load 404d on `/favicon.ico`. Added `app/icon.svg`.
- **A single Lighthouse run is worthless as a gate.** Consecutive runs of the same build gave performance scores of 82, 80, 88, 79 and 88 on one page. Everything is now reported as a median of five.

**Decisions:**

- **`/repair-prices` is not split, and no rows were trimmed.** The brief said report before optimising, so the numbers are below and the decision is the client's.
- **Prose links are underlined at rest**, not on hover only. axe's `link-in-text-block` rule is right: colour alone is not a sufficient cue.
- **Display font cut from three weights to two.** Nothing rendered Plus Jakarta Sans at 500, and every unused weight is another file on the critical path.
- **The 404 links suggestions to `/repair-prices#model-<slug>`** rather than the model page, because model routes ship in Phase 4. One registry flag switches it over.
- **Legal pages ship with their gaps stated openly** rather than with invented terms: no abandoned-device period, and no position on whether a warranty repair restarts the 60-day clock.

**`/repair-prices` in numbers:** 344 rows, 87 tables, 3,658 DOM nodes, 1,182 KB of HTML uncompressed but **53 KB gzipped**, of which 693 KB uncompressed is Next's inlined RSC payload and 195 KB is the `ItemList` of 344 offers. Transfer size is a non-issue. **DOM node count is the real problem:** 3,658 is past Lighthouse's 2,500 error threshold, and hydrating that tree is what produces 464 ms of total blocking time and the 82 performance score. Every other page sits between 436 and 746 nodes and scores fine.

**Blocked / open:**

- Open questions 1 to 18 in `CLAUDE.md` Section 12. Founding year and technician credentials are still absent, so `/about` renders without any experience claim, which is the intended behaviour rather than a gap.
- `/privacy-policy` and `/terms` need a lawyer before launch. Two clauses need the owner's decision first, recorded in Section 12.2.
- Performance is below the 95 target on `/` and `/repair-prices`. Recommendation in the summary.
- The live Rich Results Test still needs to run against a deployed URL.

**Next:** Phase 4, the programmatic brand and model pages. Waiting on go-ahead.

---

## Session 2026-07-30 — Phase 2, Sanity CMS and catalogue seed

**Asked:** Build the entire content layer. Sanity wiring, all schemas, custom desk structure, typed GROQ, image handling, draft preview and on-demand revalidation, seed scripts with the full catalogue, a `/styleguide/data` proof route, and nine acceptance criteria with output shown.

**Done:**

- **Wiring.** Sanity v3.99 with `next-sanity@9`, the version pair that supports Next 15 and Sanity v3. Embedded Studio at `/studio`, `sanity.config.ts`, `sanity.cli.ts`, published and preview clients, image URL builder, `sanity typegen` producing `sanity/types.ts` from the schema and the queries.
- **Schemas.** 18 document types and 7 object types. Global field rules built once in `sanity/schemas/lib/fields.ts`. `priceEntry` price-or-quote rule and unique model+repair rule. Thin-content guard on `deviceModel`. `priceGroup` for families that share a printed price. `reviewSummary` singleton, dormant. `needsVerification` flags. Every field has a plain-English description written for a shop owner.
- **Desk structure.** Site, Catalogue, Content, Locations. Models grouped by brand then device kind. Prices filtered by brand, by needs-verification, by quote-only and by priced. A "Modern models awaiting prices" list. Singletons pinned and stripped of delete and duplicate actions. Live preview panes on `deviceModel`, `guide`, `servicePage` and `location`. An "Add standard repairs" document action.
- **Queries.** 31 typed GROQ queries with a cache tag per accessor, including `getRelatedModels` using `select()` to sort siblings by release-year distance, since GROQ has no absolute value function.
- **Seed.** 917 documents: 9 brands, 16 repair types, 54 legacy models, 102 modern models, 7 price groups, 685 prices, 10 shop services, 1 unlocking service, 11 locations, 20 questions, plus the two singletons.
- **Revalidation.** Signed webhook at `/api/revalidate` with a tag strategy, plus draft-mode enable and disable routes.
- **Proof route.** `/styleguide/data` renders live content through the real components and prints the JSON-LD a model page emits.

**Files touched:** `sanity/` in full (env, lib, schemas, queries, actions, components, structure, seed), `sanity.config.ts`, `sanity.cli.ts`, `sanity-typegen.json`, `app/studio/`, `app/api/revalidate/`, `app/api/draft-mode/`, `app/robots.ts`, `app/(site)/styleguide/data/`, `lib/schema/`, `components/blocks/RichText.tsx`, `scripts/seed.ts`, `scripts/verify-seed.ts`, `scripts/prove-validation.ts`, `scripts/prove-studio-action.ts`, `scripts/prove-revalidate.ts`, `package.json`, `.env.example`.

**Acceptance criteria, all verified with output:**

1. `pnpm typecheck`, `pnpm lint`, `pnpm build` all clean.
2. `sanity typegen` produces 35 schema types and 31 query types. 47 occurrences of `unknown` remain, every one of them Sanity's internal `media` key on the image type. Zero on any field a query projects.
3. `pnpm seed` run twice produces an identical content hash, `b13a7dbd...`, over all 917 documents with the volatile `_rev` and timestamp fields stripped.
4. Counts reported by the seed and independently by `pnpm seed:verify`.
5. Both guards proven firing via `pnpm prove:validation` plus `pnpm sanity:validate`: the thin-content guard rejected a model published with no price and no content, and the price rule rejected a row with neither a price nor quote-only. With the probes removed, all 917 documents validate with zero errors.
6. `/studio` returns 200 and serves the Studio. The "Add standard repairs" action was exercised headlessly on the iPhone 16: 13 repair types apply to a phone, 8 were missing, 8 were created, a second run would add 0, and the dataset was restored.
7. `/styleguide/data` renders every block from live data. The four printed JSON-LD payloads contain no null, no undefined, no empty string, no empty array or object.
8. Full webhook round trip: unsigned POST rejected 401, bad signature rejected 401, signed webhook 200 and the price changed on the live site without a redeploy, then restored.
9. `/studio` carries `<meta name="robots" content="noindex, nofollow">` and `robots.txt` disallows `/studio` and `/api/`.

**Decisions where the brief left room:**

- **Compact seed JSON expanded by the script, rather than 917 literal documents.** `prices.json` records the printed list once and the script expands shared rows into one entry per model. `models-modern.json` is grouped into families. Hand-writing every document as literal JSON would have been thousands of lines with no extra fidelity and far more room for a transcription error.
- **Modern models grouped into 17 families, not treated as 102 individuals.** The repair facts that matter genuinely differ by family, not by handset: Face ID pairing on iPhone X and later, laminated versus non-laminated iPad glass, the sealed folding display on Z Fold and Z Flip, the under-display fingerprint reader on Pixel 6 and later. Each family carries its own `commonIssues` and a `familyIntro` naming the specific model. See the open question below about whether this is the right call.
- **"Add standard repairs" creates rows as quote-only, not blank.** A genuinely blank row fails validation the instant it is created, and an unpriced row has to render "Call for quote" anyway. The owner replaces a toggle with a number.
- **`priceEntry` validation moved from the document root to the fields.** A root-level rule looked correct and passed review, but `sanity documents validate` never executed it, so the guard was silently dead. Field-level rules run, and they put the error next to the input in the Studio.
- **Studio config moved behind a client boundary** (`app/studio/[[...tool]]/Studio.tsx`). The config pulls in the schema, structure and preview pane, all of which call `React.createContext` at module scope, which fails in the server bundle.
- **Relative imports inside `sanity/`.** The Sanity CLI bundles `sanity.config.ts` without the tsconfig `@/` alias, so schema extraction and typegen break on aliased imports.

**Problems found and fixed during verification, worth recording:**

- **Anonymous reads return empty, not an error.** The dataset ACL says public, but this project rejects unauthenticated reads, so every query returned zero rows and the proof route rendered "nothing returned" everywhere while the build still passed. The published client now carries `SANITY_API_READ_TOKEN`. It stays server-side because all reads go through `server-only` code. `SANITY_API_READ_TOKEN` is therefore **required in production**, not optional.
- **Sanity's CDN delayed webhook revalidation by up to a minute.** With `useCdn: true` the webhook fired, Next revalidated, and the page still rendered the old price because Sanity's CDN was still serving it. `useCdn` is now false: Next's ISR is already doing the caching, so the Sanity CDN was adding staleness and no benefit. Revalidation is now immediate.
- **One seeded FAQ exceeded the 320-character `plainAnswer` cap.** Caught by `pnpm sanity:validate`, not by the build. Shortened.

**Blocked / open:**

- Open questions 1 to 18 in `CLAUDE.md` Section 12, now including the Nexus 5S / 5X ambiguity as number 18. Questions 6 and 7, founding year and technician credentials, block `/about` in Phase 3 specifically, because the page cannot make an experience claim without them.
- 102 modern models are seeded `published: false` and are invisible to the live site until the shop supplies prices. They are listed in the Studio under Catalogue, Device models, Modern models awaiting prices.
- 9 of the 11 locations are seeded unpublished with a `TODO(client)` route description. Only Calgary and Forest Lawn carry content specific enough to publish. Real drive times, routes and landmarks are needed before Phase 6.
- The Studio preview panes point at routes that Phases 4 to 7 build, so they show the not-found page until then.
- The preview secret is bundle-visible by design. If the client wants real access control on drafts, that means moving to Sanity's Presentation tool with token auth.

**Next:** Phase 3, core pages. Home, About, Contact, Warranty, Repair Prices, FAQ, Locations index and Services index, each with full metadata and JSON-LD. Waiting on go-ahead.

---

## Session 2026-07-30 — Project kickoff, governing docs and Phase 1 foundations

**Asked:** Read the master build prompt in full. Create `CLAUDE.md`, `DESIGN.md` and `CONVERSATION.md` before any application code. List the open questions for the client. Then begin Phase 1 only, and stop.

**Done:**

- Created `CLAUDE.md`: business facts table, ground rules, tech stack, directory structure, Sanity schema index, full URL map with build status, the SEO / AEO / GEO checklist as a per-page runbook, the keyword to URL map, internal linking rules, commands, environment variables, 17 open questions for the client, the off-site GEO action list, and coding conventions.
- Created `DESIGN.md`: full design system spec. Colour tokens with measured contrast ratios and the two rules that get broken most often, type scale, layout and grid, radius / spacing / shadow scales, motion spec, anatomy for all 21 components, a do / don't table and the accessibility floor.
- Created `CONVERSATION.md` (this file) and `README.md` for client handover.
- Phase 1 build. See the entry body below for the file list.

**Files touched:**

- Docs: `CLAUDE.md`, `DESIGN.md`, `CONVERSATION.md`, `README.md`
- Config: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc.json`, `.gitignore`, `.env.example`
- App: `app/globals.css`, `app/fonts.ts`, `app/layout.tsx`, `app/(site)/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/styleguide/page.tsx`
- Lib: `lib/site.ts`, `lib/utils.ts`, `lib/nav.ts`, `lib/seo.ts`
- Primitives: `Container`, `Section`, `Eyebrow`, `Heading`, `PillButton`, `Card`, `Chip`
- Blocks: `AnswerBox`, `TrustStrip`, `IconCard`, `StepCard`, `SplitBlock`, `PriceTable`, `ModelGrid`, `FaqAccordion`, `Breadcrumbs`, `RelatedLinks`, `LocalInfoCard`, `OpenNowBadge`
- Layout: `Nav`, `Footer`, `StickyCallBar`, `Logo`
- Other: `components/motion/Reveal.tsx`, `components/seo/JsonLd.tsx`, `public/placeholder-photo.svg`

**Verified:** `pnpm typecheck` clean, `pnpm lint` clean, `pnpm build` succeeds (3 static routes). Served the production build and confirmed `/` and `/styleguide` return 200 and an unknown path returns 404. Checked the rendered HTML for `data-speakable="answer"`, real `<caption>` and `<th scope="row">` markup, "Call for quote" fallbacks, `BreadcrumbList` JSON-LD, and confirmed the generated CSS contains the `on-dark:` variant rules, the fluid type-scale clamps, the radius and shadow tokens and the `prefers-reduced-motion` block.

**Decisions:**

- **Display font is Plus Jakarta Sans, not Satoshi.** Satoshi is the closest match to the reference headline face but it is a Fontshare licence that needs client confirmation and self-hosted files. Plus Jakarta Sans is the same geometric-grotesque character, is served self-hosted by `next/font/google`, and swaps to Satoshi later by changing one file (`app/fonts.ts`) with no other code change. Logged as open question 16.
- **`lib/site.ts` is the Phase 1 source of business facts.** From Phase 2 the Sanity `siteSettings` singleton becomes primary and `lib/site.ts` is the typed fallback and default. Keeping one typed module means NAP still lives in exactly one place before the CMS exists.
- **Manual scaffold instead of `create-next-app`.** Full control over the Tailwind v4 `@theme` block, strict TypeScript config and directory layout, with no starter boilerplate to strip out.
- **No fake social proof anywhere in the primitives.** `TrustStrip` is documented to reject star ratings, avatar stacks and customer counts by design, not just by convention. The `AggregateRating` code path stays dormant until real Google review data arrives.
- **Route group `app/(site)/`** so the marketing chrome (Nav, Footer, StickyCallBar) wraps the public site while `/studio` and `/api` stay outside it.
- **Prices are stored as numbers and formatted at render** by `formatPrice()` in `lib/utils.ts`, so CAD formatting and the "Call for quote" fallback are decided in exactly one place. A null price renders as "Call for quote" linked to the phone number, never a dash and never "N/A".
- **Dark-surface styling is a CSS variant, not a prop.** `Section variant="dark"` sets `data-surface="dark"` and components restyle through a custom `on-dark:` Tailwind variant. React context would have forced every consumer to become a client component. Prop drilling would have meant threading `onDark` through every block.
- **`Reveal` renders content visible on the server** and only applies the hidden state on the client before paint. Scroll animations must never hide content from a crawler, from an answer engine or from a visitor without JavaScript.
- **FAQ answers stay in the rendered HTML when collapsed.** The panel uses the `hidden` attribute rather than being conditionally unmounted, so the text is in the HTML source for crawlers while staying out of the accessibility tree when closed.
- **Pinned ESLint 9, `eslint-config-next` 15 and TypeScript 5.** The default resolution pulled ESLint 10 with a Next 16 config and TypeScript 7, which is a peer-dependency mismatch against Next 15.
- **Two visible placeholders, both clearly marked.** `components/layout/Logo.tsx` renders a wordmark until the client supplies a logo SVG, and `public/placeholder-photo.svg` reads "Photo to be supplied by the client". Neither pretends to be real content.
- **`AnswerBox` and `buildMetadata` warn in development** when the answer falls outside 40 to 60 words, the key-fact count falls outside 3 to 5, or a title or description exceeds its character limit. The spec is enforced at the component rather than left to a checklist.

**Blocked / open:**

- All 17 client questions in `CLAUDE.md` Section 12. Questions 1, 2, 3, 6, 7, 8, 9, 10, 12, 13, 14 and 15 block real content on Phase 3 pages. The rest can wait.
- Postal code, geo coordinates and founding year are omitted rather than guessed. They leave visible gaps in the `PostalAddress` and `LocalBusiness` schema until supplied.
- No Sanity project exists yet. Phase 2 needs a Sanity project id and dataset.
- The Nav and Footer link matrices point at Tier 2 to Tier 7 URLs that ship in later phases, so those links 404 until their phase lands. `scripts/link-audit.ts` in Phase 8 is what turns this into a hard gate.
- A logo SVG and real shop photography are still outstanding. Both currently render clearly marked placeholders.
- Port 3000 on this machine is held by an unrelated node process, so the build was verified on port 3100.

**Next:** Phase 2, Sanity. All schemas, custom desk structure, GROQ queries, typed helpers, image URL builder, seed JSON for the full price list, the `pnpm seed` importer, and the embedded Studio at `/studio`. Waiting on go-ahead.
