/**
 * Tier 5 pages for the tablet and computer services.
 *
 * Split from local.ts only for file size. The types, the shared-fact rule and
 * the reasoning all live there.
 */

import { checkFactUse } from "@/lib/content/local-shared";
import type { LocalDef } from "@/lib/content/local";
import { ENTITY } from "@/lib/content/local";

/* ===================================================== ipad repair calgary */

const ipadCalgary: LocalDef = {
  slug: "ipad-repair-calgary",
  h1: "iPad Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "iPad Repair Calgary | Cracked Glass and Screens",
  seoDescription:
    "iPad repair in Calgary at TechBrotherz, 3317 17 Ave SE. Cracked glass, failed screens and batteries, part and labour included, 60-day warranty, walk in.",
  serviceType: "iPad repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-ipad"],
    repairSlugs: ["glass-digitizer", "screen-replacement", "battery-replacement"],
  },
  servicePath: "/services/tablet-repair",
  repairPaths: ["/repairs/ipad-screen-replacement"],
  brandPaths: ["/repair/apple-ipad"],
  siblings: ["/tablet-repair-calgary", "/phone-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/ipad-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "Because iPad work is usually a drop-off rather than a wait, the transitway stop outside at 33 Street SE makes two short trips easy instead of one long one.",
    },
  ]),
  lead: () =>
    `${ENTITY}, repairs iPads: cracked glass, failed display panels, worn batteries and charging ports. On older iPads the glass is a separate layer from the picture, so a cracked front is often a smaller repair than people expect.`,
  answer: (c) =>
    `iPad repair in Calgary at TechBrotherz is quoted per model, free of charge, before any work starts. On older iPad models the touch glass is separate from the display panel, so a cracked front with a working picture is the smaller repair. iPad work is usually same-day rather than while you wait, and every repair carries a ${c.warrantyDays}-day warranty.`,
  keyFacts: (c) => [
    { label: "Models", value: "iPad, iPad Air and iPad Mini" },
    { label: "Time", value: "Usually same day, not while you wait" },
    { label: "Where", value: "3317 17 Ave SE, southeast Calgary" },
    { label: "Bring", value: "The model number from the back" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: () => [
    {
      heading: "Why is iPad repair in Calgary cheaper than people expect?",
      paragraphs: [
        `On many iPad models the touch-sensitive glass is a genuinely separate component from the display panel underneath, with an air gap between them. Crack the front of one of those and leave the picture undamaged, and only the glass needs replacing, which is why a cracked older iPad is one of the smaller repairs TechBrotherz quotes.`,
        "This is the opposite of every modern phone, where the two layers are laminated together at the factory and replace as one. The base iPad kept the older separated construction long after phones moved on, so a large cracked tablet can cost less to fix than a small cracked handset.",
        "The newer iPad Air and every iPad Pro changed it. Those use laminated displays where the glass is bonded directly to the panel, which looks better and costs considerably more when it breaks. Which one you have is the first thing we check, and it is why we ask for the model.",
      ],
    },
    {
      heading: "Why does an iPad repair take longer than a phone repair?",
      paragraphs: [
        "The adhesive holding an iPad's glass runs around the entire perimeter, and that is a much longer edge than a phone. It has to be warmed evenly along its whole length until it softens, then cut through slowly, then scraped off the frame before a new panel can bond. Rushing any of that bends the frame.",
        "The frame is the part that cannot be undone. An iPad's aluminium body is thin and large, which makes it easy to distort, and a bent frame will not let a new panel sit flat afterwards. Working slowly is what makes the repair repeatable rather than a gamble.",
        "In practice that makes most iPad work a same-day drop-off rather than a wait at the counter. Bring it in during the day and in most cases it is ready before we close. We give a realistic time when you drop it off and call when it is done.",
      ],
    },
    {
      heading: "Is it worth repairing an older iPad?",
      paragraphs: [
        "For older iPads with separate glass, usually yes and clearly so. The repair costs a small fraction of a replacement tablet and the device carries on doing exactly what it was doing. A cracked iPad that otherwise works is not a tablet that needs replacing, it is a tablet that needs a piece of glass.",
        "For recent iPad Pro models the calculation is genuinely closer, because a laminated display assembly is one of the more expensive parts we fit. If a repair approaches half the used value of the tablet, that is worth thinking about rather than deciding at the counter, and we would rather you thought about it.",
        "One factor people forget: iPads stay useful for years as reading, video and kitchen devices after they stop getting the latest iPadOS. A tablet that will not see another major update is often still worth fixing, because what it is actually used for has not changed.",
      ],
    },
    {
      heading: "What should you bring for an iPad repair?",
      paragraphs: [
        "The model number, which is engraved in small print on the back of the tablet. iPad generations look nearly identical and price very differently, so that number is the difference between a firm quote and an estimate. If you cannot read it we will find it at the counter.",
        "Back the iPad up before bringing it in. A glass, screen, battery or port replacement does not touch the storage and your apps and files stay exactly where they are, but a current backup is what protects you if something unexpected turns up once the device is open.",
        "If the iPad has been in liquid, say so. A tablet that has been wet can be opened, cleaned and tested and often works afterwards, but corrosion keeps spreading, so that work carries no warranty on the outcome and we will tell you that before starting rather than after.",
      ],
    },
    {
      heading: "How do you tell which iPad you have?",
      paragraphs: [
        "The model number is engraved in small print on the back of the tablet, near the bottom, and it begins with the letter A followed by four digits. That number identifies the exact generation, which is what determines whether the glass is separate from the display or laminated to it.",
        "If the engraving is worn or the tablet is in a case that is awkward to remove, the number is also in Settings, then General, then About, listed under Model Number. Either route gives us the same answer in under a minute at the counter.",
        "It matters more on iPads than on any other device we repair, because generations look nearly identical from the front and differ by a large multiple in what a screen costs. Two tablets that look the same on a table can be a cheap repair and an expensive one.",
      ],
    },
  ],
  localMix: [
    {
      title: "Cracked fronts with perfect pictures",
      body: "The most common iPad we see, and on older models the cheapest repair, because only the glass layer needs replacing.",
    },
    {
      title: "Kids' iPads and school devices",
      body: "Older base-model iPads on separated glass, which is exactly the case where repair beats replacement by a wide margin.",
    },
    {
      title: "iPad Pro screens",
      body: "Laminated assemblies and the most expensive tablet part we fit. Worth pricing carefully against the tablet's value before committing.",
    },
  ],
  faqs: () => [
    {
      question: "How much does iPad repair cost in Calgary?",
      answer: `iPad glass replacement at TechBrotherz in Calgary is quoted per model, free of charge, before any work starts. Older iPads with separated glass are the smaller repair. Laminated iPad Air and iPad Pro displays replace as one assembly and are the larger job.`,
    },
    {
      question: "Can I wait for an iPad repair in Calgary?",
      answer:
        "Usually not. iPad repairs at TechBrotherz are same-day drop-offs rather than while-you-wait, because the adhesive around the whole perimeter has to be heated evenly, cut and cleaned off before a new panel is fitted. TechBrotherz gives a realistic time at drop-off and calls when the tablet is ready.",
    },
    {
      question: "Do I need to know my iPad model before coming in?",
      answer:
        "It helps but it is not required. iPad generations look nearly identical and price very differently, and the model number is engraved in small print on the back of the tablet. TechBrotherz reads it at the counter if you cannot find it, and the number is what turns an estimate into a firm price.",
    },
  ],
  globalCategories: ["ipad", "warranty"],
};

/* =================================================== tablet repair calgary */

const tabletCalgary: LocalDef = {
  slug: "tablet-repair-calgary",
  h1: "Tablet Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Tablet Repair Calgary | Android and Windows Tablets",
  seoDescription:
    "Tablet repair in Calgary at TechBrotherz, 3317 17 Ave SE. Android and Windows tablets quoted at the counter, iPads priced per model, 60-day warranty.",
  serviceType: "Tablet repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-ipad"],
    repairSlugs: ["glass-digitizer", "screen-replacement"],
  },
  servicePath: "/services/tablet-repair",
  repairPaths: ["/repairs/ipad-screen-replacement"],
  brandPaths: ["/repair/apple-ipad"],
  siblings: ["/ipad-repair-calgary", "/laptop-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/tablet-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "Carrying a tablet on transit is easy enough, and 33 Street SE Station is on the transitway immediately outside.",
    },
  ]),
  lead: () =>
    `${ENTITY}, repairs Android and Windows tablets alongside iPads. Android tablet work is quoted at the counter rather than published in advance, because parts vary enormously between manufacturers and there is no small set of models that covers the market.`,
  answer: (c) =>
    `TechBrotherz repairs Android and Windows tablets in Calgary alongside iPads, at 3317 17 Ave SE. Android tablet repairs are quoted at the counter once the model number is known, because parts vary widely by manufacturer. Every tablet repair carries a ${c.warrantyDays}-day warranty on the part and the workmanship.`,
  keyFacts: (c) => [
    { label: "Android and Windows tablets", value: "Quoted at the counter" },
    { label: "Tablets", value: "iPad and Android tablets" },
    { label: "Bring", value: "The tablet and its model number" },
    { label: "Time", value: "Usually same day once the part is in" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: () => [
    {
      heading: "Why are Android tablet repairs quoted rather than published?",
      paragraphs: [
        "Because a published price list would mislead more often than it helped. Android tablet parts vary enormously between manufacturers and model years, and unlike iPads there is no small set of models that covers most of the market. Samsung, Lenovo, Amazon and a dozen others all build differently.",
        "So TechBrotherz identifies the exact part first, tells you what it costs and how long it takes, and you decide from there. That is slower than reading a number off a page, and it is the only way to give a figure we can stand behind. Inventing a range to look decisive would be worse.",
        "If the part is not available at a sensible price, we say so rather than taking the job. On some budget tablets the replacement screen costs more than the tablet is worth, and you are better off knowing that in two minutes at the counter than after a week of waiting.",
      ],
    },
    {
      heading: "What should you bring for a tablet repair in Calgary?",
      paragraphs: [
        "The tablet and its model number. On most Android tablets the number is printed on the back or listed in the settings under About, and it is what identifies the exact panel or battery the device takes. Without it, any quote is a guess dressed up as a price.",
        "The charger is worth bringing for a tablet that will not power on, in the same way it is for a laptop. A failed charger produces symptoms identical to a dead device, and ruling it out takes two minutes with the charger on the counter rather than a paid diagnostic.",
        "Back the tablet up first. Screen, glass, battery and port work does not touch the storage, and your apps and files stay where they are, but a current backup is what protects you if something unexpected appears once the device is open.",
      ],
    },
    {
      heading: "What tablet repairs does TechBrotherz carry out?",
      paragraphs: [
        "The same four that dominate every tablet: cracked glass, failed display panels, batteries that no longer hold a charge, and charging ports worn out by years of cable insertion. Those account for nearly every tablet that comes through the door regardless of who made it.",
        "The work is also the same shape regardless of brand. Tablet glass is sealed to the frame with adhesive around the whole perimeter, which has to be warmed, cut through and cleaned off before a new panel can bond, and the thin frame bends if it is handled unevenly.",
        "That is why tablet repairs are same-day drop-offs rather than counter work. We give a realistic time when the tablet is dropped off, and if the part has to be ordered in we say so before you leave it rather than calling with the news afterwards.",
      ],
    },
    {
      heading: "Is a cheap tablet worth repairing?",
      paragraphs: [
        "Sometimes not, and we will tell you when that is the case. On budget Android tablets the replacement display can cost a large share of what the tablet sells for new, and at that point a repair is money spent on a device that was inexpensive by design.",
        "The calculation changes on mid-range and premium tablets, and on any tablet doing a specific job well. A Galaxy Tab used daily for work, or a tablet mounted permanently in a kitchen, is worth fixing on the same arithmetic as a phone: repair beats replacement when the cost sits well below the used value.",
        "Bring it in and we will give you the figure and the honest read together. A quote that ends with a recommendation not to spend the money is a legitimate outcome, and it costs nothing to get one.",
      ],
    },
    {
      heading: "How long does it take to get a tablet part in?",
      paragraphs: [
        "For common iPad glass and the Galaxy Tab panels we see most often, parts are generally on the shelf and the repair is a same-day drop-off. For anything less common the part is ordered in, and that usually means a day or two rather than a week.",
        "We check availability and tell you before you leave the tablet, not after. That is the single most useful thing to know when deciding whether to leave a device, and finding out by phone call two days later is the outcome we are trying to avoid.",
        "If a part turns out to be unavailable at a sensible price, we say so and you take the tablet home having paid nothing. On some budget models that is the honest outcome, and it is better delivered in two minutes at the counter than after a week of waiting.",
      ],
    },
  ],
  localMix: [
    {
      title: "Samsung Galaxy Tab screens",
      body: "The most common non-Apple tablet we see in Calgary, and one where the part is usually available at a sensible price.",
    },
    {
      title: "Budget tablets not worth fixing",
      body: "On some inexpensive models the panel costs more than the tablet. We say so at the counter rather than taking the job.",
    },
    {
      title: "Charging ports on older tablets",
      body: "Years of cable insertion wears the socket. Often the only fault on a device that is otherwise fine.",
    },
  ],
  faqs: () => [
    {
      question: "Does TechBrotherz repair Android tablets in Calgary?",
      answer:
        "Yes. TechBrotherz at 3317 17 Ave SE repairs Android and Windows tablets alongside iPads. Android tablet repairs are quoted at the counter once the model number is known, because parts vary widely between manufacturers and model years and no published list would be accurate across them.",
    },
    {
      question: "Why will TechBrotherz not publish Android tablet prices?",
      answer:
        "Because a published list would mislead more often than it helped. Unlike iPads, Android tablets have no small set of models covering most of the market, and part costs vary enormously by manufacturer. TechBrotherz identifies the exact part first, then gives a figure it can stand behind.",
    },
    {
      question: "Is it worth repairing a cheap tablet?",
      answer:
        "Sometimes not. On budget Android tablets the replacement display can cost a large share of the tablet's new price, and TechBrotherz will say so at the counter rather than take the job. On mid-range and premium tablets, repair beats replacement on the same arithmetic as a phone.",
    },
  ],
  globalCategories: ["walkin", "pricing"],
};

/* =================================================== laptop repair calgary */

const laptopCalgary: LocalDef = {
  slug: "laptop-repair-calgary",
  h1: "Laptop Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Laptop Repair Calgary | Screens, Keyboards, Charging",
  seoDescription:
        "Laptop repair in Calgary at TechBrotherz, 3317 17 Ave SE. Screens, keyboards and charging sockets, quoted free at the counter. Diagnostics deducted from the repair.",
  serviceType: "Laptop repair",
  city: "Calgary",
  priceSource: {
    kind: "flat",
    flatSlugs: [
      "laptop-screen-replacement",
      "laptop-keyboard-replacement",
      "dc-charging-port-replacement",
      "diagnostics",
      "hardware-installation",
    ],
  },
  servicePath: "/services/laptop-repair",
  repairPaths: [
    "/repairs/laptop-screen-replacement",
    "/repairs/laptop-keyboard-replacement",
    "/repairs/laptop-charging-port-repair",
  ],
  brandPaths: ["/repair/laptops-desktops"],
  siblings: ["/computer-repair-calgary", "/tablet-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/laptop-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "If you would rather not carry a laptop across a car park, 33 Street SE Station on the transitway is directly outside the shop.",
    },
  ]),
  lead: () =>
    `${ENTITY}, repairs laptops: screens, keyboards and charging sockets. Bring the charger with the machine, because a failed adapter produces exactly the same symptoms as a dead laptop and costs nothing to rule out.`,
  answer: () =>
    `Laptop repair in Calgary at TechBrotherz covers screens, keyboards and charging sockets, with the part and the labour in one figure. Diagnostics carry a fixed fee that comes off the repair. The shop is at 3317 17 Ave SE, and most laptop work is finished the same day.`,
  keyFacts: () => [
    { label: "Bring", value: "The laptop and its charger, so the adapter can be ruled out" },
    { label: "Repairs", value: "Screens, keyboards, charging sockets, storage and memory" },
    { label: "Typical time", value: "Most laptop work is finished the same day" },
    { label: "Diagnostics", value: "A fixed fee, deducted from the repair if you go ahead" },
    { label: "Bring", value: "The laptop and its charger" },
  ],
  sections: () => [
    {
      heading: "Why bring the charger to a laptop repair?",
      paragraphs: [
        "Because a failed charger and a dead laptop look identical from the outside, and telling them apart with the charger on the counter takes about two minutes. Without it, the same question needs a paid diagnostic to answer, which is money spent finding out something a cable could have told us.",
        "Adapters fail regularly, usually at the strain point where the cable enters the brick, and they fail gradually rather than all at once. A charger that works when the cord is held at one angle and not another is a charger on its way out, not a laptop problem.",
        "The behaviour of the machine tells us the rest. If the charging light flickers when the plug is moved, that is the socket. If the laptop runs perfectly on mains and dies the instant it is unplugged, the socket is fine and the battery has gone.",
      ],
    },
    {
      heading: "What does a laptop diagnostic in Calgary actually check?",
      paragraphs: [
        `A diagnostic at TechBrotherz carries a fixed fee that comes off the bill if you go ahead with the repair, which makes it cost nothing whenever it leads to work. It is charged when it does not, and that is deliberate: the value is the answer, and the answer is worth something even when it is do not spend money on this machine.`,
        "It traces power delivery from the adapter through to the board, checks whether the machine posts, reads the drive's own health reporting for the reallocated sectors that appear long before a drive fails, tests memory, and watches thermal behaviour under load rather than at idle.",
        "At the end you get a specific fault and a specific price rather than a range. A laptop that will not turn on has at least five plausible causes costing very different amounts, and replacing parts in order of likelihood is a strategy that works eventually and is expensive on the way there.",
      ],
    },
    {
      heading: "Is it the laptop screen or the graphics?",
      paragraphs: [
        "This check costs nothing and is worth doing before paying for a panel. Plug the laptop into an external monitor or a television. If the external display shows a perfect picture, the machine, the graphics and the operating system are all fine and the panel is the fault.",
        "If the external display shows the same distortion, lines or blackness, the problem is not the panel at all. It is the graphics hardware, and replacing the screen would change nothing. That is an expensive mistake and it is avoidable in two minutes at home.",
        "There is a third case. If the picture flickers or cuts out as the lid moves through its range, the video cable running through the hinge is the likely fault rather than the panel, and that is a different and usually cheaper part.",
      ],
    },
    {
      heading: "Is it worth repairing an older laptop in Calgary?",
      paragraphs: [
        "Usually yes when the rest of the machine is sound. A broken screen, keyboard or charging socket is one mechanical part that has failed on a laptop whose processor, memory and storage all still work, and replacing it returns a fully working computer for a fraction of a new one.",
        "One thing changed that calculation recently. Microsoft ended support for Windows 10 on 14 October 2025, so a machine that cannot meet the Windows 11 hardware requirements keeps working but stops receiving security updates. We check that as part of a diagnostic and tell you plainly where your machine stands.",
        "The other case for pausing is a machine with several faults at once. A cracked screen alongside a failing drive and a dead battery is three repairs, and at that point the total is worth weighing honestly against a replacement rather than paying for one piece at a time.",
      ],
    },
    {
      heading: "What laptop work does TechBrotherz not do?",
      paragraphs: [
        "Board-level microsoldering. If a diagnostic finds the fault is on the mainboard itself rather than a replaceable part, that is specialist work beyond what we do at this counter, and we will say so plainly. You will have paid the diagnostic fee and got a real answer rather than an open-ended repair.",
        "Data recovery from a physically failed drive. That needs a clean room and specialist equipment. We can tell you whether the drive is the problem, and we will not take your money to attempt something we cannot finish.",
        "Liquid damage carries no warranty. A laptop that has had liquid in it gets opened, cleaned and tested, and often works afterwards, but corrosion keeps spreading under components. We will attempt it and tell you what we find, without promising the outcome.",
      ],
    },
  ],
  localMix: [
    {
      title: "Cracked screens on student machines",
      body: "The most common laptop repair, and almost always worth doing when the rest of the machine is fine.",
    },
    {
      title: "Charging sockets worked loose",
      body: "Years of the cable being knocked while charging on a bed or sofa. The charging light flickers when the plug moves.",
    },
    {
      title: "Spills on keyboards",
      body: "Shut it down immediately, unplug it, turn it upside down and bring it in. Do not switch it back on to test it.",
    },
  ],
  faqs: () => [
    {
      question: "How much does laptop repair cost in Calgary?",
      answer: `Laptop repair at TechBrotherz in Calgary covers screens, keyboards and charging sockets, quoted free of charge before any work starts with the part and the labour in one figure. Diagnostics carry a fixed fee that is deducted from the repair if you proceed.`,
    },
    {
      question: "Should I bring my charger to a laptop repair?",
      answer:
        "Yes. A failed charger produces symptoms identical to a dead laptop, and ruling it out with the charger on the counter takes about two minutes. Without it, the same question requires a paid diagnostic. TechBrotherz asks every laptop customer to bring the adapter.",
    },
    {
      question: "How do I know if my laptop screen or graphics card is broken?",
      answer:
        "Plug the laptop into an external monitor. If the external display shows a perfect picture, the panel is at fault and replacing it will fix the machine. If the external display shows the same problem, the graphics hardware is the cause and a new screen would change nothing.",
    },
  ],
  globalCategories: ["turnaround", "warranty"],
};

