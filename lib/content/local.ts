/**
 * Copy for the Tier 5 service-and-place pages.
 *
 * These lead with the service and ground it in the place, because service is
 * the axis that differentiates: the Phase 5 repair tier produced a 16.5% worst
 * pair from one template, while the brand hubs, differentiated only by which
 * catalogue they list, reached 63.0%. Eleven pages about one shop would have
 * gone the way of the brand hubs if the place had been asked to carry them.
 *
 * The shared local facts are concentrated rather than repeated. See
 * lib/content/local-shared.ts for the rule and the guard.
 *
 * Every fact about the street, the transit and the drive is verifiable and
 * sourced in content/local-inventory.md. Nothing here is approximated. Drive
 * times, parking and landmarks that could not be verified are open questions
 * for the client rather than sentences on a page.
 */

import type { PageFaq } from "@/lib/faq/scoping";
import { checkFactUse, type FactUse } from "@/lib/content/local-shared";
import type { ProseSection, ServiceCtx } from "@/lib/content/services";

export interface LocalPriceSource {
  kind: "catalogue" | "flat";
  brandSlugs?: string[];
  repairSlugs?: string[];
  flatSlugs?: string[];
}

export interface LocalDef {
  slug: string;
  h1: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  serviceType: string;
  city: "Calgary" | "Chestermere";
  priceSource: LocalPriceSource;
  /** The Tier 2 page that owns the service explanation. */
  servicePath: string;
  /** Tier 3 pages worth linking from here. */
  repairPaths: string[];
  /** Tier 4 brand hubs worth linking from here. */
  brandPaths: string[];
  /** Two sibling Tier 5 pages. */
  siblings: string[];
  /** Tier 6 pages this one hands off to. */
  placePaths: string[];
  facts: FactUse[];
  lead: (c: ServiceCtx) => string;
  answer: (c: ServiceCtx) => string;
  keyFacts: (c: ServiceCtx) => { label: string; value: string }[];
  sections: (c: ServiceCtx) => ProseSection[];
  /** What people in this city actually bring in for this service. */
  localMix: { title: string; body: string }[];
  faqs: (c: ServiceCtx) => PageFaq[];
  globalCategories: string[];
}

export const ENTITY = "TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in southeast Calgary";

/* ==================================================== phone repair calgary */

