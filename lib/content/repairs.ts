/**
 * Copy for the sixteen Tier 3 repair pages at /repairs/[repair].
 *
 * The justification for this template is that it presents a cut of the price
 * data no other page does: one repair, every model we do it on, sorted by
 * price. The model page answers "this exact handset". The brand hub answers
 * "which device do you have". This page answers "what does this repair cost,
 * across the range".
 *
 * The duplication risk here is real and specific: nine of these sixteen are
 * iPhone or Samsung repairs, and a screen page and a battery page written from
 * the same outline would read as the same page. Each entry therefore leads
 * with what is genuinely different about that repair, not with a restatement
 * of the shop's policies. Phase 4's similarity detector runs over these pages
 * for exactly this reason.
 */

import type { RepairSubject } from "@/components/blocks/RepairIllustration";
import type { PageFaq } from "@/lib/faq/scoping";
import type { ProseSection, ServiceCtx } from "@/lib/content/services";

export type { ProseSection };

/** Where the price table on this page comes from. */
export type RepairSource =
  | {
      kind: "catalogue";
      brandSlug: string;
      /** One or more repairType slugs. Several means the cheapest of them wins. */
      repairSlugs: string[];
    }
  | { kind: "flat"; flatSlug: string };

export interface ComparisonTable {
  caption: string;
  columns: [string, string, string];
  rows: [string, string, string][];
}

export interface RepairDef {
  slug: string;
  h1: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  serviceType: string;
  /** The Tier 2 page this repair belongs under. */
  parentService: string;
  source: RepairSource;
  /** Two sibling repair pages. */
  siblings: string[];
  /** Brand hub, where one applies. */
  brandSlug?: string;
  /** Typical minutes, shown in the AnswerBox. */
  minutes: number;
  /** The Tier 5 page for this repair in Calgary, added in Phase 6. */
  localPath: string;
  lead: (c: ServiceCtx) => string;
  answer: (c: ServiceCtx) => string;
  /** Symptoms that point at this repair. */
  symptoms: string[];
  /** What the repair involves, for a non-technical reader. */
  steps: { title: string; body: string }[];
  /** Category marker for this repair, used on the step cards. Phase 6.5b. */
  art: RepairSubject;
  sections: (c: ServiceCtx) => ProseSection[];
  /** Model-specific notes, where the repair genuinely differs by model. */
  modelNotes: { model: string; note: string }[];
  /** When this repair is not worth doing. */
  notWorthIt: string[];
  /** Used on pages with no per-model price table. */
  comparison?: ComparisonTable;
  faqs: (c: ServiceCtx) => PageFaq[];
  globalCategories: string[];
}

/* ================================================================== iPhone */

