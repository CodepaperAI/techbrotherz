/**
 * The blog articles, the guides tier of the site plan shipping at /blog.
 *
 * Authored files per CLAUDE.md Section 8.10: guides are written in the repo,
 * in a pull request, with the similarity detector running over them. Three
 * articles shipped 2026-08; the rest of the planned list follows.
 *
 * The author is the business, not an invented person. Question 7 (technician
 * credentials) is still unanswered, and a byline with a made-up name or
 * made-up years of experience is exactly the fake E-E-A-T this build refuses.
 */

import type { PageFaq } from "@/lib/faq/scoping";

export interface BlogSection {
  /** H2, phrased as a question a person would actually type or ask. */
  heading: string;
  paragraphs: string[];
  /**
   * A comparison table rendered after the paragraphs, as real <table> markup
   * with a caption and scoped headers (CLAUDE.md Section 8.3). The first cell
   * of each row is its row header.
   */
  table?: {
    caption: string;
    columns: string[];
    rows: string[][];
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** ISO date. Shown on the page and emitted as datePublished. */
  datePublished: string;
  /** One-line summary for the index card. */
  summary: string;
  lead: string;
  /** The AnswerBox: 40 to 60 words that answer the article's core question alone. */
  answer: string;
  keyFacts: { label: string; value: string }[];
  sections: BlogSection[];
  /** Steps for HowTo schema, where the article genuinely is one. */
  howToSteps?: { name: string; text: string }[];
  faqs: PageFaq[];
  /** Topics for the Article schema's about field. */
  about: string[];
  related: { label: string; href: string }[];
  sources: { label: string; href: string; note: string }[];
}

const unlockCanada: BlogPost = {
  slug: "how-to-unlock-a-cell-phone-in-canada",
  title: "How to Unlock a Cell Phone in Canada",
  seoTitle: "How to Unlock a Cell Phone in Canada | Free by Law",
  seoDescription:
    "Since 2017 Canadian carriers must unlock your phone free on request. When that works, when it does not, and what a repair store can do that a carrier cannot.",
  datePublished: "2026-08-13",
  summary:
    "Your carrier must unlock your phone free of charge, by law. Here is how to ask, and what to do in the cases where the carrier route does not work.",
  lead: "Unlocking a phone in Canada is free by law when your carrier does it, and that is the route to try first. TechBrotherz, a walk-in cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta, unlocks phones every week, and most of that work is the cases the carrier route cannot reach: imported handsets, closed accounts and carriers that no longer exist.",
  answer:
    "Since December 1, 2017, the CRTC's Wireless Code requires Canadian carriers to unlock their customers' phones free of charge, and new phones must be sold unlocked. For imported handsets, closed accounts and defunct carriers, TechBrotherz in Calgary unlocks phones at the Store, usually the same day, without touching the data on the phone.",
  keyFacts: [
    { label: "Carrier route", value: "Free by law since December 2017, for their own customers" },
    { label: "Store route", value: "Imported phones, closed accounts, defunct carriers" },
    { label: "Time", value: "Usually the same day at the Store" },
    { label: "Your data", value: "Untouched by an unlock" },
    { label: "Blacklisted phones", value: "Cannot be unlocked by anyone" },
  ],
  sections: [
    {
      heading: "What does unlocking a cell phone actually mean?",
      paragraphs: [
        "A carrier lock is software on the phone that stops it accepting a SIM card from any network other than the one that sold it. Unlocking removes that restriction, so the same handset works with a SIM from any Canadian carrier, or from a carrier abroad. Nothing else about the phone changes: unlocking does not touch your photos, apps, messages or settings.",
        "A locked phone is not broken and not blacklisted. It works normally on the network it is locked to. The lock only matters when you switch carriers, buy a phone secondhand, or travel and want to use a local SIM instead of paying roaming charges.",
        "Unlocking is also not the same thing as removing a screen lock or a Google account lock. Those are ownership protections on the device itself, and they are separate services with their own rules. A carrier unlock assumes you can already get into the phone.",
      ],
    },
    {
      heading: "Is your phone already unlocked?",
      paragraphs: [
        "If the phone was bought new in Canada from December 1, 2017 onward, it is almost certainly already unlocked. The CRTC's Wireless Code required carriers to sell all new devices unlocked from that date, so a phone bought new from a Canadian carrier in the last several years has no lock to remove.",
        "The quickest test costs nothing: put a SIM card from a different carrier into the phone. If the phone registers on that network and can make a call, it is unlocked. If it shows a message asking for an unlock code, or refuses the SIM, it is locked.",
        "The phones that are still locked in practice are older Canadian handsets from before December 2017, phones bought from carriers in other countries, and some prepaid or budget devices sold abroad. Those are exactly the phones that turn up at the TechBrotherz Store.",
      ],
    },
    {
      heading: "How do you unlock a phone through your carrier?",
      paragraphs: [
        "Since December 2017, the CRTC's Wireless Code requires Canadian carriers to unlock a customer's phone free of charge, on request. Before that rule, carriers charged an unlocking fee, commonly around fifty dollars. If your phone is locked to a Canadian carrier and you have an account with them, this is the route to use, because it costs nothing.",
        "Call the carrier or use their online chat, say you want your device unlocked, and have the phone's IMEI number ready. The IMEI is the phone's serial number for network purposes: dial *#06# on any phone and it appears on screen. The carrier verifies the account and either unlocks the phone remotely or gives you a code to enter.",
        "The catch is the word customer. The carrier's obligation runs to its own subscribers. If the account was closed years ago, if you bought the phone secondhand and were never their customer, or if the carrier has shut down or been absorbed into another brand, the free route gets slow, complicated, or impossible. That is where a repair store comes in.",
      ],
    },
    {
      heading: "When is a repair store the practical route?",
      paragraphs: [
        "TechBrotherz in Calgary unlocks phones that the carrier route cannot reach: handsets imported from another country and locked to a foreign network, phones locked to brands that no longer operate, and secondhand phones where the original account holder is long gone. The phone is unlocked at the Store, usually the same day, and your data is not touched.",
        "The service covers any Canadian carrier and most foreign locks, and it is quoted before any work starts. Bring the phone, and if possible know which network it is locked to. The Store can confirm whether the unlock is possible and what it costs before you commit to anything.",
        "One honest boundary: if your phone is locked to a Canadian carrier and you are still their customer, TechBrotherz will tell you to phone them first, because the carrier is required to do it free. Paying for an unlock you are legally entitled to at no charge is a bad deal, and we would rather say so than take the job.",
      ],
    },
    {
      heading: "What can unlocking not fix?",
      paragraphs: [
        "A blacklisted phone. A phone reported lost or stolen is flagged by its IMEI on the national database Canadian carriers share, and a blacklisted phone will not work on any Canadian network whatever SIM goes in it. Unlocking does not remove a blacklist flag, and no honest service claims it can. If a secondhand phone will not activate on any network, this is the most common reason.",
        "Account locks are separate. A Google account lock after a factory reset, called FRP, or a forgotten screen lock, are ownership protections rather than carrier locks. TechBrotherz handles those as a distinct service with a strict condition: proof the device is yours, with no exceptions, because a service that opens locked phones without ownership checks is a service for phone thieves.",
        "Before buying any secondhand phone, check the IMEI against a blacklist checker, confirm the phone is signed out of its Apple or Google account, and put your own SIM in before money changes hands. Two minutes of checking prevents the two most expensive secondhand phone mistakes there are.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is it legal to unlock a phone in Canada?",
      answer:
        "Yes. Unlocking your own phone is legal in Canada, and since December 2017 the CRTC's Wireless Code has required carriers to unlock their customers' devices free of charge on request. Phones sold new by Canadian carriers since that date must be sold unlocked.",
    },
    {
      question: "Does unlocking a phone delete your data?",
      answer:
        "No. A carrier unlock removes the network restriction and nothing else. Photos, messages, apps and settings all stay exactly where they are, whether the unlock is done by the carrier remotely or at the TechBrotherz Store in Calgary.",
    },
    {
      question: "Can TechBrotherz unlock a phone bought in another country?",
      answer:
        "Usually, yes. Imported handsets locked to foreign networks are the most common unlocking job at the TechBrotherz Store in Calgary, because the free Canadian carrier route only covers Canadian carriers and their own customers. Bring the phone in, and the unlock is quoted before any work starts and usually done the same day.",
    },
    {
      question: "Do you need the original SIM card to unlock a phone?",
      answer:
        "No. An unlock works on the handset itself, identified by its IMEI number, which any phone shows when you dial *#06#. What you do need afterwards is a SIM from the network you want to use, which is also the simplest way to confirm the unlock worked.",
    },
  ],
  about: ["Phone unlocking", "CRTC Wireless Code", "Carrier locks"],
  related: [
    { label: "Phone unlocking and FRP removal", href: "/services/phone-unlocking" },
    { label: "Phone unlocking in Calgary", href: "/phone-unlocking-calgary" },
    { label: "Cell phone repair", href: "/services/phone-repair" },
    { label: "Contact and directions", href: "/contact" },
  ],
  sources: [
    {
      label: "CRTC, The Wireless Code",
      href: "https://crtc.gc.ca/eng/phone/mobile/code.htm",
      note: "The federal rule requiring carriers to unlock customers' phones free of charge, and to sell new devices unlocked, in force since December 1, 2017.",
    },
  ],
};

const laptopSigns: BlogPost = {
  slug: "signs-your-laptop-needs-repair",
  title: "Signs Your Laptop Needs Repair",
  seoTitle: "Signs Your Laptop Needs Repair | What to Watch For",
  seoDescription:
    "Slowdowns, heat, noises, battery and screen faults: which laptop symptoms mean repair, which mean back up now, and which are cheaper than people expect.",
  datePublished: "2026-08-13",
  summary:
    "Most laptops announce their failures in advance. Here are the symptoms worth acting on, the ones that mean back up today, and the ones that are cheaper to fix than people expect.",
  lead: "Most laptops do not die suddenly; they announce what is failing weeks in advance, in heat, noise and slowdowns. TechBrotherz, a walk-in cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta, sees the same symptoms at the Store every week, and this is what each one usually means and when it is worth acting.",
  answer:
    "A laptop usually announces failure in advance. A loud fan and heat mean blocked cooling, a clicking noise means back the drive up today, working only when plugged in means a worn battery, and a plug that needs an angle means a failing charging jack. TechBrotherz in Calgary diagnoses laptops at the Store and quotes every repair free.",
  keyFacts: [
    { label: "Loud fan, hot deck", value: "Blocked cooling, gets worse not better" },
    { label: "Clicking noise", value: "Back up the same day, the drive may be failing" },
    { label: "Only works plugged in", value: "A worn battery, usually a simple replacement" },
    { label: "Stop immediately", value: "Liquid, burning smells, or a swollen battery" },
    { label: "Every quote", value: "Free at the Store before any work starts" },
  ],
  sections: [
    {
      heading: "Why has your laptop become slow?",
      paragraphs: [
        "A laptop that has gradually become slow almost never has one dramatic fault. It usually has four ordinary ones stacked on top of each other: a startup list that has collected a dozen programs over the years, a drive filling with temporary files, updates that have fallen behind, and dust blocking the cooling so the processor deliberately slows itself to stay cool.",
        "The dust matters more than people expect, because no software cleanup can fix it. A blocked heatsink stops heat escaping, the processor hits its temperature limit sooner, and it throttles. That is why a machine can feel fine for five minutes and then drag: it is not old, it is hot.",
        "The single biggest improvement on an older laptop is usually replacing a mechanical hard drive with a solid-state one. If a laptop with a spinning drive takes minutes to boot and the disk light stays solid, that upgrade turns a frustrating machine into a usable one more reliably than any amount of cleaning.",
      ],
    },
    {
      heading: "What do the noises mean?",
      paragraphs: [
        "A fan that has become loud and stays loud is the most common laptop noise, and it is the cooling system asking for help. Either the fan bearing is wearing out or the airflow is blocked with dust, and both get worse rather than better. A laptop that sounds like it is taking off while doing nothing is running hot, and sustained heat shortens the life of everything else inside.",
        "A clicking or grinding noise from the body of an older laptop is more urgent, because it can be a mechanical hard drive beginning to fail. A failing drive is the one laptop fault where waiting costs you things you cannot buy back. Back the machine up the same day you first hear it, before anything else.",
        "Silence can be a symptom too. A laptop that used to have an audible fan and has gone quiet while running hot may have a fan that has stopped entirely. If the keyboard deck is noticeably hot and you cannot hear the fan at all, have it looked at before the heat does lasting damage.",
      ],
    },
    {
      heading: "Is it the battery, the charger or the charging port?",
      paragraphs: [
        "A laptop that only works when plugged in has a worn-out battery, and on most models the battery is a straightforward replacement. A battery that drains in an hour, or shows different percentages minutes apart, is telling the same story. battery are consumables: several years of daily charging uses one up in the normal course of life.",
        "A laptop that will not charge at all has three suspects: the charger, the charging port, and the battery, in that order of cost. The charger is the cheap answer, which is why TechBrotherz asks you to bring yours in with the laptop: testing with your own charger settles it in the first minute at the Store.",
        "If the plug has to sit at an angle to charge, or wiggling the cable makes the charge light flicker, the DC jack inside the laptop has worked loose. That is a real repair rather than an accessory swap, and it is worth doing promptly, because a loose jack can damage the board it is soldered to.",
      ],
    },
    {
      heading: "Which screen and keyboard symptoms mean repair?",
      paragraphs: [
        "A cracked laptop screen is unambiguous, and it is usually a cheaper repair than people expect because the panel is a standard part on most models. Lines across the display, a picture that flickers when the lid moves, or a dark screen with a faint image behind it all point at the panel or its cable, and all are diagnosable at the Store.",
        "One test is worth doing before assuming the worst: plug the laptop into an external monitor or a television. If the picture is perfect on the external screen, the fault is the panel or its cable, not the graphics hardware, and the repair is the smaller one.",
        "Keyboards fail a few keys at a time, usually after a spill or years of crumbs. On most laptops the keyboard is a replaceable part, and replacing it beats living with a dead letter. If several keys stopped working at once immediately after a spill, act quickly, because what killed the keys may still be spreading underneath them.",
      ],
    },
    {
      heading: "When should you stop using the laptop immediately?",
      paragraphs: [
        "Three symptoms justify shutting the machine down and bringing it in rather than pushing on. Liquid in the laptop, even if it seems to have survived: corrosion works over days, and a machine that is powered on while wet is being actively damaged. A hot smell or any smell of burning: that is not a symptom to monitor. And a clicking mechanical drive, because every hour of use is a gamble with your files.",
        "A swollen battery is the fourth. If the trackpad has started clicking strangely, the case no longer sits flat, or there is a visible bulge, the battery inside is expanding and needs replacing promptly. Do not press on it, and do not keep charging it.",
        "None of these symptoms mean the laptop is finished. They mean the order of operations matters: stop, back up if the machine will still safely run, and get it diagnosed. TechBrotherz quotes the repair free at the Store, and if the honest answer is that the machine is not worth fixing, that is the answer you get.",
      ],
    },
    {
      heading: "Repair or replace: how do you decide?",
      paragraphs: [
        "The arithmetic is the same as for a phone: set the repair quote against what the laptop is actually worth and what replacing it would really cost, including the hours of setting up a new machine. A battery, a screen or a keyboard on an otherwise good laptop is almost always worth doing, because each is a small fraction of replacement cost.",
        "Age changes the answer less than people think, with one exception: a laptop that cannot run a supported version of Windows is living on borrowed time for banking and email, whatever its hardware condition. That is a software boundary rather than a wear problem, and it is checked as part of a diagnostic.",
        "The honest cases where replacement wins: a budget laptop needing a screen and a battery and a drive all at once, or damage to the main board where the repair is not economical. TechBrotherz says so at the Store when that is the situation, because a quote that ends with a recommendation not to spend the money is a legitimate outcome.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do you know if a laptop fan is failing?",
      answer:
        "A failing laptop fan is loud at idle, rattles, or has gone completely silent while the machine runs hot. Any of the three means the cooling system needs attention, because a processor that cannot shed heat deliberately slows itself down and sustained heat shortens the life of the whole machine. A cleaning and fan check at TechBrotherz in Calgary is quoted free at the Store.",
    },
    {
      question: "Why does my laptop only work when plugged in?",
      answer:
        "Because the battery is worn out. Laptop battery are consumables, and several years of daily charge cycles uses one up in the normal course of life. On most models the battery is a straightforward replacement, and the laptop is otherwise fine. Bring the charger with the laptop so the charging side can be ruled out at the same time.",
    },
    {
      question: "Is a slow laptop worth repairing?",
      answer:
        "Usually, yes, because slowness is rarely a terminal fault. The usual causes are a crowded startup list, a full drive, missed updates and dust in the cooling, and on older machines a mechanical hard drive that a solid-state drive replaces. A tune-up with a drive upgrade costs a small fraction of a new laptop and fixes the actual problem.",
    },
    {
      question: "What should you do first when a laptop starts clicking?",
      answer:
        "Back it up the same day. A clicking or grinding noise on a laptop with a mechanical hard drive can be the drive beginning to fail, and a failing drive is the one fault where waiting costs files you cannot buy back. Copy what matters off the machine first, then bring it in for diagnosis.",
    },
  ],
  about: ["Laptop repair", "Laptop battery", "Hard drive failure", "Laptop cooling"],
  related: [
    { label: "Laptop repair", href: "/services/laptop-repair" },
    { label: "Laptop screen replacement", href: "/repairs/laptop-screen-replacement" },
    { label: "Laptop charging port repair", href: "/repairs/laptop-charging-port-repair" },
    { label: "Computer tune-up", href: "/repairs/computer-tune-up" },
    { label: "Laptop repair in Calgary", href: "/laptop-repair-calgary" },
  ],
  sources: [],
};

const waterDamage: BlogPost = {
  slug: "phone-water-damage-what-to-do-first",
  title: "Phone Water Damage: What to Do First",
  seoTitle: "Phone Water Damage: What to Do First | Skip the Rice",
  seoDescription:
    "The first ten minutes decide whether a wet phone survives. Power off, do not charge, skip the rice, and get it opened and cleaned before corrosion sets in.",
  datePublished: "2026-08-13",
  summary:
    "The first ten minutes decide more than the next ten days. What actually helps a wet phone, why rice does nothing, and what a proper cleanup involves.",
  lead: "A phone that has been in water is not dead, but the clock is running, and what you do in the first ten minutes matters more than anything a repair bench can do a week later. TechBrotherz, a walk-in cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta, sees water-damaged phones every week, and the ones that survive are the ones that were handled right at the start.",
  answer:
    "Power a wet phone off immediately, do not charge it, and skip the rice, which cannot reach the water inside a sealed phone. Corrosion rather than the water itself is what kills phones over the following days, so a prompt board cleanup at TechBrotherz in Calgary is what changes the outcome. No honest store guarantees liquid damage.",
  keyFacts: [
    { label: "First step", value: "Power off, and do not charge it" },
    { label: "Rice", value: "A myth that wastes the days that matter" },
    { label: "The real killer", value: "Corrosion, working over days after the soak" },
    { label: "What helps", value: "An isopropyl board cleanup within a day or two" },
    { label: "Honest limit", value: "No guarantee on liquid damage, here or anywhere" },
  ],
  sections: [
    {
      heading: "What should you do in the first ten minutes?",
      paragraphs: [
        "Get the phone out of the water and power it off immediately. If it is already off, leave it off. Electricity moving through a wet circuit board is what turns a survivable soaking into a dead phone, because water plus current causes short circuits and starts corrosion at the connection points that matter most.",
        "Do not plug it in to see if it still charges. Charging a wet phone pushes current through whatever water is inside, and it is the single most damaging thing people do to a soaked handset. The same goes for wireless charging pads.",
        "Take off the case, remove the SIM tray, and dry the outside with a cloth. Hold the phone with the ports facing down so water can drain rather than settle. If it went into anything other than clean fresh water, salt water, pool water, a toilet or a sugary drink, the urgency doubles, because those liquids are far more corrosive and conductive than rain.",
      ],
    },
    {
      heading: "Does putting a phone in rice actually work?",
      paragraphs: [
        "No, and the myth costs phones their lives every week. Rice absorbs almost none of the moisture inside a sealed phone, because the water is not sitting in open air where dry grains can reach it. It is trapped under connectors, beneath shields on the circuit board, and inside the charging port, where rice does nothing but add dust and starch to the problem.",
        "What rice really does is waste the days that matter. A phone sitting in a bag of rice for three days is a phone corroding for three days, and corrosion is the thing that actually kills water-damaged phones. The water itself is survivable; the mineral deposits and corrosion it leaves behind on powered contacts are not.",
        "Silica gel packets are better than rice and still not a fix, for the same reason: they only dry what air can reach. Drying the phone is not the goal. Cleaning the residue off the board before it eats the contacts is, and no bag of anything does that.",
      ],
    },
    {
      heading: "Why did the phone work at first and then die?",
      paragraphs: [
        "This is the most common water damage story at the Store: the phone survived the dunk, worked for a week, then faded out. Corrosion explains it. Water leaves mineral deposits on the board, those deposits keep reacting with metal and current after the water is gone, and connections fail one by one over days or weeks.",
        "That is why a phone that seems fine after a soaking is still worth bringing in. Opened promptly, the board can be cleaned with isopropyl alcohol and inspected under magnification before corrosion has eaten anything. Opened a month later, the question is no longer cleaning but which parts the corrosion has already taken.",
        "A charging port that fails soon after a soaking, a battery that suddenly drains, a screen with new marks behind the glass or a speaker that sounds muffled are all the same process at different landing points. The earlier the cleanup, the fewer of them happen.",
      ],
    },
    {
      heading: "What does a proper water damage cleanup involve?",
      paragraphs: [
        "The phone is opened, the battery is disconnected, and the board is cleaned with high-purity isopropyl alcohol, which displaces water and dissolves the residue it left. The board is inspected under magnification for corrosion at the connectors and shields, affected areas are cleaned mechanically, and the phone is reassembled and tested once dry.",
        "TechBrotherz will tell you honestly that no water damage repair carries a guarantee of success, here or anywhere. Liquid damage is the one repair no honest store promises, because the outcome depends on what got in, where it reached and how long it sat. What a prompt cleanup does is move the odds substantially in the phone's favour.",
        "If the phone matters mostly for what is on it, say so at the Store, because that changes the goal. A phone too far gone to save can often still be brought back long enough to get photos and messages off it, and that is sometimes the outcome that actually matters.",
      ],
    },
    {
      heading: "Is a water-resistant phone actually waterproof?",
      paragraphs: [
        "No phone is waterproof. The ratings on recent phones, IP67 or IP68, mean the phone resisted fresh water in a laboratory test when it was new. Those seals age, weaken with every drop and every summer in a hot car, and were never rated for salt water, pool chemicals or soap in the first place.",
        "Water resistance is also the first casualty of any opened phone. Once a phone has been opened for a screen or battery replacement, at any repair store, the factory seal is replaced with adhesive that is good but not laboratory-rated. Treat any repaired phone as rain-resistant rather than swim-ready, whatever it was rated at new.",
        "The practical rule: a rating is a margin of safety for accidents, not an invitation. A phone that has been in water is a phone that has been in water, whatever the box said, and the first-hour steps in this article apply to all of them.",
      ],
    },
  ],
  howToSteps: [
    {
      name: "Power the phone off",
      text: "Turn the phone off immediately and leave it off. Current through a wet board is what causes the damage.",
    },
    {
      name: "Do not charge it",
      text: "Do not plug the phone in or place it on a wireless charger to test it. Charging a wet phone is the most damaging single step.",
    },
    {
      name: "Remove the case and SIM tray",
      text: "Take off the case, remove the SIM tray, and dry the outside with a cloth, holding the ports facing down so water drains out.",
    },
    {
      name: "Skip the rice",
      text: "Do not put the phone in rice. It cannot reach the water inside and wastes the days when a cleanup would have worked.",
    },
    {
      name: "Get it cleaned promptly",
      text: "Bring the phone to a repair store for an isopropyl cleanup and board inspection within a day or two, before corrosion sets in.",
    },
  ],
  faqs: [
    {
      question: "Should you put a wet phone in rice?",
      answer:
        "No. Rice cannot reach the water trapped inside a sealed phone, under connectors and board shields, and the days a phone spends in a rice bag are days corrosion works unopposed. Power the phone off, do not charge it, and get it opened and cleaned promptly instead. That is what actually changes the outcome.",
    },
    {
      question: "Can a phone that got wet be repaired?",
      answer:
        "Often, yes, if it is treated quickly. A prompt cleanup at TechBrotherz in Calgary involves opening the phone, disconnecting the battery, cleaning the board with high-purity isopropyl alcohol and inspecting it under magnification. No honest store guarantees the outcome of liquid damage, because it depends on what got in and how long it sat, but early treatment moves the odds substantially.",
    },
    {
      question: "How long do you have before water damage becomes permanent?",
      answer:
        "The damage starts immediately if the phone is powered, which is why turning it off is the first step. After that, corrosion works over days rather than weeks: a phone cleaned within a day or two has good odds, one that sat for a month is usually a question of which parts corrosion has already taken. Salt water, pool water and sugary drinks shorten every one of those timelines.",
    },
    {
      question: "Why does a wet phone charge slowly or refuse to charge?",
      answer:
        "Recent phones detect moisture in the charging port and refuse to charge until it clears, which protects the port. If a liquid warning persists for more than a day, or charging stays unreliable after the phone seems dry, moisture or corrosion is still present in the port, and the port is one of the first places water damage lands. Have it looked at rather than forcing it.",
    },
  ],
  about: ["Water damage", "Phone repair", "Corrosion"],
  related: [
    { label: "Cell phone repair", href: "/services/phone-repair" },
    { label: "Iphone charging port repair", href: "/repairs/Iphone-charging-port-repair" },
    { label: "Phone repair in Calgary", href: "/phone-repair-calgary" },
    { label: "Contact and directions", href: "/contact" },
  ],
  sources: [],
};

const screenRepairTime: BlogPost = {
  slug: "how-long-does-a-phone-screen-repair-take",
  title: "How Long Does a Phone Screen Repair Take?",
  seoTitle: "How Long Does a Phone Screen Repair Take?",
  seoDescription:
    "About 30 minutes for most phones at a walk-in store. What the job involves, why Ipads take longer, and what makes any screen repair run over.",
  datePublished: "2026-08-20",
  summary:
    "About 30 minutes for most phones, done while you wait. What actually happens in that half hour, and which repairs honestly take longer.",
  lead: "A cracked screen is the most common repair there is, and the first question everyone asks is how long they will be without their phone. TechBrotherz, a walk-in cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta, replaces screens every day, so the honest timings below come from the bench rather than a brochure.",
  answer:
    "A phone screen replacement at TechBrotherz in Calgary takes about 30 minutes for most Iphone, Samsung Galaxy and Google Pixel models, done while you wait with no appointment. Ipad screens take longer, usually a day, because the glass is glued down and must be separated with heat. Every repair carries a 60-day warranty.",
  keyFacts: [
    { label: "Most phones", value: "About 30 minutes, while you wait" },
    { label: "Ipads", value: "Usually a day, because the glass is glued" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Warranty", value: "60 days on the part and the work" },
    { label: "Quote", value: "Free, agreed before any work starts" },
  ],
  sections: [
    {
      heading: "What happens during a 30-minute screen repair?",
      paragraphs: [
        "A phone screen replacement is a sequence, not a single act, and each step has a reason. The phone is powered down and opened, on most models through the screen itself or the back panel. The broken display assembly is disconnected from the board, and the new assembly is connected and tested before anything is sealed, because testing after sealing means opening the phone twice.",
        "The test covers the things a screen actually does: touch response across the whole surface, display quality, the earpiece and the front camera where they route through the assembly, and the sensors that sit behind the glass. Only after that does the phone get closed up, and the technician runs the same checks once more on the sealed phone.",
        "That whole sequence is about 30 minutes on most Iphone, Samsung Galaxy and Google Pixel models at the TechBrotherz Store, which is why screen repairs are done while you wait. The part for common models is usually on the shelf, and the quote is agreed before the phone is opened.",
      ],
    },
    {
      heading: "Why do some screen repairs take longer than others?",
      paragraphs: [
        "The biggest single factor is how the screen is attached. Most phone displays are held by clips, screws and light adhesive, which a technician can release in minutes. Ipad glass is glued down across its whole surface, and separating it takes controlled heat and patience: rushing cracked glass out of a glued frame is how home repairs turn one broken part into three.",
        "Water exposure changes the job too. A cracked screen on a phone that has also been wet is not a screen repair, it is an inspection first, because corrosion on the board will outlast any new display fitted over it. The honest sequence is to check the inside before quoting the outside.",
        "Part availability is the third factor. Common models are stocked, but an unusual model can need a part ordered in, which adds days of waiting though not of work. The Store will say so at the quote stage rather than keep the phone sitting on a shelf.",
      ],
      table: {
        caption:
          "Typical screen repair times at the TechBrotherz Store in Calgary, by device type.",
        columns: ["Device", "Typical time", "Why"],
        rows: [
          [
            "Iphone, Galaxy, Pixel",
            "About 30 minutes",
            "Clipped and screwed assemblies, parts usually in stock",
          ],
          ["Ipad and tablets", "Usually a day", "Glued glass must be heat-separated from the frame"],
          [
            "Laptop screens",
            "Same day when the panel is stocked",
            "Bezel and hinge disassembly, more screws than a phone",
          ],
          [
            "Water-damaged phones",
            "Inspection first",
            "The board must be checked before a screen is worth fitting",
          ],
        ],
      },
    },
    {
      heading: "Cracked glass or broken LCD: does it change the time?",
      paragraphs: [
        "It changes the urgency more than the time. On modern phones the glass, the touch layer and the display ship as one fused assembly, so a cracked-glass-only repair and a dead-display repair are usually the same job with the same timing: the whole assembly is replaced.",
        "What differs is how long the phone stays usable. A phone with cracked glass but a working display can wait for a convenient half hour, though cracks spread and sharp edges cut thumbs. A phone showing lines, black patches or nothing at all is telling you the display layer itself has failed, and it rarely recovers on its own.",
        "The practical advice from the bench is simple: a phone that still displays should be repaired at your convenience, and a phone that does not should be repaired before whatever is on it becomes urgent. Either way the repair itself is the same half hour.",
      ],
    },
    {
      heading: "Should you book an appointment for a screen repair?",
      paragraphs: [
        "At TechBrotherz, no. The store is walk-in by design: bring the phone to 3317 17 Ave SE during opening hours, the repair is quoted free with the phone in front of the technician, and most screen replacements are finished in about 30 minutes. There is no booking system to wait on and no drop-off queue.",
        "The one thing worth doing before any repair visit, anywhere, is a backup. A screen replacement does not touch your data, and data loss during one is rare, but a phone that arrives with a backup leaves nothing to chance. Both Iphone and Android back up automatically overnight when charging and on Wi-Fi, so for most people this is already done.",
        "If the timing matters, phone (403) 273-8324 before coming in. The Store can confirm the part for your exact model is on the shelf, which is the only thing that ever turns a half-hour repair into a wait.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long does an Iphone screen replacement take in Calgary?",
      answer:
        "About 30 minutes at TechBrotherz, the walk-in repair store at 3317 17 Ave SE in Calgary. The screen assembly is replaced and tested while you wait, with no appointment needed, and the repair carries a 60-day warranty on the part and the work.",
    },
    {
      question: "Why does an Ipad screen repair take longer than a phone?",
      answer:
        "Because Ipad glass is glued down across its whole surface rather than clipped in. Separating cracked, glued glass from the frame takes controlled heat and careful work, so an Ipad screen replacement at TechBrotherz in Calgary usually takes a day rather than the half hour a phone takes.",
    },
    {
      question: "Will a screen replacement delete what is on my phone?",
      answer:
        "No. A screen replacement swaps the display assembly and does not touch the phone's storage, so photos, messages and apps stay exactly where they are. Backing up before any repair is still sensible practice, and most phones already back up automatically overnight.",
    },
    {
      question: "Can a screen repair be done the same day without an appointment?",
      answer:
        "Yes. TechBrotherz at 3317 17 Ave SE in Calgary is a walk-in store with no booking system. Most phone screen replacements are done in about 30 minutes while you wait, and phoning (403) 273-8324 first confirms the part for your model is in stock.",
    },
  ],
  about: ["Phone screen replacement", "Repair turnaround times", "Walk-in phone repair"],
  related: [
    { label: "Iphone screen replacement", href: "/repairs/Iphone-screen-replacement" },
    { label: "Samsung screen replacement", href: "/repairs/samsung-screen-replacement" },
    { label: "Walk-in phone repair in Calgary", href: "/walk-in-phone-repair-calgary" },
    { label: "Cell phone repair", href: "/services/phone-repair" },
  ],
  sources: [],
};

const slowComputer: BlogPost = {
  slug: "why-is-my-computer-running-slow",
  title: "Why Is My Computer Running Slow?",
  seoTitle: "Why Is My Computer Running Slow? Causes & Real Fixes",
  seoDescription:
    "The five real reasons computers slow down: startup load, malware, a failing hard drive, dust and heat, or too little memory. Which is yours, and what fixes it.",
  datePublished: "2026-08-20",
  summary:
    "Slow computers have about five real causes, and guessing wrong wastes money. How to tell startup clutter from malware from a drive that is failing.",
  lead: "A slow computer is the most common complaint that walks into TechBrotherz, a cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta. It is also the vaguest, because five very different faults all present as slow. The difference matters: one of them costs nothing to fix, and one of them is a warning that your files are at risk.",
  answer:
    "A computer usually runs slow for one of five reasons: too many programs loading at startup, malware running in the background, a mechanical hard drive failing or full, dust choking the cooling so the processor slows itself down, or too little memory for what you now use it for. TechBrotherz in Calgary diagnoses which one it is before any work is quoted.",
  keyFacts: [
    { label: "Common causes", value: "Startup load, malware, failing drive, dust and heat, low memory" },
    { label: "The urgent one", value: "A failing drive: back up the moment you suspect it" },
    { label: "Diagnosis", value: "At the Store, with the actual cause named before any quote" },
    { label: "Tune-up includes", value: "Startup clean-up, updates, dust removal" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  sections: [
    {
      heading: "Is it just too many programs starting with Windows?",
      paragraphs: [
        "The most common cause of a slow computer is also the most boring one: dozens of programs that install themselves to run at startup and then sit in the background forever. Each one is small, and twenty of them together are why a machine that once booted in seconds now takes minutes and stutters for the first quarter hour of use.",
        "You can check this yourself at no cost. On Windows, open Task Manager with Ctrl+Shift+Esc and look at the Startup tab: everything listed there launches before you have opened a single thing. Disabling the entries you do not recognise as essential is safe, because disabling a startup entry does not uninstall the program, it just stops it launching itself.",
        "A computer tune-up at the TechBrotherz Store does this properly: startup entries reviewed, the accumulated background software removed rather than just disabled, updates applied, and the inside of the machine physically cleaned. It is the right first step when a machine has slowed gradually over years rather than suddenly over days.",
      ],
    },
    {
      heading: "How do you tell a slow computer from an infected one?",
      paragraphs: [
        "Malware slows a computer in a different pattern than clutter does. Clutter makes a machine slow from the moment it starts. An infection often makes it slow while you are using it: the fan spins up when the machine should be idle, the browser grows toolbars or redirects searches, pop-ups appear outside the browser, and things you did not install appear in the programs list.",
        "The distinction matters because the fixes are different. A tune-up does not remove an infection, and an antivirus scan does not undo years of startup clutter. Diagnosing before fixing is the whole reason the two are separate services at the TechBrotherz Store: virus removal deals with the infection and leaves security software running, and the tune-up deals with everything else.",
        "One honest warning from the bench: a machine that suddenly demands payment to unlock your files is not slow, it is held hostage by ransomware. Power it off and bring it in. Paying rarely restores the files, and continuing to use the machine can make recovery harder.",
      ],
    },
    {
      heading: "Is the hard drive failing? The one cause that cannot wait",
      paragraphs: [
        "A mechanical hard drive that is beginning to fail produces a distinctive kind of slowness: programs freeze for seconds at a time, files take oddly long to open, the machine hangs at boot some days and not others, and you may hear clicking or grinding that was not there before. This is the one cause of slowness that is also an emergency, because a failing drive does not recover; it fails.",
        "The rule is simple: back up first, diagnose second. The moment a drive is suspected, everything that matters on it should be copied somewhere else, because every hour of continued use is wear on a component that is already dying. TechBrotherz offers data recovery, and recovery from a drive that was backed up in time is trivial compared with recovery from one that was run until it stopped.",
        "The repair itself is often good news. Replacing a worn mechanical drive with a solid-state drive is the single largest speed improvement most older computers can receive, because a solid-state drive has no moving parts to wear or wait on. Machines that felt ready for replacement routinely come back feeling new after the swap.",
      ],
      table: {
        caption: "The five causes of a slow computer, and how each one shows itself.",
        columns: ["Cause", "The tell", "The fix"],
        rows: [
          [
            "Startup clutter",
            "Slow from power-on, gradual over years",
            "Tune-up: startup review and clean-up",
          ],
          [
            "Malware",
            "Slow in use, pop-ups, redirects, busy when idle",
            "Virus removal, with protection left running",
          ],
          [
            "Failing hard drive",
            "Freezes, clicking, some days worse than others",
            "Back up now, then replace the drive",
          ],
          ["Dust and heat", "Loud fan, hot case, slow under load", "Physical clean, new thermal paste"],
          ["Too little memory", "Slow only with many tabs or big programs", "Memory upgrade after diagnosis"],
        ],
      },
    },
    {
      heading: "Can dust really slow a computer down?",
      paragraphs: [
        "Yes, mechanically and measurably. A processor protects itself from overheating by slowing down, a behaviour called thermal throttling. When years of dust blanket the cooling fins and clog the fan, the processor reaches its temperature limit under modest load and cuts its own speed to survive. The computer is not broken; it is hot.",
        "The signs are physical: a fan that runs loud and often, a case that feels hot, a laptop that slows dramatically ten minutes into anything demanding and recovers after a rest. Gaming computers show it first, because they run closest to their thermal limits, and a gaming machine that stutters in games it once handled is the classic case.",
        "The fix is unglamorous: open the machine, remove the dust properly, and renew the thermal paste between the processor and its cooler where it has dried out. It is part of the tune-up at the TechBrotherz Store, and on a throttling machine the before-and-after difference is not subtle.",
      ],
    },
    {
      heading: "When is a slow computer just an old computer?",
      paragraphs: [
        "Sometimes the machine is fine and the workload grew. Browsers, video calls and modern software use more memory every year, and a computer that was comfortable five years ago can be genuinely short of memory for the same person's use today. The tell is that the machine is fine with one thing open and slows as tabs and programs stack up.",
        "That is a diagnosis, not a guess, and it is worth making properly, because the upgrade decision depends on it. More memory helps a machine that is short of memory; it does nothing for a machine that is throttling on dust or dying at the drive. The TechBrotherz Store names the actual bottleneck before quoting anything, which is what stops people paying for the wrong fix.",
        "And sometimes the honest answer is that repair money is better spent on replacement, particularly where several causes overlap on a machine that was modest to begin with. TechBrotherz sells tested computers and takes trade-ins, so the conversation about fixing the old machine and the conversation about replacing it can happen at the same bench.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the most common reason a computer runs slow?",
      answer:
        "Accumulated startup programs. Software that installs itself to launch at power-on builds up over years until the machine spends its first minutes loading things nobody asked for. A computer tune-up at TechBrotherz in Calgary reviews the startup list, removes the accumulation and physically cleans the machine.",
    },
    {
      question: "How do I know if my slow computer has a virus?",
      answer:
        "An infected machine tends to be slow while you use it rather than just at startup: the fan runs when the machine should be idle, the browser redirects or grows toolbars, and pop-ups appear outside the browser. TechBrotherz in Calgary diagnoses whether slowness is infection or clutter before quoting either fix.",
    },
    {
      question: "Does upgrading to a solid-state drive make an old computer faster?",
      answer:
        "Usually it is the single biggest improvement available. A solid-state drive has no moving parts, so everything that waited on the old mechanical drive, booting, opening programs, loading files, happens dramatically faster. TechBrotherz in Calgary fits solid-state drives and moves your files across as part of the job.",
    },
    {
      question: "Should I fix a slow computer or replace it?",
      answer:
        "It depends on which fault is causing the slowness, which is why TechBrotherz diagnoses before quoting. A dusty or cluttered machine is usually well worth reviving. A machine with several overlapping faults may not be, and the Store sells tested computers and takes trade-ins, so both options sit on the same counter.",
    },
  ],
  about: ["Slow computer causes", "Computer tune-up", "Hard drive failure"],
  related: [
    { label: "Computer tune-up", href: "/repairs/computer-tune-up" },
    { label: "Virus removal", href: "/services/virus-removal" },
    { label: "Computer repair in Calgary", href: "/computer-repair-calgary" },
    { label: "Computer diagnostics", href: "/repairs/computer-diagnostics" },
  ],
  sources: [],
};

const consoleFaults: BlogPost = {
  slug: "common-xbox-and-playstation-faults",
  title: "Common Xbox and PlayStation Faults, and Which Are Worth Repairing",
  seoTitle: "Common Xbox & PlayStation Faults Worth Repairing",
  seoDescription:
    "HDMI ports, overheating, drives and drift: the faults that actually bring Xbox, PS4, PS5 and Switch consoles to a repair bench, and which repairs make sense.",
  datePublished: "2026-08-20",
  summary:
    "Most dead consoles have one of five faults, and most of those five are repairable. What actually fails on Xbox, PlayStation and Switch, and when repair beats replacement.",
  lead: "Gaming consoles fail in patterns. TechBrotherz, a walk-in cell phone and computer repair store at 3317 17 Ave SE in Calgary, Alberta, sees the same handful of faults across Xbox One, Xbox Series X and S, PS4, PS5 and Nintendo Switch, and most of them are mechanical, predictable and fixable. Every console is diagnosed first, with the fault named and the price agreed before any work starts.",
  answer:
    "The gaming console faults that reach a repair bench are consistent: broken HDMI ports from cable strain, overheating from dust and dried thermal paste, failing disc drives, controllers with stick drift, and consoles that power on but show nothing. TechBrotherz in Calgary diagnoses Xbox, PlayStation and Nintendo Switch consoles first, and quotes before any repair.",
  keyFacts: [
    { label: "Consoles", value: "Xbox One, Xbox Series X and S, PS4, PS5, Nintendo Switch" },
    { label: "Most common fault", value: "A damaged HDMI port on a console that otherwise works" },
    { label: "Process", value: "Diagnosed first, price agreed before any work" },
    { label: "Warranty", value: "60 days on the part and the work" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
  ],
  sections: [
    {
      heading: "Why do HDMI ports fail on consoles so often?",
      paragraphs: [
        "The HDMI port is the most repaired part on modern consoles, and the reason is mechanical rather than electronic. A console lives in a media cabinet where the cable is plugged, unplugged, yanked by a vacuum cleaner and strained sideways by the door, and the port is a small soldered component taking all of that leverage on its pins.",
        "The symptom is a console that sounds alive with a screen that says no signal, or a picture that flickers and cuts out when the cable is nudged. Bent pins inside the port are sometimes visible with a torch. The console itself is usually fine, which is exactly why this repair is worth doing: everything works except one connector.",
        "Replacing the port means board-level soldering rather than a plug-in part, which is why it is a bench job. It is also the clearest case in console repair of a fault where fixing beats replacing, because the machine attached to the broken port is otherwise healthy, along with everything installed on it.",
      ],
    },
    {
      heading: "Is an overheating console dying, or just dirty?",
      paragraphs: [
        "Usually dirty. A console that roars like a jet, runs hot to the touch and shuts itself down mid-game is almost always choked with dust, with thermal paste that dried out years ago. Consoles are worked hard in enclosed cabinets and cleaned less often than any other electronics in the house, and PS4 and Xbox One machines are now old enough that their factory paste has simply expired.",
        "The shutdowns are the console protecting itself from heat, the same thermal throttling a laptop does, taken one step further. Left alone the problem compounds: heat stresses the solder joints and the power supply, so a dirty console that was cheap to clean becomes a damaged console that is not.",
        "The repair is a full disassembly, a proper clean and fresh thermal paste, and it is diagnose-first at the TechBrotherz Store like every console job: if the shutdowns turn out to be something other than heat, the diagnosis says so before the quote does.",
      ],
      table: {
        caption:
          "The common console faults seen at the repair bench, and what each usually means.",
        columns: ["Fault", "What you see", "Usually worth repairing?"],
        rows: [
          [
            "Broken HDMI port",
            "Powers on, no signal, or picture cuts when the cable moves",
            "Yes: the console behind the port is healthy",
          ],
          [
            "Overheating",
            "Loud fan, hot case, shuts down mid-game",
            "Yes: usually dust and dried paste, not damage",
          ],
          [
            "Disc drive failure",
            "Discs not accepted, not read, or grinding noises",
            "Yes on current consoles; weigh it on the oldest",
          ],
          [
            "Stick drift",
            "Character or cursor moves on its own",
            "Yes: a controller repair, not a console repair",
          ],
          [
            "No power at all",
            "Nothing happens, or a click then silence",
            "Diagnosis first: causes range from trivial to terminal",
          ],
        ],
      },
    },
    {
      heading: "What about disc drives, stick drift and consoles that will not power on?",
      paragraphs: [
        "Disc drive faults announce themselves: discs refused, discs accepted but never read, or grinding where there should be a quiet spin. On a current console the drive is worth repairing, because the alternative is abandoning the disc library that goes with it. On the oldest machines it becomes a judgment call, which is what the diagnosis is for.",
        "Stick drift, where a character or menu cursor creeps on its own, is a controller fault rather than a console fault, caused by wear inside the thumbstick module. It is one of the smaller repairs in the whole catalogue, and fixing a drifting controller is almost always more sensible than replacing it.",
        "A console that does nothing at all is the one case where honest answers start with a bench, not a list. No power can be a failed power supply, which is repairable, or deep board damage, which may not be worth it. TechBrotherz diagnoses first precisely so that nobody pays for open-ended exploratory work: the fault is named, then the price, then the decision is yours.",
      ],
    },
    {
      heading: "When is a console repair worth it, and when is it not?",
      paragraphs: [
        "The repair-or-replace question has a structure. In favour of repair: the fault is one of the mechanical ones above, the console is a current or recent generation, and the machine carries installed games, saves and accessories that replacement would strand or cost time to rebuild. A repaired console keeps everything exactly as it was.",
        "In favour of replacement: the console is the oldest generation, several faults overlap, or the fault is deep board damage on a machine that was inexpensive secondhand to begin with. A repair store that never says replace is not diagnosing honestly, and the TechBrotherz diagnosis exists to make that call visible before money moves.",
        "The practical route is to bring the console to 3317 17 Ave SE and let the bench name the fault. The diagnosis is the product: what is wrong, what fixing it costs, and whether the store would fix it if the machine were theirs. No appointment is needed, and the quote commits you to nothing.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can a broken HDMI port on a PS5 or Xbox be repaired?",
      answer:
        "Yes. A damaged HDMI port is the most common console repair at TechBrotherz in Calgary, on PS4, PS5 and both Xbox generations. The port is soldered to the board, so replacement is bench work rather than a plug-in part, and the console behind the port is usually completely healthy.",
    },
    {
      question: "Why does my console keep turning itself off while gaming?",
      answer:
        "Almost always heat. Dust builds up in the cooling system and the factory thermal paste dries out, so the console shuts down to protect itself under load. A full clean and fresh thermal paste at TechBrotherz in Calgary usually resolves it, and the diagnosis confirms heat is the cause before anything is quoted.",
    },
    {
      question: "Does TechBrotherz repair Nintendo Switch consoles?",
      answer:
        "Yes. TechBrotherz at 3317 17 Ave SE in Calgary takes the Nintendo Switch alongside Xbox One, Xbox Series X and S, PS4 and PS5. Every console is diagnosed first, with the fault and the price named before any repair work starts, and repairs carry a 60-day warranty.",
    },
    {
      question: "Is it worth fixing a controller with stick drift?",
      answer:
        "Usually yes. Stick drift is wear inside the thumbstick module, and replacing the module is one of the smaller repairs in the catalogue, far cheaper than replacing the controller. Bring the controller to the TechBrotherz Store in Calgary and it is diagnosed and quoted the same way a console is.",
    },
  ],
  about: ["Gaming console repair", "HDMI port replacement", "Console overheating"],
  related: [
    { label: "Gaming console repair", href: "/services/game-console-repair" },
    { label: "Computer diagnostics", href: "/repairs/computer-diagnostics" },
    { label: "Buy, sell and trade devices", href: "/buy-sell-trade" },
    { label: "Contact and directions", href: "/contact" },
  ],
  sources: [],
};

/**
 * Order is the /blog index order. The three 2026-08-20 articles lead on the
 * client's instruction; the unlocking article moved down the list rather than
 * being deleted, because "how to unlock a cell phone" is one of the five
 * topics on the client's own AI-visibility tracking list and this is the only
 * piece covering the CRTC rule. Flagged to the client before any removal.
 */
export const BLOG_POSTS: BlogPost[] = [
  screenRepairTime,
  slowComputer,
  consoleFaults,
  laptopSigns,
  waterDamage,
  unlockCanada,
];

const BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post]));

export function blogPost(slug: string): BlogPost | undefined {
  return BY_SLUG.get(slug);
}