const phoneRepairCalgary: LocalDef = {
  slug: "phone-repair-calgary",
  h1: "Phone Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Phone Repair Calgary | Walk In, 60-Day Warranty",
  seoDescription:
    "Cell phone repair in Calgary at TechBrotherz, 3317 17 Ave SE. Screens, batteries, charging ports and cameras. Parts and labour included, 60-day warranty, walk in.",
  serviceType: "Cell phone repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-iphone", "samsung-galaxy", "google-pixel", "lg", "motorola", "htc"],
    repairSlugs: ["screen-replacement", "battery-replacement", "charging-port-repair"],
  },
  servicePath: "/services/phone-repair",
  repairPaths: ["/repairs/iphone-screen-replacement", "/repairs/samsung-screen-replacement"],
  brandPaths: ["/repair/apple-iphone", "/repair/samsung-galaxy", "/repair/google-pixel"],
  siblings: [
    "/iphone-screen-repair-calgary",
    "/walk-in-phone-repair-calgary",
    "/cell-phone-repair-chestermere",
  ],
  placePaths: ["/locations/calgary", "/locations/calgary/forest-lawn"],
  facts: checkFactUse("/phone-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "The shop is a few steps from 33 Street SE Station on the 17 Avenue Transitway, so a phone repair does not need a car.",
    },
  ]),
  lead: (c) =>
    `${ENTITY}, repairs cell phones from six brands: iPhone, Samsung Galaxy, Google Pixel, Google Nexus, LG, Motorola and HTC. Screens start at ${c.price("phone-screen")}, most repairs take about ${c.waitMinutes} minutes, and no appointment is needed at any time.`,
  answer: (c) =>
    `TechBrotherz repairs cell phones in Calgary from ${c.price("phone-screen")} for a screen replacement, including the part and the labour. The shop is at 3317 17 Ave SE, open seven days, with no appointment needed. Most phone repairs take about ${c.waitMinutes} minutes at the counter, and every repair carries a ${c.warrantyDays}-day warranty on the part and the workmanship.`,
  keyFacts: (c) => [
    { label: "Screens from", value: `${c.price("phone-screen")}, part and labour` },
    { label: "Batteries from", value: c.price("phone-battery") },
    { label: "Where", value: "3317 17 Ave SE, southeast Calgary" },
    { label: "Typical time", value: `About ${c.waitMinutes} minutes` },
    { label: "Warranty", value: `${c.warrantyDays} days on every repair` },
  ],
  sections: (c) => [
    {
      heading: "Which phones does TechBrotherz repair in Calgary?",
      paragraphs: [
        "TechBrotherz repairs iPhone, Samsung Galaxy, Google Pixel, Google Nexus, LG, Motorola and HTC handsets at its Calgary counter. Apple and Samsung account for most of the volume, which is why the published price list is deepest on those two ranges and priced model by model rather than at one blanket rate.",
        `The five repairs that account for nearly every phone brought in are the same across all six brands: cracked screens, worn batteries, charging ports that no longer hold a cable, cameras that will not focus, and shattered back glass. Screen replacement is the most common by a wide margin and takes about ${c.waitMinutes} minutes.`,
        "Phones from brands outside that list are quoted at the counter once the model is in front of us and we know what the part costs. If a part cannot be sourced at a sensible price, we will say so rather than take the job and disappoint you a week later.",
      ],
    },
    {
      heading: "How much does phone repair cost in Calgary?",
      paragraphs: [
        `Phone repair prices at TechBrotherz start at ${c.price("phone-screen")} for a screen and ${c.price("phone-battery")} for a battery, with the part and the labour together in one figure. There is no separate bench fee and no diagnostic charge on a phone repair we go on to carry out.`,
        "The price is driven almost entirely by what the replacement part costs, which is why a five-year-old handset is cheaper to fix than a current one, and why an OLED screen costs more than the LCD panels older phones used. The table above lists the entry price per repair, and each brand page lists every model individually.",
        "Prices are agreed before any work starts. If a phone turns out to need something beyond what was quoted once it is open, we stop and ask rather than carrying on and adding it to the bill.",
      ],
    },
    {
      heading: "Do you need an appointment for phone repair in Calgary?",
      paragraphs: [
        "No. TechBrotherz is a walk-in shop, and that is the whole operating model rather than a concession. Come to the counter during opening hours, describe what the phone is doing, and it gets diagnosed in front of you. There is no booking form, no queue system and no callback.",
        `Most phone repairs are finished in about ${c.waitMinutes} minutes while you wait, which means a cracked screen is a single trip rather than a drop-off and a return journey. Charging port work takes longer, usually around 45 minutes, because the phone has to come apart further.`,
        "On a busy Saturday there may be repairs ahead of yours, and we will tell you that honestly at the counter rather than letting you discover it after an hour. If you have somewhere to be, say so and we will give you a realistic time.",
      ],
    },
    {
      heading: "What do Calgary customers most often bring in?",
      paragraphs: [
        "Cracked screens dominate, and winter makes it worse rather than better. Cold weather makes glass more brittle and gloves make phones easier to drop, so the months either side of the new year bring noticeably more shattered screens through the door than the summer does.",
        "Battery complaints follow the same seasonal pattern for a different reason. A lithium battery delivers less current when it is cold, so a battery that was merely tired in September starts shutting the phone down at 30 percent in January. That is often a genuine battery replacement rather than a Calgary winter problem that will pass.",
        "Charging ports are the third, and they are the repair most often avoidable. Years of pocket lint compacts into the socket until the cable cannot seat, which looks exactly like a failed port from the outside. We check and clear that before quoting a replacement, and a good share of phones need nothing more.",
      ],
    },
    {
      heading: "What is included, and what the warranty actually covers",
      paragraphs: [
        "Every published price covers four things: the replacement part, the labour to fit it, testing before the phone is handed back, and a 60-day warranty on both the part and the workmanship. There is no separate bench fee, and no diagnostic charge on a repair we go on to carry out.",
        "Testing is the part people do not see and the part that matters. After a screen replacement we check touch across the whole panel, both cameras, the earpiece, the loudspeaker, the microphone and charging, because a screen that looks right and has a dead earpiece is a repair that failed quietly.",
        "The warranty covers a part that fails and work that was not done properly. It does not cover a new drop or new water damage, because a phone damaged again is a fresh repair rather than a failure of the last one. Bring the phone back with the receipt and that is all we need to see.",
      ],
    },
  ],
  localMix: [
    {
      title: "Screens, all year but worst in winter",
      body: "Cold glass is more brittle and gloved hands drop phones. The months either side of the new year are the busiest for cracked screens.",
    },
    {
      title: "Batteries that fail in the cold",
      body: "A worn cell delivers less current at low temperatures, so a battery that coped in September shuts the phone down at 30 percent in January.",
    },
    {
      title: "Charging ports full of lint",
      body: "Often not a repair at all. We clear the socket and test with a known-good cable before quoting a replacement.",
    },
  ],
  faqs: (c) => [
    {
      question: "Where is the nearest phone repair shop in southeast Calgary?",
      answer: `TechBrotherz is at 3317 17 Ave SE, on International Avenue in southeast Calgary, a few steps from 33 Street SE Station on the 17 Avenue Transitway. It is a walk-in shop with no appointment needed, and most phone repairs are finished in about ${c.waitMinutes} minutes at the counter.`,
    },
    {
      question: "How much does it cost to fix a phone screen in Calgary?",
      answer: `Phone screen replacement at TechBrotherz in Calgary starts at ${c.price("phone-screen")}, including the part and the labour together. The exact figure depends on the model, because the replacement part is the largest share of the cost. Every iPhone and Galaxy model in the catalogue is priced individually on the TechBrotherz price list.`,
    },
    {
      question: "Can I get a phone repaired in Calgary on the same day?",
      answer: `Yes. Most phone repairs at TechBrotherz in Calgary are finished in about ${c.waitMinutes} minutes while you wait, not booked for a later day. Charging port work takes around 45 minutes. If the part for a specific model is not in stock, TechBrotherz says so at the counter before you leave the phone.`,
    },
  ],
  globalCategories: ["walkin", "warranty"],
};

