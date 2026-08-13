/**
 * Copy for the seven Tier 2 service pages.
 *
 * These pages answer "what does this service cover and how does it work".
 * They deliberately do not answer "which device do you have" (that is the
 * brand hub at /repair/[brand]), "what does this one repair cost on every
 * model" (that is /repairs/[repair]), or "where are you" (that is Tier 5).
 * See CLAUDE.md Section 7 for the full intent table.
 *
 * Live numbers are never written into this file. They arrive through the
 * context object, which reads them from Sanity, so a price change in the
 * Studio moves every sentence that quotes it.
 */

import type { RepairSubject } from "@/components/blocks/RepairIllustration";
import type { PageFaq } from "@/lib/faq/scoping";

export interface ServiceCtx {
  warrantyDays: number;
  waitMinutes: number;
}

export interface ProseSection {
  /** H2, phrased as a question a person would actually type or ask. */
  heading: string;
  paragraphs: string[];
}

export interface ProcessStep {
  title: string;
  body: string;
  /**
   * Line illustration for this step. Phase 6.5b: thirty-five step cards across
   * seven pages cannot each have a distinct photograph, and five photographs
   * repeated seven times would read as filler. A diagram of the step is the
   * better answer and stays in the design system's own language.
   */
  art?: RepairSubject;
}

export interface Source {
  label: string;
  href: string;
  note: string;
}

export interface ServiceDef {
  slug: string;
  h1: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  serviceType: string;
  /** Repair pages that belong under this service. */
  repairSlugs: string[];
  /** Brand hubs worth linking from this page. */
  brandSlugs: string[];
  /** Flat-service slugs that form this page's price table. */
  flatSlugs: string[];
  /** Device types whose repair types this page covers. */
  deviceTypes: ("phone" | "tablet" | "laptop")[];
  /** The Tier 5 page for this service, gated by the registry until Phase 6. */
  localPath: string;
  /** Two sibling services. */
  siblings: string[];
  lead: (c: ServiceCtx) => string;
  answer: (c: ServiceCtx) => string;
  keyFacts: (c: ServiceCtx) => { label: string; value: string }[];
  process: ProcessStep[];
  sections: (c: ServiceCtx) => ProseSection[];
  whoFor: string[];
  limits: (c: ServiceCtx) => { title: string; body: string }[];
  faqs: (c: ServiceCtx) => PageFaq[];
  /** Global /faq categories this page may borrow at most two questions from. */
  globalCategories: string[];
  sources: Source[];
}

/* ------------------------------------------------------------ phone repair */

