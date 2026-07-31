"use client";

/*
 * A Sanity document action is a React component in everything but its name:
 * Sanity renders it and it may call hooks. The lint rule only recognises
 * components by an uppercase first letter, and Sanity's own API requires this
 * naming, so the rule is disabled for this file rather than worked around.
 */
/* eslint-disable react-hooks/rules-of-hooks */

import { AddIcon } from "@sanity/icons";
import { useState } from "react";
import { useToast } from "@sanity/ui";
import { useClient, type DocumentActionComponent } from "sanity";

import { apiVersion } from "../env";

interface RepairTypeRow {
  _id: string;
  name: string;
  slug: string;
}

/**
 * "Add standard repairs" on a device model.
 *
 * Creates a price row for every repair type that applies to this kind of
 * device, skipping any that already exist. This is the single biggest
 * time-saver for the shop owner: adding a new phone becomes picking a brand and
 * typing prices, rather than creating a dozen documents by hand.
 *
 * New rows are created as "Quote in person" rather than genuinely blank. A
 * blank row would fail validation the moment it was created, and an unpriced
 * row has to show "Call for quote" on the site anyway. The owner replaces the
 * toggle with a number as prices are confirmed.
 */
export const addStandardRepairsAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [running, setRunning] = useState(false);

  const doc = (props.draft ?? props.published) as
    { _id?: string; name?: string; deviceType?: string; slug?: { current?: string } } | undefined;

  const modelId = props.id;
  const deviceType = doc?.deviceType;
  const modelSlug = doc?.slug?.current;

  return {
    label: running ? "Adding..." : "Add standard repairs",
    icon: AddIcon,
    disabled: !deviceType || !modelSlug || running,
    title: !deviceType
      ? "Choose a kind of device first"
      : !modelSlug
        ? "Give the model a web address first"
        : `Create price rows for every repair that applies to a ${deviceType}`,

    onHandle: async () => {
      setRunning(true);

      try {
        const repairTypes = await client.fetch<RepairTypeRow[]>(
          `*[_type == "repairType" && $deviceType in appliesTo] | order(order asc){
            _id, name, "slug": slug.current
          }`,
          { deviceType },
        );

        if (repairTypes.length === 0) {
          toast.push({
            status: "warning",
            title: "No matching repair types",
            description: `No repair type is set to apply to a ${deviceType}. Add one under Catalogue, Repair types.`,
          });
          return;
        }

        const existing = await client.fetch<string[]>(
          `*[_type == "priceEntry" && model._ref == $modelId].repairType._ref`,
          { modelId },
        );
        const already = new Set(existing);

        const toCreate = repairTypes.filter((repair) => !already.has(repair._id));

        if (toCreate.length === 0) {
          toast.push({
            status: "info",
            title: "Nothing to add",
            description: `${doc?.name ?? "This model"} already has a row for every repair that applies to it.`,
          });
          return;
        }

        const transaction = client.transaction();
        for (const repair of toCreate) {
          transaction.createIfNotExists({
            _id: `price.${modelSlug}.${repair.slug}`,
            _type: "priceEntry",
            model: { _type: "reference", _ref: modelId },
            repairType: { _type: "reference", _ref: repair._id },
            quoteOnly: true,
            inStock: true,
          });
        }
        await transaction.commit();

        toast.push({
          status: "success",
          title: `Added ${toCreate.length} repair${toCreate.length === 1 ? "" : "s"}`,
          description: `${toCreate.map((repair) => repair.name).join(", ")}. Each is set to "Call for quote" until you type a price.`,
        });
      } catch (error) {
        toast.push({
          status: "error",
          title: "Could not add the repairs",
          description: error instanceof Error ? error.message : "Unknown error.",
        });
      } finally {
        setRunning(false);
        props.onComplete();
      }
    },
  };
};
