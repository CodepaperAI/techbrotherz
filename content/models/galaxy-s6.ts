/**
 * GENERATED from the Sanity dataset in the Phase 6.9 move.
 *
 * Copy lives in the repo now, not the CMS, so the similarity detector and the
 * word-count check run over it in a pull request. Edit it here.
 */

import type { ModelContent } from "@/lib/content/model-content";

const content: ModelContent = {
  "slug": "galaxy-s6",
  "name": "Galaxy S6",
  "intro": [
    {
      "_key": "model.galaxy-s6-intro-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-intro-s0",
          "_type": "span",
          "marks": [],
          "text": "The Galaxy S6 has a flat display where the S6 Edge curves, and it was Samsung's move to a glass and metal body after years of plastic backs. That switch is why the S6 was the first Galaxy S with a back that shatters, and why back glass became a routine repair on this generation."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "commonIssues": [
    "Cracked rear glass, new to this generation after years of plastic backs",
    "Cracked front glass on the flat 5.1 inch display",
    "Battery sealed and degraded, no longer user-replaceable from this model on",
    "Micro USB port worn",
    "Home button with fingerprint reader failing"
  ],
  "verdict": [
    {
      "_key": "model.galaxy-s6-verdict-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-verdict-s0",
          "_type": "span",
          "marks": [],
          "text": "Only for the smaller repairs. The Galaxy S6 stopped at Android 7 and no longer receives security updates. A back glass or a battery on a phone still in daily use is defensible. The screen is not, because it costs more than the phone is worth."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "repairNotes": [
    {
      "_key": "model.galaxy-s6-notes-b0",
      "_type": "block",
      "children": [
        {
          "_key": "model.galaxy-s6-notes-s0",
          "_type": "span",
          "marks": [],
          "text": "The S6 was Samsung's first glass-backed Galaxy S, which introduced wireless charging and, at the same time, a second surface that breaks. Rear glass is one of the smaller repairs on this model, and it is worth doing promptly because loose shards spread."
        }
      ],
      "markDefs": [],
      "style": "normal"
    }
  ],
  "lastSupportedOs": "Android 7",
  "stillReceivesUpdates": false
} as ModelContent;

export default content;
