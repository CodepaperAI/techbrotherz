# DESIGN.md — TechBrotherz Design System

The single machine-readable source of truth for tokens is the `@theme` block in `app/globals.css`. This document is the human spec: another engineer should be able to rebuild the system from it without seeing the site.

---

## 1. Direction

We borrow the **layout language and visual rhythm** of the reference template (the yellow "Fixmate" screenshots), then re-skin it to the TechBrotherz logo. We are borrowing structure, not page inventory and not copy.

### Carried over from the reference

- Warm off-white page background, pure white cards.
- Full-bleed near-black sections used as chapter breaks.
- Very large, tight, bold sans headlines. Two lines. Centred for section headers, left-aligned in the hero.
- Section eyebrow: a small filled dot in the accent colour followed by a one-word label, centred above the headline.
- Fully rounded pill buttons with a trailing arrow.
- Generous rounded corners on cards and images, 20 to 28 px.
- Wide gutters, tall section padding, calm and uncluttered.
- Step cards with an inner rounded photo, a small pill chip ("Step 1"), a title, two lines of copy.
- Feature grids 3 across on desktop with a thin outline icon top-left.
- Alternating image and text blocks with a three-point checklist and a pill CTA.

### Deliberately changed

| Reference                 | TechBrotherz                                                        | Why                                     |
| ------------------------- | ------------------------------------------------------------------- | --------------------------------------- |
| Accent yellow             | Brand green `#21B24B`                                               | Taken from the logo mark                |
| Dark navy                 | Neutral near-black `#0A0D0C`                                        | Matches the logo's black field          |
| No metallic accent        | Brushed silver `#C4CBD2` as hairlines and small labels on dark only | Echoes the chrome lettering in the logo |
| Fake rating badge in hero | Real `TrustStrip`                                                   | We never ship invented social proof     |
| Fake avatar stack         | Removed                                                             | Same reason                             |
| "Trusted by" logo cloud   | Replaced with verifiable facts                                      | Same reason                             |

---

## 2. Colour tokens

```css
--tb-green: #21b24b; /* primary brand, from the logo mark */
--tb-green-deep: #0f7a30; /* accessible green for TEXT on light backgrounds */
--tb-green-press: #17903a; /* button hover / pressed */
--tb-green-soft: #e9f7ed; /* tinted section and chip background */
--tb-ink: #0a0d0c; /* dark sections, headings, button label on green */
--tb-ink-2: #141917; /* elevated surface inside dark sections */
--tb-cream: #f6f5f1; /* page background */
--tb-white: #ffffff; /* cards */
--tb-silver: #c4cbd2; /* chrome accent, hairlines and labels on dark */
--tb-text: #10130f; /* body text on light */
--tb-muted: #5c6360; /* secondary text on light */
--tb-muted-dark: #a9b0ac; /* secondary text on dark */
--tb-border: #e6e4de; /* 1px card and divider borders on light */
--tb-border-dark: #232b27; /* borders inside dark sections */
```

### 2.1 Contrast rules, enforced

| Pairing                           | Ratio   | Verdict                                                    |
| --------------------------------- | ------- | ---------------------------------------------------------- |
| `--tb-text` on `--tb-cream`       | ~17.0:1 | Body text on light. Default.                               |
| `--tb-muted` on `--tb-cream`      | ~5.9:1  | Secondary text on light. Passes AA for all sizes.          |
| `--tb-green-deep` on `--tb-cream` | ~5.5:1  | **The only green permitted for text on light.** Passes AA. |
| `--tb-green` on `--tb-cream`      | ~2.6:1  | **Fails.** Never body text, never small text, never links. |
| `--tb-green` as a large fill      | n/a     | Allowed: buttons, dots, chips, icon fills, rules.          |
| `--tb-ink` on `--tb-green`        | ~8.0:1  | **Button label on a green fill is ink, not white.**        |
| `--tb-white` on `--tb-ink`        | ~19.6:1 | Headings and body on dark.                                 |
| `--tb-muted-dark` on `--tb-ink`   | ~9.0:1  | Secondary text on dark.                                    |
| `--tb-silver` on `--tb-ink`       | ~11.8:1 | Small labels and hairlines on dark.                        |
| `--tb-green` on `--tb-ink`        | ~6.2:1  | Green text on dark is permitted at any size.               |

