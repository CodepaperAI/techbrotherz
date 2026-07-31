/**
 * Copy for the three Tier 6 place pages.
 *
 * The axis here is place, which is weaker than service, so these carry more
 * map, hours, directions and route content and less service depth. They link
 * out to the service and brand pages rather than restating what those say.
 *
 * Eleven neighbourhood pages became three place pages plus seven anchored
 * sections on /locations/calgary. The reasoning and the fact counts are in
 * content/local-inventory.md. The short version: nine brand hubs were the
 * least differentiated tier on the site at 63.0% despite having manufacturers
 * and price ranges to work with, and neighbourhood pages have strictly less
 * material than that.
 */

import type { PageFaq } from "@/lib/faq/scoping";
import { checkFactUse, type FactUse } from "@/lib/content/local-shared";
import type { ProseSection, ServiceCtx } from "@/lib/content/services";

/** One of the seven neighbourhoods that became a section rather than a page. */
export interface NeighbourhoodSection {
  /** Anchor id, used as /locations/calgary#<id>. */
  id: string;
  name: string;
  paragraphs: string[];
  /** True where the content rests on facts we could verify. */
  verified: boolean;
}

export interface PlaceDef {
  path: string;
  /** Route segments, for generateStaticParams. */
  segments: string[];
  h1: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  crumbLabel: string;
  facts: FactUse[];
  lead: (c: ServiceCtx) => string;
  answer: (c: ServiceCtx) => string;
  keyFacts: (c: ServiceCtx) => { label: string; value: string }[];
  sections: (c: ServiceCtx) => ProseSection[];
  /** Anchored neighbourhood sections. Only /locations/calgary carries these. */
  neighbourhoods?: NeighbourhoodSection[];
  /** Tier 5 pages this place hands off to. */
  servicePaths: string[];
  /** Brand hubs worth linking. */
  brandPaths: string[];
  /** Sibling place pages. */
  siblings: string[];
  faqs: (c: ServiceCtx) => PageFaq[];
  globalCategories: string[];
}

/* ================================================ the seven cut neighbourhoods */