const iphoneScreen: RepairDef = {
  slug: "iphone-screen-replacement",
  art: "screen",
  localPath: "/iphone-screen-repair-calgary",
  h1: "iPhone Screen Replacement Prices",
  eyebrow: "iPhone screen",
  seoTitle: "iPhone Screen Replacement Calgary | Price By Model",
  seoDescription:
    "iPhone screen replacement prices for every model TechBrotherz repairs in Calgary, part and labour included. About 30 minutes, 60-day warranty, walk in.",
  serviceType: "iPhone screen replacement",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "apple-iphone", repairSlugs: ["screen-replacement"] },
  siblings: ["/repairs/iphone-battery-replacement", "/repairs/samsung-screen-replacement"],
  brandSlug: "apple-iphone",
  minutes: 30,
  lead: (c) =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces iPhone screens in about ${c.waitMinutes} minutes while you wait. The table below lists the price for every iPhone model in the catalogue, and each price includes the part and the labour.`,
  answer: (c) =>
    `iPhone screen replacement at TechBrotherz in Calgary fits a complete front assembly, with the glass and the display already bonded together, because that is how Apple builds them. Most iPhone screen replacements take about ${c.waitMinutes} minutes at the counter. Every one carries a ${c.warrantyDays}-day warranty, and the quote is free and given before any work starts.`,
  symptoms: [
    "Cracked or shattered glass, even where the picture underneath still works normally.",
    "Black patches, coloured vertical lines, or a white glow spreading across the display.",
    "Touch that does not respond in one area, or registers presses you did not make.",
    "A screen lifting away from the frame at one edge, which usually means a swollen battery underneath.",
    "A display that flickers, dims unpredictably, or goes black while the phone is clearly still on.",
  ],
  steps: [
    {
      title: "The phone is powered down and opened from the front",
      body: "iPhones open from the screen side. Two screws at the bottom edge come out and the display lifts away from the frame like a book cover, still attached by ribbon cables.",
    },
    {
      title: "The battery is disconnected first",
      body: "Nothing else gets touched until the battery connector is off. Working on a live board is how components get damaged.",
    },
    {
      title: "The front sensor assembly is transferred",
      body: "The earpiece speaker, the front camera and the Face ID or Touch ID hardware come off the old screen and go onto the new one. These are paired to your specific phone and cannot be substituted.",
    },
    {
      title: "The new assembly is fitted and tested before sealing",
      body: "Touch across the whole panel, brightness, the earpiece, the front camera and Face ID or Touch ID all get checked while the phone is still open, because a fault found now is a two-minute fix.",
    },
    {
      title: "The phone is sealed and handed back",
      body: "The screws go back in, the display seats down, and the phone is tested once more as a whole before it leaves the counter.",
    },
  ],
  sections: (c) => [
    {
      heading: "Why is an iPhone screen replaced as one whole assembly?",
      paragraphs: [
        "Apple laminates the touch-sensitive glass directly onto the display panel at the factory, with no air gap between them. That lamination is what makes the picture look like it sits on the surface of the glass rather than behind a window, and it is the reason the two layers cannot practically be separated once they are bonded.",
        "The consequence for pricing is direct: on an iPhone, a crack in the glass and a dead display cost exactly the same to fix, because both are repaired by fitting one complete front assembly. People are often surprised that a hairline crack costs the same as a shattered black screen, and this is why.",
        `The upside is speed. Because the part arrives as a finished assembly rather than something that has to be built up, an iPhone screen replacement at TechBrotherz takes about ${c.waitMinutes} minutes rather than half a day.`,
      ],
    },
    {
      heading: "Will Face ID still work after a screen replacement?",
      paragraphs: [
        "Yes, when the repair is done properly. The Face ID dot projector and infrared camera sit in the notch at the top of the screen, and they are cryptographically paired to the logic board in your specific phone. They cannot be replaced with parts from another handset, and they do not come with a new screen.",
        "What has to happen is that the existing sensor assembly is carefully transferred from your old screen onto the new one. That flex cable is thin and it tears if it is rushed, and a torn Face ID cable means Face ID is gone permanently, on that phone, for good. There is no repair for it afterwards.",
        "The same applies to Touch ID on the models that have a home button. The fingerprint sensor is paired to the board and has to move across intact. This is the single most delicate part of an iPhone screen replacement, and it is the step worth asking any shop about before handing over a phone.",
      ],
    },
    {
      heading: "What is the message about a genuine Apple display?",
      paragraphs: [
        "On iPhone models from the XR and XS onwards, iOS shows a notification in Settings after a screen replacement to say it cannot verify the display as a genuine Apple part. That message appears after any repair carried out outside Apple's own system, and it does not mean the screen is faulty.",
        "The practical effects are limited but worth knowing before the repair rather than after. True Tone, which adjusts the white balance of the display to the light in the room, can be lost on some models and repairs. The message itself sits in Settings and does not interfere with using the phone.",
        "We will tell you what to expect for your specific model before starting, because it is the kind of thing that is fine when you know about it in advance and irritating when you do not.",
      ],
    },
    {
      heading: "How much does an iPhone screen replacement cost in Calgary?",
      paragraphs: [
        `What an iPhone screen replacement comes to follows the panel the handset takes. An older iPhone with an LCD panel is the cheaper repair, a Pro model with an OLED panel is the dearer one, and the gap between the two ends of the range is wide. TechBrotherz gives the figure for your handset at the counter, free of charge, and each quote covers the part, the labour, the testing and the ${c.warrantyDays}-day warranty together.`,
        "The pattern in that table is worth understanding. Older LCD models are the cheapest, because those panels have been in production for years and supply is plentiful. The OLED models cost more, and the recent Pro models with the largest displays cost the most, because that is what the assemblies cost to buy.",
        "Apple publishes its own out-of-warranty screen service pricing for each model on its support site, which is worth comparing against before you decide where to take a repair. Models showing Call for quote in the table are ones where we order the part in and price it once we know the cost.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPhone X and later",
      note: "Face ID hardware transfers from the old screen and is paired to the board. If that flex tears, Face ID is permanently lost on that phone, so this step is done slowly.",
    },
    {
      model: "iPhone 8 and earlier",
      note: "Touch ID is in the home button and is paired to the board in the same way. The button moves across to the new screen intact or fingerprint unlock stops working.",
    },
    {
      model: "iPhone XR, XS and later",
      note: "iOS shows a genuine-display notification in Settings after any non-Apple screen repair, and True Tone can be lost depending on model and part.",
    },
    {
      model: "iPhone 12 and later",
      note: "The front glass is Ceramic Shield, which resists cracking better than earlier glass but still cracks. The repair itself is unchanged.",
    },
  ],
  notWorthIt: [
    "When the frame is visibly bent, a new display cannot seat flat and will not seal or stay put.",
    "When the phone has water damage that has already reached the board, a screen fixes what you can see and not what is failing.",
    "When the quoted screen price is close to what the handset is worth used, on a model that no longer receives security updates.",
  ],
  faqs: (c) => [
    {
      question: "How much does it cost to replace an iPhone screen in Calgary?",
      answer: `iPhone screen replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. Older iPhones with LCD panels are the cheaper repair and Pro models with OLED panels are the dearer one, because the part differs sharply across the range. Every quote covers the part and the labour together, with no separate bench fee.`,
    },
    {
      question: "Does replacing an iPhone screen break Face ID?",
      answer:
        "Not when the Face ID assembly is transferred correctly. The dot projector and infrared camera are paired to the logic board in your specific iPhone and must move from the old screen to the new one intact. If that flex cable tears during the repair, Face ID is permanently lost on that handset and cannot be restored.",
    },
    {
      question: "Why does my iPhone say it cannot verify the display after a repair?",
      answer:
        "iOS shows that notification on iPhone XR, XS and later after any screen replacement carried out outside Apple's own service system. It does not mean the screen is faulty. True Tone can be lost on some model and part combinations. TechBrotherz explains what to expect for your model before the repair starts.",
    },
    {
      question: "How long does an iPhone screen replacement take?",
      answer: `An iPhone screen replacement at TechBrotherz in Calgary takes about ${c.waitMinutes} minutes and is done at the counter while you wait. The part arrives as a complete front assembly with the glass and display already bonded, which is why the repair is quick compared with a tablet or laptop screen.`,
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const iphoneBattery: RepairDef = {
  slug: "iphone-battery-replacement",
  art: "battery",
  localPath: "/phone-repair-calgary",
  h1: "iPhone Battery Replacement Prices",
  eyebrow: "iPhone battery",
  seoTitle: "iPhone Battery Replacement Calgary | Price By Model",
  seoDescription:
    "iPhone battery replacement prices by model at TechBrotherz in Calgary, part and labour included. About 30 minutes, 60-day warranty, no appointment needed.",
  serviceType: "iPhone battery replacement",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "apple-iphone", repairSlugs: ["battery-replacement"] },
  siblings: ["/repairs/iphone-screen-replacement", "/repairs/samsung-battery-replacement"],
  brandSlug: "apple-iphone",
  minutes: 30,
  lead: (c) =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces iPhone batteries in about ${c.waitMinutes} minutes. A battery that has fallen below roughly 80% of its original capacity no longer holds a working day, and replacing it is far cheaper than replacing the phone.`,
  answer: (c) =>
    `iPhone battery replacement at TechBrotherz in Calgary takes about ${c.waitMinutes} minutes at the counter and carries a ${c.warrantyDays}-day warranty. Check Settings, Battery, Battery Health on the phone first: below about 80% maximum capacity, a replacement restores a full day of use. The quote is free and given before any work starts.`,
  symptoms: [
    "The phone no longer lasts a working day on a charge it used to manage comfortably.",
    "It shuts down suddenly at 20% or 30%, or dies in the cold and revives once warm.",
    "Battery Health in Settings shows maximum capacity below 80%, or a Service message.",
    "The phone runs noticeably slower, because iOS throttles performance to prevent shutdowns on a worn battery.",
    "The screen or back has started lifting away from the frame, which means the battery has swollen.",
  ],
  steps: [
    {
      title: "Battery Health is checked first",
      body: "Settings, Battery, Battery Health shows maximum capacity as a percentage. Above 85% the battery is usually not the problem, and we will tell you that rather than sell you one.",
    },
    {
      title: "The display is lifted and the battery disconnected",
      body: "iPhones open from the front. The screen comes up, the battery connector comes off first, and a bracket over the connector is removed.",
    },
    {
      title: "The adhesive strips are pulled",
      body: "iPhone batteries are held down by stretch-release strips that pull out from under the cell. Done slowly they come out whole. Rushed, they snap, and the battery has to be eased out instead.",
    },
    {
      title: "The new battery goes in and is tested",
      body: "The replacement is fitted, connected and checked for charging and a sensible reported capacity before the phone is sealed.",
    },
    {
      title: "The old cell is disposed of properly",
      body: "Lithium cells do not go in the bin. Old batteries are collected here and recycled through the proper channel.",
    },
  ],
  sections: (c) => [
    {
      heading: "When does an iPhone battery actually need replacing?",
      paragraphs: [
        "Apple treats about 80% of original capacity as the point where a battery is considered consumed, and iOS reports exactly that figure. Open Settings, then Battery, then Battery Health, and read the maximum capacity percentage. That number is the single best guide to whether a replacement is worth paying for.",
        "Above 85%, a battery is generally not your problem, and the poor battery life is more likely a background app, a weak signal forcing the radio to work hard, or a display running at full brightness. We would rather point that out than take money for a battery that was fine.",
        "Below 80%, replacement makes a real difference, and the phone will hold a working day again. Between 80 and 85 is a judgement call that depends on how heavily you use the phone, and we will give you an honest read at the counter.",
      ],
    },
    {
      heading: "Why does an old battery make an iPhone slower?",
      paragraphs: [
        "This is real, documented and often misunderstood. As a lithium battery ages, its ability to deliver sudden bursts of current falls. When the processor demands a peak the battery cannot supply, the phone shuts down abruptly rather than degrading gracefully, which is why old iPhones die at 30%.",
        "Apple's response was performance management: iOS deliberately smooths the peaks by slowing the processor on phones with worn batteries, trading speed for stability. It is why a phone can feel sluggish long before anything is visibly wrong with it.",
        "The practical point is that a battery replacement on an old iPhone often makes the phone feel faster as well as last longer, and people are frequently surprised by how much. If your iPhone feels tired, the battery is the first thing to check.",
      ],
    },
    {
      heading: "What should you do about a swollen iPhone battery?",
      paragraphs: [
        "Stop using the phone and bring it in. A swollen battery is a lithium cell that has generated gas internally, and the pressure is what has lifted your screen away from the frame or made the back panel bulge. It is the one battery symptom that is genuinely a safety matter rather than an inconvenience.",
        "Do not press the screen back down, do not carry on using the phone, and do not charge it overnight on a bedside table. A punctured swollen cell can catch fire, and the most common way one gets punctured is somebody trying to force the phone closed.",
        "The repair itself is straightforward once the phone is here, and the swelling usually causes no other damage if it is caught early. Left long enough, the pressure can crack the display or strain the frame, which turns a battery replacement into two repairs.",
      ],
    },
    {
      heading: "How much does an iPhone battery replacement cost in Calgary?",
      paragraphs: [
        `An iPhone battery is quoted per model at the counter, and the quote covers the part and the labour together. The range is far narrower than it is for screens, because a battery cell is a broadly similar part whichever iPhone it goes into, while a screen is not.`,
        `The repair takes about ${c.waitMinutes} minutes and is done while you wait. Your data is untouched: a battery replacement does not go near the storage, and nothing needs backing up or restoring afterwards. Back the phone up anyway as a precaution before any repair.`,
        "Apple publishes its own battery service pricing per model on its support site, which is worth checking before deciding where to have the work done. iOS will report a service message about the battery after any non-Apple replacement, in the same way it does for screens.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPhone 6 and 6 Plus",
      note: "These are the models where swollen batteries are most common now, simply because of their age. Bring one in rather than pressing the lifted screen back down.",
    },
    {
      model: "iPhone 8 and later",
      note: "Glass backs mean a swollen battery can crack the rear panel as well as lift the screen, turning one repair into two if it is left.",
    },
    {
      model: "iPhone 11 and later",
      note: "iOS reports an unknown-battery service message after any replacement outside Apple's system, and battery health reporting can be limited afterwards.",
    },
  ],
  notWorthIt: [
    "When Battery Health still reads above 85%, the battery is not what is draining the phone.",
    "When the phone also has a cracked screen and a failing port, the total often approaches the used value of the handset.",
    "When the phone no longer receives security updates and is only being kept going for a few more months.",
  ],
  faqs: (c) => [
    {
      question: "How much does an iPhone battery replacement cost in Calgary?",
      answer: `iPhone battery replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. The range across iPhone models is much narrower than it is for screens, because a battery cell is a broadly similar part across the range. The repair takes about ${c.waitMinutes} minutes at the counter.`,
    },
    {
      question: "How do I know if my iPhone battery needs replacing?",
      answer:
        "Open Settings, then Battery, then Battery Health on the iPhone and read the maximum capacity percentage. Below 80% a replacement restores a full day of use. Above 85% the battery is usually not the cause of poor battery life, and TechBrotherz will say so rather than sell a battery that is not needed.",
    },
    {
      question: "Why has my old iPhone got slower as the battery aged?",
      answer:
        "A worn lithium battery cannot deliver sudden bursts of current, so iOS deliberately slows the processor to prevent the phone shutting down unexpectedly. Replacing the battery removes that limit, which is why an iPhone battery replacement often makes an older phone feel faster as well as last longer.",
    },
    {
      question: "Is a swollen iPhone battery dangerous?",
      answer:
        "A swollen battery should be treated as a safety matter. Stop using the phone, do not press the lifted screen back down, and do not charge it unattended. A punctured swollen cell can catch fire. Bring the phone to TechBrotherz in Calgary, where the swelling usually causes no further damage if caught early.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const iphonePort: RepairDef = {
  slug: "iphone-charging-port-repair",
  art: "port",
  localPath: "/phone-repair-calgary",
  h1: "iPhone Charging Port Repair Prices",
  eyebrow: "iPhone charging port",
  seoTitle: "iPhone Charging Port Repair Calgary | Price By Model",
  seoDescription:
    "iPhone charging port replacement prices by model at TechBrotherz in Calgary. Part and labour included, about 45 minutes, 60-day warranty, walk in.",
  serviceType: "iPhone charging port repair",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "apple-iphone", repairSlugs: ["charging-port-repair"] },
  siblings: ["/repairs/samsung-charging-port-repair", "/repairs/iphone-battery-replacement"],
  brandSlug: "apple-iphone",
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces iPhone charging ports in about 45 minutes. Before paying for the repair, it is worth having the port cleaned, because compacted pocket lint is the single most common reason an iPhone stops charging.`,
  answer: () =>
    `iPhone charging port replacement at TechBrotherz in Calgary takes about 45 minutes, longer than a screen, because the port sits at the bottom of the phone and the assembly has to come apart to reach it. TechBrotherz checks for compacted lint first, because a clean-out often solves the problem at no charge at all. The quote is free and given before any work starts.`,
  symptoms: [
    "The cable has to be held at an angle, or pressed in, before charging starts.",
    "The phone charges from some cables but not others, or only from certain plugs.",
    "The connector feels loose, wobbles in the socket, or no longer clicks into place.",
    "Charging works intermittently, cutting in and out while the phone sits still.",
    "The phone does not charge at all, and a different cable and plug make no difference.",
  ],
  steps: [
    {
      title: "The port is inspected and cleaned first",
      body: "Years of pocket lint compacts into a solid pad at the bottom of the socket, holding the cable a millimetre short of contact. This is the most common cause and it is not a repair.",
    },
    {
      title: "A known-good cable and charger are tried",
      body: "Cables fail far more often than ports do. Ruling out the accessory before opening the phone is the difference between an answer that costs nothing and an unnecessary repair.",
    },
    {
      title: "The display is lifted and the battery disconnected",
      body: "The port sits at the bottom of the phone under the battery and the speaker, so the phone has to come apart properly to reach it.",
    },
    {
      title: "The charging flex assembly is replaced",
      body: "On an iPhone the charging port comes as a flex cable assembly that usually carries the microphone and the antenna too, so the whole strip is replaced as one part.",
    },
    {
      title: "Charging, audio and the microphone are all tested",
      body: "Because that flex carries more than the charging contacts, the test covers wired charging, the bottom microphone and call audio before the phone is sealed.",
    },
  ],
  sections: () => [
    {
      heading: "Is it the charging port or the cable?",
      paragraphs: [
        "It is worth ruling out the cheap answer before paying for the expensive one. Cables fail far more often than ports do, usually where the cord meets the connector, and a cable that has been bent in the same place for two years can look perfect and still not deliver power reliably.",
        "The test is simple. Try a different cable and a different plug, ideally ones you know work with another device. If the phone charges normally on those, the port is fine and the cable was the problem. If it behaves the same way on every cable, the port is the suspect.",
        "Wireless charging on models that support it is another useful test. If a phone charges perfectly on a wireless pad but not by cable, that points firmly at the port rather than the battery or the board.",
      ],
    },
    {
      heading: "Why does cleaning the port fix so many phones?",
      paragraphs: [
        "An iPhone lives in a pocket, and a pocket is full of lint. Every time the cable goes in, it presses a little more of that lint to the bottom of the socket, and over a couple of years it compacts into a dense pad that is genuinely hard to see and quite hard to remove.",
        "The effect is that the cable stops a fraction of a millimetre short of full contact. The phone charges intermittently, or only when the cable is pushed hard or held at an angle, which is exactly what a failing port feels like from the outside.",
        "TechBrotherz checks and clears this first, before quoting a port replacement, because a good proportion of phones brought in for charging problems need nothing more. If a clean-out fixes it, that is the end of the visit.",
      ],
    },
    {
      heading: "What else is on the iPhone charging flex?",
      paragraphs: [
        "On an iPhone the Lightning or USB-C connector is not a standalone socket. It sits on a flexible printed cable that also carries the bottom microphone, and on most models part of the antenna as well. That whole strip is replaced as one part.",
        "This explains a symptom that otherwise looks unrelated. If people cannot hear you on calls, or voice memos and Siri stop picking you up clearly, and the phone has also been fussy about charging, the same failed flex can be behind both.",
        "It also means the test after this repair covers more than charging. Wired charging, the bottom microphone and call audio all get checked before the phone is sealed, because all three run through the part that was just replaced.",
      ],
    },
    {
      heading: "How long does an iPhone charging port repair take?",
      paragraphs: [
        "About 45 minutes, which is longer than a screen replacement and worth knowing before you decide to wait. The port sits at the very bottom of the phone, underneath the battery and behind the speaker assembly, so getting to it means taking more of the phone apart than a screen repair does.",
        "The reassembly is where the time goes rather than the removal. Everything that came out has to go back in the right order, with the right screws in the right holes, because iPhone screws differ in length by fractions of a millimetre and the wrong one in the wrong place damages the board underneath.",
        "Most port repairs are still same-visit work rather than a drop-off. We will tell you the realistic time at the counter, and if the part for your model needs ordering we will say so before you leave the phone.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPhone 15 and later",
      note: "These use USB-C rather than Lightning. The repair is the same shape of job, and the part is a different assembly.",
    },
    {
      model: "iPhone 8 and later",
      note: "Wireless charging works independently of the port, so a phone that charges on a pad but not by cable is a clear port diagnosis.",
    },
    {
      model: "iPhone 7 and later",
      note: "These models are water resistant when sealed, and that seal is broken by any repair. Resistance is not restored to the original rating afterwards.",
    },
  ],
  notWorthIt: [
    "When a clean-out and a known-good cable already solved it, there is nothing to replace.",
    "When wireless charging works and the phone is close to being replaced anyway.",
    "When the phone has water damage, because corrosion on the board can mimic a failed port and will not be fixed by a new one.",
  ],
  faqs: () => [
    {
      question: "How much does iPhone charging port repair cost in Calgary?",
      answer: `iPhone charging port replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. TechBrotherz checks for compacted pocket lint in the socket first, because clearing that solves a good proportion of charging faults without any part being replaced and without anything being charged for.`,
    },
    {
      question: "Why does my iPhone only charge when I hold the cable at an angle?",
      answer:
        "That symptom usually means compacted lint at the bottom of the charging socket, holding the cable a fraction short of full contact, or a worn port that no longer grips. TechBrotherz in Calgary inspects and clears the socket first, then tests with a known-good cable, before quoting a port replacement.",
    },
    {
      question: "Can a bad charging port stop people hearing me on calls?",
      answer:
        "Yes. On an iPhone the charging connector sits on a flex cable that also carries the bottom microphone and part of the antenna. A failure in that assembly can affect charging and microphone pickup together, which is why TechBrotherz tests charging, the microphone and call audio after the repair.",
    },
    {
      question: "How long does an iPhone charging port replacement take?",
      answer:
        "About 45 minutes at TechBrotherz in Calgary, longer than a screen replacement. The charging assembly sits at the bottom of the phone beneath the battery and speaker, so more of the handset has to be dismantled and correctly reassembled to reach and replace it.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

const iphoneCamera: RepairDef = {
  slug: "iphone-camera-repair",
  art: "camera",
  localPath: "/phone-repair-calgary",
  h1: "iPhone Camera Repair Prices",
  eyebrow: "iPhone camera",
  seoTitle: "iPhone Camera Repair Calgary | Front and Rear Prices",
  seoDescription:
    "iPhone camera repair by model at TechBrotherz in Calgary. Front and rear cameras, cracked lens glass, part and labour included, 60-day warranty.",
  serviceType: "iPhone camera repair",
  parentService: "/services/phone-repair",
  source: {
    kind: "catalogue",
    brandSlug: "apple-iphone",
    repairSlugs: ["back-camera-repair", "front-camera-repair"],
  },
  siblings: ["/repairs/iphone-screen-replacement", "/repairs/iphone-back-glass-replacement"],
  brandSlug: "apple-iphone",
  minutes: 30,
  lead: (c) =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces iPhone front and rear cameras in about ${c.waitMinutes} minutes. A blurry photo is often the lens glass over the camera rather than the camera module itself, and those are two different repairs at two different prices.`,
  answer: (c) =>
    `iPhone camera repair at TechBrotherz in Calgary begins with identifying which repair the phone actually needs. Cracked lens glass over the rear camera is a separate and smaller job than replacing the camera module underneath it, and TechBrotherz tells you which one applies at the counter. Most camera repairs take about ${c.waitMinutes} minutes, and the quote is free.`,
  symptoms: [
    "Photos come out blurry no matter how still the phone is held, or will not focus at all.",
    "The camera app opens to a black frame, or freezes when switching between lenses.",
    "Visible cracks in the small glass lens covers on the back of the phone.",
    "A rattling sound when the phone is shaken gently, which means the stabilisation assembly has come loose.",
    "Photos show spots, haze or flare that appear in the same place in every shot.",
  ],
  steps: [
    {
      title: "The lens glass and the module are told apart",
      body: "Cracked lens covers over the rear cameras are a separate part from the camera itself. If the module underneath is fine, only the glass needs replacing.",
    },
    {
      title: "The camera app is checked across all lenses",
      body: "A fault on the wide lens and a fault on the ultra-wide are different modules on modern iPhones. Testing each one narrows the repair to the part that actually failed.",
    },
    {
      title: "The phone is opened and the battery disconnected",
      body: "The rear camera sits behind the back glass on newer models and under the display assembly on older ones, so the approach depends on the model.",
    },
    {
      title: "The module is replaced",
      body: "Rear and front cameras are separate parts. The front camera usually shares a flex with the earpiece and sensors, so it is replaced as a small assembly.",
    },
    {
      title: "Photos, video and flash are all tested",
      body: "Every lens, autofocus, the flash and video recording all get checked before the phone leaves the counter.",
    },
  ],
  sections: () => [
    {
      heading: "Is it the camera or the glass in front of it?",
      paragraphs: [
        "This is the first thing to establish, because it is the difference between a small repair and a larger one. The rear cameras on an iPhone sit behind small individual sapphire lens covers, and those covers crack from drops while the camera modules behind them stay perfectly intact.",
        "The symptom of cracked lens glass is distinctive: photos look hazy, washed out, or show flare and starbursts around bright lights, and the effect is worse in sunlight or at night against street lamps. Focus itself still works. If your photos have gone milky rather than blurry, look closely at the lens covers.",
        "A failed camera module behaves differently. It will not focus at all, shows a black frame, or the app freezes when switching to that lens. TechBrotherz checks both at the counter before quoting, because quoting a module replacement for cracked glass would be charging for the wrong repair.",
      ],
    },
    {
      heading: "Why does an iPhone camera stop focusing?",
      paragraphs: [
        "Modern iPhone cameras focus by physically moving the lens element with tiny motors, and the same mechanism handles optical image stabilisation on the models that have it. It is a mechanical assembly in a phone that gets dropped, and mechanical assemblies eventually stop moving properly.",
        "A drop is the usual cause. The stabilisation mechanism is suspended on fine springs, and a hard impact can knock it out of position or break the suspension. The tell-tale sign is a faint rattle when the phone is shaken gently, along with photos that will not come into focus.",
        "Magnets are a less obvious cause worth knowing about. Strong magnets held close to the camera can disturb the stabilisation assembly, which is why very strong magnetic mounts and cases are worth avoiding near the camera bump.",
      ],
    },
    {
      heading: "What about the front camera and Face ID?",
      paragraphs: [
        "The front camera on an iPhone shares a flex assembly with the earpiece speaker and the proximity sensor, and on Face ID models it sits alongside the dot projector and infrared camera in the same notch. Those Face ID components are paired to the logic board and are not replaceable, which makes this area the most delicate on the phone.",
        "The practical consequence is that a front camera can be replaced, but the Face ID hardware next to it cannot. If a drop has damaged the Face ID components rather than the camera, that function is permanently gone on that handset, and no shop can restore it.",
        "TechBrotherz will tell you which of the two you are dealing with before doing any work, because it changes both the price and what you get back at the end.",
      ],
    },
    {
      heading: "How much does an iPhone camera repair cost in Calgary?",
      paragraphs: [
        "iPhone camera repair at TechBrotherz in Calgary is priced per model in the table above, and each price includes the part and the labour. Rear camera modules on recent Pro models cost more than the single camera in an older iPhone, because those phones carry three separate modules and each is a distinct part.",
        "Cracked lens glass over the rear camera is a smaller job than a module replacement, and it is worth asking about specifically if that is what you have. Bringing the phone in is the fastest way to find out which repair you need, and the check costs nothing.",
        "Models showing Call for quote in the table are ones where the part is ordered in and priced once we know the cost. We do not publish a price we cannot stand behind.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPhone 11 Pro and later",
      note: "Three separate rear camera modules mean the price depends on which lens has failed. Testing each one at the counter identifies the right part.",
    },
    {
      model: "iPhone 12 and later",
      note: "The rear camera sits behind the back glass, so accessing it is a different job from older models where it comes out through the front.",
    },
    {
      model: "iPhone X and later",
      note: "The front camera shares its assembly with Face ID hardware, which is paired to the board and cannot be replaced if it is damaged.",
    },
  ],
  notWorthIt: [
    "When only the ultra-wide or telephoto lens has failed and the main camera still works fine.",
    "When the phone has been through water, because camera faults are often the first visible sign of wider corrosion.",
    "When the module price on a recent Pro model approaches the cost of a screen on a phone already due for replacement.",
  ],
  faqs: () => [
    {
      question: "How much does iPhone camera repair cost in Calgary?",
      answer: `iPhone camera repair at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. Recent Pro models are the larger job because they carry three separate rear camera modules, each a distinct part. Cracked rear lens glass is a smaller repair than replacing the module underneath it.`,
    },
    {
      question: "Why are my iPhone photos hazy or full of flare?",
      answer:
        "Hazy, washed-out photos with flare around bright lights usually mean the small sapphire lens cover over the rear camera has cracked, not that the camera module has failed. Focus still works. TechBrotherz in Calgary checks the lens glass and the module separately, because they are two different repairs at two different prices.",
    },
    {
      question: "My iPhone camera rattles and will not focus. What is wrong?",
      answer:
        "A faint rattle when the phone is shaken, combined with photos that will not focus, usually means the optical image stabilisation assembly has been knocked loose by a drop. The lens element is suspended on fine springs that can break on impact. Replacing the camera module is the repair for this.",
    },
    {
      question: "Can TechBrotherz repair Face ID if the front camera is damaged?",
      answer:
        "The front camera can be replaced, but the Face ID dot projector and infrared camera beside it are cryptographically paired to the logic board and cannot be replaced on any iPhone. If a drop damaged the Face ID hardware, that function is permanently lost on that handset. TechBrotherz identifies which component failed before quoting.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const iphoneBackGlass: RepairDef = {
  slug: "iphone-back-glass-replacement",
  art: "screen",
  localPath: "/phone-repair-calgary",
  h1: "iPhone Back Glass Replacement Prices",
  eyebrow: "iPhone back glass",
  seoTitle: "iPhone Back Glass Replacement Calgary | Price By Model",
  seoDescription:
    "iPhone back glass and housing replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, no appointment needed.",
  serviceType: "iPhone back glass replacement",
  parentService: "/services/phone-repair",
  source: {
    kind: "catalogue",
    brandSlug: "apple-iphone",
    repairSlugs: ["back-glass-replacement", "back-housing-replacement"],
  },
  siblings: ["/repairs/iphone-screen-replacement", "/repairs/samsung-back-glass-replacement"],
  brandSlug: "apple-iphone",
  minutes: 60,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces cracked iPhone back glass. Since the iPhone 8, the rear panel is glass rather than aluminium, and on models before the iPhone 12 it is bonded to the frame hard enough that replacement is a slow job rather than a quick one.`,
  answer: () =>
    `iPhone back glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On iPhone 8 through iPhone 11 the rear glass is bonded to the frame with strong adhesive and has to be removed in pieces, which makes it a longer repair than a screen. From iPhone 12 onwards the panel is designed to come off more cleanly.`,
  symptoms: [
    "Cracked or shattered glass on the back of the phone, with the front undamaged.",
    "Glass fragments lifting away from the frame, sharp enough to catch on a pocket.",
    "Wireless charging that has stopped working since the back was cracked.",
    "A back panel bulging outward, which means the battery underneath has swollen.",
    "Cracks spreading from around the camera bump after a drop onto a corner.",
  ],
  steps: [
    {
      title: "The extent of the damage is assessed",
      body: "Back glass that is cracked but flat is a different job from glass that has shattered into loose fragments across the camera bump.",
    },
    {
      title: "The phone is opened from the front and stripped",
      body: "Everything has to come out of the frame before the back can be worked on, because the process that removes the old glass would destroy anything left inside.",
    },
    {
      title: "The old glass is removed from the frame",
      body: "On iPhone 8 through 11 the panel is bonded hard and comes away in pieces, which is the slow part of this repair. On iPhone 12 and later it releases more cleanly.",
    },
    {
      title: "The frame is cleaned and the new panel bonded",
      body: "Every trace of old glass and adhesive has to come off, because a new panel will not sit flat on a frame with fragments still stuck to it.",
    },
    {
      title: "The phone is rebuilt and tested",
      body: "Everything goes back in, and wireless charging, the cameras and the flash are all checked, because all three sit behind or beside the panel that was replaced.",
    },
  ],
  sections: () => [
    {
      heading: "Why is iPhone back glass replacement more work than a screen?",
      paragraphs: [
        "A screen is designed to be removed. It is held by two screws and a set of connectors, because Apple's own service process replaces displays. The back glass on an iPhone 8 through iPhone 11 was never designed to come off at all, and it is bonded to the frame with adhesive strong enough that it does not release intact.",
        "In practice that means the old panel is removed in fragments rather than lifted off, and every piece of glass and every trace of adhesive has to be cleared from the frame before a new panel can bond flat. That clearing is where the time goes, and it is why this repair takes around an hour rather than half of one.",
        "It also means the phone has to be completely stripped first. The board, the battery, the cameras and the taptic engine all come out of the frame before the back is worked on, and go back in afterwards.",
      ],
    },
    {
      heading: "What changed with the iPhone 12?",
      paragraphs: [
        "From the iPhone 12 onwards, Apple changed the internal design so the rear glass can be removed more cleanly, which makes the repair meaningfully less laborious than it is on the iPhone 8 through 11 generation. It is one of the few cases where a newer phone is easier to repair than an older one.",
        "This shows up in the pricing. On the models where the glass has to be taken off in pieces, the labour is the dominant cost rather than the part, which is why an older iPhone can cost as much for back glass as a newer one despite the part being cheaper.",
        "If you are weighing up whether to have back glass done, the model matters more here than on almost any other repair, and the table above reflects that rather than smoothing it into one price.",
      ],
    },
    {
      heading: "Does cracked back glass actually need fixing?",
      paragraphs: [
        "Not always, and it is worth being honest about that. A back panel with a single crack that is not lifting, on a phone that lives in a case, affects nothing about how the phone works. Wireless charging usually keeps working, and if you cannot see it, it is not doing you harm.",
        "Three things change that. Loose fragments are sharp and will catch on hands and pockets, and glass that has started lifting will keep coming away. A crack that lets moisture and dust in past the seal is a slow problem rather than an immediate one. And if you plan to sell or trade the phone in, cracked back glass reduces the value by more than the repair costs on most models.",
        "The one case that is not optional is a back panel bulging outward. That is a swollen battery pushing from the inside, and it needs dealing with promptly rather than watching.",
      ],
    },
    {
      heading: "Will wireless charging still work afterwards?",
      paragraphs: [
        "Yes. The wireless charging coil sits inside the phone, mounted against the inside of the rear panel, and it is not part of the glass that gets replaced. It comes out with the rest of the internals during the strip-down and goes back in afterwards.",
        "If wireless charging stopped working when the back cracked, the impact that broke the glass most likely damaged the coil or its connector underneath, and that is a separate part. We will test it during the repair and tell you if that is what we find.",
        "The cameras and flash also sit behind the rear panel, and all of them get tested after the glass is replaced, because a hard enough drop to shatter the back is a hard enough drop to disturb what is behind it.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPhone 8 through iPhone 11",
      note: "The rear glass is bonded hard to the frame and comes away in pieces. This is the labour-heavy generation for this repair.",
    },
    {
      model: "iPhone 12 and later",
      note: "Apple changed the internal design so the rear panel releases more cleanly, which makes the repair less laborious than on the previous generation.",
    },
    {
      model: "iPhone 7 and earlier",
      note: "These have aluminium backs rather than glass, so this repair does not apply. Dents and scuffs on those models are housing work.",
    },
  ],
  notWorthIt: [
    "When a single crack is stable, not lifting, and the phone lives in a case.",
    "When the phone is old enough that the labour-heavy repair costs a large share of its used value.",
    "When the front screen also needs replacing, because doing both is worth pricing together before deciding.",
  ],
  faqs: () => [
    {
      question: "How much does iPhone back glass replacement cost in Calgary?",
      answer: `iPhone back glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On iPhone 8 through iPhone 11 the labour dominates the job, because the panel is bonded hard to the frame and has to be removed in pieces rather than lifted off.`,
    },
    {
      question: "Why does back glass cost as much as a screen on some iPhones?",
      answer:
        "On iPhone 8 through iPhone 11 the rear glass was never designed to be removed. It is bonded to the frame and comes away in fragments, and the phone must be completely stripped first. That labour, not the part, is what drives the price. From iPhone 12 onwards Apple changed the design so the panel releases more cleanly.",
    },
    {
      question: "Does cracked back glass stop wireless charging working?",
      answer:
        "Usually not. The wireless charging coil sits inside the phone against the rear panel and is a separate component from the glass. If wireless charging stopped when the back cracked, the impact likely damaged the coil or its connector, which TechBrotherz tests for during the repair.",
    },
    {
      question: "Do I have to fix cracked back glass on my iPhone?",
      answer:
        "Not always. A single stable crack on a phone that lives in a case affects nothing functionally. Loose sharp fragments, glass that is lifting, or a trade-in valuation are the usual reasons to fix it. A back panel bulging outward is different: that is a swollen battery and should be brought in promptly.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

/* ================================================================= Samsung */

const samsungScreen: RepairDef = {
  slug: "samsung-screen-replacement",
  art: "screen",
  localPath: "/samsung-repair-calgary",
  h1: "Samsung Galaxy Screen Replacement Prices",
  eyebrow: "Samsung screen",
  seoTitle: "Samsung Screen Replacement Calgary | Price By Model",
  seoDescription:
    "Samsung Galaxy screen replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, walk in, no appointment needed.",
  serviceType: "Samsung Galaxy screen replacement",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "samsung-galaxy", repairSlugs: ["screen-replacement"] },
  siblings: ["/repairs/iphone-screen-replacement", "/repairs/samsung-battery-replacement"],
  brandSlug: "samsung-galaxy",
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces Samsung Galaxy screens. Samsung screens cost more than iPhone screens of the same generation, and the reason is structural: on a Galaxy the display is bonded to the frame itself, so the frame is part of the replacement.`,
  answer: (c) =>
    `Samsung Galaxy screen replacement at TechBrotherz in Calgary fits a complete assembly, because Samsung bonds the OLED panel to the phone's frame and supplies the two as one part. The repair takes about 45 minutes and carries a ${c.warrantyDays}-day warranty. The quote is free and given before any work starts.`,
  symptoms: [
    "Cracked glass, including cracks that start at a curved edge and spread inward.",
    "Green, pink or black vertical lines running down the display.",
    "A dark patch that grows over days, typical of a damaged OLED panel.",
    "Touch that has stopped responding along one edge of a curved screen.",
    "A display that shows an image but stays black in bright light, meaning the backlight circuit or panel has failed.",
  ],
  steps: [
    {
      title: "The phone is opened from the back",
      body: "Unlike an iPhone, a Galaxy opens from the rear. The back glass is heated, cut free and lifted off before anything else can be reached.",
    },
    {
      title: "The internals are removed to reach the display",
      body: "The wireless charging coil, the board shields and the battery all sit between the back and the display assembly, so they come out first.",
    },
    {
      title: "The display and frame assembly is replaced together",
      body: "On most Galaxy models the OLED panel is bonded to the phone's mid-frame and supplied as one part, which is the main reason the price is higher than an iPhone screen.",
    },
    {
      title: "Everything is transferred to the new frame",
      body: "The board, the battery, the cameras and the buttons all move across into the new assembly, which is what makes this a 45-minute job rather than a 30-minute one.",
    },
    {
      title: "The back glass is resealed and the phone tested",
      body: "Fresh adhesive goes around the rear panel, and touch across the whole display including the curved edges is checked before the phone leaves.",
    },
  ],
  sections: () => [
    {
      heading: "Why do Samsung screens cost more than iPhone screens?",
      paragraphs: [
        "The difference is structural rather than a matter of brand. On most Samsung Galaxy models the OLED display is bonded to the phone's mid-frame at the factory and supplied as a single service assembly, so replacing the screen means replacing the frame it is mounted in. On an iPhone the display comes off the frame as its own part.",
        "That means a Galaxy screen part includes more of the phone, and it costs accordingly. It also means the repair takes longer, because the board, the battery, the cameras and the buttons all have to be transferred from the old frame into the new one rather than the screen simply being swapped.",
        "The second factor is the panel itself. Samsung has used OLED across its range for far longer than Apple has, including on mid-range models, and OLED panels cost more to manufacture than the LCD panels that older iPhones used.",
      ],
    },
    {
      heading: "What do coloured lines on a Galaxy screen mean?",
      paragraphs: [
        "Green, pink or black vertical lines down a Samsung display almost always mean the OLED panel has been damaged, and the damage is usually at the ribbon connection along one edge rather than in the middle of the picture. It is one of the most recognisable Galaxy failure patterns.",
        "The usual cause is a drop or a pressure event that did not crack the glass. A phone sat on in a back pocket, or dropped flat on a hard floor, can flex the panel enough to disturb the connection without leaving any visible mark on the outside.",
        "These lines do not repair themselves and they generally spread. A single line becomes several over weeks, and a dark band widens. The fix is a display replacement, and having it done earlier does not cost less, but it does mean fewer weeks of looking at it.",
      ],
    },
    {
      heading: "Why do curved Galaxy screens cost more to fix?",
      paragraphs: [
        "The curved-edge displays on the Galaxy S and Note Edge models are more expensive to manufacture than flat ones, and they are more fragile in a specific way: an impact on a curved edge concentrates force on the most vulnerable part of the panel, so drops that a flat screen would survive can crack a curved one.",
        "The curve also affects how the phone must be handled during the repair. Adhesive along a curved edge needs even heating and careful separation, and a panel that is pressed unevenly during fitting will show as a touch dead-zone along the edge afterwards.",
        "This is worth knowing when comparing models. A Galaxy with a flat display is meaningfully cheaper to repair than the curved model from the same generation, and that is a real ownership cost rather than a trivial difference.",
      ],
    },
    {
      heading: "How much does a Samsung screen replacement cost in Calgary?",
      paragraphs: [
        `A Galaxy screen is quoted per model at the counter, and the quote covers the part and the labour together. The spread across the Galaxy range is wider than it is for iPhone, because the range runs from small flat A-series displays to large curved Note panels, and a curved panel is a different part entirely.`,
        "The repair takes about 45 minutes rather than the 30 minutes a typical iPhone screen takes, because of the frame transfer described above. Most Galaxy screen repairs are still done while you wait.",
        "Models showing Call for quote in the table are ones where the assembly is ordered in and priced once we know the cost. Samsung's own service pricing for its current models is published on its Canadian support site and is worth comparing before deciding.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Galaxy S and Note edge models",
      note: "Curved displays cost more than flat ones from the same generation and are more vulnerable to edge impacts. The adhesive along the curve needs even heating during the repair.",
    },
    {
      model: "Galaxy S7 and earlier",
      note: "These are the last generation where separating the glass from the panel was practical on some models. On everything newer the display replaces as an assembly.",
    },
    {
      model: "Galaxy Note models",
      note: "The S Pen digitiser layer sits behind the display and is part of the assembly, so pen pressure sensitivity is tested along with touch after the repair.",
    },
  ],
  notWorthIt: [
    "When the frame is bent, because the new display assembly needs a true frame to seat against.",
    "When the phone has water damage that has reached the board, since a new screen does not stop corrosion.",
    "When the screen price on an older curved model is close to the handset's used value.",
  ],
  faqs: () => [
    {
      question: "How much does a Samsung screen replacement cost in Calgary?",
      answer: `Samsung Galaxy screen replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. A Galaxy screen is a larger job than a comparable iPhone screen because the OLED panel is bonded to the phone's mid-frame and supplied as one complete assembly.`,
    },
    {
      question: "Why is a Samsung screen more expensive to replace than an iPhone screen?",
      answer:
        "On most Galaxy models the display is bonded to the phone's mid-frame at the factory and supplied as a single assembly, so the replacement part includes the frame. The board, battery and cameras must then be transferred into the new frame. On an iPhone the display comes off as its own part, which costs less and takes less time.",
    },
    {
      question: "What do green or pink lines on my Galaxy screen mean?",
      answer:
        "Coloured vertical lines on a Samsung display mean the OLED panel has been damaged, usually at the ribbon connection along one edge, often from a drop or pressure that left no visible mark. The lines spread over time and do not recover. A display replacement is the repair.",
    },
    {
      question: "How long does a Samsung screen replacement take?",
      answer:
        "About 45 minutes at TechBrotherz in Calgary, longer than an iPhone screen. A Galaxy opens from the back, and the board, battery, cameras and buttons must all be transferred into the new display and frame assembly, which is what accounts for the extra time.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const samsungBattery: RepairDef = {
  slug: "samsung-battery-replacement",
  art: "battery",
  localPath: "/samsung-repair-calgary",
  h1: "Samsung Galaxy Battery Replacement Prices",
  eyebrow: "Samsung battery",
  seoTitle: "Samsung Battery Replacement Calgary | Price By Model",
  seoDescription:
    "Samsung Galaxy battery replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, walk in, no appointment needed.",
  serviceType: "Samsung Galaxy battery replacement",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "samsung-galaxy", repairSlugs: ["battery-replacement"] },
  siblings: ["/repairs/iphone-battery-replacement", "/repairs/samsung-screen-replacement"],
  brandSlug: "samsung-galaxy",
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces Samsung Galaxy batteries. Since the Galaxy S6, Samsung batteries have been sealed inside the phone rather than user-removable, so replacing one means opening the phone from the back and cutting through adhesive.`,
  answer: () =>
    `Samsung Galaxy battery replacement at TechBrotherz in Calgary takes about 45 minutes. Galaxy batteries have been sealed inside the phone since the Galaxy S6, so the repair means heating and removing the rear glass, cutting the battery free of its adhesive, and resealing the phone afterwards. The quote is free and given before any work starts.`,
  symptoms: [
    "The phone no longer reaches the end of a day on a charge it used to manage.",
    "It shuts down suddenly with charge still showing, particularly in cold weather.",
    "The phone gets noticeably warm while charging or sitting idle.",
    "The back glass has started to lift or bulge, which means the cell has swollen.",
    "Charging has become very slow, or the phone will not hold charge above a certain level.",
  ],
  steps: [
    {
      title: "Battery usage is checked in settings first",
      body: "Android reports which apps are consuming power. A single misbehaving app drains a phone in a way that looks exactly like a worn battery, and that costs nothing to fix.",
    },
    {
      title: "The rear glass is heated and removed",
      body: "Galaxy phones open from the back, and the rear panel is sealed with adhesive all the way round that has to be warmed and cut through.",
    },
    {
      title: "The wireless charging coil and shields come out",
      body: "These sit between the back glass and the battery, so they are removed before the cell can be reached.",
    },
    {
      title: "The battery is cut free and replaced",
      body: "Samsung batteries are held down with strong adhesive across the whole underside. It is softened and the cell eased out, never levered against, because puncturing a lithium cell is dangerous.",
    },
    {
      title: "The phone is resealed with fresh adhesive",
      body: "New adhesive goes around the rear panel so the phone closes properly. Charging and reported battery health are tested before it leaves.",
    },
  ],
  sections: () => [
    {
      heading: "Why can you no longer just swap a Galaxy battery yourself?",
      paragraphs: [
        "Until the Galaxy S5, Samsung phones had removable back covers and batteries you could carry a spare for, and that was one of the main things people preferred about them over the iPhone. The Galaxy S6 ended it, in exchange for a sealed metal and glass body, water resistance and wireless charging.",
        "The result is that a battery replacement went from a ten-second job anyone could do to a proper repair. The rear glass is bonded on with adhesive around the entire perimeter, and it has to be warmed until that adhesive softens and then cut through carefully without cracking the panel.",
        "This is why a Galaxy battery replacement takes about 45 minutes rather than the 30 an iPhone takes. More of the phone has to come apart to reach the cell, and it has to be properly resealed afterwards.",
      ],
    },
    {
      heading: "How do you know a Galaxy battery is worn out?",
      paragraphs: [
        "Android does not expose a maximum capacity percentage the way iOS does, which makes this less straightforward than on an iPhone. Samsung's own Members app includes a battery status check on many models, and that is the closest equivalent, reporting battery life as normal, weak or in need of replacement.",
        "Failing that, behaviour is the guide. A battery that has genuinely worn out shows a phone that lasts noticeably less than a year ago on the same use, shuts down with charge still showing, and struggles particularly in the cold, because low temperatures reduce what a worn cell can deliver.",
        "Before assuming the battery, check Settings and look at battery usage by app. A single app misbehaving in the background will flatten a phone in a way that looks identical to a worn cell from the outside, and that is worth ruling out before paying for a repair.",
      ],
    },
    {
      heading: "What should you do about a swollen Galaxy battery?",
      paragraphs: [
        "Stop using the phone and bring it in. On a Galaxy the first sign is usually the rear glass lifting at one edge or bowing outward in the middle, because the swollen cell sits directly beneath it. It is a safety matter rather than an inconvenience.",
        "Do not try to press the back down or clamp it shut, and do not leave the phone charging unattended. A punctured lithium cell can catch fire, and forcing a swollen phone closed is the most common way one gets punctured.",
        "Caught early, the swelling usually causes no other damage and the replacement is a normal repair. Left long enough, the pressure can crack the rear glass or push against the display from behind, which turns one repair into two.",
      ],
    },
    {
      heading: "How much does a Samsung battery replacement cost in Calgary?",
      paragraphs: [
        `A Galaxy battery is quoted per model at the counter, with the part and the labour in one figure. The range across the Galaxy line is much narrower than it is for screens, because the cell itself is a similar part from model to model and most of the job is the access work.`,
        "Part of the price is the resealing. Fresh adhesive around the rear panel is not optional on a phone that was designed to be sealed, and a battery replacement that skips it leaves a phone with a back that lifts and a gap for dust.",
        "Your data is untouched by a battery replacement. Nothing goes near the storage, and there is nothing to back up or restore afterwards. Back the phone up anyway before any repair, as a precaution.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Galaxy S5 and earlier",
      note: "These have user-removable back covers and batteries. If you have one of these, a replacement cell is something you can fit yourself in seconds.",
    },
    {
      model: "Galaxy S6 and later",
      note: "Sealed body, adhesive-bonded rear glass and a glued-in cell. This is where battery replacement became a proper repair rather than a swap.",
    },
    {
      model: "Galaxy Note models",
      note: "The larger cells in Note models take longer to ease out, and the bigger rear panel needs more even heating to remove without cracking.",
    },
  ],
  notWorthIt: [
    "When battery usage in settings shows one app doing the draining rather than the cell being worn.",
    "When the phone also needs a screen, because the two together often approach the handset's used value.",
    "When the phone no longer receives Samsung security updates and is being kept going short term.",
  ],
  faqs: () => [
    {
      question: "How much does a Samsung battery replacement cost in Calgary?",
      answer: `Samsung Galaxy battery replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. The range across the Galaxy line is narrower than it is for screens, because the cell is a similar part from model to model.`,
    },
    {
      question: "Can I replace a Galaxy battery myself?",
      answer:
        "On the Galaxy S5 and earlier, yes, because those have removable back covers and user-replaceable cells. From the Galaxy S6 onwards the battery is sealed inside a bonded glass body and glued down, so replacing it means heating and cutting off the rear panel and resealing it afterwards.",
    },
    {
      question: "How can I tell if my Samsung battery is worn out?",
      answer:
        "Android does not report maximum capacity the way iOS does. Samsung's Members app includes a battery status check on many models. Otherwise, the signs are a phone lasting noticeably less than a year ago, shutting down with charge still showing, and struggling in cold weather. Check battery usage by app first, because one misbehaving app looks identical to a worn cell.",
    },
    {
      question: "My Galaxy back glass is lifting. Is that the battery?",
      answer:
        "Almost certainly. On a Galaxy the battery sits directly beneath the rear panel, so a swollen cell lifts or bows the back glass. Stop using the phone, do not press the back down or clamp it shut, and bring it to TechBrotherz in Calgary. Caught early, the swelling usually causes no further damage.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const samsungBackGlass: RepairDef = {
  slug: "samsung-back-glass-replacement",
  art: "screen",
  localPath: "/samsung-repair-calgary",
  h1: "Samsung Back Glass Replacement Prices",
  eyebrow: "Samsung back glass",
  seoTitle: "Samsung Back Glass Replacement Calgary | Price By Model",
  seoDescription:
    "Samsung Galaxy back glass replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, no appointment needed.",
  serviceType: "Samsung Galaxy back glass replacement",
  parentService: "/services/phone-repair",
  source: {
    kind: "catalogue",
    brandSlug: "samsung-galaxy",
    repairSlugs: ["back-glass-replacement", "back-housing-replacement"],
  },
  siblings: ["/repairs/iphone-back-glass-replacement", "/repairs/samsung-screen-replacement"],
  brandSlug: "samsung-galaxy",
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces cracked Samsung Galaxy back glass. On a Galaxy the rear panel is the way into the phone for every internal repair, which means the technique for removing it is the same one used for battery and screen work.`,
  answer: (c) =>
    `Samsung Galaxy back glass replacement at TechBrotherz in Calgary means heating the rear panel, cutting it free of the adhesive that runs around its entire perimeter, fitting the replacement and resealing it. The repair takes about 45 minutes and carries a ${c.warrantyDays}-day warranty. The quote is free and given before any work starts.`,
  symptoms: [
    "Cracked or shattered glass on the back of the phone, with the display unaffected.",
    "Glass lifting at a corner or along an edge, catching on hands and pockets.",
    "Wireless charging that has become unreliable since the back was damaged.",
    "A rear panel bulging outward, which is a swollen battery rather than impact damage.",
    "Cracks radiating from around the camera housing after a corner drop.",
  ],
  steps: [
    {
      title: "The damage and the camera housing are assessed",
      body: "On many Galaxy models the camera glass is a separate part from the main rear panel, so a crack around the lenses may not need the whole back replaced.",
    },
    {
      title: "The old panel is heated and cut free",
      body: "Adhesive runs around the entire perimeter. It is warmed until it softens and cut through with a thin blade, working slowly to avoid cracking the frame.",
    },
    {
      title: "The frame is cleaned back to bare metal",
      body: "Every trace of old adhesive and glass has to come off, because a new panel will not bond evenly to a frame with residue on it.",
    },
    {
      title: "The new panel is bonded with fresh adhesive",
      body: "A pre-cut adhesive gasket goes on, the panel is seated, and the phone is clamped while it sets so the bond is even all the way round.",
    },
    {
      title: "Wireless charging and the cameras are tested",
      body: "Both sit directly behind the rear panel, so both are checked before the phone leaves the counter.",
    },
  ],
  sections: () => [
    {
      heading: "Is Samsung back glass easier to replace than iPhone back glass?",
      paragraphs: [
        "Yes, and the reason is that on a Galaxy the rear panel is the service access point. Samsung's own repair process for a battery, a charging port or a display starts by removing the back, so the panel is bonded to be removable rather than permanent.",
        "On an iPhone 8 through iPhone 11 the opposite is true: the back was never meant to come off, service happens through the front, and the rear glass is bonded hard enough that it comes away in fragments. That difference is why iPhone back glass on those models is a labour-heavy repair and Galaxy back glass is not.",
        "In practice a Galaxy rear panel is heated, cut free around the perimeter, and lifted off in one piece most of the time. The work is careful rather than laborious.",
      ],
    },
    {
      heading: "Is the camera glass a separate part?",
      paragraphs: [
        "On many Galaxy models, yes, and it is worth checking before agreeing to a full rear panel replacement. The glass covering the camera array is often its own small component that can be replaced on its own, which is a smaller and cheaper job than replacing the entire back.",
        "This matters because the camera housing protrudes, which makes it the first thing to hit the ground on a corner drop. A phone with cracked camera glass and an otherwise intact back is a common presentation, and it does not need the whole panel.",
        "Cracked camera glass is worth fixing even when it looks cosmetic, because the cracks scatter light directly into the lenses and photos come out hazy and full of flare. TechBrotherz checks which part is actually broken before quoting.",
      ],
    },
    {
      heading: "Does cracked back glass affect wireless charging on a Galaxy?",
      paragraphs: [
        "Usually not. The wireless charging coil is mounted inside the phone against the rear panel, not built into the glass, so cracked glass alone leaves it working. If wireless charging has become unreliable since the damage, the impact most likely disturbed the coil or its connector underneath.",
        "That is a separate part from the glass, and it is checked during the repair since the phone is open anyway. If it needs replacing we will tell you before doing it rather than adding it to the bill.",
        "Samsung's reverse wireless charging feature, which lets the phone charge earbuds or a watch on its back, uses the same coil. If that has stopped working, it points at the same place.",
      ],
    },
    {
      heading: "Will the phone still be water resistant afterwards?",
      paragraphs: [
        "Not to its original rating, and no repair shop can honestly promise otherwise. Water resistance on a Galaxy depends on factory-applied seals and adhesive compressed under controlled conditions, and once that seal has been cut through, what goes back is a good seal rather than a certified one.",
        "TechBrotherz uses fresh adhesive around the entire perimeter and clamps the phone while it sets, which gives a properly closed phone that will handle rain and splashes the way you would expect. What it will not do is guarantee the phone against submersion.",
        "This is true of every repair on a sealed phone, at every shop, and anyone who tells you a repaired phone keeps its original water rating is overselling. Treat a repaired phone as water resistant rather than waterproof.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Galaxy S and Note flagship models",
      note: "Camera glass is frequently a separate part from the rear panel, so a corner drop that cracked the camera housing may not need the whole back.",
    },
    {
      model: "Galaxy A series",
      note: "Some A-series models use a polycarbonate back rather than glass, which cracks differently and is a different part.",
    },
    {
      model: "Any model with reverse wireless charging",
      note: "The coil behind the rear panel drives both normal and reverse wireless charging, so both are tested after the panel is replaced.",
    },
  ],
  notWorthIt: [
    "When only the camera glass is cracked, since that is a smaller and cheaper repair on most models.",
    "When a single crack is stable and the phone lives in a case.",
    "When the phone is due for replacement and the back is cosmetic rather than lifting.",
  ],
  faqs: () => [
    {
      question: "How much does Samsung back glass replacement cost in Calgary?",
      answer: `Samsung Galaxy back glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. The panel is heated, cut free of its perimeter adhesive, replaced and resealed with fresh adhesive, which takes about 45 minutes.`,
    },
    {
      question: "Is only my Samsung camera glass cracked, or the whole back?",
      answer:
        "On many Galaxy models the glass over the camera array is a separate part from the main rear panel, and replacing it alone is a smaller and cheaper repair. Because the camera housing protrudes, it is often the only thing damaged in a corner drop. TechBrotherz checks which part is broken before quoting.",
    },
    {
      question: "Will my Galaxy still be water resistant after back glass replacement?",
      answer:
        "Not to its original factory rating. Water resistance depends on seals compressed under controlled factory conditions, and cutting through them for any repair ends that certification. TechBrotherz reseals with fresh perimeter adhesive and clamps the phone while it sets, giving a properly closed phone that handles rain and splashes.",
    },
    {
      question: "Why is Samsung back glass easier to replace than iPhone back glass?",
      answer:
        "On a Galaxy the rear panel is the service access point for every internal repair, so it is bonded to be removable and usually lifts off in one piece. On iPhone 8 through iPhone 11 the back was never designed to come off, service happens through the front, and the glass must be removed in fragments.",
    },
  ],
  globalCategories: ["parts", "warranty"],
};

const samsungPort: RepairDef = {
  slug: "samsung-charging-port-repair",
  art: "port",
  localPath: "/samsung-repair-calgary",
  h1: "Samsung Charging Port Repair Prices",
  eyebrow: "Samsung charging port",
  seoTitle: "Samsung Charging Port Repair Calgary | Price By Model",
  seoDescription:
    "Samsung Galaxy charging port replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, walk in.",
  serviceType: "Samsung Galaxy charging port repair",
  parentService: "/services/phone-repair",
  source: { kind: "catalogue", brandSlug: "samsung-galaxy", repairSlugs: ["charging-port-repair"] },
  siblings: ["/repairs/iphone-charging-port-repair", "/repairs/samsung-battery-replacement"],
  brandSlug: "samsung-galaxy",
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces Samsung Galaxy charging ports. On most Galaxy models the USB-C port sits on a small daughterboard of its own, which makes it a cleaner replacement than on phones where the port is soldered directly to the mainboard.`,
  answer: () =>
    `Samsung Galaxy charging port replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On most Galaxy models the USB-C port sits on its own small board that unplugs and replaces as a unit. TechBrotherz clears compacted lint from the socket first, because that alone fixes many charging faults at no cost.`,
  symptoms: [
    "The cable will not stay in, or falls out when the phone is picked up.",
    "Charging only starts when the cable is pushed in hard or held at an angle.",
    "Fast charging has stopped working, though the phone still charges slowly.",
    "The phone charges from some cables and chargers but not others.",
    "Nothing happens on any cable, and wireless charging still works normally.",
  ],
  steps: [
    {
      title: "The socket is inspected and cleaned",
      body: "USB-C sockets are deeper than Lightning and collect more lint. A compacted pad at the bottom stops the connector seating, and clearing it is often the whole fix.",
    },
    {
      title: "Cables and chargers are ruled out",
      body: "A cable that has failed internally can charge one device and not another. Testing with a known-good cable and plug avoids an unnecessary repair.",
    },
    {
      title: "The rear glass is removed",
      body: "A Galaxy opens from the back, so the rear panel is heated and cut free before the charging board can be reached.",
    },
    {
      title: "The charging daughterboard is unplugged and replaced",
      body: "On most Galaxy models the port sits on its own small board connected by a ribbon cable, so it comes out as a unit rather than needing to be desoldered.",
    },
    {
      title: "Charging, fast charging and the microphone are tested",
      body: "The charging board usually carries the bottom microphone too, so both are checked before the rear panel is resealed.",
    },
  ],
  sections: () => [
    {
      heading: "Why is a Galaxy charging port a cleaner repair than on some phones?",
      paragraphs: [
        "On most Samsung Galaxy models the USB-C connector is mounted on its own small daughterboard, separate from the mainboard, and connected by a ribbon cable. That means replacing it is a matter of unplugging one board and plugging in another, rather than desoldering a connector from the main logic board.",
        "This is genuinely good design from a repair point of view. The charging port is one of the highest-wear components in any phone, because it is the part you physically insert something into several times a day, and putting it on a replaceable module is the sensible answer.",
        "The time in the repair goes into getting to it rather than the replacement itself. The rear glass has to be heated, cut free and resealed, which is the same access work as a battery replacement.",
      ],
    },
    {
      heading: "Why does USB-C collect more lint than other connectors?",
      paragraphs: [
        "A USB-C socket is a deeper, more enclosed cavity than the older Lightning or micro-USB connectors, with a small tongue in the middle that contacts are arranged around. That shape catches pocket lint efficiently and compacts it into a pad at the bottom over time.",
        "The result is a phone that appears to have a failing port when it actually has a full one. The connector cannot seat fully because there is a millimetre of felt in the way, so charging is intermittent or the cable will not click in properly.",
        "TechBrotherz clears this before quoting a replacement. A significant share of Galaxy phones brought in for charging problems need nothing more than the socket cleaned out, and that is the end of the visit.",
      ],
    },
    {
      heading: "Why has fast charging stopped working?",
      paragraphs: [
        "Fast charging depends on the phone and the charger negotiating a higher voltage over the data pins in the USB-C connector, not just on power flowing through it. Those pins are finer and more easily damaged than the power contacts, so a worn or slightly corroded port can lose fast charging while ordinary slow charging carries on working.",
        "That symptom, charging normally but never fast, is a useful diagnostic. It points at the port rather than the battery or the charger, particularly if a charger that fast-charges another phone will not do it on yours.",
        "Before assuming the port, check that the cable is rated for fast charging, because plenty are not, and check the charger. Samsung's fast charging also has settings that can be switched off, which is worth ruling out before paying for anything.",
      ],
    },
    {
      heading: "How much does a Samsung charging port repair cost in Calgary?",
      paragraphs: [
        `A Galaxy charging port is quoted per model at the counter, with the part and the labour in one figure. The repair takes about 45 minutes, most of which is the access work of removing and resealing the rear glass rather than the port itself.`,
        "Because the charging board usually carries the bottom microphone as well, this repair sometimes fixes a second problem people had not connected to it. If callers have been saying they cannot hear you clearly and the phone has also been fussy about charging, one part may be behind both.",
        "If wireless charging works normally but no cable charges the phone, that is a clear pointer at the port rather than the battery or the board, and it is worth mentioning at the counter.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Galaxy S8 and later",
      note: "USB-C on a separate daughterboard is standard across these models, which is what keeps the repair a module swap rather than soldering work.",
    },
    {
      model: "Galaxy S7 and earlier",
      note: "These use micro-USB rather than USB-C. The connector is different and the part is different, and the repair is the same shape of job.",
    },
    {
      model: "Models with reverse wireless charging",
      note: "If the phone charges wirelessly but not by cable, that isolates the fault to the port and rules out the battery and the charging circuit.",
    },
  ],
  notWorthIt: [
    "When clearing lint from the socket already restored normal charging.",
    "When a known-good cable and charger work fine, since the accessory was the fault.",
    "When the phone has water damage, because corrosion elsewhere can present as a charging fault.",
  ],
  faqs: () => [
    {
      question: "How much does Samsung charging port repair cost in Calgary?",
      answer: `Samsung Galaxy charging port replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On most Galaxy models the port sits on its own daughterboard that unplugs and replaces as a unit, and the repair takes about 45 minutes.`,
    },
    {
      question: "Why does my Galaxy charge slowly but not fast any more?",
      answer:
        "Fast charging is negotiated over the fine data pins in the USB-C connector, which are more easily damaged than the power contacts. A worn or corroded port can lose fast charging while ordinary charging continues. Check the cable is fast-charge rated and that fast charging is enabled in settings before assuming the port has failed.",
    },
    {
      question: "Why does USB-C fill up with lint so easily?",
      answer:
        "A USB-C socket is a deep enclosed cavity with a tongue in the middle, which catches pocket lint and compacts it into a pad at the bottom. The connector then cannot seat fully, which looks exactly like a failing port. TechBrotherz in Calgary clears the socket before quoting any replacement.",
    },
    {
      question: "My Galaxy charges wirelessly but not with a cable. What does that mean?",
      answer:
        "That isolates the fault to the charging port. Wireless charging uses a coil behind the rear panel and a different circuit path, so a phone that charges on a pad but not by cable has a working battery and charging circuit. The port or its daughterboard is what needs replacing.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

/* ==================================================================== iPad */

const ipadScreen: RepairDef = {
  slug: "ipad-screen-replacement",
  art: "screen",
  localPath: "/ipad-repair-calgary",
  h1: "iPad Screen and Glass Replacement Prices",
  eyebrow: "iPad screen",
  seoTitle: "iPad Screen Replacement Calgary | Price By Model",
  seoDescription:
    "iPad glass and screen replacement prices by model at TechBrotherz in Calgary. Part and labour included, 60-day warranty, walk in, no appointment needed.",
  serviceType: "iPad screen replacement",
  parentService: "/services/tablet-repair",
  source: {
    kind: "catalogue",
    brandSlug: "apple-ipad",
    repairSlugs: ["glass-digitizer", "screen-replacement"],
  },
  siblings: ["/repairs/iphone-screen-replacement", "/repairs/laptop-screen-replacement"],
  brandSlug: "apple-ipad",
  minutes: 90,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces iPad glass and screens. On older iPads the glass is a separate layer from the display, which is why a cracked iPad front is often a smaller repair than people expect.`,
  answer: () =>
    `iPad glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On older iPad models the touch glass is separate from the display panel, so a cracked front with a working picture needs only the glass. Recent iPad Air and iPad Pro models use a laminated display where both replace as one assembly, which is the larger job.`,
  symptoms: [
    "Cracked or shattered front glass while the picture underneath is still perfect.",
    "Touch that has stopped working in one area, or registers presses on its own.",
    "Black patches, coloured lines or a white glow, meaning the display panel has failed too.",
    "Glass lifting away from the aluminium frame at a corner.",
    "The Apple Pencil skipping or losing contact in one region of the screen.",
  ],
  steps: [
    {
      title: "Glass and display are told apart",
      body: "A cracked front with a perfect picture is the cheaper repair on models where the layers are separate. Black patches or lines mean the panel underneath needs replacing too.",
    },
    {
      title: "The perimeter adhesive is heated",
      body: "iPad glass is bonded around the entire edge. The whole perimeter is warmed evenly until the adhesive softens, which takes patience on a panel this size.",
    },
    {
      title: "The glass is cut free and lifted",
      body: "A thin blade separates the glass from the frame, working slowly around the edge. Rushing this is how frames get bent and how the digitiser cable gets cut.",
    },
    {
      title: "The frame is cleaned and the new panel bonded",
      body: "Old adhesive and glass fragments are cleared off completely, then a fresh adhesive gasket goes on and the new panel is seated and clamped while it sets.",
    },
    {
      title: "Touch, cameras and buttons are tested",
      body: "Touch across the whole panel, both cameras, the home button or Face ID, the speakers and charging are all checked before the iPad goes back.",
    },
  ],
  sections: () => [
    {
      heading: "Why is iPad glass replacement cheaper than an iPhone screen?",
      paragraphs: [
        `On many iPad models the touch-sensitive glass is a genuinely separate component from the display panel beneath it, with an air gap between the two. If the front cracks and the picture is unaffected, only the glass needs replacing, and that part is a fraction of a full display assembly. That is why a cracked older iPad is one of the smaller repairs TechBrotherz quotes.`,
        "This is the opposite of every modern phone, where the digitiser and the panel are laminated together at the factory and must be replaced as one. The iPad kept the older separated construction on its base models long after phones moved on.",
        "The practical result surprises people regularly: a large cracked iPad screen can cost less to repair than a small cracked phone screen, because the layer that broke is the cheap one.",
      ],
    },
    {
      heading: "Which iPads have laminated screens?",
      paragraphs: [
        "The iPad Air from the third generation onward, every iPad Pro, and the iPad mini from the fifth generation onward use laminated displays, where the glass is bonded directly to the panel with no air gap. The base iPad kept the older separated construction for much longer, through the ninth generation.",
        "Lamination is a genuine improvement to look at. It removes the air gap, so the picture appears to sit on the surface of the glass rather than behind a window, and it reduces reflections and the hollow feel when tapping. It is also what makes Apple Pencil use feel direct rather than slightly disconnected.",
        "The cost of that improvement appears at repair time. A crack on a laminated iPad takes out the whole assembly, and an iPad Pro display can cost several times what glass replacement costs on a base iPad. TechBrotherz identifies which construction your model uses before quoting, which is why the model number matters.",
      ],
    },
    {
      heading: "Why does an iPad repair take longer than a phone repair?",
      paragraphs: [
        "The adhesive perimeter on an iPad is far longer than on a phone, and it has to be heated evenly along its whole length before anything can be separated. A panel that is levered while one section is still cold will crack, and a frame that is pulled unevenly will bend.",
        "The frame is the part that cannot be undone. An iPad's aluminium body is thin and large, which makes it easy to distort, and a bent frame will not let a new panel sit flat afterwards. Working slowly is not caution for its own sake, it is what keeps the repair repeatable.",
        "In practice most iPad work is a same-day drop-off rather than a wait at the counter. Bring it in during the day and in most cases it is ready before we close.",
      ],
    },
    {
      heading: "How much does iPad screen repair cost in Calgary?",
      paragraphs: [
        `iPad glass is quoted per model at the counter, with the part and the labour in one figure. The spread across the iPad range is wider than on any other device TechBrotherz repairs, because it covers both separated-glass and laminated-display models, and those are two different repairs rather than two versions of one.`,
        "The model number is what determines which of those you have, and it is engraved in small print on the back of the iPad. Two tablets that look nearly identical can be very different repairs, which is why we ask rather than assume.",
        "Models showing Call for quote are ones where the assembly is ordered in and priced once we know the cost. Apple publishes its own out-of-warranty iPad service pricing, which is worth comparing before deciding where to have the work done.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "iPad 2 through iPad 9th generation",
      note: "Separated glass and display. A cracked front with a working picture needs only the glass, which is the cheaper repair.",
    },
    {
      model: "iPad Air 3 and later, iPad mini 5 and later",
      note: "Laminated displays, where the glass and panel replace as one assembly at a considerably higher part cost.",
    },
    {
      model: "Every iPad Pro",
      note: "Laminated, and the most expensive tablet display we fit. Worth pricing carefully against the tablet's value before committing.",
    },
  ],
  notWorthIt: [
    "When the aluminium frame is visibly bent, because a new panel cannot seat flat against it.",
    "When a laminated iPad Pro display approaches half the used value of the tablet.",
    "When the iPad has been in liquid, since corrosion continues after the glass is replaced.",
  ],
  faqs: () => [
    {
      question: "How much does it cost to replace an iPad screen in Calgary?",
      answer: `iPad glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. Older iPads with separated glass are the smaller repair. Laminated iPad Air and iPad Pro displays replace as one assembly and are the larger job.`,
    },
    {
      question: "Which iPad models have laminated screens?",
      answer:
        "iPad Air from the third generation, iPad mini from the fifth generation, and every iPad Pro use laminated displays where the glass is bonded to the panel. The base iPad kept separated glass through the ninth generation. Lamination removes the air gap and improves the picture, and it makes a cracked screen more expensive to repair.",
    },
    {
      question: "Can just the glass be replaced on a cracked iPad?",
      answer:
        "On iPad models with separated construction, yes. If the front glass is cracked and the picture underneath is undamaged, TechBrotherz in Calgary replaces the glass alone. On laminated iPad Air, iPad mini and iPad Pro models the glass and display are bonded and must be replaced together.",
    },
    {
      question: "Why does an iPad screen repair take longer than a phone screen?",
      answer:
        "The adhesive perimeter on an iPad is much longer than on a phone and has to be heated evenly along its whole length before separation. The thin aluminium frame bends easily if the panel is lifted unevenly, and a bent frame will not let a new panel sit flat. Most iPad repairs at TechBrotherz are same-day drop-offs.",
    },
  ],
  globalCategories: ["ipad", "warranty"],
};

/* ================================================================== laptop */

const laptopScreen: RepairDef = {
  slug: "laptop-screen-replacement",
  art: "screen",
  localPath: "/laptop-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Laptop Screen Replacement",
  eyebrow: "Laptop screen",
    seoTitle: "Laptop Screen Replacement Calgary | Free Quote",
  seoDescription:
        "Laptop screen replacement at TechBrotherz in Calgary, part and labour included. Cracked, black and flickering panels, 60-day warranty, walk in.",
  serviceType: "Laptop screen replacement",
  parentService: "/services/laptop-repair",
  source: { kind: "flat", flatSlug: "laptop-screen-replacement" },
  siblings: ["/repairs/laptop-keyboard-replacement", "/repairs/laptop-charging-port-repair"],
  minutes: 60,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces laptop screens. Unlike a phone, a laptop panel is not bonded to a touch layer, which makes the replacement itself a clean job.`,
  answer: (c) =>
    `Laptop screen replacement at TechBrotherz in Calgary is quoted once the panel your machine takes has been identified, because size, resolution and touch capability all change the part. Most laptop screens are replaced the same day, and every repair carries a ${c.warrantyDays}-day warranty on the part and the workmanship.`,
  symptoms: [
    "Cracked glass or a visible impact mark, usually with spreading dark ink-like patches.",
    "The screen stays black while the machine clearly boots, with fans running and lights on.",
    "Flickering, or a picture that comes and goes when the lid is moved.",
    "Coloured vertical lines, or a band of distortion down one side.",
    "A dim picture only visible at an angle in bright light, which usually means the backlight.",
  ],
  steps: [
    {
      title: "The panel is identified from the machine",
      body: "Laptop panels vary by size, resolution, connector and whether they are touch. The model number on the underside identifies the exact part, which is what makes a firm price possible.",
    },
    {
      title: "An external monitor rules out the graphics",
      body: "If a second screen shows a perfect picture, the panel is the fault. If the external display is also wrong, the problem is the graphics hardware and a new panel would fix nothing.",
    },
    {
      title: "The bezel is removed and the panel unclipped",
      body: "The plastic surround comes off, the panel is unscrewed from its brackets and tilted forward, and the video cable is released from the back.",
    },
    {
      title: "The new panel is fitted and tested before closing",
      body: "The panel is connected and the machine booted while it is still open, because finding a bad connection now is far easier than after the bezel is back on.",
    },
    {
      title: "The lid is reassembled and checked",
      body: "The bezel clips back on, and the hinge is checked through its full range so the picture does not flicker when the lid moves.",
    },
  ],
  sections: () => [
    {
      heading: "Is it the screen or the graphics?",
      paragraphs: [
        "This is the check worth doing before paying for a panel, and it costs nothing. Plug the laptop into an external monitor or a television with an HDMI cable and see what appears. If the external display shows a perfect picture, the machine, the graphics and the operating system are all fine and the panel is the fault.",
        "If the external display shows the same distortion, lines or blackness, the problem is not the panel at all. It is the graphics hardware or the connection to it, and replacing the screen would change nothing. That is an expensive mistake to make, and it is avoidable in two minutes.",
        "There is a third case worth knowing. If the picture flickers or cuts out when the lid is moved through its range, the video cable running through the hinge is the likely fault rather than the panel itself, and that is a different and usually cheaper part.",
      ],
    },
    {
      heading: "What decides the price of a laptop screen?",
      paragraphs: [
        `Where a specific machine lands depends entirely on the panel it takes. Four things drive that: the physical size, the resolution, whether the panel is touch-enabled, and in some cases the refresh rate and colour specification on machines built for gaming or design work.`,
        "A standard HD panel in a mainstream 15-inch laptop is the common case and sits at the bottom of the range. A high-resolution panel, a touch panel, or a high-refresh gaming panel costs substantially more, because those are more expensive parts to buy rather than more expensive work to fit.",
        "The labour is broadly the same across all of them, which is why the model number matters so much for a firm quote. Bring the laptop or the number from the sticker underneath and the price stops being an estimate.",
      ],
    },
    {
      heading: "Why is a laptop screen easier to replace than a phone screen?",
      paragraphs: [
        "A laptop panel is a single component that is not bonded to anything else. It sits in the lid held by brackets and screws, connected by one video cable, with a plastic bezel clipped over the front. The bezel comes off, the panel unscrews, the cable unplugs, and a new one goes in the same way.",
        "There is no adhesive to heat and cut, no digitiser laminated to the front, and no sensor assembly that has to be transferred across. On a non-touch laptop, which is most of them, there is no touch layer involved at all.",
        "That is why the price is dominated by the part rather than the labour, which is the reverse of a repair like iPhone back glass. The work is straightforward. What varies is what the panel costs.",
      ],
    },
    {
      heading: "Is it worth replacing a screen on an older laptop?",
      paragraphs: [
        "Usually yes, when the rest of the machine is sound. A broken panel on a laptop whose processor, memory and storage all still work is a single failed component, and replacing it returns a fully working computer for a fraction of what a replacement machine costs.",
        "One thing changes that calculation now. Microsoft ended support for Windows 10 on 14 October 2025, and a machine that cannot meet the Windows 11 hardware requirements keeps working but stops receiving security updates. That is worth knowing before spending on a screen, and we check it when the machine comes in.",
        "The other case for pausing is a machine with more than one thing wrong. A cracked screen alongside a failing drive and a dead battery is three repairs, and at that point the total is worth weighing honestly against a replacement rather than paid for one piece at a time.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Touch-enabled laptops",
      note: "The digitiser is bonded to the panel on most touch laptops, so the assembly replaces as one part and costs considerably more than a plain panel.",
    },
    {
      model: "Gaming and creator laptops",
      note: "High refresh rate and wide colour gamut panels are more expensive parts. The labour is unchanged, but the quote will be higher.",
    },
    {
      model: "Ultrabooks with bonded glass lids",
      note: "A few thin-and-light designs bond the panel to a glass lid, which makes the repair closer to a tablet screen than a standard laptop panel.",
    },
  ],
  notWorthIt: [
    "When an external monitor shows the same fault, since the graphics hardware is the problem rather than the panel.",
    "When the machine also needs a drive and a battery, because the total starts approaching a replacement.",
    "When the picture only fails as the lid moves, which points at the hinge cable rather than the screen.",
  ],
  comparison: {
    caption: "What changes the price of a laptop screen replacement",
    columns: ["Panel type", "Why it costs what it does", "Typical machine"],
    rows: [
      [
        "Standard HD, non-touch",
        "The most widely produced panel type, and the bottom of our price range",
        "Mainstream 15-inch home and office laptops",
      ],
      [
        "Full HD or higher, non-touch",
        "A more expensive panel to buy, with identical labour to fit",
        "Business laptops and mid-range ultrabooks",
      ],
      [
        "Touch-enabled",
        "The digitiser is bonded to the panel, so both replace as one assembly",
        "Convertibles and two-in-one laptops",
      ],
      [
        "High refresh or wide gamut",
        "A specialist panel with a higher part cost, unchanged labour",
        "Gaming and creator laptops",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much does laptop screen replacement cost in Calgary?",
      answer: `Laptop screen replacement at TechBrotherz in Calgary is quoted once the panel has been identified, free of charge, before any work starts. Size, resolution and whether the panel is touch-enabled all change the part, while the labour stays broadly the same whichever panel the machine takes.`,
    },
    {
      question: "How do I know if my laptop screen or graphics card is broken?",
      answer:
        "Plug the laptop into an external monitor or television. If the external display shows a perfect picture, the panel is at fault and replacing it will fix the machine. If the external display shows the same problem, the graphics hardware is the cause and a new screen would change nothing.",
    },
    {
      question: "My laptop picture flickers when I move the lid. Is that the screen?",
      answer:
        "Probably not. A picture that cuts out or flickers as the lid moves through its range usually means the video cable running through the hinge has worn, not that the panel has failed. That is a different and generally cheaper part, and TechBrotherz checks the hinge range as part of the diagnosis.",
    },
    {
      question: "Is it worth replacing the screen on an old laptop?",
      answer:
        "Usually, when the rest of the machine is sound, because a broken panel is one failed component on an otherwise working computer. Since Microsoft ended Windows 10 support on 14 October 2025, TechBrotherz also checks whether the machine meets the Windows 11 requirements, because that affects whether it is worth spending on.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

const laptopKeyboard: RepairDef = {
  slug: "laptop-keyboard-replacement",
  art: "keyboard",
  localPath: "/laptop-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Laptop Keyboard Replacement",
  eyebrow: "Laptop keyboard",
    seoTitle: "Laptop Keyboard Replacement Calgary | Free Quote",
  seoDescription:
        "Laptop keyboard replacement at TechBrotherz in Calgary, part and labour included. Spills, dead keys and worn keyboards, 60-day warranty.",
  serviceType: "Laptop keyboard replacement",
  parentService: "/services/laptop-repair",
  source: { kind: "flat", flatSlug: "laptop-keyboard-replacement" },
  siblings: ["/repairs/laptop-screen-replacement", "/repairs/laptop-charging-port-repair"],
  minutes: 45,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces laptop keyboards. What the job comes to reflects how the machine is built rather than how bad the keyboard is: some lift out after a few screws, and others are riveted into the palm rest.`,
  answer: () =>
    `Laptop keyboard replacement at TechBrotherz in Calgary is quoted after we have seen how the keyboard is fitted, because that is what the job turns on. On some laptops the keyboard lifts out from the top after a handful of screws, and on others it is riveted into the upper case, which means replacing the whole palm rest assembly. Most keyboard work is finished the same day.`,
  symptoms: [
    "Keys that do not register, or need pressing hard before they respond.",
    "Keys that repeat characters on their own, or type continuously without being touched.",
    "A drink spilled on the keyboard, whether or not it seems to be working now.",
    "Keycaps missing, or a key that has come off and will not clip back on.",
    "Backlighting that has stopped working across the whole keyboard or in one section.",
  ],
  steps: [
    {
      title: "The fault is confirmed with an external keyboard",
      body: "Plugging in a USB keyboard separates a failed keyboard from a driver or operating system problem in about a minute.",
    },
    {
      title: "The construction is identified",
      body: "Some keyboards come out from the top after removing screws from underneath. Others are riveted into the upper case, which changes the part and the price.",
    },
    {
      title: "The machine is opened and the keyboard released",
      body: "On top-mounted designs the keyboard lifts away and its ribbon cable unplugs. On riveted designs the whole palm rest assembly comes out.",
    },
    {
      title: "The new keyboard is fitted and connected",
      body: "The ribbon cable is seated properly in its retaining clip, which is the step that decides whether every key works or one row does not.",
    },
    {
      title: "Every key is tested individually",
      body: "The whole keyboard is checked key by key, along with the backlight and the trackpad, before the machine goes back.",
    },
  ],
  sections: () => [
    {
      heading: "What should you do about a spill on a laptop keyboard?",
      paragraphs: [
        "Shut the laptop down immediately, do not wait for it to shut down cleanly, and hold the power button until it turns off. Unplug the charger and, if the battery is removable, take it out. Then turn the machine upside down so the liquid drains away from the board rather than into it.",
        "Do not turn it back on to check whether it still works. Power and liquid together is what destroys components, and a laptop that survived the spill can be killed by being switched on to test it. Bring it in rather than leaving it to dry out and trying again in the morning.",
        "Sugary drinks are worse than water, because the sugar stays behind after the liquid evaporates and keeps conducting between contacts. Coffee, juice and pop all fall into that category, and they need cleaning rather than drying.",
      ],
    },
    {
      heading: "Why do keyboard prices vary so much between laptops?",
      paragraphs: [
        `The spread on laptop keyboards is about construction rather than quality. On many business laptops the keyboard is a serviceable module: remove a few screws from underneath, and it lifts out from the top with one ribbon cable. That is a quick job with an inexpensive part.`,
        "On many consumer and thin-and-light machines the keyboard is riveted into the upper case at the factory. It is not designed to be removed at all, so the replacement part is the whole palm rest assembly, complete with the keyboard already fitted, and the machine has to be substantially dismantled to change it.",
        "Neither approach is better to type on. It is purely a manufacturing decision that shows up as a price difference years later at repair time. We identify which one your machine is before quoting.",
      ],
    },
    {
      heading: "Can a single key be fixed instead of the whole keyboard?",
      paragraphs: [
        "Sometimes, and it is worth asking before paying for a keyboard. A keycap that has popped off usually clips back on if the small plastic scissor mechanism underneath is intact, and that is a two-minute job at the counter rather than a repair.",
        "If the scissor mechanism itself has broken, individual replacements are available for some models and not for others. If the key does not respond at all even when pressed directly on the rubber dome underneath, the fault is in the membrane layer, and that is not repairable on its own.",
        "Bring the laptop in and we will tell you which of the three you have. It costs nothing to look, and the answer is sometimes that you do not need a repair at all.",
      ],
    },
    {
      heading: "Is a replacement keyboard or an external one the better answer?",
      paragraphs: [
        "For a desktop-replacement laptop that lives permanently on a desk, an external USB keyboard is a perfectly reasonable answer and costs less than a repair. If the machine never moves, there is no strong argument for replacing the built-in keyboard, and we will say so rather than sell you the repair.",
        "For a laptop that actually gets carried, the built-in keyboard is the point of the machine, and an external one is not a substitute. That is the case where replacement is worth doing.",
        "One caveat matters. If the keyboard failed because of a spill rather than wear, the liquid may have reached beyond the keyboard, and using an external keyboard leaves that unaddressed. A spill should be looked at properly whether or not you intend to replace the keyboard.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Business laptops",
      note: "Frequently designed with a serviceable keyboard module that lifts out from the top, which puts them at the lower end of the price range.",
    },
    {
      model: "Thin-and-light consumer laptops",
      note: "Usually riveted into the upper case, so the part is a whole palm rest assembly and the machine has to be substantially dismantled.",
    },
    {
      model: "Backlit keyboards",
      note: "The backlight layer is part of the keyboard assembly, so a backlight failure means the same replacement as a key failure.",
    },
  ],
  notWorthIt: [
    "When a single keycap has popped off and the mechanism underneath is intact, since that clips back on.",
    "When the laptop lives permanently on a desk and an external keyboard does the job.",
    "When a spill has reached the board, because the keyboard is then the smaller of two problems.",
  ],
  comparison: {
    caption: "What decides where a laptop keyboard falls in the price range",
    columns: ["Construction", "What the repair involves", "Where it lands"],
    rows: [
      [
        "Serviceable keyboard module",
        "A few screws from underneath, the keyboard lifts out from the top, one ribbon cable",
        "The lower end of the range",
      ],
      [
        "Riveted into the upper case",
        "The whole palm rest assembly is the part, and the machine is substantially dismantled",
        "The upper end of the range",
      ],
      [
        "Backlit keyboard",
        "The backlight layer is part of the assembly, so the repair is the same either way",
        "Set by the construction above",
      ],
      [
        "Single keycap off",
        "The cap clips back onto an intact scissor mechanism at the counter",
        "Often nothing to pay",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much does laptop keyboard replacement cost in Calgary?",
      answer: `Laptop keyboard replacement at TechBrotherz in Calgary is quoted once we have seen how the keyboard is fitted, free of charge, before any work starts. A serviceable keyboard module that lifts out from the top is the smaller job. A keyboard riveted into the upper case means replacing the whole palm rest assembly, which is the larger one.`,
    },
    {
      question: "What should I do if I spill a drink on my laptop?",
      answer:
        "Hold the power button until the laptop turns off immediately, unplug the charger, remove the battery if it is removable, and turn the machine upside down so liquid drains away from the board. Do not switch it back on to test it. Power and liquid together is what destroys components. Bring it to TechBrotherz rather than drying it out.",
    },
    {
      question: "Can one broken key be replaced instead of the whole keyboard?",
      answer:
        "Sometimes. A keycap that has popped off clips back on if the scissor mechanism underneath is intact, which is a counter job rather than a repair. If the mechanism is broken, individual replacements exist for some models. If the key does not respond when pressed directly on the rubber dome, the membrane has failed and the keyboard needs replacing.",
    },
    {
      question: "Should I just use an external keyboard instead?",
      answer:
        "For a laptop that lives permanently on a desk, an external USB keyboard is a reasonable and cheaper answer, and TechBrotherz will say so. For a laptop that gets carried, the built-in keyboard is worth replacing. If the failure came from a spill, have the machine looked at regardless, because liquid may have reached beyond the keyboard.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

const laptopPort: RepairDef = {
  slug: "laptop-charging-port-repair",
  art: "port",
  localPath: "/laptop-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Laptop Charging Port Repair",
  eyebrow: "Laptop charging port",
    seoTitle: "Laptop Charging Port Repair Calgary | Free Quote",
  seoDescription:
        "Laptop DC charging socket replacement at TechBrotherz in Calgary, part and labour included. Loose sockets and laptops that will not charge, 60-day warranty.",
  serviceType: "Laptop charging port repair",
  parentService: "/services/laptop-repair",
  source: { kind: "flat", flatSlug: "dc-charging-port-replacement" },
  siblings: ["/repairs/laptop-screen-replacement", "/repairs/laptop-keyboard-replacement"],
  minutes: 90,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, replaces laptop DC charging sockets. Bring the charger with the machine, because a failed adapter produces exactly the same symptoms and costs nothing to rule out.`,
  answer: () =>
    `Laptop charging socket replacement at TechBrotherz in Calgary is quoted free of charge before any work starts. A socket that has worked loose shows as a charging light that flickers when the plug is moved, or a laptop that only charges at a particular cable angle. The repair is soldered work on most machines, so it takes longer than a phone charging port.`,
  symptoms: [
    "The charging light flickers or cuts out when the plug is moved or the cable is nudged.",
    "The laptop only charges when the cable is held at a specific angle.",
    "The plug feels loose in the socket, or wobbles where it used to sit firmly.",
    "The machine reports plugged in, not charging, intermittently rather than constantly.",
    "The socket area is discoloured, scorched or noticeably warm during charging.",
  ],
  steps: [
    {
      title: "The charger is tested first",
      body: "Adapters fail more often than sockets, usually where the cable enters the brick. Testing with a known-good charger is the difference between an answer that costs nothing and an unnecessary repair.",
    },
    {
      title: "The socket is checked for movement",
      body: "A socket that moves independently of the case has broken free of its mounting or its solder joints, which is the classic failure.",
    },
    {
      title: "The machine is dismantled to the board",
      body: "The DC socket usually sits on or near the mainboard, so the laptop comes apart properly. This is the bulk of the time in the repair.",
    },
    {
      title: "The socket is replaced",
      body: "On machines where the socket is on a short cable to the board it unplugs and replaces. Where it is soldered to the board directly, the old one is desoldered and a new one fitted.",
    },
    {
      title: "Charging is tested under load before reassembly",
      body: "The machine is charged and run with the battery drawing power before it is closed up, because a cold solder joint shows under load rather than at rest.",
    },
  ],
  sections: () => [
    {
      heading: "Is it the charger, the socket or the battery?",
      paragraphs: [
        "These three produce overlapping symptoms and cost very different amounts to fix, so it is worth separating them before paying for anything. The behaviour of the machine tells you most of what you need.",
        "If wiggling the plug makes the charging light flicker, or the laptop only charges at a particular cable angle, that is the socket. If the machine runs perfectly on mains power but dies the instant you unplug it, the socket is fine and the battery has failed. If nothing happens at all on any cable position, the charger itself is the first suspect.",
        "This is why we ask you to bring the charger in with the laptop. Adapters fail regularly, usually at the strain point where the cable enters the brick, and swapping in a known-good one answers the question in two minutes rather than through a paid diagnostic.",
      ],
    },
    {
      heading: "Why does a laptop charging socket work loose?",
      paragraphs: [
        "The DC socket takes mechanical stress every single time the laptop is plugged in, unplugged, or moved while charging, and it is often soldered directly to a board rather than mounted to the case. Every cable tug transfers force through those solder joints.",
        "Over years, the joints develop hairline cracks. The connection still works when everything sits perfectly still, and fails when the cable moves, which is exactly the flickering intermittent behaviour people describe. Left long enough, the socket breaks free of the board entirely.",
        "The most common accelerator is charging on a bed or sofa with the cable under tension, and tripping over a charging cable does years of damage in one moment. A laptop that charges on a desk with slack in the cable rarely develops this.",
      ],
    },
    {
      heading: "Why does this repair take longer than a phone charging port?",
      paragraphs: [
        "A laptop DC socket is usually soldered to the mainboard rather than sitting on a replaceable module, and reaching the mainboard means dismantling the machine substantially: the bottom cover, the battery, the storage, often the cooling assembly, and sometimes the board itself has to come out.",
        "The soldering is skilled work but not the slow part. Getting to the board and putting the machine back together correctly afterwards is where the time goes, and that is why this is priced and scheduled as a longer repair.",
        `Laptop charging socket replacement is usually a same-day drop-off rather than a wait at the counter, because the machine has to come substantially apart to reach the socket.`,
      ],
    },
    {
      heading: "What happens if a loose charging socket is left alone?",
      paragraphs: [
        "It gets worse, and occasionally it gets worse in a way that costs considerably more than the repair. A socket with cracked solder joints has intermittent contact, and intermittent contact under current generates heat at the joint. That is why a socket area that has become discoloured or noticeably warm is worth acting on rather than living with.",
        "In the ordinary case the outcome is simply a laptop that stops charging entirely, at which point the same repair is needed anyway. In the worse case the heat damages the pads on the board that the socket connects to, and repairing that is a different and more difficult job.",
        "If the socket area is scorched, warm during charging, or the machine has started shutting down while plugged in, bring it in promptly rather than waiting for it to fail completely.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Machines with a socket on a pigtail cable",
      note: "Some laptops mount the socket on a short cable that plugs into the board. On these the repair is a module swap rather than soldering, which makes it quicker.",
    },
    {
      model: "USB-C charging laptops",
      note: "Where charging goes through a USB-C port on the mainboard, replacing it is board-level work and is assessed case by case rather than quoted at the flat price.",
    },
    {
      model: "Machines with a scorched socket",
      note: "Discolouration means heat has already been generated at a failing joint, and the board pads underneath need checking as part of the repair.",
    },
  ],
  notWorthIt: [
    "When a known-good charger fixes it, since the adapter was the fault rather than the socket.",
    "When the machine runs on mains but dies when unplugged, which is the battery rather than the socket.",
    "When charging is through USB-C on the mainboard, because that is board-level work assessed separately.",
  ],
  comparison: {
    caption: "Telling a charger, a socket and a battery fault apart",
    columns: ["What the laptop does", "Most likely cause", "What it costs to check"],
    rows: [
      [
        "Charging light flickers when the plug is moved",
        "The DC socket has worked loose from its solder joints",
        "Nothing, we check it at the counter",
      ],
      [
        "Runs on mains, dies the moment it is unplugged",
        "The battery has failed, the socket is fine",
        "Nothing, the behaviour is diagnostic on its own",
      ],
      [
        "Nothing at all on any cable position",
        "The charger itself, tested first with a known-good adapter",
        "Nothing, bring the charger in with the laptop",
      ],
      [
        "Socket area warm, discoloured or scorched",
        "A failing joint generating heat, needs prompt attention",
        "Nothing to look, and worth doing sooner",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much does laptop charging port repair cost in Calgary?",
      answer: `Laptop DC charging socket replacement at TechBrotherz in Calgary is quoted free of charge before any work starts. The socket is soldered to the mainboard on most machines, so the laptop has to be substantially dismantled to reach it, which is why it is a longer repair than a phone charging port.`,
    },
    {
      question: "How do I know if it is the laptop charger or the charging port?",
      answer:
        "If the charging light flickers when the plug is moved, or the laptop only charges at a particular cable angle, the socket has worked loose. If nothing happens at all on any cable position, the charger is the first suspect. Bring the charger with the laptop to TechBrotherz and a known-good adapter answers it in two minutes.",
    },
    {
      question: "Why do laptop charging sockets work loose?",
      answer:
        "The socket takes mechanical stress every time the laptop is plugged in, unplugged or moved while charging, and it is usually soldered directly to a board. Over years the solder joints develop hairline cracks, so the connection works when still and fails when the cable moves. Charging with the cable under tension accelerates it.",
    },
    {
      question: "Is a loose laptop charging socket dangerous to leave?",
      answer:
        "It is worth acting on. Intermittent contact under current generates heat at the failing joint, which is why a socket area that has become warm or discoloured should be brought in promptly. In the worse case that heat damages the board pads underneath, which is a harder and more expensive repair than replacing the socket.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

/* ================================================================ computer */

const windowsInstallation: RepairDef = {
  slug: "windows-installation",
  art: "diagnostic",
  localPath: "/computer-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Windows Installation",
  eyebrow: "Windows installation",
    seoTitle: "Windows Installation Calgary | With Office Included",
  seoDescription:
        "Windows installed clean at TechBrotherz in Calgary, including an office suite and security software. One flat figure, agreed before work starts.",
  serviceType: "Windows installation",
  parentService: "/services/computer-repair",
  source: { kind: "flat", flatSlug: "windows-installation" },
  siblings: ["/repairs/computer-tune-up", "/repairs/computer-diagnostics"],
  minutes: 120,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, installs Windows clean, including an office suite and security software set up and running. It is quoted as one flat figure for the whole job, not as an hourly rate.`,
  answer: () =>
    `A Windows installation at TechBrotherz in Calgary includes the operating system installed clean, an office suite, and security software configured and running. It is quoted as one flat figure agreed before work starts. A clean install replaces what is on the drive, so back your files up first and tell TechBrotherz what you need kept.`,
  symptoms: [
    "The computer has become unstable, crashing or restarting without a clear cause.",
    "An infection has been removed but the machine still does not behave normally.",
    "Years of accumulated software have made the system slow in a way cleaning has not fixed.",
    "The machine is being handed to someone else and needs to start fresh.",
    "Windows will not boot, and repair options have already been tried without success.",
  ],
  steps: [
    {
      title: "We confirm what needs keeping",
      body: "A clean install replaces what is on the drive. We ask what is on the machine and what you need before anything begins, and we ask twice rather than assume.",
    },
    {
      title: "Files are copied off if you want them kept",
      body: "Documents, photos and other data can be copied off before the install and put back afterwards. Tell us at the counter so it is part of the job.",
    },
    {
      title: "Windows is installed clean",
      body: "Not a repair install over the top of the old one. The drive is prepared and the operating system goes on fresh, which is what makes the machine behave like new.",
    },
    {
      title: "Drivers, office and security go on",
      body: "The hardware drivers the machine needs, an office suite and security software are all installed and configured so the computer is ready to use rather than ready to set up.",
    },
    {
      title: "The machine is updated and tested",
      body: "Updates are brought current and the computer is used rather than just booted once, so anything missing shows up here rather than at home.",
    },
  ],
  sections: () => [
    {
      heading: "When is a clean Windows installation the right answer?",
      paragraphs: [
        "There are four situations where it is clearly the right call. A machine that has become unstable in ways that resist diagnosis. A machine that has had an infection removed but still does not behave properly. A machine carrying years of accumulated software that cleaning has not fixed. And a machine being passed to somebody else.",
        "In each of those the common thread is that the problem is the accumulated state of the system rather than a specific fault you can point at. A clean install resets that completely, and it does so on hardware you already own, which is why it costs a fraction of a replacement machine.",
        `A Windows installation at TechBrotherz is quoted as one flat figure for the whole job. A machine that takes longer than expected does not come to more, which is the point of quoting the job rather than the hour.`,
      ],
    },
    {
      heading: "What happens to your files during a Windows installation?",
      paragraphs: [
        "A clean installation replaces what is on the drive. That is what makes it effective, and it is also why we ask before doing it rather than after. Tell us at the counter if there is anything on the machine you need, and copying your documents and photos off and putting them back afterwards becomes part of the job.",
        "If your files matter and the problem is a forgotten password rather than a broken system, a clean install is the wrong repair entirely. A password reset restores access and leaves everything in place, which is a different service at a different price.",
        "We will always confirm what is on the machine before starting. This is the one repair where getting it wrong is not recoverable, so we ask twice and would rather be tedious about it than assume.",
      ],
    },
    {
      heading: "Which version of Windows gets installed?",
      paragraphs: [
        "Whichever version your machine is licensed for and capable of running, and that is a real question now rather than a formality. Microsoft ended support for Windows 10 on 14 October 2025, so a machine that can run Windows 11 should be on it.",
        "Windows 11 has stricter hardware requirements than any previous version, particularly around the processor generation and the security chip on the board. A number of computers that are perfectly fast enough do not qualify, which is unusual and catches people out regularly.",
        "We check this before installing anything and tell you plainly where your machine stands. If it cannot run Windows 11, we will say so and explain what that means for security updates, rather than installing an unsupported system and leaving you to find out.",
      ],
    },
    {
      heading: "What is included beyond the operating system?",
      paragraphs: [
        `That one figure covers the operating system installed clean, the hardware drivers the machine needs, an office suite, and security software installed and configured. The intention is that the computer comes back ready to use rather than ready to spend an evening setting up.`,
        "Drivers matter more than people expect. A Windows installation without the right drivers gives you a machine where the wireless does not work, the display is at the wrong resolution and the sound is missing. Getting them right is part of the job, not an extra.",
        "If you want specific programs installed beyond that, those are priced separately per program, and it is worth mentioning at the counter so the total is agreed up front rather than added afterwards.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Machines that cannot run Windows 11",
      note: "We will tell you before installing. A machine on an unsupported version keeps working but stops receiving security updates, and that should be a decision rather than a surprise.",
    },
    {
      model: "Machines with a mechanical hard drive",
      note: "A clean install on a mechanical drive is still a slow machine afterwards. This is the moment when fitting a solid-state drive makes the most difference.",
    },
    {
      model: "Machines with BitLocker enabled",
      note: "If the drive is encrypted and the recovery key is lost, the data cannot be copied off before the install by anyone.",
    },
  ],
  notWorthIt: [
    "When the problem is a forgotten password, because a password reset keeps your files and costs less.",
    "When a virus removal would fix it, since removal keeps everything on the machine in place.",
    "When the drive itself is failing, because a fresh install onto a dying drive solves nothing.",
  ],
  comparison: {
    caption: "Windows installation compared with the other options for a misbehaving computer",
    columns: ["Service", "What happens to your files", "When it is the right choice"],
    rows: [
      [
        "Windows installation",
        "The drive is replaced with a fresh system, files copied off first if asked",
        "Instability, deep infection, or a machine being handed on",
      ],
      [
        "Clean-up and tune-up",
        "Everything stays exactly where it is",
        "A machine that has become slow rather than broken",
      ],
      [
        "Virus removal",
        "Your documents and photos stay, the malware goes",
        "Pop-ups, hijacked browsers and adware",
      ],
      [
        "Password reset",
        "Everything stays, access is restored",
        "Locked out of the machine, with files that matter",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much does a Windows installation cost in Calgary?",
      answer: `A Windows installation at TechBrotherz in Calgary is quoted as one flat figure, including the operating system installed clean, the hardware drivers, an office suite and security software configured and running. A job that takes longer than expected does not come to more.`,
    },
    {
      question: "Will a Windows installation delete my files?",
      answer:
        "A clean install replaces what is on the drive, which is what makes it effective. Tell TechBrotherz at the counter what you need kept and copying your documents and photos off and restoring them afterwards becomes part of the job. If the real problem is a forgotten password, a password reset keeps everything in place instead.",
    },
    {
      question: "Will TechBrotherz install Windows 11 or Windows 10?",
      answer:
        "Whichever version the machine is licensed for and capable of running. Microsoft ended Windows 10 support on 14 October 2025, so a capable machine should be on Windows 11. Windows 11 has strict processor and security chip requirements, and TechBrotherz checks and tells you plainly where your computer stands before installing anything.",
    },
    {
      question: "Do I need a Windows installation or just a tune-up?",
      answer:
        "A tune-up is the right answer for a computer that has become slow, because it keeps everything in place. A clean installation is for a machine that has become unstable, has had a deep infection, or is being handed to someone else. TechBrotherz will tell you which one your computer actually needs.",
    },
  ],
  globalCategories: ["turnaround", "data"],
};

const computerTuneUp: RepairDef = {
  slug: "computer-tune-up",
  art: "diagnostic",
  localPath: "/computer-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Computer Clean-Up and Tune-Up",
  eyebrow: "Tune-up",
    seoTitle: "Computer Tune-Up Calgary | One Flat Figure",
  seoDescription:
        "Computer clean-up and tune-up at TechBrotherz in Calgary. Startup list, temporary files, updates, physical cooling clean and a storage health check.",
  serviceType: "Computer tune-up",
  parentService: "/services/computer-repair",
  source: { kind: "flat", flatSlug: "tune-up" },
  siblings: ["/repairs/windows-installation", "/repairs/computer-diagnostics"],
  minutes: 120,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, cleans up and tunes computers. A computer that has become slow almost never has one dramatic fault. It usually has four ordinary ones stacked on top of each other.`,
  answer: () =>
    `A clean-up and tune-up at TechBrotherz in Calgary covers cutting the startup list back, clearing temporary files, bringing updates current, physically cleaning the cooling so the processor stops throttling, and checking the storage for early signs of failure. Everything on the machine stays exactly where it is, and the job is quoted as one flat figure.`,
  symptoms: [
    "The computer takes minutes to become usable after switching on.",
    "The fan runs loudly and constantly, even when nothing much is open.",
    "Programs take noticeably longer to open than they did a year ago.",
    "The machine feels fine at first and slows down the longer it is on.",
    "The drive is nearly full and Windows has started warning about space.",
  ],
  steps: [
    {
      title: "The startup list is cut back",
      body: "Programs that added themselves to startup over years all load at boot and stay in memory. Most of them do not need to be there.",
    },
    {
      title: "Temporary files and leftovers are cleared",
      body: "Old installers, update caches and temporary files accumulate into a significant amount of space that does nothing useful.",
    },
    {
      title: "Updates are brought current",
      body: "A machine that has fallen months behind on updates is both slower and less secure, and catching up is part of the job.",
    },
    {
      title: "The cooling is physically cleaned",
      body: "Dust blocks the heatsink and the processor throttles itself to stay cool. This is the step software cleaning cannot do and the one that most often surprises people.",
    },
    {
      title: "The storage is checked for early failure",
      body: "Drive health reporting shows the warning signs that appear long before a drive dies, which turns a future disaster into a planned replacement.",
    },
  ],
  sections: () => [
    {
      heading: "Why do computers get slower over time?",
      paragraphs: [
        "Four causes account for almost all of it, and they compound. Programs installed over years add themselves to startup, so more loads at boot and stays resident. Temporary files, old installers and update caches accumulate until the drive is close to full, and a nearly full drive slows down further. Updates fall behind. And dust blocks the cooling.",
        "None of those is dramatic on its own. Together they turn a machine that started in twenty seconds into one that takes three minutes, and because it happened gradually people assume the computer has simply aged rather than that four fixable things have stacked up.",
        `A clean-up and tune-up at TechBrotherz addresses all four, which is why a machine that felt finished often comes back usable.`,
      ],
    },
    {
      heading: "Why does dust make a computer slow rather than just hot?",
      paragraphs: [
        "This is the part people find least intuitive, and it is often the biggest single factor. Modern processors monitor their own temperature and deliberately reduce their speed when they get too hot, to protect themselves. That is thermal throttling, and it is designed behaviour rather than a fault.",
        "Dust packed into a heatsink stops heat leaving, so the processor reaches its limit sooner and throttles harder. The symptom is a computer that feels fine for the first few minutes and then slows down, along with a fan running constantly and loudly because it is trying to compensate.",
        "No amount of software cleaning touches this. It needs the machine opened and the heatsink and fans physically cleared, which is included in a tune-up and is the reason a tune-up is not something you can replicate by running a utility.",
      ],
    },
    {
      heading: "What does a tune-up not fix?",
      paragraphs: [
        "A tune-up does not turn a mechanical hard drive into a fast one. If the diagnostic shows the drive is what is holding the machine back, no amount of cleaning changes that, and fitting a solid-state drive is the upgrade that actually solves it. We will tell you when that is the real answer.",
        "It also does not fix a machine that is unstable rather than slow. Crashes, restarts and Windows failing to boot are different problems, and a clean installation is usually the honest answer to those.",
        "And it does not remove a serious infection. Virus removal is its own service with its own tools and process. If a machine is slow because something is running that should not be, that is what it needs, and we will say so rather than charging for a tune-up that leaves the cause in place.",
      ],
    },
    {
      heading: "How often is a tune-up worth having?",
      paragraphs: [
        "For most home computers, roughly once a year is sensible, and the physical cleaning is the part that genuinely benefits from that rhythm. Dust accumulates continuously, and a machine that sits on a carpet or in a home with pets fills up faster than one on a desk in a clean room.",
        "The software side depends more on how the machine is used. A computer where new programs get installed regularly collects startup entries faster than one used for the same few things every day. If your computer does the same job it did last year and still feels slower, that is the signal.",
        "Between visits, the single most useful habit is watching what you agree to during software installations, because most startup clutter arrives as an optional extra that was ticked by default.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Desktop towers",
      note: "These accumulate the most dust and benefit the most from physical cleaning, because they draw air continuously through a large case.",
    },
    {
      model: "Laptops on soft surfaces",
      note: "A laptop used on a bed or sofa blocks its own intake vents, which fills the heatsink faster than desk use does.",
    },
    {
      model: "Machines still on a mechanical hard drive",
      note: "A tune-up helps, and a solid-state drive helps far more. We will tell you when the drive is the real limit rather than the clutter.",
    },
  ],
  notWorthIt: [
    "When the machine is unstable rather than slow, since that needs a clean install instead.",
    "When something is running that should not be, because virus removal addresses the cause.",
    "When a mechanical hard drive is the bottleneck, as fitting a solid-state drive is the real fix.",
  ],
  comparison: {
    caption: "What a tune-up addresses, and what it does not",
    columns: ["Cause of slowness", "Fixed by a tune-up", "What it needs instead"],
    rows: [
      [
        "A long startup list and accumulated clutter",
        "Yes, this is the core of the job",
        "Nothing further",
      ],
      [
        "Dust blocking the cooling, causing throttling",
        "Yes, the machine is opened and cleaned physically",
        "Nothing further",
      ],
      [
        "A mechanical hard drive as the bottleneck",
        "Partly, the machine improves but stays limited",
        "A solid-state drive fitted",
      ],
      ["An active malware infection", "No, cleaning leaves the cause in place", "Virus removal"],
      [
        "Instability, crashes or a system that will not boot",
        "No, this is a different problem",
        "A clean Windows installation",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much does a computer tune-up cost in Calgary?",
      answer: `A clean-up and tune-up at TechBrotherz in Calgary is quoted as one flat figure. It covers cutting the startup list back, clearing temporary files, bringing updates current, physically cleaning the cooling, and checking the storage for early signs of failure. Everything on the machine stays where it is.`,
    },
    {
      question: "Why does dust make my computer slow instead of just hot?",
      answer:
        "Processors reduce their own speed when they get too hot, to protect themselves. Dust packed into a heatsink stops heat escaping, so the processor reaches its limit sooner and throttles harder. The symptom is a machine that feels fine for a few minutes then slows, with a constantly loud fan. Software cleaning cannot fix this.",
    },
    {
      question: "Will a tune-up make my old computer fast again?",
      answer:
        "It will make a cluttered computer noticeably better, and it will not turn a mechanical hard drive into a fast one. If the drive is the bottleneck, fitting a solid-state drive is the upgrade that actually solves it. TechBrotherz will tell you which of the two your machine is limited by.",
    },
    {
      question: "How often should a computer be tuned up?",
      answer:
        "About once a year suits most home computers, mainly because dust accumulates continuously. Machines on carpet or in homes with pets fill up faster. The software side depends on use: a computer where new programs are installed regularly collects startup clutter faster than one used for the same few tasks.",
    },
  ],
  globalCategories: ["turnaround", "pricing"],
};

const computerDiagnostics: RepairDef = {
  slug: "computer-diagnostics",
  art: "diagnostic",
  localPath: "/computer-repair-calgary",
  brandSlug: "laptops-desktops",
  h1: "Computer Diagnostics",
  eyebrow: "Diagnostics",
    seoTitle: "Computer Diagnostics Calgary | Off The Repair",
  seoDescription:
        "Computer diagnostics at TechBrotherz in Calgary, deducted from the repair if you go ahead. A specific fault rather than an estimate.",
  serviceType: "Computer diagnostics",
  parentService: "/services/computer-repair",
  source: { kind: "flat", flatSlug: "diagnostics" },
  siblings: ["/repairs/computer-tune-up", "/repairs/windows-installation"],
  minutes: 60,
  lead: () =>
    `TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in Calgary, Alberta, diagnoses computers for a fixed diagnostic fee, and that fee comes off the bill if you go ahead with the repair. It exists because some faults have several possible causes, and guessing between them wastes your money rather than ours.`,
  answer: () =>
    `Computer diagnostics at TechBrotherz in Calgary carry a fixed diagnostic fee, and that fee is deducted from the repair if you proceed. The diagnostic checks power delivery, whether the machine posts, storage health, memory and thermal behaviour, and ends with a specific fault and a specific figure rather than an estimate. If the machine is not worth repairing, TechBrotherz will say so.`,
  symptoms: [
    "The computer will not turn on at all, or turns on and shows nothing.",
    "It restarts or shuts down on its own, without warning or a clear pattern.",
    "A blue screen appears repeatedly, with or without a consistent error code.",
    "The machine is slow in a way that a clean-up has not resolved.",
    "It makes a new noise: clicking, grinding, or a fan that has become loud.",
  ],
  steps: [
    {
      title: "We ask what the machine does and when it started",
      body: "The history narrows the diagnosis more than any test. What changed, what it does now, and whether anything happened just before it started.",
    },
    {
      title: "Power delivery is traced from the adapter to the board",
      body: "A machine that will not turn on is checked from the wall inward, because the cheapest possible cause should be ruled out first.",
    },
    {
      title: "Storage health and memory are tested",
      body: "Drive health reporting and a memory test catch the two components that most often cause crashes, blue screens and unexplained slowness.",
    },
    {
      title: "Thermal behaviour is checked under load",
      body: "The machine is run hard while temperatures are watched, because a computer that shuts down or throttles only when working reveals nothing at idle.",
    },
    {
      title: "You get a specific fault and a specific price",
      body: "The diagnostic ends with what is wrong and what fixing it costs, or with an honest recommendation not to repair it.",
    },
  ],
  sections: () => [
    {
      heading: "Why does a diagnostic cost anything?",
      paragraphs: [
        `The diagnostic fee comes off the repair if you go ahead, which means it costs nothing whenever it leads to work. It is charged when it does not, and that is deliberate: the value in a diagnostic is the answer, and the answer is worth something even when the answer is do not spend money on this machine.`,
        "A shop that diagnoses for nothing has to recover the time elsewhere, and the usual way that happens is a bias towards finding a repair. Charging a small fee that disappears into the repair removes that pressure and means we can tell you a machine is not worth fixing without it costing us anything.",
        "It also means the diagnostic gets done properly rather than quickly. Tracing a fault through power, storage, memory and thermal behaviour takes time, and time that is paid for is time that gets spent.",
      ],
    },
    {
      heading: "Why not just guess at the most likely cause?",
      paragraphs: [
        "Because a computer that will not turn on has at least five plausible causes, and they cost very different amounts. It could be the power adapter, the socket, the battery, the power supply, the board or the storage. Replacing parts in order of likelihood is a strategy that works eventually and is expensive on the way there.",
        "The same applies to a machine that crashes. Failing memory, a dying drive, overheating and a corrupted system all produce crashes that look similar from the outside, and only one of them is fixed by any given repair.",
        "The diagnostic exists to turn a list of possibilities into one answer. At the end of it you know what is wrong and what it costs, which is what lets you make a real decision rather than an expensive guess.",
      ],
    },
    {
      heading: "What does the diagnostic actually cover?",
      paragraphs: [
        "Power delivery is traced from the adapter through to the board, because that is the cheapest possible cause and it should be ruled out before anything else. Whether the machine posts, meaning whether it gets far enough to initialise its own hardware, separates a board problem from an operating system problem.",
        "Storage health is read from the drive's own reporting, which flags the reallocated sectors and error counts that appear long before a drive fails completely. Memory is tested, because failing memory causes crashes that look like software problems and get chased in the wrong place for months.",
        "Thermal behaviour is checked under load rather than at idle, because a machine that throttles or shuts down only when working hard looks perfectly healthy sitting on a bench doing nothing.",
      ],
    },
    {
      heading: "What if the machine is not worth repairing?",
      paragraphs: [
        "We will tell you, and that is a legitimate outcome of a diagnostic rather than a failure of it. You paid a small fee to find out, and knowing not to spend three hundred dollars on a machine that will not last the year is worth more than the fee.",
        "The judgement is usually about the ratio of the repair to the machine's remaining useful life and value. A board fault on an eight-year-old laptop is rarely worth fixing. The same fault on a two-year-old machine usually is. We will show you the arithmetic rather than just the verdict.",
        "Since Microsoft ended Windows 10 support on 14 October 2025, whether a machine can run Windows 11 is now part of that calculation, and it is checked as part of the diagnostic. A computer that cannot be updated keeps working, and it is a different proposition to spend money on.",
      ],
    },
  ],
  modelNotes: [
    {
      model: "Machines that will not power on",
      note: "Bring the charger. A failed adapter produces identical symptoms to a dead machine and is ruled out in minutes rather than through a full diagnostic.",
    },
    {
      model: "Machines with intermittent faults",
      note: "A fault that appears occasionally is harder to catch on a bench. Tell us what triggers it, because that is what makes it reproducible here.",
    },
    {
      model: "Machines making a new noise",
      note: "Clicking or grinding from a mechanical drive is urgent. Stop using the machine and bring it in, because continued use makes data recovery less likely.",
    },
  ],
  notWorthIt: [
    "When the fault is obvious and already identified, since the repair can be quoted directly.",
    "When a known-good charger already fixed a machine that would not power on.",
    "When the machine is old enough that no realistic repair outcome would justify the spend.",
  ],
  comparison: {
    caption: "What a diagnostic separates, and why guessing is expensive",
    columns: ["Symptom", "Possible causes", "What the diagnostic settles"],
    rows: [
      [
        "Will not turn on",
        "Adapter, socket, battery, power supply, board or storage",
        "Which one, by tracing power from the wall inward",
      ],
      [
        "Crashes or blue screens",
        "Failing memory, a dying drive, overheating or a corrupted system",
        "Which one, by testing memory, storage and temperature under load",
      ],
      [
        "Slow despite a clean-up",
        "A mechanical drive at its limit, throttling, or an infection",
        "Which one, by reading drive health and watching temperatures",
      ],
      [
        "New clicking or grinding noise",
        "A failing mechanical drive, or a failing fan bearing",
        "Which one, and whether the data is still recoverable",
      ],
    ],
  },
  faqs: () => [
    {
      question: "How much do computer diagnostics cost in Calgary?",
      answer: `Computer diagnostics at TechBrotherz in Calgary carry a fixed diagnostic fee, and that fee is deducted from the bill if you go ahead with the repair. The diagnostic ends with a specific fault and a specific figure rather than an estimate or a range.`,
    },
    {
      question: "Why does TechBrotherz charge for a diagnostic?",
      answer:
        "Because the answer has value even when it is do not repair this machine. A shop that diagnoses free has to recover that time elsewhere, usually through a bias towards finding a repair. Charging a small fee that disappears into the repair removes that pressure, so TechBrotherz can honestly advise against work.",
    },
    {
      question: "What does a computer diagnostic check?",
      answer:
        "Power delivery from the adapter through to the board, whether the machine posts, storage health from the drive's own reporting, a memory test, and thermal behaviour under load rather than at idle. Those five cover the causes behind machines that will not start, crash, or run slowly without explanation.",
    },
    {
      question: "What happens if my computer is not worth repairing?",
      answer:
        "TechBrotherz will tell you, and show the arithmetic rather than just the verdict. That is a legitimate outcome of a diagnostic. Since Microsoft ended Windows 10 support on 14 October 2025, whether a machine can run Windows 11 forms part of that judgement and is checked during the diagnostic.",
    },
  ],
  globalCategories: ["pricing", "turnaround"],
};

/* -------------------------------------------------------------------- index */

export const REPAIRS: RepairDef[] = [
  iphoneScreen,
  iphoneBattery,
  iphonePort,
  iphoneCamera,
  iphoneBackGlass,
  samsungScreen,
  samsungBattery,
  samsungBackGlass,
  samsungPort,
  ipadScreen,
  laptopScreen,
  laptopKeyboard,
  laptopPort,
  windowsInstallation,
  computerTuneUp,
  computerDiagnostics,
];

const BY_SLUG = new Map(REPAIRS.map((entry) => [entry.slug, entry]));

export function repairContent(slug: string): RepairDef | undefined {
  return BY_SLUG.get(slug);
}

/** Repair pages that belong under a given Tier 2 service. */
export function repairsForService(servicePath: string): RepairDef[] {
  return REPAIRS.filter((entry) => entry.parentService === servicePath);
}

/** Repair pages that apply to one model, given the repairs its catalogue carries. */
export function repairPagesForModel(brandSlug: string, modelRepairSlugs: string[]): RepairDef[] {
  return REPAIRS.filter(
    (entry) =>
      entry.source.kind === "catalogue" &&
      entry.source.brandSlug === brandSlug &&
      entry.source.repairSlugs.some((slug) => modelRepairSlugs.includes(slug)),
  );
}

/** Every repair page that belongs to a brand hub. */
export function repairPagesForBrand(brandSlug: string): RepairDef[] {
  return REPAIRS.filter((entry) => entry.brandSlug === brandSlug);
}
