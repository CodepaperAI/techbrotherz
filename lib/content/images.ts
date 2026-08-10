/**
 * The demo image set.
 *
 * Every image here is a placeholder for photography the client has not taken
 * yet. Two rules govern the set and both matter more than the pictures do.
 *
 * 1. **Stock may show the work, never the business.** A photograph of hands
 *    replacing a screen is a fair illustration of the service. The same
 *    photograph captioned as our bench, our technician or our shop is invented
 *    social proof, which this build has refused since Phase 1. Alt text
 *    describes what the photo shows and never who it is.
 * 2. **Nothing is load-bearing.** Delete public/demo/ and every page still
 *    builds and renders, because `hasImage` gates the markup rather than the
 *    file gating the build.
 *
 * Location pages, /about and /contact deliberately carry no photography. A map
 * and an address are the honest content for a place, and a stock storefront on
 * a location page is exactly the failure rule 1 exists to prevent.
 */

import blurData from "@/lib/content/image-blur.json";

export type ImageRatio = "4:3" | "3:2";

export interface DemoImage {
  slot: string;
  /** Under public/demo/. */
  file: string;
  ratio: ImageRatio;
  width: number;
  height: number;
  /**
   * Describes the photograph, never the business. "A technician replacing a
   * phone screen" is fine. "Our technician at the TechBrotherz counter" is not.
   */
  alt: string;
  /** Unsplash photo page, for the manifest and the contact sheet. Empty for a
   *  client-supplied original, which has no public source page. */
  sourceUrl: string;
  /** Where the original came from. Drives the manifest's Source column. */
  sourceLabel: string;
  photographer: string;
}

/** Matches scripts/process-images.ts. See the note there on the 1200px cap. */
const RATIO_SIZE: Record<ImageRatio, { width: number; height: number }> = {
  "4:3": { width: 1200, height: 900 },
  "3:2": { width: 1200, height: 800 },
};

/** Slots processed at a narrower cap than the ratio default. The phone-repair
 *  cap is the supplied original's own width, so it is never upscaled. */
const NARROW: Record<string, number> = {
  "home-hero": 1000,
  "service-phone-repair": 738,
  "service-password-reset": 1010,
};

function image(
  slot: string,
  ratio: ImageRatio,
  alt: string,
  photographer: string,
  photoId: string,
): DemoImage {
  const base = RATIO_SIZE[ratio];
  const width = NARROW[slot] ?? base.width;
  return {
    slot,
    file: `/demo/${slot}.jpg`,
    ratio,
    width,
    height: Math.round((width * base.height) / base.width),
    alt,
    photographer,
    sourceLabel: "Unsplash",
    sourceUrl: `https://unsplash.com/photos/${photoId}`,
  };
}

/**
 * An original the client supplied directly, rather than one downloaded from
 * Unsplash.
 *
 * The photographer is `TODO(client)` rather than blank or invented. The
 * manifest exists so the set is auditable, and a credit nobody can check is
 * worse than a credit nobody has supplied yet: see CLAUDE.md Section 3, which
 * treats an unknown factual field as a TODO and never as an approximation.
 */
function supplied(slot: string, ratio: ImageRatio, alt: string): DemoImage {
  const base = RATIO_SIZE[ratio];
  const width = NARROW[slot] ?? base.width;
  return {
    slot,
    file: `/demo/${slot}.jpg`,
    ratio,
    width,
    height: Math.round((width * base.height) / base.width),
    alt,
    photographer: "TODO(client)",
    sourceLabel: "Supplied by the client",
    sourceUrl: "",
  };
}

export const IMAGES: Record<string, DemoImage> = {
  "home-hero": image(
    "home-hero",
    "4:3",
    "A phone held in a repair jig with the back removed, while a precision screwdriver is used on an internal screw",
    "Revendo",
    "Q_I49DIzHu8",
  ),
  "home-process-1": image(
    "home-process-1",
    "4:3",
    "A phone fully disassembled on a repair mat, with the battery, board, cameras and screws laid out in order",
    "Fotografia Lui Vlad",
    "8MCqpmAtBs0",
  ),
  "home-process-2": image(
    "home-process-2",
    "4:3",
    "Gloved hands fitting a replacement screen assembly to an opened phone, with the old display alongside",
    "Vitalijus",
    "y2QUqmEzjzA",
  ),
  "home-process-3": image(
    "home-process-3",
    "4:3",
    "Hands working inside an opened laptop, refitting components before the base panel goes back on",
    "Albert Vinas",
    "F3t-AzyTbyU",
  ),
  "home-split-individuals": image(
    "home-split-individuals",
    "3:2",
    "A single phone stripped to its parts on a white bench, showing the board, cameras, speaker and screws",
    "KAT",
    "YPj0Mi7aQtY",
  ),
  "home-split-business": image(
    "home-split-business",
    "3:2",
    "Hands using a precision screwdriver inside an opened laptop, with a second machine on the bench behind",
    "Samsung Memory",
    "6RcDLyy0s1I",
  ),
  "service-phone-repair": supplied(
    "service-phone-repair",
    "3:2",
    "An iPhone shown in exploded view, with the screen, frame, camera assembly and back glass separated in layers",
  ),
  "service-tablet-repair": image(
    "service-tablet-repair",
    "3:2",
    "A hand holding an iPad showing its lock screen above a desk with a keyboard",
    "Henry Ascroft",
    "7OFnb7NOvjw",
  ),
  "service-game-console-repair": supplied(
    "service-game-console-repair",
    "3:2",
    "A hand holding a game controller in front of a television showing a driving game",
  ),
  "service-laptop-repair": image(
    "service-laptop-repair",
    "3:2",
    "The inside of a laptop with the base panel removed, showing the cooling fan, heat pipe and battery",
    "Francesco Liotti",
    "nbML7C5qrkw",
  ),
  "service-computer-repair": image(
    "service-computer-repair",
    "3:2",
    "An opened laptop chassis showing the mainboard, memory, storage drive and cooling assembly",
    "Artiom Vallat",
    "1GntEP783rI",
  ),
  "service-phone-unlocking": supplied(
    "service-phone-unlocking",
    "3:2",
    "A combination padlock closed through a chain-link fence, with the numbered dial in focus",
  ),
  "service-password-reset": supplied(
    "service-password-reset",
    "3:2",
    "Two phone screens showing Google's account verification step after a factory reset, with an unlocked padlock graphic",
  ),
  "service-virus-removal": image(
    "service-virus-removal",
    "3:2",
    "A close view of a green circuit board with surface-mounted chips and soldered components",
    "Chris Ried",
    "bN5XdU-bap4",
  ),
};

