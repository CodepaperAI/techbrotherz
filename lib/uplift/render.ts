/**
 * Turning the `content` field Uplift returns into HTML this site will render.
 *
 * Two problems, solved in one place.
 *
 * 1. The format is not guaranteed. Uplift's own documentation says only "full
 *    blog content", so the field arrives as HTML from some editors and as
 *    Markdown from others. `toHtml()` detects which and handles both, rather
 *    than the site rendering raw asterisks on the day the editor changes.
 *
 * 2. It is third-party content going through dangerouslySetInnerHTML. It comes
 *    from an authenticated API over TLS and is rendered at build time, so this
 *    is defence in depth rather than the only thing standing between the site
 *    and a script tag. It is still not optional: an allowlist that runs on
 *    every article is what makes that render call safe to write at all.
 *
 * No dependency for either job. A Markdown parser and a DOM sanitiser are two
 * packages, and the second pulls jsdom onto the server, which is a large amount
 * of surface for a page that renders a handful of articles.
 */

/* ------------------------------------------------------------------ allowlist */

/** Tags kept, with the attributes each may carry. */
const ALLOWED: Record<string, string[]> = {
  p: [],
  br: [],
  hr: [],
  h2: ["id"],
  h3: ["id"],
  h4: ["id"],
  h5: ["id"],
  h6: ["id"],
  strong: [],
  b: [],
  em: [],
  i: [],
  u: [],
  s: [],
  del: [],
  sub: [],
  sup: [],
  code: [],
  pre: [],
  blockquote: ["cite"],
  ul: [],
  ol: ["start"],
  li: [],
  dl: [],
  dt: [],
  dd: [],
  a: ["href", "title", "rel", "target"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  figure: [],
  figcaption: [],
  table: [],
  caption: [],
  thead: [],
  tbody: [],
  tfoot: [],
  tr: [],
  th: ["scope", "colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  span: [],
  div: [],
};

/** Void elements, which never carry a closing tag. */
const VOID = new Set(["br", "hr", "img"]);

/**
 * Tags whose content goes with them. Unwrapping a <script> would leave its
 * source as visible text on the page, which is the wrong kind of safe.
 */
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "form"]);

/**
 * The page already has exactly one H1, composed by PageShell. An H1 inside the
 * body would break CLAUDE.md Section 8.1, so it is demoted rather than dropped:
 * the author meant it as a section heading.
 */
const DEMOTE: Record<string, string> = { h1: "h2" };

/** Placeholder for a code span while the inline marks are applied around it. */
const CODE_MARK = "\u0000CODE";