**The two rules broken most often:**

1. Green text on a light background is `--tb-green-deep`. Never `--tb-green`.
2. Text on a green fill is `--tb-ink`. Never white.

### 2.2 Focus ring

Every interactive element uses one visible ring, never `outline: none` without a replacement:

```css
outline: 2px solid var(--tb-green-deep);
outline-offset: 2px;
```

On dark sections the ring switches to `--tb-green` for contrast. Implemented as the `.focus-ring` utility in `globals.css`.

---

## 3. Typography

### 3.1 Families

| Role               | Family                          | Fallback stack                                   |
| ------------------ | ------------------------------- | ------------------------------------------------ |
| Display / headings | **Plus Jakarta Sans** (current) | `Satoshi, Inter, system-ui, sans-serif`          |
| Body / UI          | **Inter**                       | `system-ui, -apple-system, Segoe UI, sans-serif` |

**Font decision, recorded.** The reference's headline face is closest to **Satoshi** (Fontshare). Satoshi is not on Google Fonts and must be self-hosted from Fontshare, which needs a licence confirmation from the client. Until that is confirmed (open question 16 in CLAUDE.md), the display face is **Plus Jakarta Sans**, which is a geometric grotesque with the same tight, bold, slightly humanist character and is served self-hosted by `next/font/google`.

**Upgrade path if Satoshi is approved:** drop `Satoshi-Variable.woff2` into `app/fonts/`, swap `next/font/google` for `next/font/local` in `app/fonts.ts`, keep the same CSS variable name `--font-display`. Nothing else in the codebase changes.

Both fonts load through `next/font` with `display: "swap"`, `subsets: ["latin"]`, and an `adjustFontFallback` metric so there is **zero layout shift** on font swap.

### 3.2 Type scale

Desktop value first, mobile second. Mobile is the value at the `md` breakpoint and below.

| Role            | Size        | Weight | Tracking | Leading |
| --------------- | ----------- | ------ | -------- | ------- |
| Hero H1         | 72px → 40px | 700    | -0.035em | 0.95    |
| Section H2      | 56px → 32px | 700    | -0.03em  | 1.05    |
| Card / H3       | 24px → 20px | 700    | -0.015em | 1.2     |
| Lead paragraph  | 20px → 17px | 400    | 0        | 1.5     |
| Body            | 17px → 16px | 400    | 0        | 1.65    |
| Eyebrow / chip  | 14px        | 500    | 0.01em   | 1       |
| Caption / legal | 13px        | 400    | 0        | 1.5     |

Exposed as utilities: `.type-h1`, `.type-h2`, `.type-h3`, `.type-lead`, `.type-body`, `.type-eyebrow`, `.type-caption`.

### 3.3 Rules

- Headlines wrap to **two lines**. Use `text-balance` on headings and `text-pretty` on lead paragraphs.
- Body copy line length caps at **68 characters** (`max-w-[68ch]`).
- **Price tables use `font-variant-numeric: tabular-nums`.** Exposed as `.tabular`.
- Never use font weights other than 400, 500 and 700.
- Never set letter-spacing on body copy.

---

## 4. Layout

| Property                 | Desktop | Tablet | Mobile |
| ------------------------ | ------- | ------ | ------ |
| Container max width      | 1280px  | fluid  | fluid  |
| Gutter                   | 40px    | 32px   | 24px   |
| Grid columns             | 12      | 6      | 4      |
| Section vertical padding | 128px   | 96px   | 72px   |
| Dark section padding     | 144px   | 112px  | 88px   |
| Feature grid             | 3-up    | 2-up   | 1-up   |
| Step cards               | 3-up    | 1-up   | 1-up   |

Dark sections get an extra 16px of vertical padding on every breakpoint, so a black chapter break reads as heavier than the light section above it.

### 4.1 Radius scale

| Token          | Value | Applied to                                   |
| -------------- | ----- | -------------------------------------------- |
| `--tb-r-chip`  | 999px | Chips, pills, buttons, avatars               |
| `--tb-r-input` | 12px  | Inputs, selects, textareas                   |
| `--tb-r-card`  | 20px  | Cards, price table shell, FAQ items          |
| `--tb-r-image` | 24px  | Images inside cards and split blocks         |
| `--tb-r-panel` | 28px  | Large hero panels, full-bleed feature panels |

