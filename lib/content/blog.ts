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
    "Since 2017 Canadian carriers must unlock your phone free on request. When that works, when it does not, and what a repair Store can do that a carrier cannot.",
  datePublished: "2026-08-13",
  summary:
    "Your carrier must unlock your phone free of charge, by law. Here is how to ask, and what to do in the cases where the carrier route does not work.",
  lead: "Unlocking a phone in Canada is free by law when your carrier does it, and that is the route to try first. TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, unlocks phones every week, and most of that work is the cases the carrier route cannot reach: imported handsets, closed accounts and carriers that no longer exist.",
  answer:
    "Since December 1, 2017, the CRTC's Wireless Code requires Canadian carriers to unlock their customers' phones free of charge, and new phones must be sold unlocked. For imported handsets, closed accounts and defunct carriers, TechBrotherz in Calgary unlocks phones at the counter, usually the same day, without touching the data on the phone.",
  keyFacts: [
    { label: "Carrier route", value: "Free by law since December 2017, for their own customers" },
    { label: "Store route", value: "Imported phones, closed accounts, defunct carriers" },
    { label: "Time", value: "Usually the same day at the counter" },
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
        "The phones that are still locked in practice are older Canadian handsets from before December 2017, phones bought from carriers in other countries, and some prepaid or budget devices sold abroad. Those are exactly the phones that turn up at the TechBrotherz counter.",
      ],
    },
    {
      heading: "How do you unlock a phone through your carrier?",
      paragraphs: [
        "Since December 2017, the CRTC's Wireless Code requires Canadian carriers to unlock a customer's phone free of charge, on request. Before that rule, carriers charged an unlocking fee, commonly around fifty dollars. If your phone is locked to a Canadian carrier and you have an account with them, this is the route to use, because it costs nothing.",
        "Call the carrier or use their online chat, say you want your device unlocked, and have the phone's IMEI number ready. The IMEI is the phone's serial number for network purposes: dial *#06# on any phone and it appears on screen. The carrier verifies the account and either unlocks the phone remotely or gives you a code to enter.",
        "The catch is the word customer. The carrier's obligation runs to its own subscribers. If the account was closed years ago, if you bought the phone secondhand and were never their customer, or if the carrier has shut down or been absorbed into another brand, the free route gets slow, complicated, or impossible. That is where a repair Store comes in.",
      ],
    },
    {
      heading: "When is a repair Store the practical route?",
      paragraphs: [
        "TechBrotherz in Calgary unlocks phones that the carrier route cannot reach: handsets imported from another country and locked to a foreign network, phones locked to brands that no longer operate, and secondhand phones where the original account holder is long gone. The phone is unlocked at the counter, usually the same day, and your data is not touched.",
        "The service covers any Canadian carrier and most foreign locks, and it is quoted before any work starts. Bring the phone, and if possible know which network it is locked to. The counter can confirm whether the unlock is possible and what it costs before you commit to anything.",
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
        "No. A carrier unlock removes the network restriction and nothing else. Photos, messages, apps and settings all stay exactly where they are, whether the unlock is done by the carrier remotely or at the TechBrotherz counter in Calgary.",
    },
    {
      question: "Can TechBrotherz unlock a phone bought in another country?",
      answer:
        "Usually, yes. Imported handsets locked to foreign networks are the most common unlocking job at the TechBrotherz counter in Calgary, because the free Canadian carrier route only covers Canadian carriers and their own customers. Bring the phone in, and the unlock is quoted before any work starts and usually done the same day.",
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
  lead: "Most laptops do not die suddenly; they announce what is failing weeks in advance, in heat, noise and slowdowns. TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, sees the same symptoms at the counter every week, and this is what each one usually means and when it is worth acting.",
  answer:
    "A laptop usually announces failure in advance. A loud fan and heat mean blocked cooling, a clicking noise means back the drive up today, working only when plugged in means a worn battery, and a plug that needs an angle means a failing charging jack. TechBrotherz in Calgary diagnoses laptops at the counter and quotes every repair free.",
  keyFacts: [
    { label: "Loud fan, hot deck", value: "Blocked cooling, gets worse not better" },
    { label: "Clicking noise", value: "Back up the same day, the drive may be failing" },
    { label: "Only works plugged in", value: "A worn battery, usually a simple replacement" },
    { label: "Stop immediately", value: "Liquid, burning smells, or a swollen battery" },
    { label: "Every quote", value: "Free at the counter before any work starts" },
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
        "A laptop that only works when plugged in has a worn-out battery, and on most models the battery is a straightforward replacement. A battery that drains in an hour, or shows different percentages minutes apart, is telling the same story. Batteries are consumables: several years of daily charging uses one up in the normal course of life.",
        "A laptop that will not charge at all has three suspects: the charger, the charging port, and the battery, in that order of cost. The charger is the cheap answer, which is why TechBrotherz asks you to bring yours in with the laptop: testing with your own charger settles it in the first minute at the counter.",
        "If the plug has to sit at an angle to charge, or wiggling the cable makes the charge light flicker, the DC jack inside the laptop has worked loose. That is a real repair rather than an accessory swap, and it is worth doing promptly, because a loose jack can damage the board it is soldered to.",
      ],
    },
    {
      heading: "Which screen and keyboard symptoms mean repair?",
      paragraphs: [
        "A cracked laptop screen is unambiguous, and it is usually a cheaper repair than people expect because the panel is a standard part on most models. Lines across the display, a picture that flickers when the lid moves, or a dark screen with a faint image behind it all point at the panel or its cable, and all are diagnosable at the counter.",
        "One test is worth doing before assuming the worst: plug the laptop into an external monitor or a television. If the picture is perfect on the external screen, the fault is the panel or its cable, not the graphics hardware, and the repair is the smaller one.",
        "Keyboards fail a few keys at a time, usually after a spill or years of crumbs. On most laptops the keyboard is a replaceable part, and replacing it beats living with a dead letter. If several keys stopped working at once immediately after a spill, act quickly, because what killed the keys may still be spreading underneath them.",
      ],
    },
    {
      heading: "When should you stop using the laptop immediately?",
      paragraphs: [
        "Three symptoms justify shutting the machine down and bringing it in rather than pushing on. Liquid in the laptop, even if it seems to have survived: corrosion works over days, and a machine that is powered on while wet is being actively damaged. A hot smell or any smell of burning: that is not a symptom to monitor. And a clicking mechanical drive, because every hour of use is a gamble with your files.",
        "A swollen battery is the fourth. If the trackpad has started clicking strangely, the case no longer sits flat, or there is a visible bulge, the battery inside is expanding and needs replacing promptly. Do not press on it, and do not keep charging it.",
        "None of these symptoms mean the laptop is finished. They mean the order of operations matters: stop, back up if the machine will still safely run, and get it diagnosed. TechBrotherz quotes the repair free at the counter, and if the honest answer is that the machine is not worth fixing, that is the answer you get.",
      ],
    },
    {
      heading: "Repair or replace: how do you decide?",
      paragraphs: [
        "The arithmetic is the same as for a phone: set the repair quote against what the laptop is actually worth and what replacing it would really cost, including the hours of setting up a new machine. A battery, a screen or a keyboard on an otherwise good laptop is almost always worth doing, because each is a small fraction of replacement cost.",
        "Age changes the answer less than people think, with one exception: a laptop that cannot run a supported version of Windows is living on borrowed time for banking and email, whatever its hardware condition. That is a software boundary rather than a wear problem, and it is checked as part of a diagnostic.",
        "The honest cases where replacement wins: a budget laptop needing a screen and a battery and a drive all at once, or damage to the main board where the repair is not economical. TechBrotherz says so at the counter when that is the situation, because a quote that ends with a recommendation not to spend the money is a legitimate outcome.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do you know if a laptop fan is failing?",
      answer:
        "A failing laptop fan is loud at idle, rattles, or has gone completely silent while the machine runs hot. Any of the three means the cooling system needs attention, because a processor that cannot shed heat deliberately slows itself down and sustained heat shortens the life of the whole machine. A cleaning and fan check at TechBrotherz in Calgary is quoted free at the counter.",
    },
    {
      question: "Why does my laptop only work when plugged in?",
      answer:
        "Because the battery is worn out. Laptop batteries are consumables, and several years of daily charge cycles uses one up in the normal course of life. On most models the battery is a straightforward replacement, and the laptop is otherwise fine. Bring the charger with the laptop so the charging side can be ruled out at the same time.",
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
  about: ["Laptop repair", "Laptop batteries", "Hard drive failure", "Laptop cooling"],
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
  lead: "A phone that has been in water is not dead, but the clock is running, and what you do in the first ten minutes matters more than anything a repair bench can do a week later. TechBrotherz, a walk-in cell phone and computer repair Store at 3317 17 Ave SE in Calgary, Alberta, sees water-damaged phones every week, and the ones that survive are the ones that were handled right at the start.",
  answer:
    "Power a wet phone off immediately, do not charge it, and skip the rice, which cannot reach the water inside a sealed phone. Corrosion rather than the water itself is what kills phones over the following days, so a prompt board cleanup at TechBrotherz in Calgary is what changes the outcome. No honest Store guarantees liquid damage.",
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
        "This is the most common water damage story at the counter: the phone survived the dunk, worked for a week, then faded out. Corrosion explains it. Water leaves mineral deposits on the board, those deposits keep reacting with metal and current after the water is gone, and connections fail one by one over days or weeks.",
        "That is why a phone that seems fine after a soaking is still worth bringing in. Opened promptly, the board can be cleaned with isopropyl alcohol and inspected under magnification before corrosion has eaten anything. Opened a month later, the question is no longer cleaning but which parts the corrosion has already taken.",
        "A charging port that fails soon after a soaking, a battery that suddenly drains, a screen with new marks behind the glass or a speaker that sounds muffled are all the same process at different landing points. The earlier the cleanup, the fewer of them happen.",
      ],
    },
    {
      heading: "What does a proper water damage cleanup involve?",
      paragraphs: [
        "The phone is opened, the battery is disconnected, and the board is cleaned with high-purity isopropyl alcohol, which displaces water and dissolves the residue it left. The board is inspected under magnification for corrosion at the connectors and shields, affected areas are cleaned mechanically, and the phone is reassembled and tested once dry.",
        "TechBrotherz will tell you honestly that no water damage repair carries a guarantee of success, here or anywhere. Liquid damage is the one repair no honest Store promises, because the outcome depends on what got in, where it reached and how long it sat. What a prompt cleanup does is move the odds substantially in the phone's favour.",
        "If the phone matters mostly for what is on it, say so at the counter, because that changes the goal. A phone too far gone to save can often still be brought back long enough to get photos and messages off it, and that is sometimes the outcome that actually matters.",
      ],
    },
    {
      heading: "Is a water-resistant phone actually waterproof?",
      paragraphs: [
        "No phone is waterproof. The ratings on recent phones, IP67 or IP68, mean the phone resisted fresh water in a laboratory test when it was new. Those seals age, weaken with every drop and every summer in a hot car, and were never rated for salt water, pool chemicals or soap in the first place.",
        "Water resistance is also the first casualty of any opened phone. Once a phone has been opened for a screen or battery replacement, at any repair Store, the factory seal is replaced with adhesive that is good but not laboratory-rated. Treat any repaired phone as rain-resistant rather than swim-ready, whatever it was rated at new.",
        "The practical rule: a rating is a margin of safety for accidents, not an invitation. A phone that has been in water is a phone that has been in water, whatever the box said, and the checklist at the top of this page applies to all of them.",
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
      text: "Bring the phone to a repair counter for an isopropyl cleanup and board inspection within a day or two, before corrosion sets in.",
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
        "Often, yes, if it is treated quickly. A prompt cleanup at TechBrotherz in Calgary involves opening the phone, disconnecting the battery, cleaning the board with high-purity isopropyl alcohol and inspecting it under magnification. No honest Store guarantees the outcome of liquid damage, because it depends on what got in and how long it sat, but early treatment moves the odds substantially.",
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
    { label: "iPhone charging port repair", href: "/repairs/iphone-charging-port-repair" },
    { label: "Phone repair in Calgary", href: "/phone-repair-calgary" },
    { label: "Contact and directions", href: "/contact" },
  ],
  sources: [],
};

export const BLOG_POSTS: BlogPost[] = [unlockCanada, laptopSigns, waterDamage];

const BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post]));

export function blogPost(slug: string): BlogPost | undefined {
  return BY_SLUG.get(slug);
}
