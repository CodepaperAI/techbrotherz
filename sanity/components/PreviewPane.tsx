"use client";

import { Box, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { useClient, type SanityDocument } from "sanity";

import { apiVersion } from "../env";
import { resolvePreviewPath, type PreviewableDoc } from "../lib/previewUrl";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PREVIEW_SECRET = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ?? "";

/**
 * Resolves the parts of the address that live on referenced documents: the
 * brand slug for a device model, and the parent hub slug for a repair-type
 * page. Done in one query rather than reading the reference from the form.
 */
const PATH_QUERY = `*[_id in [$id, "drafts." + $id]] | order(_updatedAt desc)[0]{
  _type,
  "slug": slug.current,
  "brandSlug": brand->slug.current,
  "parentServiceSlug": parentService->slug.current,
  kind
}`;

export interface PreviewPaneProps {
  document: { displayed: SanityDocument };
}

/**
 * Split-pane live preview of the draft.
 *
 * Written by hand rather than pulling in a plugin, so there is one less package
 * to keep in step with the Sanity version.
 */
export function PreviewPane({ document: doc }: PreviewPaneProps) {
  const client = useClient({ apiVersion });
  const displayed = doc.displayed;

  const baseId = (displayed?._id ?? "").replace(/^drafts\./, "");
  const updatedAt = displayed?._updatedAt;

  const [resolved, setResolved] = useState<PreviewableDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!baseId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    client
      .fetch<PreviewableDoc | null>(PATH_QUERY, { id: baseId })
      .then((result) => {
        if (!cancelled) setResolved(result);
      })
      .catch(() => {
        if (!cancelled) setResolved(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // _updatedAt changes on every save, which is exactly when the path may change.
  }, [client, baseId, updatedAt]);

  const path = useMemo(() => (resolved ? resolvePreviewPath(resolved) : null), [resolved]);

  const url = useMemo(() => {
    if (!path) return null;
    const target = new URL("/api/draft-mode/enable", SITE_ORIGIN);
    target.searchParams.set("secret", PREVIEW_SECRET);
    target.searchParams.set("redirect", path);
    return target.toString();
  }, [path]);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="fill" padding={5}>
        <Spinner muted />
      </Flex>
    );
  }

  if (!url) {
    return (
      <Flex align="center" justify="center" padding={5} height="fill">
        <Card padding={4} radius={3} tone="caution">
          <Stack space={3}>
            <Text weight="semibold">Nothing to preview yet</Text>
            <Text size={1}>
              Save the document with a web address first. A device model also needs a brand, and a
              repair page needs its parent service.
            </Text>
          </Stack>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom tone="transparent">
        <Text size={0} muted>
          Previewing {path}
        </Text>
      </Card>
      <Box flex={1}>
        <iframe
          key={url}
          src={url}
          title="Live preview of this page"
          style={{ width: "100%", height: "100%", border: 0 }}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </Box>
    </Flex>
  );
}