function escapeText(value: string): string {
  return value
    .replace(/&(?![a-zA-Z#][a-zA-Z0-9]{0,30};)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Only http, https, mailto, tel and relative URLs. No javascript:, no data:. */
function safeUrl(raw: string, { allowData = false } = {}): string | null {
  // Control characters and whitespace come out first, not just off the ends:
  // "java	script:alert(1)" is the classic way past a filter that only
  // looks at a trimmed prefix.
  const value = raw.replace(/[\u0000-\u0020\u007F]/g, "");
  if (value === "") return null;
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (allowData && /^data:image\/(png|jpe?g|gif|webp|avif);base64,/i.test(value)) return value;
  // Relative, root-relative and fragment links.
  if (/^[/#?]/.test(value)) return value;
  // A scheme we have not named is refused rather than guessed at.
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  return value;
}

const SITE_HOSTS = new Set(["techbrotherz.com", "www.techbrotherz.com"]);

/** Whether this href leaves the site, which decides rel and target. */
function isExternal(href: string): boolean {
  if (!/^https?:/i.test(href)) return false;
  try {
    return !SITE_HOSTS.has(new URL(href).hostname.toLowerCase());
  } catch {
    return true;
  }
}

interface Attr {
  name: string;
  value: string;
}

function parseAttrs(source: string): Attr[] {
  const attrs: Attr[] = [];
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    const name = match[1];
    if (!name) continue;
    attrs.push({ name: name.toLowerCase(), value: match[2] ?? match[3] ?? match[4] ?? "" });
  }

  return attrs;
}

/**
 * Narrows an allowed tag's attributes to the allowlist, with the URL and link
 * safety rules applied. Returns the serialised attribute string.
 */
function renderAttrs(tag: string, attrs: Attr[]): string {
  const allowed = ALLOWED[tag] ?? [];
  const kept: string[] = [];
  let href: string | null = null;

  for (const attr of attrs) {
    if (!allowed.includes(attr.name)) continue;

    // rel and target are decided here, not taken from the payload.
    if (tag === "a" && (attr.name === "rel" || attr.name === "target")) continue;

    if (attr.name === "href" || attr.name === "src") {
      const url = safeUrl(attr.value, { allowData: attr.name === "src" });
      if (!url) continue;
      if (attr.name === "href") href = url;
      kept.push(`${attr.name}="${escapeAttr(url)}"`);
      continue;
    }

    kept.push(`${attr.name}="${escapeAttr(attr.value)}"`);
  }

  if (tag === "a" && href && isExternal(href)) {
    kept.push('rel="noopener nofollow"', 'target="_blank"');
  }

  // Every image inside article prose is below the fold by definition.
  if (tag === "img" && !attrs.some((attr) => attr.name === "loading")) {
    kept.push('loading="lazy"');
  }

  return kept.length > 0 ? ` ${kept.join(" ")}` : "";
}

/**
 * The sanitiser. Walks the string once, keeping allowed tags, unwrapping
 * unknown ones (their text survives, their markup does not) and dropping the
 * few whose content has to go with them.
 */
export function sanitizeHtml(input: string): string {
  let out = "";
  let index = 0;
  /** Non-null while inside a script or style: everything is swallowed. */
  let swallowing: string | null = null;
  /** Open allowed tags, so unbalanced input cannot leak an unclosed element. */
  const open: string[] = [];

  const pattern = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!?\/?[a-zA-Z][^>]*>?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    const text = input.slice(index, match.index);
    index = match.index + match[0].length;

    if (!swallowing) out += escapeText(text);

    const token = match[0];
    if (token.startsWith("<!")) continue; // Comments, doctype, CDATA.

    const closing = token.startsWith("</");
    const nameMatch = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(token);
    if (!nameMatch) continue;

    const raw = (nameMatch[1] ?? "").toLowerCase();
    if (!raw) continue;
    const tag = DEMOTE[raw] ?? raw;

    if (swallowing) {
      if (closing && raw === swallowing) swallowing = null;
      continue;
    }

    if (DROP_WITH_CONTENT.has(raw)) {
      if (!closing && !token.endsWith("/>")) swallowing = raw;
      continue;
    }

    if (!(tag in ALLOWED)) continue; // Unwrap: the tag goes, its text stays.

    if (closing) {
      const at = open.lastIndexOf(tag);
      if (at === -1) continue; // A close with no matching open. Drop it.
      // Close anything still open inside it, innermost first.
      while (open.length > at) out += `</${open.pop()}>`;
      continue;
    }

    const attrsSource = token.replace(/^<\s*[a-zA-Z][a-zA-Z0-9-]*/, "").replace(/\/?>?$/, "");
    const attrs = parseAttrs(attrsSource);

    if (VOID.has(tag)) {
      // An <img> with no usable src is an empty frame. Drop it.
      if (
        tag === "img" &&
        !attrs.some((attr) => attr.name === "src" && safeUrl(attr.value, { allowData: true }))
      ) {
        continue;
      }
      out += `<${tag}${renderAttrs(tag, attrs)} />`;
      continue;
    }

    out += `<${tag}${renderAttrs(tag, attrs)}>`;
    open.push(tag);
  }

  if (!swallowing) out += escapeText(input.slice(index));
  while (open.length > 0) out += `</${open.pop()}>`;

  return out.trim();
}

/* ------------------------------------------------------------------ markdown */

function inline(text: string): string {
  let out = escapeText(text);

  // Code spans first: nothing inside them is markup.
  const codes: string[] = [];
  out = out.replace(/`([^`]+)`/g, (_whole, code: string) => {
    codes.push(code);
    return `${CODE_MARK}${codes.length - 1}\u0000`;
  });

  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_whole, alt: string, src: string, title?: string) => {
      const url = safeUrl(src, { allowData: true });
      if (!url) return "";
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      return `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}"${titleAttr} loading="lazy" />`;
    },
  );

  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_whole, label: string, href: string, title?: string) => {
      const url = safeUrl(href);
      if (!url) return label;
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      const rel = isExternal(url) ? ' rel="noopener nofollow" target="_blank"' : "";
      return `<a href="${escapeAttr(url)}"${titleAttr}${rel}>${label}</a>`;
    },
  );

  out = out
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/(^|[^_\w])__([^_\n]+)__(?!\w)/g, "$1<strong>$2</strong>")
    .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return out.replace(
    new RegExp(`${CODE_MARK}(\\d+)\\u0000`, "g"),
    (_whole, i: string) => `<code>${codes[Number(i)]}</code>`,
  );
}

