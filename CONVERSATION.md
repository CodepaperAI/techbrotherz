# CONVERSATION.md — TechBrotherz Session Log

Newest entry at the top. Append after every working session and before every context compaction.

## Session 2026-08-14 (later) — Lighter scrim, and the Z mark chosen

**Asked:** the client wants the skyline more visible and rejected the redrawn character mark ("make something other").

**Done:** the scrim dropped from 60% to 35% overall with the text-side gradient softened from 85/45 to 80/35, so the city, the river and the lights read clearly on the right while the headline still sits on a near-solid ground; the contrast audit passes. Direction C from the /styleguide comparison, the Z mark, is wired in everywhere: header and footer (ink square with green Z on light, green square with ink Z on dark, per the dark-on-green rule), favicon.ico, icon.svg, apple-icon.png and the OG card mark. The comparison section on /styleguide still shows all directions, so A and B remain one line away if the client changes their mind. Question 27's answer is now: the Z mark, pending the client seeing it live.

## Session 2026-08-14 — The skyline hero ships, and three logo directions to choose from

**Asked:** the agency brief said source a licensed skyline and skip the client's file; the client's direct instruction, relayed after it, said use their file with no further verification. The direct instruction wins and is recorded here rather than silently followed.

**Done:**

### The skyline hero, with the client's image

Full-bleed skyline behind the hero text, replacing the split panel; the screwdriver photograph is out. The client-supplied 1600x900 composite is served at native size (never upscaled), encoded at quality 72 to 225 KB, with a blur placeholder, priority loading and the file recorded in the image manifest. The IMAGE_EDITS note keeps both reservations on record: the resolution is below the earlier 2000px floor, and the ownership is unconfirmed (question 26 stands). The scrim does the contrast work: 60% black across the image plus a near-solid left gradient under the text, so the skyline reads as atmosphere and the scrim is also what makes the softness invisible. Below 640px the photograph is dropped and the solid black panel returns, since a wide skyline crops badly to portrait. Contrast, placeholder, pages and link audits all pass; CLS stays 0.000 by construction (absolutely positioned background, fixed layout).

### Three logo directions, compared on /styleguide

Because two reductions of the cartoon character have shown that characters do not survive 40px, three directions are built side by side with the current mark as a fourth column, at 32, 40, 64 and 128px in both colourways, with compact and full lockups: A, wordmark-led with a TB monogram drawn as strokes in a green square; B, a phone outline crossed by a green screwdriver, two shapes and one accent; C, the capital Z as the mark, the one distinctive element of the existing brand. All share the Archivo wordmark with the capital Z, green "Tech" (green-deep on light per the contrast rule). Nothing is wired into the header; the current mark stays until a direction is chosen.

## Session 2026-08-13 (fifth) — The client's mark as vector, the GBP service areas, full device coverage

**Asked:** the sequenced logo/hero/areas/content brief.

**Done:**

### §1 The logo, redrawn from the client's own mark

The in-house mark from the previous session is replaced by a vector reproduction of the client's actual brand: the green circle, the phone character simplified to its essential silhouette (circle, phone, glasses, one home-key line; the antenna, hand and keypad detail do not survive 40px), and the TechBrotherZ wordmark with its capital Z, "Tech" in green and "BrotherZ" in ink, inverted on dark. Three variants in one component (full with the CellPhone / Computer Repair strapline for the footer, compact for the header, icon alone for small placements; the compact header collapses to the icon on the narrowest screens). Favicon.ico (PNG-in-ICO, hand-assembled), apple-icon.png and the OG image mark all regenerated from the icon variant, and all six variant-colourway combinations render on /styleguide under a new Brand section.

### §2 The skyline hero: the gate fired again

Same image, same answer as the previous session: 1600x900 at 516 KB, under the 2000px floor, and visibly a commercial composite of unconfirmed provenance. Not built; the solid black hero stays; question 26 stands.

### §3 The service areas, from the Google Business Profile list

