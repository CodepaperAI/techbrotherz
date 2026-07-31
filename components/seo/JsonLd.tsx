import type { JsonLdNode } from "@/lib/seo/schema";

/**
 * Renders the page's structured data.
 *
 * One script tag per page containing a single @graph, not one tag per schema
 * type. Google resolves the graph as one connected description of the page and
 * the business, and a single tag is easier to validate by eye.
 *
 * Escaping happens here and nowhere else.
 */
export function JsonLd({ graph }: { graph: JsonLdNode }) {
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // Serialised by JSON.stringify with "<" escaped above, so it cannot break
      // out of the script element.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