### 4.2 Spacing scale

Tailwind's default 4px scale, restricted in practice to: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128. Do not invent values in between.

- Card padding: 32px desktop, 24px mobile.
- Grid gap: 24px.
- Space between an eyebrow and its H2: 16px.
- Space between an H2 and its lead paragraph: 20px.
- Space between a section header block and the content grid: 64px desktop, 40px mobile.

### 4.3 Shadow scale

Almost none. This is a flat, calm system.

| Token              | Value                           | Applied to                                      |
| ------------------ | ------------------------------- | ----------------------------------------------- |
| `--tb-shadow-card` | `0 1px 2px rgba(10,13,12,.04)`  | Cards on cream, paired with a 1px `--tb-border` |
| `--tb-shadow-lift` | `0 4px 16px rgba(10,13,12,.06)` | Card hover only                                 |
| `--tb-shadow-nav`  | `0 1px 0 rgba(10,13,12,.06)`    | Sticky nav hairline after scroll                |

**Cards on dark sections use no border and a pure white fill.** No shadow at all, the contrast does the work.

---

## 5. Motion

| Interaction         | Duration | Easing                     | Detail                        |
| ------------------- | -------- | -------------------------- | ----------------------------- |
| Hover / focus       | 180ms    | `ease-out`                 | Colour, border, transform     |
| Scroll reveal       | 500ms    | `cubic-bezier(.16,1,.3,1)` | Fade in plus rise 16px        |
| Reveal stagger      | 60ms     | n/a                        | Per item in a grid            |
| Accordion           | 220ms    | `ease-out`                 | Height and opacity            |
| Sticky bar entrance | 220ms    | `ease-out`                 | Slide up from the bottom edge |

**Nothing bounces. Nothing parallaxes. Nothing auto-plays.**

`prefers-reduced-motion: reduce` is respected globally: all transitions and animations drop to `0.01ms`, reveals render at their final state immediately, and the sticky bar appears without a slide.

---

## 6. Component anatomy

### 6.1 `Container`

Max width 1280px, `mx-auto`, gutter 24px mobile / 40px desktop. Owns horizontal constraint. **Nothing else on a page sets `max-w-*`.**

### 6.2 `Section`

Owns vertical rhythm. Variants:

| Variant | Background        | Text         | Border                               |
| ------- | ----------------- | ------------ | ------------------------------------ |
| `light` | `--tb-cream`      | `--tb-text`  | none                                 |
| `tint`  | `--tb-green-soft` | `--tb-text`  | none                                 |
| `dark`  | `--tb-ink`        | `--tb-white` | `--tb-border-dark` on inner dividers |

Props: `variant`, `as` (defaults to `section`), `id`, `className`. **Pages never set their own section padding.**

### 6.3 `Eyebrow`

A 8px filled circle in `--tb-green` followed by a 14px / 500 label in `--tb-muted` on light or `--tb-silver` on dark. Gap 8px. Centred above section headings, left-aligned in the hero. One word or two, never a sentence. Uppercase is not used, sentence case only.

```
● Repairs
```

### 6.4 `Heading`

Levels 1 to 3 mapped to the type scale. `balance` prop on by default. An `eyebrow` prop renders the `Eyebrow` above it with the correct 16px gap. A `lead` prop renders the lead paragraph below with the correct 20px gap and 68ch cap.

### 6.5 `PillButton`

| Variant       | Fill         | Label        | Border                 | Hover                           |
| ------------- | ------------ | ------------ | ---------------------- | ------------------------------- |
| `primary`     | `--tb-green` | `--tb-ink`   | none                   | fill → `--tb-green-press`       |
| `ghost`       | transparent  | `--tb-text`  | 1px `--tb-border`      | border → `--tb-ink`, bg → white |
| `dark`        | `--tb-ink`   | `--tb-white` | none                   | fill → `--tb-ink-2`             |
| `ghostOnDark` | transparent  | `--tb-white` | 1px `--tb-border-dark` | border → `--tb-silver`          |

Anatomy: fully rounded (999px), height 52px desktop / 48px mobile, padding 28px horizontal, 16px / 500 label, trailing `ArrowRight` icon at 18px that translates 2px on hover. Renders as `<a>` when given `href`, otherwise `<button>`. `size="sm"` gives a 40px height for in-card CTAs.