const CALGARY_NEIGHBOURHOODS: NeighbourhoodSection[] = [
  {
    id: "albert-park-radisson-heights",
    name: "Albert Park and Radisson Heights",
    verified: true,
    paragraphs: [
      "This is the shop's own community. Albert Park/Radisson Heights sits immediately north of 17 Avenue SE, bounded by Memorial Drive to the north, 36 Street SE to the east and Barlow Trail to the west, and TechBrotherz is on its southern edge at 33 Street.",
      "For anyone living here the shop is a walk rather than a drive, which is unusual for a repair counter and is the main reason to know it exists. There is no route to work out and no parking question to solve.",
    ],
  },
  {
    id: "southview",
    name: "Southview",
    verified: true,
    paragraphs: [
      "Southview sits directly across 17 Avenue SE from the shop, on the south side. 33 Street SE Station, the MAX Purple stop on the transitway outside our door, is described by Calgary Transit as the central access point for Southview, so the station serves both sides of the avenue.",
      "That makes Southview the second community where getting here does not involve a car at all. Cross the avenue at 33 Street and you are outside.",
    ],
  },
  {
    id: "forest-heights",
    name: "Forest Heights",
    verified: true,
    paragraphs: [
      "Forest Heights lies east of Albert Park/Radisson Heights, on the way toward Forest Lawn. 17 Avenue SE runs along the whole corridor, so the trip in is a straight run west along the avenue with no turns.",
      "Forest Lawn has its own page covering the International Avenue strip in more detail, and Forest Heights sits between it and the shop.",
    ],
  },
  {
    id: "inglewood",
    name: "Inglewood",
    verified: true,
    paragraphs: [
      "17 Avenue SE passes through Inglewood at its western end, west of the Bow River, before running east through Albert Park/Radisson Heights and Southview to reach the shop. It is the same avenue the whole way.",
      "Coming from Inglewood means heading east on 17 Avenue SE and crossing Deerfoot Trail and Barlow Trail. MAX Purple runs the same corridor if you would rather not drive.",
    ],
  },
  {
    id: "downtown-calgary",
    name: "Downtown Calgary",
    verified: true,
    paragraphs: [
      "17 Avenue SE begins downtown at 9 Avenue SE and 15 Street SE and runs 11.2 kilometres east to the city limit. The shop is on that avenue at 33 Street, so the route from downtown is one road east.",
      "MAX Purple runs from downtown along the same corridor in a dedicated median transitway, which makes this the easiest trip on the list to make without a car.",
    ],
  },
  {
    id: "dover",
    name: "Dover",
    verified: false,
    paragraphs: [
      "Dover is one of the southeast communities the shop serves. We have not published a specific route or landmark for it here, because we could not verify one we would be willing to put in print, and a wrong direction is worse than none.",
      "The shop is on 17 Avenue SE at 33 Street. If you are coming from Dover and want the best way in, phone the counter and ask.",
    ],
  },
  {
    id: "ogden",
    name: "Ogden",
    verified: false,
    paragraphs: [
      "Ogden is another southeast community within the area TechBrotherz serves. As with Dover, we have not written a route or named a landmark we could not confirm.",
      "What is certain is the destination: 3317 17 Ave SE, on the avenue, with a transit stop outside. Phone ahead if you want directions from your end.",
    ],
  },
  {
    id: "airdrie",
    name: "Airdrie",
    verified: true,
    paragraphs: [
      "TechBrotherz repairs devices for Airdrie customers, and it is worth being straight about the trip. Airdrie is north of Calgary and the shop is in the southeast, so this is a real drive down Deerfoot Trail rather than a quick errand, and 17 Avenue SE crosses Deerfoot on the way in.",
      "Airdrie's own ICE transit routes 901 and 902 run to downtown Calgary rather than to 17 Avenue SE, and route 900 reaches Rundle CTrain station via CrossIron Mills on weekends and holidays, so transit means a transfer.",
      "The reasons someone makes the trip anyway are the published price list, the 60-day warranty and not needing an appointment. There is no Airdrie page on this site because we could not write one with enough verified local detail to be worth reading, and we would rather say that than pad it.",
    ],
  },
];

/* ========================================================= locations/calgary */

