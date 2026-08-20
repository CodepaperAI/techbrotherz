/**
 * Turns the verified Unsplash downloads into the demo set.
 *
 * Crops to the ratio each slot needs, caps the long edge at 1600px, encodes at
 * quality 74, and emits a tiny base64 LQIP so every image has a blur
 * placeholder. CLS is 0.000 across the whole site and this pass must not be
 * what breaks it.
 *
 * source.unsplash.com was deprecated in 2021 and shut down in 2024, so the
 * originals are downloaded by hand from unsplash.com and committed under
 * public/demo/. Nothing on the running site touches an Unsplash URL.
 *
 *   pnpm exec tsx scripts/process-images.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SOURCE_DIR = "public/demo/_source";
const OUT_DIR = "public/demo";
const LQIP_FILE = "lib/content/image-blur.json";

export interface SlotSpec {
  /** Output file, without extension. */
  slot: string;
  /**
   * Basename of the original in public/demo/_source/, without the extension.
   * An Unsplash short id for the demo set, `supplied-*` for an original the
   * client provided directly.
   */
  source: string;
  ratio: "4:3" | "3:2" | "16:9";
  /** Crop focus, since the interesting part is rarely the centre. */
  position: "centre" | "top" | "bottom" | "attention";
  /** Slight cooling where the original is warmer than the rest of the set. */
  cool?: boolean;
  /**
   * Pad to the ratio with this background instead of cropping. For a source
   * on a solid ground (a render on pure black), extending the canvas keeps
   * the whole composition where a crop would clip its edges.
   */
  pad?: string;
  /** Override for sources whose texture compresses badly at the default. */
  quality?: number;
  /** Narrower cap for a slot that renders small. */
  maxWidth?: number;
}

export const SLOTS: SlotSpec[] = [
  // The LCP element on the site. It renders at 40vw, so ~576 CSS pixels on a
  // desktop: a 1000px source still covers it at 1.7x and shaves the last of
  // the LCP budget. Phase 6.5b measured 2.64s against a 2.6s ceiling at 1200px.
  {
    slot: "home-hero",
    source: "Q_I49DIzHu8",
    ratio: "4:3",
    position: "attention",
    maxWidth: 1000,
    quality: 70,
  },
  { slot: "home-process-1", source: "8MCqpmAtBs0", ratio: "4:3", position: "centre" },
  { slot: "home-process-2", source: "y2QUqmEzjzA", ratio: "4:3", position: "attention" },
  { slot: "home-process-3", source: "F3t-AzyTbyU", ratio: "4:3", position: "attention" },
  { slot: "home-split-individuals", source: "YPj0Mi7aQtY", ratio: "3:2", position: "centre" },
  { slot: "home-split-business", source: "6RcDLyy0s1I", ratio: "3:2", position: "attention" },
  /*
   * 2026-08 client change request: the phone card shows an Iphone 16 Pro Max,
   * the tablet card a recognisable IPad rather than a SIM tray, and the
   * password reset card must not show a social app. All three go through the
   * same 3:2 pipeline as the rest of the set, so the media frame is identical
   * across the service cards.
   */
  /*
   * Replaced again on the client's instruction 2026-08: an Iphone exploded
   * into its repair layers, which is the service the card advertises. The
   * supplied original is 738x415 on pure black, so it is padded to 3:2 rather
   * than cropped (the outer layers reach the frame edges) and capped at its
   * native width rather than upscaled to 1200.
   */
  {
    slot: "service-phone-repair",
    source: "supplied-iphone-teardown",
    ratio: "3:2",
    position: "centre",
    pad: "#000000",
    maxWidth: 738,
  },
  { slot: "service-tablet-repair", source: "7OFnb7NOvjw", ratio: "3:2", position: "attention" },
  { slot: "service-laptop-repair", source: "nbML7C5qrkw", ratio: "3:2", position: "centre" },
  { slot: "service-computer-repair", source: "1GntEP783rI", ratio: "3:2", position: "centre" },
  /*
   * Both supplied by the client, and both already 3:2, so `cover` is a
   * straight downscale and the crop position never comes into play.
   *
   * These replaced two stand-ins rather than filling empty slots.
   * service-phone-unlocking was a second crop of zs29-jZrAQo, the same frame
   * service-tablet-repair uses, and the two sat in one grid on the home page.
   * service-password-reset was fxKvHGDICcQ, a laptop being opened with a
   * screwdriver, which is not what a password reset involves.
   */
  {
    slot: "service-phone-unlocking",
    source: "supplied-carrier-unlocking",
    ratio: "3:2",
    position: "centre",
  },
  /*
   * Replaced a second time on the client's instruction 2026-08 with a supplied
   * graphic of Google's FRP verification screens. 839x673 on pure white, so
   * padded to 3:2 rather than cropped, and capped near native width. See the
   * IMAGE_EDITS note: the Google padlock graphic is a mark used as a design
   * element, which Section 8.9 recommends against; recorded as the client's
   * call.
   */
  /*
   * 2026-08: the FRP graphic moved to the dedicated FRP card, where it
   * finally depicts the right service, and password reset returns to the
   * post-reset welcome screen.
   */
  {
    slot: "service-password-reset",
    source: "imOSfUb6Rg4",
    ratio: "3:2",
    position: "centre",
  },
  {
    slot: "service-frp-removal",
    source: "supplied-frp-unlock",
    ratio: "3:2",
    position: "centre",
    pad: "#ffffff",
    maxWidth: 1010,
  },
  /*
   * Buy, sell and trade: replaced 2026-08 with a render the client supplied,
   * assorted phones, a laptop, tablets and a watch on a plain backdrop. The
   * small Apple mark on one handset is incidental to a product lineup, per
   * the revised Section 8.9 rule. Native 2724x1568; the 3:2 crop trims the
   * sides slightly. The Unsplash original (WcYeiHMexR0) stays in _source/.
   */
  {
    slot: "buy-sell-trade",
    source: "supplied-buy-sell-trade",
    ratio: "3:2",
    position: "centre",
  },
  { slot: "service-virus-removal", source: "bN5XdU-bap4", ratio: "3:2", position: "centre" },
  /*
   * Accessories: replaced 2026-08 with the render the client supplied, a
   * companion to the buy-sell-trade lineup: cases, a power bank, a wireless
   * charger, cables, earbuds, a stand and a tempered glass kit on the same
   * plain backdrop. No manufacturer wordmarks. Native 2724x1568; the centre
   * 3:2 crop trims only the car mount at the right edge. The earlier
   * Unsplash flat lay (sQ0xXxQdfeY) stays in _source/.
   */
  { slot: "service-accessories", source: "supplied-accessories", ratio: "3:2", position: "centre" },
  /*
   * Supplied by the client 2026-08 for the game console page. The original is
   * 1920x1280, exactly 3:2, so cover is a straight downscale.
   */
  {
    slot: "service-game-console-repair",
    source: "supplied-game-console",
    ratio: "3:2",
    position: "centre",
  },
  /*
   * The blog set, 2026-08: one topic-matched photograph per article, chosen
   * from unsplash.com and reviewed by eye against Section 8.9. The controller
   * teardown and SIM flat lay carry incidental marks (Xbox, HTC, ASUS) on
   * real products, which the revised rule allows. The two portrait originals
   * crop to 3:2 on their subject.
   */
  { slot: "blog-screen-repair", source: "U46ib4fUniY", ratio: "3:2", position: "centre" },
  { slot: "blog-slow-computer", source: "xdzhM0LeTt8", ratio: "3:2", position: "centre" },
  { slot: "blog-console-faults", source: "NG_a-z0ScM0", ratio: "3:2", position: "attention" },
  { slot: "blog-laptop-signs", source: "KhnRiIAgvsI", ratio: "3:2", position: "centre" },
  { slot: "blog-water-damage", source: "kU7Hp3fdyhs", ratio: "3:2", position: "attention" },
  { slot: "blog-unlock-canada", source: "TCyYbnFBIIw", ratio: "3:2", position: "centre" },
  /*
   * The hero skyline, client-supplied and used on explicit instruction with
   * provenance unconfirmed (question 26). 1600x900 native, never upscaled.
   */
  {
    slot: "home-hero-skyline",
    source: "supplied-calgary-skyline",
    ratio: "16:9",
    position: "centre",
    quality: 72,
    maxWidth: 1600,
  },
];

