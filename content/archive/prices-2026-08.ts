/**
 * ARCHIVED PRICES. Nothing imports this file.
 *
 * The client decided in August 2026 that no price appears anywhere on the site.
 * Phases 7a-i, 7a-i-b and 7a-ii removed every figure from the copy, the data and
 * the structured data. This file is the record, so that reversing the decision
 * is an afternoon of work rather than re-entering a printed price list.
 *
 * WHAT IS CHEAPEST TO REstore, IF THE CLIENT RECONSIDERS
 *
 * Two items need no diagnosis, so "it depends" was never true of them and they
 * were the strongest quotable facts on the site:
 *
 *   1. The carrier unlock. One figure, any Canadian carrier, no inspection.
 *      CLAUDE.md Section 8.4 named it as a unique GEO asset.
 *   2. The ten flat computer services. Each is a fixed job at a fixed figure,
 *      agreed before work starts, and they are what made the computer pages
 *      concrete rather than generic.
 *
 * Restoring either is: put the number back in content/data/, add the figure to
 * the relevant copy, and re-emit the Offer nodes in lib/seo/schema.ts. The model
 * prices below are a larger job and were always the weaker asset, because they
 * genuinely do depend on the handset and the damage.
 *
 * Archived 54 models carrying 154 priced repairs,
 * 10 flat services and 1 unlocking entry.
 *
 * 2026-08: the client removed LG, Motorola, HTC and Google Nexus from the
 * catalogue entirely. The rows for those models stay below because this file
 * is a record, but do not restore them: the shop no longer repairs those
 * brands, and their URLs 301 to /services/phone-repair.
 */