**Do:** one primary button per section.
**Don't:** put a white label on a green fill. Don't stack two primary buttons side by side, the second is always `ghost`.

### 6.6 `Card`

White fill, 1px `--tb-border`, radius 20px, padding 32px, `--tb-shadow-card`. On dark sections: white fill, no border, no shadow. Hover raises to `--tb-shadow-lift` only when the whole card is a link.

### 6.7 `Chip`

Radius 999px, height 28px, padding 12px horizontal, 14px / 500. Variants: `soft` (`--tb-green-soft` bg, `--tb-green-deep` text), `solid` (`--tb-green` bg, `--tb-ink` text), `dark` (`--tb-ink-2` bg, `--tb-silver` text).

### 6.8 `IconCard`

`Card` with a thin outline `lucide-react` icon top-left at 28px, `strokeWidth={1.5}`, colour `--tb-green-deep` on light or `--tb-green` on dark. Icon sits in a 56px square with `--tb-green-soft` background and radius 16px. Then an H3, then two lines of body copy. Optional trailing text link.

### 6.9 `StepCard`

`Card` containing, top to bottom: an inner image at radius 24px with a 4:3 aspect ratio, a `Chip` reading "Step 1", an H3 title, and exactly two lines of body copy. Used 3-up on desktop, 1-up on mobile. Steps are numbered in the chip, never in the title.

### 6.10 `SplitBlock`

Two columns, 6/6 on desktop, stacked on mobile with the image first. One side is an image at radius 24px, the other is: `Eyebrow`, H2, lead paragraph, a three-item checklist with `Check` icons in `--tb-green-deep` inside a `--tb-green-soft` circle, then one `PillButton`. `reverse` prop swaps sides. Alternate `reverse` down the page.

### 6.11 `PriceTable` and `PriceRow`

**Real `<table>` markup. Never a div grid.** Answer engines extract tables, and a div grid is invisible to them.

```html
<table>
  <caption>
    iPhone 8 Plus repair prices at TechBrotherz in Calgary
  </caption>
  <thead>
    <tr>
      <th scope="col">Repair</th>
      <th scope="col">Price (CAD)</th>
      <th scope="col">Typical time</th>
      <th scope="col">Warranty</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Screen / LCD replacement</th>
      <td>$109.99</td>
      <td>About 30 minutes</td>
      <td>60 days</td>
    </tr>
  </tbody>
</table>
```

- Shell: radius 20px, 1px `--tb-border`, white fill, `overflow-x: auto` on mobile.
- Header row: `--tb-green-soft` background, 14px / 500, `--tb-green-deep` text.
- Row height 56px, 1px `--tb-border` divider, no zebra striping.
- Price cell: 17px / 500, `.tabular`, right-aligned on desktop.
- `quoteOnly` rows render "Call for quote" as a `--tb-green-deep` link to `tel:+14032738324`, never an em dash, never "N/A".
- Every table has a `<caption>`. It may be visually hidden but it must exist.
- Below every price table: the line "All prices include the part and labour, and every repair is covered by a 60-day warranty."

### 6.12 `ModelGrid`

Responsive grid of model links, 4-up desktop / 2-up mobile. Each tile: model name, "from $X" or "Call for quote", radius 20px, 1px border, hover border → `--tb-ink`. Anchor text is the full model name, never "view".

### 6.13 `FaqAccordion`

`<dl>` of disclosure items. Each item is a `<button>` with `aria-expanded` and `aria-controls`, radius 20px, 1px `--tb-border`, padding 24px, `Plus` icon rotating to `X` at 180ms. Open state reveals the answer at 220ms. **First item closed by default**, so the page has no arbitrary emphasis.

Accessibility: the trigger is a real button, arrow keys are not hijacked, and the panel is not `display: none` when open for print. **The answer text is always in the DOM** so crawlers and answer engines read it whether or not it is expanded.

### 6.14 `AnswerBox`

**The single most important AEO component.** Sits directly under the H1 on every substantive page.

Anatomy, top to bottom:

