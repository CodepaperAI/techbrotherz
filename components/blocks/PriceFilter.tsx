"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Search over the price list.
 *
 * Every price row is server-rendered and stays in the DOM. This only sets a
 * data attribute that CSS uses to hide non-matching rows, so a crawler, a
 * reader with JavaScript disabled, and anyone who lands here from an AI
 * assistant all see the complete list of prices. Nothing is paginated, lazily
 * loaded or removed.
 */
export function PriceFilter({
  totalRows,
  label = "prices",
}: {
  totalRows: number;
  /** What the rows are, so the announcement reads correctly. */
  label?: string;
}) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(totalRows);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const needle = query.trim().toLowerCase();
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-price-row]"));

    let shown = 0;

    for (const row of rows) {
      const haystack = row.dataset.search ?? "";
      const match = needle === "" || haystack.includes(needle);
      row.dataset.hidden = match ? "false" : "true";
      if (match) shown += 1;
    }

    // A model whose rows are all hidden hides its whole card, otherwise the
    // page fills up with empty tables.
    for (const group of Array.from(document.querySelectorAll<HTMLElement>("[data-price-group]"))) {
      const anyVisible = group.querySelector('[data-price-row][data-hidden="false"]');
      group.dataset.hidden = anyVisible ? "false" : "true";
    }

    for (const brand of Array.from(document.querySelectorAll<HTMLElement>("[data-brand-group]"))) {
      const anyVisible = brand.querySelector('[data-price-group][data-hidden="false"]');
      brand.dataset.hidden = anyVisible ? "false" : "true";
    }

    setVisible(shown);
  }, [query]);

  return (
    <div className="border-tb-border bg-tb-white rounded-card border p-4 md:p-5">
      <label htmlFor="price-search" className="type-eyebrow text-tb-muted block">
        Search the price list
      </label>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className="text-tb-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            ref={inputRef}
            id="price-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try iPhone 8, battery, or Galaxy S7"
            autoComplete="off"
            className="border-tb-border rounded-input text-tb-text placeholder:text-tb-muted focus-visible:border-tb-green-deep h-12 w-full border bg-transparent pr-4 pl-10 outline-none"
          />
        </div>

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="border-tb-border text-tb-text rounded-chip inline-flex h-12 items-center gap-1.5 border px-4 font-medium"
          >
            <X aria-hidden="true" size={16} strokeWidth={1.5} />
            Clear
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="type-caption text-tb-muted mt-3">
        {query
          ? `Showing ${visible} of ${totalRows} ${label}.`
          : `Showing all ${totalRows} ${label}. Every one is on this page.`}
      </p>
    </div>
  );
}
