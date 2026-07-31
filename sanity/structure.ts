import {
  BookIcon,
  CogIcon,
  ComposeIcon,
  CreditCardIcon,
  MobileDeviceIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  HelpCircleIcon,
  LinkIcon,
  LockIcon,
  MenuIcon,
  PinIcon,
  StarIcon,
  TagIcon,
  UserIcon,
  WarningOutlineIcon,
  WrenchIcon,
} from "@sanity/icons";
import type { DefaultDocumentNodeResolver, StructureResolver } from "sanity/structure";

import { PreviewPane } from "./components/PreviewPane";

/** Types that open with a live preview alongside the form. */
const PREVIEWABLE_TYPES = new Set(["deviceModel", "guide", "servicePage", "location"]);

const DEVICE_KINDS = [
  { title: "Phones", value: "phone" },
  { title: "Tablets", value: "tablet" },
  { title: "Laptops", value: "laptop" },
  { title: "Desktops", value: "desktop" },
];

const FAQ_CATEGORIES: [string, string][] = [
  ["pricing", "Pricing and payment"],
  ["warranty", "Warranty"],
  ["turnaround", "Turnaround time"],
  ["walkin", "Walk-in policy"],
  ["parts", "Parts quality"],
  ["data", "Data and privacy"],
  ["unlocking", "Unlocking"],
  ["iphone", "iPhone"],
  ["samsung", "Samsung"],
  ["ipad", "iPad and tablets"],
  ["computer", "Laptops and computers"],
  ["location", "Location and parking"],
  ["business", "Business services"],
];

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (!PREVIEWABLE_TYPES.has(schemaType)) return S.document();

  return S.document().views([
    S.view.form().title("Edit"),
    S.view.component(PreviewPane).title("Preview"),
  ]);
};

