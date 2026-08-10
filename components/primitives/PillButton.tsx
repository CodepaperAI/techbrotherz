import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PillButtonVariant = "primary" | "ghost" | "dark" | "ghostOnDark";
export type PillButtonSize = "md" | "sm";

interface PillButtonBaseProps {
  children: ReactNode;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  /** Trailing arrow. Turn off for a phone number or a plain action. */
  withArrow?: boolean;
  className?: string;
}

type PillButtonAsLink = PillButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type PillButtonAsButton = PillButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type PillButtonProps = PillButtonAsLink | PillButtonAsButton;

/**
 * Contrast rule, enforced here so it cannot be broken by a caller: the label on
 * a green fill is --tb-ink, never white. DESIGN.md Section 2.1.
 */
const VARIANT_STYLES: Record<PillButtonVariant, string> = {
  primary: "bg-tb-green text-tb-ink hover:bg-tb-green-press",
  ghost: "border border-tb-ink bg-transparent text-tb-ink hover:bg-tb-ink hover:text-tb-white",
  dark: "bg-tb-black text-tb-on-black hover:bg-tb-black-2",
  ghostOnDark:
    "border border-tb-rule-dark bg-transparent text-tb-on-black hover:border-tb-green hover:text-tb-green",
};

const SIZE_STYLES: Record<PillButtonSize, string> = {
  md: "h-12 px-7 md:h-[3.25rem]",
  sm: "h-10 px-5",
};

/*
 * Phase 8: rectangles at 6px, not 999px pills.
 *
 * The name stays PillButton because renaming it would touch every call site in
 * the app for no behavioural gain, and Phase 8's rule is that markup may change
 * but content may not. The shape is the point: a pill reads soft and modern, a
 * rectangle reads direct and commercial, which is what a walk-in shop is.
 *
 * Labels are uppercase and letterspaced via .type-btn, applied in CSS, so the
 * rendered text content is unchanged from the baseline.
 */
const BASE =
  "type-btn rounded-btn inline-flex items-center justify-center gap-2 " +
  "transition-colors duration-[--duration-hover] ease-[--ease-out] " +
  "disabled:pointer-events-none disabled:opacity-50";

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * The one button in the system. A 6px rectangle with an uppercase letterspaced
 * label. Renders a Next Link for internal routes, an anchor for tel:, mailto:
 * and external URLs, and a button when no href is given.
 *
 * `withArrow` now defaults to false. Phase 8 keeps the arrow for the hero call
 * to action only; on every other button it was decoration that made a direct
 * label read as a soft one. DESIGN.md Section 6.5.
 */
export function PillButton(props: PillButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    withArrow = false,
    className,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANT_STYLES[variant], SIZE_STYLES[size], "group", className);

  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="transition-transform duration-[--duration-hover] ease-[--ease-out] group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    if (isInternal(href)) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {content}
        </Link>
      );
    }

    const isExternalHttp = href.startsWith("http");

    return (
      <a
        href={href}
        className={classes}
        {...(isExternalHttp ? { rel: "noopener", target: "_blank" } : {})}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