export const ARCHIVED_MODEL_PRICES = [
  {
    "slug": "galaxy-a5-2017",
    "name": "Galaxy A5 (2017)",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 69.99
      },
      {
        "repair": "screen-replacement",
        "price": 179.99
      }
    ]
  },
  {
    "slug": "galaxy-note-10",
    "name": "Galaxy Note 10",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 469.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "galaxy-note-10-plus",
    "name": "Galaxy Note 10 Plus",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 499.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "galaxy-note-2",
    "name": "Galaxy Note 2",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "charging-port-repair",
        "price": 49.99
      }
    ]
  },
  {
    "slug": "galaxy-note-3",
    "name": "Galaxy Note 3",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "charging-port-repair",
        "price": 49.99
      }
    ]
  },
  {
    "slug": "galaxy-note-4",
    "name": "Galaxy Note 4",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 174.99
      }
    ]
  },
  {
    "slug": "galaxy-note-5",
    "name": "Galaxy Note 5",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 249.99
      }
    ]
  },
  {
    "slug": "galaxy-note-8",
    "name": "Galaxy Note 8",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 329.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "galaxy-note-9",
    "name": "Galaxy Note 9",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 349.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "galaxy-s4",
    "name": "Galaxy S4",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "glass-digitizer",
        "price": 69.99
      },
      {
        "repair": "screen-replacement",
        "price": 99.99
      }
    ]
  },
  {
    "slug": "galaxy-s5",
    "name": "Galaxy S5",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 149.99
      }
    ]
  },
  {
    "slug": "galaxy-s5-neo",
    "name": "Galaxy S5 Neo",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 149.99
      }
    ]
  },
  {
    "slug": "galaxy-s6",
    "name": "Galaxy S6",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 44.99
      },
      {
        "repair": "battery-replacement",
        "price": 69.99
      },
      {
        "repair": "screen-replacement",
        "price": 189.99
      }
    ]
  },
  {
    "slug": "galaxy-s6-edge",
    "name": "Galaxy S6 Edge",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 44.99
      },
      {
        "repair": "battery-replacement",
        "price": 69.99
      },
      {
        "repair": "screen-replacement",
        "price": 199.99
      }
    ]
  },
  {
    "slug": "galaxy-s7",
    "name": "Galaxy S7",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 74.99
      },
      {
        "repair": "screen-replacement",
        "price": 249.99
      }
    ]
  },
  {
    "slug": "galaxy-s7-edge",
    "name": "Galaxy S7 Edge",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 74.99
      },
      {
        "repair": "screen-replacement",
        "price": 269.99
      }
    ]
  },
  {
    "slug": "galaxy-s8",
    "name": "Galaxy S8",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 79.99
      },
      {
        "repair": "screen-replacement",
        "price": 299.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "galaxy-s8-plus",
    "name": "Galaxy S8 Plus",
    "brandSlug": "samsung-galaxy",
    "repairs": [
      {
        "repair": "back-glass-replacement",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 79.99
      },
      {
        "repair": "screen-replacement",
        "price": 289.99,
        "needsVerification": true
      }
    ]
  },
  {
    "slug": "htc-one-m7",
    "name": "HTC One M7",
    "brandSlug": "htc",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 100
      }
    ]
  },
  {
    "slug": "htc-one-m8",
    "name": "HTC One M8",
    "brandSlug": "htc",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "htc-one-m9",
    "name": "HTC One M9",
    "brandSlug": "htc",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 120
      }
    ]
  },
  {
    "slug": "ipad-2",
    "name": "iPad 2",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "ipad-3",
    "name": "iPad 3",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "ipad-4",
    "name": "iPad 4",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "ipad-air",
    "name": "iPad Air",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 89.99
      }
    ]
  },
  {
    "slug": "ipad-mini",
    "name": "iPad Mini",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 79.99
      }
    ]
  },
  {
    "slug": "ipad-mini-2",
    "name": "iPad Mini 2",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 79.99
      }
    ]
  },
  {
    "slug": "ipad-mini-3",
    "name": "iPad Mini 3",
    "brandSlug": "apple-ipad",
    "repairs": [
      {
        "repair": "glass-digitizer",
        "price": 129.99
      }
    ]
  },
  {
    "slug": "iphone-4",
    "name": "iPhone 4",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 39
      },
      {
        "repair": "battery-replacement",
        "price": 39
      },
      {
        "repair": "charging-port-repair",
        "price": 39
      },
      {
        "repair": "earpiece-repair",
        "price": 35
      },
      {
        "repair": "front-camera-repair",
        "price": 39
      },
      {
        "repair": "home-button",
        "price": 35
      },
      {
        "repair": "power-button",
        "price": 49
      },
      {
        "repair": "screen-replacement",
        "price": 50
      },
      {
        "repair": "speaker-repair",
        "price": 35
      }
    ]
  },
  {
    "slug": "iphone-4s",
    "name": "iPhone 4S",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 39
      },
      {
        "repair": "battery-replacement",
        "price": 39
      },
      {
        "repair": "charging-port-repair",
        "price": 39
      },
      {
        "repair": "earpiece-repair",
        "price": 35
      },
      {
        "repair": "front-camera-repair",
        "price": 39
      },
      {
        "repair": "home-button",
        "price": 35
      },
      {
        "repair": "power-button",
        "price": 49
      },
      {
        "repair": "screen-replacement",
        "price": 50
      },
      {
        "repair": "speaker-repair",
        "price": 35
      }
    ]
  },
  {
    "slug": "iphone-5",
    "name": "iPhone 5",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 44.99
      },
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "earpiece-repair",
        "price": 34.99
      },
      {
        "repair": "front-camera-repair",
        "price": 44.99
      },
      {
        "repair": "home-button",
        "price": 34.99
      },
      {
        "repair": "power-button",
        "price": 59.99
      },
      {
        "repair": "screen-replacement",
        "price": 44.99
      },
      {
        "repair": "speaker-repair",
        "price": 44.99
      }
    ]
  },
  {
    "slug": "iphone-5c",
    "name": "iPhone 5C",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 44.99
      },
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "earpiece-repair",
        "price": 34.99
      },
      {
        "repair": "front-camera-repair",
        "price": 44.99
      },
      {
        "repair": "home-button",
        "price": 34.99
      },
      {
        "repair": "power-button",
        "price": 59.99
      },
      {
        "repair": "screen-replacement",
        "price": 44.99
      },
      {
        "repair": "speaker-repair",
        "price": 44.99
      }
    ]
  },
  {
    "slug": "iphone-5s",
    "name": "iPhone 5S",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 49.99
      },
      {
        "repair": "battery-replacement",
        "price": 44.99
      },
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "earpiece-repair",
        "price": 34.99
      },
      {
        "repair": "front-camera-repair",
        "price": 44.99
      },
      {
        "repair": "home-button",
        "price": 34.99
      },
      {
        "repair": "power-button",
        "price": 59.99
      },
      {
        "repair": "screen-replacement",
        "price": 44.99
      },
      {
        "repair": "speaker-repair",
        "price": 44.99
      }
    ]
  },
  {
    "slug": "iphone-6",
    "name": "iPhone 6",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 49.99
      },
      {
        "repair": "back-housing-replacement",
        "price": 99.99
      },
      {
        "repair": "battery-replacement",
        "price": 49.99
      },
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "earpiece-repair",
        "price": 39.99
      },
      {
        "repair": "front-camera-repair",
        "price": 49.99
      },
      {
        "repair": "home-button",
        "price": 39.99
      },
      {
        "repair": "lcd-shield-replacement",
        "price": 44.99
      },
      {
        "repair": "power-button",
        "price": 59.99
      },
      {
        "repair": "screen-replacement",
        "price": 69.99
      },
      {
        "repair": "speaker-repair",
        "price": 49.99
      },
      {
        "repair": "volume-button",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "iphone-6-plus",
    "name": "iPhone 6 Plus",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 49.99
      },
      {
        "repair": "back-housing-replacement",
        "price": 99.99
      },
      {
        "repair": "battery-replacement",
        "price": 54.99
      },
      {
        "repair": "charging-port-repair",
        "price": 49.99
      },
      {
        "repair": "earpiece-repair",
        "price": 39.99
      },
      {
        "repair": "front-camera-repair",
        "price": 49.99
      },
      {
        "repair": "home-button",
        "price": 34.99
      },
      {
        "repair": "lcd-shield-replacement",
        "price": 44.99
      },
      {
        "repair": "power-button",
        "price": 69.99
      },
      {
        "repair": "screen-replacement",
        "price": 74.99
      },
      {
        "repair": "speaker-repair",
        "price": 49.99
      },
      {
        "repair": "volume-button",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "iphone-6s",
    "name": "iPhone 6S",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 69.99
      },
      {
        "repair": "back-housing-replacement",
        "price": 99.99
      },
      {
        "repair": "battery-replacement",
        "price": 49.99
      },
      {
        "repair": "charging-port-repair",
        "price": 59.99
      },
      {
        "repair": "earpiece-repair",
        "price": 44.99
      },
      {
        "repair": "front-camera-repair",
        "price": 49.99
      },
      {
        "repair": "home-button",
        "price": 44.99
      },
      {
        "repair": "lcd-shield-replacement",
        "price": 49.99
      },
      {
        "repair": "power-button",
        "price": 59.99
      },
      {
        "repair": "screen-replacement",
        "price": 74.99
      },
      {
        "repair": "speaker-repair",
        "price": 49.99
      },
      {
        "repair": "volume-button",
        "price": 69.99
      }
    ]
  },
  {
    "slug": "iphone-6s-plus",
    "name": "iPhone 6S Plus",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "back-camera-repair",
        "price": 69
      },
      {
        "repair": "back-housing-replacement",
        "price": 99.99
      },
      {
        "repair": "battery-replacement",
        "price": 55
      },
      {
        "repair": "charging-port-repair",
        "price": 59
      },
      {
        "repair": "earpiece-repair",
        "price": 45
      },
      {
        "repair": "front-camera-repair",
        "price": 49
      },
      {
        "repair": "home-button",
        "price": 44.99
      },
      {
        "repair": "lcd-shield-replacement",
        "price": 69
      },
      {
        "repair": "power-button",
        "price": 59
      },
      {
        "repair": "screen-replacement",
        "price": 84.99
      },
      {
        "repair": "speaker-repair",
        "price": 49
      },
      {
        "repair": "volume-button",
        "price": 69
      }
    ]
  },
  {
    "slug": "iphone-7",
    "name": "iPhone 7",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 84.99
      }
    ]
  },
  {
    "slug": "iphone-7-plus",
    "name": "iPhone 7 Plus",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 99.99
      }
    ]
  },
  {
    "slug": "iphone-8",
    "name": "iPhone 8",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 89.99
      }
    ]
  },
  {
    "slug": "iphone-8-plus",
    "name": "iPhone 8 Plus",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 109.99
      }
    ]
  },
  {
    "slug": "iphone-se-1st-gen",
    "name": "iPhone SE (1st gen)",
    "brandSlug": "apple-iphone",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 49.99
      }
    ]
  },
  {
    "slug": "lg-g2",
    "name": "LG G2",
    "brandSlug": "lg",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "lg-g3",
    "name": "LG G3",
    "brandSlug": "lg",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "lg-g4",
    "name": "LG G4",
    "brandSlug": "lg",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "lg-g5",
    "name": "LG G5",
    "brandSlug": "lg",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 120
      }
    ]
  },
  {
    "slug": "lg-g6",
    "name": "LG G6",
    "brandSlug": "lg",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 140
      }
    ]
  },
  {
    "slug": "moto-g-1st-gen",
    "name": "Moto G (1st gen)",
    "brandSlug": "motorola",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "moto-g-2nd-gen",
    "name": "Moto G (2nd gen)",
    "brandSlug": "motorola",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "moto-g-3rd-gen",
    "name": "Moto G (3rd gen)",
    "brandSlug": "motorola",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "moto-x-play",
    "name": "Moto X Play",
    "brandSlug": "motorola",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 110
      }
    ]
  },
  {
    "slug": "nexus-4",
    "name": "Nexus 4",
    "brandSlug": "google-nexus",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 100
      }
    ]
  },
  {
    "slug": "nexus-5",
    "name": "Nexus 5",
    "brandSlug": "google-nexus",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 100
      }
    ]
  },
  {
    "slug": "nexus-5x",
    "name": "Nexus 5X",
    "brandSlug": "google-nexus",
    "repairs": [
      {
        "repair": "screen-replacement",
        "price": 120,
        "needsVerification": true
      }
    ]
  }
] as const;

