import type { ReactNode } from "react";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The social profile icon buttons, driven by SITE.socialLinks so the footer,
 * the contact page and the LocalBusiness sameAs list can never disagree about
 * which profiles exist.
 *
 * All three glyphs are drawn inline: lucide removed its brand icons, and a
 * hand-rolled set keeps the stroke weight consistent with the rest of the
 * site. These are platform icons linking to the store's own profiles, which
 * is ordinary identification, not the manufacturer-endorsement problem
 * Section 8.9 exists for.
 */

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.04.86.13V9.4a6.33 6.33 0 0 0-.86-.05A6.34 6.34 0 1 0 15.86 15V9.01a8.16 8.16 0 0 0 4.77 1.52v-3.45a4.85 4.85 0 0 1-1.04-.39z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const ICONS: Record<string, (size: number) => ReactNode> = {
  TikTok: (size) => <TikTokIcon size={size} />,
  Instagram: (size) => <InstagramIcon size={size} />,
  Facebook: (size) => <FacebookIcon size={size} />,
};

export function SocialLinks({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {SITE.socialLinks.map((social) => (
        <li key={social.url}>
          <a
            href={social.url}
            rel="noopener"
            target="_blank"
            aria-label={`TechBrotherz on ${social.platform}`}
            className={cn(
              "rounded-chip inline-flex size-11 items-center justify-center border transition-colors duration-[180ms] ease-out",
              onDark
                ? "border-tb-border-dark text-tb-white hover:border-tb-green hover:text-tb-green"
                : "border-tb-border text-tb-text hover:border-tb-green-deep hover:text-tb-green-deep",
            )}
          >
            {ICONS[social.platform]?.(20) ?? social.platform.slice(0, 1)}
          </a>
        </li>
      ))}
    </ul>
  );
}