`lib/content/service-areas.ts` is the one module driving all four surfaces: areaServed in the LocalBusiness schema (19 entries: the 17 profile areas with Forest Lawn and Forest Heights split, plus Airdrie kept from the site's standing claims), the home tile grid, a new tile grid on /locations, and a footer "Areas we serve" column rendered from the same list. Five new honest sections on /locations/calgary: Applewood Park and Ramsay with routes derived from established corridor facts, Strathmore with the Trans-Canada-past-Chestermere route, and Bragg Creek and Mînî Thnî written plainly as communities outside Calgary the Store serves customers from, with no invented routes or drive times and the phone as the fallback. Forest Heights already had its section. The Tier 5 pages that lived in the old footer areas column moved to a "Repair near you" column so no page lost its site-wide inbound link; the link audit stays fully green with zero orphans and zero dead anchors. The Airdrie section's stale "published price list" line was corrected in passing.

### §0, §4, §5 Device coverage, and the reconciliation

Motorola and LG are named in the /services intro, AnswerBox and the phone-repair page prose as device coverage quoted at the counter; the brand hubs stay deleted and the 301s intact; HTC and Nexus are not restored. Recorded as question 28, a reconciliation for the client to confirm. The /services and About copy now cover the full client list including MacBooks, gaming laptops, gaming towers and game consoles, with unbuilt services named without links. "5 brands and 16 repair types" is gone from the About key facts, and the "Store in numbers" card dropped its two data-model rows for facts a person would say. Question 29 records T2A 0R2 from the profile list, unused until the client confirms it is the store's postal code.

All audits green: links (fully), pages, local-facts, FAQ scoping, contrast, words, similarity. Deployed.

## Session 2026-08-13 (fourth) — A new logo, designed in-house

**Asked:** the client wants a different logo.

**Done:** a new mark designed in the site's own design language and shipped: a rounded square in --tb-green holding a phone outline with a repair checkmark, drawn in --tb-ink because dark-on-green is the site's rule for green fills; beside it "TechBrotherz" typeset in the display face with the closing z in green (the one identity cue carried over from the old wordmark), and the exact SITE.descriptor line beneath in letterspaced caps. It is pure SVG and real text inside Logo.tsx: no image requests, no raster, crisp at every size, correct light and dark variants verified by screenshot in the header and footer, and the wordmark is now machine-readable text rather than pixels. The favicon was redrawn to match the mark. The client-supplied PNGs stay untouched in public/ so reverting is a one-line change if the client prefers the old mark once they see this one; question 27 now asks them to confirm the new mark. This also closes the long-outstanding "no vector logo" problem by construction.

## Session 2026-08-13 (third) — Skyline hero: stopped at the gate

**Asked:** replace the hero with the client's Calgary skyline photograph behind a scrim, with a hard stop condition: report and halt if the image is under about 2000px wide or artefacted.

**Done:** the stop condition fired, so the hero build did not happen and the solid black hero stays. The supplied file is 1600x900 at 516 KB, under the threshold, and it is visibly a professionally produced composite, most likely a commercial marketing render (a development visualization sits glowing at its centre), which makes the provenance question sharper than a normal client photo. Both questions are now in CLAUDE.md (26: skyline ownership or licence, with the alternative of sourcing a licensed skyline; 27: what logo change is actually wanted, plus the still-outstanding vector original). The logo rendering issue was re-verified against the live deployment rather than the local files this time: the deployed PNG has fully transparent corners and renders clean, so the pale box the client sees is almost certainly a cached earlier deploy. Nothing user-facing changed; no deploy needed.

## Session 2026-08-13 (later) — Hero rebuild: Calgary in the H1, full-bleed black

**Asked:** the surgical hero brief. City in the H1, hero full-bleed and genuinely black, shorter, stat cards overlapping the boundary, no duplicate copy, logo box, Calgary highlighted in a few headings.

**Done:**

- **H1 is "Phone and computer repair in SE Calgary"**, the city in --tb-green on the black, two lines at 1440 (the hero H1 runs slightly under the type-h1 ceiling, 40 to 62px, to hold two lines in the seven-column hero). Eyebrow became "Walk-in repair Store · No appointment". No superlatives.
- **The grey had a cause**: the old hero was `bg-tb-black/85` with a backdrop blur inside a rounded contained panel, and 85% black over cream is grey by arithmetic. The hero is now a full-bleed section at solid `--tb-black`, edge to edge, content in the container.
- **Shorter**: subcopy cut to the prescribed two lines (address, 30 minutes, warranty), image panel reduced, and the hero plus the stat cards plus the top of the AnswerBox all sit inside one 1440x900 viewport, verified by screenshot.
- **The stat cards straddle the hero boundary** via a new `heroOverlap` slot on PageShell: the hero carries extra bottom padding and the card row pulls up with a negative margin. Purely static layout, so CLS stays 0.000 by construction. The separate stats section is gone, which also shortens the page.
- **No stutter**: the hero subcopy is now the short summary and the AnswerBox stays full and self-contained per the Phase 4 rule, so the pair reads as summary then detail.
- **The logo box could not be reproduced**: both public/logo-*.png files measure genuinely transparent (corner alpha 0) and the rendered header is clean at zoom. The client most likely saw a cached earlier deploy that used a different asset. A transparent SVG or higher-resolution PNG stays on the client question list regardless.
- **Calgary in three more headings**, the city word in --tb-green-deep on light surfaces per the contrast rule (--tb-green is reserved for the dark hero): "What can we fix for you in Calgary?", "Why Calgary chooses TechBrotherz", "Serving SE Calgary and beyond". Hours untouched. Four mentions total on the page, counting the H1.

Contrast, pages, links (still fully green) and FAQ audits pass; typecheck, lint, clean build clean. Deployed, screenshots at 1440 and 390 in snapshots/shots/hero-final-*.

## Session 2026-08-13 — Match the reference site: the home rebuild, Store, blog

**Asked:** the urgent match-the-reference brief. The reference is a single-page site; ours keeps its 143-page architecture and rebuilds the home page to carry every section the reference has, in order, with header anchors. Plus the text fixes and the blog.

**Done:**

### The text fixes

- **"shop" is "Store"** wherever it names the business: 237 replacements across pages, content modules, FAQs, location records, JSON-LD descriptions and the entity sentence in lib/site.ts. Generic uses ("no shop can decrypt", "any shop", "shopping district") kept, reviewed by hand. Capitalised mid-sentence exactly as the client wrote it.
- **Service area** is now "Calgary, Chestermere, Airdrie and surrounding Calgary communities" site-wide, flagged for confirmation since the client's wording was ambiguous; `areaServed` in schema is unchanged and consistent.
- **No misspellings existed** in user-facing content; the repo folder (c:\techbrothers) and the Vercel project alias (techbrothers.vercel.app) carry the old spelling as infrastructure names, flagged rather than changed under deadline.
- **SE Calgary** leads the hero eyebrow, the services lead, the areas heading and the home title tag.

### The home page, sixteen sections in the reference's order

Sticky header (Services, Reviews and Hours are anchors into the page, then Locations, Blog, About, Contact), service pill row, hero with the SE Calgary eyebrow and Call plus Get a Quote, four stat cards (30 min, 60 days, walk in, 7 days, every one verified), the ticker, the services grid now at eight photo cards each with tag chips, brands as a wrapped name list (iPhone through Lenovo, no manufacturer logos), why-us as the numbered 01 to 05 list (no "no fix no fee": we charge a diagnostic fee on computers), the three-step process, the reviews section, the hours section split weekday and weekend with the open-now badge, service areas with the map, free-parking line and 14 tiles that all navigate somewhere real, the scoped FAQ, the CTA band with phone, hours and address, and the service directory: four columns, 33 deep links, every one resolving. The SplitBlock section was dropped, being the one block with no counterpart in the reference order.

### Reviews, the honest version

The section exists, is anchored from the header, and renders real testimonials the moment `content/data/testimonials.ts` has any. While it is empty it says plainly that reviews live on the Google listing and links there with the client's own reviews URL. No placeholder stars, no invented counts. When Jenish sends the Google data, it is a data change.

### The blog, finally

/blog is live with three real articles, not stubs: how to unlock a cell phone in Canada (1,426 words, cites the CRTC Wireless Code), signs your laptop needs repair (1,702 words), and phone water damage first steps (1,658 words, with HowTo schema). Each carries Article schema with the organisation as author (no invented byline; question 7 is still unanswered), an AnswerBox, page-specific FAQs that pass the scoping audit, internal links to the relevant service pages, and a CTA. The guides registry tier moved from /guides/ to /blog/ paths; the remaining eleven planned articles stay pending. Blog is in the header and footer.

### The link audit is fully green for the first time

The service directory gave the lone published Pixel its second inbound link, closing the pixel-6 gap that had been the one standing links failure since the brand removals. Zero orphans, zero dead anchors, zero internal 404s, and the three header anchors verified against real ids on the home page.

**Verify:** 13 of 14 checks green; the one failure is the browser audit's Lighthouse-95 target on localhost, documented as measurement noise. Deployed.

**Flagged for the client:** the service-area wording ("surrounding Calgary communities" reads oddly against Chestermere and Airdrie, which are not Calgary communities; say the word and it reverts to "surrounding Alberta communities" in one sweep), and the repo folder plus vercel.app alias spelling.

## Session 2026-08-11 (fourth) — The new models made visible where people look

**Asked:** the client's screenshots showed the hub grid still topping out at iPhone 16 and the home brand cards still reading "iPhone 4 to iPhone 16" and "Galaxy Note 2 to Galaxy S24". The seeded models existed but only as chips at the bottom of the hub, and the card statistics counted published pages only.

**Done:** two visibility changes, with the thin-content rule untouched, no new pages published.

1. **The hub model grid now carries the whole catalogue, newest first.** Published models render as linked cards with their repair counts; quote-only seeds render as unlinked cards captioned "Quoted at the counter". The iPhone 17 family, the S26 range and the Pixel 10 family now open their grids instead of hiding in a chip list, and the redundant "Also repaired" section is gone, its call-to-quote copy folded under the grid.
2. **`getBrands` statistics cover the whole catalogue rather than published pages only**, so the home and hub cards read "iPhone 4 to iPhone 17e", "Galaxy Note 2 to Galaxy S26", "iPad 2 to iPad Air 11 (M4)", with counts to match. The shop repairs a seeded quote-only model just as it repairs a published one, so the old range was simply out of date as a claim. Model pages themselves stay gated on `published`, as before.

Pages, links (pixel-6 only) and similarity audits pass. Deployed.

## Session 2026-08-11 (third) — The current iPhone, Galaxy and Pixel ranges seeded

**Asked:** the previous seeding covered only iPads; the client wants the latest Apple, Samsung and Google handsets too.

**Done:** 23 models seeded after verifying all three lineups (web-checked, not guessed): iPhone 16e, iPhone 17, iPhone Air (the official name; "iphone 17 air" kept as an alias), iPhone 17 Pro, 17 Pro Max and 17e; Galaxy S25 Edge, Z Fold 7, Z Flip 7 and Z Flip 7 FE, the S26, S26 Plus and S26 Ultra, and the Z Fold 8, Z Fold 8 Ultra and Z Flip 8; Pixel 9 Pro XL, 9 Pro Fold, 9a, and the Pixel 10, 10 Pro, 10 Pro XL and 10 Pro Fold. **Pixel 11 and Pixel 10a are deliberately not seeded**: the Pixel 11 event is announced but the phones are unreleased, and the 10a could not be confirmed shipped, and an unverified model name is exactly the error the brief forbids. All 23 are quote-only and unpublished per the thin-content rule, rendering as "Also repaired" chips on their brand hubs. **Catalogue: 153 to 176 models, 69 published, 107 seeded awaiting copy.** The A-series gap (nothing newer than the A54) was noticed and left: the client asked for latest flagships, and the volume mid-rangers are a cheap follow-up when asked. Pages, FAQ scoping and link audits pass; pixel-6 remains the one known link gap. Deployed.

## Session 2026-08-11 (later) — The iPad rename, and the current iPad range seeded

**Asked:** "add iPad, all the models of it, remove tablet, and deploy" — the go-ahead for the recommended rename from the batch-2 doc.

**Done:**

### iPad leads everywhere

`/services/tablet-repair` is renamed to `/services/ipad-repair` with a permanent redirect from the old URL (Next emits 308, SEO-equivalent to the site's other 301s). The def's H1, title, serviceType, eyebrow and copy lead with iPad; the "Android and Windows tablets" section and FAQ survive as the one supporting mention that holds the tablet term. `/tablet-repair-calgary` is retired and 301s to `/ipad-repair-calgary`, which already carried the "ipad repair calgary" keyword; its LocalDef is deleted and the Android-tablet story lives on the service page. Cards, nav, footer, siblings, the model-page service mapping, the repairs parent, the audit page lists and the /services group heading ("iPads") all follow. The audit's must-404 list needed one edit: `/services/ipad-repair` was on it from the Phase 5 brand-hub removal, and it is now a real page.

**Keyword map change, for the record:** `/services/ipad-repair` takes "ipad repair" as primary (was "tablet repair", with ipad repair as supporting); "tablet repair calgary" is forfeited as a primary keyword with the Tier 5 retirement, held only by the supporting "android tablet repair" mention. This is the trade the batch-2 doc priced in.

### The current iPad range, verified then seeded

Twelve models seeded after verifying Apple's current lineup (web-checked, not guessed): iPad 11th gen (A16, 2025), iPad Mini 7 (A17 Pro, 2024), iPad Air 11 and 13 in M2 (2024), M3 (2025) and M4 (2026), and iPad Pro 11 and 13 in M4 (2024) and M5 (2025). All quote-only and `published: false` per the Phase 4 thin-content rule, so they render as "Also repaired" chips on the iPad hub until each gets model-specific content. **Catalogue: 141 to 153 models, 69 published (unchanged), 84 seeded awaiting copy.**

**Verify:** pages, words (the renamed hub carries 1,303 words), similarity, faq, schema, local-facts all pass; links carries only the pre-existing pixel-6 gap; browser is the localhost Lighthouse noise. Redirects tested on the build: both old URLs 308 to their iPad equivalents. Deployed.

## Session 2026-08-11 — Batch 2, session 1b: About, parking, service area, years out of the listings

**Asked:** the sequenced batch-2 request, session 1b only: About page from the client's verified copy, the parking answer (free, in front of the store, in the plaza) on the pages that need it, one service-area version, and release years out of the phone repair listings as labels while age-bearing prose survives as relative age.

**Done:**

### About

Family-owned is now in the lead, the AnswerBox, the who-we-are prose and a key fact, with no duration claimed because the founding year is still missing. The verified device list (phones, iPads and tablets, laptops, desktops, MacBooks, gaming computers, game consoles) is on the page: consoles and unlocking link to their pages, MacBooks and gaming computers are named without links until their pages exist. Unlocking now names screen locks and FRP with the proof-of-ownership condition. The rewrite went ahead now rather than waiting for session 2, because naming-without-linking covers the gap and the page was carrying worse problems: "prices published in full", "every price on the site" and "where a model shows Call for quote" all survived the price scrub as false claims, and are now rewritten to the quote-at-counter reality.

### Parking, verified at last

Open question 19 closed: free parking in front of the store, in the plaza, sourced to the owner. Carried in full in a new "Where do you park at TechBrotherz?" section on /locations/calgary, one line on /contact, the home find-us lead, the /locations index (answer, key fact, CTA), the Tier 5 template's parking card (which had said "we could not verify"), the global FAQ answer and both location routeDescriptions. The plaza is used as a locating fact, not just an amenity. Space count and time limits remain unknown and unstated. The Chestermere page's "same applies to parking" disclaimer became the answer.

### Service area

One version confirmed everywhere: "Calgary, Chestermere, Airdrie and the surrounding Alberta communities", matching `areaServed`. One short-form key fact on /locations was aligned to it; nothing else diverged.

### Years out of the listings

Labels removed, 5 template sites: the release-year band headings on the brand hubs (the "2022 to 2024" the client saw; the grid is now one flat list, newest first), the brand hub summary table's Released column, the Tier 3 table's Released column, the model page's "Released YYYY" chip, and the model lead's ", released in YYYY" (now ", now about N years old", computed so it cannot go stale). Generated brand FAQs no longer print year spans; they state a duration instead. Prose: 13 sentences across 11 model files rephrased from absolute years to relative age, none deleted; 3 mentions kept because "(2017)" is part of the Galaxy A5's product name. **Counts: 5 label sites removed, 2 generated-FAQ templates rephrased, 13 prose sentences rephrased, 3 kept as product identity.**

### Stale price copy, found in the sweep's path

Both year-bearing tables turned out to be broken price-scrub leftovers: headers still said "Price" and "Repairs from (CAD)" with years and repair counts rendering under the wrong columns. The brand hub summary table is deleted (the model grid above it already carries everything it had left); the Tier 3 table became a models-covered grid under the same cost H2, answered quote-first. Also fixed on the way: the Calgary place page's "the full list is on the repair prices page", Chestermere's "check the published price", the awaiting-models lead's "we have not published prices for them", and iphone-6s-plus's "published price list".

**Verify:** 12 of 14, identical to before the session. The two failures are the pre-existing pixel-6 single-inbound-link gap and the browser audit's localhost Lighthouse target. Zero orphans, zero internal 404s, words/similarity/faq/schema/local-facts all pass.

**Blocked / open:** founding year (blocks any duration claim), the session-2 service pages (now six: FRP, screen lock unlocking, consoles repair list, gaming computers, MacBook, accessories content), and the standing client questions. The iPad rename and latest-model seeding are deliberately not in this session; the keyword-map report goes to the agency before the rename ships.

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

## Session 2026-08-10 (fourth) — Game console repair and the accessories shelf

**Asked:** two WhatsApp forwards from the client: "In repairs please add Gaming consoles XBox, XBox 1 series PS4 ps5 Nintendo Switch" and "Apart from repairs Please add phones, iPads and tablet accessories- cases, tamper glass, screen protectors and privacy screen protectors".

**Done:**

### /services/game-console-repair, the eighth Tier 2 hub

Xbox One, Xbox Series X and Series S, PlayStation 4, PlayStation 5, Nintendo Switch. The client named the consoles but not which repairs they carry out on them, so the page is deliberately diagnose-first: it names the consoles, describes the common faults as symptoms people bring in (HDMI port, heat, disc drives, Joy-Con drift, no power), and never claims a specific fix or a price. Every section says the console is diagnosed before quoting and no work starts before the figure is agreed. 1,308 words of prose, clearing the 900 floor. It is the one hub with no price table, no covered-repairs grid and no brand links, because consoles have no models in the catalogue; the template handles all three absences with existing guards, zero template changes. A "Consoles" group joined the /services index grid, with the port illustration standing in until a photograph clears the trademark rule.

### /accessories, a what-we-stock page rather than a shop

Cases, tempered glass, film screen protectors and privacy screen protectors, for phones, iPads and tablets. No prices, no cart, and no per-model stock claims: the page says stock varies and the phone number is the stock check, which is the honest version of a retail page for a walk-in counter. Definition patterns for the protector types, a real comparison table (film vs tempered vs privacy), and an honest-limits column saying plainly what the page does not promise. One claim to flag to the client: the page says a protector bought at the counter is fitted at the counter, which is standard practice for a shop that replaces screens but was not explicitly confirmed. Added to the header nav (six items now) and the footer Devices column.

### Housekeeping found on the way

- The footer Devices column still listed /repair/lg, /repair/motorola and /repair/htc; `toLink` was silently dropping them since the brand removal. Cleaned out.
- /computer-repair-calgary sat at 890 words, ten under the floor, a residue of the price scrub. One genuine paragraph added (bring the laptop with its charger, and why), plus its keyFacts had "Bring the tower" twice and "Quoted"/"Pricing" saying the same thing; deduplicated.
- The word floor, similarity, FAQ scoping, schema, pages, placeholders, noindex, not-found, keyboard, contrast, timezone and local-facts checks all pass. Similarity: service tier median 5.8% across 8 pages, site worst pair 52.7%, nothing near the 70% threshold.

**Verify status:** 12 of 14. The two failures are pre-existing and documented: /repair/google-pixel/pixel-6 has one inbound link (only published Pixel, sibling links are same-brand), and audit-browser's Lighthouse-95 target fails on localhost, which CLAUDE.md records as measurement noise, not the site. The contact-form paths inside the browser audit pass; a mid-session failure there was the shop's own rate limiter correctly refusing three audit submissions inside one window.

**Decisions:** console pricing is quote-after-diagnosis by design, not a gap. An early draft claimed "no charge for being told a repair is not worth doing", which invents a free-diagnosis policy; both instances were cut before commit.

### Follow-up in the same session: the password reset image

The client supplied a graphic of Google's FRP verification screens (the "Verify your account" prompt and a green unlocked-padlock motif carrying the Google G) for the password reset slot. Used as instructed, with two positions recorded in IMAGE_EDITS rather than silently: the Google mark inside the padlock is a manufacturer logo used as a design element, the case Section 8.9 recommends against and leaves as the client's call; and the image depicts Android FRP verification while the slot fronts the Windows computer password reset, so it may belong better on the phone unlocking page, which carries FRP removal, a one-line move if the client agrees. Same pipeline treatment as the teardown: pure white ground, padded to 3:2 rather than cropped, capped near native width. The stale home page comment about this slot (written for the Instagram image, made false by the welcome-screen replacement) is accurate again and was updated to name the current image.

### Follow-up in the same session: the phone repair image

The client supplied an exploded-view render of an iPhone Pro for the phone repair slot, replacing the iPhone 16 Pro Max rear from the previous change request. Two adjustments the pipeline needed: the 16:9 original sits on pure black, so a new `pad` option extends the canvas to 3:2 instead of cropping (a crop would clip the outer layers), and the slot is capped at the original's 738px width instead of upscaling to 1200, because a soft upscale is worse than a smaller sharp image. Renders on the home card, the /services card and the phone repair page. The image appears to be manufacturer marketing imagery; using it is the client's call and is recorded in IMAGE_EDITS. A higher-resolution original would sharpen the service page's wide rendering, worth asking for.

### Follow-up in the same session: the map loads by default

The client asked for the map to load without the click, and for a map on the page that says "Get directions to our Calgary shop". `MapReveal` now renders the iframe directly; the click gate's performance job moved to the iframe's native `loading="lazy"`, which defers the third-party request until the visitor scrolls near it. Every mount is well below the fold, the parent still supplies fixed dimensions, so LCP and CLS are untouched by design. The `/locations` index, which had the directions CTA but no map, now mounts one in its "Where exactly is the shop" section; home, /contact and the three place pages picked the change up through the shared component. CLAUDE.md's map-embed note rewritten to record the instruction and the mitigation. Noticed while verifying: Google's embed card shows the listing's own rating (4.8, 727 reviews) and postal code (T2A 0R2). That is Google rendering its data inside its iframe, not the site claiming it; but it means the client's listing now carries the numbers open question 8 is waiting on, and the postal code open question 10 asks for, both one confirmation away.

### Follow-up in the same session: the console image, and the home grid swap

The client supplied a photograph for the console page (a hand holding a controller in front of a driving game) and asked for the game console card to replace the carrier unlocking card in the home repairs grid. Done: the original went through the standard pipeline (`supplied-game-console` in `_source`, 1920x1280 so exactly 3:2, straight downscale to 1200x800 at 43 KB with LQIP), the slot registered in `lib/content/images.ts` with the manifest regenerated, and both the home card and the /services index card now carry it. The Sony wordmark on the controller is incidental to a gameplay photograph and is not used as a mark, per the revised Section 8.9 rule; the supplied filename indicates a stock original (Pixabay 1845880), so the photographer credit stays TODO(client) rather than guessed. Carrier unlocking keeps its header nav slot and footer link, so the home swap costs it no site-wide inbound link; the services section lead now names consoles. Placeholders test passes; home and /services prerenders verified to carry the image.

**Blocked / open:** which console repairs the shop actually performs (page tightens when answered); confirmation that counter-fitting of protectors is offered; plus the standing items (FRP proof list, review numbers or Maps API key, removed-brands policy).

## Session 2026-08-10 (third) — Every area tile navigates, and the map exists

**Asked:** the client flagged that some location tiles still go nowhere (Erin Woods, Penbrooke Meadows, Marlborough rendered as arrowless plain rows), and that there should be a map pointing at the shop.

**Done:**

### The last three areas got sections

Erin Woods, Penbrooke Meadows and Marlborough now have anchored sections on /locations/calgary, following the Dover/Ogden honest-unverified pattern: each states what is certain (the destination, the quote-first policy, the 30-minute wait; Marlborough gets its placement across Memorial Drive by Marlborough Mall, which the location record's landmarks carry) and the `verified: false` footer says plainly that directions are unpublished because unverified. The paragraphs do not repeat the footer. All eleven home tiles now navigate somewhere real; the link audit verifies 26 anchor targets, zero dead.

### The map was built in Phase 3 and never mounted

`MapReveal` (click-to-load Google Maps iframe, placeholder-first to protect LCP) existed in components/blocks/ but was used by zero pages. It now renders on the home "Find us" section, on all three place pages, and on /contact, using a keyless query-based embed URL so the pin carries the business listing. The click-to-load design is unchanged: the iframe still costs nothing until asked for.

### Geo coordinates, finally

Open question 12 asked for exact coordinates "or confirm we can read them from the Google Business Profile". The reviews URL the client supplied is that profile, and carries 51.0366821, -113.9869842. `geo` is now in site settings and `GeoCoordinates` is emitted on every `LocalBusiness` node. Question 12 marked answered.

### Audit refinement

The dead-link check from session 1 flagged a `/_next/static/css/` hash surfaced from an escaped script payload. Build internals are not content links, so the audit now excludes `/api` and `/_next` in one place.

**Operational note, second occurrence:** an incremental `pnpm build` served pre-edit prerenders again despite fresh sources. The webpack cache on this machine is not trustworthy after any interrupted build. **Standing rule: delete `.next` entirely before any build whose output will be verified or deployed.**

**Blocked / open:** unchanged (FRP proof list, consoles, accessories, review numbers/API key). Pre-existing pixel-6 single-inbound-link gap remains.

## Session 2026-08-10 (later) — Client change request, session 2: logos, FRP, repair menu, reviews link

**Asked:** the client supplied the logo files and answered part of the outstanding questions in one message: use the logos, add carrier unlocking and FRP removal, confirm the Motorola/LG/HTC/Nexus removal (already done in session 1), surface battery / back glass / charging port / earpiece / loudspeaker as repair options, and gave the Google Maps reviews URL.

**Done:**

### The logo is real now

The client supplied transparent background-removed PNGs (the auto-traced SVG versions were also sent but are lower fidelity). Both processed with sharp: trimmed, resized to 3x display size, palette-compressed to 13 KB each. `public/logo-on-light.png` (dark wordmark) renders in the white header, `public/logo-on-dark.png` (white wordmark) in the dark footer and mobile sheet. `Logo.tsx` now renders `next/image` with explicit dimensions; the typeset two-span wordmark is gone. The link keeps the accessible name so the image alt stays empty.

### FRP removal, on the unlocking page

`/services/phone-unlocking` became "Phone Unlocking and FRP Removal in Calgary": new section explaining what Factory Reset Protection is, the legitimate lockout cases, and the non-negotiable proof-of-ownership requirement, in the same register as the blacklist stance. New key fact, a limits card, a whoFor row, and a fifth page-specific FAQ. The exact list of accepted proof documents is still the client's to answer; the copy says "such as the original receipt" and tells people to phone ahead, which is honest without inventing policy.

### The wider repair menu on model pages

All five options already existed as repair types; the gap was display. Every phone model page now names, under its price table, whichever of battery / back glass / charging port / earpiece / loudspeaker its own table does not carry, quoted at the counter. Only the genuinely absent ones are listed so the sentence never contradicts the table. Non-phones get a generic "not in the table is not off the menu" line.

### Google reviews, first step

`googleReviewsUrl` added to site settings, types and `SITE`, with the client's Maps listing URL (tracking query params stripped). "Read our reviews on Google" now sits under the directions link in the footer, site-wide. **AggregateRating stays dormant**: the URL is supplied but the rating and count are not verified numbers, and ground rule 3 requires real supplied data. The full review wall (session 3) needs either a Maps API key or the numbers copied in by hand.

**Blocked / open:** FRP accepted-proof list; gaming consoles (which repairs?); accessories detail; review rating/count or API key.

**Next:** consoles and accessories pages once the client answers; review wall once numbers or key arrive.

## Session 2026-08-10 — Client change request, session 1: removals, fixes, wordmark, images

**Asked:** session 1 of the client's eleven-item change request: fix the broken location tiles, add the logo and fix the wordmark, remove Motorola, LG, HTC and Google Nexus with 301s, replace three service images, then verify and deploy. Sessions 2 (FRP removal, consoles, accessories) and 3 (Google reviews) explicitly not started.

**Done:**

### The broken locations were an affordance bug, not a routing bug

The client reported "only Forest Lawn works". Diagnosis: the home page's eleven "Areas we serve" tiles all rendered with the same green arrow and hover-ready styling, but only Forest Lawn carried an href. The other ten were plain divs that looked clickable and did nothing. Nothing 404'd, which is why the link audit never fired.

Fix, per the change request: seven areas that exist as anchored sections on /locations/calgary now link to their section (`#dover`, `#southview`, `#inglewood`, `#ogden`, `#downtown-calgary`, and both Albert Park and Radisson Heights to `#albert-park-radisson-heights`). Erin Woods, Penbrooke Meadows and Marlborough have neither a page nor a section, so they stay non-links, and `Tile` now renders a non-link without the arrow and without hover styling so nothing affords a click it cannot honour.

The audit gap is closed too: scripts/link-graph.ts now fails on any internal link that does not return 200, and on any `href="/path#fragment"` whose fragment has no matching `id` on the target page. It also no longer silently skips a page that fails to load. 23 anchor targets checked, zero dead.

### The wordmark

"Tech Brotherz" was `gap-1` on the Logo flex container. Removed; the wordmark is one word everywhere, matching the logo. **The supplied logo JPEGs are not in the repo**; the image swap is blocked until the files arrive, ideally as transparent PNG or SVG. The TODO in Logo.tsx says so.

### The four brands are gone

- 15 models removed from content/data/models.ts (156 to 141), all of them published, plus their 15 prose files and index entries
- 4 brand defs removed from lib/content/brands.ts (9 to 5), 4 routes from lib/routes.ts, 3 legacy price groups from lib/content/repair-types.ts
- One redirect rule in next.config.ts covers all 19 URLs: `/repair/:brand(lg|motorola|htc|google-nexus)/:path*` 301s (Next emits 308, equally permanent) to /services/phone-repair
- Copy scrubbed in lib/content/services.ts, lib/content/local.ts, home and services cards, and the trademark notice. Remaining grep hits are historical comments and the price archive, which keeps its rows as a record with a do-not-restore note
- CLAUDE.md Section 2.1, the content-model counts and the Tier 4 counts updated

**Similarity after the removal, the number the change request asked for:** the brand tier, the worst tier on the site and a named follow-up in CLAUDE.md, moved from 38.0% median / 63%+ worst pair (nine hubs) to **29.9% median / 45.7% worst pair** (five hubs). Model tier worst pair is 51.4% (iPhone 14 Pro / 14 Pro Max), all pairs under the 70% threshold. The legacy handsets were propping the numbers down, as predicted, but the removal still nets out as the tiers' best figures to date.

### The three images

All three sourced from Unsplash (free tier, not Unsplash+), committed under _source, processed through the standard 3:2 pipeline so the media frame is identical across the service cards:

- service-phone-repair: the back of an iPhone 16 Pro Max in titanium (Amanz, LqMK_dwsaxs), the camera array that identifies the model. Allowed under the revised 8.9 rule
- service-tablet-repair: a hand holding an iPad on its lock screen (Henry Ascroft, 7OFnb7NOvjw), replacing the SIM-tray corner shot
- service-password-reset: a phone showing the post-factory-reset welcome screen (Sam Grozyan, imOSfUb6Rg4), replacing the Instagram login screen the client had originally supplied and has now reversed on. No social branding anywhere in the three

### Verification

typecheck, lint, build:clean all clean. Extended link audit: zero dead links, zero dead anchors, zero orphans. Schema audit: no price-less Offers. FAQ scoping: pass. Similarity: pass, figures above. **scripts/test-no-prose-prices.ts now reports zero failures across 143 pages** (the launch-blocker baseline was 76 prose + 55 meta), so the top-of-file launch blocker's guard criterion is met on this build. content-similarity.ts had the same dead /repair-prices scrape link-graph.ts once had; fixed the same way.

**Known pre-existing failure, not fixed here:** /repair/google-pixel/pixel-6 has 1 inbound link against a minimum of 2, because it is the only published Pixel and same-brand sibling links cannot reach it. Predates this session.

**Blocked / open:**
- Logo files not in the repo; wordmark typeset until they arrive
- Client questions: brands refused outright or just unpromoted; transparent logo; FRP proof of ownership; console repairs; accessories detail; GBP URL and Maps API key
- /get-a-quote still unbuilt; pixel-6 inbound-link gap

**Next:** deploy, then session 2 on the client's answers.

## Session 2026-08-06 — Merge the two device sections, and two leftovers

**Asked:** delete "Which device needs fixing?" and move its photographs into the services grid; clear "and prices" out of every link label and widen the price guard so it catches link text; remove the nav item pointing at the unbuilt guides.

**Done:** all three, plus the stale-reference debris the first two uncovered.

### The two sections are one

The home page asked a visitor to choose a device twice: a four-card photo grid under "Which device needs fixing?" and a six-card icon grid under "What can we fix for you?", both linking to the same seven service hubs. The device section is deleted, `components/blocks/DeviceGrid.tsx` with it, and the photographs moved into the services grid.

`components/blocks/ServiceCard.tsx` is new and its point is the single media frame: same 3:2 ratio, same image radius, same inset inside the card padding, same hover, whether the card renders a photograph or a line drawing. A grid of matched frames reads as intentional. A 3:2 photo next to a square icon well reads as broken, which is the failure the merge exists to remove, so neither branch is allowed its own geometry.

**All six cards carry a photograph.** Four did immediately. The last two were drawn for part of the session and then filled from originals the client supplied mid-session.

The Phase 6.5b note said no usable photograph existed for unlocking or password reset. Re-tested under the relaxed rule, both existing candidates failed for reasons that were not the trademark rule: `service-phone-unlocking` was a second crop of the same frame as `service-tablet-repair`, two cards above it in the same grid, and `service-password-reset` showed a laptop being opened with a precision screwdriver, which is not what a password reset involves. A `sim` subject was added to `RepairIllustration` so the two drawings were not the same padlock twice.

The client then supplied a combination padlock on a chain-link fence and an Instagram login screen. Both are exactly 3:2, so they resize into the frame with no crop, and both **replaced the slot images rather than being added alongside**, so the hub pages are corrected too and the duplicate-crop problem is gone at the source. The `sim` and `lock` drawings stay as the fallback for a build with `public/demo/` deleted, which is what keeps the demo set non-load-bearing.

**One of the two does not meet CLAUDE.md Section 8.9, and that is recorded rather than quietly absorbed.** The Instagram wordmark is the dominant element on a plain background, which is the exact case the rule was written for and the reason the Samsung memory-card shot was rejected in 6.5b. Section 8.9 also says the trademark position is a recommendation and the client's call. The position was put to them, they chose the image, and `IMAGE_EDITS["service-password-reset"]` in `lib/content/images.ts` states all of that, so the manifest carries the decision and not just the file.

**`/services` followed.** Its seven cards were the last service grid still on icon wells, and they now use the same `ServiceCard` and the same media frame, each naming the demo slot its own hub page already uses as a header. One image per service, not two, and a visitor arriving from the grid sees the picture they clicked. The individual `/services/[service]` pages needed nothing: they already carry a header photograph and illustrated step cards.

`IconCard` stays in use, on the home page's "What you get on every repair" row. Those four are walk-in policy, turnaround, parts and labour and the warranty: abstractions with nothing to photograph, which is what an icon is for. The change was never "icons are worse", it was that a service has a picture and a policy does not.

Two dead fields went with the rewrite. `priceKey` on the `/services` card type indexed price lookups that no longer exist, and `icon` was what the photographs replaced. The local `ServiceCard` interface became `ServiceEntry`, because the imported component now owns that name.

`lib/content/images.ts` grew a `supplied()` constructor beside `image()`, because a client original has no Unsplash page and no known photographer. It sets `photographer: "TODO(client)"` and an empty `sourceUrl`, and the manifest renders "Supplied by the client" instead of a dead Unsplash link. **Attribution is still owed on both**, and a credit nobody can check would have been worse than a TODO.

The link labels also gained `mt-auto`, so six links sit on one line per row rather than six heights.

### tablet-repair versus ipad-repair

`/services/ipad-repair` **does not exist and never has.** It is one of the pre-Phase-5 URLs listed in `EXPECTED_404` in `scripts/audit-pages.ts`, and it 404s. `/services/tablet-repair` is the canonical route: registered, built, and the one the `/services` page and `DeviceGrid` both linked to.

The home page was the only place linking to the dead one. Production never emitted it, because `shouldRenderLink` gates on the registry and an unregistered path is not built, so the card rendered with no link at all; in development it pointed at a 404. **Removing the device section orphaned nothing.** The card now links to `/services/tablet-repair` and the grid is complete.

### "and prices", and what the guard could not see

Six home cards read "Phone repair details and prices" and so on, months after the prices came out. `scripts/test-no-prose-prices.ts` could not see it: it looks for a dollar sign followed by digits, and there is no dollar sign in "and prices".

The guard now has a third check, over the whole document rather than `<main>`, because the header and footer are where that phrasing survives longest. Every anchor, button and `aria-label` is read and must not contain the word. Two exemptions, both deliberate: a label containing a question mark is FAQ content rather than a promise about a destination, and a same-document `#` link cannot promise another page's content. Without them the real failures drown in FAQ questions about pricing policy, whose answers the prose pass already checks.

It found 27 pages on its first run. All fixed: the six home cards, "See every price" on nine brand hubs, "Every repair price we publish", "{model} repair prices" across the model tier and the 404 suggestions, "{Brand} repair prices" on seven service hubs, "the repair price list" on `/about`, `/locations`, `/warranty` and `/terms`, and two RelatedLinks headings.

### The nav item

`/guides` was in `HEADER_PATHS` as "Repair guides and answers", flagged `soon`. Renaming a link does not make a link to a page that does not exist worth having. Removed, along with the four `/guides/*` entries in the footer's Learn column and `/sitemap` in the legal row, which renders no flag at all and so read as an ordinary link straight to a 404 in development. All come back when the pages do.

While in `lib/nav.ts`: the matrix carried **eleven paths that are not in the route registry at all** — `/repair-prices`, the three pre-Phase-5 service hubs, the seven Calgary neighbourhoods and Airdrie cut by the Phase 6 four-fact rule, and the four guides. `toLink` dropped every one, so production was never wrong, but the columns were shorter than they read and development logged a warning per path per render. The Phase 6 cuts are replaced by the Tier 5 pages that actually carry that intent.

### The audits had stopped auditing

Deleting `/repair-prices` left five scripts pointing at it, and two of them were failing open rather than loud.

- **`scripts/link-graph.ts` discovered every model page by scraping `/repair-prices`.** That URL 301s, so the scrape returned nothing and the script reported on **zero model pages while printing a pass**. Brands now come from the registry and models from crawling the brand hubs, and it exits non-zero if the model list is empty. It immediately found two real failures.
- **`scripts/audit-pages.ts`** listed `/repair-prices` as a page and reported eight failures about a page that no longer exists: no h1, no canonical, no AnswerBox. It now asserts the 301 to `/contact` instead, which is the check actually owed on a URL that had inbound links.
- **`scripts/test-keyboard.ts`** tested the deleted price filter's search box, row hiding and aria-live count, and tabbed for a "Repair Prices" nav link. Block retired, nav check repointed at Services.
- **`scripts/test-not-found.ts`** matched suggestions on the text "repair prices", so the rename broke it. Matches "repair details" now.
- **`scripts/audit-browser.ts`** ran Lighthouse against `/repair-prices`, measuring a redirect hop and reporting "avoid multiple page redirects" as the top opportunity on a URL that renders nothing. Swapped for `/services`.

**Both link-graph failures were real and pre-existing.** `/repair/google-pixel/pixel-6` is the only published Pixel, so it has no siblings, and the fixed spine on the model page had dropped to four outbound links when `/repair-prices` left it. The Tier 5 local page and the Tier 2 service hub joined the spine, which takes every model to six or more and closes a rule that was owed anyway: CLAUDE.md Section 9 rule 4 requires the matching local page on every model page and it was missing site-wide.

### NEXT_PUBLIC_SITE_URL is gone, and the site is deployed

The first deploy to a new Vercel project failed the build outright: `lib/env-assert.ts` threw because `NEXT_PUBLIC_SITE_URL` was unset. The guard was doing exactly what it was written to do, and the right answer was still to delete it.

**The variable bought no flexibility.** The site has exactly one canonical origin and always did, so configuring a constant through a hosting provider only created a way for a build to die on any project that had not been told a value already written in this file. `lib/site-url.ts` now holds `CANONICAL_ORIGIN = "https://techbrotherz.com"`, `lib/site.ts` and `lib/utils.ts` read it, and `lib/env-assert.ts` is deleted.

**The protection it provided is kept and strengthened, which is the only reason this was safe.** The guard existed because the fallback was `http://localhost:3000`, and a build that quietly used it emitted localhost as the canonical of every page and the `@id` of every JSON-LD node, rendering perfectly and being uncrawlable. The fallback is now the real domain, so **that failure cannot happen at all** rather than being caught after the fact. `middleware.ts` also loses a hole: with the variable unset the staging noindex silently did nothing, on exactly the deployments most likely to be missing it. Verified by building with `.env.local` moved aside: 146 pages, canonical `https://techbrotherz.com`, and no `localhost:300` anywhere in the output.

`NEXT_PUBLIC_SITE_URL` still overrides when set, which is how the local audits point the whole site at `http://localhost:3100`. **A build now needs no environment variables at all.** The variable was also removed from the Vercel project, so the repo constant is the single source of truth.

**Deployed to https://techbrothers.vercel.app.** Note this is a **new project on a different team** — `vercel` was re-linked interactively and answered "link to existing project? no", so it is not the Phase 5 `techbrotherz` project on the client's account. Nothing carried over from that project, which is why the variable was missing in the first place.

**Measured on the deployment, median of 5, and it clears the target for the first time:**

| Page | Perf | A11y | BP | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | **96** | 100 | 100 | 2.65s | 0.000 | 77ms |
| `/services/laptop-repair` | **97** | 100 | 100 | 2.20s | 0.000 | 141ms |
| `/repairs/iphone-screen-replacement` | **98** | 100 | 100 | 1.72s | 0.000 | 72ms |

Every category at or above 95 on the median run, against Phase 6's 92 to 96. SEO reads 66 to 69 because this host is deliberately noindexed; `audit-lighthouse` recognises that and does not apply the SEO target. **Do not "fix" it by removing the noindex.** LCP still misses the 2.0s target in Section 8.1 on the home page at 2.65s, though the repair page reaches 1.72s.

Verified against the deployment, not just localhost: `test-staging-noindex` passes all five assertions including "canonical points at techbrotherz.com", plus `test-no-prose-prices`, `audit-pages`, `validate-schema`, `test-no-placeholders` and `link-graph` over all 138 pages.

### One build was silently corrupt

Rebuilding while `next start` held `.next` open produced an output whose prerendered HTML for `[locality]` and `locations/[...place]` was missing: every Tier 5 and Tier 6 URL returned 404 with `NoFallbackError`, and `pnpm build` had reported success. `audit-pages` caught it. Stopping the server, deleting `.next` outright and rebuilding fixed it. **On Windows, stop the server before building anything you intend to measure**, because `build:clean` only clears the fetch cache and does not protect against this.

**Files touched:** `app/(site)/page.tsx`, `app/(site)/about/page.tsx`, `app/(site)/locations/page.tsx`, `app/(site)/locations/[...place]/page.tsx`, `app/(site)/warranty/page.tsx`, `app/(site)/terms/page.tsx`, `app/(site)/services/[service]/page.tsx`, `app/(site)/repairs/[repair]/page.tsx`, `app/(site)/repair/[brand]/page.tsx`, `app/(site)/repair/[brand]/[model]/page.tsx`, `components/blocks/ServiceCard.tsx` (new), `components/blocks/RepairIllustration.tsx`, `components/blocks/NotFoundSuggestions.tsx`, `components/blocks/DeviceGrid.tsx` (deleted), `lib/nav.ts`, `scripts/test-no-prose-prices.ts`, `scripts/link-graph.ts`, `scripts/audit-pages.ts`, `scripts/audit-browser.ts`, `scripts/test-keyboard.ts`, `scripts/test-not-found.ts`, `lib/content/images.ts`, `lib/content/image-blur.json`, `scripts/process-images.ts`, `scripts/build-image-manifest.ts`, `content/image-manifest.md`, `public/demo/service-phone-unlocking.jpg`, `public/demo/service-password-reset.jpg`, `public/demo/_source/supplied-carrier-unlocking.jpg`, `public/demo/_source/supplied-password-reset.jpg`.

**Verified**, all against a build made from a deleted `.next` with the server stopped: `typecheck`, `lint`, `build` (146 pages) clean. `test-no-prose-prices` **passes in full**, prose, meta and link text. `audit-pages`, `validate-schema`, `test-faq-scoping`, `test-keyboard`, `test-not-found`, `test-contrast`, `test-no-placeholders`, `test-staging-noindex` all pass. axe **0 violations** on seven templates, 0 hydration warnings, 0 console errors. **CLS 0.000** on every page measured. Home LCP measured 2.44s, 2.90s and 3.0s across three separate `next start` sessions on the same code, which is the variance CLAUDE.md Section 12.1 describes and the reason localhost figures are not treated as a measurement of the site.

**`/services` now carries seven images, 408 KB, the largest image payload on the site**, and it did not cost anything measurable: 93 performance, LCP 3.0s and CLS 0 put it in the same band as every other page. Every card image on both grids is below the fold and `loading="lazy"`, so none of them is ever the LCP element; the home hero still is.

**Blocked / open:**

- **The deployment is on a new project, not the client's.** `shivani-patels-projects-4d983f8e/techbrothers`, aliased to `techbrothers.vercel.app`. The Phase 5 project `techbrotherz` on the client's account is now unlinked and its `techbrotherz.vercel.app` deployment is stale. Decide which is the real staging host before the domain is pointed anywhere.
- **`/repair/google-pixel/pixel-6` still has one inbound link**, against an internal minimum of two. It is not an orphan and there are no internal 404s. `/repair-prices` was the one page that linked all 84 models, and its replacement is the HTML sitemap at `/sitemap`, which CLAUDE.md Section 9 rule 9 calls the orphan insurance policy and which Phase 8 has not built. Rule 7, "every service hub links to its top 6 popular models", would also close it and is likewise unimplemented.
- **The `WebSite` `SearchAction` in `lib/seo/schema.ts` still points at `/repair-prices?q=`**, a URL that 301s to a page with no search. Left alone because the fix is a decision, not an edit: either the site gets a search page or the `SearchAction` comes out, and CLAUDE.md Section 8.2 currently requires it.
- **Attribution for both supplied images.** `photographer` is `TODO(client)` on `service-phone-unlocking` and `service-password-reset`, and the manifest says "Supplied by the client" where the others link a source page. If they came from a stock library, the licence and the credit both need recording before launch.
- **The ten Tier 3 h1s still read "... Prices"**, for example "iPhone Screen Replacement Prices", and prose across the site still discusses pricing. Both are the 7a-ii work, not link text, and changing an h1 moves the title, the meta description and the keyword map with it.

**Next:** confirm which Vercel project is the real one, then Phase 7 guides.

## Session 2026-08-04 — Remove the backend, ship a static site

**Asked:** "we do not need any backend here please remove the backend we need a static site just remove the sanity part"

**Done:** Sanity is gone. Six document types became TypeScript constants, the query layer became an accessor layer over them, and the Studio, the revalidation webhook, draft mode, the seed and migration scripts and ten packages were deleted. 188 documents, zero images. `pnpm build` needs no credentials.

This is the end of the road Phase 6.9 started down. That phase collapsed 17 types to six under "if the shop owner will not edit it, it does not belong in Sanity"; the answer here was that nothing is edited through a CMS at all, so the six followed.

**The approach was the same one Phase 6.9 used, and for the same reason.** The accessors keep their names, signatures and returned shapes, so no page file changed. A refactor that changes every consumer is a rewrite in disguise, and a rewrite cannot be diffed against a baseline.

**The diff is the evidence, and it also fixed the outstanding Phase 6.9 regressions.** Against `snapshots/before/`, all 143 content pages:

- 51 byte-identical on the content surface
- 92 differing only in an `_updatedAt` timestamp, which the price migration necessarily bumped
- **zero price-table changes**, checked as ordered cell lists: no reordering, no row-count change, no value change, quote-only rows included

The four regressions reported at the end of Phase 6.9 are all closed, and three of them were caused by the same mistake: reimplementing a GROQ ordering or filter by hand and losing a clause.

| Was wrong | Why | Now |
| --------- | --- | --- |
| 18 model pages rendered "ipad-3" instead of "iPad 3" | `hydrateModel` took an optional name lookup no caller passed | Names come from a slug map built over the model constant |
| 9 brand hubs lost their "Last updated" line | The brand document that carried `_updatedAt` became a code constant | Newest model `_updatedAt`, falling back to flat services for laptops-desktops, which has no models |
| Home showed "to Moto X Play" instead of "to Moto G (3rd gen)" | `order(releaseYear desc, name asc)` lost its name tie-break | `byYearThenName`, comparing by code point because GROQ does and `localeCompare` disagrees on punctuation |
| /contact and /locations listed five unpublished neighbourhoods | `NEAREST_LOCATIONS_QUERY` filtered `published` and ordered by `distanceKm`; the Phase 6.9 constant kept neither, and only Calgary and Forest Lawn are published | Both restored, and locations re-exported as whole documents rather than a projection |

**One regression was mine, introduced during this session and caught by the same diff.** The export script stripped `_type` recursively to drop Sanity bookkeeping, which also stripped it from the portable-text blocks inside every FAQ answer. `/faq` rendered "[@portabletext/react] Unknown block type undefined" and lost 5,900 characters. Restored `_type` on 48 blocks and 48 spans. Nothing else in the export used portable text, and the locations export was written differently and was unaffected.

**Verification:** `pnpm typecheck` and `pnpm lint` clean, 148 routes build, `audit:schema` passes 13 templates with no price-less Offers, `test:faq` passes with every question unique to one URL, `link-graph` reports no orphans, `test:no-placeholders` passes.

**What retired with the dataset,** all recorded in CLAUDE.md rather than quietly dropped: cache tags and ISR, draft mode, the read token and its silent-empty-site failure mode, the build determinism check, `sanity typegen`, and the write-client guard. `lib/env-assert.ts` survived by being repointed at `NEXT_PUBLIC_SITE_URL`, the one variable that still fails silently: a production build without it emits localhost canonicals and is quietly uncrawlable, which shipped once on the first Vercel deploy.

**Files touched:** added `content/data/{types,site-settings,models,faqs,flat-services,unlocking,testimonials,locations}.ts` and `lib/data/{index,catalogue,content,locations,site}.ts`; deleted `sanity/`, `app/studio/`, `app/api/`, `sanity.config.ts`, `sanity.cli.ts`, `lib/content/locations.ts` and 14 scripts; repointed 19 page imports; rewrote `lib/env-assert.ts`; edited `next.config.ts`, `package.json`, `.env.example`, `scripts/verify.ts`, `lib/site.ts`, `CLAUDE.md`, `README.md`.

**Left open, and needing a decision:**

1. **The Sanity project still exists**, with production untouched at 917 documents. Nothing reads it. Delete it when you are satisfied the site is correct, and revoke the two tokens pasted into chat during Phase 6.9, which should be rotated regardless.
2. **`.env.local` still names a Sanity project and dataset.** Harmless, unread, and worth tidying.
3. **The 92 pages whose "Last updated" moved to 31 July** say the migration day, not the day the content changed. Unavoidable, and worth knowing before the client asks.
4. **Vercel still has the Sanity environment variables set** and will keep building fine without them being removed.

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