1. A 4px left rule in `--tb-green`, background `--tb-green-soft`, radius 20px, padding 32px.
2. **A bolded 40 to 60 word direct answer** at lead size that fully answers the page's core question on its own and names the entity: "TechBrotherz in Calgary charges ...".
3. A "Key facts" list of 3 to 5 items: price or price range, time, warranty, appointment policy, location. Each is a fact with a number, never an adjective.
4. A "Last updated" caption bound to Sanity `_updatedAt`.

The answer paragraph carries `data-speakable="answer"` so the `speakable` JSON-LD selector can point at it.

**Do:** "TechBrotherz in Calgary charges $109.99 to replace an iPhone 8 Plus screen, including the part and labour. Most screen replacements take about 30 minutes while you wait, no appointment is needed, and every repair is covered by a 60-day warranty."
**Don't:** "We offer great prices on iPhone repairs, come see us today."

### 6.15 `TrustStrip`

The honest replacement for the reference's fake logo cloud. Four items in a row on desktop, 2x2 on mobile, separated by 1px `--tb-border` verticals. Each is a small `lucide-react` icon plus a short fact:

- 60-day warranty
- No appointment needed
- Approximately 30-minute wait
- Parts and labour included

**Never** put a star rating, an avatar stack, a customer count or a "trusted by" logo in this component. If the client supplies real Google review data, a verified rating may be added as a fifth item and only then.

### 6.16 `Breadcrumbs`

Visible on every page except home. Small caption-size text, `--tb-muted`, `ChevronRight` separators at 14px. Current page is plain text with `aria-current="page"`, not a link. Always paired with `BreadcrumbList` JSON-LD emitted from the same data array, so the visible trail and the schema can never drift.

### 6.17 `RelatedLinks`

A titled block of 3 to 6 links in a bordered card. Title is a question or a real phrase ("Other iPhone models we repair"), never "Related". Anchor text is always the full descriptive page name.

### 6.18 `LocalInfoCard`

Two columns on desktop. Left: a lazy-loaded map embed at radius 24px with a `loading="lazy"` iframe and a `title`. Right: the full NAP block, an hours `<table>` with `<th scope="row">` per day, a `tel:` phone link, a "Get directions" `PillButton` to the Google Maps URL, and the walk-in policy line. Today's row in the hours table is marked with a `Chip` reading "Open now" or "Closed now", computed client side against America/Edmonton.

### 6.19 `StickyCallBar`

Mobile only, hidden at `md` and above. Appears after 400px of scroll, slides up 220ms. Fixed to the bottom, full width, `--tb-ink` background, safe-area inset padding. Two buttons: "Call (403) 273-8324" (primary green, ink label) and "Directions" (ghost on dark). Adds bottom padding to the page so it never covers the footer's last row.

### 6.20 `Nav`

Logo left. Centred links: Services, Repair Prices, Unlocking, Locations, Guides, About, Contact. Right: the phone number as a `tel:` link plus a green "Get a quote" pill. Thin 1px bottom hairline. Sticky, transparent at the top, gains a `backdrop-blur` and `--tb-shadow-nav` after 8px of scroll.

Mobile: logo, phone icon, hamburger. Opens a full-screen sheet with large links and a call button pinned at the bottom. Focus is trapped while open, `Esc` closes, body scroll locks, and the trigger regains focus on close.

### 6.21 `Footer`

Dark. Four link columns plus a brand column.

| Column            | Contents                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| 1. Repairs        | iPhone, Samsung, iPad, Tablet, Laptop, Computer, Unlocking, Password reset                       |
| 2. Popular models | Top 8 models by search demand, from Sanity `popular: true`                                       |
| 3. Areas          | Calgary, SE Calgary, Forest Lawn, Inglewood, Dover, Marlborough, Ogden, Chestermere, Airdrie     |
| 4. Learn          | Top 6 guides, FAQ, Warranty, About, Contact                                                      |
| Brand             | Logo, one-sentence description, full NAP, hours table, `tel:` phone, Google Maps directions link |

Column headings are 14px / 500 in `--tb-silver`. Links are 16px `--tb-muted-dark`, hover `--tb-white`. Bottom bar: copyright, privacy, terms, HTML sitemap link, plus `rel="alternate"` links to `/llms.txt` and `/llms-full.txt`.

---

## 7. Do and don't