export const ARCHIVED_FLAT_SERVICES = [
  {
    "slug": "dc-charging-port-replacement",
    "name": "DC / charging port replacement",
    "price": 109.99,
    "priceTo": null,
    "description": "A worn or broken laptop charging socket replaced, including stripping the machine down and testing charging under load before reassembly."
  },
  {
    "slug": "diagnostics",
    "name": "Diagnostics",
    "price": 24.99,
    "priceTo": null,
    "description": "We test the machine and tell you exactly what has failed and what it takes to fix, before you commit to any repair."
  },
  {
    "slug": "hardware-installation",
    "name": "Hardware installation, each",
    "price": 24.99,
    "priceTo": null,
    "description": "Any single component fitted, covering the labour to install memory, a drive or a card. The part itself is extra."
  },
  {
    "slug": "laptop-keyboard-replacement",
    "name": "Laptop keyboard replacement",
    "price": 69.99,
    "priceTo": 149.99,
    "description": "A laptop keyboard replaced. The spread is real: on some laptops the keyboard is a separate part, and on others it is riveted into the whole top case, which is the larger job."
  },
  {
    "slug": "laptop-screen-replacement",
    "name": "Laptop screen replacement",
    "price": 120,
    "priceTo": null,
    "description": "A cracked or failed laptop screen replaced, including the panel and the labour. The figure depends on the size and resolution of the panel your model takes."
  },
  {
    "slug": "password-reset",
    "name": "Password reset",
    "price": 49.99,
    "priceTo": null,
    "description": "A locked Windows account reset, so you get back into the machine without losing the files on it."
  },
  {
    "slug": "program-installation",
    "name": "Program installation, each",
    "price": 24.99,
    "priceTo": null,
    "description": "Any single program installed and set up, including licensing and first-run configuration."
  },
  {
    "slug": "tune-up",
    "name": "Desktop clean-up and tune-up",
    "price": 79.99,
    "priceTo": null,
    "description": "A full clean-up and tune-up, covering both the software slowing the machine down and the dust cooking it from the inside."
  },
  {
    "slug": "virus-removal",
    "name": "Virus removal",
    "price": 34.99,
    "priceTo": null,
    "description": "Malware, adware and browser hijackers removed, with security software left in place so the machine does not pick the same thing up again."
  },
  {
    "slug": "windows-installation",
    "name": "Windows installation",
    "price": 44.99,
    "priceTo": null,
    "description": "A clean Windows installation including Microsoft Office and security software, with all drivers set up so the machine works out of the box."
  }
] as const;

export const ARCHIVED_UNLOCKING = [
  {
    "carrier": "Any Canadian carrier",
    "price": 35
  }
] as const;