/* ================================================= computer repair calgary */

const computerCalgary: LocalDef = {
  slug: "computer-repair-calgary",
  h1: "Computer Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Computer Repair Calgary | Flat Prices, No Hourly Rate",
  seoDescription:
        "Computer repair in Calgary at TechBrotherz, 3317 17 Ave SE. Diagnostics, Windows installation and tune-ups, quoted per job and agreed before work starts.",
  serviceType: "Computer repair",
  city: "Calgary",
  priceSource: {
    kind: "flat",
    flatSlugs: [
      "diagnostics",
      "windows-installation",
      "tune-up",
      "virus-removal",
      "password-reset",
      "hardware-installation",
      "program-installation",
    ],
  },
  servicePath: "/services/computer-repair",
  repairPaths: [
    "/repairs/windows-installation",
    "/repairs/computer-tune-up",
    "/repairs/computer-diagnostics",
  ],
  brandPaths: ["/repair/laptops-desktops"],
  siblings: ["/laptop-repair-calgary", "/phone-unlocking-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/computer-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "A desktop tower is one thing you probably will drive with, though the 33 Street SE transitway stop outside is there for the collection trip.",
    },
  ]),
  lead: () =>
    `${ENTITY}, repairs desktop computers and laptops at flat figures agreed before work starts: diagnostics, Windows installation, and a full clean-up and tune-up. Bring the tower alone, we have monitors and keyboards here to test with.`,
  answer: () =>
    `Computer repair in Calgary at TechBrotherz is quoted per job rather than per hour, covering diagnostics, a Windows installation with an office suite and security software, and a clean-up and tune-up. The shop is at 3317 17 Ave SE. Bring the tower alone, and the figure is agreed before anything starts.`,
  keyFacts: () => [
    { label: "Bring", value: "The tower alone, monitors and keyboards are here to test with" },
    { label: "Quoted", value: "Per job, not per hour" },
    { label: "Diagnostics", value: "A fixed fee, deducted from the repair if you go ahead" },
    { label: "Covers", value: "Diagnostics, Windows installation, tune-ups, hardware fitting" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  sections: () => [
    {
      heading: "Why is computer repair priced per job rather than per hour?",
      paragraphs: [
        "Because an hourly rate makes the customer carry the risk of a job taking longer than expected, and on computer work it frequently does. A flat price means a Windows installation that runs into an awkward driver problem costs exactly what was quoted, and the person absorbing that is us rather than you.",
        `So a diagnostic, a Windows installation with an office suite and security software, a clean-up and tune-up, and hardware or program installation per item are each quoted as one figure for the whole job. Those are the totals, agreed at the counter before anything begins.`,
        "It also removes the incentive to work slowly, which is worth saying plainly. Nobody here benefits from a job taking three hours instead of one, so the machine gets done properly and gets done.",
      ],
    },
    {
      heading: "Why has my computer become so slow?",
      paragraphs: [
        "Almost never one dramatic fault. Usually four ordinary ones stacked: a startup list that has collected a dozen programs over the years, temporary files and old installers filling the drive, updates that have fallen months behind, and dust blocking the cooling so the processor throttles itself to stay cool.",
        `A clean-up and tune-up addresses all four, including the physical cleaning no software utility can do. Dust packed into a heatsink stops heat escaping, so the processor hits its limit sooner and slows down deliberately, which is why a machine feels fine for five minutes and then drags.`,
        "The single biggest improvement on an older machine is usually replacing a mechanical hard drive with a solid-state one. If the diagnostic shows that is the real limit, we will tell you, because it turns a frustrating computer into a usable one more reliably than any amount of software cleaning.",
      ],
    },
    {
      heading: "What does the Windows 10 end of support mean for a Calgary customer?",
      paragraphs: [
        "Microsoft ended support for Windows 10 on 14 October 2025. A computer still running it works exactly as it did the day before and nothing switches off. What stops is the monthly security updates, so newly discovered vulnerabilities stay unpatched on that machine from then on.",
        "The practical question is whether the machine can run Windows 11, which has stricter hardware requirements than any previous Windows upgrade, particularly around processor generation and the security chip on the board. Plenty of computers that are fast enough do not qualify, which is unusual and catches people out.",
        "We check this as part of a diagnostic and say plainly which side of the line a machine falls on. It changes what is worth spending, and it is better to know before paying for work than after.",
      ],
    },
    {
      heading: "What should you bring for computer repair in Calgary?",
      paragraphs: [
        "For a desktop, the tower alone. We have monitors, keyboards and mice here to test with, so there is no need to disconnect a whole setup and carry it in. Bring the power cable if it is a non-standard one, and mention any password needed to log into the machine.",
        "For a laptop, bring the machine and its charger together. A laptop that will not power on or charge is sometimes the charger's fault rather than the computer's, and testing with your own charger answers that in the first minute rather than after a diagnostic.",
        "Tell us what the computer is doing and when it started. Slow, noisy, restarting, showing a specific error, refusing to boot. What the machine does and what changed just before narrows the diagnosis faster than any test we can run.",
        "If there is anything on the machine you cannot lose, say so at the counter. Most computer work leaves your files exactly where they are, but a clean Windows installation replaces what is on the drive, and that is the one job where getting it wrong is not recoverable.",
      ],
    },
    {
      heading: "What happens to your files?",
      paragraphs: [
        "For most computer work, nothing. A tune-up, a virus removal, a hardware installation and a password reset all leave your documents, photos, programs and settings exactly where they are. That is the point of choosing them over the alternative.",
        "A clean Windows installation is the exception, and it is the one job where getting it wrong cannot be undone. It replaces what is on the drive, which is what makes it effective. We ask before doing it, we ask twice, and if there are files you need we copy them off first and put them back afterwards as part of the job.",
        "If you are locked out of the machine rather than needing it rebuilt, a password reset restores access and keeps everything in place. People are often told online that reinstalling Windows is the only way back in, and it is an expensive way to solve a password problem.",
      ],
    },
  ],
  localMix: [
    {
      title: "Machines slowed by dust",
      body: "The step software cleaning cannot do. A blocked heatsink makes the processor throttle, which feels like an old computer rather than a dirty one.",
    },
    {
      title: "Windows 10 machines needing a decision",
      body: "Support ended 14 October 2025. We check whether the machine meets the Windows 11 requirements as part of the diagnostic.",
    },
    {
      title: "Solid-state drive upgrades",
      body: "The single biggest improvement on an older tower, and far cheaper than replacing the machine.",
    },
  ],
  faqs: () => [
    {
      question: "How much does computer repair cost in Calgary?",
      answer: `Computer repair at TechBrotherz in Calgary is quoted per job, not per hour. The diagnostic fee comes off the repair if you go ahead. A Windows installation includes an office suite and security software, a clean-up and tune-up covers startup, temporary files, updates, cooling and storage health, and hardware or program installation is charged per item.`,
    },
    {
      question: "Do I need to bring my monitor and keyboard to the shop?",
      answer:
        "No. Bring the tower alone to TechBrotherz at 3317 17 Ave SE. Monitors, keyboards and mice are here for testing, so there is no need to disconnect and carry a full setup. Bring the power cable if it is a non-standard one, and mention any login password.",
    },
    {
      question: "Is my Windows 10 computer still safe to use?",
      answer:
        "It keeps working, but Microsoft ended support on 14 October 2025, so it no longer receives monthly security updates and new vulnerabilities stay unpatched. TechBrotherz checks whether a machine meets the Windows 11 hardware requirements as part of a diagnostic and says plainly where it stands.",
    },
  ],
  globalCategories: ["walkin", "pricing"],
};

export const LOCAL_DEVICES: LocalDef[] = [
  ipadCalgary,
  tabletCalgary,
  laptopCalgary,
  computerCalgary,
];