/*
 * Sources are capped at 1200px, not 1600px.
 *
 * Phase 6.5b measured the home page at 84 against a previous 94, with LCP at
 * 2.65s past the 2.6s ceiling, once six images were on it. Nothing on this
 * site renders an image wider than about 720 CSS pixels: the hero is 40vw, the
 * split blocks 50vw, and the step cards a declared 380px. A 1200px source
 * still covers the largest slot at 2x, and shipping 1600px was paying for
 * detail no visitor ever sees.
 */
const RATIOS: Record<SlotSpec["ratio"], { w: number; h: number }> = {
  "4:3": { w: 1200, h: 900 },
  "3:2": { w: 1200, h: 800 },
  "16:9": { w: 1600, h: 900 },
};

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const blur: Record<string, string> = {};

  for (const spec of SLOTS) {
    const input = path.join(SOURCE_DIR, `${spec.source}.jpg`);
    if (!existsSync(input)) {
      console.log(`  SKIP ${spec.slot}: no source at ${input}`);
      continue;
    }

    const base = RATIOS[spec.ratio];
    const target = spec.maxWidth
      ? { w: spec.maxWidth, h: Math.round((spec.maxWidth * base.h) / base.w) }
      : base;
    let pipeline = sharp(readFileSync(input)).resize(target.w, target.h, {
      fit: spec.pad ? "contain" : "cover",
      background: spec.pad,
      position:
        spec.position === "attention"
          ? sharp.strategy.attention
          : spec.position === "top"
            ? "top"
            : spec.position === "bottom"
              ? "bottom"
              : "centre",
    });

    if (spec.cool) {
      // Pulls a warm original toward the cool neutral grade the rest of the
      // set has, so nine pictures read as one shoot rather than nine sources.
      pipeline = pipeline.modulate({ saturation: 0.72 }).tint({ r: 244, g: 248, b: 255 });
    }

    const outPath = path.join(OUT_DIR, `${spec.slot}.jpg`);
    await pipeline
      .jpeg({ quality: spec.quality ?? 74, progressive: true, mozjpeg: true })
      .toFile(outPath);

    // A 16px wide LQIP is enough for a blur and costs under a kilobyte inline.
    const lqip = await sharp(readFileSync(input))
      .resize(16, Math.round((16 * target.h) / target.w), { fit: "cover" })
      .jpeg({ quality: 40 })
      .toBuffer();

    blur[spec.slot] = `data:image/jpeg;base64,${lqip.toString("base64")}`;

    const bytes = readFileSync(outPath).byteLength;
    console.log(
      `  ${spec.slot.padEnd(26)} ${spec.ratio}  ${target.w}x${target.h}  ${(bytes / 1024).toFixed(0)} KB`,
    );
  }

  writeFileSync(LQIP_FILE, `${JSON.stringify(blur, null, 2)}\n`, "utf8");
  console.log(`\n  blur placeholders written to ${LQIP_FILE}`);
}

main().catch((error) => {
  console.error("process-images failed:", error);
  process.exit(1);
});
