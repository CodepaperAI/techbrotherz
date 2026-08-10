import { BenefitStrip } from "@/components/blocks/BenefitStrip";
import { NumberedList } from "@/components/blocks/NumberedList";
import { Ticker } from "@/components/blocks/Ticker";
import { Tile, TileGrid } from "@/components/blocks/Tile";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PillButton } from "@/components/primitives/PillButton";
import { Section } from "@/components/primitives/Section";

/**
 * The Phase 8 visual layer, rendered in one place for review.
 *
 * This sits at the top of /styleguide deliberately. The rebuild is meant to be
 * judged before any page is touched, and judged on the things that actually
 * changed: the display face, the button shape, the radii, how hard the accent
 * is used, and how the surfaces alternate.
 */

const SURFACES = [
  { name: "--tb-black", hex: "#0B0C0B", cls: "bg-tb-black" },
  { name: "--tb-black-2", hex: "#161816", cls: "bg-tb-black-2" },
  { name: "--tb-paper", hex: "#FAFAF8", cls: "bg-tb-paper" },
  { name: "--tb-paper-2", hex: "#F1F1ED", cls: "bg-tb-paper-2" },
  { name: "--tb-white", hex: "#FFFFFF", cls: "bg-tb-white" },
  { name: "--tb-green", hex: "#1FB84A", cls: "bg-tb-green" },
  { name: "--tb-green-deep", hex: "#0E7A31", cls: "bg-tb-green-deep" },
  { name: "--tb-silver", hex: "#C6CCD2", cls: "bg-tb-silver" },
  { name: "--tb-rule", hex: "#DFDFD8", cls: "bg-tb-rule" },
  { name: "--tb-rule-dark", hex: "#262A28", cls: "bg-tb-rule-dark" },
];

const WHY = [
  { title: "Walk in, no appointment", body: "The shop takes repairs during opening hours. There is no booking system to work around." },
  { title: "A free quote first", body: "The figure is agreed at the counter before any work starts, with the part and the labour together." },
  { title: "Most repairs while you wait", body: "Phone repairs take about 30 minutes. Laptops and tablets are usually same day." },
  { title: "Sixty days of cover", body: "Every repair carries a 60-day warranty on the part and the workmanship." },
];

function Swatch({ name, hex, cls }: { name: string; hex: string; cls: string }) {
  return (
    <div>
      <div className={`${cls} rounded-card border-tb-rule h-16 border`} />
      <p className="type-caption text-tb-ink mt-2 font-medium">{name}</p>
      <p className="type-caption text-tb-ink-2 tabular">{hex}</p>
    </div>
  );
}

export function StyleguidePhase8() {
  return (
    <>
      {/* --- type ------------------------------------------------------- */}
      <Section>
        <Container>
          <Eyebrow>Phase 8</Eyebrow>
          <h2 className="type-h1 text-tb-ink mt-5">Cracked screen? Walk in today.</h2>
          <p className="type-lead text-tb-ink-2 measure mt-5">
            Archivo at 900 with a condensed width and tight tracking. This is the single change that
            stops the site reading as a template. Body copy stays Inter.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="type-h2 text-tb-ink">Section heading, 52px</h3>
              <h3 className="type-h3 text-tb-ink mt-6">Card heading, 22px at 800</h3>
              <p className="type-body text-tb-ink-2 mt-3">
                Body copy at 17px, Inter, 1.6 leading. Numbers align by digit:{" "}
                <span className="tabular">30 minutes, 60 days, 3317 17 Ave SE</span>.
              </p>
            </div>
            <Card className="p-6">
              <Eyebrow>Eyebrow</Eyebrow>
              <h3 className="type-h3 text-tb-ink mt-4">Card on paper</h3>
              <p className="type-body text-tb-ink-2 mt-2">
                White fill, 1px rule, 10px radius, no shadow. Hover turns the rule green and lifts
                the card 2px.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- ticker ----------------------------------------------------- */}
      <Ticker />

      {/* --- benefit strip ---------------------------------------------- */}
      <BenefitStrip />

      {/* --- surfaces and buttons --------------------------------------- */}
      <Section>
        <Container>
          <Eyebrow>Surfaces</Eyebrow>
          <h2 className="type-h2 text-tb-ink mt-5">Ten tokens, black dominant</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {SURFACES.map((token) => (
              <Swatch key={token.name} {...token} />
            ))}
          </div>

          <h3 className="type-h3 text-tb-ink mt-14">Buttons, 6px rectangles</h3>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PillButton href="/get-a-quote">Get a quote</PillButton>
            <PillButton href="/get-a-quote" withArrow>
              Hero call to action
            </PillButton>
            <PillButton href="/contact" variant="dark">
              Dark
            </PillButton>
            <PillButton href="/contact" variant="ghost">
              Ghost
            </PillButton>
            <PillButton href="/contact" size="sm">
              Small
            </PillButton>
          </div>

          <h3 className="type-h3 text-tb-ink mt-14">Tiles</h3>
          <TileGrid className="mt-5">
            <Tile href="/locations/calgary">Albert Park</Tile>
            <Tile href="/locations/calgary/forest-lawn">Forest Lawn</Tile>
            <Tile>Dover</Tile>
            <Tile>Ogden</Tile>
          </TileGrid>
        </Container>
      </Section>

      {/* --- dark band, numbered list ----------------------------------- */}
      <Section variant="dark">
        <Container>
          <Eyebrow>Why us</Eyebrow>
          <h2 className="type-h2 text-tb-on-black mt-5">Four reasons, in order</h2>
          <NumberedList items={WHY} className="mt-10" />
        </Container>
      </Section>

      {/* --- buttons on dark -------------------------------------------- */}
      <Section variant="dark">
        <Container>
          <Eyebrow>On black</Eyebrow>
          <h2 className="type-h2 text-tb-on-black mt-5">
            Bright green is correct for text here
          </h2>
          <p className="type-body text-tb-on-black-2 measure mt-4">
            On paper the same green is about 2.6:1 and never carries text. The eyebrow above uses
            --tb-green here and --tb-green-deep on light, which is the one rule that gets broken most.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PillButton href="/get-a-quote">Primary on dark</PillButton>
            <PillButton href="/contact" variant="ghostOnDark">
              Ghost on dark
            </PillButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