/**
 * A deliberately small Markdown subset: headings, paragraphs, lists, tables,
 * blockquotes, fenced code, rules and the usual inline marks. It covers what a
 * blog editor emits. Anything past that arrives as plain paragraphs, which is
 * a legible failure rather than a broken page.
 */
export function markdownToHtml(source: string): string {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  const paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length === 0) return;
    out.push(`<p>${inline(paragraph.join(" ").trim())}</p>`);
    paragraph.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.trim() === "") {
      flush();
      i += 1;
      continue;
    }

    // Fenced code.
    const fence = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      flush();
      const marker = (fence[1] ?? "`").charAt(0);
      const closer = new RegExp(`^\\s*[${marker}]{3,}\\s*$`);
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !closer.test(lines[i] ?? "")) {
        body.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeText(body.join("\n"))}</code></pre>`);
      continue;
    }

    // ATX headings. H1 becomes H2: the page's own H1 is the article title.
    const heading = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      flush();
      const level = Math.min(6, Math.max(2, (heading[1] ?? "##").length));
      out.push(`<h${level}>${inline(heading[2] ?? "")}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^\s{0,3}([-*_])\s*(\1\s*){2,}$/.test(line)) {
      flush();
      out.push("<hr />");
      i += 1;
      continue;
    }

    // Blockquote.
    if (/^\s{0,3}>/.test(line)) {
      flush();
      const body: string[] = [];
      while (i < lines.length && /^\s{0,3}>/.test(lines[i] ?? "")) {
        body.push((lines[i] ?? "").replace(/^\s{0,3}>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${markdownToHtml(body.join("\n"))}</blockquote>`);
      continue;
    }

    // GFM table: a header row, a delimiter row, then body rows.
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1] ?? "")
    ) {
      flush();
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim());

      const columns = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").includes("|") && (lines[i] ?? "").trim() !== "") {
        rows.push(cells(lines[i] ?? ""));
        i += 1;
      }

      const head = columns.map((column) => `<th scope="col">${inline(column)}</th>`).join("");
      const body = rows
        .map((row) => {
          const first = `<th scope="row">${inline(row[0] ?? "")}</th>`;
          const rest = row
            .slice(1)
            .map((cell) => `<td>${inline(cell)}</td>`)
            .join("");
          return `<tr>${first}${rest}</tr>`;
        })
        .join("");

      out.push(`<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`);
      continue;
    }

    // Lists, one level, which is what article prose actually uses.
    const bullet = /^\s{0,3}[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s{0,3}\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flush();
      const ordered = Boolean(numbered);
      const items: string[] = [];

      while (i < lines.length) {
        const current = lines[i] ?? "";
        const item = ordered
          ? /^\s{0,3}\d+[.)]\s+(.*)$/.exec(current)
          : /^\s{0,3}[-*+]\s+(.*)$/.exec(current);

        if (item) {
          items.push(item[1] ?? "");
          i += 1;
          continue;
        }
        // A wrapped continuation line belongs to the item above it.
        if (/^\s{2,}\S/.test(current) && items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1] ?? ""} ${current.trim()}`;
          i += 1;
          continue;
        }
        break;
      }

      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    paragraph.push(line.trim());
    i += 1;
  }

  flush();
  return out.join("\n");
}