/**
 * Studio navigation, grouped so a shop owner can find things instantly.
 *
 * Catalogue is where the owner spends their time, so every list inside it is
 * filtered or grouped rather than being one long alphabetical dump.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("TechBrotherz")
    .items([
      /* ------------------------------------------------------------- Site */
      S.listItem()
        .title("Site")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site")
            .items([
              S.listItem()
                .title("Site settings")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Site settings"),
                ),
              S.listItem()
                .title("Navigation")
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType("navigation")
                    .documentId("navigation")
                    .title("Navigation"),
                ),
              S.listItem()
                .title("Review summary, do not enable until real data")
                .icon(StarIcon)
                .child(
                  S.document()
                    .schemaType("reviewSummary")
                    .documentId("reviewSummary")
                    .title("Review summary"),
                ),
              S.divider(),
              S.documentTypeListItem("redirect").title("Redirects").icon(LinkIcon),
            ]),
        ),

      S.divider(),

      /* -------------------------------------------------------- Catalogue */
      S.listItem()
        .title("Catalogue")
        .icon(MobileDeviceIcon)
        .child(
          S.list()
            .title("Catalogue")
            .items([
              S.documentTypeListItem("brand").title("Brands").icon(TagIcon),

              S.listItem()
                .title("Device models")
                .icon(MobileDeviceIcon)
                .child(
                  S.list()
                    .title("Device models")
                    .items([
                      S.listItem()
                        .title("By brand")
                        .icon(TagIcon)
                        .child(
                          S.documentTypeList("brand")
                            .title("By brand")
                            .child((brandId) =>
                              S.list()
                                .title("Kind of device")
                                .items(
                                  DEVICE_KINDS.map((kind) =>
                                    S.listItem()
                                      .id(kind.value)
                                      .title(kind.title)
                                      .icon(MobileDeviceIcon)
                                      .child(
                                        S.documentList()
                                          .title(kind.title)
                                          .schemaType("deviceModel")
                                          .filter(
                                            '_type == "deviceModel" && brand._ref == $brandId && deviceType == $deviceType',
                                          )
                                          .params({ brandId, deviceType: kind.value })
                                          .defaultOrdering([{ field: "name", direction: "asc" }]),
                                      ),
                                  ),
                                ),
                            ),
                        ),

                      S.divider(),

                      S.listItem()
                        .title("Modern models awaiting prices")
                        .icon(WarningOutlineIcon)
                        .child(
                          S.documentList()
                            .title("Modern models awaiting prices")
                            .schemaType("deviceModel")
                            .filter(
                              '_type == "deviceModel" && published != true && count(*[_type == "priceEntry" && model._ref == ^._id && defined(price)]) == 0',
                            )
                            .defaultOrdering([{ field: "releaseYear", direction: "desc" }]),
                        ),

                      S.listItem()
                        .title("Popular models")
                        .icon(StarIcon)
                        .child(
                          S.documentList()
                            .title("Popular models")
                            .schemaType("deviceModel")
                            .filter('_type == "deviceModel" && popular == true'),
                        ),

                      S.listItem()
                        .title("All models, A to Z")
                        .icon(MobileDeviceIcon)
                        .child(
                          S.documentTypeList("deviceModel")
                            .title("All models")
                            .defaultOrdering([{ field: "name", direction: "asc" }]),
                        ),
                    ]),
                ),

              S.documentTypeListItem("repairType").title("Repair types").icon(WrenchIcon),

              S.listItem()
                .title("Prices")
                .icon(CreditCardIcon)
                .child(
                  S.list()
                    .title("Prices")
                    .items([
                      S.listItem()
                        .title("All prices")
                        .icon(CreditCardIcon)
                        .child(
                          S.documentTypeList("priceEntry")
                            .title("All prices")
                            .defaultOrdering([{ field: "model.name", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("By brand")
                        .icon(TagIcon)
                        .child(
                          S.documentTypeList("brand")
                            .title("Prices by brand")
                            .child((brandId) =>
                              S.documentList()
                                .title("Prices")
                                .schemaType("priceEntry")
                                .filter('_type == "priceEntry" && model->brand._ref == $brandId')
                                .params({ brandId }),
                            ),
                        ),
                      S.divider(),
                      S.listItem()
                        .title("Needs verification")
                        .icon(WarningOutlineIcon)
                        .child(
                          S.documentList()
                            .title("Needs verification")
                            .schemaType("priceEntry")
                            .filter('_type == "priceEntry" && needsVerification == true'),
                        ),
                      S.listItem()
                        .title("Quote only, no price set")
                        .icon(HelpCircleIcon)
                        .child(
                          S.documentList()
                            .title("Quote only")
                            .schemaType("priceEntry")
                            .filter('_type == "priceEntry" && quoteOnly == true'),
                        ),
                      S.listItem()
                        .title("Priced")
                        .icon(CreditCardIcon)
                        .child(
                          S.documentList()
                            .title("Priced")
                            .schemaType("priceEntry")
                            .filter('_type == "priceEntry" && defined(price)')
                            .defaultOrdering([{ field: "price", direction: "desc" }]),
                        ),
                    ]),
                ),

              S.documentTypeListItem("priceGroup").title("Shared price groups").icon(TagIcon),
              S.documentTypeListItem("flatService").title("Shop services").icon(ComposeIcon),
              S.documentTypeListItem("unlockingService").title("Unlocking").icon(LockIcon),
            ]),
        ),

      S.divider(),

      /* ---------------------------------------------------------- Content */
      S.listItem()
        .title("Content")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              S.listItem()
                .title("Questions")
                .icon(HelpCircleIcon)
                .child(
                  S.list()
                    .title("Questions")
                    .items([
                      S.listItem()
                        .title("By category")
                        .icon(HelpCircleIcon)
                        .child(
                          S.list()
                            .title("Category")
                            .items(
                              FAQ_CATEGORIES.map(([value, title]) =>
                                S.listItem()
                                  .id(value)
                                  .title(title)
                                  .icon(HelpCircleIcon)
                                  .child(
                                    S.documentList()
                                      .title(title)
                                      .schemaType("faq")
                                      .filter('_type == "faq" && category == $category')
                                      .params({ category: value })
                                      .defaultOrdering([{ field: "order", direction: "asc" }]),
                                  ),
                              ),
                            ),
                        ),
                      S.listItem()
                        .title("Site-wide questions")
                        .icon(StarIcon)
                        .child(
                          S.documentList()
                            .title("Site-wide questions")
                            .schemaType("faq")
                            .filter('_type == "faq" && featured == true'),
                        ),
                      S.listItem()
                        .title("All questions")
                        .icon(HelpCircleIcon)
                        .child(S.documentTypeList("faq").title("All questions")),
                    ]),
                ),

              S.documentTypeListItem("guide").title("Guides").icon(BookIcon),
              S.documentTypeListItem("author").title("Authors").icon(UserIcon),
              S.documentTypeListItem("servicePage").title("Service pages").icon(DocumentTextIcon),
              S.documentTypeListItem("testimonial").title("Testimonials").icon(StarIcon),
            ]),
        ),

      S.divider(),

      /* -------------------------------------------------------- Locations */
      S.listItem()
        .title("Locations")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Locations")
            .items([
              S.listItem()
                .title("Cities")
                .icon(EarthGlobeIcon)
                .child(
                  S.documentList()
                    .title("Cities")
                    .schemaType("location")
                    .filter('_type == "location" && kind == "city"')
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Calgary neighbourhoods")
                .icon(PinIcon)
                .child(
                  S.documentList()
                    .title("Calgary neighbourhoods")
                    .schemaType("location")
                    .filter('_type == "location" && kind == "neighbourhood"')
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),
    ]);
