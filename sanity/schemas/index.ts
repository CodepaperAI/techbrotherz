import type { SchemaTypeDefinition } from "sanity";

import {
  announcementBar,
  geoPoint,
  howToStep,
  processStep,
  richText,
  socialLink,
} from "./objects/misc";
import { openingHours } from "./objects/openingHours";

import { brand, deviceModel, priceGroup, repairType } from "./documents/catalogue";
import { author, guide, servicePage, testimonial } from "./documents/content";
import { faq, location } from "./documents/faqAndLocation";
import { flatService, priceEntry, unlockingService } from "./documents/pricing";
import { navigation, redirect, reviewSummary } from "./documents/siteExtras";
import { siteSettings } from "./documents/siteSettings";

/** Every reusable object type. */
export const objectTypes: SchemaTypeDefinition[] = [
  openingHours,
  geoPoint,
  socialLink,
  announcementBar,
  howToStep,
  processStep,
  richText,
];

/** Every document type. Order here does not affect the Studio, structure.ts does. */
export const documentTypes: SchemaTypeDefinition[] = [
  // Site
  siteSettings,
  navigation,
  reviewSummary,
  redirect,
  // Catalogue
  brand,
  deviceModel,
  repairType,
  priceEntry,
  priceGroup,
  flatService,
  unlockingService,
  // Content
  faq,
  guide,
  author,
  servicePage,
  testimonial,
  // Locations
  location,
];

export const schemaTypes: SchemaTypeDefinition[] = [...objectTypes, ...documentTypes];

/** Types that exist once. The desk structure pins them as single documents. */
export const SINGLETON_TYPES = new Set(["siteSettings", "navigation", "reviewSummary"]);