const calgary: PlaceDef = {
  path: "/locations/calgary",
  segments: ["calgary"],
  h1: "Device Repair in Calgary",
  eyebrow: "Calgary",
  seoTitle: "Repair Shop Calgary | 3317 17 Ave SE, International Ave",
  seoDescription:
    "TechBrotherz is at 3317 17 Ave SE on International Avenue in southeast Calgary, beside 33 Street SE Station. Walk in, no appointment, 60-day warranty on every repair.",
  crumbLabel: "Calgary",
  facts: checkFactUse("/locations/calgary", [
    { fact: "transitway", treatment: "full" },
    { fact: "international-avenue", treatment: "full" },
  ]),
  lead: () =>
    "TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in southeast Calgary, sits on International Avenue at 33 Street, with Albert Park and Radisson Heights to the north and Southview to the south. 33 Street SE Station, on the dedicated 17 Avenue Transitway, is outside the door.",
  answer: (c) =>
    `TechBrotherz is at 3317 17 Ave SE in southeast Calgary, on International Avenue at 33 Street, between Albert Park/Radisson Heights and Southview. 33 Street SE Station on the 17 Avenue Transitway is outside the shop, so it is reachable by MAX Purple without a car. No appointment is needed, most phone repairs take about ${c.waitMinutes} minutes, and every repair carries a ${c.warrantyDays}-day warranty.`,
  keyFacts: (c) => [
    { label: "Address", value: "3317 17 Ave SE, Calgary, Alberta" },
    { label: "On", value: "International Avenue, at 33 Street SE" },
    { label: "Transit", value: "33 Street SE Station, MAX Purple, outside" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Warranty", value: `${c.warrantyDays} days on every repair` },
  ],
  sections: () => [
    {
      heading: "Where exactly is TechBrotherz in Calgary?",
      paragraphs: [
        "TechBrotherz is at 3317 17 Ave SE, which puts it on 17 Avenue SE at 33 Street, in southeast Calgary. The community to the north of the avenue at that point is Albert Park/Radisson Heights, and the community to the south is Southview. Forest Lawn begins a few blocks further east, around 36 Street.",
        "That precision matters because the whole corridor is commonly called Forest Lawn, after the village annexed by Calgary in 1961 that International Avenue is centred on. The shop is on International Avenue, which is true, and it is not in Forest Lawn, which people often assume.",
        "17 Avenue SE runs 11.2 kilometres inside Calgary, from 9 Avenue SE and 15 Street SE downtown east to the city limit, crossing Blackfoot Trail, Deerfoot Trail, Barlow Trail, 36 Street SE, 52 Street SE and Stoney Trail on the way. Whichever direction you approach from, the shop is on that one avenue.",
      ],
    },
    {
      heading: "How do you get to TechBrotherz by transit?",
      paragraphs: [
        "33 Street SE Station is on the 17 Avenue Transitway, a dedicated bus-only corridor running down the middle of the avenue, and it is outside the shop. MAX Purple, route 307, serves it, running from downtown Calgary east to the eastern city limits. The line opened on 19 November 2018.",
        "Because the transitway is a median corridor separated from general traffic, MAX Purple is not held up by the congestion on 17 Avenue that a normal bus route would sit in. The stations have heated shelters and real-time arrival displays, which matters in a Calgary February more than it does in July.",
        "For most of the communities along the avenue this makes the shop reachable without a car at all, which is unusual for a repair counter. Southview is directly across the avenue, Albert Park and Radisson Heights are immediately north, and downtown is a straight run west on the same line.",
      ],
    },
    {
      heading: "What is International Avenue?",
      paragraphs: [
        "International Avenue is the Business Revitalization Zone along 17 Avenue SE, running from 26 Street to 61 Street SE. It was created in 1993 to revitalise the former town of Forest Lawn, annexed by Calgary in 1961, and it now covers more than 400 merchants across 35 blocks.",
        "The district is known for the density and range of its restaurants and shops, and it describes itself as going around the world in 35 blocks. TechBrotherz is inside that zone, toward its western end at 33 Street.",
        "The corridor also hosts GlobalFest each year, combining the OneWorld Festival with an international fireworks competition at Elliston Park in late August. It is the busiest week of the year on this stretch of the avenue.",
      ],
    },
    {
      heading: "What can you get repaired at the Calgary shop?",
      paragraphs: [
        "Everything the shop does happens at this one counter: cell phones, iPads, Android and Windows tablets, laptops and desktop computers, plus carrier unlocking, virus removal and Windows password resets. There is no second location and no mail-in service.",
        "That means the same technicians see a device from diagnosis to hand-back, and it means a household can bring several devices in one trip. Phones are usually finished while you wait; tablets and computers are same-day drop-offs.",
        "Prices are published per device model rather than quoted on the day, so you can check the figure for your exact handset before deciding to come in. The full list is on the repair prices page, and each service page carries the prices relevant to it.",
      ],
    },
  ],
  neighbourhoods: CALGARY_NEIGHBOURHOODS,
  servicePaths: [
    "/phone-repair-calgary",
    "/laptop-repair-calgary",
    "/computer-repair-calgary",
    "/walk-in-phone-repair-calgary",
  ],
  brandPaths: ["/repair/apple-iphone", "/repair/samsung-galaxy", "/repair/apple-ipad"],
  siblings: ["/locations/calgary/forest-lawn", "/locations/chestermere"],
  faqs: () => [
    {
      question: "What neighbourhood is TechBrotherz in?",
      answer:
        "TechBrotherz is at 3317 17 Ave SE, on International Avenue at 33 Street. The community north of the avenue there is Albert Park/Radisson Heights and the community south is Southview. Forest Lawn begins a few blocks further east around 36 Street, so the shop is on International Avenue rather than in Forest Lawn itself.",
    },
    {
      question: "Can I get to TechBrotherz on the bus?",
      answer:
        "Yes. 33 Street SE Station is on the 17 Avenue Transitway, a dedicated bus-only median corridor, and it is outside the shop. MAX Purple, route 307, runs from downtown Calgary east along it and opened on 19 November 2018. Stations have heated shelters and real-time arrival displays.",
    },
    {
      question: "Does TechBrotherz have more than one Calgary location?",
      answer:
        "No. TechBrotherz operates one shop, at 3317 17 Ave SE. Every repair is carried out there, which is why the same technicians see a device from diagnosis through to hand-back, and why a household can bring several devices in on one trip.",
    },
  ],
  globalCategories: ["location", "walkin"],
};

/* ============================================ locations/calgary/forest-lawn */

const forestLawn: PlaceDef = {
  path: "/locations/calgary/forest-lawn",
  segments: ["calgary", "forest-lawn"],
  h1: "Phone and Computer Repair for Forest Lawn",
  eyebrow: "Forest Lawn",
  seoTitle: "Phone Repair Forest Lawn | International Avenue Calgary",
  seoDescription:
    "Repair shop serving Forest Lawn from 3317 17 Ave SE on International Avenue, a few blocks west at 33 Street. Walk in, no appointment, 60-day warranty.",
  crumbLabel: "Forest Lawn",
  facts: checkFactUse("/locations/calgary/forest-lawn", [
    {
      fact: "transitway",
      treatment: "mention",
      sentence:
        "36 Street SE Station is the transitway stop for the Forest Lawn shopping district, and the shop is one stop further west at 33 Street SE Station.",
    },
    {
      fact: "international-avenue",
      treatment: "mention",
      sentence:
        "International Avenue runs from 26 Street to 61 Street SE, so Forest Lawn and the shop sit on the same 35-block strip.",
    },
  ]),
  lead: () =>
    "TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in southeast Calgary, serves Forest Lawn from a few blocks west along the same avenue. The shop is at 33 Street, and Forest Lawn begins around 36 Street, so it is one straight run east or west on International Avenue.",
  answer: (c) =>
    `TechBrotherz serves Forest Lawn from 3317 17 Ave SE, a few blocks west at 33 Street on the same International Avenue strip. It is a walk-in shop with no appointment needed, most phone repairs take about ${c.waitMinutes} minutes, and every repair carries a ${c.warrantyDays}-day warranty. 36 Street SE Station is the transitway stop for the Forest Lawn shopping district, one stop east of the shop.`,
  keyFacts: (c) => [
    { label: "Address", value: "3317 17 Ave SE, at 33 Street" },
    { label: "From Forest Lawn", value: "West along 17 Avenue SE, same street" },
    { label: "Transit", value: "One stop west of 36 Street SE Station" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Warranty", value: `${c.warrantyDays} days on every repair` },
  ],
  sections: () => [
    {
      heading: "Is TechBrotherz in Forest Lawn?",
      paragraphs: [
        "Not quite, and it is worth saying so plainly rather than claiming otherwise. TechBrotherz is at 3317 17 Ave SE, which is 33 Street. Forest Lawn begins around 36 Street SE, so the shop is a few blocks west of it, in the stretch where Albert Park and Radisson Heights sit north of the avenue and Southview sits south.",
        "What is true is that both are on International Avenue. The Business Revitalization Zone runs from 26 Street all the way to 61 Street SE, so Forest Lawn and the shop are on the same 35-block strip, and the trip between them is one straight run along the avenue with no turns.",
        "People who live in Forest Lawn generally know exactly where 33 Street is, which is the practical point. A repair shop that tells you it is in your neighbourhood when it is not is a repair shop you have already caught being loose with the truth.",
      ],
    },
    {
      heading: "How do you get there from Forest Lawn?",
      paragraphs: [
        "West along 17 Avenue SE. That is the whole direction. From the Forest Lawn shopping district around 36 Street, the shop is three blocks west on the same side of the city, and there is no turn to make and no other road involved.",
        "By transit it is one stop. 36 Street SE Station is the MAX Purple stop that Calgary Transit describes as the connection for the Forest Lawn shopping district and the Forest Lawn Library, and 33 Street SE Station is the next one west, outside the shop. Both are on the dedicated transitway rather than in traffic.",
        "Heading the other way is worth knowing too, because 17 Avenue SE runs through four named communities on its way west from Forest Lawn: Forest Heights, then Albert Park and Radisson Heights, then Southview, then Inglewood on the far side of the Bow River. The shop sits between Albert Park/Radisson Heights and Southview, which is the second of those.",
        "The full explanation of the transitway, the MAX Purple line and what makes it quicker than an ordinary bus route is on the Calgary location page rather than repeated here.",
      ],
    },
    {
      heading: "What is on this stretch of International Avenue?",
      paragraphs: [
        "The International Avenue BRZ was created in 1993 to revitalise the former town of Forest Lawn, which Calgary annexed in 1961. It now covers more than 400 merchants along 35 blocks of 17 Avenue SE, and it is best known for the range and density of its restaurants.",
        "Forest Lawn Library has been part of the Calgary Public Library system since 1962, when the village was annexed. It moved twice in its early years and its current building at 4807 8 Avenue SE opened on 16 July 1973.",
        "Each August the corridor hosts GlobalFest, which combines the OneWorld Festival with an international fireworks competition at Elliston Park. It is the busiest stretch of the year on this part of the avenue and worth knowing about if you are planning a trip in.",
      ],
    },
    {
      heading: "What does TechBrotherz repair for Forest Lawn customers?",
      paragraphs: [
        "The same range as for everyone: cell phones, iPads, Android and Windows tablets, laptops and desktop computers, plus carrier unlocking, virus removal and Windows password resets. There is one counter and one set of published prices.",
        "Phone repairs are the ones worth walking in for without planning, because screens and batteries on stocked models are finished while you wait. Tablets and computers are same-day drop-offs, which suits a neighbourhood close enough to make two short trips.",
        "Prices are published per device model rather than quoted on arrival, so you can check the figure for your exact handset before coming down. Nothing about the price or the warranty changes based on which neighbourhood you are travelling from.",
      ],
    },
    {
      heading: "What TechBrotherz does not claim about Forest Lawn",
      paragraphs: [
        "No years in the neighbourhood, no founding date and no claim to be a Forest Lawn institution. TechBrotherz has not published a founding year anywhere on this site, because the year has not been confirmed, and writing around a missing fact with vague warmth is how a page stops being trustworthy.",
        "There is no claim to be the closest repair shop to Forest Lawn either. There are other shops along International Avenue, which is a 35-block commercial strip with more than 400 merchants, and some of them will be nearer to you than 33 Street. What this page can tell you honestly is where the shop is, what it charges and how long the work takes.",
        "The reason to be this careful on a neighbourhood page is that the audience checks. Someone who lives in Forest Lawn knows where 33 Street is, knows what else is on the avenue, and will notice a shop describing itself as local when it is three blocks outside. Getting that wrong costs more than the page is worth.",
      ],
    },
  ],
  servicePaths: [
    "/phone-repair-calgary",
    "/walk-in-phone-repair-calgary",
    "/iphone-screen-repair-calgary",
    "/laptop-repair-calgary",
  ],
  brandPaths: ["/repair/apple-iphone", "/repair/samsung-galaxy"],
  siblings: ["/locations/calgary", "/locations/chestermere"],
  faqs: (c) => [
    {
      question: "Is there a phone repair shop in Forest Lawn?",
      answer:
        "TechBrotherz serves Forest Lawn from 3317 17 Ave SE, a few blocks west at 33 Street on the same International Avenue strip. The shop is not inside Forest Lawn itself, which begins around 36 Street SE, but it is one straight run west along 17 Avenue SE with no turns.",
    },
    {
      question: "How far is TechBrotherz from the Forest Lawn shopping district?",
      answer:
        "Three blocks west along 17 Avenue SE. By transit it is one stop: 36 Street SE Station is the MAX Purple stop serving the Forest Lawn shopping district and library, and 33 Street SE Station outside the shop is the next one west on the same dedicated transitway.",
    },
    {
      question: "Do I need an appointment coming from Forest Lawn?",
      answer: `No. TechBrotherz takes repairs as walk-ins during opening hours, from Forest Lawn or anywhere else. Most phone repairs are finished in about ${c.waitMinutes} minutes at the counter while you wait, and every repair carries a ${c.warrantyDays}-day warranty on the part and the workmanship.`,
    },
  ],
  globalCategories: ["location", "walkin"],
};

/* ===================================================== locations/chestermere */

const chestermere: PlaceDef = {
  path: "/locations/chestermere",
  segments: ["chestermere"],
  h1: "Device Repair for Chestermere",
  eyebrow: "Chestermere",
  seoTitle: "Repair Shop Near Chestermere | One Road, 17 Ave SE",
  seoDescription:
    "TechBrotherz serves Chestermere from 3317 17 Ave SE Calgary. Chestermere Boulevard becomes 17 Avenue SE at the city limit, so it is one road the whole way in.",
  crumbLabel: "Chestermere",
  facts: checkFactUse("/locations/chestermere", [{ fact: "chestermere-road", treatment: "full" }]),
  lead: () =>
    "TechBrotherz, a walk-in repair shop at 3317 17 Ave SE in southeast Calgary, serves Chestermere from the western end of the road Chestermere already uses. Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit, and the shop is on it.",
  answer: (c) =>
    `TechBrotherz serves Chestermere from 3317 17 Ave SE in Calgary. Chestermere Boulevard runs 3.8 kilometres west from Highway 1 to the Calgary city limit at 116 Street SE, where it becomes 17 Avenue SE and continues to the shop, so the trip is one road with no highway section and no turns. No appointment is needed and every repair carries a ${c.warrantyDays}-day warranty.`,
  keyFacts: (c) => [
    { label: "The route", value: "Chestermere Blvd, then 17 Ave SE, one road" },
    { label: "Where it changes name", value: "The city limit at 116 Street SE" },
    { label: "Address", value: "3317 17 Ave SE, at 33 Street" },
    { label: "Appointment", value: "Not needed, walk in during opening hours" },
    { label: "Warranty", value: `${c.warrantyDays} days on every repair` },
  ],
  sections: () => [
    {
      heading: "How do you get from Chestermere to TechBrotherz?",
      paragraphs: [
        "You stay on one road. Chestermere Boulevard is the eastern extension of 17 Avenue SE: it runs 3.8 kilometres from the Highway 1 interchange west to the Calgary city limit at 116 Street SE, where the name changes to 17 Avenue SE. The shop is on that same avenue at 33 Street.",
        "So there is no highway section, no ring-road decision and no navigating unfamiliar streets. From Chestermere it is west, and you keep going west until 33 Street. For a device repair, which is the kind of errand people put off because of the hassle, that turns out to matter more than the distance does.",
        "17 Avenue SE crosses Stoney Trail on the way in, which is the point where a driver could take the ring road instead. For this destination there is no reason to: staying on the avenue is the direct route.",
      ],
    },
    {
      heading: "Is it worth the trip from Chestermere?",
      paragraphs: [
        "That depends on the repair, and the honest answer is that it depends most on whether the part is in stock. If it is a screen or a battery on a model TechBrotherz stocks, the repair is done at the counter while you wait and the trip is a single journey. If the part has to be ordered, it is two journeys, and that changes the arithmetic.",
        "A phone call before setting off settles it in a minute, and it is the single most useful thing a Chestermere customer can do. We would rather tell you to wait two days than have you drive in twice.",
        "The other reasons to make the trip are the same ones that apply to anyone: prices published per device model rather than quoted on the day, the part and the labour in one figure, a 60-day warranty, and no appointment to book.",
      ],
    },
    {
      heading: "What does TechBrotherz repair for Chestermere customers?",
      paragraphs: [
        "Cell phones, iPads, Android and Windows tablets, laptops and desktop computers, along with carrier unlocking, virus removal and Windows password resets. It is one counter, so a household making the trip can bring several devices at once rather than making separate journeys.",
        "Phone repairs are the ones finished while you wait. Tablet and computer work is a same-day drop-off, which is worth knowing before driving in: that is two trips rather than one, or a long wait in Calgary.",
        "Prices do not change based on where you travel from. There is no out-of-city rate, no travel surcharge, and the warranty is identical.",
      ],
    },
    {
      heading: "What should Chestermere customers do before driving in?",
      paragraphs: [
        "Phone ahead and confirm the part for your model is in stock. That single call is what decides whether the trip is one journey or two, and it is free.",
        "Check the published price for your exact model first. Every iPhone and Galaxy in the catalogue has its own figure, so you can decide whether the repair is worth doing before you decide whether the drive is worth making.",
        "Bring the charger for a laptop or desktop, and back up any device before a repair. Those apply to everyone, and they matter more when the shop is a drive away rather than around the corner.",
      ],
    },
    {
      heading: "Why this page does not give you a drive time",
      paragraphs: [
        "Because we could not verify one worth printing. The route is certain: Chestermere Boulevard becomes 17 Avenue SE at the Calgary city limit at 116 Street SE, and the shop is on that avenue at 33 Street. The minutes are not, because published figures measure city centre to city centre rather than your street to our counter, and 17 Avenue SE traffic varies enormously by time of day.",
        "A wrong drive time on a local page is the kind of small inaccuracy that tells a reader the rest of the page might be guessed too. It would be easy to write about twenty minutes and it would be a guess, so the page gives you the route and leaves the timing to a map and your own knowledge of the road.",
        "The same applies to parking, which is not published here for the same reason. Phone the shop and ask: the counter can tell you where to leave the car and roughly how long the run in takes at the hour you are planning to travel, which is better information than any figure we could put on this page.",
      ],
    },
    {
      heading: "What to expect when you arrive",
      paragraphs: [
        "There is no appointment and no queue system. You come to the counter, describe what the device is doing, and it is diagnosed in front of you. The price is quoted before any work starts, and nothing begins until you agree to it.",
        "Most phone repairs are finished at the counter while you wait, so the usual pattern for someone travelling in is one visit. Tablet and computer work is a drop-off, and that is the case where a trip from Chestermere becomes two journeys, which is worth planning around rather than discovering on arrival.",
        "Every repair carries a 60-day warranty on the part and the workmanship, and a warranty claim means bringing the device back with the receipt. There is no form and no appointment for that either, though it is another reason the trip is worth thinking about before choosing where to have a repair done.",
      ],
    },
  ],
  servicePaths: [
    "/cell-phone-repair-chestermere",
    "/phone-repair-calgary",
    "/laptop-repair-calgary",
    "/computer-repair-calgary",
  ],
  brandPaths: ["/repair/apple-iphone", "/repair/samsung-galaxy"],
  siblings: ["/locations/calgary", "/locations/calgary/forest-lawn"],
  faqs: (c) => [
    {
      question: "How do I get to TechBrotherz from Chestermere?",
      answer:
        "Head west on Chestermere Boulevard. It becomes 17 Avenue SE at the Calgary city limit at 116 Street SE and continues west to the shop at 3317 17 Ave SE, at 33 Street. It is one road the whole way, with no highway section and no turns.",
    },
    {
      question: "Is there a repair shop in Chestermere itself?",
      answer:
        "TechBrotherz is in Calgary, at 3317 17 Ave SE, and serves Chestermere customers from there. Chestermere Boulevard is the eastern extension of the same avenue, which makes the trip a straight run west. TechBrotherz does not operate a Chestermere location.",
    },
    {
      question: "Should I call before driving in from Chestermere?",
      answer: `Yes. Most repairs are finished at the counter while you wait, but a part TechBrotherz does not stock has to be ordered in, which usually adds a day or two and turns one trip into two. A call confirms stock for your model in a minute. Every repair carries a ${c.warrantyDays}-day warranty.`,
    },
  ],
  globalCategories: ["location", "walkin"],
};

export const PLACES: PlaceDef[] = [calgary, forestLawn, chestermere];

const BY_PATH = new Map(PLACES.map((entry) => [entry.path, entry]));

export function placeContent(path: string): PlaceDef | undefined {
  return BY_PATH.get(path);
}
