/**
 * The remaining Tier 5 pages: unlocking, the merged walk-in page, and
 * Chestermere.
 *
 * The walk-in page absorbed the planned same-day page, because those two
 * differed by modifier rather than by service, which is the axis the brand
 * hubs proved does not differentiate.
 *
 * Chestermere is the only Tier 5 page outside Calgary. Its two Airdrie
 * siblings and its laptop sibling were cut: Airdrie reached three verifiable
 * distinct facts against a threshold of four, and a second Chestermere page
 * would have leaned on the same single road fact. See content/local-inventory.md.
 */

import { checkFactUse } from "@/lib/content/local-shared";
import type { LocalDef } from "@/lib/content/local";
import { ENTITY } from "@/lib/content/local";

/* ================================================= phone unlocking calgary */

const unlockingCalgary: LocalDef = {
  slug: "phone-unlocking-calgary",
  h1: "Phone Unlocking in Calgary",
  eyebrow: "Calgary",
    seoTitle: "Phone Unlocking Calgary | Ask Your Carrier First",
  seoDescription:
        "Phone unlocking in Calgary at TechBrotherz, 3317 17 Ave SE, any Canadian carrier. Since December 2017 carriers must unlock free on request. Usually same day.",
  serviceType: "Phone unlocking",
  city: "Calgary",
  priceSource: { kind: "flat", flatSlugs: [] },
  servicePath: "/services/phone-unlocking",
  repairPaths: [],
  brandPaths: ["/repair/apple-Iphone", "/repair/samsung-galaxy"],
  siblings: ["/phone-repair-calgary", "/walk-in-phone-repair-calgary"],
  placePaths: ["/locations/calgary"],
  facts: checkFactUse("/phone-unlocking-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "An unlock is a short visit, and 33 Street SE Station on the transitway is outside the door if you are coming by bus.",
    },
  ]),
  lead: () =>
    `${ENTITY}, unlocks phones from any Canadian carrier, usually the same day. Before paying anyone, ask your own carrier: since December 2017 Canadian carriers have been required to unlock phones free of charge on request.`,
  answer: () =>
    `TechBrotherz unlocks phones in Calgary, any Canadian carrier, usually the same day, at 3317 17 Ave SE. Ask your carrier first: under the CRTC Wireless Code, every phone sold in Canada since 1 December 2017 must be provided unlocked, and carriers must unlock older phones free on request. Paid unlocking is for secondhand phones, imports, and accounts you no longer hold.`,
  keyFacts: () => [
    { label: "Carriers", value: "Any Canadian carrier" },
    { label: "Time", value: "Usually the same day" },
    { label: "Ask your carrier first", value: "They must do it free, by CRTC rule" },
    { label: "Bring", value: "The phone and its IMEI" },
    { label: "Blacklisted phones", value: "Cannot be unlocked, by anyone" },
  ],
  sections: () => [
    {
      heading: "Do you actually need to pay to unlock a phone in Calgary?",
      paragraphs: [
        "Often you do not, and TechBrotherz will tell you that before taking your money. Under the CRTC Wireless Code, as revised in Telecom Regulatory Policy CRTC 2017-200, every mobile device sold in Canada on or after 1 December 2017 must be provided already unlocked. For devices sold before that date, carriers must unlock them free of charge when asked.",
        "So if the phone is on your own account with a Canadian carrier, the first call should be to that carrier rather than to a repair store. It costs nothing and it is your right. Anyone telling you otherwise is either misinformed or hoping you are.",
        `Paid unlocking exists for the cases that rule does not reach: a phone bought secondhand from someone whose account you cannot access, a phone brought in from another country, a phone from a carrier that no longer operates, or a device where the original account holder is simply not contactable. Those are the situations where a paid unlock solves a problem a phone call cannot.`,
      ],
    },
    {
      heading: "What does unlocking a phone actually do?",
      paragraphs: [
        "Carrier unlocking removes the software restriction tying a handset to one network's SIM cards. An unlocked phone accepts a SIM from any carrier, which is what lets you switch providers without changing devices, use a local SIM when travelling, or sell the phone to someone on a different network.",
        "It does not change anything else. It does not alter the operating system, does not remove the Apple or Google account signed into it, does not wipe your data, and does not affect the manufacturer's warranty. It is a network permission rather than a modification of the device.",
        "It is also not jailbreaking or rooting, which replace parts of the operating system and are entirely different things. And it is not a way to get a phone off somebody else's account.",
      ],
    },
    {
      heading: "What cannot be unlocked?",
      paragraphs: [
        "A phone reported lost or stolen is blacklisted on the national IMEI database Canadian carriers share. A blacklisted phone cannot be unlocked by TechBrotherz, by any other shop, or by the carrier itself, and it will not work on a Canadian network whatever SIM goes in it. If a secondhand phone will not activate, this is the most common reason.",
        "A phone with an outstanding balance or an unpaid device financing agreement is a related case. The carrier can refuse to unlock it until the account is settled, and that is a billing matter rather than a technical one.",
        "An Iphone locked to someone else's Apple Account through Activation Lock is a different restriction entirely, and unlocking will not help. Only the original owner can remove it by signing the device out of their account. We check both before you pay, because we would rather you kept the money.",
      ],
    },
    {
      heading: "How do you get a phone unlocked in Calgary?",
      paragraphs: [
        "Bring the phone to the Store at 3317 17 Ave SE with its IMEI, the fifteen-digit number unique to the handset. Dial star-hash-zero-six-hash on the phone and it appears on screen, or find it in the settings under About. It is also printed on the original box and on the SIM tray of some models.",
        "We confirm the model and carrier and check the phone can actually be unlocked before taking payment. Most unlocks come back the same day. Some combinations of carrier and model take longer, and a small number cannot be done at all, in which case you do not pay for the attempt.",
        "The proof is a SIM from a different carrier working in the phone. On an Iphone, Settings, General, About shows a Carrier Lock line reading No SIM restrictions when the phone is unlocked, and that is worth checking yourself before paying anyone, here or elsewhere.",
      ],
    },
    {
      heading: "How do you check whether a phone is already unlocked?",
      paragraphs: [
        "The definitive test is putting a SIM from a different carrier in the phone and seeing whether it registers on the network and can make a call. Nothing you can check in the settings is as reliable as that, and it costs nothing.",
        "On an Iphone, Settings, then General, then About has a Carrier Lock line that reads No SIM restrictions when the phone is unlocked. That line is accurate on current iOS versions and it is worth checking before paying anyone, here or anywhere else. On Android the equivalent varies by manufacturer, which is why we still trust the second-SIM test.",
        "Bring the phone to the Store and we will check it for you. If it turns out to be unlocked already, that is the end of the conversation and there is nothing to pay. We would rather tell you that than take money for work that was not needed.",
      ],
    },
  ],
  localMix: [
    {
      title: "Secondhand phones bought locally",
      body: "The most common reason someone pays for an unlock: the seller is not contactable and the carrier will only deal with the account holder.",
    },
    {
      title: "Phones brought from another country",
      body: "No Canadian rule applies to a handset sold abroad, so the carrier route is not available.",
    },
    {
      title: "Phones that turn out to be blacklisted",
      body: "We check the IMEI before taking payment. A blacklisted phone cannot be unlocked by anyone, and finding out costs nothing.",
    },
  ],
  faqs: () => [
    {
      question: "How much does it cost to unlock a phone in Calgary?",
      answer: `TechBrotherz in Calgary unlocks phones from any Canadian carrier, usually the same day, at 3317 17 Ave SE. Before paying, ask your own carrier: under the CRTC Wireless Code they must unlock a phone on your account free of charge on request, and every phone sold in Canada since 1 December 2017 is already unlocked.`,
    },
    {
      question: "Why would I pay to unlock a phone if my carrier does it free?",
      answer:
        "You would not, and TechBrotherz will say so. Paid unlocking is for the cases the CRTC rule does not reach: a phone bought secondhand from an uncontactable seller, a handset brought from another country, or a phone from a carrier that no longer operates. If the phone is on your own account, use the carrier.",
    },
    {
      question: "Can a blacklisted phone be unlocked in Calgary?",
      answer:
        "No. A phone reported lost or stolen sits on the national IMEI database shared by Canadian carriers, and no repair store or carrier can unlock or reactivate it. TechBrotherz checks the IMEI before taking payment, so a blacklisted phone is identified before you spend anything.",
    },
  ],
  globalCategories: ["unlocking", "walkin"],
};