| Do                                                  | Don't                                    |
| --------------------------------------------------- | ---------------------------------------- |
| Use `--tb-green-deep` for green text on light       | Use `--tb-green` for any text on light   |
| Use `--tb-ink` for the label on a green button      | Use white on a green button              |
| Build price and comparison data as a real `<table>` | Build it as a div grid                   |
| Write "about 30 minutes" and "$89.99"               | Write "fast" and "affordable"            |
| Give every section one primary CTA                  | Stack two primary buttons                |
| Keep body copy to 68 characters per line            | Let a lead paragraph run the full 1280px |
| Let `Section` own vertical padding                  | Add `mt-32` to a page wrapper            |
| Use tokens for every colour                         | Write a raw hex in a component           |
| Ship the real `TrustStrip`                          | Ship a star rating we cannot verify      |
| Cap headlines at two lines                          | Let an H1 wrap to four lines on mobile   |
| Use `lucide-react` at `strokeWidth={1.5}`           | Mix icon sets or use filled icons        |

---

## 8. Accessibility floor

- WCAG 2.1 AA contrast on every pairing. See the table in Section 2.1.
- Visible focus ring on every interactive element. Never remove an outline without replacing it.
- Semantic landmarks: one `<header>`, one `<main>`, one `<footer>`, `<nav aria-label>` on each nav region.
- Exactly one `<h1>` per page, no skipped heading levels.
- Every image has descriptive `alt` naming the device and the repair. Decorative images get `alt=""`.
- Every icon-only button has an `aria-label`.
- Tables have `<caption>` and `<th scope>`.
- `prefers-reduced-motion: reduce` disables all transitions, animations and reveals.
- Target size minimum 44 x 44px for touch targets.
- Colour is never the only carrier of meaning. "Call for quote" is text, not a coloured dot.

---

## Imagery

Added in the Phase 6.5 imagery pass. No new visual language: the radii, cards and spacing are the ones already specified above.

### Treatment

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| Image radius | 24px (`rounded-image`)                                 |
| Card radius  | 20px (`rounded-card`), unchanged                       |
| Ratios       | 4:3 for the home hero, 3:2 everywhere else             |
| Source cap   | 1600px long edge, JPEG quality 74                      |
| Delivery     | `next/image`, AVIF and WebP, explicit width and height |
| Placeholder  | 16px base64 LQIP, blurred, on every image              |
| Priority     | The home hero only. Everything else lazy               |

Every image sits inside a container with an explicit aspect ratio, so the space is reserved before the picture arrives. CLS is 0.000 across the site and this pass was measured specifically to confirm it stayed there.

### Grade

Cool neutral light, real workshop surfaces, no heavy colour filters. Where a source is warmer than the rest of the set it is pulled toward neutral in `scripts/process-images.ts` rather than accepted as-is, so the set reads as one shoot rather than six sources.

### Brand cards

**No manufacturer logos**, because a logo sitting in a card slot is a logo used as a mark, which is the narrow case that actually matters. A brand card carries five things in order:

1. Silhouette panel, 3:2, soft green tint, brand green stroke, tint deepening on hover
2. Wordmark in Plus Jakarta Sans
3. Model range, e.g. "iPhone 4 to iPhone 16"
4. Model count
5. Starting price

The range and the price are what stop nine cards looking identical, and both are real catalogue data. Hover lifts the card 2px over 180ms ease-out. Three silhouettes: phone, tablet, laptop, drawn at stroke width 1.5 to match the icon set.

### Illustrations

Eight line drawings, in the same language as the icons: screen, battery, port, camera, keyboard, board, lock, diagnostic. Brand green on the soft green tint, at the image radius, sized to three fifths of their panel.

They exist so a card without a photograph renders something deliberate rather than an empty frame. Used for the 35 service process cards and the 16 repair pages' step cards, where a photograph would be one stock image repeated across dozens of slots.

**Photograph where a picture shows the work. Illustrate where a marker is doing the job.** A process step is a marker.

### The rule that governs all of it

**Stock photography may show the work. It may never depict the business.** No stock storefront on a location page, no stock person on `/about`, no stock interior captioned as the shop. Alt text describes what the photograph shows, never who it is.

Location pages, `/about` and `/contact` carry no photography at all. A map and an address are the honest content for a place.