/**
 * Edits applied beyond the crop and resize every slot gets.
 *
 * Recorded because the manifest should be auditable: cropping and a light
 * grade are allowed, compositing and fabricating a scene are not.
 */
export const IMAGE_EDITS: Record<string, string> = {
  "service-phone-repair":
    "Replaced a second time at the client's request in 2026-08 with a supplied exploded-view render of an iPhone Pro, which shows the device in exactly the layers a repair separates. The 16:9 original sits on pure black, so it is padded to 3:2 rather than cropped, which would clip the outer layers, and the slot is capped at the original's 738px width rather than upscaled. The Apple mark on the back glass is incidental to an image of the device, per the revised Section 8.9 rule. The image appears to be manufacturer marketing imagery supplied by the client; using it is the client's call, recorded here so the decision is auditable. A higher-resolution original would sharpen the service page's wide rendering. The previous Unsplash original (LqMK_dwsaxs) stays in _source.",
  "service-tablet-repair":
    "Replaced at the client's request in 2026-08. The previous frame was a SIM tray beside a tablet corner; this one is a recognisable iPad on its lock screen, with no app branding in frame.",
  "service-phone-unlocking":
    "Supplied by the client. Already 3:2, so resized only, no crop. The MASTER embossing on the shackle is incidental to the object photographed and is not used as a mark. Replaced a second crop of the frame the old service-tablet-repair used, which put two crops of one photograph in the same grid on the home page.",
  "service-password-reset":
    "Replaced a second time on the client's instruction in 2026-08 with a supplied graphic of Google's FRP verification screens and an unlocked-padlock motif. Two positions recorded so the decision is auditable. First, the Google logo inside the padlock is a manufacturer mark used as a design element, which is the case Section 8.9 recommends against; the choice is the client's, as that section provides. Second, the image depicts Android FRP verification while this slot fronts the Windows computer password reset; it may belong better on the phone unlocking page, which carries the FRP removal service, and moving it is a one-line change. The 839x673 original sits on pure white, so it is padded to 3:2 rather than cropped and capped near native width. The previous original (imOSfUb6Rg4, the post-reset welcome screen) stays in _source.",
  "service-game-console-repair":
    "Supplied by the client in 2026-08 for the game console page. Already 3:2 at 1920x1280, so resized only, no crop. The Sony wordmark on the controller is incidental to a photograph of gameplay and is not used as a mark, per the revised Section 8.9 rule. The supplied filename (pexels-playstation-1845880_1920.jpg) indicates a stock original, Pixabay photo 1845880; the photographer credit is unverified, so it stays TODO(client) rather than guessed.",
  "home-process-2":
    "Cropped to 4:3 on the point of work. The Apple mark on the battery in frame is incidental to a workshop photograph and is not used as a mark.",
  "home-process-3":
    "Cropped to 4:3 from a portrait original. Lenovo and LG component labels are incidental and are not the subject.",
  "home-split-individuals":
    "Cropped to 3:2. The Samsung marks on the bezel and board label are incidental to a teardown photograph.",
  "home-split-business":
    "Cropped to 3:2 on the hands and tool. The Samsung mark on the drive is incidental.",
};

/** Slots the manifest lists but which no image met the constraints for. */
/**
 * Slots that render an illustration rather than a photograph.
 *
 * Not failures. Phase 6.5b replaced the over-broad "no manufacturer marks"
 * constraint with the narrower rule that actually matters, which filled every
 * header slot with real photography. What remains illustrated is the set of
 * repeating category and step markers, where a line drawing in the design
 * system's own language is a better answer than a stock photograph repeated
 * across thirty-five cards.
 */
export const ILLUSTRATED_SLOTS: { slot: string; reason: string }[] = [
  {
    slot: "Service hub process cards, 5 per page across 7 pages",
    reason:
      "Thirty-five step cards. Five distinct photographs repeated seven times would read as filler, and thirty-five distinct ones do not exist. The illustrations are diagrams of the step, which is what a process marker should be.",
  },
  {
    slot: "Repair categories: screen, battery, port, camera, keyboard, board, lock, diagnostic",
    reason:
      "Category markers, used as a set. Line drawings keep them visually consistent with each other and with the icon set, which photographs from eight different sources cannot.",
  },
];

export function demoImage(slot: string): DemoImage | undefined {
  return IMAGES[slot];
}

/**
 * The blur placeholder, or undefined when the demo set is absent.
 *
 * Generated at build by scripts/process-images.ts. If public/demo/ is deleted
 * the JSON stays but the files do not, and `hasImage` is what actually gates
 * rendering.
 */
export function blurFor(slot: string): string | undefined {
  return (blurData as Record<string, string>)[slot];
}