const phoneRepair: ServiceDef = {
  slug: "phone-repair",
  h1: "Cell Phone Repair in Calgary",
  eyebrow: "Phone repair",
  seoTitle: "Cell Phone Repair Calgary | Walk In, No Appointment",
  seoDescription:
    "Cell phone repair at TechBrotherz in Calgary. Screens, batteries, charging ports and cameras, parts and labour included, 60-day warranty. Walk in, no appointment.",
  serviceType: "Cell phone repair",
  repairSlugs: [
    "iphone-screen-replacement",
    "iphone-battery-replacement",
    "iphone-charging-port-repair",
    "iphone-camera-repair",
    "iphone-back-glass-replacement",
    "samsung-screen-replacement",
    "samsung-battery-replacement",
    "samsung-charging-port-repair",
    "samsung-back-glass-replacement",
  ],
  brandSlugs: ["apple-iphone", "samsung-galaxy", "google-pixel"],
  flatSlugs: [],
  deviceTypes: ["phone"],
  localPath: "/phone-repair-calgary",
  siblings: ["/services/ipad-repair", "/services/phone-unlocking"],
  lead: (c) =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, replaces phone screens, batteries, charging ports, cameras and buttons on iPhone, Samsung Galaxy and Google Pixel handsets. Most phone repairs are finished in about ${c.waitMinutes} minutes while you wait.`,
  answer: (c) =>
    `TechBrotherz in Calgary repairs cell phones while you wait at the counter. Most phone repairs take about ${c.waitMinutes} minutes, no appointment is needed, and every repair carries a ${c.warrantyDays}-day warranty on the part and the workmanship. The quote is free and agreed before any work starts, and it covers the part and the labour together.`,
  keyFacts: (c) => [
    { label: "Handsets", value: "iPhone, Samsung Galaxy and Google Pixel" },
    { label: "Most common repairs", value: "Screen, then battery, then charging port" },
    { label: "Typical time", value: `About ${c.waitMinutes} minutes on a screen` },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  process: [
    {
      title: "Bring the phone in",
      body: "No appointment, no booking form. Come to the counter at 3317 17 Ave SE during opening hours and tell us what the phone is doing.",
      art: "diagnostic",
    },
    {
      title: "We diagnose it in front of you",
      body: "Most faults are visible in a couple of minutes. We check whether the damage is the glass, the picture panel, the battery or the port, because those are four different prices.",
      art: "board",
    },
    {
      title: "You get the price before we start",
      body: "We quote the full amount, part and labour together, and we do not start until you agree to it. If the phone turns out to need something else once it is open, we stop and ask.",
      art: "screen",
    },
    {
      title: "We fit the part and test it",
      body: "Touch across the whole screen, both cameras, the earpiece, the loudspeaker, the microphone and charging all get checked before the phone comes back to you.",
      art: "battery",
    },
    {
      title: "You leave with a warranty",
      body: "Every repair is covered for 60 days on the part and the workmanship. Keep the receipt, that is all we need to see.",
      art: "lock",
    },
  ],
  sections: (c) => [
    {
      heading: "What phone repairs does TechBrotherz do?",
      paragraphs: [
        `TechBrotherz repairs the five things that account for almost every phone that comes through the door: cracked screens, worn batteries, charging ports that have stopped holding a cable, cameras that will not focus or show a black frame, and back glass that has shattered. Screen replacement is the most common repair by a wide margin, and on most models it is finished in about ${c.waitMinutes} minutes.`,
        "Beyond those five, we replace earpieces, loudspeakers, power buttons, volume buttons and home buttons. Those are smaller jobs, and on most handsets they take under an hour. If a phone has a fault that is not on the list, bring it in and we will tell you honestly whether it is something we can fix or something that needs the manufacturer.",
        "We work on iPhone, Samsung Galaxy and Google Pixel handsets. Apple and Samsung make up most of the volume, which is why our published price list is deepest on those two. Pixel repairs are quoted at the counter once we have the model in front of us and know what the part costs.",
      ],
    },
    {
      heading: "What is the difference between a cracked screen and a broken LCD?",
      paragraphs: [
        "A phone screen is two layers bonded together: the digitizer, which is the touch-sensitive glass you press, and the LCD or OLED panel underneath, which produces the picture. A cracked screen means the glass is broken. A broken LCD means the panel underneath has failed, which shows up as black patches, coloured lines, a bleeding white glow or a display that stays dark.",
        "The distinction matters because it is the single biggest driver of what a repair costs. On almost every modern phone the two layers are laminated together at the factory and have to be replaced as one assembly, so a cracked glass and a dead panel cost the same to fix. On some older iPads and a handful of older Android phones the layers are separate, and replacing just the glass is much cheaper.",
        "You do not need to work out which one you have before you come in. Bring the phone to the counter and we will tell you in a minute, because the price we quote depends on it and we would rather show you than guess.",
      ],
    },
    {
      heading: "How long does a phone repair take?",
      paragraphs: [
        `Most phone repairs at TechBrotherz take about ${c.waitMinutes} minutes, and they are done while you wait. Screen replacements, battery replacements and camera swaps all fall in that range on the models we stock parts for. Charging port work takes longer, usually around 45 minutes, because the port is soldered or deeply seated on most handsets and the phone has to come apart further.`,
        "Two things change that estimate. If the part for your model is not in stock, we order it in, which usually means a day or two rather than the same visit. If the phone has water damage, we cannot give a time at all until it has been opened, cleaned and tested, because water damage is a diagnosis and not a fixed repair.",
        "We will always tell you the expected time at the counter before you decide. If you have somewhere to be, say so, because on a busy Saturday there may be repairs ahead of yours and it is better that you know than that you wait.",
      ],
    },
    {
      heading: "Is it worth repairing a phone or replacing it?",
      paragraphs: [
        "The arithmetic is usually simple. If the repair costs less than a third of what the same phone is worth used, repairing it is almost always the better choice, because a screen replacement returns the handset to full working order and a new phone means a new contract or a new outright purchase. On mid-range and flagship phones under about four years old, that is nearly always the case.",
        "The calculation changes on older handsets. Once a phone stops receiving security updates from Apple or Google, it will keep working but it stops getting patched, and some banking and payment apps eventually refuse to run on it. A screen repair on a phone in that position buys you a working device, not a supported one, and we will say so before you spend the money.",
        "Two other cases push towards replacement. A phone with a swollen battery that has already lifted the screen off the frame often has damage underneath, and a phone that has been through water may work for weeks and then fail from corrosion. We will give you the honest read at the counter rather than take the repair and let you find out.",
      ],
    },
    {
      heading: "What parts does TechBrotherz use?",
      paragraphs: [
        "We fit new replacement parts, not salvaged ones pulled from other handsets. On screens that means an assembly with the digitizer and the panel already bonded, which is how the manufacturer supplies them and the only way to get a reliable fit on a modern phone.",
        `Every part we fit is covered by the same ${c.warrantyDays}-day warranty as the labour. If a screen develops dead touch spots, if a battery will not hold the charge it should, or if a port comes loose, bring the phone back with the receipt and we will put it right. The warranty covers the part and our workmanship, and it does not cover a new drop or new water damage, because that is a fresh repair rather than a failure of the last one.`,
        "If you want to know exactly which grade of part goes into a specific repair, ask at the counter. We would rather answer the question directly for your model than publish a blanket claim that is not true of every part we stock.",
      ],
    },
  ],
  whoFor: [
    "Anyone with a cracked or black screen who wants it fixed today rather than booked for next week.",
    "People whose phone battery no longer lasts a working day, or shuts down when it still shows charge left.",
    "Anyone whose charging cable has to be held at an angle, or has stopped charging altogether.",
    "People who would rather pay a published price agreed up front than send a phone away for an estimate.",
  ],
  limits: () => [
    {
      title: "We do not guarantee water-damaged phones",
      body: "A phone that has been in water can be cleaned and tested, and often works afterwards, but corrosion keeps spreading under components. We will attempt it and tell you what we find, and we will not put a warranty on the outcome.",
    },
    {
      title: "We do not do board-level microsoldering",
      body: "If the fault is on the logic board itself rather than a replaceable part, that is specialist work beyond what we do at the counter, and we will tell you rather than take the repair.",
    },
    {
      title: "We cannot recover data from a dead phone",
      body: "If a phone will not power on, the data on it is beyond us. Back your phone up before any repair. Screen and battery work does not touch your data, but no repair is a substitute for a backup.",
    },
  ],
  faqs: (c) => [
    {
      question: "How much does a cell phone repair cost in Calgary?",
      answer: `Cell phone repair at TechBrotherz in Calgary is quoted per handset, free of charge, before any work starts, and every quote covers the part and the labour together. iPhone and Samsung Galaxy screens differ sharply across the range, because the panel in a five-year-old handset and the panel in a current one are not the same part.`,
    },
    {
      question: "Can TechBrotherz fix my phone while I wait?",
      answer: `Yes. Most phone repairs at TechBrotherz in Calgary are done at the counter in about ${c.waitMinutes} minutes, including screen and battery replacements on the models we stock parts for. Charging port work takes around 45 minutes. If the part has to be ordered in, TechBrotherz will tell you at the counter before you leave the phone.`,
    },
    {
      question: "Which phone brands does TechBrotherz repair?",
      answer:
        "TechBrotherz in Calgary repairs iPhone, Samsung Galaxy and Google Pixel phones. Apple and Samsung models are priced individually on the published price list. Pixel repairs are quoted at the counter once the model is identified, because the part cost drives the price.",
    },
    {
      question: "Do I need to back up my phone before a repair?",
      answer:
        "Back up your phone before any repair, as a precaution. Screen, battery, camera and charging port replacements at TechBrotherz do not touch the storage in your phone and your data stays where it is. TechBrotherz cannot recover data from a phone that will not power on, so a current backup is the only real protection.",
    },
  ],
  globalCategories: ["walkin", "warranty"],
  sources: [],
};

/* ----------------------------------------------------------- tablet repair */

/*
 * Renamed from tablet-repair on the client's instruction 2026-08: iPad leads
 * everywhere. The old /services/tablet-repair URL 301s here in next.config.ts.
 * "Android and Windows tablets" survives as one supporting section and FAQ,
 * which holds the tablet term without diluting the iPad emphasis.
 */
const ipadRepair: ServiceDef = {
  slug: "ipad-repair",
  h1: "iPad Repair in Calgary",
  eyebrow: "iPad repair",
  seoTitle: "iPad Repair Calgary | Glass, Screens and Batteries",
  seoDescription:
    "iPad repair at TechBrotherz in Calgary. Cracked glass, screens, batteries and charging ports, parts and labour included, 60-day warranty, walk in.",
  serviceType: "iPad repair",
  repairSlugs: ["ipad-screen-replacement"],
  brandSlugs: ["apple-ipad"],
  flatSlugs: [],
  deviceTypes: ["tablet"],
  localPath: "/ipad-repair-calgary",
  siblings: ["/services/phone-repair", "/services/laptop-repair"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, repairs every iPad generation, replacing cracked glass, failed display panels, worn batteries and charging ports, and takes Android and Windows tablets at the same counter.`,
  answer: (c) =>
    `TechBrotherz in Calgary repairs iPads of every generation. On older iPads the touch glass is a separate layer from the display panel, so a cracked front with a working picture is often a smaller repair than people expect. iPad repairs take longer than phone repairs because the glass is bonded to the frame with adhesive that has to be heated and cut. Every repair carries a ${c.warrantyDays}-day warranty.`,
  keyFacts: (c) => [
    { label: "Two kinds of screen", value: "Separated glass on older iPads, laminated on recent Air and Pro" },
    { label: "Typical time", value: "Longer than a phone, usually the same day" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
    { label: "Android tablets", value: "Quoted at the counter, model number needed" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  process: [
    {
      title: "Bring the tablet and tell us the model",
      body: "iPad models look alike and price very differently. The model number is engraved on the back in small print, and we can read it at the counter if you cannot find it.",
      art: "diagnostic",
    },
    {
      title: "We work out which layer is broken",
      body: "On an iPad, the glass and the display are often two separate parts. A cracked front with a perfect picture is the cheaper repair. Black patches or coloured lines mean the panel underneath has failed too.",
      art: "screen",
    },
    {
      title: "You get the price before we start",
      body: "The quote covers the part and the labour together, and we do not begin until you agree to it.",
      art: "board",
    },
    {
      title: "We heat, cut, replace and reseal",
      body: "Tablet glass is held on with adhesive around the whole perimeter. It is warmed, cut through, cleaned off and replaced with fresh adhesive, which is why a tablet takes longer than a phone.",
      art: "port",
    },
    {
      title: "We test and hand it back",
      body: "Touch across the whole panel, both cameras, the speakers, the home button or Face ID and charging all get checked before it comes back to you.",
      art: "lock",
    },
  ],
  sections: (c) => [
    {
      heading: "Why does iPad glass replacement cost less than an iPhone screen?",
      paragraphs: [
        `On many iPad models the touch-sensitive glass is a separate component from the display panel underneath, unlike almost every modern phone where the two are laminated into one assembly. If you crack the front of an older iPad and the picture is still perfect, only the glass needs replacing, and that part is a fraction of a full display. That is why a cracked older iPad is one of the smaller repairs TechBrotherz quotes.`,
        "The newer iPad Air and iPad Pro models changed this. Their displays are laminated, with the glass bonded directly to the panel, which removes the air gap and makes the screen look closer to the surface. It also means a crack takes out the whole assembly, and the part is far more expensive. An iPad Pro screen can cost several times what the same repair costs on a base iPad.",
        "This is the first thing we check at the counter, and it is the reason we ask for the model. Two iPads that look nearly identical can be two very different repairs, and quoting one price for both would be guessing.",
      ],
    },
    {
      heading: "How long does an iPad repair take?",
      paragraphs: [
        "An iPad repair takes longer than a phone repair, and it is worth knowing why before you decide to wait for it. The glass on a tablet is held down by a continuous band of adhesive around the entire perimeter, and that adhesive has to be warmed until it softens, cut through carefully, and then scraped off the frame before a new panel can go on. Rushing that step is how frames get bent.",
        "In practice most iPad work is a same-day repair rather than a wait-at-the-counter one. Bring it in during the day, and in most cases it is ready before we close. We will give you a realistic time when you drop it off, and we will call you when it is done.",
        "If the part for your model is not in stock, we order it, which usually adds a day or two. Older iPad glass is generally on the shelf. Laminated assemblies for recent iPad Air and iPad Pro models are more often ordered in.",
      ],
    },
    {
      heading: "Should you repair an iPad or replace it?",
      paragraphs: [
        "For older iPads with separate glass, repair is usually the clear answer, because the repair costs a small fraction of a replacement tablet and the device keeps doing what it was doing. A cracked iPad that is otherwise working is not a device that needs replacing, it is a device that needs a piece of glass.",
        "For recent iPad Pro models the calculation is genuinely closer, because a laminated display assembly is one of the more expensive parts we fit. If the repair is approaching half the used value of the tablet, that is worth thinking about rather than deciding on the spot, and we would rather you thought about it than felt rushed.",
        "There is one more factor on tablets that people forget: iPads stay useful for a long time as a reading, video and kitchen device even after they stop getting the latest iPadOS. An iPad that will not get another major update is often still worth fixing, because what it is used for has not changed.",
      ],
    },
    {
      heading: "Does TechBrotherz repair Android and Windows tablets?",
      paragraphs: [
        "TechBrotherz repairs Android and Windows tablets as well as iPads, but those are quoted at the counter rather than published in advance. Android tablet parts vary enormously between manufacturers and model years, and unlike iPads there is no small set of models that covers most of the market, so a published price list would be misleading more often than it was useful.",
        "Bring the tablet in with its model number, which is normally printed on the back or listed in the settings under About. We will identify the part, tell you what it costs and how long it will take, and you can decide from there. If the part is not available at a sensible price, we will tell you that too rather than take the job.",
        "The repairs themselves are the same work: cracked glass, failed panels, batteries that no longer hold charge, and charging ports that have worn out from years of cable insertion.",
      ],
    },
    {
      heading: "What is included in an iPad repair price?",
      paragraphs: [
        `Every iPad repair quote at TechBrotherz includes the replacement part, the labour to fit it, fresh adhesive to seal the device back up, testing before it is handed over, and a ${c.warrantyDays}-day warranty on the part and the workmanship. There is no separate bench fee and no diagnostic charge on a repair we go on to carry out.`,
        "The warranty covers a part that fails and work that was not done properly. It does not cover a new crack, because a tablet that has been dropped again is a new repair rather than a failure of the last one. If something is not right after a repair, bring it back with the receipt.",
        "We do not touch the storage in your tablet during a glass, screen, battery or port replacement, and your apps and files stay exactly where they are. Back the tablet up anyway before any repair, because that is what protects you if something unexpected turns up once the device is open.",
      ],
    },
  ],
  whoFor: [
    "Anyone with a cracked iPad front where the picture underneath still works perfectly.",
    "People whose iPad battery no longer lasts through an evening, or takes most of a day to charge.",
    "Anyone whose tablet charging port has worn loose from years of plugging a cable in.",
    "People with an Android or Windows tablet who want an honest quote before committing to a repair.",
  ],
  limits: () => [
    {
      title: "Bent frames cannot always be brought back",
      body: "A tablet that has been dropped hard enough to bend the aluminium frame may not seal properly again, because a new panel needs a flat surface to bond to. We will tell you at the counter if that is what we are looking at.",
    },
    {
      title: "Recent iPad Pro screens are expensive parts",
      body: "Laminated display assemblies on recent iPad Pro models cost several times what an older iPad glass replacement costs. That is the part price, not a markup, and we will always quote it before you commit.",
    },
    {
      title: "Water-damaged tablets carry no guarantee",
      body: "A tablet that has been in liquid can be opened, cleaned and tested, and often works afterwards, but corrosion keeps spreading. We will attempt it and tell you what we find, without a warranty on the outcome.",
    },
  ],
  faqs: () => [
    {
      question: "How much does it cost to fix a cracked iPad screen in Calgary?",
      answer: `iPad glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. On older iPad models the touch glass is a separate layer from the display, so a cracked front with a working picture is the smaller repair. Laminated screens on recent iPad Air and iPad Pro models are the larger job, because the glass and the panel replace as one assembly.`,
    },
    {
      question: "Can TechBrotherz replace just the glass on an iPad?",
      answer:
        "On older iPad models, yes. Those iPads have a separate glass digitizer above the display panel, and TechBrotherz replaces the glass alone when the picture underneath is undamaged. Recent iPad Air and iPad Pro models use a laminated display where the glass and panel are bonded together and must be replaced as one part.",
    },
    {
      question: "How long does an iPad repair take at TechBrotherz?",
      answer:
        "Most iPad repairs at TechBrotherz in Calgary are same-day rather than while-you-wait. Tablet glass is sealed to the frame with adhesive around the whole perimeter, which has to be heated, cut and cleaned off before a new panel is fitted. TechBrotherz gives a realistic time at the counter when the tablet is dropped off.",
    },
    {
      question: "Does TechBrotherz repair Samsung and other Android tablets?",
      answer:
        "Yes. TechBrotherz in Calgary repairs Android and Windows tablets alongside iPads, quoted at the counter rather than from a published list. Android tablet parts vary widely by manufacturer and model year. Bring the tablet with its model number and TechBrotherz will confirm the part cost and the time before any work starts.",
    },
  ],
  globalCategories: ["walkin", "warranty"],
  sources: [],
};

/* ----------------------------------------------------------- laptop repair */

const laptopRepair: ServiceDef = {
  slug: "laptop-repair",
  h1: "Laptop Repair in Calgary",
  eyebrow: "Laptop repair",
  seoTitle: "Laptop Repair Calgary | Screens, Keyboards, Charging Ports",
  seoDescription:
        "Laptop repair at TechBrotherz in Calgary. Screens, keyboards and charging sockets, quoted free at the counter. Parts and labour included, 60-day warranty.",
  serviceType: "Laptop repair",
  repairSlugs: [
    "laptop-screen-replacement",
    "laptop-keyboard-replacement",
    "laptop-charging-port-repair",
  ],
  brandSlugs: ["laptops-desktops"],
  flatSlugs: [
    "laptop-screen-replacement",
    "laptop-keyboard-replacement",
    "dc-charging-port-replacement",
    "diagnostics",
    "hardware-installation",
  ],
  deviceTypes: ["laptop"],
  localPath: "/laptop-repair-calgary",
  siblings: ["/services/computer-repair", "/services/virus-removal"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, repairs laptops: cracked and failed screens, keyboards, charging sockets, storage and memory. Every quote includes the part and the labour.`,
  answer: (c) =>
    `TechBrotherz in Calgary replaces laptop screens, keyboards and charging sockets, with the part and the labour in one figure. Laptop diagnostics carry a fixed fee that comes off the repair if you go ahead. Most laptop work is finished the same day, and every repair carries a ${c.warrantyDays}-day warranty.`,
  keyFacts: (c) => [
    { label: "Repairs", value: "Screens, keyboards, charging sockets, storage and memory" },
    { label: "What sets the job", value: "The panel or the keyboard fitting, read from the model number" },
    { label: "Typical time", value: "Most laptop work is finished the same day" },
    { label: "Diagnostics", value: "A fixed fee, deducted from the repair if you go ahead" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  process: [
    {
      title: "Bring the laptop and its charger",
      body: "The charger matters more than people expect. A laptop that will not power on is sometimes the adapter rather than the machine, and that is a two-minute check with the charger in front of us.",
      art: "diagnostic",
    },
    {
      title: "We diagnose the fault",
      body: "Diagnostics carry a fixed fee, and that fee comes off the bill if you go ahead with the repair. It buys a real answer rather than a guess, which matters on a machine with more than one possible cause.",
      art: "board",
    },
    {
      title: "You get the price before we start",
      body: "Laptop parts vary by model far more than phone parts do, so we confirm the exact part and its cost before quoting. The quote covers the part and the labour together.",
      art: "keyboard",
    },
    {
      title: "We strip, replace and reassemble",
      body: "Laptop work means taking the machine apart properly, replacing the failed component and putting it back together with every screw where it belongs.",
      art: "port",
    },
    {
      title: "We test under load and hand it back",
      body: "The machine gets booted, the repair gets exercised, and we check that nothing else was disturbed on the way in or out.",
      art: "lock",
    },
  ],
  sections: () => [
    {
      heading: "How much does a laptop screen replacement cost in Calgary?",
      paragraphs: [
        `Laptop panels differ by size, resolution and panel type, so a standard HD screen on a mainstream 15-inch machine sits at the bottom of the range, while a high-resolution or touch-enabled panel sits well above it. TechBrotherz confirms the exact part and what it comes to before any work starts.`,
        "Unlike phones, laptop screens are usually a single panel that is not bonded to a separate touch layer, which makes the replacement itself a cleaner job. The panel unclips from the lid, a ribbon cable comes off, and a new one goes on. The work is straightforward. The variation is entirely in what the specific panel costs.",
        "Bring the laptop with its model number, which is normally on a sticker on the underside. That number tells us the exact panel the machine takes, and it is the difference between a firm price and an estimate.",
      ],
    },
    {
      heading: "Why has my laptop stopped charging?",
      paragraphs: [
        `A laptop that will not charge has three common causes, and they are very different jobs. The first is the charger itself, which is the cheapest outcome and the reason we ask you to bring it. The second is the DC socket where the charger plugs in, which works loose over years of the cable being knocked. The third is the battery, which no longer holds what it should.`,
        "You can often tell the socket from the battery by how the machine behaves. If wiggling the plug makes the charging light flicker, or if the laptop only charges when the cable is held at an angle, that is the socket. If the machine runs perfectly on mains power but dies the moment you unplug it, that is the battery.",
        "Charging socket replacement is soldered work on most laptops, which is why it takes longer than a phone port and why it is priced as its own repair. It is worth doing, because a laptop with a failed socket is otherwise a working machine tethered to a specific cable angle.",
      ],
    },
    {
      heading: "Can a laptop keyboard be replaced, or does the whole laptop need fixing?",
      paragraphs: [
        `A laptop keyboard can almost always be replaced on its own. What the work comes to reflects how the machine is built rather than how bad the keyboard is: on some laptops the keyboard lifts out from the top after a handful of screws, and on others it is riveted into the upper case, which means replacing the whole palm rest assembly.`,
        "Spilled liquid is the most common reason a keyboard needs replacing, and it is the case where time matters most. If something has been spilled on a laptop, shut it down immediately, unplug it, and bring it in rather than trying to dry it out and carry on. Liquid that has reached the board is a different and more serious problem than liquid that has only reached the keyboard.",
        "Individual keys that have come off can sometimes be reseated rather than replaced, and that is worth asking about at the counter before you pay for a whole keyboard. If the clip underneath is intact, a key often goes back on.",
      ],
    },
    {
      heading: "What does a laptop diagnostic actually check?",
      paragraphs: [
        `A diagnostic at TechBrotherz carries a fixed fee, and that fee comes off the bill if you go ahead with the repair. It exists because some laptop faults have several possible causes and guessing between them wastes your money rather than ours. A machine that will not turn on could be the adapter, the socket, the battery, the board or the storage, and those are five different answers.`,
        "The diagnostic checks power delivery from the adapter through to the board, whether the machine posts, whether the storage is detected and healthy, whether the memory passes, and whether the machine is overheating and shutting itself down. At the end of it you get a specific answer and a specific price, not a range.",
        "If the answer is that the machine is not economically worth repairing, we will tell you that, and the diagnostic fee is what you paid to find out rather than the first instalment of a repair that was never going to be worth it.",
      ],
    },
    {
      heading: "Is it worth repairing an older laptop?",
      paragraphs: [
        "The question worth asking is what is actually wrong. A screen, a keyboard or a charging socket is a mechanical part that has failed on a machine whose processor, memory and storage are all still fine, and replacing it returns a working laptop for a small fraction of a new one. That is nearly always worth doing, even on a machine that is five or six years old.",
        "The calculation is different when the fault is the board itself, or when a machine is slow rather than broken. A laptop that has become slow is often fixed by a clean install and a solid-state drive rather than a repair, and that is a different conversation and a different price. We will tell you which one you are having.",
        "One thing that has changed the arithmetic recently is Windows 10 reaching the end of Microsoft's support on 14 October 2025. A machine that cannot meet the Windows 11 hardware requirements will keep running, but it stops receiving security updates, and that is worth knowing before spending money on it. We will check that when you bring the machine in.",
      ],
    },
  ],
  whoFor: [
    "Anyone with a cracked, black or flickering laptop screen on a machine that is otherwise fine.",
    "People whose laptop only charges when the cable is held at a particular angle.",
    "Anyone who has spilled liquid on a keyboard and needs it looked at rather than left to dry.",
    "People who want a real diagnosis on a laptop that will not start, before deciding whether to repair or replace.",
  ],
  limits: () => [
    {
      title: "We do not do board-level microsoldering",
      body: "If the diagnostic finds a fault on the mainboard itself rather than a replaceable part, that is specialist work beyond what we do here. You will have paid the diagnostic fee and got a real answer, and we will say so plainly.",
    },
    {
      title: "Liquid damage is a diagnosis, not a fixed repair",
      body: `A laptop that has had liquid in it gets opened, cleaned and tested, and the diagnostic tells you where it stands. We cannot quote liquid damage before we have seen inside the machine.`,
    },
    {
      title: "We are not a data recovery lab",
      body: "If a drive has failed mechanically, recovering what is on it needs a clean room and specialist equipment. We can tell you whether the drive is the problem, and we will not pretend we can get the data back.",
    },
  ],
  faqs: () => [
    {
      question: "How much does laptop screen replacement cost in Calgary?",
      answer: `Laptop screen replacement at TechBrotherz in Calgary is quoted once the panel has been identified, free of charge, before any work starts. Size, resolution and touch capability all change the part, while the labour stays broadly the same. TechBrotherz reads the exact panel from the laptop's model number.`,
    },
    {
      question: "How much does TechBrotherz charge to fix a laptop charging port?",
      answer: `Laptop charging socket replacement at TechBrotherz in Calgary is quoted free of charge before any work starts. A socket that has worked loose shows up as a charging light that flickers when the plug is moved, or a laptop that only charges when the cable is held at an angle. The repair is soldered work and takes longer than a phone charging port.`,
    },
    {
      question: "Does TechBrotherz charge for laptop diagnostics?",
      answer: `Laptop diagnostics at TechBrotherz in Calgary carry a fixed fee, and that fee is deducted from the bill if you go ahead with the repair. The diagnostic checks power delivery, whether the machine posts, storage health, memory and overheating, and it ends with a specific fault rather than an estimate.`,
    },
    {
      question: "Should I bring my laptop charger in with the laptop?",
      answer:
        "Yes. Bring the charger with the laptop to TechBrotherz. A laptop that will not power on is sometimes a failed adapter rather than a fault in the machine, and that is a two-minute check when the charger is on the counter. Without it, the same question needs a paid diagnostic to answer.",
    },
  ],
  globalCategories: ["walkin", "warranty"],
  sources: [
    {
      label: "Microsoft, Windows 10 end of support",
      href: "https://www.microsoft.com/en-us/windows/end-of-support",
      note: "Microsoft ended support for Windows 10 on 14 October 2025. Machines that cannot meet the Windows 11 requirements keep running but stop receiving security updates.",
    },
  ],
};

/* --------------------------------------------------------- computer repair */

const computerRepair: ServiceDef = {
  slug: "computer-repair",
  h1: "Computer Repair in Calgary",
  eyebrow: "Computer repair",
  seoTitle: "Computer Repair Calgary | Diagnostics, Windows, Tune-Ups",
  seoDescription:
        "Computer repair at TechBrotherz in Calgary. Diagnostics, Windows installation, clean-up and tune-up. Quoted per job and agreed before work starts.",
  serviceType: "Computer repair",
  repairSlugs: ["windows-installation", "computer-tune-up", "computer-diagnostics"],
  brandSlugs: ["laptops-desktops"],
  flatSlugs: [
    "diagnostics",
    "windows-installation",
    "tune-up",
    "program-installation",
    "hardware-installation",
    "virus-removal",
    "password-reset",
  ],
  deviceTypes: ["laptop"],
  localPath: "/computer-repair-calgary",
  siblings: ["/services/laptop-repair", "/services/virus-removal"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, repairs desktop computers and laptops: diagnostics, Windows installation, and a full clean-up and tune-up. Every job is quoted flat and agreed before work starts.`,
  answer: () =>
    `TechBrotherz in Calgary quotes computer work per job rather than per hour: diagnostics, a Windows installation including an office suite and security software, a full clean-up and tune-up, and hardware or program installation charged per item. Every figure is flat and agreed before work starts, and the diagnostic fee comes off the repair if you go ahead.`,
  keyFacts: (c) => [
    { label: "Quoted", value: "Per job, not per hour" },
    {
      label: "Windows installation",
      value: "Includes an office suite and security software",
    },
    { label: "Clean-up and tune-up", value: "Startup list, temporary files, updates, cooling and storage health" },
    { label: "Diagnostics", value: "A fixed fee, deducted from the repair if you go ahead" },
    { label: "Warranty", value: `${c.warrantyDays} days on the work` },
  ],
  process: [
    {
      title: "Bring the tower or the laptop",
      body: "For a desktop, the tower alone is enough. We have monitors, keyboards and mice here to test with, so there is no need to carry the whole setup in.",
      art: "diagnostic",
    },
    {
      title: "Tell us what it is doing",
      body: "Slow, noisy, restarting, showing a specific error, refusing to boot. What the machine does and when it started doing it narrows the diagnosis more than any test.",
      art: "board",
    },
    {
      title: "We diagnose it properly",
      body: "Diagnostics carry a fixed fee that comes off the repair. Storage health, memory, temperatures, startup load and malware all get checked, because a slow computer usually has a specific cause.",
      art: "battery",
    },
    {
      title: "You approve a flat price",
      body: "Computer work here is priced per job, not per hour, so you know the total before we begin and it does not move because something took longer.",
      art: "keyboard",
    },
    {
      title: "We do the work and test it",
      body: "The machine gets used after the work is finished, not just booted once. Startup time, temperatures and the specific fault you brought it in for all get checked.",
      art: "lock",
    },
  ],
  sections: () => [
    {
      heading: "Why is my computer so slow?",
      paragraphs: [
        "A computer that has become slow almost never has one dramatic fault. It usually has four ordinary ones stacked on top of each other: a mechanical hard drive that has been failing gradually, a startup list that has collected a dozen programs that all load at boot, a system that has not been updated in a long time, and dust that has blocked the cooling so the processor throttles itself to stay cool.",
        `A clean-up and tune-up at TechBrotherz addresses all four. The startup list gets cut back to what the machine actually needs, temporary files and leftover installers are cleared out, updates are brought current, the cooling is physically cleaned, and the storage is checked for the early signs of failure that show up long before a drive dies.`,
        "The single biggest improvement on an older machine is usually replacing a mechanical hard drive with a solid-state drive. If the diagnostic shows that is what is holding the computer back, we will tell you, because it turns a frustrating machine into a usable one more reliably than any amount of software cleaning.",
      ],
    },
    {
      heading: "What does a Windows installation at TechBrotherz include?",
      paragraphs: [
        `A Windows installation at TechBrotherz includes the operating system installed clean, an office suite, and security software set up and running. It is quoted flat for the whole job rather than by the hour, so a machine that takes longer than expected does not come to more.`,
        "A clean installation is the right answer when a computer has accumulated years of software that cannot be untangled, when it has been infected badly enough that removing the infection is not enough, or when the machine is being handed on to someone else. It gives you a system that behaves like a new one on hardware you already own.",
        "Back up your files before a Windows installation, and tell us if there is anything on the machine you need. A clean install replaces what is on the drive. We will always ask before we do it, and we would rather ask twice than assume.",
      ],
    },
    {
      heading: "What does the Windows 10 end of support mean for my computer?",
      paragraphs: [
        "Microsoft ended support for Windows 10 on 14 October 2025. A computer still running it works exactly as it did the day before, and nothing switches off. What stops is the monthly security updates, which means newly discovered vulnerabilities in the operating system stay unpatched on that machine from then on.",
        "For most people the practical question is whether the machine can run Windows 11, which has stricter hardware requirements than any previous Windows upgrade, particularly around the processor generation and the security chip on the board. Plenty of computers that are perfectly fast enough do not qualify, which is an unusual situation and one that catches people out.",
        "We check this as part of a diagnostic, and we will tell you plainly which side of the line your machine falls on. It changes what is worth spending on a computer, and it is better to know before paying for work than after.",
      ],
    },
    {
      heading: "Does TechBrotherz install hardware and programs?",
      paragraphs: [
        `TechBrotherz installs hardware and programs at a flat figure per item. Hardware installation covers fitting a component you have bought or one we have supplied: a solid-state drive, extra memory, a graphics card, a power supply, a fan or a new optical drive.`,
        "The most common request by far is a solid-state drive going into a machine that still has a mechanical hard drive, usually alongside moving the existing Windows installation onto it so nothing has to be set up again. That is the upgrade that makes the biggest difference to how a computer feels, and it costs far less than replacing the machine.",
        "Program installation is exactly what it sounds like: a flat price per program to have software installed and configured properly rather than left half set up. If you are having several things done at once, ask at the counter and we will tell you the total before we start.",
      ],
    },
    {
      heading: "How long does computer repair take?",
      paragraphs: [
        "Computer work is generally a drop-off rather than a wait, because most of the time in a repair is spent on processes running rather than hands on the machine. A Windows installation, a tune-up or a virus removal all involve long stretches where the computer is working and nobody needs to be standing over it.",
        "In practice, most computer work at TechBrotherz is ready the same day or the next day. We will give you a realistic time when you drop the machine off, and we will call you when it is finished rather than leaving you to guess.",
        "If a part needs ordering, that adds a day or two and we will say so at the counter. Nothing gets started, and nothing gets charged, before you have agreed to the price and the timeframe.",
      ],
    },
  ],
  whoFor: [
    "Anyone whose computer has become slow enough to be frustrating, without an obvious cause.",
    "People who need Windows installed clean, with an office suite and security software set up properly.",
    "Anyone who wants a solid-state drive or more memory fitted to a machine that is otherwise fine.",
    "People who want a flat price for a computer job rather than an open-ended hourly rate.",
  ],
  limits: () => [
    {
      title: "We are not a data recovery lab",
      body: "If a drive has failed mechanically, getting the data off it needs a clean room and specialist equipment. We can tell you whether the drive is the problem. We cannot recover from a physically failed one, and we will not take your money to try.",
    },
    {
      title: "We do not do board-level repair",
      body: "If a diagnostic finds a fault on the mainboard itself, replacing the board is usually the honest answer, and on an older machine that is often not worth doing. We will say which case you are in.",
    },
    {
      title: "We cannot make an old machine meet the Windows 11 requirements",
      body: "The processor generation and security chip requirements are set by Microsoft and are not something a repair can work around. We will tell you where your machine stands rather than sell you work that does not change it.",
    },
  ],
  faqs: () => [
    {
      question: "How much does computer repair cost in Calgary?",
      answer: `Computer repair at TechBrotherz in Calgary is quoted per job, not per hour. The diagnostic fee comes off the repair if you go ahead. A Windows installation includes an office suite and security software, a full clean-up and tune-up covers startup, temporary files, updates, cooling and storage health, and hardware or program installation is charged per item.`,
    },
    {
      question: "What is included in a computer tune-up at TechBrotherz?",
      answer: `A clean-up and tune-up at TechBrotherz in Calgary is quoted as one flat figure and covers cutting the startup list back, clearing temporary files, bringing updates current, physically cleaning the cooling so the processor stops throttling, and checking the storage for early signs of failure. Those four causes account for most computers that have become slow.`,
    },
    {
      question: "Do I need to bring my monitor and keyboard in with my desktop?",
      answer:
        "No. Bring the tower alone to TechBrotherz in Calgary. Monitors, keyboards and mice are here for testing, so there is no need to disconnect and carry a full setup. Bring the power cable if it is a non-standard one, and mention any password needed to log into the machine.",
    },
    {
      question: "Is my computer still safe to use now that Windows 10 support has ended?",
      answer:
        "A computer running Windows 10 keeps working after Microsoft's support ended on 14 October 2025, but it no longer receives monthly security updates, so new vulnerabilities stay unpatched. TechBrotherz checks whether a machine meets the Windows 11 hardware requirements as part of a diagnostic and will tell you plainly which side of the line it falls on.",
    },
  ],
  globalCategories: ["walkin", "warranty"],
  sources: [
    {
      label: "Microsoft, Windows 10 end of support",
      href: "https://www.microsoft.com/en-us/windows/end-of-support",
      note: "Microsoft's own page confirming that Windows 10 stopped receiving security updates on 14 October 2025, and setting out the Windows 11 hardware requirements.",
    },
  ],
};

/* --------------------------------------------------------- phone unlocking */

const phoneUnlocking: ServiceDef = {
  slug: "phone-unlocking",
  h1: "Phone Unlocking and FRP Removal in Calgary",
  eyebrow: "Unlocking",
    seoTitle: "Phone Unlocking & FRP Removal Calgary",
  seoDescription:
        "Carrier unlocking for any Canadian carrier and Google FRP removal at TechBrotherz in Calgary. Carriers must unlock free on request; FRP needs proof of ownership.",
  serviceType: "Phone unlocking",
  repairSlugs: [],
  brandSlugs: ["apple-iphone", "samsung-galaxy"],
  flatSlugs: [],
  deviceTypes: ["phone"],
  localPath: "/phone-unlocking-calgary",
  siblings: ["/services/phone-repair", "/services/password-reset"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, unlocks phones from any Canadian carrier, usually the same day. Before you pay anyone, ask your own carrier, because since December 2017 Canadian carriers have been required to unlock phones free of charge on request.`,
  answer: () =>
    `TechBrotherz in Calgary unlocks phones from any Canadian carrier, usually the same day. Ask your carrier first: under the CRTC Wireless Code, since 1 December 2017 carriers must unlock phones free of charge on request. TechBrotherz also removes Google Factory Reset Protection (FRP) from Android phones, and proof of ownership is required before that work starts.`,
  keyFacts: () => [
    { label: "Carriers", value: "Any Canadian carrier" },
    { label: "Time", value: "Usually the same day" },
    { label: "Ask your carrier first", value: "They must do it free, by CRTC rule" },
    { label: "FRP removal", value: "Android Google lock, proof of ownership required" },
    { label: "Blacklisted phones", value: "Cannot be unlocked, by anyone" },
  ],
  process: [
    {
      title: "Check with your carrier first",
      body: "We will tell you this at the counter too. If the phone is on your own account with a Canadian carrier, they are required to unlock it free of charge. Save the money if that route is open to you.",
      art: "lock",
    },
    {
      title: "Bring the phone and its details",
      body: "We need the make, the model and the IMEI, which you get by dialling star-hash-zero-six-hash on the phone itself or reading it from the settings.",
      art: "diagnostic",
    },
    {
      title: "We confirm it can be done",
      body: "Not every phone can be unlocked. A phone reported lost or stolen is blacklisted on the national database, and no unlocking service can change that. We check before you pay.",
      art: "board",
    },
    {
      title: "We process the unlock",
      body: "Most unlocks come back the same day. Some carriers and some models take longer, and we will tell you what to expect before you commit.",
      art: "port",
    },
    {
      title: "You test it with another SIM",
      body: "The proof of an unlock is a SIM from a different carrier working in the phone. That is what we check before calling it done.",
      art: "screen",
    },
  ],
  sections: () => [
    {
      heading: "Do you actually need to pay to unlock a phone in Canada?",
      paragraphs: [
        "Often you do not, and TechBrotherz will tell you that before taking your money. Under the CRTC Wireless Code, as revised in Telecom Regulatory Policy CRTC 2017-200, every mobile device sold in Canada on or after 1 December 2017 must be provided to the customer already unlocked. For devices sold before that date, carriers must unlock them free of charge when the customer asks.",
        "So if the phone is on your own account with a Canadian carrier, the first call should be to that carrier, not to a repair Store. It costs nothing and it is your right. Anyone who tells you otherwise is either misinformed or hoping you are.",
        "Paid unlocking exists for the situations that rule does not reach. A phone bought secondhand from someone whose account you cannot access, a phone brought in from another country where no Canadian rule applies, a phone from a carrier that no longer operates, or a device where the original account holder is simply not contactable. Those are the cases where paying solves a problem that a phone call cannot.",
      ],
    },
    {
      heading: "What does unlocking a phone actually do?",
      paragraphs: [
        "Carrier unlocking removes the software restriction that ties a handset to one network's SIM cards. An unlocked phone accepts a SIM from any carrier, which is what lets you switch providers without changing devices, use a local SIM when travelling, or sell the phone to someone on a different network.",
        "Unlocking does not change anything else about the phone. It does not alter the operating system, it does not remove the Apple or Google account signed into it, it does not wipe your data, and it does not affect the manufacturer's warranty. It is a network permission, not a modification of the device.",
        "It is also worth being clear about what unlocking is not. It is not jailbreaking or rooting, which are entirely different things that replace parts of the operating system. It is not removing an activation lock. And it is not a way to get a phone off someone else's account.",
      ],
    },
    {
      heading: "What cannot be unlocked?",
      paragraphs: [
        "A phone that has been reported lost or stolen is blacklisted on the national IMEI database that Canadian carriers share. A blacklisted phone cannot be unlocked by TechBrotherz, by any other shop, or by the carrier itself, and it will not work on a Canadian network regardless of what SIM goes in it. If a secondhand phone will not activate, this is the most common reason.",
        "A phone with an outstanding balance or an unpaid device financing agreement is a related case. The carrier can refuse to unlock it until the account is settled, and that is a billing matter rather than a technical one.",
        "An iPhone locked to someone else's Apple Account through Activation Lock is a different restriction entirely, and unlocking will not help. Only the original owner can remove that, by signing the device out of their account. We check for both of these before you pay, because we would rather you kept the money than paid for something that cannot work.",
      ],
    },
    {
      heading: "How do you check whether a phone is already unlocked?",
      paragraphs: [
        "The simplest test is the definitive one: put a SIM from a different carrier in the phone and see whether it registers on the network and can make a call. If it does, the phone is unlocked. Nothing else you can check on the device is as reliable as that.",
        "On an iPhone, Settings, General, About has a Carrier Lock line that reads No SIM restrictions when the phone is unlocked. That line is accurate on current iOS versions and it is worth checking before you pay anyone. On Android the equivalent varies by manufacturer, which is why the second-SIM test remains the one we trust.",
        "Bring the phone to the counter at 3317 17 Ave SE and we will check it for you. If it turns out the phone is already unlocked, that is the end of the conversation and there is nothing to pay.",
      ],
    },
    {
      heading: "Can TechBrotherz remove Factory Reset Protection (FRP)?",
      paragraphs: [
        "Factory Reset Protection is the Google account lock built into Android. When a phone is factory reset without first being signed out of its Google account, the phone refuses to finish setting up until that account's credentials are entered. It exists to make a stolen phone worthless, and it catches legitimate owners too: a secondhand phone reset by a seller who forgot to sign out, or your own phone after a reset when the account password is long forgotten.",
        "TechBrotherz removes FRP from Android phones in that situation, and proof of ownership is required before any work starts. That requirement is not negotiable, for the same reason a blacklisted phone cannot be unlocked: the lock exists to protect owners, and we will not defeat it for a phone that cannot be shown to be yours. Bring what you have, such as the original receipt, and phone (403) 273-8324 ahead of the trip to confirm it is enough.",
        "If the phone still has the Google account signed in and you simply cannot remember the password, try Google's own account recovery first, because that route is free. FRP removal is for the case where the phone is already reset and stuck at the verification screen.",
      ],
    },
    {
      heading: "How long does unlocking take?",
      paragraphs: [
        `Most unlocks at TechBrotherz are completed the same day. You bring the phone in with its IMEI, we confirm the model and carrier, and in most cases the phone is unlocked before the day is out.`,
        "Some combinations of carrier and model take longer, and a small number cannot be done at all. We check which case you are in before you pay, rather than taking the money and telling you afterwards. If it cannot be done, you do not pay for the attempt.",
        "You will need the IMEI, which is the fifteen-digit number unique to the handset. Dial star-hash-zero-six-hash on the phone and it appears on screen, or find it in the settings under About. It is also printed on the original box and on the SIM tray of some models.",
      ],
    },
  ],
  whoFor: [
    "Anyone who has bought a phone secondhand and cannot reach the original account holder to have it unlocked.",
    "People who have brought a phone from another country and want it working on a Canadian network.",
    "Anyone switching carriers who wants to keep the handset they already own.",
    "Anyone locked out of their own Android phone by Factory Reset Protection after a reset, who can show the phone is theirs.",
  ],
  limits: () => [
    {
      title: "Blacklisted phones cannot be unlocked",
      body: "A handset reported lost or stolen sits on the shared national IMEI database. No shop and no carrier can unlock it, and it will not work on a Canadian network. We check this before you pay.",
    },
    {
      title: "FRP removal requires proof of ownership",
      body: "Factory Reset Protection exists to make a stolen phone worthless, and we will not defeat it for a phone that cannot be shown to be yours. Bring proof of ownership, such as the original receipt, and call ahead to confirm what you have is enough.",
    },
    {
      title: "Activation Lock is not carrier lock",
      body: "An iPhone signed into someone else's Apple Account cannot be used until they remove it. That is a different restriction from carrier locking and unlocking does not touch it.",
    },
    {
      title: "Ask your carrier before you pay us",
      body: "If the phone is on your own Canadian account, your carrier must unlock it free of charge. We would rather tell you that and lose the sale than charge you for something you can get for nothing.",
    },
  ],
  faqs: () => [
    {
      question: "How much does it cost to unlock a phone in Calgary?",
      answer: `TechBrotherz in Calgary unlocks phones from any Canadian carrier, usually the same day. Before paying, ask your own carrier: under the CRTC Wireless Code, Canadian carriers must unlock a phone on your account free of charge on request, and every phone sold in Canada since 1 December 2017 is already unlocked.`,
    },
    {
      question: "Can TechBrotherz unlock a phone reported lost or stolen?",
      answer:
        "No. A phone reported lost or stolen is blacklisted on the national IMEI database shared by Canadian carriers, and no repair Store or carrier can unlock or reactivate it. TechBrotherz checks the IMEI before taking payment, so a blacklisted phone is identified before you spend anything.",
    },
    {
      question: "Does unlocking a phone erase my data or void the warranty?",
      answer:
        "No. Carrier unlocking removes a network restriction and changes nothing else on the handset. It does not erase data, does not alter the operating system, does not sign you out of your Apple or Google account, and does not affect the manufacturer's warranty. It is a network permission rather than a modification to the phone.",
    },
    {
      question: "Can TechBrotherz remove a Google account lock (FRP) from my phone?",
      answer:
        "Yes. TechBrotherz in Calgary removes Factory Reset Protection from Android phones that are stuck at the Google account verification screen after a reset. Proof of ownership is required before any work starts, because the lock exists to protect owners and TechBrotherz will not defeat it on a phone that cannot be shown to be yours.",
    },
  ],
  globalCategories: ["unlocking", "walkin"],
  sources: [
    {
      label: "CRTC, Telecom Regulatory Policy CRTC 2017-200",
      href: "https://crtc.gc.ca/eng/archive/2017/2017-200.htm",
      note: "The CRTC's review of the Wireless Code, which required that from 1 December 2017 all devices sold in Canada be provided unlocked, and that carriers unlock devices free of charge on request.",
    },
  ],
};

/* --------------------------------------------------------- password reset */

const passwordReset: ServiceDef = {
  slug: "password-reset",
  h1: "Computer Password Reset in Calgary",
  eyebrow: "Password reset",
    seoTitle: "Computer Password Reset Calgary | Files Kept",
  seoDescription:
        "Locked out of Windows? TechBrotherz in Calgary resets computer passwords and leaves your files exactly where they are. Walk in, proof of ownership needed.",
  serviceType: "Computer password reset",
  repairSlugs: [],
  brandSlugs: ["laptops-desktops"],
  flatSlugs: ["password-reset", "diagnostics"],
  deviceTypes: ["laptop"],
  localPath: "/computer-repair-calgary",
  siblings: ["/services/computer-repair", "/services/virus-removal"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, resets Windows passwords and restores access to a computer you are locked out of, leaving every file on the machine exactly where it is.`,
  answer: () =>
    `TechBrotherz in Calgary resets a Windows computer password, restoring access to a machine you are locked out of without deleting your files. Proof that the computer is yours is required before any work starts. Most password resets are finished the same day. A Microsoft account password is reset through Microsoft rather than on the machine, and TechBrotherz will tell you which case applies.`,
  keyFacts: () => [
    { label: "What it does", value: "Restores access without deleting your files" },
    { label: "Your files", value: "Left exactly where they are" },
    { label: "Time", value: "Usually the same day" },
    { label: "Proof of ownership", value: "Required before any work starts" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  process: [
    {
      title: "Bring the computer and proof it is yours",
      body: "Photo identification plus something linking you to the machine: the original receipt, the box, or an account on the computer in your name. This is not negotiable, and it is the reason the service is safe to offer.",
      art: "lock",
    },
    {
      title: "We identify the account type",
      body: "A local Windows account and a Microsoft account are two different situations. Only one of them is reset on the machine, and we work out which you have before quoting.",
      art: "diagnostic",
    },
    {
      title: "You approve the flat price",
      body: "A password reset is quoted as one flat figure, agreed before we start. If it turns out to be a Microsoft account we cannot reset on the machine, we will tell you and there is nothing to pay.",
      art: "keyboard",
    },
    {
      title: "We restore access",
      body: "The account is made accessible again and your files, programs and settings stay exactly where they were. Nothing is wiped.",
      art: "board",
    },
    {
      title: "You set a new password at the counter",
      body: "You choose the new password yourself and we do not keep a copy. Write it down somewhere you will find it.",
      art: "screen",
    },
  ],
  sections: () => [
    {
      heading: "What happens to my files during a password reset?",
      paragraphs: [
        "Your files stay exactly where they are. A password reset at TechBrotherz restores access to the account rather than clearing the machine, so documents, photos, programs, browser bookmarks and settings are all untouched. This is the whole point of the service, and it is what separates it from the advice people find online.",
        "That advice is usually to reinstall Windows, which does restore access to the computer, and does so by removing everything that was on it. If the files on the machine matter to you, that is a very expensive way to solve a password problem. Bring it to the counter first.",
        `A password reset leaves your files where they are. A Windows installation clears the drive. If you were considering the second because you thought it was the only option, it is worth knowing the first exists.`,
      ],
    },
    {
      heading: "What is the difference between a local account and a Microsoft account?",
      paragraphs: [
        "Windows computers use one of two kinds of sign-in, and which one you have determines whether the password can be reset on the machine at all. A local account exists only on that computer, and its password is stored on the machine itself. A Microsoft account signs in against Microsoft's servers using an email address, and its password lives with Microsoft rather than on your desktop.",
        "A local account is what TechBrotherz resets. The password is on the machine, and access can be restored at the counter without touching your files. If the sign-in screen shows just a name with no email address underneath, this is almost always what you have.",
        "A Microsoft account password is reset through Microsoft's own recovery process, using the recovery email address or phone number attached to the account. We will walk you through that at the counter, and there is nothing to pay, because it is not work we did. If the sign-in screen shows an email address, this is the case you are in.",
      ],
    },
    {
      heading: "Why does TechBrotherz ask for proof of ownership?",
      paragraphs: [
        "Because a service that restores access to a locked computer, without proof that the computer belongs to the person asking, is a service for getting into other people's machines. TechBrotherz requires photo identification and something that links you to the computer before any password work begins, with no exceptions.",
        "Something that links you to the machine means the original receipt, the box it came in, an account already on the computer that is in your name, or a plausible and checkable account of how you came to own it. Staff make that judgement at the counter, and they are entitled to decline.",
        "If you cannot demonstrate the computer is yours, we will not do the work. That will occasionally be inconvenient for someone with a genuine claim who has lost their paperwork, and it is still the right rule, because the alternative is worse for everybody.",
      ],
    },
    {
      heading: "What if you have forgotten a BIOS or drive encryption password?",
      paragraphs: [
        "These are different from a Windows sign-in password and they are much harder problems. A BIOS or UEFI password is stored on the motherboard and blocks the machine before Windows starts. On some machines it can be cleared and on others it cannot, depending entirely on the manufacturer and the model.",
        "A BitLocker or drive encryption password is different again, and it is the one case where there is genuinely nothing anyone can do. The drive contents are encrypted, and without the password or the recovery key the data is not recoverable by TechBrotherz, by the manufacturer, or by anyone else. That is the encryption working exactly as designed.",
        "If you have a BitLocker recovery key saved to a Microsoft account, that is the route back in, and we will help you find it. If there is no key, the honest answer is that the data is gone, and we will tell you that rather than charge you to find out slowly.",
      ],
    },
    {
      heading: "How can you avoid being locked out again?",
      paragraphs: [
        "The most reliable protection is a password reset disk or a linked recovery method set up while you still have access to the machine. On a local Windows account, a reset disk on a USB stick takes two minutes to create and turns a lockout into a five-minute fix. Almost nobody makes one, which is why this service exists.",
        "If you use a Microsoft account, make sure the recovery email address and phone number on it are current. Those are what Microsoft uses to verify you, and an account with a recovery address you no longer control is an account you can be locked out of permanently.",
        "For anyone managing several passwords, a password manager is worth the small amount of setup. Failing that, a written note somewhere secure at home beats a password you were certain you would remember. Being locked out of your own computer is a common problem and an avoidable one.",
      ],
    },
  ],
  whoFor: [
    "Anyone locked out of a Windows computer whose files they need, without a current backup.",
    "People who inherited or bought a computer that still has an old local account password on it, with proof of ownership.",
    "Anyone who was told the only fix is to reinstall Windows and would rather keep what is on the machine.",
    "People who want the account type identified properly before paying for anything.",
  ],
  limits: () => [
    {
      title: "No proof of ownership, no work",
      body: "Photo identification and something linking you to the computer are required before any password work starts. Staff can decline, and they will. This is what makes the service safe to offer at all.",
    },
    {
      title: "Encrypted drives cannot be opened without the key",
      body: "If BitLocker or another full-disk encryption is on and the recovery key is lost, the data is not recoverable by anyone. That is the encryption working as designed, and no shop can get around it.",
    },
    {
      title: "Microsoft account passwords are reset by Microsoft",
      body: "If the machine signs in with an email address, the password lives with Microsoft rather than on the computer. We will show you the recovery process at the counter, and there is nothing to pay.",
    },
  ],
  faqs: () => [
    {
      question: "How much does a computer password reset cost in Calgary?",
      answer: `A computer password reset at TechBrotherz in Calgary is quoted as one flat figure, with your files left exactly where they are. Proof that the computer is yours is required before any work starts. Most resets are finished the same day.`,
    },
    {
      question: "Will a password reset delete my files?",
      answer:
        "No. A password reset at TechBrotherz restores access to the account and leaves documents, photos, programs and settings untouched. Reinstalling Windows also restores access to a locked computer, but it clears the drive. TechBrotherz resets the password instead, which is why the files survive.",
    },
    {
      question: "Can TechBrotherz reset a password on any computer brought in?",
      answer:
        "No. TechBrotherz requires photo identification and proof that the computer belongs to you, such as the original receipt, the box, or an account on the machine in your name, before any password work begins. Staff can and do decline when ownership cannot be demonstrated.",
    },
    {
      question: "What if my computer is encrypted with BitLocker?",
      answer:
        "If BitLocker or another full-disk encryption is enabled and the recovery key is lost, the data cannot be recovered by TechBrotherz or anyone else. A recovery key saved to a Microsoft account is the route back in, and TechBrotherz will help you locate it. Without a key, the encryption is doing exactly what it was designed to do.",
    },
  ],
  globalCategories: ["walkin", "data"],
  sources: [],
};

/* ----------------------------------------------------------- virus removal */

const virusRemoval: ServiceDef = {
  slug: "virus-removal",
  h1: "Virus and Malware Removal in Calgary",
  eyebrow: "Virus removal",
    seoTitle: "Virus Removal Calgary | Malware and Pop-Ups",
  seoDescription:
        "Virus and malware removal at TechBrotherz in Calgary, with security software left in place. Pop-ups, browser hijackers and fake warnings dealt with properly.",
  serviceType: "Virus removal",
  repairSlugs: [],
  brandSlugs: ["laptops-desktops"],
  flatSlugs: ["virus-removal", "diagnostics", "tune-up", "windows-installation"],
  deviceTypes: ["laptop"],
  localPath: "/computer-repair-calgary",
  siblings: ["/services/computer-repair", "/services/password-reset"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, removes viruses, malware, adware and browser hijackers from Windows computers, and leaves security software in place so the same thing does not come straight back.`,
  answer: () =>
    `TechBrotherz in Calgary removes viruses and malware from a computer, including security software left installed and running afterwards. Pop-ups that will not close, a browser that opens on a page you did not choose, and fake warnings telling you to call a support number are the three most common symptoms. Most virus removals are finished the same day, and your files stay on the machine.`,
  keyFacts: () => [
    { label: "Your files", value: "Documents and photos stay on the machine" },
    { label: "Included", value: "Security software installed and running" },
    { label: "Your files", value: "Left on the machine" },
    { label: "Time", value: "Usually the same day" },
    {
      label: "If it is too far gone",
      value: "A clean Windows install, which clears the drive",
    },
  ],
  process: [
    {
      title: "Tell us what you are seeing",
      body: "Pop-ups, a changed homepage, a warning telling you to call a number, programs you did not install, or a machine that has suddenly become slow. The symptom points at the type of infection.",
      art: "diagnostic",
    },
    {
      title: "We scan properly",
      body: "More than one scanning engine, because no single one catches everything, and a manual look at what is actually starting with the machine.",
      art: "board",
    },
    {
      title: "We remove what is there",
      body: "Malware, adware, browser extensions that were installed without you agreeing, scheduled tasks that reinstall the thing, and startup entries that bring it back after a reboot.",
      art: "lock",
    },
    {
      title: "We leave security software running",
      body: "A machine cleaned and then left unprotected is a machine that will be back. Security software is installed and configured before it leaves.",
      art: "screen",
    },
    {
      title: "We tell you how it got in",
      body: "Most infections arrive one of three ways, and knowing which one it was is what stops it happening again next month.",
      art: "battery",
    },
  ],
  sections: () => [
    {
      heading: "How do you know if a computer has a virus?",
      paragraphs: [
        "The clearest signs are ones you cannot miss. Pop-up windows that appear when no browser is open, a web browser that starts on a search page you never chose, toolbars and extensions you did not install, and programs appearing in your list that you have no memory of adding. Those are adware and browser hijackers, and they are the most common infections by a wide margin.",
        "A second group is subtler and more serious. A computer that has suddenly become much slower, a fan running hard while nothing is open, or network activity when the machine should be idle can all mean something is running that you did not start. That is worth having looked at rather than living with.",
        "The most dangerous sign is a full-screen warning telling you the computer is infected and giving a phone number to call for support. That warning is itself the scam. No real security software asks you to phone anyone. If you are seeing one, do not call the number, and do not let anyone talk you into giving them remote access.",
      ],
    },
    {
      heading: "What does virus removal at TechBrotherz include?",
      paragraphs: [
        `Virus removal at TechBrotherz covers scanning the machine with more than one engine, removing what is found, clearing the browser extensions and search settings that were changed without your agreement, and dealing with the scheduled tasks and startup entries that quietly reinstall an infection after a reboot.`,
        "That last part is what separates a real removal from running a free scanner. Modern adware does not sit in one file waiting to be deleted. It leaves a scheduled task, a startup entry and a browser policy behind, and if those are not cleaned up the machine looks fixed for a day and then goes back to how it was.",
        "Security software is installed and left running when the machine goes home. A computer that has just been cleaned and then handed back with nothing protecting it is a computer that will be back in a few weeks, and that helps nobody.",
      ],
    },
    {
      heading: "Will virus removal delete my files?",
      paragraphs: [
        `Your files stay on the machine. Virus removal at TechBrotherz targets the malicious software and the settings it changed, not your documents and photos. This is different from a clean Windows installation, which clears the drive entirely.`,
        "There is one honest exception. If a file on the machine is itself the infection, that file gets removed, and occasionally that is something a person downloaded on purpose without knowing what it was. We will tell you what was removed rather than leaving you to discover it.",
        "Ransomware is the case where files are already gone before the machine arrives, because it encrypts them and demands payment. If that is what has happened, removing the malware stops it spreading but does not decrypt what it already took. A backup is the only real answer to ransomware, and that is worth setting up before you need it.",
      ],
    },
    {
      heading: "When is a clean install better than removing the infection?",
      paragraphs: [
        "Most infections are removable, and removal is the right answer because it keeps everything on the machine where it is. Adware, browser hijackers, unwanted extensions and the common families of malware all come off cleanly.",
        `Some do not. If an infection has been present for a long time, if there are several stacked on top of each other, or if what is there has burrowed into the system deeply enough that removing it risks leaving pieces behind, a clean Windows installation is the more honest answer. You end up with a machine you can trust rather than one you are hoping about.`,
        "We will tell you which case you are in before doing the work, and we will not quietly upsell the more expensive option. If removal will do the job, removal is what you should pay for.",
      ],
    },
    {
      heading: "How do computers get infected in the first place?",
      paragraphs: [
        "Three routes account for most of what we see. The first is bundled software: a free program downloaded from a site that wraps it in an installer full of extras, where the toolbar and the search hijacker are technically things you agreed to during a next-next-finish installation.",
        "The second is fake update prompts. A page that tells you your browser or a plugin is out of date and offers a download is one of the most effective tricks there is, because it looks like exactly the thing you are supposed to do. Real updates come from inside the browser or from the operating system, never from a web page you happened to land on.",
        "The third is email attachments and links, which is the oldest route and still works. If an attachment is unexpected, even from someone you know, treat it as suspicious. When we hand a machine back, we will tell you which of the three it was, because knowing that is what stops the next one.",
      ],
    },
  ],
  whoFor: [
    "Anyone getting pop-ups or fake security warnings they cannot close.",
    "People whose browser opens on a search page they did not choose, or has toolbars they never installed.",
    "Anyone whose computer has become slow and noisy without an obvious explanation.",
    "People who were nearly caught by a support scam and want the machine checked properly.",
  ],
  limits: () => [
    {
      title: "Ransomware encryption cannot be undone",
      body: "If files have already been encrypted, removing the malware stops it spreading but does not bring them back. Without a backup, those files are gone, and no shop can decrypt them.",
    },
    {
      title: "Sometimes a clean install is the honest answer",
      body: "If an infection is deep enough that removal risks leaving parts behind, we will say so rather than take the cheaper job and hand you a machine we are not confident in.",
    },
    {
      title: "We cannot undo money already sent to a scammer",
      body: "If someone was given remote access or paid a fake support line, tell your bank immediately. We can clean the machine and check what was left behind, and the financial side has to go through your bank.",
    },
  ],
  faqs: () => [
    {
      question: "How much does virus removal cost in Calgary?",
      answer: `Virus and malware removal at TechBrotherz in Calgary is quoted as one flat figure, including security software installed and left running afterwards. The work covers scanning with more than one engine, removing what is found, and clearing the startup entries and scheduled tasks that otherwise bring an infection back after a reboot.`,
    },
    {
      question: "Will removing a virus delete my documents and photos?",
      answer:
        "No. Virus removal at TechBrotherz targets the malicious software and the settings it changed, and leaves your documents, photos and programs on the machine. A clean Windows installation is the option that clears the drive, and TechBrotherz will tell you which of the two your computer actually needs.",
    },
    {
      question: "I got a warning telling me to call a support number. Is it real?",
      answer:
        "No. A full-screen warning giving a phone number to call is the scam itself, not a detection of one. No legitimate security software asks you to telephone anyone. Do not call the number and do not grant remote access. Bring the computer to TechBrotherz in Calgary and it will be checked properly.",
    },
    {
      question: "How did my computer get infected?",
      answer:
        "Three routes account for most infections: free software bundled with extras during a next-next-finish installation, fake update prompts on web pages that look like real browser or plugin updates, and email attachments or links. TechBrotherz identifies which route was used when handing a machine back, because that is what prevents the next infection.",
    },
  ],
  globalCategories: ["walkin", "data"],
  sources: [],
};

/* ------------------------------------------------------ game console repair */

/**
 * Added on the client's instruction 2026-08: "In repairs please add Gaming
 * consoles XBox, XBox 1 series PS4 ps5 Nintendo Switch". The client named the
 * consoles but not which repairs they carry out on them, so this page names
 * the consoles and the diagnose-first process, describes the common faults as
 * symptoms people bring in, and never claims a specific fix or a price.
 * When the client confirms the repair list, the sections tighten up.
 */
const gameConsoleRepair: ServiceDef = {
  slug: "game-console-repair",
  h1: "Game Console Repair in Calgary",
  eyebrow: "Console repair",
  seoTitle: "Game Console Repair Calgary | Xbox, PS5, Switch",
  seoDescription:
    "Game console repair at TechBrotherz in Calgary: Xbox One, Xbox Series X and S, PS4, PS5 and Nintendo Switch. Diagnosed first, price agreed before any work.",
  serviceType: "Game console repair",
  repairSlugs: [],
  brandSlugs: [],
  flatSlugs: [],
  deviceTypes: [],
  localPath: "/locations/calgary",
  siblings: ["/services/computer-repair", "/services/phone-repair"],
  lead: () =>
    `TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, takes in game consoles for repair: the Xbox One, the Xbox Series X and Series S, the PlayStation 4 and 5, and the Nintendo Switch. Every console is diagnosed first, and the price is agreed before any work starts.`,
  answer: (c) =>
    `TechBrotherz in Calgary repairs game consoles, including the Xbox One, Xbox Series X and Series S, PlayStation 4, PlayStation 5 and Nintendo Switch. Every console is diagnosed before a price is quoted, no work starts until the price is agreed, and completed repairs carry a ${c.warrantyDays}-day warranty. No appointment is needed.`,
  keyFacts: (c) => [
    { label: "Consoles", value: "Xbox One, Xbox Series X and S, PS4, PS5, Nintendo Switch" },
    { label: "How pricing works", value: "Diagnosed first, one figure agreed before any work" },
    { label: "Warranty", value: `${c.warrantyDays} days on every repair` },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Your games and saves", value: "A hardware repair does not touch your account" },
  ],
  process: [
    {
      title: "Tell us what the console is doing",
      body: "No picture on the television, a fan that roars and then the console shuts down, discs that will not read, a controller that drifts, or a console that will not power on at all. The symptom narrows the fault before the case is even open.",
      art: "diagnostic",
    },
    {
      title: "We diagnose it properly",
      body: "The console is opened and tested to find the actual fault rather than the most common one. A console that shows no picture can be a port, a board fault or a power problem, and the price differs between them.",
      art: "board",
    },
    {
      title: "You approve one figure",
      body: "The diagnosis becomes a single quoted price covering the part and the labour, and nothing happens to the console until you have agreed it. If the honest answer is that the repair is not worth the cost, that is what you will hear.",
      art: "screen",
    },
    {
      title: "We do the repair and test it",
      body: "The console is repaired, reassembled and tested doing the thing it came in failing to do: outputting a picture, reading a disc, holding a connection, staying cool under load.",
      art: "port",
    },
    {
      title: "You collect it with the warranty",
      body: "Completed console repairs are covered by the same warranty as every other repair at the counter. Bring it straight back if the fault returns inside that period.",
      art: "battery",
    },
  ],
  sections: (c) => [
    {
      heading: "Which game consoles does TechBrotherz repair?",
      paragraphs: [
        "TechBrotherz in Calgary takes in the consoles people actually own: the Xbox One family, the Xbox Series X and Series S, the PlayStation 4 in its original, Slim and Pro versions, the PlayStation 5 in both disc and digital editions, and the Nintendo Switch, including the Switch Lite and the OLED model.",
        "Console repair works differently from phone repair at the same counter. Phone repairs are published as fixed prices per model because the same screen goes into the same handset every time. Console faults vary more, so a console is diagnosed first and quoted as one figure before any work starts, rather than priced off a list.",
        "If your console is older than the ones named here, phone the Store before you travel. Whether an older console can be repaired depends on the fault and on whether the part can still be sourced, and that is a two-minute conversation rather than a wasted trip.",
      ],
    },
    {
      heading: "What are the most common console faults?",
      paragraphs: [
        "The single most common console fault brought in anywhere is a damaged HDMI port. A console that powers on but shows no picture on the television, or only shows one when the cable is held at an angle, usually has a port that has been bent by the plug being knocked or forced. The port sits directly on the main board, which is why it is a workshop job rather than a swap.",
        "Heat is the second family of faults. A fan that has become loud, a console that shuts itself down partway through a session, or one that feels hot enough to worry about is usually choked with dust inside, sometimes with thermal paste that has dried out over the years. Left alone, heat problems get worse rather than better.",
        "The rest are specific to the machine: disc drives that no longer accept or read discs on the PlayStation and Xbox, Joy-Con sticks that drift on the Nintendo Switch, controllers that will not hold a connection, and consoles that will not power on at all. Each of these is a different diagnosis, which is exactly why the console is diagnosed before it is quoted.",
      ],
    },
    {
      heading: "How does console repair pricing work?",
      paragraphs: [
        "A console repair at TechBrotherz is diagnosed first and quoted as one figure that includes the part and the labour, agreed with you before any work starts. There is no list of console prices on this site because publishing one honestly is not possible: the same symptom can have faults at very different costs behind it.",
        "No picture on the screen is the clearest example. That symptom can be a bent HDMI port, a failed component behind the port, or a fault elsewhere on the board, and those are different amounts of work. Quoting after diagnosis means the figure you agree to is for the fault your console actually has.",
        "If the diagnosis shows the repair costs more than the console is sensibly worth, you will be told that plainly, with the diagnosis explained, and you decide what happens next. A shop that talks someone into repairing a console they should replace is not one they come back to.",
      ],
    },
    {
      heading: "Is an older console worth repairing?",
      paragraphs: [
        "Often yes, and for a reason that does not apply to phones: a console library. A PlayStation 4 with years of purchased games, saves and a familiar controller is worth more to its owner than its resale price suggests, and a single repair that keeps it running is usually far cheaper than replacing the console and re-buying anything that does not carry forward.",
        "The honest exceptions are faults that sit deep in the main processor or memory of the console, where the repair is either not economical or not reliable enough to stand behind. If the diagnosis lands there, TechBrotherz says so rather than selling a repair that is likely to come back.",
        "Digital purchases and game saves live with your Xbox, PlayStation or Nintendo account, not inside the console's fault. A hardware repair does not sign you out of anything, and if a console does have to be replaced, signing in on the new machine brings your library with it.",
      ],
    },
    {
      heading: "What should you bring in with the console?",
      paragraphs: [
        "Bring the console and its power lead. Several faults, especially a console that will not turn on, can sit in the power supply or the lead rather than the console itself, and testing with your own lead answers that immediately. For the original Xbox One, which has an external power brick, bring the brick too.",
        "If the problem involves the picture, bring the HDMI cable you use at home. A damaged cable produces the same symptom as a damaged port at a fraction of the cost, and it is checked first precisely because it is the cheap answer.",
        `If the problem involves a controller or a Joy-Con, bring that as well, since the fault can be in the controller, the console or the pairing between them. Discs and games can stay at home. Completed repairs are covered by the ${c.warrantyDays}-day warranty, and no work starts before you have agreed the price.`,
      ],
    },
  ],
  whoFor: [
    "Anyone whose console powers on but shows no picture, or only shows one when the cable sits at an angle.",
    "People whose console has become loud, runs hot, or shuts itself down partway through playing.",
    "Nintendo Switch owners with sticks that drift, or a console that no longer charges reliably.",
    "Anyone told a console is not fixable who wants a diagnosis and a straight answer before replacing it.",
  ],
  limits: () => [
    {
      title: "Diagnosis comes before any promise",
      body: "TechBrotherz does not quote console repairs sight unseen, because the same symptom can have faults at very different costs behind it. The console is diagnosed first, and the quote is for the fault it actually has.",
    },
    {
      title: "Some faults are not worth fixing, and we say so",
      body: "A fault deep in the console's main processor can cost more to repair than the console is worth. When the diagnosis lands there, you get that answer and the reasons, not a bill.",
    },
    {
      title: "No modifications or account work",
      body: "TechBrotherz repairs hardware faults. It does not modify consoles, unlock them to run copied games, or recover suspended platform accounts. Account problems are handled by Microsoft, Sony or Nintendo.",
    },
  ],
  faqs: (c) => [
    {
      question: "Does TechBrotherz repair game consoles in Calgary?",
      answer:
        "Yes. TechBrotherz at 3317 17 Ave SE in Calgary takes in the Xbox One, Xbox Series X and Series S, PlayStation 4, PlayStation 5 and Nintendo Switch for repair. Every console is diagnosed first, the price is agreed before any work starts, and no appointment is needed.",
    },
    {
      question: "How much does a game console repair cost in Calgary?",
      answer:
        "TechBrotherz quotes console repairs after diagnosis rather than from a price list, because the same symptom can have faults at very different costs behind it. The quote is one figure covering the part and the labour, agreed before any work starts. If the repair is not worth the console's value, that is the answer given.",
    },
    {
      question: "Can a broken HDMI port on a PS5 or Xbox be fixed?",
      answer:
        "A damaged HDMI port is the most common console fault brought in to TechBrotherz in Calgary, and it shows up as no picture on the television from a console that otherwise powers on. Bring the console and your HDMI cable: the cable is checked first because it produces the same symptom at a fraction of the cost, and the console is diagnosed and quoted before any work starts.",
    },
    {
      question: "Do console repairs come with a warranty?",
      answer: `Yes. Console repairs at TechBrotherz in Calgary carry the same ${c.warrantyDays}-day warranty as every repair at the counter. If the repaired fault returns inside that period, bring the console straight back.`,
    },
  ],
  globalCategories: ["walkin", "warranty"],
  sources: [],
};

/* -------------------------------------------------------------------- index */

export const SERVICES: ServiceDef[] = [
  phoneRepair,
  ipadRepair,
  laptopRepair,
  computerRepair,
  gameConsoleRepair,
  phoneUnlocking,
  passwordReset,
  virusRemoval,
];

const BY_SLUG = new Map(SERVICES.map((entry) => [entry.slug, entry]));

export function serviceContent(slug: string): ServiceDef | undefined {
  return BY_SLUG.get(slug);
}