/* ============================================ iphone screen repair calgary */

const iphoneScreenCalgary: LocalDef = {
  slug: "iphone-screen-repair-calgary",
  h1: "iPhone Screen Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "iPhone Screen Repair Calgary | About 30 Minutes",
  seoDescription:
    "iPhone screen repair in Calgary at TechBrotherz, 3317 17 Ave SE. Priced per model, part and labour included, about 30 minutes while you wait, 60-day warranty.",
  serviceType: "iPhone screen repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-iphone"],
    repairSlugs: ["screen-replacement"],
  },
  servicePath: "/services/phone-repair",
  repairPaths: ["/repairs/iphone-screen-replacement", "/repairs/iphone-battery-replacement"],
  brandPaths: ["/repair/apple-iphone"],
  siblings: ["/phone-repair-calgary", "/samsung-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/iphone-screen-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "33 Street SE Station sits on the transitway directly outside, which is useful when you would rather not drive with a screen you can barely read.",
    },
  ]),
  lead: (c) =>
    `${ENTITY}, replaces iPhone screens in about ${c.waitMinutes} minutes while you wait. Prices start at ${c.price("iphone-screen")} including the part and the labour, and every iPhone in the catalogue is priced individually rather than at one flat rate.`,
  answer: (c) =>
    `iPhone screen repair in Calgary at TechBrotherz starts at ${c.price("iphone-screen")}, including the part and the labour, priced per model. The repair takes about ${c.waitMinutes} minutes at the counter at 3317 17 Ave SE, with no appointment needed. Every screen replacement carries a ${c.warrantyDays}-day warranty on the part and the workmanship.`,
  keyFacts: (c) => [
    { label: "iPhone screens from", value: `${c.price("iphone-screen")}, part and labour` },
    { label: "Time", value: `About ${c.waitMinutes} minutes, while you wait` },
    { label: "Where", value: "3317 17 Ave SE, southeast Calgary" },
    { label: "Face ID", value: "Transferred from your old screen, kept working" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: (c) => [
    {
      heading: "How long does an iPhone screen repair take in Calgary?",
      paragraphs: [
        `About ${c.waitMinutes} minutes, done at the counter while you wait. An iPhone screen arrives as a complete front assembly with the glass and the display already bonded together, which is how Apple builds them, so the repair is a swap rather than something that has to be assembled.`,
        "That makes it a single trip. You do not leave the phone, you do not come back tomorrow, and you are not without a phone for a day. For most people that is the difference between getting it fixed this week and putting it off for a month.",
        "If the part for your model is not on the shelf we order it in, which usually means a day or two rather than the same visit. We check stock and tell you before you commit, not after.",
      ],
    },
    {
      heading: "Will Face ID still work after the screen is replaced?",
      paragraphs: [
        "Yes, when the repair is done properly, and this is the question worth asking any shop before handing over an iPhone. The Face ID dot projector and infrared camera sit in the notch and are cryptographically paired to the logic board in your specific handset. They cannot be replaced with parts from another phone.",
        "What has to happen is that the existing sensor assembly is transferred carefully from the old screen onto the new one. That flex cable is thin and it tears if the job is rushed, and a torn Face ID cable means Face ID is gone permanently on that phone, with no repair available afterwards.",
        "The same applies to Touch ID on models with a home button. The fingerprint sensor is paired to the board and has to move across intact. It is the most delicate step in the repair and the reason the job is not worth rushing to save ten minutes.",
      ],
    },
    {
      heading: "Does a cracked screen cost the same as a black one?",
      paragraphs: [
        "On an iPhone, yes, and it surprises people every week. The touch-sensitive glass is laminated directly onto the display panel at the factory with no air gap, which is what makes the picture look like it sits on the surface rather than behind a window. It also means the two layers cannot be separated.",
        "So a hairline crack and a completely black display are the same repair, because both are fixed by fitting one complete front assembly. There is no cheaper option where only the glass is replaced, however minor the damage looks from the outside.",
        "Older iPads are the exception and the reason people expect otherwise: on those the glass is a separate layer and replacing it alone is much cheaper. That has not been true of iPhones for a very long time.",
      ],
    },
    {
      heading: "What does an iPhone screen replacement cost in Calgary?",
      paragraphs: [
        `iPhone screen replacement at TechBrotherz starts at ${c.price("iphone-screen")} and rises with the model, because the part cost does. The table above lists every iPhone in the catalogue with its own price, and each figure includes the part, the labour, the testing and the ${c.warrantyDays}-day warranty.`,
        "The pattern is consistent: older LCD models are cheapest because those panels have been in production for years, OLED models cost more, and recent Pro models with the largest displays cost the most. None of that is a markup, it is what the assemblies cost to buy.",
        "Apple publishes its own out-of-warranty screen service pricing per model on its support site, which is worth comparing before deciding where to take the repair. On iPhone XR, XS and later, iOS shows a notification after any screen replacement carried out outside Apple's system, and we explain what to expect for your model before starting.",
      ],
    },
    {
      heading: "What happens to your data during an iPhone screen repair?",
      paragraphs: [
        "Nothing. A screen replacement does not go near the storage in the phone. Your photos, messages, apps and settings are exactly where they were, and there is nothing to restore afterwards. You do not need to sign out of anything or wipe the device before bringing it in.",
        "We do not need your passcode for a standard screen replacement either. Where a repair needs the phone unlocked for testing, we say so at the counter and explain why rather than asking for it as a matter of routine.",
        "Back the phone up anyway before any repair. That is a precaution rather than a requirement, and it is what protects you if something unexpected turns up once the phone is open, which occasionally happens on a handset dropped hard enough to crack the screen.",
      ],
    },
  ],
  localMix: [
    {
      title: "Winter drops",
      body: "Cold glass breaks more easily and gloves make phones harder to hold. The months around the new year bring the most cracked iPhones through the door.",
    },
    {
      title: "Screens that still work",
      body: "A cracked front with a perfect picture is the same repair and the same price as a black one, because the glass and panel are bonded together.",
    },
    {
      title: "Phones brought in after a bad repair elsewhere",
      body: "Usually a torn Face ID cable or a screen that was never seated properly. We will tell you honestly what can and cannot be recovered.",
    },
  ],
  faqs: (c) => [
    {
      question: "How much is iPhone screen repair in Calgary?",
      answer: `iPhone screen repair at TechBrotherz in Calgary starts at ${c.price("iphone-screen")}, including the part and the labour, and is priced per model. Older LCD models cost the least and recent Pro models the most, because the replacement assembly is the largest share of the price. Every iPhone in the catalogue has its own published figure.`,
    },
    {
      question: "Can I get an iPhone screen fixed while I wait in Calgary?",
      answer: `Yes. iPhone screen replacement at TechBrotherz in Calgary takes about ${c.waitMinutes} minutes and is done at the counter at 3317 17 Ave SE. The part arrives as a complete front assembly, so it is a swap rather than an assembly job. No appointment is needed.`,
    },
    {
      question: "Is a cracked iPhone screen cheaper to fix than a black one?",
      answer:
        "No. On an iPhone the glass is laminated directly to the display panel, so both are replaced as one complete front assembly and both cost the same. There is no cheaper glass-only option on any iPhone. Older iPads do have separate glass, which is where the expectation comes from.",
    },
  ],
  globalCategories: ["parts", "turnaround"],
};

/* ================================================== samsung repair calgary */

const samsungCalgary: LocalDef = {
  slug: "samsung-repair-calgary",
  h1: "Samsung Galaxy Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Samsung Repair Calgary | Galaxy Screens and Batteries",
  seoDescription:
    "Samsung Galaxy repair in Calgary at TechBrotherz, 3317 17 Ave SE. Screens, batteries and charging ports priced per model, 60-day warranty, no appointment needed.",
  serviceType: "Samsung Galaxy repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["samsung-galaxy"],
    repairSlugs: ["screen-replacement", "battery-replacement", "charging-port-repair"],
  },
  servicePath: "/services/phone-repair",
  repairPaths: ["/repairs/samsung-screen-replacement", "/repairs/samsung-battery-replacement"],
  brandPaths: ["/repair/samsung-galaxy"],
  siblings: ["/phone-repair-calgary", "/iphone-screen-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/samsung-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "Getting here without a car is straightforward: 33 Street SE Station is on the transitway right outside the door.",
    },
  ]),
  lead: (c) =>
    `${ENTITY}, repairs Samsung Galaxy phones: screens from ${c.price("samsung-screen")}, batteries from ${c.price("samsung-battery")} and charging ports from ${c.price("samsung-port")}. Galaxy screens cost more than comparable iPhone screens, and the reason is structural rather than a markup.`,
  answer: (c) =>
    `Samsung Galaxy repair in Calgary at TechBrotherz starts at ${c.price("samsung-screen")} for a screen and ${c.price("samsung-battery")} for a battery, including the part and the labour. Galaxy screens cost more than iPhone screens because the OLED panel is bonded to the phone's frame and supplied as one assembly. The shop is at 3317 17 Ave SE, walk-in, with a ${c.warrantyDays}-day warranty on every repair.`,
  keyFacts: (c) => [
    { label: "Galaxy screens from", value: `${c.price("samsung-screen")}, part and labour` },
    { label: "Batteries from", value: c.price("samsung-battery") },
    { label: "Charging ports from", value: c.price("samsung-port") },
    { label: "Typical time", value: "About 45 minutes on a screen" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: (c) => [
    {
      heading: "Why does a Samsung screen cost more than an iPhone screen?",
      paragraphs: [
        "The difference is structural rather than a matter of brand. On most Galaxy models the OLED display is bonded to the phone's mid-frame at the factory and supplied as a single service assembly, so replacing the screen means replacing the frame it is mounted in. On an iPhone the display comes off the frame as its own part.",
        "That means a Galaxy screen part includes more of the phone and costs accordingly. It also takes longer to fit, because the board, the battery, the cameras and the buttons all have to be transferred out of the old frame and into the new one rather than the screen simply being swapped over.",
        "The second factor is the panel. Samsung has used OLED across its range for far longer than Apple has, including on mid-range models, and OLED costs more to manufacture than the LCD panels older iPhones used. Both factors are part cost, not labour rate.",
      ],
    },
    {
      heading: "What do green or pink lines on a Galaxy screen mean?",
      paragraphs: [
        "Coloured vertical lines down a Samsung display almost always mean the OLED panel has been damaged, usually at the ribbon connection along one edge rather than in the middle of the picture. It is the most recognisable Galaxy failure pattern and it is a display replacement rather than a software problem.",
        "The usual cause is a drop or a pressure event that left no mark. A phone sat on in a back pocket, or dropped flat on a hard floor, can flex the panel enough to disturb the connection without cracking the glass at all, which is why people often insist the phone was never dropped.",
        "These lines spread. One becomes several over a few weeks and a dark band widens. Having it done sooner does not cost less, but it does mean fewer weeks of looking at it, and it avoids the point where the panel fails entirely and takes the touch layer with it.",
      ],
    },
    {
      heading: "Why do curved Galaxy screens cost more to repair?",
      paragraphs: [
        "The curved-edge displays on the Galaxy S and Note flagship models are more expensive to manufacture than flat ones and more fragile in a specific way. An impact on a curved edge concentrates force on the most vulnerable part of the panel, so drops a flat screen would survive can crack a curved one.",
        "The curve also changes the repair. Adhesive along a curved edge needs even heating and careful separation, and a panel pressed unevenly during fitting shows up afterwards as a dead zone for touch along the edge. It is slower work and it is not worth rushing.",
        "This is worth knowing when choosing a phone as much as when repairing one. A Galaxy with a flat display is meaningfully cheaper to repair than the curved model from the same generation, and that is a real ownership cost rather than a trivial difference.",
      ],
    },
    {
      heading: "Which Galaxy models does TechBrotherz repair in Calgary?",
      paragraphs: [
        `TechBrotherz repairs Galaxy S, Note and A series phones, with each model priced individually in the table above. The spread between the cheapest and most expensive Galaxy screen is wider than for iPhone, because the range runs from small flat A-series displays to large curved Note panels.`,
        `Screens, batteries, charging ports and back glass are the four repairs that account for nearly every Galaxy brought in. A screen takes about 45 minutes rather than the ${c.waitMinutes} an iPhone screen takes, because of the frame transfer, and most are still done while you wait.`,
        "Models showing a quote rather than a price are ones where the assembly is ordered in and priced once we know the cost. Samsung publishes its own service pricing for current models on its Canadian support site, which is worth comparing before deciding.",
      ],
    },
    {
      heading: "Is it worth repairing a Galaxy or replacing it?",
      paragraphs: [
        "The arithmetic is the same as for any phone: if the repair costs less than about a third of what the handset is worth used, repairing it is the better choice. On mid-range and flagship Galaxy models under about four years old, that is nearly always the case.",
        "Two things shift it on Samsung specifically. Curved flagship screens are among the more expensive parts we fit, so an older curved model can approach the threshold on a screen alone. And once a Galaxy stops receiving Samsung security updates it keeps working but stops being patched, which is worth knowing before spending on it.",
        "A phone needing a screen and a battery and a charging port at once is three repairs, and at that point the total deserves an honest comparison against a replacement rather than being paid for one piece at a time. We will give you that comparison at the counter rather than taking all three.",
      ],
    },
  ],
  localMix: [
    {
      title: "Curved-edge cracks",
      body: "Flagship S and Note models crack at the curve from drops a flat screen would survive. It is the most common Galaxy repair we see.",
    },
    {
      title: "Coloured lines with no visible damage",
      body: "Usually a phone sat on in a back pocket. The panel flexed enough to disturb the ribbon connection without cracking the glass.",
    },
    {
      title: "Back glass lifting",
      body: "On a Galaxy the battery sits directly under the rear panel, so a swollen cell bows the back glass. Bring it in rather than pressing it down.",
    },
  ],
  faqs: (c) => [
    {
      question: "How much does Samsung screen repair cost in Calgary?",
      answer: `Samsung Galaxy screen replacement at TechBrotherz in Calgary starts at ${c.price("samsung-screen")}, including the part and the labour, priced per model. Galaxy screens cost more than comparable iPhone screens because the OLED panel is bonded to the phone's mid-frame and supplied as one complete assembly.`,
    },
    {
      question: "My Galaxy screen has green lines but no crack. What is wrong?",
      answer:
        "Coloured vertical lines on a Samsung display mean the OLED panel has been damaged at the ribbon connection along one edge, usually by a drop or by pressure that left no visible mark. The lines spread over time and do not recover. A display replacement is the repair.",
    },
    {
      question: "How long does a Samsung repair take in Calgary?",
      answer:
        "About 45 minutes for a screen at TechBrotherz in Calgary, longer than an iPhone screen. A Galaxy opens from the back, and the board, battery, cameras and buttons must all be transferred into the new display and frame assembly, which is what accounts for the extra time.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

export const LOCAL_PHONES: LocalDef[] = [phoneRepairCalgary, iphoneScreenCalgary, samsungCalgary];