/* ============================================ walk-in phone repair calgary */

const walkInCalgary: LocalDef = {
  slug: "walk-in-phone-repair-calgary",
  h1: "Walk-In Phone Repair in Calgary, No Appointment",
  eyebrow: "Calgary",
  seoTitle: "Walk-In Phone Repair Calgary | No Appointment Needed",
  seoDescription:
    "Walk-in phone repair in Calgary at TechBrotherz, 3317 17 Ave SE. No appointment, most repairs done in about 30 minutes while you wait. Same-day on stocked parts.",
  serviceType: "Walk-in phone repair",
  city: "Calgary",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-Iphone", "samsung-galaxy"],
    repairSlugs: ["screen-replacement", "battery-replacement"],
  },
  servicePath: "/services/phone-repair",
  repairPaths: ["/repairs/Iphone-screen-replacement", "/repairs/Iphone-battery-replacement"],
  brandPaths: ["/repair/apple-Iphone", "/repair/samsung-galaxy"],
  siblings: ["/phone-repair-calgary", "/Iphone-screen-repair-calgary"],
  placePaths: ["/locations/calgary", "/locations/calgary/forest-lawn"],
  facts: checkFactUse("/walk-in-phone-repair-calgary", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "Walking in is easier when you can arrive by bus: 33 Street SE Station sits on the dedicated transitway directly outside.",
    },
  ]),
  lead: (c) =>
    `${ENTITY}, takes phone repairs as walk-ins during opening hours. There is no appointment, no booking form and no callback: you come to the Store, the phone is diagnosed in front of you, and most repairs are finished in about ${c.waitMinutes} minutes while you wait.`,
  answer: (c) =>
    `TechBrotherz at 3317 17 Ave SE in Calgary takes phone repairs as walk-ins with no appointment needed. Most repairs are finished in about ${c.waitMinutes} minutes at the Store while you wait, which makes a cracked screen a single trip. Charging port work takes around 45 minutes. If a part is not in stock, TechBrotherz says so before you leave the phone.`,
  keyFacts: (c) => [
    { label: "Appointment", value: "Never needed, walk in any time we are open" },
    { label: "Most repairs", value: `About ${c.waitMinutes} minutes, while you wait` },
    { label: "Charging ports", value: "Around 45 minutes" },
    { label: "Where", value: "3317 17 Ave SE, southeast Calgary" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: (c) => [
    {
      heading: "What does no appointment actually mean here?",
      paragraphs: [
        "It means there is nothing to book and nothing to wait for before you come. TechBrotherz has no appointment system, no online booking form and no callback queue. You arrive during opening hours, describe what the phone is doing, and it gets looked at in front of you at the Store.",
        "That is the operating model rather than a concession to people who did not book. A repair store that runs on appointments has to hold slots open and turn away the person whose screen broke this morning. A walk-in store takes that person, which is most people, because nobody plans to crack a screen.",
        "The honest limit is that on a busy Saturday there may be repairs ahead of yours. We tell you that at the Store along with a realistic time, rather than letting you discover it after an hour of waiting.",
      ],
    },
    {
      heading: "What does same-day repair mean in practice?",
      paragraphs: [
        `For most phone repairs it means faster than same day. A screen or battery replacement on a model we stock takes about ${c.waitMinutes} minutes and you keep the phone in your hand the whole visit. Charging port work takes around 45 minutes because the phone comes apart further.`,
        "Same-day rather than while-you-wait applies to tablets and computers, where the work involves long stretches of the device doing something and nobody needing to stand over it. Those get dropped off in the morning and are usually ready before we close.",
        "What is not same-day is a part we do not stock. Ordering one in usually means a day or two, and we check stock and tell you before you commit rather than after you have left the phone. That is the single most common reason a repair takes longer than a visit.",
      ],
    },
    {
      heading: "Which repairs can be done while you wait?",
      paragraphs: [
        `Screen replacements and battery replacements on stocked Iphone and Galaxy models are the two that reliably finish in about ${c.waitMinutes} minutes. Those are also the two most common repairs by a wide margin, so most people who walk in get their phone back in the same visit.`,
        "Camera modules, earpieces, loudspeakers and buttons are in the same range or slightly longer. Charging ports take around 45 minutes on a phone and longer on a laptop, where the socket is usually soldered to the board and the machine has to be substantially dismantled.",
        "Water damage is the one case with no time at all attached to it. A phone that has been wet has to be opened, cleaned and tested before anyone can say what is wrong, and it is a diagnosis rather than a fixed repair. We will not quote a time for it because we would be guessing.",
      ],
    },
    {
      heading: "What should you bring when you walk in?",
      paragraphs: [
        "The device, and for a laptop or desktop its charger. That is genuinely it for a phone repair. Knowing your model helps and we can identify it at the Store if you do not. Your passcode is not needed for most repairs, and we will say clearly if a particular job requires testing that needs it.",
        "Back the phone up before you come, as a precaution rather than a requirement. Screen, battery, camera and charging port work does not touch the storage and your data stays where it is. A backup is what protects you if something unexpected turns up once the device is open.",
        "If you are coming for a password reset on a computer, bring photo identification and something linking you to the machine. That one is not negotiable, and it is what makes the service safe to offer at all.",
      ],
    },
    {
      heading: "What happens if something is wrong after the repair?",
      paragraphs: [
        "Bring the device back with the receipt. Every repair carries a 60-day warranty on both the part and the workmanship, and a walk-in store is the easy case for that: there is no claim form, no appointment and no posting anything anywhere. You come in and we look at it.",
        "The faults the warranty is there for are a screen developing dead touch areas, a battery that will not hold the charge it should, or a port working loose. Those are part or workmanship failures and they are put right at no charge.",
        "What it does not cover is new damage. A phone dropped again is a fresh repair rather than a failure of the last one, and we will say so rather than pretend otherwise. New liquid damage is the same. Everything else within 60 days is ours to fix.",
      ],
    },
  ],
  localMix: [
    {
      title: "People on a lunch break",
      body: "A screen in about 30 minutes fits inside one. It is the single most common reason people choose walk-in over a booked repair.",
    },
    {
      title: "Phones broken that morning",
      body: "Nobody plans a cracked screen. An appointment system would put these people three days out; a walk-in Store takes them today.",
    },
    {
      title: "Saturday afternoons",
      body: "The busiest window, and the one time there may be repairs ahead of yours. We give a realistic wait at the Store rather than after.",
    },
  ],
  faqs: (c) => [
    {
      question: "Do I need an appointment for phone repair in Calgary?",
      answer: `No. TechBrotherz at 3317 17 Ave SE takes phone repairs as walk-ins during opening hours, with no booking form and no callback. Most repairs are finished in about ${c.waitMinutes} minutes at the Store while you wait. On a busy Saturday there may be repairs ahead of yours, and TechBrotherz gives a realistic time up front.`,
    },
    {
      question: "Can I get a phone fixed the same day in Calgary?",
      answer: `Most phone repairs at TechBrotherz are faster than same day: screens and battery on stocked models take about ${c.waitMinutes} minutes while you wait. Tablets and computers are same-day drop-offs. A part that has to be ordered in usually adds a day or two, and TechBrotherz checks stock before you leave the device.`,
    },
    {
      question: "What do I need to bring to a walk-in repair?",
      answer:
        "The device, and for a laptop or desktop its charger, because a failed adapter looks identical to a dead machine. Knowing your model helps and TechBrotherz can identify it at the Store. For a computer password reset, photo identification and proof the machine is yours are required.",
    },
  ],
  globalCategories: ["walkin", "turnaround"],
};

/* ========================================= cell phone repair chestermere */

const chestermerePhones: LocalDef = {
  slug: "cell-phone-repair-chestermere",
  h1: "Cell Phone Repair for Chestermere",
  eyebrow: "Chestermere",
  seoTitle: "Cell Phone Repair Chestermere | Straight Down 17 Ave",
  seoDescription:
    "Phone repair for Chestermere at TechBrotherz, 3317 17 Ave SE Calgary. Chestermere Boulevard becomes 17 Avenue SE, so it is one road the whole way. Walk in, 60-day warranty.",
  serviceType: "Cell phone repair",
  city: "Chestermere",
  priceSource: {
    kind: "catalogue",
    brandSlugs: ["apple-Iphone", "samsung-galaxy", "google-pixel"],
    repairSlugs: ["screen-replacement", "battery-replacement", "charging-port-repair"],
  },
  servicePath: "/services/phone-repair",
  repairPaths: ["/repairs/Iphone-screen-replacement", "/repairs/samsung-screen-replacement"],
  brandPaths: ["/repair/apple-Iphone", "/repair/samsung-galaxy"],
  siblings: ["/phone-repair-calgary", "/walk-in-phone-repair-calgary"],
  placePaths: ["/locations/chestermere"],
  facts: checkFactUse("/cell-phone-repair-chestermere", [
    {
      fact: "chestermere-road",
      treatment: "mention",
      sentence:
        "Chestermere Boulevard is the western end of the same road: it becomes 17 Avenue SE at the Calgary city limit, and the store is on it.",
    },
  ]),
  lead: () =>
    `${ENTITY}, repairs phones for Chestermere customers. The drive is the easy part: Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit, so the store sits on the road you already use, with no highway and no turns.`,
  answer: (c) =>
    `TechBrotherz repairs phones for Chestermere customers at 3317 17 Ave SE in Calgary. Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit, so it is one road the whole way. Most repairs take about ${c.waitMinutes} minutes at the Store, no appointment needed, with a ${c.warrantyDays}-day warranty and a free quote before any work starts.`,
  keyFacts: (c) => [
    { label: "The drive", value: "One road, Chestermere Blvd into 17 Ave SE" },
    { label: "The drive", value: "One road, no highway and no turns" },
    { label: "Typical time", value: `About ${c.waitMinutes} minutes at the Store` },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Warranty", value: `${c.warrantyDays} days on the part and the work` },
  ],
  sections: (c) => [
    {
      heading: "Is it worth driving from Chestermere for a phone repair?",
      paragraphs: [
        "That is a fair question and it deserves a straight answer rather than a sales pitch. You are choosing between a drive into Calgary and whatever is closer to home, and the honest case for making the trip rests on three things: the price is published per model rather than quoted on the day, most repairs are done while you wait, and the drive is genuinely simple.",
        "The simplicity matters more than it sounds. Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit, so the store is on the road you already drive rather than somewhere that needs a route worked out. There is no highway section and no navigating unfamiliar streets.",
        `If the repair is a screen or a battery on a stocked model, it is about ${c.waitMinutes} minutes at the Store, so the trip is one journey rather than two. Call ahead to confirm the part for your model is in stock and the trip is worth making. That is the honest version, and the call is what makes the difference.`,
      ],
    },
    {
      heading: "What does a phone repair cost for Chestermere customers?",
      paragraphs: [
        `Exactly the same as for anyone else. Every repair is quoted per model at the Store, with the part and the labour together in one figure. There is no travel surcharge, no out-of-city rate and no difference in the warranty.`,
        "Every price is published per model rather than quoted when you arrive, which is the point for someone travelling. You can check the figure for your exact handset before deciding whether the drive is worth it, rather than finding out at a Store twenty minutes from home.",
        `Every repair carries the same ${c.warrantyDays}-day warranty on the part and the workmanship. If something is not right afterwards, bring the phone back with the receipt, and that is worth knowing before committing to a repair that is not around the corner.`,
      ],
    },
    {
      heading: "Which phone repairs are worth the trip?",
      paragraphs: [
        `Screen and battery replacements are the clearest cases, because they are the most common repairs and the ones finished in about ${c.waitMinutes} minutes while you wait. One trip, phone back in your hand, done.`,
        "Charging port work takes around 45 minutes, which is still a single visit but a longer wait. Camera modules, earpieces and buttons sit in a similar range. All of those are worth making one journey for.",
        "The repair not worth driving for without phoning first is anything on a model we may not stock. Ordering a part in usually adds a day or two, which turns one trip into two. A call before setting off answers that in a minute and is the single most useful thing a Chestermere customer can do.",
      ],
    },
    {
      heading: "What do Chestermere customers usually bring in?",
      paragraphs: [
        "The same mix as everyone else, weighted toward the repairs worth planning a trip around. Cracked screens dominate, followed by battery that no longer last a day, and those are precisely the two finished while you wait.",
        "Charging ports come third and are the repair most often avoidable. Compacted pocket lint stops the cable seating and looks exactly like a failed port, so we check and clear the socket before quoting a replacement. On a trip in from out of town, that is sometimes the whole visit and nothing to pay.",
        "For anything beyond a phone, the same store handles tablets, laptops and desktop computers, so a trip can cover more than one device. Bring model numbers where you have them and chargers for anything that will not power on.",
      ],
    },
    {
      heading: "What else can you bring on the same trip?",
      paragraphs: [
        "Everything TechBrotherz repairs happens at the one Store, so a trip in from Chestermere can cover more than one device. Phones, Ipads, Android and Windows tablets, laptops and desktop towers are all handled in the same visit, along with carrier unlocking and computer work.",
        "That changes the arithmetic on a drive. One journey for a cracked phone is a reasonable errand; one journey for a cracked phone, a laptop that will not charge and a tablet with a dead battery is a genuinely efficient trip. Bring model numbers where you have them and chargers for anything that will not power on.",
        "The one thing worth splitting out is computer work, which is a drop-off rather than a wait. If you are bringing a tower as well as a phone, the phone can be done while you wait and the tower collected on a later trip, or we can call when it is ready.",
      ],
    },
  ],
  localMix: [
    {
      title: "One trip, not two",
      body: "Screens and battery on stocked models are done at the Store, which is what makes a drive in from Chestermere worth it.",
    },
    {
      title: "Call ahead about parts",
      body: "The one thing that turns a single journey into two is a part we do not stock. A call before setting off answers it in a minute.",
    },
    {
      title: "More than one device at once",
      body: "Phones, tablets, laptops and desktops are all repaired at the same Store, so a trip can cover the household.",
    },
  ],
  faqs: (c) => [
    {
      question: "Where can I get a phone repaired near Chestermere?",
      answer: `TechBrotherz is at 3317 17 Ave SE in Calgary, on the road Chestermere residents already use: Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit. Most repairs take about ${c.waitMinutes} minutes at the Store, and the quote is free and given before any work starts.`,
    },
    {
      question: "Do Chestermere customers pay more for phone repair?",
      answer: `No. TechBrotherz quotes the same figures regardless of where a customer travels from. There is no travel surcharge and no out-of-city rate, and every repair carries the same ${c.warrantyDays}-day warranty.`,
    },
    {
      question: "Should I call before driving in from Chestermere?",
      answer:
        "Yes, and it is the single most useful thing to do. Most repairs are finished at the Store while you wait, but a part TechBrotherz does not stock has to be ordered in, which usually adds a day or two and turns one trip into two. A call confirms stock for your model in a minute.",
    },
  ],
  globalCategories: ["walkin", "pricing"],
};

export const LOCAL_OTHER: LocalDef[] = [unlockingCalgary, walkInCalgary, chestermerePhones];