/** Whether this looks like HTML rather than Markdown. */
function looksLikeHtml(source: string): boolean {
  return /<(p|div|h[1-6]|ul|ol|li|table|section|article|figure|blockquote|pre|img|br)\b[^>]*>/i.test(
    source,
  );
}

/**
 * The one entry point. Markdown is converted first, then everything goes
 * through the sanitiser, so a Markdown document containing raw HTML is
 * filtered on exactly the same allowlist as an HTML one.
 */
export function toHtml(source: string | null | undefined): string {
  if (!source) return "";
  const trimmed = source.trim();
  if (trimmed === "") return "";
  const sanitised = sanitizeHtml(looksLikeHtml(trimmed) ? trimmed : markdownToHtml(trimmed));
  return wrapTables(scopeTableHeaders(sanitised));
}

/**
 * Adds the missing `scope` to table headers.
 *
 * CLAUDE.md Sections 8.3 and 8.7 require real table markup with scoped headers
 * wherever the content is tabular, and the CMS emits bare `<th>` on most of its
 * tables: 30 of 142 headers carried a scope when this was written. A header
 * cell without one is ambiguous to a screen reader, which reads the whole
 * comparison table as an undifferentiated grid.
 *
 * Derived, not guessed. A `<th>` in the head row is a column header and a
 * `<th>` opening a body row is a row header, which is what those positions
 * mean. Anything the CMS already scoped is left exactly as it is.
 *
 * Safe to do with a regex because the input is this module's own output.
 */
function scopeTableHeaders(html: string): string {
  const addScope = (cells: string, scope: "col" | "row", firstOnly = false): string => {
    let done = false;
    return cells.replace(/<th\b([^>]*)>/gi, (whole, attrs: string) => {
      if (done || /\bscope\s*=/i.test(attrs)) return whole;
      if (firstOnly) done = true;
      return `<th${attrs} scope="${scope}">`;
    });
  };

  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    let out = table.replace(/<thead\b[\s\S]*?<\/thead>/gi, (head) => addScope(head, "col"));

    // A table with no <thead> whose first row is all header cells.
    if (!/<thead/i.test(out)) {
      out = out.replace(/<tr\b[\s\S]*?<\/tr>/i, (row) => addScope(row, "col"));
    }

    return out.replace(/<tbody\b[\s\S]*?<\/tbody>/gi, (body) =>
      body.replace(/<tr\b[\s\S]*?<\/tr>/gi, (row) => addScope(row, "row", true)),
    );
  });
}

/**
 * Puts every table in its own horizontal scroll container.
 *
 * A comparison table is a required shape on this site (CLAUDE.md Section 8.4)
 * and it is also the one piece of article content wide enough to scroll the
 * page body sideways on a phone, which is the responsive rule the whole site
 * holds to. Wrapping here rather than in CSS keeps `display: table` intact,
 * so the columns still size themselves.
 *
 * Safe to do with a regex because the input is this module's own output: the
 * sanitiser balances every tag it emits and never nests a table in a table.
 */
function wrapTables(html: string): string {
  return html.replace(
    /<table\b[\s\S]*?<\/table>/gi,
    (table) => `<div class="table-scroll">${table}</div>`,
  );
}

/** Visible text, for word counts, excerpts and the reading-time estimate. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
